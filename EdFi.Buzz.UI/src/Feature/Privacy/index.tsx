import { MainContainer } from 'buzztheme';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import marked from 'marked';
import DOMPurify from 'dompurify';
import { LeftArrowIcon } from '../../common/Icons';

export interface PrivacyProps {
  title: string;
}
const BackToHome = styled(Link)`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: center;
    width: 100%;
    height: 2rem;
    margin-bottom: 0.5rem;

    & > div {
      padding: 0.3rem;
      width: min-content;
      flex: 1;
      height: auto;
      justify-content: flex-start;
    }

    & > img {
      height: auto;
      width: auto;
      align-self: center;
      justify-self: center;
    }
  `;
const Privacy: React.FunctionComponent<PrivacyProps> = ({title}) => {
  const [markdownFile,setMarkdownFile] = useState(null);

  useEffect(() => {
    let isMounted = true; // note this flag denote mount status
    const readmePath = (`${window.location.origin}/PRIVACY.POLICY.md`);
    fetch(readmePath)
      .then(response => response.text())
      .then(text => {
        if(isMounted){
          setMarkdownFile(DOMPurify.sanitize(marked(text)));
        }
      });
    return () => {
      isMounted = false;
    }; // use effect cleanup to set flag false, if unmounted
  },[]);

  return <>
    <MainContainer role='main' className='container'>
      <BackToHome
        to={{
          pathname: '/'
        }}>
        <LeftArrowIcon />
        <div>Go back to Home</div>
      </BackToHome>
      <article>
        <section>
          <h2>{title}: Terms of Use and Privacy Policy</h2>
          <article dangerouslySetInnerHTML={{__html: markdownFile}}></article>
        </section>
      </article>
      <BackToHome
        to={{
          pathname: '/'
        }}>
        <LeftArrowIcon />
        <div>Go back to Home</div>
      </BackToHome>
    </MainContainer>
  </>;
};

Privacy.propTypes = {
  title: PropTypes.string
};
export default Privacy;
