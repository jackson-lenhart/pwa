import { h, Component } from 'preact';
import { route } from 'preact-router';
import { connect } from 'preact-redux';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      password: "",
      error: ""
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleLogin() {
    const headers = new Headers({
			"Content-Type": "application/json"
		});

		const options = {
			headers,
			method: "POST",
			body: JSON.stringify({
        user: this.state.user,
        password: this.state.password
      })
		};

		fetch("http://192.168.0.17:4567/signin", options)
			.then((res) => {
				return res.json();
			}).then((res) => {
        console.log(res);
        if (res.success) {
          this.props.login(this.state.user);
          route("/", true);
        }

        this.setState({ error: res.msg });
			}).catch((err) => {
				console.error(err);
			});
  }

  render() {
    return (
      <div style={{ padding: "100px" }}>
        <form>
          <p>User:</p>
          <input type="text" name="user" onInput={this.handleInput}/>
          <p>Password:</p>
          <input type="password" name="password" onInput={this.handleInput}/>
          <br/>
          <button type="button" onClick={this.handleLogin}>Log In</button>
        </form>
        {this.state.error}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
	return {
		login: (user) => {
			dispatch({
				type: "LOGIN",
				payload: user
			});
		}
	};
};

export default connect(null, mapDispatchToProps)(Login);
