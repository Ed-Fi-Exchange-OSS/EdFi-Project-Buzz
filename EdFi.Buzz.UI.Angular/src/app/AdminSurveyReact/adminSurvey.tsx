// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { FunctionComponent, useState } from 'react';

import { ApiService } from 'src/app/Services/api.service';
import { SurveyStatus } from '../Models/survey';
import styled from 'styled-components';
import { HeadlineContainer, MainContainer, TitleSpanContainer, TotalRecordsContainer } from '../../buzztheme';

import OrangeSearch from '../../assets/search.png';

export interface AdminSurveyComponentProps {
  api: ApiService;
}

const AdminSurveyContainer = styled.div`
  font-family: ${(props) => props.theme.fonts.regular} !important;
  font-size: 14px;
  background-color: var(--white-lilac);
  border: ${(props) => props.theme.border};
  min-height: 175px;
  margin-bottom: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-clip: border-box;
  border-radius: 4px;

  .survey-admin-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 0.6rem;
    color: var(--shark);
  }

  .bold {
    font-size: 14px;
    font-weight: 600 !important;
    line-height: 18px;
  }

  & h3 {
    color: var(--shark);
    font-family: ${(props) => props.theme.fonts.bold};
    font-size: 18px;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
  }
`;

const StyledTextParent = styled.div`
  @media (max-width: 768px) {
    width: 100%;
  }
  @media (min-width: 769px) {
    max-width: fit-content;
    margin: 0 0.5rem 1rem 0;
    justify-content: center;
  }
  flex: 1;
  overflow: hidden;
  border: ${(props) => props.theme.border };
  border-radius: 4px;
  margin-bottom: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;

  :focus-within {
    outline: none !important;
    border-color: var(--denim) !important;
  }

  & > img {
    height: 18px;
    width: 18px;
    margin: 10px 10px 10px 10px;
  }

  & > input {
    height: 100%;
    padding: 2px 2px 2px 2px;
    border: none;
    position: relative;
    box-sizing: border-box;
    min-width: 18rem;

    :focus {
      outline: none !important;
      outline-width: 0px;
    }

    ::placeholder,
    ::-webkit-input-placeholder {
      font-style: italic;
    }

    :-moz-placeholder {
      font-style: italic;
    }

    ::-moz-placeholder {
      font-style: italic;
    }

    :-ms-input-placeholder {
      font-style: italic;
    }
  }
`;

