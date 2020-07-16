// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SectionSurveyRostType } from '../types/SectionSurveyRostType';

const SectionSurveyResultsData: SectionSurveyRostType = {
  surveydefinition: [
    {
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
    {
      surveykey: '2',
      surveyname: 'Internet Accessibility Survey',
      questions: [
        {
          id: '1',
          question: 'Donec accumsan',
          answer: '',
        },
        {
          id: '2',
          question: 'Turpis eget porta',
          answer: '',
        },
        {
          id: '3',
          question: 'Duis imperdiet',
          answer: '',
        },
        {
          id: '4',
          question: 'Pellentesque enim',
          answer: '',
        },
      ],
    },
    {
      surveykey: '11',
      surveyname: 'Week Wll-Check (LMS)',
      questions: [
        {
          id: '1',
          question: 'Donec sagittis',
          answer: '',
        },
        {
          id: '2',
          question: 'Pellentesque ex tellus',
          answer: '',
        },
        {
          id: '3',
          question: 'Quisque euismod',
          answer: '',
        },
        {
          id: '4',
          question: 'Sed lacinia',
          answer: '',
        },
      ],
    },
    {
      surveykey: '3',
      surveyname: '6 Week Well-Check (Excel)',
      questions: [
        {
          id: '1',
          question: 'Aenean eget sem ',
          answer: '',
        },
        {
          id: '2',
          question: 'Fusce sit amet ',
          answer: '',
        },
        {
          id: '3',
          question: 'Maecenas ac suscipit',
          answer: '',
        },
        {
          id: '4',
          question: 'Nullam vulputate',
          answer: '',
        },
      ],
    },
    {
      surveykey: '4',
      surveyname: 'Vestibulum tincidunt (Maecenas)',
      questions: [
        {
          id: '1',
          question: 'Phasellus justo',
          answer: '',
        },
        {
          id: '2',
          question: 'Vestibulum iaculis',
          answer: '',
        },
        {
          id: '3',
          question: 'Duis imperdiet',
          answer: '',
        },
        {
          id: '4',
          question: 'Duis sit amet',
          answer: '',
        },
      ],
    },
    {
      surveykey: '5',
      surveyname: '2 Week (Phasellus)',
      questions: [
        {
          id: '1',
          question: 'Nullam accumsan',
          answer: '',
        },
        {
          id: '2',
          question: 'Proin quis sem',
          answer: '',
        },
        {
          id: '3',
          question: 'Aliquam erat ',
          answer: '',
        },
        {
          id: '4',
          question: 'Mauris varius egestas',
          answer: '',
        },
      ],
    },
  ],
  surveyresults: [
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
              comments: 'Bandwidth: 100 MB',
            },
            {
              id: '2',
              question: '',
              answer: 'Yes',
              comments: 'Family phone',
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
    {
      surveykey: '2',
      sectionkey: '1',
      answers: [
        {
          id: '9',
          name: 'Second John Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Mobile',
            },
            {
              id: '2',
              question: '',
              answer: 'No',
            },
            {
              id: '3',
              question: '',
              answer: 'No',
            },
            {
              id: '4',
              question: '',
              answer: 'Yes',
            },
          ],
        },
        {
          id: '8',
          name: 'Second Jane Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Home',
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
              answer: 'Yes',
            },
          ],
        },
        {
          id: '7',
          name: 'Second Student Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'OF Internet',
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
              answer: 'Yes',
            },
          ],
        },
      ],
    },
    {
      surveykey: '11',
      sectionkey: '1',
      answers: [
        {
          id: '1',
          name: 'Third John Doe',
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
          name: 'Third Jane Doe',
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
          id: '2',
          name: 'Third Student Doe',
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
    {
      surveykey: '3',
      sectionkey: '1',
      answers: [
        {
          id: '9',
          name: 'Fourth John Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Mobile',
            },
            {
              id: '2',
              question: '',
              answer: 'No',
            },
            {
              id: '3',
              question: '',
              answer: 'No',
            },
            {
              id: '4',
              question: '',
              answer: 'Yes',
            },
          ],
        },
        {
          id: '8',
          name: 'Fourth Jane Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Home',
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
              answer: 'Yes',
            },
          ],
        },
        {
          id: '7',
          name: 'Fourth Jane Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'OF Internet',
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
              answer: 'Yes',
            },
          ],
        },
      ],
    },
    {
      surveykey: '1',
      sectionkey: '2',
      answers: [
        {
          id: '1',
          name: 'Fifth John Doe',
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
          name: 'Fifth Jane Doe',
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
          id: '25',
          name: 'Fifth Student Doe',
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
    {
      surveykey: '4',
      sectionkey: '2',
      answers: [
        {
          id: '9',
          name: 'Sixth John Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Mobile',
            },
            {
              id: '2',
              question: '',
              answer: 'No',
            },
            {
              id: '3',
              question: '',
              answer: 'No',
            },
            {
              id: '4',
              question: '',
              answer: 'Yes',
            },
          ],
        },
        {
          id: '8',
          name: 'Sixth Jane Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Home',
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
              answer: 'Yes',
            },
          ],
        },
        {
          id: '7',
          name: 'Sixth Student Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'OF Internet',
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
              answer: 'Yes',
            },
          ],
        },
      ],
    },
    {
      surveykey: '5',
      sectionkey: '2',
      answers: [
        {
          id: '1',
          name: 'Seventh John Doe',
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
          name: 'Seventh Jane Doe',
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
          id: '2',
          name: 'Seventh Student Doe',
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
    {
      surveykey: '3',
      sectionkey: '2',
      answers: [
        {
          id: '9',
          name: 'Eighth John Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Mobile',
            },
            {
              id: '2',
              question: '',
              answer: 'No',
            },
            {
              id: '3',
              question: '',
              answer: 'No',
            },
            {
              id: '4',
              question: '',
              answer: 'Yes',
            },
          ],
        },
        {
          id: '8',
          name: 'Eighth Jane Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Home',
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
              answer: 'Yes',
            },
          ],
        },
        {
          id: '7',
          name: 'Eighth Student Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'OF Internet',
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
              answer: 'Yes',
            },
          ],
        },
      ],
    },
    {
      surveykey: '1',
      sectionkey: '2',
      answers: [
        {
          id: '1',
          name: 'Nineth John Doe',
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
          id: '26',
          name: 'Nineth Jane Doe',
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
          id: '27',
          name: 'Nineth Student Doe',
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
    {
      surveykey: '4',
      sectionkey: '2',
      answers: [
        {
          id: '9',
          name: 'Tenth John Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Mobile',
            },
            {
              id: '2',
              question: '',
              answer: 'No',
            },
            {
              id: '3',
              question: '',
              answer: 'No',
            },
            {
              id: '4',
              question: '',
              answer: 'Yes',
            },
          ],
        },
        {
          id: '8',
          name: 'Tenth Jane Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Home',
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
              answer: 'Yes',
            },
          ],
        },
        {
          id: '7',
          name: 'Tenth Student Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'OF Internet',
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
              answer: 'Yes',
            },
          ],
        },
      ],
    },
    {
      surveykey: '5',
      sectionkey: '2',
      answers: [
        {
          id: '1',
          name: 'Eleventh John Doe',
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
          name: 'Eleventh Jane Doe',
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
          id: '2',
          name: 'Eleventh Student Doe',
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
    {
      surveykey: '3',
      sectionkey: '2',
      answers: [
        {
          id: '9',
          name: 'Twelfth John Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Mobile',
            },
            {
              id: '2',
              question: '',
              answer: 'No',
            },
            {
              id: '3',
              question: '',
              answer: 'No',
            },
            {
              id: '4',
              question: '',
              answer: 'Yes',
            },
          ],
        },
        {
          id: '8',
          name: 'Twelfth Jane Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'Home',
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
              answer: 'Yes',
            },
          ],
        },
        {
          id: '7',
          name: 'Twelfth Student Doe',
          date: '2020-06-01',
          questions: [
            {
              id: '1',
              question: '',
              answer: 'OF Internet',
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
              answer: 'Yes',
            },
          ],
        },
      ],
    },
  ],
};

export default SectionSurveyResultsData;
