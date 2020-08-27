// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { Fragment, useState, useEffect, FunctionComponent } from 'react';
import { SurveyStatus } from 'src/app/Models/survey';
import { ApiService } from 'src/app/Services/api.service';

export interface UploadSurveyProps {
  api: ApiService;
  surveyKey: string;
}
interface FileStatus {
  fileName?: string;
  isValid?: boolean;
  status?: string;
  error?: string;
  jobId?: string;
  serverJobStatus?: SurveyStatus;
}

export const UploadSurvey: FunctionComponent<UploadSurveyProps> = (props: UploadSurveyProps) => {
  const DEFAULT_UPLOAD_LABEL = 'Choose survey file';
  const { api, surveyKey } = props;
  const [SURVEY_STATUS_QUERY_TIME_IN_MS, setQueryTime] = useState(5000); /* 5 seconds intervals */
  const [SURVEY_MAX_FILE_SIZE_BYTES, setMaxFileSize] = useState(0);
  const [storage, setStorage] = useState(sessionStorage);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFileValid, setIsFileValid] = useState(false);
  const [currentUserStaffKey, setCurrentUserStaffKey] = useState(null);
  const [surveyToUpdate, setSurveyToUpdate] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [surveyName, setSurveyName] = useState('');
  const [progress, setProgress] = useState(0);
  const [fileStatusMessage, setFileStatusMessage] = useState<FileStatus>(null);
  const [jobStatusTimer, setJobStatusTimer] = useState(null);
  const [surveyList, setSurveyList] = useState<SurveyStatus[]>(null);
  const [title, setTitle] = useState('');
  const [uploadFileLabelText, setUploadFileLabelText] = useState(DEFAULT_UPLOAD_LABEL);
  const [fileStatusClassName, setFileStatusClassName] = useState(DEFAULT_UPLOAD_LABEL);
  const [fileUploaded, setFileUploaded] = useState<File>(null);

  useEffect(() => {
    setMaxFileSize(api.survey.SURVEY_MAX_FILE_SIZE_BYTES);
    setStorage(sessionStorage);
    setCurrentUserStaffKey(api.authentication.currentUserValue.teacher.staffkey);
    setSurveyToUpdate(null);
    setProgress(0);
    setIsFileSelected(false);
    setIsFileUploading(false);
    setQueryTime(5000);
    loadLastUploadedSurvey();
    OnInit();
  }, []);

  useEffect(()=>{
    const fileClassName =
          (fileStatusMessage
          && (fileStatusMessage.error
          || (fileStatusMessage.serverJobStatus
              && fileStatusMessage.serverJobStatus.jobstatuskey !== 3)))
          ? 'alert-warning'
          : (!fileStatusMessage
            || (!fileStatusMessage.error
                  && fileStatusMessage.serverJobStatus
                 && fileStatusMessage.serverJobStatus.jobstatuskey === 3))
                 ? 'alert-success' : '';
    setFileStatusClassName(fileClassName);
  },[fileStatusMessage]);
  const cancelUploadStatusChecking = ()=> {
    if (jobStatusTimer) {
      clearTimeout(jobStatusTimer);
      setJobStatusTimer(null);
    }
  }

  const resetFileStatusMessage = () => {
    setFileStatusMessage(
      {
        fileName: '',
        isValid: false,
        status: '',
        error: null,
        jobId: null,
        serverJobStatus: null
      }
    );
  };

  const createFileStatusMessage = (fileStatus: FileStatus): FileStatus => {
    if (!fileStatus || !fileStatus.fileName) {
      return fileStatusMessage;
    }
    const newFileStatus = fileStatus ? (
        {
          fileName: fileStatus.fileName,
          isValid: fileStatus.isValid,
          status: fileStatus.status,
          error: fileStatus.error,
          jobId: fileStatus.jobId,
          serverJobStatus: fileStatus.serverJobStatus
        }
      ) :
      (
        {
          fileName: '',
          isValid: false,
          status: '',
          error: null,
          jobId: null,
          serverJobStatus: null
        }
      );
   return newFileStatus;
  }

   const OnInit = async () => {
    if (surveyKey && surveyKey.length > 0) {
      const userSurveyList = await (api.survey.getSurveyStatus(
        api.authentication.currentUserValue.teacher.staffkey, null));
      if (userSurveyList) {
        setSurveyList(userSurveyList);
        setSurveyToUpdate(userSurveyList.find(el => el.surveykey === +surveyKey));
      }
    }
  };

  const loadLastUploadedSurvey = () => {
    const message = JSON.parse(storage.getItem('lastUploadedSurvey'));
    if (message && message.serverJobStatus && !api.survey.JOB_STATUS_FINISH_IDS.includes(message.serverJobStatus.jobstatuskey)) {
      setFileStatusMessage(createFileStatusMessage(message));
      GetJobStatus(message.serverJobStatus.staffkey, message.serverJobStatus.jobkey, message);
    } else {
      resetFileStatusMessage();
      return undefined;
    }
    return message;
  }

  const saveLastUploadedSurvey = (message: FileStatus) => {
    if (message && message.fileName && message.fileName.length > 0) {
      storage.setItem('lastUploadedSurvey', JSON.stringify(message));
    }
  }

  const CheckFileValid = (file: File): FileStatus => {
    if (!file) {
      return { fileName: '', status: 'ERROR', error: 'No file selected', isValid: false };
    }
    if (file.size > SURVEY_MAX_FILE_SIZE_BYTES) {
      const error = `File size (${(file.size / 1024.0).toFixed(2)} Kb) must be less than ${(SURVEY_MAX_FILE_SIZE_BYTES / (1024)).toFixed(2)} Kb`;
      const message = { fileName: file.name, status: 'ERROR', error: error, isValid: false };
      return message;
    }
    return { fileName: file.name, status: 'VALID', isValid: true };
  }

  const prepareFilesList = (files: any) => {
    cancelUploadStatusChecking();
    const file = files[0];
    const status = CheckFileValid(file);
    if (!status.isValid) {
      setFileStatusMessage(createFileStatusMessage(status));
      setIsFileValid(false);
      return;
    }
    resetFileStatusMessage();
    setUploadFileLabelText(file.name);
    setIsFileValid(true);
    setFileUploaded(file);
    setIsFileSelected(file !== null);
  }

  const onDragOver = e => {
    const event = e as Event;
    event.stopPropagation();
    event.preventDefault();
  };

  const allowDrop = ev => {
    ev.preventDefault();
  };

  const onFileDropped = files => {
    files.preventDefault();
    prepareFilesList(files.dataTransfer.files);
  };

  const onSelectSurvey = event => {
    prepareFilesList((event.target as HTMLInputElement).files);
  };

  const submitSurvey = async(e) => {
    validateForm();
    e.preventDefault();
    const file = fileUploaded as File;
    const status = CheckFileValid(file);
    if (!status.isValid) {
      setFileStatusMessage(createFileStatusMessage(status));
      return;
    }
    setIsFileUploading(true);
    const content = await getFileContentAsBase64(file);
    try {
      const uploadedFileStatus = await api.survey
      .uploadSurvey(currentUserStaffKey, title, content, surveyToUpdate ? surveyToUpdate.surveykey : null);
      await setFileStatusMessage(createFileStatusMessage({
        fileName: file.name,
        status: 'ACCEPTED',
        isValid: true,
        serverJobStatus: uploadedFileStatus}));
      saveLastUploadedSurvey({
        fileName: file.name,
        status: 'ACCEPTED',
        isValid: true,
        serverJobStatus: uploadedFileStatus
      });
      await loadLastUploadedSurvey();
      resetControl();
      if (!api.survey.JOB_STATUS_FINISH_IDS.includes(uploadedFileStatus.jobstatuskey)) {
        /* Job is not finished */
        setJobStatusTimer(setTimeout(
          () => GetJobStatus(uploadedFileStatus.staffkey, uploadedFileStatus.jobkey, fileStatusMessage),
          SURVEY_STATUS_QUERY_TIME_IN_MS));
      }
      } catch (ex) {
        setFileStatusMessage(createFileStatusMessage({ fileName: file.name, status: 'ERROR', error: ex, isValid: true }));
        resetControl();
      }
  };

  const GetJobStatus = async(staffkey: number, jobkey: string, statusMessage: FileStatus) => {
    const values = await api.survey.getSurveyStatus(staffkey, jobkey);
    const value = values.length > 0 ? values[0] : null;
    if (!statusMessage || !(statusMessage && statusMessage.fileName && statusMessage.fileName.length > 0)) {
      /* If message don't have value, don't try to check file status. Probably
      the user selected a new file to upload. */
      return;
    }
    setFileStatusMessage(createFileStatusMessage({...statusMessage, serverJobStatus: value}));
    saveLastUploadedSurvey(fileStatusMessage);
    setJobStatusTimer(null);
    if (value && !api.survey.JOB_STATUS_FINISH_IDS.includes(value.jobstatuskey)) {
      /* Job is not finished */
      setJobStatusTimer(setTimeout(
        () => GetJobStatus(value.staffkey, value.jobkey, fileStatusMessage),
        SURVEY_STATUS_QUERY_TIME_IN_MS));
    }
  }

  const getFileContentAsBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = () => {
        reader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      reader.onload = () => {
        resolve(btoa(reader.result as string));
      };

      reader.readAsBinaryString(file);
    });
  }
  const validateForm = () => {
    if (surveyName.length > 0 && isFileValid) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
      return;
    }
  };

  const onChangeSurveyName = e => {
    setSurveyName(e.target.value);
    setTitle(e.target.value);
    validateForm();
  };
  const resetControl = () => {
    setSurveyName('');
    setProgress(0);
    setIsFileSelected(false);
    setIsFileUploading(false);
    setFileUploaded(null);
    setIsFileValid(false);
    setUploadFileLabelText(DEFAULT_UPLOAD_LABEL);
  }

  return (
    <Fragment>
      <div className='container'>
        <div className='position-relative p-t-10'>
          <a className='btn-outline-nav inline-block position-relative' style={{ top: '-10px', left: '0px' }}
            href='javascript:history.back(-1)'>
            <i className='ion ion-md-arrow-dropleft f-s-37 position-absolute' style={{ top: '-1px', left: '10px' }}></i>
          </a>
          <h1 className='inline-block position-absolute' style={{ top: '3px', left: '44px' }}>Upload <span>survey</span></h1>
        </div>

        {surveyToUpdate && (
          <div className='row'>
            <div className='col'>
              <div className='card'>
                <div className='card-body'>
                  <h2>You are currently updating the {surveyToUpdate.resultSummaryObj.survey.title} survey</h2>
                </div>
              </div>
            </div>
          </div>
        )
        }
        <div className='row'>
          <div className='col'>
            <div className='card'>
              <div className='card-body'>
                <form onSubmit={submitSurvey}>
                  <div className='container text-center p-b-10'
                    onDrop={onFileDropped}
                    onDragLeave={ev => ev.preventDefault()}
                    onDragEnter={ev => ev.preventDefault()}
                    onDragOverCapture={onDragOver} onDragOver={onDragOver}>
                    <p className='icon ion-md-cloud-upload f-s-50'></p>
                    <h3>Drag and drop file here</h3>
                    <h3>or</h3>
                    <div className='custom-file'>
                      <input type='file' onChange={onSelectSurvey}
                        disabled={isFileUploading} className='custom-file-input' id='inputGroupFile01'
                        accept='text/csv' />
                      <label className='custom-file-label'>{uploadFileLabelText}</label>
                    </div>
                  </div>
                  <div className='form-group'>
                    <input type='text' className='form-control' placeholder='Survey Name' onChange={onChangeSurveyName} value={surveyName} />
                    {(surveyName.length === 0 && isFileValid)
                      ? <label className='label alert-danger text-justify w-100'> * Survey name is required </label>
                      : null}
                  </div>
                  <div className='form-group'>
                    <button type='submit' className='btn btn-primary btn-block btn-lg'
                      disabled={!isFormValid}>Upload survey</button>
                  </div>
                  {(progress > 0)
                    ?
                    <div className='progress form-group'>{// TODO Progress bar style.width.%={progress}
                    }
                      <div className='progress-bar progress-bar-striped bg-success' role='progressbar'>
                      </div>
                    </div>
                    : null
                  }
                  {fileStatusMessage
                    && fileStatusMessage.fileName
                    && fileStatusMessage.fileName.length > 0
                    ?
                    <div
                      className={fileStatusClassName}>
                      <h3>File Upload <strong>{fileStatusMessage.status}</strong></h3>
                      File: {fileStatusMessage.fileName}<br />
                      {fileStatusMessage.serverJobStatus
                        ?
                        <Fragment>
                          <h3>Job is <strong>{fileStatusMessage.serverJobStatus.jobstatus.description}</strong></h3>
                          Job Key: {fileStatusMessage.serverJobStatus.jobkey}<br />
                          {fileStatusMessage.serverJobStatus.resultSummaryObj
                            ?
                            <Fragment>
                              <h3>Job Results</h3>
                                Survey Key:{fileStatusMessage.serverJobStatus.resultSummaryObj.survey.surveykey}<br />
                                Survey Title: {fileStatusMessage.serverJobStatus.resultSummaryObj.survey.title}<br />
                                Questions: {fileStatusMessage.serverJobStatus.resultSummaryObj.survey.questions}<br />

                                Answers Loaded: {fileStatusMessage.serverJobStatus.resultSummaryObj.process.load}<br />
                                Answers Rejected: {fileStatusMessage.serverJobStatus.resultSummaryObj.process.rejected}<br />
                                Answers Already Loaded: {fileStatusMessage.serverJobStatus.resultSummaryObj.process.alreadyLoaded}<br />
                            </Fragment>
                            : null
                          }
                          {(!fileStatusMessage.serverJobStatus.resultSummaryObj && fileStatusMessage.serverJobStatus.resultsummary)
                            ?
                            <div className='alert'>
                              {fileStatusMessage.serverJobStatus.resultsummary}
                            </div>
                            : null
                          }
                        </Fragment>
                        : null
                      }
                      {fileStatusMessage.error
                        ?
                        <p>{fileStatusMessage.error}</p>
                        : null
                      }
                    </div>
                    : null}
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <div className='card-body alert alert-primary text-justify' lang='en'
              style={{ hyphens: 'auto', marginTop: '-1rem', paddingBottom: '0' }}>
              <p>One column in the survey results must be the unique student identifier and must be called "StudentUniqueId".
        </p>
              <p>Supports Google Forms and Survey Monkey formatted exports. You can also use Qualtrics survey exports by
          removing the first of the two headers.</p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );

};

