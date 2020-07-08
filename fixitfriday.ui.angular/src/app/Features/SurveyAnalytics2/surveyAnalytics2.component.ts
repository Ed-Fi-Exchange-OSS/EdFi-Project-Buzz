import { Component, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { Teacher } from 'src/app/Models';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-survey-analytics2',
  templateUrl: './surveyAnalytics2.component.html',
  styleUrls: ['./surveyAnalytics2.component.css']
})
export class SurveyAnalytics2Component {
  showSearchResults: boolean;
  showSurvey: boolean;

  teacher: Teacher;
  surveyMetadataList: any;
  surveyQuestionSummaryList: any;

  searchInSurvey: string;
  currentSection: string;
  currentQuestion: { surveyId: number, surveyName:string, question: string }
  answerFilter: string;

  surveyAnalytics: any;
  surveyAnswers: any;
  allAnswersCurrentSurvey: any;
  surveyAnswersFiltered: any;
  chartData: { options: ChartOptions, type: ChartType, labels: Label[], data: ChartDataSets[] };
  colorList: any = ["#03a9f4", "#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0"];

  readonly STUDENT_NAME_STRING: string = "Student Name";
  sortSurveyByColumn: string = this.STUDENT_NAME_STRING;
  sortSurveyByColumnAsc: boolean = true;
  sortedSurveyStudentAnswers: any[];

  constructor(private api: ApiService) {
    this.showSearchResults = false;
    this.showSurvey = false;

    this.currentSection = null;
    this.searchInSurvey = null;
  }

  ngOnInit() {
    this.teacher = this.api.teacher.get()[0];
    this.surveyMetadataList = [];
    this.currentQuestion = { surveyId: -1, surveyName:"", question: "" };

    this.chartData = {
      options: {
        responsive: true,
        title: {
          display: true,
          //text: this.surveyList[1].name
          text: ""
        }
      },
      type: 'pie',
      labels: [],
      data: [
        { data: [], label: "" }
      ]
    }
  }

  search() {
    this.surveyMetadataList = this.api.surveyAnalytics.getSurveyMetadata(this.currentSection, this.searchInSurvey);
    this.showSearchResults = true;
  }

  selectSurvey(surveyId: number, surveyName:string) {
    this.showSurvey = true;
    this.currentQuestion.surveyId = surveyId;
    this.currentQuestion.surveyName = surveyName;
    this.surveyQuestionSummaryList = this.api.surveyAnalytics.getSurveyQuestionSummaryList(surveyId, this.currentSection);
    this.allAnswersCurrentSurvey = this.api.surveyAnalytics
      .getSurveyAnswers(this.currentQuestion.surveyId, null, this.currentSection);

    this.selectQuestion(this.surveyQuestionSummaryList[0].question, false);

    this.scrollIntoView("summaryCard");
  }

  selectQuestion(question: any, scrollIntoChart:boolean = true) {
    this.currentQuestion.question = question;

    this.surveyAnalytics = this.api.surveyAnalytics
      .getSurveyAnalytics(this.currentQuestion.surveyId, this.currentQuestion.question, this.currentSection);
    this.surveyAnswers = this.api.surveyAnalytics
      .getSurveyAnswers(this.currentQuestion.surveyId, this.currentQuestion.question, this.currentSection);
    this.surveyAnswersFiltered = this.surveyAnswers;

    this.chartData = {
      options: {
        responsive: true,
        maintainAspectRatio: false,
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

    if (scrollIntoChart) { this.scrollIntoView("chartCard"); }
  }

  chartClicked(e: any) {
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

  scrollIntoView(elementId:string){
    let element = document.getElementById(elementId);
    if(element){
      console.log(`${element.id} found, scrolling`);
      element.scrollIntoView();
    }
    else{
      console.log(`${elementId} not found, waiting`);
      window.setTimeout( () => this.scrollIntoView(elementId), 500);
    }
  }

  changeSort(column:string){
    this.sortedSurveyStudentAnswers = null;
    if (this.sortSurveyByColumn == column) {
      this.sortSurveyByColumnAsc = !this.sortSurveyByColumnAsc;
    }else{
      this.sortSurveyByColumn = column;
      this.sortSurveyByColumnAsc = true;
    }
  }
  getAnswerFromSurve(survey:any, question:string){
    const qUpper = question.toUpperCase();
    if(question === this.STUDENT_NAME_STRING){
      return survey.studentName;
    }
    const sItem = survey.surveyResults.items.filter(it => it.question.toUpperCase() === qUpper);
    return sItem.length > 0 ? sItem[0].answer : null;
  }
  compare(a:any, b:any, asc:boolean):number{
    const ascValue: number = asc ? 1 : -1;
    return a > b ? ascValue
      : (a === b ? 0 : ascValue * -1);
  }
  sortSurveyBy(column: string){
    if(this.sortedSurveyStudentAnswers) {return this.sortedSurveyStudentAnswers;}

    console.log(this.allAnswersCurrentSurvey);
    const list = this.allAnswersCurrentSurvey
      .sort((a, b) => {
        const firstField = this.compare(this.getAnswerFromSurve(a, column),
          this.getAnswerFromSurve(b, column),
          this.sortSurveyByColumnAsc );
        if(firstField != 0){
          return firstField;
        }
        return this.compare(this.getAnswerFromSurve(a, this.STUDENT_NAME_STRING),
          this.getAnswerFromSurve(b, this.STUDENT_NAME_STRING),
          true );
      });
    this.sortedSurveyStudentAnswers = list;
    return this.sortedSurveyStudentAnswers;
  }

}
