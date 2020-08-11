import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Title } from '@angular/platform-browser';
import { SurveyStatus } from '../Models/survey';
declare var $: any;

@Component({
  selector: 'app-admin-survey',
  templateUrl: './adminSurvey.component.html',
  styleUrls: ['./adminSurvey.component.css']
})
export class AdminSurveyComponent implements OnInit {
  private surveyList: SurveyStatus[];
  private surveyFilteredList: SurveyStatus[];
  searchText: string;
  surveyToDelete: number;

  colorList: string[] = ['#03a9f4', '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];

  constructor(
    private api: ApiService,
    private title: Title,
  ) {

    this.title.setTitle('Buzz Administrate Surveys');
  }

  async ngOnInit() {
    this.surveyList = await this.api.survey.getSurveyStatus(
      this.api.authentication.currentUserValue.teacher.staffkey, null);
    this.surveyFilteredList = this.surveyList;
  }

  search() {
    const upperSearchText = this.searchText.toUpperCase();
    this.surveyFilteredList = this.surveyList
      .filter(s => (s.resultSummaryObj.survey.title as string).toUpperCase().includes(upperSearchText));
  }

  deleteSurvey() {
    $('#deletesurveyconfirmation').modal('hide');
    if (this.surveyToDelete) {
    this.api.survey
      .deleteSurvey(this.api.authentication.currentUserValue.teacher.staffkey, this.surveyToDelete)
      .then(() => {
        const idx = this.surveyList.findIndex(el => el.surveykey === this.surveyToDelete);
        if (idx > -1) {
          this.surveyList.splice(idx, 1);
        }
        if (this.searchText) {
 this.surveyFilteredList.splice(idy, 1);
          const textIndex = this.surveyFilteredList.findIndex(el => el.surveykey === this.surveyToDelete);
          if (textIndex > -1) {
            this.surveyFilteredList.splice(textIndex, 1);
          }
        }
        this.surveyToDelete = null;
      });
    }
  }

  setSurveyToDelete(surveyKey: number) {
    this.surveyToDelete = surveyKey;
  }
}
