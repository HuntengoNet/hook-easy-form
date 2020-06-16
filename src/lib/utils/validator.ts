import { RULES, OTHER_VALUES } from '../types';

export const validator = (
  value: any,
  otherValues: OTHER_VALUES,
  rules?: RULES,
): string => {
  if (!rules) return '';
  return Object.keys(rules).reduce((acc, item) => {
    if (acc) return acc;
    const validateFunc = rules[item as string];
    if (validateFunc && typeof validateFunc === 'function') {
      return validateFunc(value, otherValues);
    }

    return '';
  }, '' as string);
};
