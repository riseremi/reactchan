var Datastore = require('nedb');

var postsDB = new Datastore({
	filename: 'databases/posts.db',
	autoload: true
});

var threadsDB = new Datastore({
	filename: 'databases/threads.db',
	autoload: true
});

var maxPostIndex = -1, maxThreadIndex = -1, MAX_BUMP_COUNT = 15, MAX_THREADS = 3,
	AUTO_CLEANUP_TIMEOUT = 1 * 60 * 1000;
var BOARDS = ['dev', 'beta'];

module.exports = {

	init: function () {
		// 3 hour * 60 mins * 60 secs * 1000 ms
		postsDB.persistence.setAutocompactionInterval(1 * 60 * 60 * 1000);
		postsDB.ensureIndex({ fieldName: 'id' , unique: true}, function (err) {});

		// repeat
		threadsDB.persistence.setAutocompactionInterval(1 * 60 * 60 * 1000);
		threadsDB.ensureIndex({ fieldName: 'id' , unique: true}, function (err) {});

		// set max post index
		postsDB.find({}).sort({id: -1}).limit(1).exec(function (err, docs) {
			console.log(docs);
			maxPostIndex = docs[0] ? docs[0].id : 0;
		});

		// set max thread index
		threadsDB.find({}).sort({id: -1}).limit(1).exec(function (err, docs) {
			console.log(docs);
			maxThreadIndex = docs[0] ? docs[0].id : 0;
		});

		// set auto cleanup

		setInterval(() => { this.removeOldThreads(); }, AUTO_CLEANUP_TIMEOUT);
	},

	insertPost: function (post, cb) {
		if(post.text.length < 1) {
			console.error('[ERROR]: Cannot add an empty post');
			return;
		}

		if(post.text.length > 2000) {
			console.error('[ERROR]: Post body is too long');
			return;
		}

		if (maxPostIndex < 0) {
			console.error('[ERROR]: Negative max post id.');
			return;
		}

		post.id = ++maxPostIndex;
		post.timestamp = post.timestamp || new Date().getTime();
		post.text = post.text.trim();
		var sage = post.email === 'sage';
		if (post.firstPost) {
			post.email = 'nöko';
			sage = false;
		}

		threadsDB.findOne({id: post.threadId}, function(err, doc) {
			if (!doc) {
				console.log('DEAD THREAD');
				return;
			}
			var update = sage
			  ? {$inc: {postsCount: 1}}
			  : doc.bumpsCount < MAX_BUMP_COUNT
			    ? {$inc: {postsCount: 1, bumpsCount: 1}, $set: {updatedAt: post.timestamp}}
			    : {$inc: {postsCount: 1}};

			postsDB.insert(post, function (err, newPost) {
				threadsDB.update({id: post.threadId}, update, {});
				cb();
			});
		});
	},

	insertThread: function (thread, post, cb) {
		var _self = this;

		if (thread.subject.length < 1) {
			console.error('[ERROR]: Subject is empty');
			return;
		}

		if (thread.subject.length > 350) {
			console.error('[ERROR]: Subject is too long.');
			return;
		}

		if (maxThreadIndex < 0) {
			console.error('[ERROR]: Negative max thread id.');
			return;
		}


		// post check COPYPASTE LOL KEK AHAH
		if(post.text.length < 1) {
			console.error('[ERROR]: Cannot add an empty post');
			return;
		}

		if(post.text.length > 2000) {
			console.error('[ERROR]: Post body is too long');
			return;
		}

		if (maxPostIndex < 0) {
			console.error('[ERROR]: Negative max post id.');
			return;
		}

		if (post.name.length > 64) {
			console.error('[ERROR]: Name is too long.');
			return;
		}


		if (post.email.length > 64) {
			console.error('[ERROR]: Email is too long.');
			return;
		}

		thread.id = ++maxThreadIndex;
		thread.postsCount = 0;
		thread.bumpsCount = 0;
		thread.firstPostText = post.text.substr(0, 220) + (post.text.length > 220 ? '...' : '');

		threadsDB.insert(thread, function (err, newThread) {
			post.threadId = newThread.id;
			post.firstPost = true;
			_self.insertPost(post, function() {
				cb();
			});
		});
	},

	findAllPosts: function (cb) {
		postsDB.find({}).sort({id: -1}).exec(function (err, docs) {
			cb(docs);
		});
	},

	findPostsByThreadId: function (threadId, cb) {
		postsDB.find({threadId: threadId}).sort({id: -1}).exec(function (err, docs) {
			cb(docs);
		});
	},

	findThreadsByBoardCode: function (boardCode, cb) {
		threadsDB.find({boardCode: boardCode}, {_id: 0, updatedAt: 0}).sort({updatedAt: -1}).exec(function (err, docs) {
			cb(docs);
		});
	},

	findThreadsWithFirstPostPreview: function (boardCode, cb) {
		// find all threads
		threadsDB.find({boardCode: boardCode}, {_id: 0}).sort({id: -1}).exec(function(err, threads) {
			cb(threads);
		});
	},

	findSinglePost: function (threadId, cb) {
		postsDB.findOne({threadId: threadId}, {_id: 0}).sort({id: 1}).exec(function(err, post) {
			cb(post);
		});
	},

	removeOldThreads: function() {
		console.log('Removing old threads...');

		BOARDS.map((boardCode) => {
			threadsDB.find({boardCode: boardCode}).sort({updatedAt: -1}).skip(MAX_THREADS).exec(function(err, threads) {
				threads.map((thread) => {
					threadsDB.remove({id: thread.id}, {multi: true}, function(err, numRemoved) {
						console.log('Removed', numRemoved, 'threads.');
					});
					postsDB.remove({threadId: thread.id}, {multi: true}, function(err, numRemoved) {
						console.log('Removed', numRemoved, 'posts.');
					});
				});
			});
		});


	}

};
