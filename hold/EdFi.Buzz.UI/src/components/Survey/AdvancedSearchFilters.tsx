// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React, { useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import RadioButton from '../utilities/input/radioButton/RadioButton';
import AdvancedSearchData from './AdvancedSearchData';

import { SurveyAdvancedSearch } from './types/SurveyAdvancedSearchType';

type AdvancedSearchProps = {
  onFilterUpdate?(filterCriteria: SurveyAdvancedSearch): void;
};

const scrollableStyles = {
  maxHeight: '250px',
  overflow: 'auto',
};

const AdvancedSearchFilters: React.FC<AdvancedSearchProps> = ({ onFilterUpdate }) => {
  const [filterCriteria, setFilterCriteria] = React.useState<SurveyAdvancedSearch>({});

  useEffect(() => {
    if (onFilterUpdate) {
      onFilterUpdate(filterCriteria);
    }
  }, [filterCriteria, onFilterUpdate]);

  const studentSelectionChanged = (value: string) => {
    setFilterCriteria({ ...filterCriteria, studentSelection: value });
  };

  const surveySelectionChanged = (value: string, inputName: string) => {
    setFilterCriteria({ ...filterCriteria, questionId: value, surveyId: inputName });
  };

  const searchBarChanged = (value: string) => {
    // the search bar will require more work when we determine the expected behavior
    setFilterCriteria({ ...filterCriteria, studentId: value });
  };

  return (
    <Form>
      <Row className="section-container" style={{ marginTop: '15px' }}>
        <Col sm={12} md={4} style={scrollableStyles}>
          <RadioButton
            inputLabel={AdvancedSearchData.studentSelectionData.inputLabel}
            inputName={AdvancedSearchData.studentSelectionData.inputName}
            options={AdvancedSearchData.studentSelectionData.options}
            onInput={studentSelectionChanged}
          />
        </Col>
        <Col sm={12} md={8} style={scrollableStyles}>
          <Row>
            <Col xs={12}>
              <Form.Group controlId="SearchBar">
                <Form.Control
                  type="text"
                  placeholder="Type student name or class name"
                  aria-describedby="inputGroupPrepend"
                  name="username"
                  onInput={(e: React.SyntheticEvent) => {
                    const target = e.target as HTMLInputElement;
                    searchBarChanged(target.value);
                  }}
                />
              </Form.Group>
            </Col>
            {!AdvancedSearchData.surveysList ? (
              <></>
            ) : (
              AdvancedSearchData.surveysList.map(({ inputLabel, inputName, options }) => (
                <Col sm={12} md={6} key={inputName}>
                  <RadioButton
                    inputLabel={inputLabel}
                    inputName={inputName}
                    options={options}
                    onInput={surveySelectionChanged}
                  />
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default AdvancedSearchFilters;
