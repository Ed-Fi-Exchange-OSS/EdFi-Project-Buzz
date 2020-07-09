import { Injectable } from '@angular/core';
import { Student } from '../Models/student';
import { StudentApiService } from './student.service';
import { SurveyResult, Teacher } from '../Models';
import { getSurveySummaryBySectionKey, getSurveyQuestionsSummary } from './GraphQL/surveyQueries';
import { Apollo } from 'apollo-angular';
import { AuthenticationService } from './authentication.service';


@Injectable({ providedIn: 'root' })
export class SurveyAnalyticsApiService {
  controllerName = 'surveyAnalytics';

  constructor(private studentService: StudentApiService, private authenticationService: AuthenticationService, private apollo: Apollo) {
  }


  getTeacher() {
    const user = this.authenticationService.currentUserValue;
    if (!user) {
      return null;
    }
    return user.teacher;
  }

  /*
    {
      answers: {
        answer: string
        studentname: string
        studentschoolkey: string
      }[]​
      question: string
      surveyquestionkey: number
    }
   */
  async getSurveyAnswers(surveyKey: number, question?: string, sectionKey?: string) {
    const client = this.apollo.getClient();
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
    return surveysummary.questions.filter(q => q.question.toUpperCase() === question.toUpperCase())[0];
  }
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

  async getAllSurveyAnswers(surveyKey: number, sectionKey?: string) {
    const client = this.apollo.getClient();
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

    const q = Object.values(data.surveysummary[0].questions.reduce((qacc, qcur) => {
      return qcur.answers.reduce((aacc, acur) => {
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
      }, qacc);
    }, {})
    );
    return q;
  }

  /*  [{
        surveyId: number,
        surveyName: string,
        questionCount: number,
        totalStudents: number,
        studentsAnswered: number
      }]
  */
  async getSurveyMetadata(sectionKey: string, filter: string) {
    const client = this.apollo.getClient();
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
  }

  /*
  [{
    surveykey: number,
    question: string,
    answers: [
      {label: string, count: number}
    ]
  }]
  */
  async getSurveyQuestionSummaryList(surveyKey: number, sectionKey: string) {
    function calculateTopAnswers(answers: any[]) {
      const countAnswers = answers
        .reduce((aacc, acur) => {
          aacc[acur.answer] = 1 + (aacc[acur.answer] ? aacc[acur.answer] : 0);
          return aacc;
        }, {});

      return Object.keys(countAnswers)
        .map((cur, idx, arr) => {
          return {
            label: cur,
            count: countAnswers[cur]
          };
        });
    }

    const client = this.apollo.getClient();
    const { data } = await client.query({
      query: getSurveyQuestionsSummary,
      variables: {
        staffkey: this.getTeacher().staffkey,
        sectionkey: sectionKey,
        surveykey:
        surveyKey
      }
    });

    if (data.surveysummary.length === 0) {
      return [];
    }
    const surveysummary = data.surveysummary[0];
    const questions = surveysummary.questions
      .map((qcur, qidx, qarr) => {
        return {
          surveykey: data.surveysummary[0].surveykey,
          surveyquestionkey: qcur.surveyquestionkey,
          question: qcur.question,
          answers: calculateTopAnswers(qcur.answers),
          totalAnswers: qcur.answers.length
        };
      });

    return questions;
  }

}
