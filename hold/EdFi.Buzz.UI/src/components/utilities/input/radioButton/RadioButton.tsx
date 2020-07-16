// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import React from 'react';
import { Form } from 'react-bootstrap';
import { RadioButtonProps } from './RadioButtonTypes';

const RadioButton: React.FC<RadioButtonProps> = ({ inputLabel, inputName, options, onInput }) => {
  const checkSelected = (value: string) => {
    if (onInput) {
      onInput(value, inputName);
    }
  };

  return (
    <Form.Group>
      <Form.Label>{inputLabel}</Form.Label>
      {options.map(({ radioLabel, value }) => (
        <Form.Check
          label={radioLabel}
          key={value}
          type="radio"
          name={inputName}
          onInput={(e: React.SyntheticEvent) => {
            const target = e.target as HTMLInputElement;
            checkSelected(target.value);
          }}
        />
      ))}
    </Form.Group>
  );
};

export default RadioButton;
