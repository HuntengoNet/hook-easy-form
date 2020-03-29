import { useState, useEffect, useCallback } from 'react';

import { validator } from './utils/validator';
import { transformArrayToObject } from './utils/transformArrayToObject';
import { hasAnyErrorsInForm } from './utils/hasErrors';
import { getOutputObject } from './utils/getOutputObject';

import {
  EasyFormTypes,
  FormArray,
  FormObject,
  OnSubmit,
  OutputData,
} from './types';

export const useEasyForm = (props?: EasyFormTypes) => {
  const [formArray, setFormArray] = useState<FormArray>([]);
  const [formObject, setFormObject] = useState<FormObject>({});

  // initialize
  useEffect(() => {
    if (!props || props.initialForm.length === 0) return setFormArray([]);
    setFormArray(props.initialForm);
  }, []);

  // transform each time when some property was updated
  useEffect(() => {
    setFormObject(transformArrayToObject(formArray));
  }, [formArray]);

  const resetEvent = () => {
    if (!props || !Array.isArray(props.initialForm)) return;
    setFormArray(
      props.initialForm.map((el) => ({ ...el, value: '', touched: false })),
    );
  };

  const updateEvent = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (!e || !e.target) return;

    const { value, type, checked, name } = e.target;

    setFormArray(
      formArray.map((el) =>
        el.name === name
          ? {
              ...el,
              value: type === 'checkbox' ? checked : value,
              touched: true,
              error: validator(value, el.validate),
            }
          : el,
      ),
    );
  };

  const setErrorManually = (name?: string, error?: string) => {
    setFormArray(
      formArray.map((el) =>
        el.name === name
          ? {
              ...el,
              touched: true,
              error,
            }
          : el,
      ),
    );
  };

  const setValueManually = (name?: string, value?: any) => {
    setFormArray(
      formArray.map((el) =>
        el.name === name
          ? {
              ...el,
              touched: true,
              value,
              error: validator(value, el.validate),
            }
          : el,
      ),
    );
  };

  const submitEvent = useCallback(
    (callback: OnSubmit<OutputData>) => async (
      e?: React.BaseSyntheticEvent,
    ): Promise<void> => {
      const hasAnyErrorInForm = hasAnyErrorsInForm(formArray);
      if (hasAnyErrorInForm)
        return setFormArray(
          formArray.map((el) => ({
            ...el,
            touched: true,
            error: validator(el.value, el.validate),
          })),
        );

      const data = getOutputObject(formArray);
      await callback(data, e);
      if (props && props.resetAfterSubmit) resetEvent();
    },
    [formArray],
  );

  return {
    formArray,
    formObject,
    resetEvent: useCallback(resetEvent, []),
    updateEvent: useCallback(updateEvent, [formArray]),
    setErrorManually: useCallback(setErrorManually, [formArray]),
    setValueManually: useCallback(setValueManually, [formArray]),
    submitEvent,
  };
};
