import React from 'react';
import { FunctionComponent, useState } from 'react';
import OdsSurvey from 'Models/OdsSurvey';

export interface OdsSurveyComponentProps {
    odsSurvey: OdsSurvey;
    addSurveyToImport: (surveyidentifier: string) => void;
    removeSurveyToImport: (surveyidentifier: string) => void;
}

export const OdsSurveyComponent: FunctionComponent<OdsSurveyComponentProps> = (props: OdsSurveyComponentProps) => {

  const {surveyidentifier, surveytitle} = props.odsSurvey;
  const [addSurvey, setAddSurvey] = useState(false);
  const inputId = `input${surveyidentifier}`

  const handleChange = () => {
    setAddSurvey(!addSurvey);
    !addSurvey ? 
        props.addSurveyToImport(surveyidentifier) 
        : props.removeSurveyToImport(surveyidentifier);
  };

  return (
    <div className='row'>
      <div className='col-11 offset-1'>
        <div className='custom-control custom-switch'>
          <input
            type='checkbox'
            name="addSurvey"
            checked={addSurvey}
            className='custom-control-input'
            id={inputId}
            onChange={handleChange}
          />
          <label className='custom-control-label' htmlFor={inputId}>
            {surveytitle}
          </label>
        </div>
      </div>
    </div>
  );
}

export default OdsSurveyComponent;