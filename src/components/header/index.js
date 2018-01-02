import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import style from './style';

class Header extends Component {
	handleLogout = () => {
		this.props.logout();
		route("/", true);
	};

	render({ isLoggedIn, currentUser }) {
		if (isLoggedIn) {
			return (
				<header class={style.header}>
					<Link href="/"><h1>Home</h1></Link>
					<nav>
						<Link activeClassName={style.active} href={`/profile/${currentUser}`}>{currentUser}</Link>
						<Link activeClassName={style.active} href="/history">History</Link>
						<Link
							activeClassName={style.active}
							style={{ cursor: "pointer" }}
							onClick={this.handleLogout}>Log Out</Link>
					</nav>
				</header>
			);
		}

		return (
			<header class={style.header}>
				<Link href="/"><h1>Home</h1></Link>
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
		logout: () => {
			dispatch({
				type: "LOGOUT"
			});
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
