import { Component } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Teacher } from 'src/app/Models';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-survey-analytics',
  templateUrl: './surveyAnalytics.component.html',
  styleUrls: ['./surveyAnalytics.component.css']
})
export class SurveyAnalyticsComponent {
  teacher: Teacher;
  surveyList: any;
  surveyAnalytics: any;
  surveyAnswers: any;
  surveyAnswersFiltered: any;
  chartData: { options: ChartOptions, type: ChartType, labels: Label[], data: ChartDataSets[] };

  currentSection: string;
  currentQuestion: { surveyId: number, question: string }
  searchInSurvey: string;
  answerFilter: string;

  constructor(private api: ApiService) {
    this.currentSection = null;
    this.searchInSurvey = null;
  }

  ngOnInit() {
    this.teacher = this.api.teacher.get()[0];
    this.surveyList = this.api.surveyAnalytics.getSurveyList();
    this.currentQuestion = { surveyId: 1, question: "Internet Access Type" };
    this.answerFilter = "";
    this.filterSection()
  }

  filterQuestions() {
    this.surveyList = this.api.surveyAnalytics.getQuestions(this.searchInSurvey);
  }

  selectQuestion(surveyId: number, question: string) {
    console.log("selectQuestion", surveyId, question);
    this.currentQuestion = { surveyId: surveyId, question: question };
    this.filterSection();
  }

  filterSection() {
    this.surveyAnalytics = this.api.surveyAnalytics.getSurveyAnalytics(this.currentQuestion.surveyId, this.currentQuestion.question, this.currentSection);
    this.surveyAnswers = this.api.surveyAnalytics.getSurveyAnswers(this.currentQuestion.surveyId, this.currentQuestion.question, this.currentSection);
    this.surveyAnswersFiltered = this.surveyAnswers;

    this.chartData = {
      options: {
        responsive: true,
        title: {
          display: true,
          //text: this.surveyList[1].name
          text: this.currentQuestion.question
        }
      },
      type: 'pie',
      labels: this.surveyAnalytics.labels,
      data: [
        { data: this.surveyAnalytics.total, label: this.currentQuestion.question }
      ]
    }
  }

  public chartClicked(e: any) {
    if (e.active.length > 0) {
      //let datasetIndex = e.active[0]._datasetIndex
      let dataIndex = e.active[0]._index
      let labelClicked = this.chartData.labels[dataIndex].toString();
      //console.log(dataObject, datasetIndex, e) 
      if (!this.answerFilter || this.answerFilter.toUpperCase() != labelClicked.toUpperCase()) { 
        this.answerFilter = labelClicked; 
        this.surveyAnswersFiltered = this.surveyAnswers.filter(sa =>  !this.answerFilter || sa.surveyResults.items[0].answer == this.answerFilter);
      }
      else { 
        this.answerFilter = null; 
        this.surveyAnswersFiltered = this.surveyAnswers;
      }
    }
  }

}
