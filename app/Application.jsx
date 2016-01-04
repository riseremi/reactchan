import React from 'react';
import {Route, IndexRoute, Router} from 'react-router';
import { render } from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
let history = createBrowserHistory();

import Layout from './Layout';
import Page404View from './views/Page404View';
import ThreadView from './views/ThreadView';

render((
	<Router history={history}>
		<Route path='/' component={Layout}>
			<IndexRoute component={ThreadView}/>
			<Route path='/dev/res/:thread_id' component={ThreadView}/>
			<Route path='*' component={Page404View}/>
		</Route>
	</Router>
), document.getElementById('app-mount'));
