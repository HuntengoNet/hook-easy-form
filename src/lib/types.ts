export type RULES = { [key in string]?: (v: any) => string };

export type Item = {
  name: string;
  value?: any;
  options?: { [Key in string]: any };
  error?: string;
  touched?: boolean;
  validate?: RULES;
};

export type FormArray = Item[];
export type FormObject = { [K in string]: Item };
export type DefaultValues = { [K in string]: any };

export type EasyFormTypes = {
  initialForm: Item[];
  resetAfterSubmit?: boolean;
  defaultValues?: DefaultValues;
};

export type OnSubmit<T> = (
  data: T,
  event?: React.BaseSyntheticEvent,
) => void | Promise<void>;
