// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import GlobalFonts from '../../globalstyle';

import BuzzTheme, { HeadlineContainer, MainContainer, TitleSpanContainer, TotalRecordsContainer } from '../../buzztheme';

// import { ApiService } from 'src/app/Services/api.service';
import { Student } from '../../Models/Student';
import { Section } from '../../Models/Section';
import { SearchInSections } from '../../Components/SearchInSections/searchInSections';
import { StudentCard } from './studentCard';
import { StudentTable } from './studentTable';


export interface StudentRosterComponentProps {
  title?: string;
  onClick?: () => void;/* ;
  api: ApiService;*/
}

const ListButtons = styled.div`
  @media (min-width: 769px) {
    flex: 1;
    display: flex;
    align-self: flex-end;
    justify-content: flex-end;
  }

  @media (max-width: 768px) {
    display: none;
  }

  & > button {
    margin: 0px;
    font: ${(props) => props.theme.fonts.regular};
    background-color: var(--white);
    border: none;
    text-decoration: none;

    :hover {
      outline-width: 0px;
      font-weight: 600;
      text-decoration: underline;
    }
    :focus {
      outline-width: 0px;
    }
  }
`;

export const StudentRoster: FunctionComponent<StudentRosterComponentProps> = (props: StudentRosterComponentProps) => {

  document.title = 'EdFi Buzz: Student Roster';

  const [sectionList, setSections] = useState([] as Section[]);
  const [studentList, setStudentList] = useState([] as Student[]);
  const [selectedSectionKey, setSelectedSectionKey] = useState('');
  enum ViewTypeEnum {
    Card,
    Grid,
  }
  const [viewType, setViewType] = useState(ViewTypeEnum.Card);

  // if (!sectionList || sectionList.length === 0) {
  //   props.api.section.getByTeacherId().then((sectionsValue) => {
  //     setSections(sectionsValue);
  //     onSearchHandle(sectionsValue[0].sectionkey, null);
  //   });
  // }

  function onSearchHandle(sectionKey: string, studentFilter: string) {
    // props.api.student.get(sectionKey, studentFilter).then((studentsValue) => {
    //   setStudentList(studentsValue);
    //   setSelectedSectionKey(sectionKey);
    // });
  }

  return (
    <>
      <GlobalFonts />
      <ThemeProvider theme={BuzzTheme}>
        <MainContainer role='main' className='container'>
          <HeadlineContainer>
            <TitleSpanContainer>Your students</TitleSpanContainer>
            <TotalRecordsContainer>Total {studentList.length}</TotalRecordsContainer>
          </HeadlineContainer>
          <SearchInSections sectionList={sectionList} onSearch={onSearchHandle} defaultValue={selectedSectionKey} />

          {studentList.length > 0 && (
            <ListButtons>
              <span>View Style:</span>
              <button onClick={() => setViewType(ViewTypeEnum.Grid)}>Grid</button>|
              <button onClick={() => setViewType(ViewTypeEnum.Card)}>Cards</button>
            </ListButtons>
          )}

          <div className='row'>
            {viewType === ViewTypeEnum.Card && studentList &&
            studentList
              .sort((a, b) => a.studentlastname?.localeCompare(b.studentlastname))
              .map((si) => (
                <div className='col-lg-4' key={si.studentschoolkey}>
                  <StudentCard student={si} />
                </div>
              ))}
            {viewType === ViewTypeEnum.Grid && (
              <div className='card' style={{ width: '100%' }}>
                <div className='card-body table-responsive-md'>
                  <StudentTable studentList={studentList} />
                </div>
              </div>
            )}
          </div>
        </MainContainer>
      </ThemeProvider>
    </>
  );
};
