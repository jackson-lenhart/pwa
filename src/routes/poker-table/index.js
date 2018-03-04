import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import Hand from '../../components/hand';

import style from './style';

class PokerTable extends Component {
  state = {
    isLoading: true,
    handActive: false,
    winners: null
  };

  componentDidMount() {
    console.log(this.props.opponent, "OPPONENT!");
    if (!this.props.opponent) {
      this.lookForOpponent();
    } else {
      this.setState({ handActive: true });
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  lookForOpponent = () => {
    console.log(this.props.tableId, "tableId from lookForOpponent");

    const tableId = this.props.tableId;
    fetch(`http://localhost:4567/poker/look/${tableId}/users`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.error(data.msg);
          return;
        }
        let opponent = data.value.users.find(u => u !== this.props.currentUser);
        console.log("OPPONENT ONCE FOUND", opponent);
        this.props.setOpponent(opponent);
        this.setState({
          handActive: true
        });
      });
  };

  bet = amount => {
    
  };

  pass = () => {

  };

  render({ currentUser }, { handActive, myHand, winners }) {
    let hand;
    !handActive ? hand = <p>No hands yet</p>
      : hand = <Hand />;

    return (
      <div class={style.poker}>
        <h1>Table</h1>
        <h3>My Hand</h3>
        {hand}
        <br/>
        <br/>
        <button onClick={() => this.bet(10)}>
          Bet 10
        </button>
        <button onClick={this.pass}>
          Pass
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  opponent: state.poker.opponent,
  tableId: state.poker.tableId,
  isDealer: state.poker.isDealer
});

const mapDispatchToProps = dispatch => ({
  setOpponent: opponent => {
    dispatch({
      type: "SET_OPPONENT_PKR",
      payload: {
        opponent
      }
    });
  },
  reset: () => {
    dispatch({
      type: "RESET_PKR"
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PokerTable);
