import * as React from 'react';
import { SurveyMetadata } from 'src/app/Models';
import { StyledCard } from '../../../buzztheme';
import styled from 'styled-components';

import RightChevron from '../../../assets/chevron-right.png';

export interface SurveyMetadataUIComponentProps {
  surveyMetadataList: SurveyMetadata[];
  selectedSurveyKey?: number;
  onSurveySelected?: (surveyMetadata: SurveyMetadata) => void;
}

interface ColoredBarProps {
  color: string;
}

const SurveyStyledCardContainer = styled.div``;

const SurveyStyledCard = styled(StyledCard)<ColoredBarProps>`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 0;
  :active,
  .survey-selected {
    border: 2px solid var(--denim);
  }

  & div.card-body {
    display: flex;
    flex: 4;
    flex-direction: row;
    justify-content: flex-start;
  }

  & div.survey-card-container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  & .survey-card-container.survey-metadata-container {
    flex: 20;
    width: 100%;
    border-left-style: solid !important;
    border-left-width: thick !important;
    border-left-color: ${(props) => props.color} !important;
    padding-left: 1em;
  }

  & div.chevron-nav {
    flex: 1;
    display: flex;
    align-items: center;
    height: 100%;
    width: fit-content;

    img:hover {
      cursor: pointer;
    }
  }
`;

export const SurveyMetadataUI: React.FunctionComponent<SurveyMetadataUIComponentProps> = (
  props: SurveyMetadataUIComponentProps,
) => {
  const colorList: string[] = ['#03a9f4', '#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0'];

  return (
    <>
      {props.surveyMetadataList.length === 0 && (
        <div className="col-12">
          <div className="alert alert-warning">No survey found.</div>
        </div>
      )}
      {props.surveyMetadataList.map((surveyMetadata, idx) => {
        return (
          <SurveyStyledCardContainer
            className={`col-12 col-md-6 ${surveyMetadata.surveykey === props.selectedSurveyKey ? 'survey-selected' : null}`}
            key={surveyMetadata.surveykey}
            onClick={() => props.onSurveySelected(surveyMetadata)}
          >
            <SurveyStyledCard className="card survey-metadata" color={colorList[idx % 6]}>
              <div className={`card-body`}>
                <div className={'survey-card-container survey-metadata-container'}>
                  <div className="h2-desktop">{surveyMetadata.title}</div>
                  <div>
                    <span className="bold">Questions:</span> {surveyMetadata.numberofquestions}{' '}
                  </div>
                  <div>
                    <span className="bold">Completed:</span> {surveyMetadata.studentsanswered} of{' '}
                    {surveyMetadata.totalstudents} students
                  </div>
                </div>
                <div className="chevron-nav">
                  <img style={{ width: '12px', height: '22px' }} src={RightChevron} />
                </div>
              </div>
            </SurveyStyledCard>
          </SurveyStyledCardContainer>
        );
      })}
    </>
  );
};
