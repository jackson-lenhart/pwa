import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import shortid from 'shortid';

import style from './style';

class Hand extends Component {
  state = {
    isLoading: true,
    myHand: null,
    winners: null
  };

  componentDidMount() {
    if (this.props.isDealer) {
      this.startHand();
    } else {
      setTimeout(() => {
        this.getHand();
      }, 3000);
    }
  }

  startHand = () => {
    console.log("OPPONENT", this.props.opponent);
    const handId = shortid.generate();
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        handId,
        tableId: this.props.tableId,
        players: [this.props.currentUser, this.props.opponent],
        dealer: this.props.currentUser
      })
    };

    fetch("http://localhost:4567/poker/starthand", options)
      .then(res => res.json())
      .then(data => {
        console.log("DATA FROM STARTHAND", data);

        this.props.setId(handId);
        this.setState({
          isLoading: false,
          myHand: data.hand
        });
      }).catch(err => console.error(err));
  }

  getHand = () => {
    console.log("CURRENT USER FROM JOIN HAND", this.props.currentUser);
    console.log("TABLEID FROM JOIN HAND", this.props.tableId);
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        tableId: this.props.tableId,
        user: this.props.currentUser
      })
    };

    fetch("http://localhost:4567/poker/gethand", options)
      .then(res => res.json())
      .then(data => {
        console.log("DATA FROM GETHAND", data);

        this.props.setId(data.handId);
        this.setState({
          isLoading: false,
          handId: data.handId,
          myHand: data.hand
        });
      }).catch(err => console.error(err));
  }

  finish = () => {
    console.log("HANDID FROM FINISH", this.props.handId);

    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        handId: this.props.handId
      })
    };

    fetch("http://localhost:4567/poker/endhand", options)
      .then(res => res.json())
      .then(data => {
        console.log("DATA FROM ENDHAND", data);

        this.setState({ winners: data.winners });
      }).catch(err => console.error(err));
  }

  render({}, { isLoading, myHand, winners }) {
    let hand;
    isLoading ? hand = <p>Loading...</p>
      : hand = (
        myHand.map(card =>
          <span key={card.id}>
            {card.value}
            {card.suit}
          </span>
        )
      );

    let result;
    if (winners) {
      if (winners.length > 1) {
        result = (
          <div>
            <p style={{ color: "blue" }}>SPLIT POT</p>
            <p>Split pot, {winners[0].msg}</p>
          </div>
        );
      } else if (winners[0].user === this.props.currentUser) {
        result = (
          <div>
            <p style={{ color: "green" }}>VICTORY!!!</p>
            <p>{winners[0].user} wins with {winners[0].result.msg}</p>
          </div>
        );
      } else {
        result = (
          <div>
            <p style={{ color: "red" }}>DEFEAT.</p>
            <p>{winners[0].user} wins with {winners[0].result.msg}</p>
          </div>
        );
      }
    }

    return (
      <div class={style.poker}>
        <div class={style.hand}>
          {hand}
        </div>
        <button onClick={this.finish}>See Results</button>
        {result}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  opponent: state.poker.opponent,
  isDealer: state.poker.isDealer,
  tableId: state.poker.tableId,
  handId: state.poker.handId
});

const mapDispatchToProps = dispatch => ({
  setId: handId => {
    dispatch({
      type: "SET_HAND_ID",
      payload: {
        handId
      }
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Hand);
