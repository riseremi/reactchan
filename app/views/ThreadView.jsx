import React from 'react';
import Post from '../components/Post';

export default class ThreadView extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			posts: []
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
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = () => {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				console.log('responseText:' + xmlhttp.responseText);
				try {
					var data = JSON.parse(xmlhttp.responseText);
				}
				catch (err) {
					console.log(err.message + " in " + xmlhttp.responseText);
					return;
				}
				// callback(data);
				this.setState({
					posts: data
				});
			}
		};

		xmlhttp.open("GET", 'http://chan-riseremi.c9users.io/posts', true);
		xmlhttp.send();
	}

	sendPostHandler() {
		let requestJSON = {
			// oh magic
			id: Math.floor(Math.random() * (1488 * 1488 - 0 + 1)) + 0,
			text: document.getElementById('text').value
		};

		var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance 
		xmlhttp.open("POST", "http://chan-riseremi.c9users.io/posts");
		xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xmlhttp.send(JSON.stringify(requestJSON));

		console.log('posting:', requestJSON);
		this.updatePosts();
		document.getElementById('text').value = '';
	}

	render() {
		return <div>
		
			<textarea id='text' cols='48' rows='4' placeholder='Your message'/>
			<br/>
			<button onClick={this.sendPostHandler.bind(this)}>Send</button>
			<br/><br/>
			<button onClick={this.updatePosts.bind(this)}>Refresh</button>
			
			{
				this.state.posts.map((post) => {
					return <Post key={post.id} post={post}/>;
				})
			}
		
		</div>;
	}
}
