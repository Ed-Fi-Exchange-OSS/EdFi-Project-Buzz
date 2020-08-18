import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { ApiService } from 'src/app/Services/api.service';
import { Student, Section } from 'src/app/Models';
import { SearchInSections } from 'src/app/Components/SearchInSectionsUIReact/searchInSections';
import { StudentCard } from 'src/app/Components/StudentCardReact/studentCard';
import { StudentTable } from './studentTable';

export interface TeacherLandingComponentProps {
  onClick?: () => void;
  api: ApiService;
}

const StyledSearchInSections = styled(SearchInSections)``;

const TeacherHeadline = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

const TeacherLandingMainStyle = styled.main`
  font-family: ${(props) => props.theme.fonts.regular};
  background-color: ${(props) => props.theme.colors.white};
  padding: 15px;
`;

const YourStudentsSpan = styled.div`
  flex: 0 0 auto;
  margin-right: 2rem;
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: 24px;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${(props) => props.theme.colors.darkgray};
`;

const TotalStudentSpan = styled.div`
  @media (min-width: 769px) {
    flex: 3;
    flex-direction: row;
    justify-content: flex-start;
  }
  @media (max-width: 768px) {
    flex: 1;
    flex-direction: column;
  }
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: 14px;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: ${(props) => props.theme.colors.lightsteelblue};
`;

const FilterRow = styled.div`
  display: flex;

  & > label {
    display: block;
  }

  & > div {
    flex: 1;
  }
`;

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
    font-family: ${(props) => props.theme.fonts.regular};
    background-color: ${(props) => props.theme.colors.white};
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

export const TeacherLanding: FunctionComponent<TeacherLandingComponentProps> = (props: TeacherLandingComponentProps) => {
  const [sectionList, setSections] = useState([] as Section[]);
  const [studentList, setStudentList] = useState([] as Student[]);
  const [selectedSectionKey, setSelectedSectionKey] = useState(null as string);
  enum ViewType {
    Card,
    Grid,
  }
  const [viewType, setViewType] = useState(ViewType.Card); /* CARDS, GRID */

  if (!sectionList || sectionList.length === 0) {
    props.api.section.getByTeacherId().then((sectionsValue) => {
      setSections(sectionsValue);
      onSearchHandle(sectionsValue[0].sectionkey, null);
    });
  }

  function onSearchHandle(sectionKey: string, studentFilter: string) {
    props.api.student.get(sectionKey, studentFilter).then((studentsValue) => {
      setStudentList(studentsValue);
      setSelectedSectionKey(sectionKey);
    });
  }

  return (
    <TeacherLandingMainStyle role="main" className="container">
      <TeacherHeadline>
        <YourStudentsSpan className={'h1-desktop'}>Your students</YourStudentsSpan>
        <TotalStudentSpan>Total {studentList.length}</TotalStudentSpan>
      </TeacherHeadline>
      <FilterRow>
        <StyledSearchInSections sectionList={sectionList} onSearch={onSearchHandle} defaultValue={selectedSectionKey} />
      </FilterRow>

      {studentList.length > 0 && (
        <ListButtons>
          <span>View Style:</span>
          <button onClick={(e) => setViewType(ViewType.Grid)}>Grid</button>|
          <button onClick={(e) => setViewType(ViewType.Card)}>Cards</button>
        </ListButtons>
      )}

      <div className="row">
        {viewType === ViewType.Card &&
          studentList
            .sort((a, b) => a.studentlastname.localeCompare(b.studentlastname))
            .map((si) => (
              <div className="col-lg-4" key={si.studentschoolkey}>
                <StudentCard student={si} />
              </div>
            ))}
        {viewType === ViewType.Grid && (
          <div className="card" style={{ width: '100%' }}>
            <div className="card-body table-responsive-md">
              <StudentTable studentList={studentList} />
            </div>
          </div>
        )}
      </div>
    </TeacherLandingMainStyle>
  );
};
