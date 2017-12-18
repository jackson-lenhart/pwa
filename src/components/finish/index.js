import { h, Component } from 'preact';

import style from './style';

export default class Finish extends Component {
  render() {
    return (
      <div style={style.finish}>
        <h1>Game over.</h1>
        <p>{this.props.winner} won by {this.props.difference}</p>
      </div>
    );
  }
}
