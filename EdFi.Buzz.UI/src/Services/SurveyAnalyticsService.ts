// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import { ApolloClient, InMemoryCache } from '@apollo/client';
import Teacher from 'Models/Teacher';
import StudentApiService from './StudentService';
import { getSurveySummaryBySectionKey, getSurveyQuestionsSummary } from './GraphQL/SurveyQueries';
import AuthenticationService from './AuthenticationService';
import SurveyMetadata from '../Models/SurveyMetadata';
import SurveyQuestionSummary from '../Models/SurveyQuestionSummary';
import SurveyQuestionAnswers from '../Models/SurveyQuestionAnswers';
import AllStudentAnswers from '../Models/AllStudentAnswers';

export default class SurveyAnalyticsApiService{

  constructor(private studentService: StudentApiService,
    private authenticationService: AuthenticationService,
    private apolloClient: ApolloClient<InMemoryCache>) {
  }

  public getTeacher = (): Teacher => {
    const user = this.authenticationService.currentUserValue;
    if (!user) {
      return null;
    }
    return user.teacher;
  };

  /*
    {
      answers: {
        answer: string
        studentname: string
        studentschoolkey: string
      }[];
      question: string
      surveyquestionkey: number
    }
   */
  public getSurveyAnswers = async(surveyKey: number, question?: string, sectionKey?: string): Promise<SurveyQuestionAnswers> => {
    const client = this.apolloClient;
    const { data } = await client.query({
      query: getSurveyQuestionsSummary,
      variables: {
        staffkey: this.getTeacher().staffkey,
        sectionkey: sectionKey,
        surveykey: surveyKey
      }
    });
    if (data.surveysummary.length === 0) {
      return null;
    }
    const surveysummary = data.surveysummary[0].questions.filter(q => q.question.toUpperCase() === question.toUpperCase())[0];
    return surveysummary;
  };

  /*
  [
    {
      studentname: string
      studentschoolkey: string
      questions: []
      answers: []
    }
  ]
   */
  public getAllSurveyAnswers = async(surveyKey: number, sectionKey?: string): Promise<AllStudentAnswers[]> => {
    const client = this.apolloClient;
    const { data } = await client.query({
      query: getSurveyQuestionsSummary,
      variables: {
        staffkey: this.getTeacher().staffkey,
        sectionkey: sectionKey,
        surveykey: surveyKey
      }
    });
    if (data.surveysummary.length === 0) {
      return [];
    }

    const q = Object.values(
      data.surveysummary[0].questions.reduce((qacc, qcur) => qcur.answers.reduce((aaccParam, acur) => {
        const aacc = aaccParam;
        let student = aacc[acur.studentschoolkey];
        if (!student) {
          student = {
            studentname: acur.studentname,
            studentschoolkey: acur.studentschoolkey,
            questions: {},
            answers: {}
          };
          aacc[acur.studentschoolkey] = student;
        }
        student.questions[qcur.surveyquestionkey] = qcur.question;
        student.answers[qcur.surveyquestionkey] = acur.answer;
        return aacc;
      }, qacc), {})
    ) as AllStudentAnswers[];
    return q;
  };

  /*  [{
        surveyId: number,
        surveyName: string,
        questionCount: number,
        totalStudents: number,
        studentsAnswered: number
      }]
  */
  public getSurveyMetadata = async(sectionKey: string, filter: string): Promise<SurveyMetadata[]> => {
    const client = this.apolloClient;
    const { data } = await client.query({
      query: getSurveySummaryBySectionKey,
      variables: {
        staffkey: this.getTeacher().staffkey,
        sectionkey: sectionKey,
        title: filter
      }
    });
    const sections = data.surveysummary;
    return sections;
  };

  /*
  [{
    surveykey: number,
    question: string,
    answers: [
      {label: string, count: number}
    ]
  }]
  */
  public getSurveyQuestionSummaryList = async(surveyKey: number, sectionKey: string): Promise<SurveyQuestionSummary[]> => {
    // eslint-disable-next-line
    const calculateTopAnswers = (answers: any[]) => {
      const countAnswers = answers
        .reduce((aaccParam, acur) => {
          const aacc = aaccParam;
          aacc[acur.answer] = 1 + (aacc[acur.answer] ? aacc[acur.answer] : 0);
          return aacc;
        }, {});

      return Object.keys(countAnswers)
      // eslint-disable-next-line
        .map((cur, idx, arr) => ({
          label: cur,
          count: countAnswers[cur]
        }));
    };

    const client = this.apolloClient;
    const { data } = await client.query({
      query: getSurveyQuestionsSummary,
      variables: {
        staffkey: this.getTeacher().staffkey,
        sectionkey: sectionKey,
        surveykey: surveyKey
      }
    });

    if (data.surveysummary.length === 0) {
      return [];
    }
    const surveysummary = data.surveysummary[0];
    const questions = surveysummary.questions
    // eslint-disable-next-line
      .map((qcur, qidx, qarr) => ({
        surveykey: data.surveysummary[0].surveykey,
        surveyquestionkey: qcur.surveyquestionkey,
        question: qcur.question,
        answers: calculateTopAnswers(qcur.answers),
        totalAnswers: qcur.answers.length
      }));

    return questions;
  };
}
