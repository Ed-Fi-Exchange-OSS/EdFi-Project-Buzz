import * as React from 'react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { ApiService } from 'src/app/Services/api.service';
import { SearchInSections } from 'src/app/Components/SearchInSectionsUIReact/SearchInSections';
import { Section, SurveyMetadata } from 'src/app/Models';

import { SurveyMetadataUI } from './surveyMetadataUI';

export interface SurveyAnalyticsComponentProps {
  api: ApiService;
}

export const SurveyAnalytics: FunctionComponent<SurveyAnalyticsComponentProps> = (props: SurveyAnalyticsComponentProps) => {

  const teacher = props.api.authentication.currentUserValue.teacher;
  const [sectionList, setSections] = useState(teacher.sections as Section[]);
  const [surveyMetadataList, setSurveyMetadataList] = useState([] as SurveyMetadata[]);
  const [selectedSectionKey, setSelectedSectionKey] = useState(null as string);
  const [showSearchResults, setShowSearchResults] = useState(false);

  function onSearchHandle(sectionKey: string, studentFilter: string) {
    props.api.surveyAnalytics
      .getSurveyMetadata(sectionKey, studentFilter)
      .then(result => {
        setSurveyMetadataList(result);
        setSelectedSectionKey(sectionKey);
        setShowSearchResults(true);
      });
  }

  function OnsurveySelectedHandler(surveyMetadata: SurveyMetadata){
    alert(`Suvey selected: [${surveyMetadata.title}]`);
  }

  return <main role='main' className='container'>
    <div className='position-relative p-t-10 back-button'>
      <a className='btn-outline-nav inline-block position-relative' onClick={() => history.back()}>
        <i className='ion ion-md-arrow-dropleft f-s-37 position-absolute'></i>
      </a>
      <h1 className='inline-block position-absolute'>Survey <span>results</span></h1>
    </div>

    <SearchInSections sectionList={sectionList} onSearch={onSearchHandle} defaultValue={selectedSectionKey} />

    {(!showSearchResults) && <h1>Click "Search" to Show Results</h1>}
    {(showSearchResults) && <h1>Search Results</h1>}

    {(showSearchResults) && <div className="row" >
      <SurveyMetadataUI surveyMetadataList={surveyMetadataList} onSurveySelected={OnsurveySelectedHandler} />
    </div>
    }

  </main>;
};
