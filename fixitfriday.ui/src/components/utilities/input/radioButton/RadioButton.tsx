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
