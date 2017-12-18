import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { Link } from 'preact-router/match';

import style from './style';

class Header extends Component {
	render({ isLoggedIn, currentUser, logOut }) {
		if (isLoggedIn) {
			return (
				<header class={style.header}>
					<Link href="/"><h1>Preact App</h1></Link>
					<nav>
						<Link activeClassName={style.active} href={`/profile/${currentUser}`}>{currentUser}</Link>
						<Link activeClassName={style.active} style={{ cursor: "pointer" }} onClick={logOut}>Log Out</Link>
					</nav>
				</header>
			);
		}

		return (
			<header class={style.header}>
				<Link href="/"><h1>Preact App</h1></Link>
				<nav>
					<Link activeClassName={style.active} href="/login">Log In</Link>
				</nav>
			</header>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.isLoggedIn,
		currentUser: state.currentUser
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		logOut: () => {
			dispatch({
				type: "LOGOUT"
			});
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
