import React from 'react';
import { Row, Col } from 'react-bootstrap';

import answers from '../Charts/mockData/chartMockData';
import AdvancedSearchFilters from './AdvancedSearchFilters';
import SurveyPieChart from '../Charts/SurveyPieChart';

const Header = () => {
  return (
    <Row className="section-container">
      <Col xs={12}>
        <h1>Survey Results Finder</h1>
      </Col>
    </Row>
  );
};

const AdvancedSearch: React.FC = () => {
  return (
    <>
      <Header />
      <AdvancedSearchFilters />
      <SurveyPieChart question="Internet Access" questionId="1" answers={answers} />
    </>
  );
};

export default AdvancedSearch;
