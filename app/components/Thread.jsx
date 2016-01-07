import React from 'react';
import { Link } from 'react-router';

export default class Thread extends React.Component {

	render() {
		const thread = this.props.thread;

		return <div style={{ lineHeight: 1.4, fontFamily: 'serif', marginBottom: 30 }}>
			<Link to={`/${thread.boardCode}/${thread.id}`}>{thread.subject}</Link> [{thread.postsCount} / {thread.bumpsCount}] <a href="#">{">>"}</a>
			<br />
			{thread.firstPostText}
		</div>;
	}
}
