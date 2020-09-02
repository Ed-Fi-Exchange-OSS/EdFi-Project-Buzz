// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { Fragment, useState, useEffect, FunctionComponent } from 'react';
import { SurveyStatus } from 'src/app/Models/survey';
import { ApiService } from 'src/app/Services/api.service';
import { MainContainer, HeadlineContainer, TitleSpanContainer } from 'src/buzztheme';
import styled from 'styled-components';

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

const SurveyUploadNote = styled.div`
hyphens: auto;
margin-bottom: 0;
padding-bottom: 0;
text-align: justify;
`;

const UpdateMessage = styled.h2`
text-align: justify;
hyphens: auto;
`;

const StyledFileInputLabel = styled.label`
  font-style: italic;
  text-align: justify;
  border-width: 2px;
  color: var(--slate-gray);
  overflow: hidden;

  &::after {
    height: auto;
  }
`;

const StyledTextParent = styled.div`
  @media (min-width: 769px) {
    flex: 1;
    display: flex;
    align-self: space-between;
    justify-content: space-between;
    flex-direction: row;
  }

  @media (max-width: 768px) {
    display: block;

    & > .label {
      width: 100%
    }
  }

  margin: 0.5rem 0;
  overflow: hidden;
  border: ${(props) => props.theme.border};
  border-radius: 4px;

  :focus-within {
    outline: none !important;
    border-color: var(--denim) !important;
  }

  & > input {
    height: 100%;
    padding: 10px 10px;
    border: none;
    position: relative;
    box-sizing: border-box;
    min-width: 15rem;
    width: 100%;

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

  & > .label  {
    margin: 0;
    padding: 10px 10px;
    min-width: max-content;
  }
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
`;

