import { FormArray } from '../types';

export const compareValues = (
  initForm: FormArray,
  currentForm: FormArray,
): boolean => {
  if (initForm.length === 0) return true;
  return currentForm.reduce((acc, item) => {
    if (!acc) return false;
    const initItem = initForm.find((el) => el.name === item.name);
    if (!initItem) return true;
    return item.value === initItem.value;
  }, true as boolean);
};
