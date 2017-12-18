import { h, Component } from 'preact';

import ChooseOpponent from '../../components/choose-opponent';
import Fight from '../../components/fight';
import Finish from '../../components/finish';

import style from './style';

export default class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opponent: null,
      winner: null,
      active: false,
      complete: false,
      totalCount: 0
    };

    this.setOpponent = this.setOpponent.bind(this);
    this.startGame = this.startGame.bind(this);
    this.endGame = this.endGame.bind(this);
  }

  setOpponent(opp) {
    this.setState({
      opponent: opp
    });
  }

  startGame() {
    this.setState({
      active: true
    });
  }

  endGame(count, user) {
    this.setState({
      active: false,
      complete: true
    });
  }

  render() {
    if (this.state.active) {
      return (
        <div class={style.game}>
          <Fight opponent={this.state.opponent} endGame={this.endGame}/>
        </div>
      );
    } else if (this.state.complete) {
      return (
        <div class={style.game}>
          <Finish winner="jackson" difference="5" />
        </div>
      )
    } else {
      return (
        <div class={style.game}>
          <ChooseOpponent setOpponent={this.setOpponent} startGame={this.startGame}/>
        </div>
      );
    }
  }
}
