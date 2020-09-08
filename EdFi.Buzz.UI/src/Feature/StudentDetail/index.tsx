import * as React from 'react';
import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

export interface StudentDetailComponentProps {
  title?: string;
}

export const StudentDetail: FunctionComponent<StudentDetailComponentProps> = (
  props: StudentDetailComponentProps
) => {
  document.title = 'EdFi Buzz: Student Details';
  const params: { studentKey: string } = useParams();
  return <div>StudentDetail for StudentKey = {params.studentKey} {props.title ?? ''}</div>;
};
