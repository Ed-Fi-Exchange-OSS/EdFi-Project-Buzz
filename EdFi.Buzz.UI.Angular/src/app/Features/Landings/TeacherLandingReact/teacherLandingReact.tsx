import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

import './teacherLandingReact.css';
import { ApiService } from 'src/app/Services/api.service';
import { Student, Section } from 'src/app/Models'

export interface IMyComponentProps {
  onClick?: () => void;
  api: ApiService;
}

function Search(props) {
  const sectionSelectionRef = React.createRef<HTMLSelectElement>();
  const studentFilterRef = React.createRef<HTMLInputElement>();

  function searchEventHandler(e) {
    const sectionkey = sectionSelectionRef.current.value;
    const studentFilter = studentFilterRef.current.value;
    props.onSearch(sectionkey, studentFilter);
  }

  return <div className="card">
    <div className="card-body" style={{ "padding": "1rem" }}>
      <div className="row">
        <div className="col-12 col-lg-12 form-group" style={{ "marginBottom": 0 }}>
          <label><h4> Filters </h4> </label>
          <div className="input-group">
            <select className="form-control" name="repeatSelect" id="sectionsSelect" ref={sectionSelectionRef} onChange={searchEventHandler}>
              <option value="null">Select a section</option>
              {props.sectionList.map(si => <option value={si.sectionkey} key={si.sectionkey}>{si.sessionname}</option>)}
            </select>
            <input type="text" className="form-control" id="studentNameInputs" placeholder="Student Name" ref={studentFilterRef} onKeyUp={searchEventHandler} />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button" onClick={searchEventHandler}><label>Search</label><i
                className="ion ion-md-search"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}


function StudentCard(props) {
  const student = props.student;
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (<div className="card">
    <div className="card-body p-t-0">

      <div className="d-flex p-t-12">
        <div>
          <a >
            <div className="image-container img-avatar img-size">
              <img src={student.pictureurl} alt={`{student.name} Profile Picture`} />
            </div>
          </a>
        </div>
        <div className="flex-grow-1 overflow-hidden">
          <h3 className="m-b-2 d-flex">{student.name}</h3>
          <p className="text-muted m-b-1">{student.studentkey}</p>
          {(student.primaryemailaddress) && <a className="m-b-2 text-ellipsis"
            href="mailto:{{student.primaryemailaddress}}" title="{{student.primaryemailaddress}}">
            {student.primaryemailaddress}
          </a>
          }
          {(!student.primaryemailaddress) && <p className="alert alert-primary">No email</p>}
        </div>
      </div>

      <div className={`${isCollapsed ? 'collapse' : ''}`}>
        {(student.contacts && student.contacts.length > 0) &&
          <span className="text-muted">
            {student.contacts[0].relationshiptostudent}: {student.contacts[0].contactlastname}, {student.contacts[0].contactfirstname}
            <a className="inline-block" href="tel:{{student.contacts[0].phone}}">{student.contacts[0].phonenumber}</a>
          </span>
        }
        {(!student.contacts || student.contacts.length === 0) &&
          <div className="alert alert-primary">Student have no contacts</div>
        }
      </div>


      <div className={`collapse ${isCollapsed ? 'show' : ''}`}>
        <hr />
        <h3>Primary Contact</h3>
        {(student.contacts && student.contacts.length > 0) &&
          <p className="m-l-10">
            <span className="text-muted block">{student.contacts[0].contactlastname}, {student.contacts[0].contactfirstname} ({student.contacts[0].relationshiptostudent})</span>
            <i className="icon ion-md-mail"></i>&nbsp;<a className="m-b-2 "
              href="mailto:{{student.contacts[0].primaryemailaddress}}">{student.contacts[0].primaryemailaddress}</a>
            <br />
            <i className="icon ion-md-phone-portrait"></i>&nbsp;<span className="text-muted"><a
              href="tel:{{student.contacts[0].phonenumber}}">{student.contacts[0].phonenumber}</a></span>
            <span className="text-muted block">{student.contacts[0].streetnumbername} {student.contacts[0].apartmentroomsuitenumber}</span>
          </p>}
        {(!student.contacts || student.contacts.length === 0) &&
          <div className="alert alert-primary">Student have no contacts</div>}

        {(student.contacts && student.contacts.length > 0) &&
          <h4>Preferred Contact Method: <span className="text-muted">{student.contacts[0].preferredcontactmethod}</span></h4> &&
          <h4>Best time to contact: <span className="text-muted">{student.contacts[0].besttimetocontact}</span></h4>}

        <a /*[routerLink]="['/app/studentDetail', student.studentschoolkey]"*/
          className="btn btn-block btn-outline-primary btn-rounded mt-3">Survey Results</a>
        <hr />
        <h3>Notes</h3>
        {(student.contacts && student.contacts.length > 0) &&
          (student.contacts[0].contactnotes || []).map(note =>
            <p className="text-muted m-b-2">{note}</p>)}
      </div>

    </div>

    <div className="card-footer">
      <i onClick={() => setIsCollapsed(!isCollapsed)}
        className={`ion rounded block text-center f-s-28 cursor-pointer ${isCollapsed ? 'ion-md-arrow-dropup-circle' : 'ion-md-arrow-dropdown-circle'}`}
        style={{ "color": "#03a9f4" }}></i>
    </div>
  </div >);
}

export const TeacherLandingReact: FunctionComponent<IMyComponentProps> = (props: IMyComponentProps) => {

  const [sectionList, setSections] = useState([] as Section[]);
  const [studentList, setStudentList] = useState([] as Student[]);

  if (!sectionList || sectionList.length === 0) {
    props.api.section.getByTeacherId().then(sectionsValue => {
      setSections(sectionsValue);
      props.api.student.get(sectionsValue[0].sectionkey).then(studentsValue => setStudentList(studentsValue));
    });
  }


  function onSearchHandle(sectionKey: string, studentFilter: string) {
    props.api.student.get(sectionKey, studentFilter).then(studentsValue => setStudentList(studentsValue));
  }

  return <main role="main" className="container">
    <h1>Home, <span>class roster</span></h1>

    <Search sectionList={sectionList} onSearch={onSearchHandle} />

    {(studentList.length > 0) &&
      <div className="row align-items-center m-b-10">
        <div className="col">
          <div className="d-flex justify-content-between">
            <h2 className="">Students: {studentList.length}</h2>
            <div className="d-flex" >
              <button className="btn btn-primary m-l-10" /*(click)="setView('Grid')"*/><i className="ion ion-md-grid"></i></button>
              <button className="btn btn-primary m-l-10" /*(click)="setView('List')"*/><i className="ion ion-md-list"></i></button>
            </div>
          </div>
        </div>
      </div>}


    <div className="row" >
      {studentList
        .sort((a, b) => a.studentlastname.localeCompare(b.studentlastname))
        .map(si => <div className="col-lg-4" key={si.studentschoolkey}><StudentCard student={si} /></div>)
      }
    </div>

  </main>;
};
