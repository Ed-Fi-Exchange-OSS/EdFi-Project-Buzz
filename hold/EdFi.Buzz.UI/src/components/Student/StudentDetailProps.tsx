import { RouteComponentProps } from 'react-router';

interface StudentDetailMatchProps {
  id: string;
}

export type StudentDetailProps = RouteComponentProps<StudentDetailMatchProps>;
