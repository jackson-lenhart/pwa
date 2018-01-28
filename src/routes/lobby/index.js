import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';
import shortid from 'shortid';

import MyGames from '../../components/my-games';

import style from './style';

class Lobby extends Component {
  state = {
    data: []
  };

  componentDidMount() {
    fetch("http://localhost:4567/games")
      .then((res) => res.json())
      .then((res) => {
        console.log(res, "LOBBY CDM");
        this.setState({
          data: res.filter((ga) =>
            ga.active && !ga.users.includes(this.props.currentUser)
          )
        }, () => {
          console.log(this.state, "STATE FROM CDM");
        });
      }).catch((err) => {
        console.error(err);
      });
  }

  initializeGame = () => {
    const gameId = shortid.generate();

    const options = {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        isInit: true,
        gameId,
        users: [this.props.currentUser],
        scores: []
      })
    };

    fetch("http://localhost:4567/startgame", options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.props.clearState();
        this.props.init(gameId);
        route("/game", true);
      }).catch((err) => {
        console.error(err);
      });
  };

  joinGame = (gameId) => {
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
        this.props.chooseGame(gameId);
        route("/game", true);
        console.log("Data from postuser response", data);
      }).catch((err) => {
        console.error(err);
      });
  };

  render({ currentUser }, { data }) {
    let content;
    if (data.length === 0) content = (
      <p>Loading...</p>
    );
    else content = data.map((ga) =>
      <div key={ga.gameId}>
        <p class={style.item}>
          <Link onClick={() => this.joinGame(ga.gameId, ga.users[0])}>
            {ga.users[0]} {ga.gameId}
          </Link>
        </p>
      </div>
    );

    return (
      <div class={style.lobby}>
        <MyGames />
        <button type="button" onClick={this.initializeGame}>
          Start New Game
        </button>
        <h1>Active games</h1>
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser
});

const mapDispatchToProps = (dispatch) => ({
  chooseGame: (gameId, opponent) => {
    dispatch({
      type: "CHOOSE_GAME",
      payload: {
        gameId
      }
    });
  },
  init: (gameId) => {
    dispatch({
      type: "INIT",
      payload: {
        gameId
      }
    });
  },
  clearState: () => {
    dispatch({
      type: "RESET"
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
