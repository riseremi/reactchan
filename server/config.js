var config = {};

config.boards = ['dev', 'beta', 'vg', 'a'];
config.max_bumps = 250;
config.max_threads = 25;

// 1 hour
config.autocompaction_interval = 1 * 60 * 60 * 1000;

// 30 min
config.autocleanup_interval = 0.5 * 60 * 60 * 1000;

module.exports = config;
