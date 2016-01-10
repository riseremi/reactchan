import React from 'react';
import { Link } from 'react-router';

export default class IndexView extends React.Component {

	render() {
		return <div>
			<h2>Index Page</h2>
			<Link to='/dev'>Программирование</Link><br />
			<Link to='/vg'>Видеоигры</Link><br />
			<Link to='/beta'>Бета доска для всего остального</Link><br />
			<Link to='/a'>Аниме</Link><br />
		</div>;
	}

}
