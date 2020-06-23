import { Component } from '@angular/core';
import { ApiService } from '../../../Services/api.service';
import { Student, Teacher } from 'src/app/Models';
import { typeWithParameters } from '@angular/compiler/src/render3/util';

@Component({
  selector: 'app-teacher-landing',
  templateUrl: './teacherLanding.component.html',
  styleUrls: ['./teacherLanding.component.css']
})

export class TeacherLandingComponent {
  students: Student[];
  teacher: Teacher;
  searchByStudentName: string;
  currentSection: string;
  isSurveyResultsVisible: boolean;
  view: string;

  
  constructor(private api: ApiService) {
    this.students = [];
    this.searchByStudentName = null;
    this.currentSection = null;
    this.isSurveyResultsVisible = false;
    
    this.view = localStorage['studentListViewType'] || "Grid";
    //this.view = "List";
  }

  ngOnInit() {
    this.search();
  }

  search() {
    //call the service for same data, send the selected sections
    this.students = this.api.student.get(this.currentSection, this.searchByStudentName);
    this.teacher = this.api.teacher.get()[0];
  }

  toggleSurveyResults() {
    this.isSurveyResultsVisible = !this.isSurveyResultsVisible;
  }

  setView(viewType: string){
    localStorage['studentListViewType'] = viewType;
    this.view = viewType;/* Grid | List */
  }


}
