import { h, Component } from 'preact';

import style from './style';

export default class Pending extends Component {
  render({ totalCount }) {
    return (
      <div class={style.pending}>
        <h1>Score of {totalCount} posted. Awaiting response...</h1>
      </div>
    );
  }
}
