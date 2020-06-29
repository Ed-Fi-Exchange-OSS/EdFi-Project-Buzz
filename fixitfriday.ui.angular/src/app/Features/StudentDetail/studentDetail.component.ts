import { Component, ElementRef, ViewChild } from '@angular/core';
import { Route, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../Services/api.service';
import { Student } from 'src/app/Models';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-student-detail',
  templateUrl: './studentDetail.component.html',
  styleUrls: ['./studentDetail.component.css']
})
export class StudentDetailComponent {
  student: Student;
  studentId: string;
  editingNote: number;
  currentTeacher: string;

  siblingsIsCollapsed: boolean;

  isSurveysVisible: boolean
  isNotesVisible: boolean

  @ViewChild('noteInput', {static: false}) noteInput: ElementRef;

  constructor(private api: ApiService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.editingNote = -1;
    this.currentTeacher = "Kathie Dillon"
    this.siblingsIsCollapsed = true;
    this.isSurveysVisible = true;
    this.isNotesVisible = false;
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(()=> {
      if(window.history.state.student) { this.student = window.history.state.student; }
      else if (window.history.state.studentId) {
        this.student = this.api.student.getById(window.history.state.studentId)[0];
      }
      else{
        this.router.navigate(['/app']);
        return;
      }
    });
  }

  addNote(){
    if(!this.student.notes){
      this.student.notes = [];
    }
    this.editingNote = 0;
    let newId = this.student.notes.length > 0 ? Math.max(...this.student.notes.map(el => el.id)) + 1: 1;
    this.student.notes.unshift({ id: newId, note: `New note: ${newId}`, date: new Date(), teacher: this.currentTeacher });
    window.setTimeout( () => {
      this.noteInput.nativeElement.focus();
      this.noteInput.nativeElement.select();
    }, 200 );

  }
  saveNote(){
    this.editingNote = -1;
    this.api.student.save();
  }
  cancelAddNote(){
    this.editingNote = -1;
    this.student.notes.splice(0, 1);
  }
  deleteNote(id:number){
    let idx = this.student.notes.findIndex(el => el.id == id);
    if(idx > -1){
      this.student.notes.splice(idx, 1);
    }
    this.api.student.save();
  }

  viewSurveys(){
    this.isNotesVisible = false;
    this.isSurveysVisible = true;
  }
  viewNotes(){
    this.isNotesVisible = true;
    this.isSurveysVisible = false;
  }

  getDateFormat(date:string){
    let today = new Date();
    let checkDate = new Date(date);
    if (today.getDate() == checkDate.getDate() && today.getMonth() == checkDate.getMonth() && today.getFullYear() == checkDate.getFullYear()){
      return 'h:mma';
    }else{
      return 'MM/dd/yyyy';
    }
  }

}