export const AdminSurvey: FunctionComponent<AdminSurveyComponentProps> = (props: AdminSurveyComponentProps) => {
  const [surveyFilteredList, setsurveyFilteredList] = useState([] as SurveyStatus[]);
  const [surveyList, setsurveyList] = useState([] as SurveyStatus[]);
  const [surveyToDelete, setsurveyToDelete] = useState(null as number);
  const [searchText, setsearchText] = useState('' as string);
  const surveyFilterRef = React.createRef<HTMLInputElement>();

  if (!surveyFilteredList || surveyFilteredList.length === 0) {
    props.api.survey.getSurveyStatus(
      props.api.authentication.currentUserValue.teacher.staffkey, null)
        .then((surveysValue) => {
          setsurveyList(surveysValue);
          setsurveyFilteredList(surveysValue);
    });
  }

  function handleChange() {
    setsearchText(surveyFilterRef.current.value);
    if (searchText && searchText.length > 0) {
      const upperSearchText = searchText.toUpperCase();
      const filteredList = surveyList
        .filter(s => (s.resultSummaryObj.survey.title as string).toUpperCase().includes(upperSearchText));
      setsurveyFilteredList(filteredList);
    }
    else {
      setsurveyFilteredList(surveyList);
    }
  }

  function setSurveyToDelete(surveyKey: number) {
    setsurveyToDelete(surveyKey);
  }

  function deleteSurvey() {
    if (surveyToDelete) {
        props.api.survey
      .deleteSurvey(props.api.authentication.currentUserValue.teacher.staffkey, surveyToDelete)
      .then(() => {
        const idx = surveyList.findIndex(el => el.surveykey === surveyToDelete);
        if (idx > -1) {
          surveyList.splice(idx, 1);
        }
        if (searchText) {
          const textIndex = surveyFilteredList.findIndex(el => el.surveykey === surveyToDelete);
          if (textIndex > -1) {
            surveyFilteredList.splice(textIndex, 1);
          }
        }
        setsurveyToDelete(null);
      });
    }
  }

  return (
    <>
    <MainContainer role='main' className='container'>
      <HeadlineContainer>
        <TitleSpanContainer>Administrate surveys</TitleSpanContainer>
      </HeadlineContainer>
      <StyledTextParent>
        <img src={OrangeSearch} />
        <input
          type='text'
          id='SurveyTitleInputs'
          placeholder='Search by Title'
          ref={surveyFilterRef}
          onChange={handleChange}
        />
      </StyledTextParent>

      {(!surveyFilteredList || surveyFilteredList.length === 0) &&
      <div className='row'>
        <div className='col-12'>
          <div className='alert alert-warning'>
            No surveys found.
          </div>
        </div>
      </div>
      }

      <div className='row'>
        {surveyFilteredList &&
          surveyFilteredList.map((survey, index) => (
            <div className='col-lg-4' key={survey.surveystatuskey}>
              <AdminSurveyContainer className='card'>
                <div className='survey-admin-body p-t-0'>
                  <div className='d-flex p-t-12'>
                    <div className='flex-grow-1 overflow-hidden'>
                      <span className='h2-desktop'>{survey.resultSummaryObj.survey.title}</span>
                    </div>
                  </div>
                  <div>
                    <div className='m-l-10'>
                      <div><span className='bold'>Survey Key: </span>{survey.surveystatuskey}</div>
                      <div><span className='bold'>Job Status: </span>{survey.jobstatus.description}</div>
                      <div><span className='bold'>Questions: </span>{survey.resultSummaryObj.survey.questions}</div>
                      <div><span className='bold'>Answers Load: </span>{survey.resultSummaryObj.process.load}</div>
                      <div><span className='bold'>Answers Already Loaded: </span>{survey.resultSummaryObj.process.alreadyLoaded}</div>
                    </div>
                  </div>
                  <div className='row' style={{'paddingRight': '20px', 'paddingTop': '10px'}}>
                    <div className='col-2 offset-8'>
                      <span onClick={(e) => setSurveyToDelete(survey.surveykey)} className='btn btn-danger btn-delete-note ion-md-trash'
                        data-toggle='modal' data-target='#deletesurveyconfirmation'></span>
                    </div>
                    <div className='col-2'>
                      <a href={`#/app/uploadSurvey/${survey.surveykey}`} className='btn btn-primary ion-md-create'></a>
                    </div>
                  </div>
                  
                </div>
              </AdminSurveyContainer>
            </div>
            ))}
      </div>
{/* 
    <div className='container'>
      <div className='position-relative p-t-10'>
        <a className='btn-outline-nav inline-block position-relative' style={{ 'top': '-10px', 'left': '0px'}} href='javascript:history.back(-1)'>
          <i className='ion ion-md-arrow-dropleft f-s-37 position-absolute' style={{ 'top': '-1px', 'left': '10px' }}></i>
        </a>
        <h1 className='inline-block position-absolute' style={{'top': '3px', 'left': '44px'}}>Administrate <span>surveys</span></h1>
      </div>

      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <div className='card-body d-flex form-group' style={{'marginBottom': '0'}}>
              <div className='input-group'>
                <input onChange={handleChange} ref={surveyFilterRef} type='text' className='form-control' id='searchInputs' placeholder='Search'/>
                <div className='input-group-append'>
                  <button className='btn btn-primary' type='button' onClick={handleChange}>
                    <label>Search</label>
                      <i className='ion ion-md-search'></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {(!surveyFilteredList) &&
      <div className='row'>
        <div className='col-12'>
          <div className='alert alert-warning'>
            No survey found.
          </div>
        </div>
      </div>
      }

      {(surveyFilteredList) &&
      <div className='row'>
        {surveyFilteredList.map((survey, index) => {
          return <div className='col-12 col-md-6' key={survey.surveystatuskey}>
            <div className='card survey-metadata'>
                <div className='card-body'>
                  <div>
                    <h2>{survey.resultSummaryObj.survey.title}</h2>
                    <p><span>Survey Key:</span> {survey.surveystatuskey} </p>
                    <p><span>Job Status:</span> {survey.jobstatus.description} </p>
                    <p><span>Questions:</span> {survey.resultSummaryObj.survey.questions} </p>
                    <p><span>Answers Load:</span> {survey.resultSummaryObj.process.load} </p>
                    <p><span>Answers Rejected:</span> {survey.resultSummaryObj.process.rejected} </p>
                    <p><span>Answers Already Loaded:</span> {survey.resultSummaryObj.process.alreadyLoaded} </p>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-2 offset-8'>
                    <span onClick={(e) => setSurveyToDelete(survey.surveykey)} className='btn btn-danger btn-delete-note ion-md-trash'
                      data-toggle='modal' data-target='#deletesurveyconfirmation'></span>
                  </div>
                  <div className='col-2'>
                    <a href={`#/app/uploadSurvey/${survey.surveykey}`} className='btn btn-primary ion-md-create'></a>
                  </div>
                </div>
            </div>
          </div>;
          })
        }
      </div>
      }
    </div> */}

    {/* Modal */}
    <div className='modal' id='deletesurveyconfirmation' data-backdrop='static' data-keyboard='false' role='dialog' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h3 className='modal-title' id='deletenoteconfirmationLabel'>Administrate surveys</h3>
            <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          <div className='modal-body'>
            Are you sure you want to delete this survey?
          </div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' data-dismiss='modal'>No</button>
            <button type='button' onClick={deleteSurvey}  data-dismiss='modal' className='btn btn-danger'>Yes</button>
          </div>
        </div>
      </div>
    </div>
    </MainContainer>
    </>
  );
};
