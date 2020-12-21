/*
 * SPDX-License-Identifier: Apache-2.0
 * Licensed to the Ed-Fi Alliance under one or more agreements.
 * The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
 * See the LICENSE and NOTICES files in the project root for more information.
 */

import * as React from 'react';
import { FunctionComponent, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { useParams } from 'react-router-dom';

import ApiService from '../../Services/ApiService';
import { Student,
  Teacher,
  ContactPerson,
  Attendance,
  Assessment,
  Demographic
} from '../../Models';
import { EmailIcon, LeftArrowIcon, StarIcon } from '../../common/Icons';
import { StudentDetailContactCard } from './StudentDetailContactCard';
import { StudentDetailSurvey } from './StudentDetailSurvey';
import { StudentDetailNotesContainer } from './StudentDetailNotesContainer';
import { StudentDetailAttendance } from './StudentDetailAttendance';
import { StudentDetailAssessment } from './StudentDetailAssessment';
import { StudentDetailDemographics } from './StudentDetailDemographics';

const StudentDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  .student-detail-top {
    display: flex;
    flex: 1;
    flex-direction: column;
    width: 100%;
    background-color: var(--white-lilac);
    padding-left: .2rem;
    padding-top: .5rem;
  }

  .student-detail-bottom {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    background-color: white;
    padding: 2rem;
  }

  .student-detail-go-back-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 2rem;
    margin-bottom: 0.5rem;

    & > div {
      padding: 0.3rem;
      width: min-content;
      flex: 1;
      height: auto;
      justify-content: flex-start;
    }

    & > img {
      height: auto;
      width: auto;
      align-self: center;
      justify-self: center;
    }
  }

  .student-detail-profile-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    padding-bottom: 1.4rem;
  }

  .student-detail-profile-pic-container {
    display: flex;
    flex-direction: row;
    flex: 1;
    align-content: flex-start;
  }

  .student-detail-go-back-label {
    flex: 1;
    justify-items: flex-start;
    color: var(--denim);
  }

  .student-detail-name {
    justify-self: center;
  }

  .student-profile-grade-level {
    color: var(--nevada);
    font-style: italic;
  }

  .student-profile-pic {
    @media(max-width:768px){
      width: 49px;
      height: 49px;
    }

    @media(min-width:769px){
      width: 98px;
      height: 98px;
    }
  }

  .image-container {
    border-radius: 0;
    padding-right: .5rem;
    align-items: flex-start;
  }

  .student-detail-profile-info-container {
    display: flex;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    @media (min-width: 769px) {
      flex-direction: row;
      width: fit-content;
      justify-content: space-around;
      & > div {
        justify-content: flex-start;
      }
    }
  }

  .student-detail-profile-info-primary-contact {
    min-width: 20rem;
  }

  .student-profile-email {
    min-width: 15rem;
  }

  .student-detail-guardians-siblings-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 1.5rem;

    .label {
      display: flex;
      justify-content: flex-start;
      padding-bottom: 1rem;
    }
  }

  .guardians-siblings {
    flex: 1;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-color: var(--iron);
    scrollbar-width: 0.1rem;

    & > div {
      flex: 1;
    }
  }

  .student-detail-tabbed-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .student-detail-tabs {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    color: var(--shark);
    border-bottom: 1px solid var(--iron);
    overflow-x: auto;

    & > div {
      max-width: fit-content;
      margin-right: 1.5rem;
      flex: 1;
      justify-content: flex-start;
      font-size: 18px;
    }
  }

  .student-detail-notes-area-container,
  .student-detail-tabbed-area-container {
    padding-top: 1.5rem;
  }

  .survey-notes-container-tab {
    cursor: pointer;
  }

  .survey-notes-tab-selected {
    font-weight: bold;
    font-weight: 600;
    border-bottom: 6px solid var(--mystic-grape);
  }

  .survey-notes-tab-unselected {
    font-weight: 400;
    border-bottom: none;
  }

  .survey-notes-area-selected {
    display: flex;
  }

  .survey-notes-area-unselected {
    display: none;
  }

  .student-surveys-container {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--iron);

    & > div {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }
  }

  .student-detail-notes-container {
    width: 100%;
    display: flex;
    flex-direction: column;

    & > div {
      flex: 1;
      width: 100%;
    }
  }
