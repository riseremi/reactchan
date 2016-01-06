/* global humane */

import React from 'react';
import Post from '../components/Post';
import request from 'superagent';

export default class ThreadView extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			posts: [],
			timer: {},
			counter: {},
			timeOut: 10
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
			humane.log('Updated', {
				timeout: 1000
			});
			console.log('[AJAX] - get posts, response body:', res.body);
		};

		request('GET', 'http://chan-riseremi.c9users.io/posts').end(callback);
	}

	sendPostHandler() {
		let data = {
			text: document.getElementById('text').value
		};

		let callback = (err, res) => {
			console.log('posting:', data);
			this.updatePosts();
			document.getElementById('text').value = '';
		};

		request.post('http://chan-riseremi.c9users.io/posts').send(data).end(callback);
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
		return <div>

			<textarea id='text' cols='48' rows='4' placeholder='Your message'/>
			<br/>
			<button onClick={this.sendPostHandler.bind(this)}>Send</button>
			&nbsp;
			<button className='refresh' onClick={this.updatePosts.bind(this)}>Refresh</button>
			&nbsp;

			<label className="postername" style={{fontFamily: 'sans-serif'}}>
				<input type="checkbox" onChange={this.autoUpdateHandler.bind(this)}/>
				<span id='autoUpdate-text'>Автообновление</span>
			</label>

			{
				this.state.posts.map((post) => {
					return <Post key={post.id} post={post}/>;
				})
			}

		</div>;
	}
}
