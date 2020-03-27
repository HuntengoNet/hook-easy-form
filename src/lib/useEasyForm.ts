import { useState, useEffect, useCallback } from 'react';

import {
  EasyFormTypes,
  FormArray,
  FormObject,
  OnSubmit,
  OutputData,
} from './types';

export const useEasyForm = ({
  initialForm,
  resetAfterSubmit = false,
}: EasyFormTypes) => {
  const [formArray, setFormArray] = useState<FormArray>(initialForm);
  const [formObject, setFormObject] = useState<FormObject>({});

  const transformArrayToObject = (array: FormArray) =>
    setFormObject(
      array.reduce((acc, item) => ({ ...acc, [item.name]: item }), {}),
    );

  // transform when init form
  useEffect(
    useCallback(() => transformArrayToObject(initialForm), [initialForm]),
    [initialForm],
  );

  // transform each time when some property was updated
  useEffect(
    useCallback(() => transformArrayToObject(formArray), [formArray]),
    [formArray],
  );

  const resetEvent = () => {
    setFormArray(
      initialForm.map((el) => ({ ...el, value: '', touched: false })),
    );
  };

  const updateEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target) return;

    const { value, type, checked, name } = e.target;

    setFormArray(
      formArray.map((el) =>
        el.name === name
          ? {
              ...el,
              value: type === 'checkbox' ? checked : value,
              touched: true,
              // error: validator(el.validate, value),
            }
          : el,
      ),
    );
  };

  const submitEvent = useCallback(
    (callback: OnSubmit<OutputData>) => async (
      e?: React.BaseSyntheticEvent,
    ): Promise<void> => {
      const data = formArray.reduce(
        (acc, elem) => ({ ...acc, [elem.name]: elem.value }),
        {},
      );

      await callback(data, e);
      if (resetAfterSubmit) resetEvent();
    },
    [formArray],
  );

  return {
    formArray,
    formObject,
    resetEvent,
    updateEvent,
    submitEvent,
  };
};
