import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import shortid from 'shortid';

import ChooseOpponent from '../../components/choose-opponent';
import Fight from '../../components/fight';
import Finish from '../../components/finish';
import Menu from '../../components/menu';

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
      totalCount: 0,
      gameId: ""
    };

    this.setOpponent = this.setOpponent.bind(this);
    this.startGame = this.startGame.bind(this);
    this.chooseGame = this.chooseGame.bind(this);
    this.finishFight = this.finishFight.bind(this);
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
          scores: []
        })
      };

      fetch("http://localhost:4567/startgame", options)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.setState({
            fighting: true,
            gameId: gameId
          });
        }).catch((err) => {
          console.error(err)
        });
    });
  }

  chooseGame(gameId, opponent) {
    this.setState({
      gameId: gameId,
      selecting: false,
      opponent: opponent,
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
