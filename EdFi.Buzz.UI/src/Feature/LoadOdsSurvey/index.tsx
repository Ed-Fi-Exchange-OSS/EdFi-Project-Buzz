// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { FunctionComponent, useState, Fragment, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ApiService from 'Services/ApiService';
import { MainContainer, HeadlineContainer, TitleSpanContainer } from 'buzztheme';
import styled from 'styled-components';
import OdsSurvey from 'Models/OdsSurvey';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { OdsSurveyComponent } from './odsSurveyComponent';
import LoadSurveyFromOdsResponse from '../../Models/LoadSurveyFromOdsResponse';

export interface LoadOdsSurveyProps {
  api: ApiService;
}


const ParagraphResult = styled.p`
  text-align:right;
`;

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
  const history = useHistory();

  const [odsSurveys, setOdsSurveys] = useState([] as OdsSurvey[]);
  const [odsSurveysToImport, setOdsSurveysToImport] = useState([] as OdsSurvey[]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [importingResults, setImportingResults] = useState<LoadSurveyFromOdsResponse>(
    {
      totalCount: 0,
      totalCountLoaded: 0,
      totalCountFailed: 0,
      listFailedInsert: []
    } as LoadSurveyFromOdsResponse);

  const addSurveyToImport = odsSurvey => {
    setOdsSurveysToImport([
      ...odsSurveysToImport,
      odsSurvey
    ]
    );
  };

  const removeSurveyToImport = surveyidentifier => {
    const surveys = odsSurveysToImport.filter(survey => survey.surveyidentifier !== surveyidentifier);
    setOdsSurveysToImport(surveys);
  };

  const submitSurveys = (e) => {
    e.preventDefault();
    api.odsSurvey.importOdsSurveys(odsSurveysToImport)
      .then((result) => {
        setImportingResults(result);
        setShowModal(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(()=> {
    let unmounted = false;

    api.odsSurvey.getOdsSurvey().then((result) => {
      if (!unmounted) {
        setOdsSurveys(result);
      }
    });
    return () => {
      unmounted = true;
    };
  }, [api.odsSurvey]);

  return (
    <Fragment>
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
                odsSurveys.map((odsSurvey, index) => (
                  <OdsSurveyComponent
                    key={odsSurvey.surveyidentifier}
                    odsSurvey={odsSurvey}
                    addSurveyToImport={addSurveyToImport}
                    removeSurveyToImport={removeSurveyToImport}
                    index={index}
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
                disabled={odsSurveysToImport.length === 0}
              >
              Import
              </OutlineButton>
            </div>
          </div>
        </form>
        }

        {odsSurveys.length === 0 &&
        <div className='row'>
          <div className='col-12'>
            <div className='alert alert-warning'>
              No surveys found.
            </div>
          </div>
        </div>
        }
      </MainContainer >

      <Modal
        show={showModal}
        backdrop='static'
        className='survey-modal-dialog'
        size='sm'
        aria-labelledby='contained-modal-title-vcenter'
        centered>
        <Modal.Header>
          <Modal.Title>Results</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="row">
            <div className="col-9">
              <ParagraphResult>
            Number of surveys requested:
              </ParagraphResult>
            </div>
            <div className="col-3">
              {importingResults.totalCount}
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <ParagraphResult>
              Number of surveys loaded:
              </ParagraphResult>
            </div>
            <div className="col-3">
              {
                importingResults.totalCountLoaded && importingResults.totalCountLoaded > 0
                  ? importingResults.totalCountLoaded
                  : 'None' }
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <ParagraphResult>
              Number of surveys that failed:
              </ParagraphResult>
            </div>
            <div className="col-3">
              {
                importingResults.totalCountFailed && importingResults.totalCountFailed > 0
                  ? importingResults.totalCountFailed
                  : 'None' }
            </div>
          </div>
          <div className="row">
            <div className="col-9">
              <ParagraphResult>
              Surveys that failed:
              </ParagraphResult>
            </div>
            <div className="col-1">
              {
                importingResults.listFailedInsert && importingResults.listFailedInsert.length > 0
                  ? importingResults.listFailedInsert.join(',')
                  : 'None'}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant='primary'
            onClick={() => {
              setShowModal(false);
              history.push('/surveyAnalytics');
            }}
          >
          Okay
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};
