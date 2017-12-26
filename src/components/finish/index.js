import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style';

class Finish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      won: false,
      difference: 0,
      tie: false,
      pending: false,
      gameData: {}
    };

    this.endGame = this.endGame.bind(this);
  }

  componentDidMount() {
    fetch(`http://localhost:4567/games/${this.props.gameId}`)
      .then((res) => res.json())
      .then((res) => {
        console.log("RES FROM GAMEFETCH", res);
        if (res.scores.length > 1) {
          this.setState({
            gameData: res
          }, () => this.endGame());
        }
        else this.setState({ pending: true });
      }).catch((err) => {
        console.error(err);
      });
  }

  endGame() {
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
        console.log(res, "RES FROM ENDGAME FETCH");
        console.log(this.props, "PROPS ENDGAME FINISH FETCH");
        console.log(this.state.gameData, "GAMEDATA");

        const myScore =
          this.state.gameData.scores.filter((score) => {
            return score.user === this.props.currentUser;
          })[0].count;
        const theirScore =
          this.state.gameData.scores.filter((score) => {
            return score.user !== this.props.currentUser
          })[0].count;
        if (myScore > theirScore) {
          this.setState({
            won: true,
            difference: myScore - theirScore
          });
        } else {
          this.setState({
            difference: theirScore - myScore
          });
        }
      });
  }

  render({ totalCount }, { tie, won, difference, pending }) {
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
          <p>You beat by {difference}</p>
        </div>
      );
    }

    return (
      <div class={style.finish}>
        <h1>Oops</h1>
        <p>You lost by {difference}</p>
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
