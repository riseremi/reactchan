import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {

	render() {
		return (
			<div>
				[<Link to="/dev">dev</Link> / <Link to="/beta">beta</Link> / <Link to="/log">log</Link> / <Link to="/vg">vg</Link>]
				<h1><Link to="/">reactchan :3</Link></h1>
				<div>{this.props.children}</div>
			</div>
		);
	}
}
