import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { Title } from '@angular/platform-browser';
import { SurveyStatus } from '../Models/survey';

@Component({
  selector: 'app-admin-survey',
  templateUrl: './adminSurvey.component.html',
  styleUrls: ['./adminSurvey.component.css']
})
export class AdminSurveyComponent implements OnInit {
  private surveyList: SurveyStatus[];
  private surveyFilteredList: SurveyStatus[];
  searchText: string;

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

}