export const UploadSurvey: FunctionComponent<UploadSurveyProps> = (props: UploadSurveyProps) => {
  const DEFAULT_UPLOAD_LABEL = 'Choose survey file';
  const SURVEY_STATUS_QUERY_TIME_IN_MS = 5000;
  const { api, surveyKey } = props;
  const [SURVEY_MAX_FILE_SIZE_BYTES, setMaxFileSize] = useState(0);
  const [storage, setStorage] = useState(sessionStorage);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(true);
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
    loadLastUploadedSurvey();
    OnInit();
  }, []);

  useEffect(() => {
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
  }, [fileStatusMessage]);
  const cancelUploadStatusChecking = () => {
    if (jobStatusTimer) {
      clearTimeout(jobStatusTimer);
      setJobStatusTimer(null);
    }
  };

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
  };

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
  };

  const saveLastUploadedSurvey = (message: FileStatus) => {
    if (message && message.fileName && message.fileName.length > 0) {
      storage.setItem('lastUploadedSurvey', JSON.stringify(message));
    }
  };

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
  };

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
  };

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

  const submitSurvey = async (e) => {
    validateForm();
    e.preventDefault();
    const file = fileUploaded as File;
    const status = CheckFileValid(file);
    if (surveyName.length === 0) {
      setIsTitleValid(false);
      return;
    } else {
      setIsTitleValid(true);
    }
    if (!status.isValid) {
      setFileStatusMessage(createFileStatusMessage(status));
      return;
    }
    setIsFileUploading(true);
    const content = await getFileContentAsBase64(file);
    try {
      const uploadedFileStatus = await api.survey
        .uploadSurvey(currentUserStaffKey, title, content, surveyToUpdate ? surveyToUpdate.surveykey : null);
      const currentFileStatus = createFileStatusMessage({
        fileName: file.name,
        status: 'ACCEPTED',
        isValid: true,
        serverJobStatus: uploadedFileStatus
      });
      await setFileStatusMessage(currentFileStatus);
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
          () => GetJobStatus(uploadedFileStatus.staffkey, uploadedFileStatus.jobkey, currentFileStatus),
          SURVEY_STATUS_QUERY_TIME_IN_MS));
      }
    } catch (ex) {
      setFileStatusMessage(createFileStatusMessage({ fileName: file.name, status: 'ERROR', error: ex, isValid: true }));
      resetControl();
    }
  };

  const GetJobStatus = async (staffkey: number, jobkey: string, currentFileStatus: FileStatus) => {
    const values = await api.survey.getSurveyStatus(staffkey, jobkey);
    const value = values && values.length > 0 ? values[0] : null;
    const statusMessage = currentFileStatus ? currentFileStatus : fileStatusMessage;
    if (!statusMessage || !(statusMessage && statusMessage.fileName && statusMessage.fileName.length > 0)) {
      /* If message don't have value, don't try to check file status. Probably
      the user selected a new file to upload. */
      return;
    }
    if (value !== null) {
      setFileStatusMessage(createFileStatusMessage({ ...statusMessage, serverJobStatus: value }));
      saveLastUploadedSurvey(fileStatusMessage);
      setJobStatusTimer(null);
      if (value && !api.survey.JOB_STATUS_FINISH_IDS.includes(value.jobstatuskey)) {
        /* Job is not finished */
        setJobStatusTimer(setTimeout(
          () => GetJobStatus(value.staffkey, value.jobkey, statusMessage),
          SURVEY_STATUS_QUERY_TIME_IN_MS));
      }
    } else {
      setFileStatusMessage(createFileStatusMessage(statusMessage));
      setJobStatusTimer(setTimeout(
        () => GetJobStatus(staffkey, jobkey, statusMessage),
        SURVEY_STATUS_QUERY_TIME_IN_MS));
    }
  };

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
  };
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
  };

  return (
    <MainContainer role='main' className='container'>
      <HeadlineContainer>
        <TitleSpanContainer>Upload survey</TitleSpanContainer>
      </HeadlineContainer>

      {surveyToUpdate && (
        <div className='row'>
          <div className='col'>
            <div className='card'>
              <div className='card-body'>
                <UpdateMessage>You are updating the "{surveyToUpdate.resultSummaryObj.survey.title}" survey</UpdateMessage>
              </div>
            </div>
          </div>
        </div>
      )
      }

      <div className='row'>
        <div className='col'>
          <form onSubmit={submitSurvey}>

            <div className='text-center'
              onDrop={onFileDropped}
              onDragLeave={ev => ev.preventDefault()}
              onDragEnter={ev => ev.preventDefault()}
              onDragOverCapture={onDragOver} onDragOver={onDragOver}>
              <p className='icon ion-md-cloud-upload f-s-50'></p>
              <h3>Drag and drop file here</h3>
              <h3>or</h3>
              <div className='custom-file'>
                <input type='file' onChange={onSelectSurvey}
                  disabled={isFileUploading}
                  className='custom-file-input'
                  id='inputGroupFile01'
                  accept='text/csv' />
                <StyledFileInputLabel className='custom-file-label'>{uploadFileLabelText}</StyledFileInputLabel>
              </div>
            </div>

            <StyledTextParent>
              <input type='text'
                placeholder='Survey Name'
                onChange={onChangeSurveyName}
                value={surveyName} />
              {(!isTitleValid)
                ? <label className='label alert-danger text-justify'>Survey name is required</label>
                : null}
            </StyledTextParent>

            <div className='form-group'>
              <OutlineButton type='submit' className='outline-button'
                >Upload survey</OutlineButton>
            </div>

            {fileStatusMessage
              && fileStatusMessage.fileName
              && fileStatusMessage.fileName.length > 0
              ?
              <div
                className={`alert ${fileStatusClassName}`}>
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

      <div className='row'>
        <div className='col'>
          <SurveyUploadNote>
            <p>One column in the survey results must be the unique student identifier and must be
              called <em>StudentUniqueId</em>. Supports Google Forms and Survey Monkey formatted exports.
              You can also use Qualtrics survey exports by removing the first of the two headers.</p>
          </SurveyUploadNote>
        </div>
      </div>

    </MainContainer >
  );

};

