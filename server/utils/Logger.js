'use strict';

var colors = require('colors/safe');

class Logger {

	info(message) {
		this.log('INFO', message, 'blue');
	}

	warn(message) {
		this.log('INFO', message, 'yellow');
	}

	error(message) {
		this.log('INFO', message, 'red');
	}

	log(scope, message, color) {
		let fn = colors[color];
		console.log(fn.inverse(`[${scope}]`), message);
	}
}

module.exports = new Logger();
