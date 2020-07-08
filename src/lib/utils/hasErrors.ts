import { FormArray, OTHER_VALUES } from '../types';

import { validator } from './validator';

export const hasAnyErrorsInForm = (
  f: FormArray,
  otherValues: OTHER_VALUES,
): boolean => {
  return f.reduce((acc, item) => {
    if (acc) return acc;
    const error = validator(item.value, otherValues, item.validate);
    return error !== '';
  }, false as boolean);
};

export const checkFormValid = (f: FormArray): boolean => {
  return f.reduce((acc, item) => {
    if (!acc) return acc;
    if (item.error) return false;
    return true;
  }, true as boolean);
};
