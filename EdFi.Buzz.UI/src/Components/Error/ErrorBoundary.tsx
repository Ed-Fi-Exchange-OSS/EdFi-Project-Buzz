import React, {ErrorInfo, ReactNode} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: ErrorInfo;
};

export default class ErrorBoundary extends React.Component  {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  public state: ErrorBoundaryState = {
    hasError: false
  };

  private ErrorMessage = styled.div`
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
    border-radius: 15px;
    border: 3px solid #ffeeba;
    padding: 20px;
  `;

  static getDerivedStateFromError(error: ErrorInfo): ErrorBoundaryState {    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch=(error: Error, info: ErrorInfo): void => {
    console.error('ErrorBoundary caught an error', error, info);
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <><this.ErrorMessage>
        <h3>Buzz has encountered an unrecoverable error.</h3>
        <p>Any edits may have been lost.</p>
        <p>It is best that you refresh your browser, and contact support if the error keeps happening.
        </p>
      </this.ErrorMessage></>
      ;
    }

    return this.props.children; ;
  }
}
