import React, {Component} from 'react';
import { MainContainer, HeadlineContainer, TitleSpanContainer } from '../../buzztheme';
import styled from 'styled-components';

interface ErrorBoundaryProps{

}

interface ErrorBoundaryState{
  hasError: boolean
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState>  {

  private ErrorMessage = styled.div`
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
    border-radius: 15px;
    border: 3px solid #ffeeba;
    padding: 20px;
  `;
  constructor(props) {
       super(props);
       this.state = {hasError: false };
    }

    static getDerivedStateFromError(error) {    // Update state so the next render will show the fallback UI.
      return {
        hasError: true};
    }

    componentDidCatch=(error, info) => {
       // You can also log the error to an error reporting service

    }

    render() {
      if (this.state.hasError)
      {
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
