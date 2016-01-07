import React from 'react';
import { Link } from 'react-router';

export default class IndexView extends React.Component {

	render() {
		return <div>
			<h2>Index Page</h2>
			<Link to='/test'>/test/овая доска</Link>
		</div>;
	}

}
