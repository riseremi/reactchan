import React from 'react';
import ReplyForm from '../components/ReplyForm';
import Thread from '../components/Thread';
import request from 'superagent';

export default class ThreadView extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			threads: [],
			boardCode: this.props.params.boardCode
		};

		this.sendPostHandler = this.sendPostHandler.bind(this);
		this.updateBoardHandler = this.updateBoardHandler.bind(this);
	}

	componentDidMount() {
		this.updateBoardHandler();
	}

	sendPostHandler() {
		let data = {
			text: document.getElementById('text').value,
			boardCode: this.state.boardCode,
			subject: document.getElementById('subject').value,
			email: document.getElementById('email').value
		};

		let callback = (err, res) => {
			console.log('posting:', data);
			document.getElementById('text').value = '';
			this.updateBoardHandler();
		};

		request.post('http://chan-riseremi.c9users.io/board').send(data).end(callback);
	}

	updateBoardHandler() {
		let callback = (err, res) => {
			this.setState({
				threads: res.body
			});
			humane.log('Board updated', {
				timeout: 1000
			});
			console.log('[AJAX] - get threads, response body:', res.body);
		};

		request('GET', 'http://chan-riseremi.c9users.io/board/' + this.state.boardCode).end(callback);
	}

	render() {
		return (
			<div>
				<h1>thread</h1>
				<ReplyForm
				  submitClickHandler={this.sendPostHandler}
				  updateClickHandler={this.updateBoardHandler}
				/>

				<div style={{ marginTop: 30 }}>
					{
						this.state.threads.map((thread) => {
							return (
								<Thread
								  key={thread.id}
								  thread={thread}
								/>
							);
						})
					}
				</div>

			</div>
		);
	}
}
