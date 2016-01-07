var Datastore = require('nedb');

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

		// 3 hour * 60 mins * 60 secs * 1000 ms
		postsDB.persistence.setAutocompactionInterval(3 * 60 * 60 * 1000);
		postsDB.ensureIndex({ fieldName: 'id' , unique: true}, function (err) {});

		// repeat
		threadsDB.persistence.setAutocompactionInterval(3 * 60 * 60 * 1000);
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
	},

	insertPost: function (post, cb) {

		if(post.text.length < 1) {
			console.error('[ERROR]: Cannot add an empty post');
			return;
		}

		if (maxPostIndex === -1) {
			console.error('[ERROR]: Negative max post id.');
			return;
		}

		post.id = ++maxPostIndex;
		post.timestamp = new Date().getTime();
		post.text = post.text.trim();

		postsDB.insert(post, function (err, newDoc) { // Callback is optional
			cb();
		});
	},

	findAllPosts: function (cb) {
		postsDB.find({}).sort({
			id: -1
		}).exec(function (err, docs) {
			cb(docs);
		});
	}

};
