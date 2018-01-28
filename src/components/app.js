import { h, Component } from 'preact';
import { Router, route } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import Profile from '../routes/profile';
import Login from '../routes/login';
import Transfer from '../routes/transfer';
import Game from '../routes/game';
import History from '../routes/history';
import Lobby from '../routes/lobby';
import Finish from '../routes/finish';
import MyProfile from '../routes/my-profile';
import PokerLobby from '../routes/poker-lobby';
import PokerTable from '../routes/poker-table';
// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */

	handleRoute = (e) => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Header/>
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
					<Login path="/login/" />
					<Transfer path="/transfer/" />
					<Game path="/game/" />
					<History path="/history/" />
					<Lobby path="/lobby/" />
					<Finish path="/finish/" />
					<MyProfile path="/myprofile/" />
					<PokerLobby path="/poker/lobby/" />
					<PokerTable path="/poker/table/" />
				</Router>
			</div>
		);
	}
}
