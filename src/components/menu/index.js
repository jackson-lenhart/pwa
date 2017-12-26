import { h, Component } from 'preact';
import { Link } from 'preact-router/match';

import style from './style';

export default class Menu extends Component {
  state = {
    games: []
  };

  componentDidMount() {
    fetch("http://localhost:4567/games")
      .then((res) => res.json())
      .then((res) => {
        this.setState({ games: res });
      });
  }

  render({ chooseGame }, { games }) {
    console.log(this.state.games, "DA GAIMZ");
    if (typeof games[0] === "string") {
      return (
        <div class={style.menu}>
          <p>{games[0]}</p>
        </div>
      );
    }

    //todo
    const content = games.map((el) =>
      <div key={el.gameId} class={style.line}>
        <p class={style.item}>
          <Link onClick={() => chooseGame(el.gameId, el.scores[0].user)}>
            {el.scores[0].user}: {el.scores[0].count}
          </Link>
        </p>
      </div>
    );

    return (
      <div class={style.menu}>
        <h1>Active games</h1>
        {content}
      </div>
    );
  }
}
