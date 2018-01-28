import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';

import style from './style';

class Game extends Component {
  state = {
    counter: 0
  };

  lookForOpponent = () => {
    console.log(this.props.gameId, "gameId from lookForOpponent");

    const gameId = this.props.gameId;
    fetch(`http://localhost:4567/look/${gameId}/users`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error(data.msg);
          return;
        }
        this.props.setOpponent(
          data.value.users.find((u) =>
            u !== this.props.currentUser
          )
        );
      });
  };

  five = (x) => {
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
  };

  killGame = (gameId) => {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        gameId
      })
    };

    fetch("http://localhost:4567/endgame", options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "Data from endgame fetch in killGame");
        if (!data.success) {
          console.error(data.msg);
          return;
        }
        this.props.clearState();
        route("/lobby", true);
      }).catch((err) => {
        console.error(err);
      });
  };

  postScore = (gameId, user, count) => {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        gameId,
        user,
        count
      })
    };

    fetch("http://localhost:4567/postscore", options)
      .then((res) => {
        return res.json();
      }).then((res) => {
        console.log(res);
        this.props.setTotalCount(count);
        route("/finish", true);
      }).catch((err) => {
        console.error(err);
      });
  };

  render({ gameId, currentUser, opponent, finish }, { counter }) {
    let content;
    if (!opponent) {
      this.lookForOpponent();
      content = <h1>Looking for opponent...</h1>;
    } else {
      content = (
        <div>
          <h1>Game vs {opponent}</h1>
          <button type="button" onClick={() => this.five(1)}>Win 5</button>
          <button type="button" onClick={() => this.five(0)}>Lose 5</button>
          <h3>{counter}</h3>
          <button type="button" onClick={() => {
              this.postScore(gameId, currentUser, counter)
            }
          }>
            Finish
          </button>
          {'  '}
          <button type="button" onClick={() => this.killGame(gameId)}>
            Kill Game
          </button>
        </div>
      );
    }

    return (
      <div class={style.game}>
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser,
    gameId: state.game.gameId,
    opponent: state.game.opponent
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOpponent: (opponent) => {
      dispatch({
        type: "SET_OPPONENT",
        payload: {
          opponent
        }
      });
    },
    setTotalCount: (count) => {
      dispatch({
        type: "SET_COUNT",
        payload: {
          count
        }
      });
    },
    clearState: () => {
      dispatch({
        type: "RESET"
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
