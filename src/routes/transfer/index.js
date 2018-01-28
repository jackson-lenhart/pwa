import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style';

class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      to: "",
      amount: "",
      msg: ""
    };

    this.handleInput = this.handleInput.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);
  }

  handleInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleTransfer() {
    const toRe = /^[-\w\.\$@\*\!]{1,30}$/;
    const amountRe = /^\d{1,30}$/;

    if (!this.state.to.match(toRe)) {
      this.setState({
        msg: "Invalid user"
      });
      return;
    }

    if (!this.state.amount.match(amountRe)) {
      this.setState({
        msg: "Invalid amount"
      });
      return;
    }

    if (this.state.to === this.props.currentUser) {
      this.setState({
        msg: "You can't transfer to yourself."
      });
      return;
    }

    const headers = new Headers({
      "Content-Type": "application/json"
    });

    const options = {
      headers,
      method: "POST",
      body: JSON.stringify({
        from: this.props.currentUser,
        to: this.state.to,
        amount: parseInt(this.state.amount, 10)
      })
    };

    fetch("http://localhost:4567/transfer", options)
      .then((res) => {
        return res.json();
      }).then((res) => {
        console.log(res);
        this.setState({
          msg: res.msg
        });
      }).catch((err) => {
        console.error(err);
      });
  }

  render({ isLoggedIn, currentUser }) {
    if (!isLoggedIn) {
      return (
        <div class={style.transfer}>
          <h1>You must be signed in to transfer</h1>
        </div>
      );
    }

    return (
      <div class={style.transfer}>
        <h1>Transfer funds</h1>
        <p>To:</p>
        <input type="text" autocomplete="off" name="to" onInput={this.handleInput}/>
        <p>Amount:</p>
        <input type="text" name="amount" onInput={this.handleInput}/>
        <br/>
        <button type="button" onClick={this.handleTransfer}>Submit</button>
        <br/>
        {this.state.msg}
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

export default connect(mapStateToProps)(Transfer);
