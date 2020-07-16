// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { FC } from 'react';
import Table from 'react-bootstrap/Table';
import { StudentDetailSurveyType } from '../Student/types/StudentDetailTypes';
import { SectionSurveyGridProps } from './types/SectionSurveyGridProps';
import { SurveyQuestionType } from './types/SurveyQuestionType';
import { SectionSurveyType } from './types/SectionSurveyType';
import StudentSurveyAnswerModal from './StudentSurveyAnswerModal';

const SectionSurveyGrid: FC<SectionSurveyGridProps> = ({ surveyresult }) => {
  const definition = surveyresult.surveydefinition;
  const surveyanswers = surveyresult.answers;

  const results = (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          {definition.questions && definition.questions.length > 0 && surveyanswers && surveyanswers.length > 0 ? (
            <th>Student Name</th>
          ) : (
            ''
          )}
          {definition.questions && definition.questions.length > 0 && surveyanswers && surveyanswers.length > 0 ? (
            definition.questions.map((q: SurveyQuestionType) => <th key={q.id}>{q.question}</th>)
          ) : (
            <th>
              <strong>No data</strong>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {surveyanswers && surveyanswers.length > 0 ? (
          surveyanswers.map((s: SectionSurveyType) =>
            s.answers && s.answers.length > 0 ? (
              s.answers.map((a: StudentDetailSurveyType) => (
                <tr key={`${s.surveykey}-${s.sectionkey}-${a.id}`}>
                  <td>{a.name}</td>
                  {a.questions && a.questions.length > 0 ? (
                    a.questions.map((q: SurveyQuestionType) => (
                      <td key={`${s.surveykey}-${s.sectionkey}-${a.id}-${q.id}`}>
                        <StudentSurveyAnswerModal
                          studentId={a.id}
                          studentName={a.name}
                          surveyDefinition={surveyresult.surveydefinition}
                          studentanswer={q}
                        />
                      </td>
                    ))
                  ) : (
                    <td>&nbsp;</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td>&nbsp;</td>
              </tr>
            ),
          )
        ) : (
          <tr>
            <td>&nbsp;</td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  return results;
};

export default SectionSurveyGrid;
