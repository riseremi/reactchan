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
		this.setState({boardCode: this.props.params.boardCode});
		this.updateBoardHandler();
	}

	componentWillReceiveProps(nextProps) {
		this.setState({boardCode: nextProps.params.boardCode});
		this.updateBoardHandler(nextProps.params.boardCode);

		console.log(nextProps);
		console.log(nextProps.params);
		console.log(nextProps.params.boardCode);
	}

	sendPostHandler() {
		let data = {
			text: document.getElementById('text').value,
			boardCode: this.state.boardCode,
			subject: document.getElementById('subject').value,
			email: document.getElementById('email').value,
			name: document.getElementById('name').value
		};

		let callback = (err, res) => {
			console.log('posting:', data);
			document.getElementById('text').value = '';
			document.getElementById('subject').value = '';
			document.getElementById('email').value = '';
			document.getElementById('name').value = '';
			this.updateBoardHandler();
		};

		request.post('http://chan-riseremi.c9users.io/board').send(data).end(callback);
	}

	updateBoardHandler(boardCode) {
		let callback = (err, res) => {
			this.setState({
				threads: res.body
			});
			console.log('[AJAX] - get threads, response body:', res.body);
			console.log(boardCode, this.state.boardCode);
		};

		request('GET', 'http://chan-riseremi.c9users.io/board/' + (boardCode || this.state.boardCode)).end(callback);
	}

	render() {
		return (
			<div>
				<h1>/{this.props.params.boardCode}/</h1>
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
