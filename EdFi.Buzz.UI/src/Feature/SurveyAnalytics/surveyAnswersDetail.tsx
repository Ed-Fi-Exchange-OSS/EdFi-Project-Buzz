import * as React from 'react';
import { MainContainer , HeadlineContainer, TitleSpanContainer, TotalRecordsContainer } from 'buzztheme';
import styled from 'styled-components';
import { Section, SurveyMetadata } from 'Models';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ApiService from 'Services/ApiService';
import { SearchInSections } from 'Components/SearchInSections/searchInSections';
import SurveyAnswersSummary from './surveyAnswersSummary';
import { LeftArrowIcon } from '../../common/Icons';

export interface SurveyAnswersDetailProps {
  api: ApiService;
}
const SurveyAnswersDetail: React.FunctionComponent<SurveyAnswersDetailProps> = (props: SurveyAnswersDetailProps) => {
  const location = useLocation();
  const {teacher} = props.api.authentication.currentUserValue;
  const [sectionList] = useState(teacher.sections as Section[]);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [stateData]=useState<{metadata: SurveyMetadata} | any>(location.state);
  const [surveyMetadataList,setSurveyMetadataList] = useState(stateData.surveyMetadata);
  const [selectedSectionKey, setSelectedSectionKey] = useState(surveyMetadataList.sectionkey);
  const [noData, setNoData] = useState(false);
  const BackToSurvey = styled(Link)`
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
  function onSearchHandle(sectionKey: string, studentFilter: string) {
    setSelectedSectionKey(sectionKey);
    props.api.surveyAnalytics.getSurveyMetadata(sectionKey, studentFilter).then((result) => {
      if(result && result.length > 0){
        setSurveyMetadataList(result[0]);
        setNoData(false);

      } else{
        setNoData(true);
      }
    });
  }
  return (
    <MainContainer role='main' className='container'>
      <BackToSurvey
        to={{
          pathname: '/surveyAnalytics',
          state: {sectionKey: selectedSectionKey} }}>
        <LeftArrowIcon />
        <div className='student-detail-go-back-label'>Go back to Surveys</div>
      </BackToSurvey>
      <HeadlineContainer>
        <TitleSpanContainer>{stateData.surveyMetadata.title}</TitleSpanContainer>
        <TotalRecordsContainer>{stateData.surveyMetadata.numberofquestions} questions</TotalRecordsContainer>
      </HeadlineContainer>
      <SearchInSections
        sectionList={sectionList}
        onSearch={onSearchHandle}
        defaultValue={selectedSectionKey}
        searchFilterPlaceholder={'Filter survey titles'}
        hideSurveyTitleSearch={true}
      />
      { noData && (
        <div className='col-12'>
          <div className='alert alert-warning'>No survey found.</div>
        </div>
      )
      }
      {!noData && (
        <SurveyAnswersSummary api={props.api} selectedSurveyMetadata={stateData.surveyMetadata}/>
      )}
    </MainContainer>
  );
};

export default SurveyAnswersDetail;
