import React, { FunctionComponent } from 'react';
import { Alert } from 'react-bootstrap';

type ErrorMessageProps = {
  message: string;
};

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ message }) => {
  return (
    <Alert variant="danger">{message && message !== null ? 'An error has occurred processing the request.' : message}</Alert>
  );
};

export default ErrorMessage;
