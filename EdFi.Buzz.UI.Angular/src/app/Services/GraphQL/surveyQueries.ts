import gql from 'graphql-tag';


const getSurveySummaryBySectionKey = gql`
query($staffkey:ID!, $sectionkey:String!, $title:String){
  surveysummary(staffkey:$staffkey, sectionkey:$sectionkey, title:$title){
    surveykey
    sectionkey
    title
    numberofquestions
    studentsanswered
    totalstudents
  }
}
`;

const getSurveyQuestionsSummary = gql`
query($staffkey:ID!, $sectionkey:String!, $surveykey:Int){
  surveysummary(staffkey:$staffkey, sectionkey:$sectionkey, surveykey:$surveykey){
    surveykey
    sectionkey
    title
    questions{
      surveyquestionkey
      question
      answers(sectionkey:$sectionkey){
        studentschoolkey
        studentname
        answer
      }
    }
  }
}
`;


export { getSurveySummaryBySectionKey, getSurveyQuestionsSummary };
