import { FormArray } from '../types';

import { validator } from './validator';

export const hasAnyErrorsInForm = (f: FormArray): boolean => {
  return f.reduce((acc, item) => {
    if (acc) return acc;
    const error = validator(item.value, item.validate);
    return error !== '';
  }, false as boolean);
};
