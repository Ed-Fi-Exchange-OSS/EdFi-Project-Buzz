import * as React from 'react';
import { usePromiseTracker } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import styled from 'styled-components';

export const Spinner: React.FunctionComponent = () => {
  const { promiseInProgress } = usePromiseTracker(null);
  const SpinnerDiv= styled.div`
    min-width: 100vw;
    min-height: 100vh;
    width: 100%;
    height: 100%;
    z-index: 2;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  `;

  return (
    promiseInProgress && (
      <SpinnerDiv>
        <Loader type="Circles" color="rgb(0, 105, 217)"height="100" width="100">
        </Loader>
        <h3>Loading...</h3>
      </SpinnerDiv>
    )
  );
};
