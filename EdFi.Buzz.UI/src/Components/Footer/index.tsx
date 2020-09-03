import * as React from 'react';
import { FunctionComponent } from 'react';

export interface FooterComponentProps {
  title?: string;
}

export const Footer: FunctionComponent<FooterComponentProps> = (
  props: FooterComponentProps
) => <div>Footer {props.title ?? ''}</div>;
