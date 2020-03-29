import { RULES } from '../types';

export const validator = (value: any, rules?: RULES): string => {
  if (!rules) return '';
  return Object.keys(rules).reduce((acc, item) => {
    if (acc) return acc;
    const validateFunc = rules[item as string];
    if (validateFunc && typeof validateFunc === 'function') {
      return validateFunc(value);
    }

    return '';
  }, '' as string);
};
