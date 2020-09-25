/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import SocialLogin from 'react-social-login';
import Button from 'react-bootstrap/Button';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
class SocialButton extends React.Component<any> {

  render() {
    const otherProps = Object.keys(this.props)
      .filter(k => k !== 'triggerLogin' && k !== 'children')
      .reduce((acc: { [prop: string]: string }, cur) => {
        acc[cur] = this.props[cur];
        return acc;
      }, {});

    return (
      <Button onClick={this.props.triggerLogin} {...otherProps}>
        {this.props.children}
      </Button>
    );
  }
}

export default SocialLogin(SocialButton);
