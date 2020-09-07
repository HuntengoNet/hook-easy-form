export type RULES = { [key in string]?: (v: any, p: OTHER_VALUES) => string };
export type OTHER_VALUES = { [key in string]: any };

export type Item = {
  name: string;
  value?: any;
  options?: { [Key in string]: any };
  error?: string;
  touched?: boolean;
  validate?: RULES;
  asyncValidation?: (v: any, p: OTHER_VALUES) => Promise<string>;
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
  data: (data: T, event?: React.BaseSyntheticEvent) => void | Promise<void>,
  event?: React.BaseSyntheticEvent,
) => ((event: React.FormEvent<HTMLFormElement>) => void) | undefined;

export type AsyncValidationFunc = (item: Item, v: any, p: OTHER_VALUES) => void;

export type HookType<T> = {
  formArray: Item[];
  formObject: FormObject;
  resetEvent: () => void;
  updateEvent: (e?: any) => void;
  setErrorManually: (name?: string, error?: string) => void;
  setValueManually: (name?: string, value?: any) => void;
  updateDefaultValues: (v: DefaultValues) => void;
  updateFormArray: (array: FormArray) => void;
  submitEvent: OnSubmit<T>;
  pristine: boolean;
  valid: boolean;
};
