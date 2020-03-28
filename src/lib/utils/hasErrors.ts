import { FormArray } from '../types';

import { validator } from './validator';

export const hasAnyErrorsInForm = (f: FormArray): [boolean, FormArray] => {
  const newForm = f.map((el) => {
    return {
      ...el,
      touched: true,
      error: validator(el.value, el.validate),
    };
  });

  const hasErrors = newForm.some((el) => el.error);

  return [hasErrors, newForm];
};
