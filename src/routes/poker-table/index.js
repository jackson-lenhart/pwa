import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import shortid from 'shortid';

import style from './style';

class PokerTable extends Component {
  state = {
    isLoading: true,
    handId: null,
    myHand: null,
    winners: null
  };

  componentDidMount() {
    if (this.props.isDealer) {
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

          this.setState({
            handId,
            isLoading: false,
            myHand: data.hand
          });
        }).catch(err => console.error(err));
    } else {
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

      fetch("http://localhost:4567/poker/joinhand", options)
        .then(res => res.json())
        .then(data => {
          console.log("DATA FROM JOINHAND", data);

          this.setState({
            isLoading: false,
            handId: data.handId,
            myHand: data.hand
          });
        }).catch(err => console.error(err));
    }
  }

  bet = amount => {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        handId: this.state.handId
      })
    };

    fetch("http://localhost:4567/poker/endhand", options)
      .then(res => res.json())
      .then(data => {
        console.log("DATA FROM ENDHAND", data);

        this.setState({ winners: data.winners });
      }).catch(err => console.error(err));
  };

  pass = () => {
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        handId: this.state.handId
      })
    };

    fetch("http://localhost:4567/poker/endhand", options)
      .then(res => res.json())
      .then(data => {
        console.log("DATA FROM ENDHAND", data);

        this.setState({ winners: data.winners })
      }).catch(err => console.error(err));
  };

  render({ currentUser }, { isLoading, myHand, winners }) {
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
        {result}
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

export default connect(mapStateToProps)(PokerTable);
