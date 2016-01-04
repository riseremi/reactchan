var Datastore = require('nedb');

var postsDB = new Datastore({
	filename: 'databases/posts.db',
	autoload: true
});

module.exports = function () {

	// 1 hour * 60 mins * 60 secs * 1000 ms
	postsDB.persistence.setAutocompactionInterval(1 * 60 * 60 * 1000);

	var doc = {
		hello: 'world',
		n: 5,
		today: new Date(),
		nedbIsAwesome: true,
		notthere: null,
		notToBeSaved: undefined // Will not be saved
			,
		fruits: ['apple', 'orange', 'pear'],
		infos: {
			name: 'nedb'
		}
	};

	postsDB.insert(doc, function (err, newDoc) { // Callback is optional
		// newDoc is the newly inserted document, including its _id
		// newDoc has no key called notToBeSaved since its value was undefined
	});
};
