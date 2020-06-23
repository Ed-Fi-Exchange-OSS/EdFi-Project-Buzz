import { SurveyClassType } from './SurveyClassType';

export interface SurveyRosterProps {
  surveys: Array<SurveyClassType>;

  onHide?(): void;
}
