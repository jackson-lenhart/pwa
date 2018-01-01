import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import shortid from 'shortid';

import ChooseOpponent from '../../components/choose-opponent';
import Fight from '../../components/fight';
import Finish from '../../components/finish';
import Menu from '../../components/menu';
import Pending from '../../components/pending';
import MyGames from '../../components/my-games';
import style from './style';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opponent: null,
      winner: null,
      fighting: false,
      complete: false,
      selecting: false,
      pending: false,
      totalCount: 0,
      gameId: ""
    };

    this.setOpponent = this.setOpponent.bind(this);
    this.startGame = this.startGame.bind(this);
    this.chooseGame = this.chooseGame.bind(this);
    this.startFight = this.startFight.bind(this);
    this.finishFight = this.finishFight.bind(this);
    this.mountGame = this.mountGame.bind(this);
  }

  setOpponent(opp) {
    this.setState({
      opponent: opp
    });
  }

  mountMenu() {
    this.setState({
      selecting: true
    });
  }

  mountGame(gameId) {
    this.setState({
      pending: true,
      gameId: gameId
    });
  }

  startGame() {
    const gameId = shortid.generate();

    this.setState({
      gameId: shortid.generate()
    }, () => {
      const options = {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          gameId,
          users: [this.props.currentUser],
          scores: []
        })
      };

      fetch("http://localhost:4567/startgame", options)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.setState({
            pending: true,
            gameId: gameId
          }, () => {
            console.log("Helo from set state in startgame?", this.state);
          });
        }).catch((err) => {
          console.error(err)
        });
    });
  }

  chooseGame(gameId, opponent) {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        user: this.props.currentUser,
        gameId: gameId
      })
    };

    fetch("http://localhost:4567/postuser/", options)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          gameId: gameId,
          selecting: false,
          opponent: opponent,
          fighting: true
        });
        console.log("Data from postuser response", data);
      }).catch((err) => {
        console.error(err);
      });
  }

  startFight(opponent) {
    this.setState({
      opponent: opponent,
      pending: false,
      fighting: true
    });
  }

  finishFight(count) {
    this.setState({
      fighting: false,
      complete: true,
      totalCount: count
    });
  }

  render() {
    if (this.state.pending) {
      return (
        <div class={style.game}>
          <Pending
            gameId={this.state.gameId}
            startFight={this.startFight} />
        </div>
      );
    }
    if (this.state.fighting) {
      return (
        <div class={style.game}>
          <Fight
            startGame={this.startGame}
            opponent={this.state.opponent}
            finishFight={this.finishFight}
            currentUser={this.props.currentUser}
            gameId={this.state.gameId} />
        </div>
      );
    }
    if (this.state.complete) {
      return (
        <div class={style.game}>
          <Finish
            opponent={this.state.opponent}
            currentUser={this.props.currentUser}
            totalCount={this.state.totalCount}
            gameId={this.state.gameId} />
        </div>
      );
    }
    return (
      <div class={style.game}>
        <button type="button" onClick={this.startGame}>Start New Game</button>
        <MyGames mountGame={this.mountGame} />
        <Menu chooseGame={this.chooseGame} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  };
};

export default connect(mapStateToProps)(Game);
