import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortAnswersBy'
})
export class SortAnswersByPipe implements PipeTransform {

  readonly STUDENT_NAME_STRING: string = 'Student Name';

  transform(collection: any, columnName: string = '', asc: boolean = true): any {
    return this.sortSurveyBy(collection, columnName, asc);
  }

  sortSurveyBy(collection: any, columnName: string, asc: boolean) {

    if (!collection) { return []; }
    const list = collection
      .sort((a, b) => {
        const firstField = this.compare(
          this.getAnswerFromSurvey(a, columnName),
          this.getAnswerFromSurvey(b, columnName),
          asc);
        if (firstField !== 0) {
          return firstField;
        }
        return this.compare(this.getAnswerFromSurvey(a, this.STUDENT_NAME_STRING),
          this.getAnswerFromSurvey(b, this.STUDENT_NAME_STRING),
          true);
      });
    return list;
  }

  compare(a: any, b: any, asc: boolean): number {
    const ascValue: number = asc ? 1 : -1;
    return a > b ? ascValue
      : (a === b ? 0 : ascValue * -1);
  }

  getAnswerFromSurvey(survey: any, question: string) {
    if (!question) { return null; }
    const qUpper = question.toUpperCase();
    if (question === this.STUDENT_NAME_STRING) {
      return survey.studentname;
    }
    const qMap = Object
      .keys(survey.questions)
      .reduce((acc, cur, arr) => { acc[survey.questions[cur].toUpperCase()] = cur; return acc; }, {});
    return survey.answers[qMap[qUpper]];
  }


}