`;

export interface StudentDetailProps {
  api: ApiService;
}

export const StudentDetail: FunctionComponent<StudentDetailProps> = (props: StudentDetailProps) => {

  document.title = 'EdFi Buzz: Student Details';

  enum ActiveTabEnum {
    Surveys = 'SURVEYS',
    Notes = 'NOTES',
    AttendanceData = 'ATTENDANCEDATA',
    AssessmentData = 'ASSESSMENT',
    DemographicsData = 'DEMOGRAPHICS'
  }

  const selectedTabClassName = 'survey-notes-container-tab survey-notes-tab-selected';
  const unselectedTabClassName = 'survey-notes-container-tab survey-notes-tab-unselected';
  const selectedAreaClassName = 'survey-notes-container-tab survey-notes-area-selected';
  const unselectedAreaClassName = 'survey-notes-container-tab survey-notes-area-unselected';
  const surveyContainerClassName = 'student-surveys-container';
  const notesContainerClassName = 'notes-container';
  const assessmentContainerClassName = 'notes-container';
  const demographicsContainerClassName = 'notes-container';

  const [student, setStudent] = useState<Student>();
  const [contacts, setContacts] = useState<Array<ContactPerson>>();
  const [siblings, setSiblings] = useState<Array<Student>>();
  const [primaryContact, setPrimaryContact] = useState<ContactPerson>();
  const [currentTeacher, setCurrentTeacher] = useState<Teacher>();
  const [attendanceData, setAttendanceData] = useState<Attendance>();
  const [assessmentData, setAssessmentData] = useState<Assessment[]>();
  const [demographicsCharacteristicsData, setDemographicsCharacteristicsData] = useState<Demographic[]>();
  const [demographicsProgramsData, setDemographicsProgramsData] = useState<Demographic[]>();
  const [tabSelected, setTabSelected] = useState<string>();

  const notesTabRef = React.createRef<HTMLDivElement>();
  const surveyTabRef = React.createRef<HTMLDivElement>();
  const attendanceTabRef = React.createRef<HTMLDivElement>();
  const assessmentTabRef = React.createRef<HTMLDivElement>();
  const demographicsTabRef = React.createRef<HTMLDivElement>();
  const notesAreaRef = React.createRef<HTMLDivElement>();
  const surveyAreaRef = React.createRef<HTMLDivElement>();
  const attendanceAreaRef = React.createRef<HTMLDivElement>();
  const assessmentAreaRef = React.createRef<HTMLDivElement>();
  const demographicAreaRef = React.createRef<HTMLDivElement>();

  interface ParamTypes {
    studentKey: string;
  }

  const { studentKey } = useParams<ParamTypes>();

  const getAttendanceData = useCallback(async (studentSchoolKey: string) => {
    await props.api.attendance.getAttendanceData(studentSchoolKey).then((result) => {
      setAttendanceData(result);
    });
  }, [props.api.attendance]);

  const getAssessmentData = useCallback(async (studentSchoolKey: string) => {
    await props.api.assessment.getAssessmentData(studentSchoolKey).then((result) => {
      setAssessmentData(result);
    });
  }, [props.api.assessment]);

  const getDemographicsData = useCallback(async (studentSchoolKey: string) => {
    await props.api.demographics.getDemographicsCharacteristicsData(studentSchoolKey).then((result) => {
      setDemographicsCharacteristicsData(result);
    });
    await props.api.demographics.getDemographicsProgramsData(studentSchoolKey).then((result) => {
      setDemographicsProgramsData(result);
    });
  }, [props.api.demographics]);

  const toggleTabVisibility = useCallback((tab: string) => {
    if (!notesTabRef.current
        || !surveyTabRef.current
        || (attendanceData && !attendanceTabRef.current)
        || (assessmentData && assessmentData.length > 0 && !assessmentTabRef.current)
        || !notesAreaRef.current
        || !surveyAreaRef.current
        || (attendanceData && !attendanceAreaRef.current)
        || (assessmentData && assessmentData.length > 0  && !assessmentAreaRef.current)
        || ((demographicsCharacteristicsData || demographicsProgramsData) && !attendanceAreaRef.current)
        || (((demographicsCharacteristicsData && demographicsCharacteristicsData.length > 0)
          || (demographicsProgramsData && demographicsProgramsData.length > 0))  && !demographicAreaRef.current)
    ) {
      return;
    }

    setTabSelected(tab);

    switch (tab) {
      case ActiveTabEnum.Surveys:
        notesTabRef.current.className = unselectedTabClassName;
        notesAreaRef.current.className = `${unselectedAreaClassName}`;
        if(attendanceData){
          attendanceTabRef.current.className = unselectedTabClassName;
          attendanceAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        surveyTabRef.current.className = selectedTabClassName;
        surveyAreaRef.current.className = `${surveyContainerClassName} ${selectedAreaClassName}`;
        if(assessmentData && assessmentData.length > 0){
          assessmentTabRef.current.className = unselectedTabClassName;
          assessmentAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        if((demographicsCharacteristicsData && demographicsCharacteristicsData.length > 0)
            || (demographicsProgramsData && demographicsProgramsData.length > 0)){
          demographicsTabRef.current.className = unselectedTabClassName;
          demographicAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        break;
      case ActiveTabEnum.AttendanceData:
        surveyTabRef.current.className = unselectedTabClassName;
        surveyAreaRef.current.className = `${unselectedAreaClassName}`;
        notesTabRef.current.className = unselectedTabClassName;
        notesAreaRef.current.className = `${unselectedAreaClassName}`;
        attendanceTabRef.current.className = selectedTabClassName;
        attendanceAreaRef.current.className = `${surveyContainerClassName} ${selectedAreaClassName}`;
        if(assessmentData && assessmentData.length > 0){
          assessmentTabRef.current.className = unselectedTabClassName;
          assessmentAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        if((demographicsCharacteristicsData && demographicsCharacteristicsData.length > 0)
            || (demographicsProgramsData && demographicsProgramsData.length > 0)){
          demographicsTabRef.current.className = unselectedTabClassName;
          demographicAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        break;
      case ActiveTabEnum.Notes:
        surveyTabRef.current.className = unselectedTabClassName;
        surveyAreaRef.current.className = `${unselectedAreaClassName}`;
        if(attendanceData){
          attendanceTabRef.current.className = unselectedTabClassName;
          attendanceAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        notesTabRef.current.className = selectedTabClassName;
        notesAreaRef.current.className = `${notesContainerClassName} ${selectedAreaClassName}`;
        if(assessmentData && assessmentData.length > 0){
          assessmentTabRef.current.className = unselectedTabClassName;
          assessmentAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        if((demographicsCharacteristicsData && demographicsCharacteristicsData.length > 0)
            || (demographicsProgramsData && demographicsProgramsData.length > 0)){
          demographicsTabRef.current.className = unselectedTabClassName;
          demographicAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        break;
      case ActiveTabEnum.AssessmentData:
        surveyTabRef.current.className = unselectedTabClassName;
        surveyAreaRef.current.className = `${unselectedAreaClassName}`;
        notesTabRef.current.className = unselectedTabClassName;
        notesAreaRef.current.className = `${unselectedAreaClassName}`;
        if(attendanceData){
          attendanceTabRef.current.className = unselectedTabClassName;
          attendanceAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        if((demographicsCharacteristicsData && demographicsCharacteristicsData.length > 0)
            || (demographicsProgramsData && demographicsProgramsData.length > 0)){
          demographicsTabRef.current.className = unselectedTabClassName;
          demographicAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        assessmentTabRef.current.className = selectedTabClassName;
        assessmentAreaRef.current.className = `${assessmentContainerClassName} ${selectedAreaClassName}`;
        break;
      case ActiveTabEnum.DemographicsData:
        surveyTabRef.current.className = unselectedTabClassName;
        surveyAreaRef.current.className = `${unselectedAreaClassName}`;
        notesTabRef.current.className = unselectedTabClassName;
        notesAreaRef.current.className = `${unselectedAreaClassName}`;
        if(attendanceData){
          attendanceTabRef.current.className = unselectedTabClassName;
          attendanceAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        if(assessmentData && assessmentData.length > 0){
          assessmentTabRef.current.className = unselectedTabClassName;
          assessmentAreaRef.current.className = `${unselectedAreaClassName}`;
        }
        demographicsTabRef.current.className = selectedTabClassName;
        demographicAreaRef.current.className = `${demographicsContainerClassName}`;
        break;
      default:
        break;
    }
  }, [ActiveTabEnum.Notes,
    ActiveTabEnum.Surveys,
    ActiveTabEnum.AttendanceData,
    ActiveTabEnum.AssessmentData,
    ActiveTabEnum.DemographicsData,
    notesAreaRef,
    notesTabRef,
    surveyAreaRef,
    surveyTabRef,
    attendanceAreaRef,
    attendanceTabRef,
    assessmentAreaRef,
    assessmentTabRef,
    demographicAreaRef,
    demographicsTabRef,
    assessmentData,
    attendanceData,
    demographicsCharacteristicsData,
    demographicsProgramsData
  ]);

  useEffect(() => {
    toggleTabVisibility(tabSelected);
  }, [toggleTabVisibility, tabSelected]);

  useEffect(() => {
    let cancel = false;
    const getStudent = async (): Promise<Student> => {
      const result = await props.api.student.getById(studentKey);
      if (cancel) {
        return null;
      }
      return result;
    };

    try {
      setCurrentTeacher(props.api.authentication.currentUserValue.teacher);
      getStudent().then((result: Student) => {
        if (result) {
          setStudent(result);
          setContacts(result.contacts);
          setSiblings(result.siblings);
          const pc = result.contacts.filter((c) => c.isprimarycontact === true)[0] || result.contacts[0];
          setPrimaryContact(pc);
          getAttendanceData(result.studentschoolkey);
          getAssessmentData(result.studentschoolkey);
          getDemographicsData(result.studentschoolkey);
        }
      });
    } catch (error) {
      console.error(error);
    }

    return () => {
      cancel = true;
    };
  }, [props.api.authentication.currentUserValue.teacher,
    props.api.student,
    studentKey,
    getAttendanceData,
    getAssessmentData,
    getDemographicsData]);

  toggleTabVisibility(ActiveTabEnum.Surveys);

  return (
    <>
      {student && (
        <StudentDetailContainer>
          <div className='student-detail-top'>
            <a href={'/'} className='student-detail-go-back-container' tabIndex={0}>
              <LeftArrowIcon />
              <div className='student-detail-go-back-label'>Go back to Class Roster</div>
            </a>
            <div className='student-detail-profile-container'>
              <div className='student-detail-profile-pic-container'>
                <div className='image-container'>
                  <img className='student-profile-pic' src={student.pictureurl} alt={`${student.name} Profile`} />
                </div>
                <div className='student-detail-name'>
                  <h1>{student.name}</h1>
                  {student.gradelevel && <div className='student-profile-grade-level'>Grade: {student.gradelevel}</div>}
                  <div className='student-detail-profile-info-container'>
                    {student.primaryemailaddress && (
                      <div className='student-profile-email'>
                        <EmailIcon />
                        <a
                          className='text-ellipsis'
                          href={`mailto:${student.primaryemailaddress}`}
                          title={student.primaryemailaddress}
                          tabIndex={0}
                        >
                          {student.primaryemailaddress}
                        </a>
                      </div>
                    )}
                    {primaryContact && (
                      <div className='student-detail-profile-info-primary-contact'>
                        <StarIcon />
                        <span className='primary-contact-label'>Primary Contact:&nbsp;</span>
                        <span className='primary-contact-name'>
                          {`${primaryContact.contactfirstname} ${primaryContact.contactlastname}`}
                        </span>
                      </div>
                    )}
                    {!student.primaryemailaddress && <p className='alert alert-primary'>No email</p>}
                  </div>
                  <div className='student-detail-profile-pinned-info-container'></div>
                </div>
              </div>
            </div>
          </div>
          <div className='student-detail-bottom'>
            <div className='student-detail-guardians-siblings-container'>
              <div className='label h2-desktop'>Guardians&nbsp;/&nbsp;Siblings</div>
              <div className='guardians-siblings'>
                {contacts &&
                contacts.length > 0 &&
                contacts.map((contact, index) =>
                  <StudentDetailContactCard key={index}
                    firstname={contact.contactfirstname}
                    lastname={contact.contactlastname}
                    relationshiptostudent={contact.relationshiptostudent}
                    isSibling={false}
                    isprimarycontact={contact.isprimarycontact}
                    primaryemailaddress={contact.primaryemailaddress}
                    phonenumber={contact.phonenumber}
                    preferredcontactmethod={contact.preferredcontactmethod}
                    besttimetocontact={contact.besttimetocontact} />)}
                {siblings &&
                siblings.length > 0 &&
                siblings.map((sibling, index) =>
                  <StudentDetailContactCard key={index}
                    firstname={sibling.studentfirstname}
                    lastname={sibling.studentlastname}
                    relationshiptostudent={'Sibling'}
                    isSibling={true}
                    isprimarycontact={false}
                    primaryemailaddress={sibling.primaryemailaddress}
                    phonenumber={null}
                    preferredcontactmethod={null}
                    besttimetocontact={null} />
                )}
              </div>
            </div>
            <div className='student-detail-tabbed-container'>
              <div className='student-detail-tabs'>
                <div tabIndex={0}
                  role='button'
                  ref={surveyTabRef}
                  className={selectedTabClassName}
                  onClick={() => {
                    toggleTabVisibility(ActiveTabEnum.Surveys);
                  }}
                  onKeyPress={() => {
                    toggleTabVisibility(ActiveTabEnum.Surveys);
                  }}
                >
                Surveys
                </div>
                {attendanceData ?
                  <div tabIndex={0}
                    ref={attendanceTabRef}
                    className={unselectedTabClassName}
                    role='button'
                    onClick={() => {
                      toggleTabVisibility(ActiveTabEnum.AttendanceData);
                    }}
                    onKeyPress={() => {
                      toggleTabVisibility(ActiveTabEnum.AttendanceData);
                    }}
                  >
                  Attendance
                  </div>
                  : null }
                {assessmentData && assessmentData.length > 0 &&
                <div tabIndex={0}
                  ref={assessmentTabRef}
                  className={unselectedTabClassName}
                  role='button'
                  onClick={() => {
                    toggleTabVisibility(ActiveTabEnum.AssessmentData);
                  }}
                  onKeyPress={() => {
                    toggleTabVisibility(ActiveTabEnum.AssessmentData);
                  }}
                >
                Assessment
                </div>
                }
                {((demographicsCharacteristicsData && demographicsCharacteristicsData.length > 0)
                  || (demographicsProgramsData && demographicsProgramsData.length > 0)) &&
                <div tabIndex={0}
                  ref={demographicsTabRef}
                  className={unselectedTabClassName}
                  role='button'
                  onClick={() => {
                    toggleTabVisibility(ActiveTabEnum.DemographicsData);
                  }}
                  onKeyPress={() => {
                    toggleTabVisibility(ActiveTabEnum.DemographicsData);
                  }}
                >
                Demographics
                </div>
                }
                <div tabIndex={0}
                  ref={notesTabRef}
                  className={unselectedTabClassName}
                  role='button'
                  onClick={() => {
                    toggleTabVisibility(ActiveTabEnum.Notes);
                  }}
                  onKeyPress={() => {
                    toggleTabVisibility(ActiveTabEnum.Notes);
                  }}
                >
                Notes
                </div>
              </div>
              <div className='student-detail-tabbed-area-container'>
                <div ref={surveyAreaRef} className={`${surveyContainerClassName} ${selectedAreaClassName}`}>
                  {student.studentsurveys &&
                  student.studentsurveys.length > 0 &&
                  student.studentsurveys.map((survey, index) => <StudentDetailSurvey key={index} survey={survey} />)}
                </div>
                <div ref={notesAreaRef} className={`${notesContainerClassName} ${unselectedAreaClassName}`}>
                  <div className='student-detail-notes-container'>
                    <StudentDetailNotesContainer
                      staffkey={currentTeacher.staffkey}
                      apiService={props.api}
                      studentschoolkey={student.studentschoolkey}
                      notes={student.notes} />
                  </div>
                </div>
                <div ref={attendanceAreaRef} className={`${unselectedAreaClassName}`}>
                  {attendanceData &&
                    <StudentDetailAttendance
                      attendance={attendanceData}
                    /> }
                </div>
                {assessmentData && assessmentData.length > 0 &&
                <div ref={assessmentAreaRef} className={`${unselectedAreaClassName}`}>
                  <StudentDetailAssessment
                    assessment={assessmentData}
                  />
                </div>}
                {((demographicsCharacteristicsData && demographicsCharacteristicsData.length)
                    || (demographicsProgramsData && demographicsProgramsData.length)) > 0 &&
                <div ref={demographicAreaRef} className={`${unselectedAreaClassName}`}>
                  <StudentDetailDemographics
                    demographicsCharacteristics={demographicsCharacteristicsData}
                    demographicsPrograms={demographicsProgramsData}
                  />
                </div>}
              </div>
            </div>
          </div>
        </StudentDetailContainer>
      )}
    </>
  );
};
