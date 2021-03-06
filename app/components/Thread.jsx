import React from 'react';
import { Link } from 'react-router';

export default class Thread extends React.Component {

	render() {
		const thread = this.props.thread;

		return <div style={{ lineHeight: 1.4, fontFamily: 'serif', marginBottom: 30 }}>
			<Link to={`/${thread.boardCode}/${thread.id}`}>{thread.subject}</Link> [постов: {thread.postsCount} / бампов: {thread.bumpsCount}] No.{thread.firstPostId}
			<br />
			{thread.firstPostText}
		</div>;
	}
}
