import * as React from 'react';
import { FunctionComponent, useEffect, useState } from 'react';
import { Section } from 'Models';
import SurveyMetadata from 'Models/SurveyMetadata';
import { useLocation } from 'react-router-dom';
import ApiService from '../../Services/ApiService';
import { SearchInSections } from '../../Components/SearchInSections/searchInSections';
import { SurveyMetadataUI } from './surveyMetadataUI';
import { HeadlineContainer, MainContainer, TitleSpanContainer, TotalRecordsContainer } from '../../buzztheme';
import SurveyAnswersSummary from './surveyAnswersSummary';

export interface SurveyAnalyticsComponentProps {
  api: ApiService;
}

export const SurveyAnalytics: FunctionComponent<SurveyAnalyticsComponentProps> = (props: SurveyAnalyticsComponentProps) => {
  const location = useLocation();
  const {teacher} = props.api.authentication.currentUserValue;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [locationSection] = useState<{sectionKey: string } | any>(location.state);
  const [sectionList] = useState(teacher.sections as Section[]);
  const [surveyMetadataList, setSurveyMetadataList] = useState([] as SurveyMetadata[]);
  const [selectedSectionKey, setSelectedSectionKey] = useState(null as string);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSurveyMetadata] = useState(null as SurveyMetadata);
  function onSearchHandle(sectionKey: string, studentFilter: string) {
    props.api.surveyAnalytics.getSurveyMetadata(sectionKey, studentFilter).then((result) => {
      setSurveyMetadataList(result);
      setSelectedSectionKey(sectionKey);
      setShowSearchResults(true);
    });
  }

  useEffect(() => {
    if(locationSection && locationSection.sectionKey){
      setSelectedSectionKey(locationSection.sectionKey);
      onSearchHandle(locationSection.sectionKey, '');
    }
  }, [locationSection]);// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <MainContainer role='main' className='container'>
      <HeadlineContainer>
        <TitleSpanContainer>Surveys</TitleSpanContainer>
        <TotalRecordsContainer>Total {surveyMetadataList.length}</TotalRecordsContainer>
      </HeadlineContainer>
      <SearchInSections
        sectionList={sectionList}
        onSearch={onSearchHandle}
        defaultValue={selectedSectionKey}
        searchFilterPlaceholder={'Filter survey titles'}
      />

      {showSearchResults && (
        <div className='row'>
          <SurveyMetadataUI
            key={surveyMetadataList.length}
            api={props.api}
            surveyMetadataList={surveyMetadataList}
            selectedSurveyKey={selectedSurveyMetadata ? selectedSurveyMetadata.surveykey : null}
          />
        </div>
      )}
      {selectedSurveyMetadata &&
      <SurveyAnswersSummary api={props.api} selectedSurveyMetadata={selectedSurveyMetadata}></SurveyAnswersSummary>
      }
    </MainContainer>
  );
};

export default SurveyAnalytics;
