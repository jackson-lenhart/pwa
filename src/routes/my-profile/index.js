import { h, Component } from 'preact';
import { connect } from 'preact-redux';

import Profile from '../profile';

import style from '../profile/style';

class MyProfile extends Component {
  render({ currentUser }) {
    let content;
    currentUser ? content = (
      <Profile user={currentUser} />
    ) : content = (
      <h3>You must be logged in to view this content.</h3>
    );

    return (
      <div class={style.profile}>
        {content}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

export default connect(mapStateToProps)(MyProfile);
