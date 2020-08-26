// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { FunctionComponent, useState } from 'react';

import { ApiService } from 'src/app/Services/api.service';
import { SurveyStatus } from '../Models/survey';

export interface AdminSurveyComponentProps {
  api: ApiService;
}

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
    const upperSearchText = searchText.toUpperCase();
    const filteredList = surveyList
      .filter(s => (s.resultSummaryObj.survey.title as string).toUpperCase().includes(upperSearchText));
    setsurveyFilteredList(filteredList);
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
    </div>

    {/* Modal */}
    <div className='modal' id='deletesurveyconfirmation' data-backdrop='static' data-keyboard='false' role='dialog' aria-labelledby='staticBackdropLabel' aria-hidden='true'>
      <div className='modal-dialog modal-dialog-centered'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='deletenoteconfirmationLabel'>Buzz Survey Administration</h5>
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
    </>
  );
};
