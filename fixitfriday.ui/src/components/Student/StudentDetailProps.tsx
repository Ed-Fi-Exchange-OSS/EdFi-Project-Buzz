import { RouteComponentProps } from 'react-router';

export interface StudentDetailProps extends RouteComponentProps<string> {
  id: string;
}
