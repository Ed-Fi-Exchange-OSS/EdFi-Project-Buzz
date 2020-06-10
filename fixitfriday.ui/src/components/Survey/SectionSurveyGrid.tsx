import React, { FC } from 'react';
import Table from 'react-bootstrap/Table';
import { StudentDetailSurveyType } from '../Student/types/StudentDetailTypes';
import { SectionSurveyGridProps } from './types/SectionSurveyGridProps';
import { SurveyQuestionType } from './types/SurveyQuestionType';
import { SectionSurveyType } from './types/SectionSurveyType';

const SectionSurveyGrid: FC<SectionSurveyGridProps> = ({ surveyresult }) => {
  const definition = surveyresult.surveydefinition;
  const surveyanswers = surveyresult.answers;
  const results = (
    <Table striped bordered hover size="sm" responsive>
      <thead>
        <tr>
          <th>Student Name</th>
          {definition.questions && definition.questions.length > 0 ? (
            definition.questions.map((q: SurveyQuestionType) => <th key={q.id}>{q.question}</th>)
          ) : (
            <th>&nbsp;</th>
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
                      <td key={`${s.surveykey}-${s.sectionkey}-${a.id}-${q.id}`}>{q.answer}</td>
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
