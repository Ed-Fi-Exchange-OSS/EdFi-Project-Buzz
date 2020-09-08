import * as React from 'react';
import { FunctionComponent } from 'react';

export interface StudentRosterComponentProps {
  title?: string;
}

export const StudentRoster: FunctionComponent<StudentRosterComponentProps> = (
  props: StudentRosterComponentProps
) => {
  document.title = 'EdFi Buzz: Student Roster';

  return <div>StudentRoster {props.title ?? ''}</div>;
};
