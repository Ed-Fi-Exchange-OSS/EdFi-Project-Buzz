import * as React from 'react';
import { FunctionComponent } from 'react';

export interface SurveyAnalyticsComponentProps {
  title?: string;
}

export const SurveyAnalytics: FunctionComponent<SurveyAnalyticsComponentProps> = (
  props: SurveyAnalyticsComponentProps
) => {
  document.title = 'EdFi Buzz: Survey Analytics';

  return <div>SurveyAnalytics {props.title ?? ''}</div>;
};
