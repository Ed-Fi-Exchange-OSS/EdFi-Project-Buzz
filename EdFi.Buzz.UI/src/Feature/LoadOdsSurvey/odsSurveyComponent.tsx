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

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setAddSurvey(value);
    addSurvey ? 
        props.addSurveyToImport(surveyidentifier) 
        : props.removeSurveyToImport(surveyidentifier);
  };

  return (
    <div className='row'>
      <div className='col-12'>
        <input
            type="checkbox"
            name="addSurvey"
            checked={addSurvey}
            onChange={handleChange}
        />
        <label>Survey: <span>{surveytitle}</span></label>
      </div>
    </div>
  );
}

export default OdsSurveyComponent;