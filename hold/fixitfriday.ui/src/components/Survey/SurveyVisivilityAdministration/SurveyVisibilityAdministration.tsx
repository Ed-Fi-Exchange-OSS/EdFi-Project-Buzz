import React, { useEffect, useState, useCallback, FC } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PageHeader from './pageHeader';
import { SurveyQuestionType } from '../types/SurveyQuestionType';

import SectionSurveyResultsData from '../mockData/SectionSurveyResultsData';
import SurveyQuestions from './SurveyQuestions';
import { SurveyDefinitionType } from '../types/SurveyDefinitionType';

const headerData: Array<SurveyDefinitionType> = SectionSurveyResultsData.surveydefinition;

const SurveyVisibilityAdministration: FC = () => {
  const [surveyKey, setSurveyKey] = useState<string>('');
  const [surveysData, setSurveysData] = useState<Array<SurveyQuestionType>>([]);
  const [surveyAvailability, setSurveyAvailability] = useState<boolean>(false);

  const onSurveyChange = useCallback((evt: string) => {
    setSurveyKey(evt);
  }, []);

  const onSurveyAvailabilityChange = useCallback((evt: boolean) => {
    setSurveyAvailability(evt);
  }, []);

  useEffect(() => {
    let roster: Array<SurveyQuestionType> = [];
    if (surveyKey) {
      const survey = headerData.find(x => x.surveykey === surveyKey);
      if (survey !== undefined) roster = survey.questions;
    }
    setSurveysData(roster);
  }, [surveyKey, surveyAvailability]);

  return (
    <>
      <Row className="section-container">
        <Col xs={12}>
          <PageHeader
            Surveys={headerData}
            onSurveyChange={onSurveyChange}
            onSurveyAvailabilityChange={onSurveyAvailabilityChange}
          />
          <hr />
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <SurveyQuestions survey={surveysData} surveyDisabled={surveyAvailability} />
        </Col>
      </Row>
    </>
  );
};

export default SurveyVisibilityAdministration;
