// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { Teacher, Section } from 'src/app/Models';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Title } from '@angular/platform-browser';
import { SurveyMetadata, SurveyQuestionSummary, SurveyQuestionAnswers, SurveyQuestionAnswer, AllStudentAnswers } from 'src/app/Models/survey';

@Component({
  selector: 'app-survey-analytics2',
  templateUrl: './surveyAnalytics2.component.html',
  styleUrls: ['./surveyAnalytics2.component.css']
})
export class SurveyAnalytics2Component implements OnInit {
  showSearchResults: boolean;
  showSurvey: boolean;

  teacher: Teacher;
  surveyMetadataList: SurveyMetadata[];
  surveyQuestionSummaryList: SurveyQuestionSummary[];

  searchInSurvey: string;
  currentSectionKey: string;
  currentQuestion: { surveyId: number, surveyName: string, question: string };
  answerFilter: string;

  surveyAnswers: SurveyQuestionAnswers;
  allAnswersCurrentSurvey: AllStudentAnswers[];
  surveyAnswersFiltered: SurveyQuestionAnswer[];
  chartData: { options: ChartOptions, type: ChartType, labels: Label[], data: ChartDataSets[] };
  colorList: string[] = ['#03a9f4', '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];

  readonly STUDENT_NAME_STRING: string = 'Student Name';
  sortSurveyByColumn: string = this.STUDENT_NAME_STRING;
  sortSurveyByColumnAsc = true;
  sortedSurveyStudentAnswers: any[];

  constructor(private api: ApiService, private title: Title) {
    title.setTitle('Buzz Survey Analytics');
    this.showSearchResults = false;
    this.showSurvey = false;

    this.currentSectionKey = null;
    this.searchInSurvey = null;
  }

  async ngOnInit() {
    this.teacher = this.api.authentication.currentUserValue.teacher;
    this.surveyMetadataList = [];
    this.currentQuestion = { surveyId: -1, surveyName: '', question: '' };

    this.chartData = {
      options: {
        responsive: true,
        title: {
          display: true,
          text: ''
        }
      },
      type: 'pie',
      labels: [],
      data: [
        { data: [], label: '' }
      ]
    };
  }

  async search() {
    this.surveyMetadataList = await this.api.surveyAnalytics.getSurveyMetadata(this.currentSectionKey, this.searchInSurvey);
    this.showSearchResults = true;
    this.showSurvey = false;
  }

  async selectSurvey(surveyKey: number, surveyTitle: string) {
    this.showSurvey = true;
    this.currentQuestion.surveyId = surveyKey;
    this.currentQuestion.surveyName = surveyTitle;

    this.surveyQuestionSummaryList = await this.api.surveyAnalytics
      .getSurveyQuestionSummaryList(surveyKey, this.currentSectionKey);

    await this.selectQuestion(this.surveyQuestionSummaryList[0].question, false);

    this.allAnswersCurrentSurvey = await this.api.surveyAnalytics
      .getAllSurveyAnswers(this.currentQuestion.surveyId, this.currentSectionKey);

    this.scrollIntoView('summaryCard');
  }

  async selectQuestion(question: any, scrollIntoChart: boolean = true) {

    this.currentQuestion.question = question;

    const surveyAnalytics = { labels: [], totals: [] };
    const selectedQuestionSummary = this.surveyQuestionSummaryList
      .filter(q => q.question.toUpperCase() === question.toUpperCase())[0];
    surveyAnalytics.labels = selectedQuestionSummary.answers.map(a => a.label);
    surveyAnalytics.totals = selectedQuestionSummary.answers.map(a => a.count);

    this.surveyAnswers = await this.api.surveyAnalytics
      .getSurveyAnswers(this.currentQuestion.surveyId, this.currentQuestion.question, this.currentSectionKey);
    this.surveyAnswersFiltered = this.surveyAnswers && this.surveyAnswers.answers ? this.surveyAnswers.answers : [];

    this.chartData = {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: this.currentQuestion.question
        }
      },
      type: 'pie',
      labels: surveyAnalytics.labels,
      data: [
        { data: surveyAnalytics.totals, label: this.currentQuestion.question }
      ]
    };

    if (scrollIntoChart) { this.scrollIntoView('chartCard'); }
  }

  chartClicked(e: any) {
    if (e.active.length > 0) {
      const dataIndex = e.active[0]._index;
      const labelClicked = this.chartData.labels[dataIndex].toString();
      if (!this.answerFilter || this.answerFilter.toUpperCase() !== labelClicked.toUpperCase()) {
        this.answerFilter = labelClicked;
        this.surveyAnswersFiltered = this.surveyAnswers.answers.filter(sa => !this.answerFilter || sa.answer === this.answerFilter);
      } else {
        this.answerFilter = null;
        this.surveyAnswersFiltered = this.surveyAnswers.answers;
      }
    }
  }

  scrollIntoView(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView();
    } else {
      window.setTimeout(() => this.scrollIntoView(elementId), 500);
    }
  }

  changeSort(column: string) {
    this.sortedSurveyStudentAnswers = null;
    if (this.sortSurveyByColumn === column) {
      this.sortSurveyByColumnAsc = !this.sortSurveyByColumnAsc;
    } else {
      this.sortSurveyByColumn = column;
      this.sortSurveyByColumnAsc = true;
    }
  }
  getAnswerFromSurve(survey: any, question: string) {
    const qUpper = question.toUpperCase();
    if (question === this.STUDENT_NAME_STRING) {
      return survey.studentname;
    }
    const qMap = Object
      .keys(survey.questions)
      .reduce((acc, cur, arr) => { acc[survey.questions[cur].toUpperCase()] = cur; return acc; }, {});
    return survey.answers[qMap[qUpper]];
  }
  compare(a: any, b: any, asc: boolean): number {
    const ascValue: number = asc ? 1 : -1;
    return a > b ? ascValue
      : (a === b ? 0 : ascValue * -1);
  }
  sortSurveyBy(column: string) {
    if (this.sortedSurveyStudentAnswers) { return this.sortedSurveyStudentAnswers; }

    if (!this.allAnswersCurrentSurvey) { return []; }
    const list = this.allAnswersCurrentSurvey
      .sort((a, b) => {
        const firstField = this.compare(this.getAnswerFromSurve(a, column),
          this.getAnswerFromSurve(b, column),
          this.sortSurveyByColumnAsc);
        if (firstField !== 0) {
          return firstField;
        }
        return this.compare(this.getAnswerFromSurve(a, this.STUDENT_NAME_STRING),
          this.getAnswerFromSurve(b, this.STUDENT_NAME_STRING),
          true);
      });
    this.sortedSurveyStudentAnswers = list;
    return this.sortedSurveyStudentAnswers;
  }

}
