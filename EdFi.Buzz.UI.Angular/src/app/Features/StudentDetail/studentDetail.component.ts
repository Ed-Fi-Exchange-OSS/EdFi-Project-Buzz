// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { Student, Teacher, Note } from 'src/app/Models';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-student-detail',
  templateUrl: './studentDetail.component.html',
  styleUrls: ['./studentDetail.component.css']
})
export class StudentDetailComponent implements OnInit {
  student: Student;
  studentId: string;
  editingNote: number;
  currentTeacher: Teacher;

  siblingsIsCollapsed: boolean;

  isSurveysVisible: boolean;
  isNotesVisible: boolean;

  @ViewChild('noteInput', {static: false}) noteInput: ElementRef;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.editingNote = -1;
    this.currentTeacher = this.api.authentication.currentUserValue.teacher;
    this.siblingsIsCollapsed = true;
    this.isSurveysVisible = true;
    this.isNotesVisible = false;
    this.student = new Student;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (!params.get('id')) {
        this.router.navigate(['/app']);
        return;
      }

      this.studentId = params.get('id');
      // Get the student Data
      this.api.student.getById(this.studentId).then(data => { this.student = data; } );
    });
  }

  addNote() {
    if (!this.student.notes) {
      this.student.notes = [];
    }
    this.editingNote = 0;
    const newId = this.student.notes.length > 0 ? Math.max(...this.student.notes.map(el => el.studentnotekey)) + 1 : 1;
    this.student.notes.unshift({
      studentnotekey: newId,
      note: `New note: ${newId}`,
      dateadded: new Date(),
      staffkey: this.currentTeacher.staffkey
    });
    window.setTimeout( () => {
      this.noteInput.nativeElement.focus();
      this.noteInput.nativeElement.select();
    }, 200 );

  }
  saveNote() {
    this.editingNote = -1;
    this.api.student.save();
  }
  cancelAddNote() {
    this.editingNote = -1;
    this.student.notes.splice(0, 1);
  }
  deleteNote(id: number) {
    const idx = this.student.notes.findIndex(el => el.id === id);
    if (idx > -1) {
      this.student.notes.splice(idx, 1);
    }
    this.api.student.save();
  }

  viewSurveys() {
    this.isNotesVisible = false;
    this.isSurveysVisible = true;
  }
  viewNotes() {
    this.isNotesVisible = true;
    this.isSurveysVisible = false;
  }

  getDateFormat(date: string) {
    const today = new Date();
    const nticks = parseInt(date, 10);
    /* if is a number, use as ticks */
    const checkDate = nticks ? new Date(nticks) : new Date(date);
    if (today.getDate() === checkDate.getDate()
        && today.getMonth() === checkDate.getMonth()
        && today.getFullYear() === checkDate.getFullYear()) {
      return '\'Today\'';
    } else { return 'MM/dd/yyyy'; }
  }

  getNoteAuthor(note: Note) {
    const currentStaffKey = this.currentTeacher.staffkey;
    if (note.staffkey === currentStaffKey) {
      return 'Me';
    } else {
      if (note.staffFullName) {
        return note.staffFullName;
      }
      this.api.teacher.getStaffNameByKey(note.staffkey)
        .then(staff => {
          note.staffFullName = staff.lastsurname + ' ' + staff.firstname;
          note.staffEMail = staff.electronicmailaddress;
        });
    }
  }

}
