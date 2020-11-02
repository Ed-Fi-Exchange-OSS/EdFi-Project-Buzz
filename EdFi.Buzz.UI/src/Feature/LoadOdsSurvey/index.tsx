// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import ApiService from 'Services/ApiService';
import { MainContainer, HeadlineContainer, TitleSpanContainer } from 'buzztheme';
import styled from 'styled-components';
import OdsSurvey from 'Models/OdsSurvey';
import { OdsSurveyComponent } from './odsSurveyComponent';


export interface LoadOdsSurveyProps {
  api: ApiService;
}

const OutlineButton = styled.button`
&.outline-button {
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 3em;
  border-color: var(--denim) !important;
  border-style: solid;
  color:  var(--denim);
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  background-color: transparent;
}
&.outline-button:hover {
  color: white;
  background-color: var(--denim) !important;
}
&.outline-button:disabled,
  button[disabled]{
    color:  var(--denim);
    background-color: transparent  !important;
    cursor: inherit;
}
`;

export const LoadOdsSurvey: FunctionComponent<LoadOdsSurveyProps> = (props: LoadOdsSurveyProps) => {
  const {api} = props;

  const [odsSurveys, setOdsSurveys] = useState([] as OdsSurvey[]);
  const [odsSurveysToImport, setOdsSurveysToImport] = useState([] as string[]);

  function getOdsSurveys() {
    if (!odsSurveys || odsSurveys.length === 0) {
      api.odsSurvey.getOdsSurvey().then((result) => {
        setOdsSurveys(result);
      });
    }
  }

  const addSurveyToImport = surveyidentifier => {
    setOdsSurveysToImport([
      ...odsSurveysToImport,
      surveyidentifier
    ]
    );
  };

  const removeSurveyToImport = surveyidentifier => {
    const surveys = odsSurveysToImport.filter(survey => survey !== surveyidentifier);
    setOdsSurveysToImport(surveys);
  };

  const submitSurveys = (e) => {
    e.preventDefault();
    console.log('submit');
    api.odsSurvey.importOdsSurveys([
      {
        surveyidentifier: 'CE_1',
        surveytitle: 'Course Evaluation from graphile 1'
      }
    ])
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  getOdsSurveys();

  return (
    <MainContainer role='main' className='container'>
      <HeadlineContainer>
        <TitleSpanContainer>Surveys from ODS</TitleSpanContainer>
      </HeadlineContainer>
      {odsSurveys && odsSurveys.length > 0 &&
        <form
          onSubmit={submitSurveys}
        >
          <div className='row'>
            <div className='col-12'>
              {
                odsSurveys.map(odsSurvey => (
                  <OdsSurveyComponent
                    key={odsSurvey.surveyidentifier}
                    odsSurvey={odsSurvey}
                    addSurveyToImport={addSurveyToImport}
                    removeSurveyToImport={removeSurveyToImport}
                  />
                ))
              }
            </div>
          </div>
          <div className='row'>
            <div className='col-4 offset-7' style={{ 'marginTop': '20px' }}>
              <OutlineButton
                type='submit'
                className='outline-button'
                disabled={!odsSurveysToImport || odsSurveysToImport.length === 0}
              >
              Import
              </OutlineButton>
            </div>
          </div>
        </form>
      }

      {!odsSurveys || odsSurveys.length === 0 &&
        <div className='row'>
          <div className='col-12'>
            <div className='alert alert-warning'>
              No surveys found.
            </div>
          </div>
        </div>
      }
    </MainContainer >
  );
};
