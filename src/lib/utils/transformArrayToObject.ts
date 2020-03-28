import { FormArray, FormObject } from '../types';

export const transformArrayToObject = (a: FormArray): FormObject => {
  if (!a || !Array.isArray(a) || a.length === 0) return {};
  return a.reduce((acc, item) => ({ ...acc, [item.name]: item }), {});
};
