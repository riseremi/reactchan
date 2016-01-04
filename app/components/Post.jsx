import React from 'react';

export default class IndexView extends React.Component {
	
	render() {
		return <div style={{border: '1px solid #ccc', borderRadius: '3px', marginBottom: '30px'}}>
			<span>{this.props.reply.username}</span>
			<span>{new Date(this.props.reply.timestamp).toString()}</span>
			<span><a>#{this.props.reply.id}</a></span>
			
			<p>{this.props.reply.text}</p>
		</div>;
	}
	
}
