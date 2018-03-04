import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import shortid from 'shortid';

import style from './style';

class PokerLobby extends Component {
  state = {
    isLoading: true,
    activeTables: []
  };

  componentDidMount() {
    fetch("http://localhost:4567/poker/activetables")
      .then(res => res.json())
      .then(data => {
        console.log("DATA FROM ACTIVE TABLES", data);

        if (!data.success) {
          console.error("Unsuccessful from pokerlobby CDM");
          return;
        }

        this.setState({
          isLoading: false,
          activeTables: data.tables
        });
      }).catch(err => console.error(err));
  }

  initializeTable = (tableId, buyIn) => {
    this.props.reset();
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        tableId,
        buyIn,
        user: this.props.currentUser
      })
    };

    fetch("http://localhost:4567/poker/starttable", options)
      .then(res => res.json())
      .then(data => {
        console.log("RESPONSE FROM INITIALIZE POKER TABLE", data);
        this.props.init(tableId, buyIn);
        route("/poker/table", true);
      }).catch(err => console.error(err));
  };

  joinTable = (tableId, dealer, buyIn) => {
    console.log("CURRENT USER FROM JOINTABLE", this.props.currentUser);
    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        tableId,
        buyIn,
        user: this.props.currentUser
      })
    };

    fetch("http://localhost:4567/poker/jointable", options)
      .then(res => res.json())
      .then(data => {
        this.props.join(tableId, dealer, buyIn);
        route("/poker/table", true);
      }).catch(err => console.error(err));
  };

  render({ currentUser, opponent, stack, net }, { isLoading, activeTables }) {
    let tables;
    isLoading ? tables = <p>Loading...</p>
      : tables = (
        activeTables.map(table =>
          <p key={table.tableId} style={{ cursor: "pointer" }}
            onClick={() => this.joinTable(table.tableId, table.dealer, 100)}>
            dealer: {table.dealer} {table.tableId}
          </p>
        )
      );

    return (
      <div class={style.poker}>
        <h1>Poker Lobby</h1>
        <button type="button" onClick={() => this.initializeTable(shortid.generate(), 100)}>
          Start New Poker Table
        </button>
        <h3>Active Tables</h3>
        <div>
          {tables}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
  opponent: state.poker.opponent,
  tableId: state.poker.tableId,
  net: state.poker.net
});

const mapDispatchToProps = dispatch => ({
  init: (tableId, buyIn) => {
    dispatch({
      type: "INIT_TABLE",
      payload: {
        tableId,
        buyIn
      }
    });
  },
  join: (tableId, dealer, buyIn) => {
    dispatch({
      type: "JOIN_TABLE",
      payload: {
        tableId,
        buyIn,
        dealer
      }
    });
  },
  reset: () => {
    dispatch({
      type: "RESET_PKR"
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PokerLobby);
