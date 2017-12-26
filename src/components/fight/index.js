import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style';

export default class Fight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counter: 0
    };
  }

  componentDidMount() {
    this.timer();
    /*if (this.props.gameId.length === 0) {
      this.props.startGame();
    }*/
  }

  timer = () => {
    setTimeout(() => {
      this.postScore();
    }, 3000);
  };

  postScore() {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        count: this.state.counter,
        user: this.props.currentUser,
        gameId: this.props.gameId
      })
    };

    fetch("http://localhost:4567/postscore", options)
      .then((res) => {
        return res.json();
      }).then((res) => {
        console.log(res);
        this.props.finishFight(this.state.counter);
      }).catch((err) => {
        console.error(err);
      });
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
      console.error("Incorrect value passed to 5. Must be 0 or 1");
    }
  }

  render() {
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
