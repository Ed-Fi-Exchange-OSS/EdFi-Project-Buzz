export type QuestionPropsType = {
  id: string;
  question: string;
  checked: boolean;
  surveyDisabled?: boolean;

  onCheckboxChange?(questionKey: string, value: string): void;
};
