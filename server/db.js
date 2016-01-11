'use strict';

var Datastore = require('nedb');
var logger = require('./utils/Logger');
var config = require('./config');

var postsDB = new Datastore({
	filename: 'databases/posts2.db',
	autoload: true
});

var threadsDB = new Datastore({
	filename: 'databases/threads.db',
	autoload: true
});

var maxPostIndex = -1, maxThreadIndex = -1;

module.exports = {

	init: function () {
		postsDB.persistence.setAutocompactionInterval(config.autocompaction_interval);
		postsDB.ensureIndex({ fieldName: 'id' , unique: true}, function (err) {
			if (err) {
				logger.warn(err);
			}
		});

		threadsDB.persistence.setAutocompactionInterval(config.autocompaction_interval);
		threadsDB.ensureIndex({ fieldName: 'id' , unique: true}, function (err) {
			if (err) {
				logger.warn(err);
			}
		});

		// set max post index
		postsDB.find({}).sort({id: -1}).limit(1).exec(function (err, docs) {
			maxPostIndex = docs.length > 0 ? docs[0].id : 0;
		});

		// set max thread index
		threadsDB.find({}).sort({id: -1}).limit(1).exec(function (err, docs) {
			maxThreadIndex = docs.length > 0 ? docs[0].id : 0;
		});

		// set auto cleanup
		setInterval(() => { this.removeOldThreads(); }, config.autocleanup_interval);
	},

	insertPost: function (post, cb) {
		if (!post || !post.text) {
			console.log('[ERROR]: sosi');
			return;
		}

		if(post.text.length < 1) {
			logger.error('Post text is empty.');
			return;
		}

		if(post.text.length > 2000) {
			logger.error('Post text is too long (2000 characters max).');
			return;
		}

		if (maxPostIndex < 0) {
			logger.error('Negative max post id.');
			return;
		}

		post.timestamp = post.timestamp || new Date().getTime();
		post.text = post.text.trim();
		post.id = post.id || ++maxPostIndex;
		var sage = post.email === 'sage';
		if (post.firstPost) {
			post.email = 'nöko';
			sage = false;
		}

		threadsDB.findOne({id: post.threadId}, function(err, doc) {
			if (!doc) {
				logger.error('Thread doesn\'t exist.');
				return;
			}
			var update = sage
			  ? {$inc: {postsCount: 1}}
			  : doc.bumpsCount < config.max_bumps
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

		post.id = ++maxPostIndex;
		thread.firstPostId = post.id;

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
		logger.info('Removing old threads...');

		config.boards.map((boardCode) => {
			threadsDB.find({boardCode: boardCode}).sort({updatedAt: -1}).skip(config.max_threads).exec(function(err, threads) {
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
