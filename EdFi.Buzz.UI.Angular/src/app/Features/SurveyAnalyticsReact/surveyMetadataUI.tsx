import * as React from 'react';
import { SurveyMetadata } from 'src/app/Models';

export interface SurveyMetadataUIComponentProps {
  surveyMetadataList: SurveyMetadata[];
  selectedSurveyKey?: number;
  onSurveySelected?: (surveyMetadata: SurveyMetadata) => void;
}

export const SurveyMetadataUI: React.FunctionComponent<SurveyMetadataUIComponentProps> = (props: SurveyMetadataUIComponentProps) => {
  const colorList: string[] = ['#03a9f4', '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];

  return <>
    {(props.surveyMetadataList.length === 0) && <div className='col-12'>
      <div className='alert alert-warning'>
        No survey found.
    </div>
    </div>}
    {props.surveyMetadataList.map((surveyMetadata, idx) => {
      return <div className='col-12 col-md-6' key={surveyMetadata.surveykey}
        onClick={() => props.onSurveySelected(surveyMetadata)}
      >
        <div className='card survey-metadata' >
          <div className={`card-body ${surveyMetadata.surveykey === props.selectedSurveyKey ? 'survey-selected' : null}`} >
            <div style={{ 'borderLeftColor': colorList[idx % 6] }}>
              <h2>{surveyMetadata.title}</h2>
              <p><span>Questions:</span> {surveyMetadata.numberofquestions} </p>
              <p><span>Completed:</span> {surveyMetadata.studentsanswered} of {surveyMetadata.totalstudents} students</p>
            </div>
          </div>
        </div>
      </div>;
    })}
  </>;
};
