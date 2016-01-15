var config = {};

config.boards = ['dev', 'beta', 'vg', 'a'];
config.max_bumps = 250;
config.max_threads = 25;
config.max_post_length = 2000;
config.max_subject_length = 350;
config.first_post_preview_length = 220;
config.max_name_length = 64;
config.max_email_length = 64;

// 1 hour
config.autocompaction_interval = 1 * 60 * 60 * 1000;

// 30 min
config.autocleanup_interval = 0.5 * 60 * 60 * 1000;


module.exports = config;
