import React, { SFC } from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingMessage: SFC = () => {
  return (
    <Spinner animation="border" variant="info">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
};

export default LoadingMessage;
