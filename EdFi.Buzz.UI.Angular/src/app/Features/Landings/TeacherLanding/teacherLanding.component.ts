// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Student, Teacher, Section } from 'src/app/Models';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-teacher-landing',
  templateUrl: './teacherLanding.component.html',
  styleUrls: ['./teacherLanding.component.css']
})

export class TeacherLandingComponent implements OnInit {
  students: Student[];
  teacher: Teacher;
  sections: Section[];
  searchByStudentName: string;
  currentSection: string;
  isSurveyResultsVisible: boolean;
  view: string;


  constructor(private api: ApiService, private title: Title) {
    title.setTitle('Buzz Class Roster');
    this.students = [];
    this.searchByStudentName = null;
    this.currentSection = null;
    this.isSurveyResultsVisible = false;

    this.view = localStorage['studentListViewType'] || 'Grid';
    // this.view = "List";
  }

  ngOnInit() {
    this.search();
  }

  async search() {
    this.teacher = this.api.authentication.currentUserValue.teacher;
    this.sections = await this.api.section.getByTeacherId();
    this.students = await this.api.student.get(this.currentSection, this.searchByStudentName);
  }

  toggleSurveyResults() {
    this.isSurveyResultsVisible = !this.isSurveyResultsVisible;
  }

  setView(viewType: string) {
    localStorage['studentListViewType'] = viewType;
    this.view = viewType; /* Grid | List */
  }


}
