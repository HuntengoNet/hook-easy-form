import { FormArray, OTHER_VALUES } from '../types';

export const getOutputObject = (f: FormArray): any => {
  return f.reduce((acc, elem) => ({ ...acc, [elem.name]: elem.value }), {});
};

export const getOtherValues = (
  f: FormArray,
  exclude?: string,
): OTHER_VALUES => {
  return f.reduce(
    (acc, elem) =>
      elem.name === exclude ? acc : { ...acc, [elem.name]: elem.value },
    {},
  );
};
