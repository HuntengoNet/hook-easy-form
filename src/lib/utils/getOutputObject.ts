import { FormArray } from '../types';

export const getOutputObject = (f: FormArray): any => {
  return f.reduce((acc, elem) => ({ ...acc, [elem.name]: elem.value }), {});
};
