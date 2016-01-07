import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {

	render() {
		return (
			<div>
				<Link to="/test/">/test/</Link>
				<h1><Link to="/">reactchan :3</Link></h1>
				<div>{this.props.children}</div>
			</div>
		);
	}
}
