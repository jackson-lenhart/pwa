import { h, Component } from 'preact';

import style from './style';

export default class Pending extends Component {
  componentDidMount() {
    console.log(this.props, "props from component did mount");
    this.interval = setInterval(this.lookForResponse, 500);
  }

  lookForResponse = () => {
    console.log(this.props.gameId, "gameId from props of Pending");
    fetch(`http://localhost:4567/games/${this.props.gameId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.users.length > 1) {
          this.props.startFight(data.users[1]);
        }
        console.log(data, "data from gameid endpoint response");
      }).catch((err) => {
        console.error(err);
      });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div class={style.pending}>
        <h1>Game posted. Awaiting response...</h1>
      </div>
    );
  }
}
