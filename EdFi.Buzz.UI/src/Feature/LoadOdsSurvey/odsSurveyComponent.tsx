import React, { FunctionComponent, useState, useEffect, createRef } from 'react';

import OdsSurvey from 'Models/OdsSurvey';

export interface OdsSurveyComponentProps {
  odsSurvey: OdsSurvey;
  addSurveyToImport: (odsSurvey: OdsSurvey) => void;
  removeSurveyToImport: (surveyidentifier: string) => void;
  index?: number ;
}

export const OdsSurveyComponent: FunctionComponent<OdsSurveyComponentProps> = (props: OdsSurveyComponentProps) => {
  const {surveyidentifier, surveytitle} = props.odsSurvey;
  const [addSurvey, setAddSurvey] = useState(false);
  const inputId = `input${surveyidentifier}`;
  const checkboxRef = createRef<HTMLInputElement>();

  useEffect(() => {
    if(props.index===0){
      checkboxRef.current.focus();
    }
  }, [props.index, checkboxRef]);

  const handleChange = () => {
    setAddSurvey(!addSurvey);
    if (!addSurvey) {
      props.addSurveyToImport({surveyidentifier, surveytitle});
    } else {
      props.removeSurveyToImport(surveyidentifier);
    }
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
            ref={checkboxRef}
          />
          <label className='custom-control-label' htmlFor={inputId}>
            {surveytitle}
          </label>
        </div>
      </div>
    </div>
  );
};

export default OdsSurveyComponent;
