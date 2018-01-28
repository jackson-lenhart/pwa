import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import style from './style';

class Finish extends Component {
  state = {
    result: undefined,
    won: false,
    lost: false,
    difference: 0,
    tie: false,
    pending: true,
    gameData: {}
  };

  componentDidMount() {
    console.log(this.props, "PROPS FROM FINISH CDM")
    fetch(`http://localhost:4567/look/${this.props.gameId}/scores`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error(data.msg);
          return;
        }
        this.setState({
          gameData: data.value
        }, () => {
          this.evaluateGame();
        });
      }).catch((err) => {
        console.error(err);
      });
  }

  evaluateGame = () => {
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
          this.state.gameData.scores
            .find((score) =>
              score.user === this.props.currentUser
            ).count;

        const theirScore =
          this.state.gameData.scores
            .find((score) =>
              score.user === this.props.opponent
            ).count;

        let difference;
        if (myScore > theirScore) {
          this.difference = myScore - theirScore;
          this.setState({ result: "won" });
        } else if (myScore < theirScore) {
          this.difference = theirScore - myScore;
          this.transfer(this.difference);
          this.setState({ result: "lost" });
        } else {
          this.setState({ result: "tie" });
        }
      });
  };

  transfer = (difference) => {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        from: this.props.currentUser,
        to: this.props.opponent,
        amount: difference
      })
    };

    fetch("http://localhost:4567/transfer", options)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    }).catch((err) => {
      console.error(err);
    });
  };

  render({ totalCount, opponent }, { tie, won, lost, difference, pending, result }) {
    let content;
    switch (result) {
      case "won":
        content = (
          <div>
            <h1>Congratulations!</h1>
            <p>You beat {opponent} by {this.difference}</p>
          </div>
        );
        break;
      case "lost":
        content = (
          <div>
            <h1>Oops</h1>
            <p>You lost to {opponent} by {this.difference}</p>
          </div>
        );
        break;
      case "tie":
        content = (
          <h1>Tie.</h1>
        );
        break;
      default:
        content = (
          <h1>Score of {totalCount} posted. Awaiting response...</h1>
        );
    }

    return (
      <div class={style.finish}>
        {content}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    gameId: state.game.gameId,
    opponent: state.game.opponent,
    totalCount: state.game.totalCount
  };
};

export default connect(mapStateToProps)(Finish);
