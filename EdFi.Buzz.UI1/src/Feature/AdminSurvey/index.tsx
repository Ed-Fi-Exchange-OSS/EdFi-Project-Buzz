import * as React from 'react';
import { FunctionComponent } from 'react';

export interface AdminSurveyComponentProps {
  title?: string;
}

export const AdminSurvey: FunctionComponent<AdminSurveyComponentProps> = (
  props: AdminSurveyComponentProps
) => {
  document.title = 'EdFi Buzz: Admin Surveys';

  return <div>AdminSurveys {props.title ?? ''}</div>;
};
