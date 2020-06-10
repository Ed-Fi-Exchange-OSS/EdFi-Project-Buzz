import { RouteComponentProps } from 'react-router';

interface SectionSurveySelectionProps {
  section: string;
  survey: string;
}

export type SectionSurveyProps = RouteComponentProps<SectionSurveySelectionProps>;
