import { Student } from "src/app/Models";
import { useState } from "react";
import * as React from "react";

import './StudentCard.css';

export interface StudentCardComponentProps {
  student: Student;
}

export function StudentCard(props: StudentCardComponentProps) {
  const student = props.student;
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (<div className="card">
    <div className="card-body p-t-0">

      <div className="d-flex p-t-12">
        <div>
          <a href={`#/app/studentDetail/${student.studentschoolkey}`}>
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

        <a href={`#/app/studentDetail/${student.studentschoolkey}`}
          className="btn btn-block btn-outline-primary btn-rounded mt-3">Survey Results</a>
        <hr />
        <h3>Notes</h3>
        {(student.contacts) &&
          student.contacts.map(contact => <p className="text-muted m-b-2" key={[student.studentschoolkey, contact.contactlastname, contact.contactfirstname].join()}>{contact.contactnotes}</p>)}
      </div>

    </div>

    <div className="card-footer">
      <i onClick={() => setIsCollapsed(!isCollapsed)}
        className={`ion rounded block text-center f-s-28 cursor-pointer ${isCollapsed ? 'ion-md-arrow-dropup-circle' : 'ion-md-arrow-dropdown-circle'}`}
        style={{ "color": "#03a9f4" }}></i>
    </div>
  </div >);
}
