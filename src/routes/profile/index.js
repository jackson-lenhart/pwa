import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style';

class Profile extends Component {
	state = {
		time: Date.now(),
		count: 10,
		userData: {}
	};

	// gets called when this route is navigated to
	componentDidMount() {
		// start a timer for the clock:
		this.timer = setInterval(this.updateTime, 1000);
		fetch(`http://localhost:4567/user/${this.props.user}`)
			.then((res) => {
				return res.json();
			}).then((data) => {
				this.setState({ userData: data });
			}).catch((err) => {
				console.error(err);
			});
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	// update the current time
	updateTime = () => {
		this.setState({ time: Date.now() });
	};

	increment = () => {
		this.setState({ count: this.state.count+1 });
	};

	// Note: `user` comes from the URL, courtesy of our router
	render({ user }, { time, count, userData }) {
		return (
			<div class={style.profile}>
				<h1>Profile: {user}</h1>
				<p>This is the user profile for a user named { user }.</p>
				<p>balance: {userData.balance}</p>
				<div>Current time: {new Date(time).toLocaleString()}</div>

				<p>
					<button onClick={this.increment}>Click Me</button>
					{' '}
					Clicked {count} times.
				</p>
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

export default connect(mapStateToProps)(Profile);
