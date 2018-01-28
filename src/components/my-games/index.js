import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';

import style from './style';

class MyGames extends Component {
  state = {
    myGameData: []
  };

  componentDidMount() {
    fetch(`http://localhost:4567/user/${this.props.currentUser}/games`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "DATA from user/games endpont");
        this.setState({ myGameData: data });
      });
  }

  enterGame = (gameId) => {
    this.props.chooseGame(gameId);
    route("/game", true);
  };

  render({ currentUser, chooseGame }, { myGameData }) {
    let child;
    (myGameData.length === 0) ? child = (
      <p>N/A</p>
    ) : child =
      myGameData.map((game) =>
        <div key={game.gameId}>
          <p class={style.item}>
            <Link onClick={() => this.enterGame(game.gameId)}>
              {game.gameId}
            </Link>
          </p>
        </div>
      )

    return (
      <div class={style.mygames}>
        <h1>My Games</h1>
        {child}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.user.currentUser
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    chooseGame: (gameId) => {
      dispatch({
        type: "CHOOSE_GAME",
        payload: {
          gameId
        }
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyGames);
