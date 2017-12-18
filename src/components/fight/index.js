import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style';

class Fight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  componentWillUnmount() {
    const headers = new Headers({
      "Content-Type": "application/json"
    });

    const options = {
      headers,
      method: "POST",
      body: JSON.stringify({
        count: this.state.counter,
        user: this.props.currentUser
      })
    };

    fetch("http://localhost:4567/postgame", options)
      .then((res) => {
        return res.json();
      }).then((res) => {
        console.log(res);
      }).catch((err) => {
        console.error(err);
      });
  }

  timer = () => {
    setTimeout(() => this.props.endGame(), 3000);
  }

  five(x) {
    if (x === 1) {
      this.setState({
        counter: this.state.counter + 5
      });
    } else if (x === 0){
      this.setState({
        counter: this.state.counter - 5
      });
    } else {
      console.log("Somethings very wrong with five");
    }
  }

  render() {
    this.timer();
    return (
      <div class={style.fight}>
        <h1>Game vs {this.props.opponent}</h1>
        <button type="button" onClick={() => this.five(1)}>Win 5</button>
        <button type="button" onClick={() => this.five(0)}>Lose 5</button>
        <h3>{this.state.counter}</h3>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  };
};

export default connect(mapStateToProps)(Fight);
