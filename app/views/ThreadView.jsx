/* global humane */

import React from 'react';
import Post from '../components/Post';
import ReplyForm from '../components/ReplyForm';
import request from 'superagent';

export default class ThreadView extends React.Component {

	constructor(props) {
		super(props);

		this.updatePosts = this.updatePosts.bind(this);
		this.autoUpdateHandler = this.autoUpdateHandler.bind(this);
		this.sendPostHandler = this.sendPostHandler.bind(this);

		this.state = {
			posts: [],
			timer: {},
			counter: {},
			timeOut: 10,
			boardCode: this.props.params.boardCode,
			threadId: this.props.params.threadId
		};
	}

	componentDidMount() {
		this.updatePosts();

		// Assign to individual textarea (most efficient)
		document.getElementById('text').addEventListener('keydown', (e) => {
			if (e.keyCode == 13 && e.ctrlKey) {
				this.sendPostHandler();
				console.log(0);
			}
		});
	}

	updatePosts() {
		let callback = (err, res) => {
			this.setState({
				posts: res.body
			});
			// console.log('[AJAX] - get posts, response body:', res.body);
		};

		request('GET', 'http://chan-riseremi.c9users.io/posts/' + this.state.threadId).end(callback);
	}

	sendPostHandler() {
		let data = {
			text: document.getElementById('text').value,
			boardCode: this.state.boardCode,
			threadId: +this.state.threadId,
			subject: document.getElementById('subject').value,
			email: document.getElementById('email').value,
			name: document.getElementById('name').value
		};

		let callback = (err, res) => {
			this.updatePosts();
			document.getElementById('text').value = '';
			document.getElementById('subject').value = '';
			document.getElementById('email').value = '';
			document.getElementById('name').value = '';
		};

		// route ebin 8------------D
		var requestURL = 'http://chan-riseremi.c9users.io';

		// send post
		if (data.subject.length < 1) {
			requestURL = requestURL + '/posts';
		} else {
			requestURL = requestURL + '/board';
		}

		request.post(requestURL).send(data).end(callback);
	}

	autoUpdateHandler(event) {
		let autoUpdate = event.target.checked;
		const TIMEOUT = 10000;

		if (autoUpdate) {
			let timer = setInterval(() => {
				this.updatePosts();
				this.setState({
					timeOut: TIMEOUT / 1000
				});
			}, TIMEOUT);

			let counter = setInterval(() => {
				document.getElementById('autoUpdate-text').innerHTML = `Автообновление (${this.state.timeOut})`;
				this.setState({
					timeOut: this.state.timeOut - 1
				});
			}, 1000);

			this.setState({
				timer: timer,
				counter: counter
			});
		}

		if (!autoUpdate) {
			clearInterval(this.state.timer);
			clearInterval(this.state.counter);
			this.setState({
				timeOut: TIMEOUT
			});
			document.getElementById('autoUpdate-text').innerHTML = 'Автообновление';
		}
	}

	render() {
		if (this.state.posts.length === 0) {
			return <div>
			<ReplyForm
			  updateClickHandler={this.updatePosts}
			  submitClickHandler={this.sendPostHandler}
			  autoUpdateClickHandler={this.autoUpdateHandler}
			  showAutoUpdate
			/>
			<div>Загрузка...</div></div>;
		}
		return <div>

			<ReplyForm
			  updateClickHandler={this.updatePosts}
			  submitClickHandler={this.sendPostHandler}
			  autoUpdateClickHandler={this.autoUpdateHandler}
			  showAutoUpdate
			/>

			{ this.state.posts.map(post => <Post key={post.id} post={post} />) }

		</div>;
	}
}
