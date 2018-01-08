import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { Link } from 'preact-router/match';

import style from './style';

class Home extends Component {
	render({ isLoggedIn }) {
		if (isLoggedIn) {
			return (
				<div class={style.home}>
					<h1>Welcome back {this.props.currentUser}</h1>
					<p>This is the Home component.</p>
					<Link href="/lobby">Games</Link><br/>
				</div>
			);
		}

		return (
			<div class={style.home}>
				<h1>Home</h1>
				<p>This is the Home component.</p>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.user.isLoggedIn,
		currentUser: state.user.currentUser
	};
};

export default connect(mapStateToProps)(Home);
