var _this;

_this = function() {
	this.fetchUpdates = function() {
		return ["update_01", "update_02"];
	};

	this.sendMessage = function() {
		console.log('sometimes the same is different but mostly it\'s the same');
	};
};

module.exports = _this;