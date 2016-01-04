import React from 'react';
import { Link } from 'react-router';

export default class Layout extends React.Component {

	render() {
		return (
			<div>
				<h1>React Router</h1>
				<ul>
					<li><Link to='/'>Home</Link></li>
					<li><Link to='gw'>Goodbye, world!</Link></li>
					<li><a href='typeanythingyouwant'>404</a></li>
				</ul>
				<h1>Layout</h1>
				<div>Child: {this.props.children}</div>
			</div>
		);
	}
}
