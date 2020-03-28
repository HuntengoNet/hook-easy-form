import { FormArray, OutputData } from '../types';

export const getOutputObject = (f: FormArray): OutputData => {
  return f.reduce((acc, elem) => ({ ...acc, [elem.name]: elem.value }), {});
};
