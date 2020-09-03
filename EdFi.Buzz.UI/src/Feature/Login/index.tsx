import * as React from 'react';
import { FunctionComponent } from 'react';

export interface LoginComponentProps {
  title?: string;
}

export const Login: FunctionComponent<LoginComponentProps> = (
  props: LoginComponentProps
) => {
  document.title = 'EdFi Buzz: Login';
  return <div>Login {props.title ?? ''}</div>;
};
