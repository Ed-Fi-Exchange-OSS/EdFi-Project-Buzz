import { Injectable } from '@angular/core';
import { Student } from '../Models/student';
import { StudentApiService } from './student.service';
import { SurveyResult } from '../Models';


@Injectable({ providedIn: 'root' })
export class SurveyAnalyticsApiService {
  controllerName = 'surveyAnalytics';
  //students: Student[];
  constructor(private studentService: StudentApiService) {

  }

  getSurveyList() {
    return [
      { surveyId: 0, surveyName: "Contact", questions: ["Preferred contact method"] },
      { surveyId: 1, surveyName: "Internet Accessibility", questions: ["Internet Access Type", "Has computer at home"] }
    ];
  }

  getQuestions(searchInSurvey: string) {
    let students = this.studentService.get(null);
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

  getSurveyAnswers(surveyId: number, surveyItem?: string, sectionName?: string) {
    let students = this.studentService.get(sectionName);
    return [].concat(...students.map(s =>
      s.surveys
        .filter(sv => sv.id == surveyId)
        .map(sf => {
          return {
            studentId: s.studentId,
            studentName: s.name,
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

  getSurveyAnalytics(surveyId: number, surveyItem: string, sectionName?: string) {
    let surveyResults = this.getSurveyAnswers(surveyId, surveyItem, sectionName);
    let data = [].concat(...
      surveyResults
        .map(cur => cur.surveyResults.items)
    )
      .reduce((acc, curr) => {
        acc[curr.answer] = (acc[curr.answer] ? acc[curr.answer] : 0) + 1;
        return acc;
      }, {});

    let answerCount = { labels: Object.keys(data), total: Object.keys(data).map(k => data[k]) };
    return answerCount;
  }



  /*  [{
        surveyId: number,
        surveyName: string,
        questionCount: number,
        totalStudents: number,
        studentsAnswered: number
      }]  
  */
  getSurveyMetadata(section: string, filter: string) {
    let upperFilter = filter ? filter.toUpperCase() : null;
    let students = this.studentService.get(section);
    let totalStudents = students.length;

    let questions = Object.values(students.reduce((accS, curS) => {
      return curS.surveys
          .filter(s => !upperFilter ||
                       s.name.toUpperCase().includes(upperFilter) || 
                       s.items.filter(i => i.question.toUpperCase().includes(upperFilter)).length > 0)
          .reduce((accSy, curSy) => {
        let survey = accSy[curSy.id];
        if (!survey) {
          survey = {
            surveyId: curSy.id,
            surveyName: curSy.name,
            questionCount: curSy.items.length,
            totalStudents: totalStudents,
            studentsAnswered: 0
          };
          accSy[curSy.id] = survey; 
        }
        survey.studentsAnswered++;
        return accSy;
      }, accS);
    }, {}));
    //console.log(filter, questions);
    return questions;
  }

  /*
  [{
    surveyId: number,
    question: string,
    topAnswers: [
      {label: string, count: number}
    ]
  }]
  */
  getSurveyQuestionSummaryList(surveyId:number, section: string){
    let surveyAnswers = this.getSurveyAnswers(surveyId, null, section);
    return Object.values(surveyAnswers.reduce((accSt, curSt) => {
      return curSt.surveyResults.items.reduce((accIt, curIt)=>{
        let surveyId = curSt.surveyResults.id;

        let question = accIt[curIt.question];
        if(!question){
          question = {
            surveyId: surveyId,
            question: curIt.question,
            answers: [],
            totalAnswers : 0
          };
          accIt[curIt.question] = question;
        }
        question.totalAnswers++;
        let answer = question.answers.find( a => a.label.toUpperCase() == curIt.answer.toUpperCase());
        if(!answer){
          answer = { label: curIt.answer, count: 0 };
          question.answers.push(answer);
        }
        answer.count++;
        return accIt;
      }, accSt);
    }, {}));
  }

}