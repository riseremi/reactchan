import React from 'react';
import { Link } from 'react-router';

export default class Thread extends React.Component {

	render() {
		const thread = this.props.thread;

		return <div>
			<Link to={`/${thread.boardCode}/${thread.id}`}>{thread.subject}</Link> [N] <a href="#">{">>"}</a>
		</div>;
	}
}
