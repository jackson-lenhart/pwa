import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style';

class Finish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      won: false,
      lost: false,
      difference: 0,
      tie: false,
      pending: true,
      gameData: {}
    };

    this.evaluateGame = this.evaluateGame.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(this.fetchGame, 1000);
  }

  fetchGame = () => {
    fetch(`http://localhost:4567/games/${this.props.gameId}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("RES FROM GAMEFETCH", res);
        if (res.scores.length > 1) {
          clearInterval(this.timer);
          this.setState({
            gameData: res
          }, () => this.evaluateGame());
        }
      }).catch((err) => {
        console.error(err);
      });
  };

  evaluateGame() {
    const headers = new Headers({
      "Content-Type": "application/json"
    });

    const options = {
      headers,
      method: "POST",
      body: JSON.stringify({
        gameId: this.props.gameId
      })
    };

    fetch("http://localhost:4567/endgame", options)
      .then((res) => res.json())
      .then((res) => {
        console.log(res, "RES FROM evaluateGame FETCH");
        console.log(this.props, "PROPS evaluateGame FINISH FETCH");
        console.log(this.state.gameData, "GAMEDATA");

        const myScore =
          this.state.gameData.scores.filter((score) => {
            return score.user === this.props.currentUser;
          })[0].count;
        const theirScore =
          this.state.gameData.scores.filter((score) => {
            return score.user !== this.props.currentUser
          })[0].count;

        let difference;
        if (myScore > theirScore) {
          difference = myScore - theirScore;
          this.setState({
            pending: false,
            won: true,
            difference: difference
          }, () => {
            this.transfer(difference);
          });
        } else if (myScore === theirScore) {
          difference = 0;
          this.setState({
            pending: false,
            tie: true,
            difference: difference
          });
        } else {
          difference = theirScore - myScore;
          this.setState({
            pending: false,
            lost: true,
            difference: difference
          });
        }
      });
  }

  transfer = (difference) => {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        from: this.props.opponent,
        to: this.props.currentUser,
        amount: difference
      })
    };

    fetch("http://localhost:4567/transfer", options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
  };

  render({ totalCount, opponent }, { tie, won, lost, difference, pending }) {
    if (pending) {
      return (
        <div class={style.finish}>
          <h1>Score of {totalCount} posted. Awaiting response...</h1>
        </div>
      );
    }

    if (tie) {
      return (
        <div class={style.finish}>
          <h1>Tie.</h1>
        </div>
      );
    }

    if (won) {
      return (
        <div class={style.finish}>
          <h1>Congratulations!</h1>
          <p>You beat {opponent} by {difference}</p>
        </div>
      );
    }

    if (lost) {
      return (
        <div class={style.finish}>
          <h1>Oops</h1>
          <p>You lost to {opponent} by {difference}</p>
        </div>
      )
    }

    return (
      <div class={style.finish}>
        <p>Case not accounted for.</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  };
};

export default connect(mapStateToProps)(Finish);
