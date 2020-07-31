// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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

const getSurveyStatus = gql`
query ($staffKey:ID!, $jobKey:String) {
  surveystatus(staffkey:$staffKey, jobkey:$jobKey){
    surveystatuskey
    staffkey
    surveykey
    jobkey
    jobstatuskey
    resultsummary
    jobstatus{
      jobstatuskey
      description
    }
  }
}
`;

export { getSurveySummaryBySectionKey, getSurveyQuestionsSummary, getSurveyStatus };
