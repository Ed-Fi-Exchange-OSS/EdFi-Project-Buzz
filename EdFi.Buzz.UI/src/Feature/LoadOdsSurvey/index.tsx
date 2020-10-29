// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import ApiService from 'Services/ApiService';
import { MainContainer, HeadlineContainer, TitleSpanContainer } from 'buzztheme';
// import styled from 'styled-components';
import { OdsSurveyComponent } from "./odsSurveyComponent";

import OdsSurvey from 'Models/OdsSurvey';

export interface LoadOdsSurveyProps {
  api: ApiService;
}

export const LoadOdsSurvey: FunctionComponent<LoadOdsSurveyProps> = (props: LoadOdsSurveyProps) => {
  const {api} = props;

  const [odsSurveys, setOdsSurveys] = useState([] as OdsSurvey[]);
  const [odsSurveysToImport, setOdsSurveysToImport] = useState([] as string[]);

  function getOdsSurveys() {
    api.odsSurvey.getOdsSurvey().then((result) => {
        setOdsSurveys(result);
      });
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
  }

  getOdsSurveys();

  return (
    <MainContainer role='main' className='container'>
      <HeadlineContainer>
        <TitleSpanContainer>Load Survey from ODS</TitleSpanContainer>
      </HeadlineContainer>
      {odsSurveys && odsSurveys.length > 0 &&
        <div className='row'>
            <form
            onSubmit={submitSurveys}
            >
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
              <button
                type="submit"
                >
                  Import Surveys
                </button>
              </div>
            </form>
        </div>
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
}