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
  teacher: Teacher;

  constructor(private studentService: StudentApiService, authenticationService: AuthenticationService, private apollo: Apollo) {
    this.teacher = authenticationService.currentUserValue.teacher;
  }

  getSurveyList() {
    return [
      { surveyId: 0, surveyName: "Contact", questions: ["Preferred contact method"] },
      { surveyId: 1, surveyName: "Internet Accessibility", questions: ["Internet Access Type", "Has computer at home"] }
    ];
  }

  async getQuestions(searchInSurvey: string) {
    let students = await this.studentService.get(null);
    let questions = students.reduce((accS, curS) => {
      return curS.surveys.reduce((accSy, curSy) => {
        return curSy.items.reduce((accIt, curIt) => {
          //console.log("curSy.name", curSy.name, "curIt.question", curIt.question);
          if (curSy.name.toUpperCase().includes(searchInSurvey.toUpperCase()) || curIt.question.toUpperCase().includes(searchInSurvey.toUpperCase())) {
            let survey = accIt.find(el => el.surveyName.toUpperCase() == curSy.name.toUpperCase())
            if (!survey) {
              survey = { surveyId: curSy.id, surveyName: curSy.name, questions: [] };
              accIt.push(survey);
            }
            let question = curIt.question.trim();
            if (!survey.questions.find(q => q.toUpperCase() == question.toUpperCase())) {
              survey.questions.push(question);
            }
          }
          return accIt;
        }, accSy);
      }, accS);
    }, []);
    // console.log(searchInSurvey, questions);
    return questions;
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
    const { data } = await client.query({ query: getSurveyQuestionsSummary, variables: { staffkey: this.teacher.staffkey, sectionkey:sectionKey, surveykey: surveyKey } });
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
    const { data } = await client.query({ query: getSurveyQuestionsSummary, variables: { staffkey: this.teacher.staffkey, sectionkey:sectionKey, surveykey: surveyKey } });
    if (data.surveysummary.length === 0) {
      return [];
    }

    let q = Object.values(data.surveysummary[0].questions.reduce( (qacc, qcur) => {
      return qcur.answers.reduce( (aacc, acur) => {
        let student = aacc[acur.studentschoolkey];
        if(!student){
          student = {
            studentname: acur.studentname,
            studentschoolkey: acur.studentschoolkey,
            questions: {},
            answers: {}
          }
          aacc[acur.studentschoolkey] = student;
        }
        student.questions[qcur.surveyquestionkey] = qcur.question;
        student.answers[qcur.surveyquestionkey] = acur.answer;
        return aacc;
      }, qacc );
    }, {} )
    );
    return q;
  }
  async xgetSurveyAnswers(surveyId: number, surveyItem?: string, sectionName?: string) {
    let students = await this.studentService.get(sectionName);
    return [].concat(...students.map(s =>
      s.surveys
        .filter(sv => sv.id == surveyId)
        .map(sf => {
          return {
            studentId: s.studentkey,
            studentName: s.studentlastname + ' ' + s.studentfirstname + ' ' + s.studentmiddlename,
            surveyResults: <SurveyResult>{
              id: sf.id,
              dateAnswered:
                sf.dateAnswered,
              name: sf.name,
              items: sf.items.filter(i => surveyItem == null || i.question == surveyItem)
            }
          };
        })
    ));
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
    const { data } = await client.query({ query: getSurveySummaryBySectionKey, variables: { staffkey: this.teacher.staffkey, sectionkey: sectionKey, title: filter } });
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
  async getSurveyQuestionSummaryList(surveyKey:number, sectionKey: string){
    function calculateTopAnswers(answers:any[]){
      const countAnswers = answers
        .reduce((aacc, acur) => {
				        aacc[acur.answer] = 1 + (aacc[acur.answer] ? aacc[acur.answer] : 0);
				        return aacc;
            }, {} );

      return Object.keys(countAnswers)
        .map((cur, idx, arr) => {
          return {
            label: cur,
            count: countAnswers[cur]
          };
        });
    }

    const client = this.apollo.getClient();
    const { data } = await client.query({ query: getSurveyQuestionsSummary, variables: { staffkey: this.teacher.staffkey, sectionkey:sectionKey, surveykey: surveyKey } });

    if (data.surveysummary.length == 0) {
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
        }
      });

    return questions;
  }

}
