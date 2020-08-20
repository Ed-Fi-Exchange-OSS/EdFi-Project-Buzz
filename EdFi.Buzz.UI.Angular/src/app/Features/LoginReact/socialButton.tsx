import * as React from 'react';
import SocialLogin from 'react-social-login';

class SocialButton extends React.Component<any> {

  render() {
    const otherProps = Object.keys(this.props)
      .filter(k => k !== 'triggerLogin' && k !== 'children')
      .reduce((acc, cur) => {
        acc[cur] = this.props[cur];
        return acc;
      }, {});

    return (
      <a onClick={this.props.triggerLogin} {...otherProps}>
        {this.props.children}
      </a>
    );
  }
}

export default SocialLogin(SocialButton);
