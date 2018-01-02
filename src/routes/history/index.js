import { h, Component } from 'preact';

import style from './style';

export default class History extends Component {
  state = {
    items: []
  };

  componentDidMount() {
    fetch("http://localhost:4567/history")
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "DATA FROM HISTORY");
        this.setState({ items: data });
      }).catch((err) => {
        console.error(err);
      });
  }

  render({}, { items }) {
    let child;
    if (items.length === 0) child = <p>History is blank</p>
    else {
      const sorted = items.slice().sort((a, b) => a.timestamp > b.timestamp);
      child = sorted.map((item) =>
        <tr key={item.gameId}>
          <td class={style.cell}>{item.users[0]}</td>
          <td class={style.cell}>{item.users[1]}</td>
          <td class={style.cell}>{item.scores.filter((x) => x.user === item.users[0])[0].count}</td>
          <td class={style.cell}>{item.scores.filter((x) => x.user === item.users[1])[0].count}</td>
          <td class={style.cell}>{item.timestamp}</td>
        </tr>
      )
    };
    return (
      <div class={style.history}>
        <h1>History</h1>
        <table>
          <tr>
            <th class={style.cell}>Player 1</th>
            <th class={style.cell}>Player 2</th>
            <th class={style.cell}>Player 1 Score</th>
            <th class={style.cell}>Player 2 Score</th>
            <th class={style.cell}>Timestamp</th>
          </tr>
          {child}
        </table>
      </div>
    );
  }
}
