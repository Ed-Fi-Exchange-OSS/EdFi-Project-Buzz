import React from 'react';
import { render } from '@testing-library/react';
import SectionSurveyGrid from './SectionSurveyGrid';
import { SurveyResultsType } from './types/SurveyResultsType';

test('renders Survey Modal', () => {
  const sectionSurveys: SurveyResultsType = {
    surveydefinition: {
      surveykey: '1',
      surveyname: 'Survey Description (survey source)',
      questions: [
        {
          id: '1',
          question: 'Internet Access Type',
          answer: '',
        },
        {
          id: '2',
          question: 'Has Phone',
          answer: '',
        },
        {
          id: '3',
          question: 'Has Email',
          answer: '',
        },
        {
          id: '4',
          question: 'Has WebCam',
          answer: '',
        },
      ],
    },
    answers: [
      {
        surveykey: '1',
        sectionkey: '1',
        answers: [
          {
            id: '1',
            name: 'One John Doe',
            date: '2020-06-01',
            questions: [
              {
                id: '1',
                question: '',
                answer: 'High Speed Internet',
              },
              {
                id: '2',
                question: '',
                answer: 'Yes',
              },
              {
                id: '3',
                question: '',
                answer: 'Yes',
              },
              {
                id: '4',
                question: '',
                answer: 'No',
              },
            ],
          },
          {
            id: '2',
            name: 'One Jane Doe',
            date: '2020-06-01',
            questions: [
              {
                id: '1',
                question: '',
                answer: 'School Hot Spot',
              },
              {
                id: '2',
                question: '',
                answer: 'No',
              },
              {
                id: '3',
                question: '',
                answer: 'Yes',
              },
              {
                id: '4',
                question: '',
                answer: 'No',
              },
            ],
          },
          {
            id: '3',
            name: 'One Student Doe',
            date: '2020-06-01',
            questions: [
              {
                id: '1',
                question: '',
                answer: 'No Internet',
              },
              {
                id: '2',
                question: '',
                answer: 'Yes',
              },
              {
                id: '3',
                question: '',
                answer: 'No',
              },
              {
                id: '4',
                question: '',
                answer: 'No',
              },
            ],
          },
        ],
      },
    ],
  };
  const { getByText } = render(<SectionSurveyGrid surveyresult={sectionSurveys} />);
  const surveyHasSurveyQuestion = getByText(sectionSurveys.surveydefinition.questions[0].question);
  const surveyHasSurveyAnswer = getByText(sectionSurveys.answers[0].answers[0].questions[0].answer);

  expect(surveyHasSurveyQuestion).toBeTruthy();
  expect(surveyHasSurveyAnswer).toBeTruthy();
});
