import React from 'react';
import {Route, IndexRoute, Router} from 'react-router';
import { render } from 'react-dom'
import createBrowserHistory from 'history/lib/createBrowserHistory'
let history = createBrowserHistory()

import Layout from './Layout';
import HelloWorld from './components/HelloWorld/views/HelloWorld';
import GoodbyeWorld from './components/GoodbyeWorld/views/GoodbyeWorld';
import Page404 from './components/Page404/views/Page404';

export default class App extends React.Component {
	render() {
		return <div><Layout/></div>;
	}
}

render((
	<Router history={history}>
		<Route path='/' component={Layout}>
			<IndexRoute component={HelloWorld}/>
			<Route path='gw' component={GoodbyeWorld}/>
			<Route path='*' component={Page404}/>
		</Route>
	</Router>
), document.getElementById('app-mount'));
