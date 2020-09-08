import * as React from 'react';
import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

export interface UploadSurveyComponentProps {
  title?: string;
}

export const UploadSurvey: FunctionComponent<UploadSurveyComponentProps> = (
  props: UploadSurveyComponentProps
) => {
  document.title = 'EdFi Buzz: Upload Survey';

  const params: { surveyKey: string } = useParams();

  return (
    <div> UploadSurvey {params.surveyKey && `For SurveyKey = ${params.surveyKey}`} {props.title ?? ''} </div>
  );
};
