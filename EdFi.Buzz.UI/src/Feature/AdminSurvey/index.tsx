// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import Icon from '@iconify/react';
import mdCreate from '@iconify-icons/ion/md-create';
import mdTrash from '@iconify-icons/ion/md-trash';
import add from '@iconify-icons/ion/add';
import ApiService from 'Services/ApiService';
import SurveyStatus from 'Models/SurveyStatus';
import { HeadlineContainer, MainContainer, TitleSpanContainer } from 'buzztheme';

import OrangeSearch from 'assets/search.png';
import { Link } from 'react-router-dom';

export interface AdminSurveyComponentProps {
  api: ApiService;
}
const UploadSurveyContainer = styled.div`
  font-family: ${(props) => props.theme.fonts.regular} !important;
  font-size: 24px;
  font-weight: bold;
  background-color: var(--white-lilac);
  color: #000000;
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
  flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: center;
  text-decoration: none;
  &:hover {
    background-color: lightgray;
    text-decoration: none;
  }
`;
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
  border: ${(props) => props.theme.border};
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
  document.title = 'EdFi Buzz: Admin Surveys';

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
    } else {
      setsurveyFilteredList(surveyList);
    }
  }

  function setSurveyToDelete(surveyKey: number) {
    setsurveyToDelete(surveyKey);
  }

  useEffect(()=> {
    surveyFilterRef.current.focus();
  }, [surveyFilterRef]);

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
          <TitleSpanContainer>Administer surveys</TitleSpanContainer>
        </HeadlineContainer>
        <StyledTextParent>
          <img src={OrangeSearch} alt="Search icon" />
          <input
            tabIndex={2}
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
            surveyFilteredList.map((survey) => (
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
                    <div className='row' style={{ 'paddingRight': '20px', 'paddingTop': '10px' }}>
                      <div className='col-2 offset-8'>
                        <span
                          tabIndex={0}
                          onClick={() => setSurveyToDelete(survey.surveykey)}
                          onKeyPress={(event) => event.key === 'Enter' ? setSurveyToDelete(survey.surveykey)   : null}
                          className='btn btn-danger btn-delete-note ion-md-trash'
                          data-toggle='modal'
                          data-target='#deletesurveyconfirmation'>
                          <Icon icon={mdTrash}></Icon>
                        </span>
                      </div>
                      <div className='col-2'>
                        <Link tabIndex={3}
                          to={`/uploadSurvey/${survey.surveykey}`}
                          className='btn btn-primary'>
                          <Icon icon={mdCreate}></Icon>
                        </Link>
                      </div>
                    </div>

                  </div>
                </AdminSurveyContainer>
              </div>
            ))}
        </div>
        <div className='row'>
          <div className='col-lg-4' key={0}>
            <Link
              to={'/uploadSurvey'}
              tabIndex={3}>
              <UploadSurveyContainer className='card'>
                <Icon width={'40px'} icon={add}></Icon>
                Upload Survey
              </UploadSurveyContainer>
            </Link>
          </div>
        </div>
        {/* Modal */}
        <div
          className='modal'
          id='deletesurveyconfirmation'
          data-backdrop='static'
          data-keyboard='false'
          role='dialog'
          aria-labelledby='staticBackdropLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h3 className='modal-title' id='deletenoteconfirmationLabel'>Administer surveys</h3>
                <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                Are you sure you want to delete this survey?
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-secondary' data-dismiss='modal'>No</button>
                <button type='button' onClick={deleteSurvey} data-dismiss='modal' className='btn btn-danger'>Yes</button>
              </div>
            </div>
          </div>
        </div>
      </MainContainer>
    </>
  );
};
