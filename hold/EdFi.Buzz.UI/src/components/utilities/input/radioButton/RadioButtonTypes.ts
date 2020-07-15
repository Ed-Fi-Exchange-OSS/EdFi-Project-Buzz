export type RadioButtonOption = {
  radioLabel: string;
  value: string;
};

export type RadioButtonProps = {
  options: Array<RadioButtonOption>;
  onInput?(value: string, inputName: string): void;
  value?: string;
  inputLabel: string;
  inputName: string;
};
