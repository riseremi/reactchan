'use strict';

var Datastore = require('nedb');
var logger = require('./utils/Logger');
var config = require('./config');

var postsDB = new Datastore({
	filename: 'databases/posts.db',
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
		if (!this.validatePost(post)) {
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
				logger.warn('Thread doesn\'t exist.');
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

		if (!thread.subject) {
			logger.warn('Thread subject is empty');
			return;
		}

		if (thread.subject.length > config.max_subject_length) {
			logger.warn('Thread subject is too long.');
			return;
		}

		if (maxThreadIndex < 0) {
			console.error('[ERROR]: Negative max thread id.');
			return;
		}

		if (!this.validatePost(post)) {
			return;
		}

		if (maxPostIndex < 0) {
			logger.error('Negative max post id.');
			return;
		}

		if (post.name.length > config.max_name_length) {
			console.error('[ERROR]: Name is too long.');
			return;
		}

		if (post.email.length > config.max_email_length) {
			console.error('[ERROR]: Email is too long.');
			return;
		}

		thread.id = ++maxThreadIndex;
		thread.postsCount = 0;
		thread.bumpsCount = 0;
		thread.firstPostText = post.text;

		let cutFirstPost = post.text.length > config.first_post_preview_length;

		if (cutFirstPost) {
			thread.firstPostText = post.text.slice(0, config.first_post_preview_length) + '...';
		}

		post.id = parseInt(maxPostIndex, 10);
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
		threadsDB.find({boardCode: boardCode}, {_id: 0}).sort({id: -1}).exec(function(err, threads) {
			cb(threads);
		});
	},

	findSinglePost: function (threadId, cb) {
		postsDB.findOne({threadId: threadId}, {_id: 0}).sort({id: 1}).exec(function(err, post) {
			cb(post);
		});
	},

	findPostById: function(id, cb) {
		postsDB.findOne({id: id}, {_id: 0}).exec(function(err, post) {
			cb(post);
		});
	},

	validatePost: function(post) {
		if (!post.text) {
			logger.warn('Post text is empty.');
			return false;
		}

		if(post.text.length > config.max_post_length) {
			logger.warn('Post text is too long (' + config.max_post_length + ' characters max).');
			return false;
		}
		return true;
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
