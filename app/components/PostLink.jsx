import React from 'react';

export default class PostLink extends React.Component {

	render() {
		return <a href='#'>{this.props.link.title}</a>
	}

}