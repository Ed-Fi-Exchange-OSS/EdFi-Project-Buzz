// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.
import { ApolloClient, InMemoryCache } from '@apollo/client';
import Teacher from 'Models/Teacher';
import { SurveyQuestionAnswer } from 'Models';
import { trackPromise } from 'react-promise-tracker';
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
    let surveySummary: SurveyQuestionAnswers = null;
    await trackPromise(client.query({
      query: getSurveyQuestionsSummary,
      variables: {
        staffkey: this.getTeacher().staffkey,
        sectionkey: sectionKey,
        surveykey: surveyKey
      }
    })
      .then(response => {
        if (response.data && response.data.length > 0) {

          const surveySummaryResponse =
            response
              .data
              .surveysummary[0]
              .questions
              .filter(q => q.question.toUpperCase() === question.toUpperCase())[0];
          surveySummary = surveySummaryResponse;
        } else {
          surveySummary = null;
        }
      }));
    return surveySummary;
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
    let answers = [];
    await trackPromise(client
      .query({
        query: getSurveyQuestionsSummary,
        variables: {
          staffkey: this.getTeacher().staffkey,
          sectionkey: sectionKey,
          surveykey: surveyKey
        }
      })
      .then(response => {
        if (response.data.surveysummary && response.data.surveysummary.length > 0) {
          answers = response.data.surveysummary;
        } else{
          answers = [];
        }

      })
    );

    const q = Object.values(
      answers[0].questions.reduce((qacc, qcur) => qcur.answers.reduce((aaccParam, acur) => {
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
    let sections: SurveyMetadata[] = [];
    await trackPromise(client
      .query({
        query: getSurveySummaryBySectionKey,
        variables: {
          staffkey: this.getTeacher().staffkey,
          sectionkey: sectionKey,
          title: filter
        }
      })
      .then(response => {
        sections = response.data.surveysummary;
      })
    );
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
    let surveyList = [];
    const calculateTopAnswers = (answers: SurveyQuestionAnswer[]) => {
      const countAnswers = answers
        .reduce((aaccParam, acur) => {
          const aacc = aaccParam;
          aacc[acur.answer] = 1 + (aacc[acur.answer] ? aacc[acur.answer] : 0);
          return aacc;
        }, {});

      return Object.keys(countAnswers)
        .map((cur) => ({
          label: cur,
          count: countAnswers[cur]
        }));
    };

    const client = this.apolloClient;
    await trackPromise(client
      .query({
        query: getSurveyQuestionsSummary,
        variables: {
          staffkey: this.getTeacher().staffkey,
          sectionkey: sectionKey,
          surveykey: surveyKey
        }
      })
      .then(response => {
        if (response.data.surveysummary && response.data.surveysummary.length > 0) {
          surveyList = response.data.surveysummary;
        } else{
          surveyList = [];
        }
      })
    );

    if (surveyList.length === 0) {
      return [];
    }
    const surveysummary = surveyList[0];
    const questions = surveysummary.questions
      .map((qcur) => ({
        surveykey: surveyList[0].surveykey,
        surveyquestionkey: qcur.surveyquestionkey,
        question: qcur.question,
        answers: calculateTopAnswers(qcur.answers),
        totalAnswers: qcur.answers.length
      }));

    return questions;
  };
}
