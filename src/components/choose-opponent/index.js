import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Link } from 'preact-router/match';

import style from './style';

class ChooseOpponent extends Component {
  state = {
    friends: []
  };

  componentDidMount() {
    fetch("http://localhost:4567/allusers")
      .then((res) => {
        return res.json();
      }).then((res) => {
        this.setState({
          friends: res.filter(item => item.user !== this.props.currentUser)
        });
      }).catch((err) => {
        console.error(err);
      });
  }

  render() {
    if (this.state.friends.length === 0) return null;

    const friendList = this.state.friends.map((el, i) => {
      return (
        <Link key={i} onClick={() => {
          this.props.setOpponent(el.user);
          this.props.startGame();
        }}>
          <p style={{ cursor: 'pointer' }}>{el.user}</p>
        </Link>
      );
    });

    return (
      <div class={style.menu}>
        <h1>Choose your opponent</h1>
        {friendList}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUser: state.currentUser
  };
};

export default connect(mapStateToProps)(ChooseOpponent);
