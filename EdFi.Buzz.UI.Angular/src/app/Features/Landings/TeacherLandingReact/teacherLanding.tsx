import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

import './teacherLanding.css';
import { ApiService } from 'src/app/Services/api.service';
import { Student, Section } from 'src/app/Models';
import { SearchInSections } from 'src/app/Components/SearchInSectionsUIReact/searchInSections';
import { StudentCard } from 'src/app/Components/StudentCardReact/studentCard';
import { StudentTable } from './studentTable';

export interface TeacherLandingComponentProps {
  onClick?: () => void;
  api: ApiService;
}

export const TeacherLanding: FunctionComponent<TeacherLandingComponentProps> = (props: TeacherLandingComponentProps) => {

  const teacher = props.api.authentication.currentUserValue.teacher;
  const [sectionList, setSections] = useState(teacher.sections as Section[]);
  const [studentList, setStudentList] = useState([] as Student[]);
  const [selectedSectionKey, setSelectedSectionKey] = useState(null as string);
  enum ViewType { Card, Grid }
  const [viewType, setViewType] = useState(ViewType.Card); /* CARDS, GRID */

  if (null === selectedSectionKey && sectionList && sectionList.length > 0) {
    onSearchHandle(sectionList[0].sectionkey, null);
  }

  function onSearchHandle(sectionKey: string, studentFilter: string) {
    props.api.student
      .get(sectionKey, studentFilter)
      .then(studentsValue => {
        setStudentList(studentsValue);
        setSelectedSectionKey(sectionKey);
      });
  }

  return <main role='main' className='container'>
    <h1>Home, <span>class roster</span></h1>
    <SearchInSections sectionList={sectionList} onSearch={onSearchHandle} defaultValue={selectedSectionKey} />

    {(studentList.length > 0) &&
      <div className='row align-items-center m-b-10'>
        <div className='col'>
          <div className='d-flex justify-content-between'>
            <h2 className=''>Students: {studentList.length}</h2>
            <div className='d-flex' >
              <button className='btn btn-primary m-l-10'
                onClick={(e) => setViewType(ViewType.Grid)}><i className='ion ion-md-grid'></i></button>
              <button className='btn btn-primary m-l-10'
                onClick={(e) => setViewType(ViewType.Card)}><i className='ion ion-md-list'></i></button>
            </div>
          </div>
        </div>
      </div>}

    <div className='row' >
      {(viewType === ViewType.Card) && studentList
        .sort((a, b) => a.studentlastname.localeCompare(b.studentlastname))
        .map(si => <div className='col-lg-4' key={si.studentschoolkey}><StudentCard student={si} /></div>)
      }
      {(viewType === ViewType.Grid) &&
        <div className='card' style={{ 'width': '100%' }}>
          <div className='card-body table-responsive-md'>
            <StudentTable studentList={studentList} />
          </div>
        </div>
      }
    </div>

  </main>;
};
