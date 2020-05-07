import { useState, useEffect, useCallback } from 'react';

import { validator } from './utils/validator';
import { transformArrayToObject } from './utils/transformArrayToObject';
import { hasAnyErrorsInForm } from './utils/hasErrors';
import { getOutputObject } from './utils/getOutputObject';
import { compareValues } from './utils/compareValuesInArrays';
import { setDefaultValues } from './utils/setDefaultValuesToArray';

import { EasyFormTypes, FormArray, FormObject, OnSubmit } from './types';

export const useEasyForm = (props?: EasyFormTypes) => {
  if (!props || Object.keys(props).length === 0) {
    console.warn('Need pass initialForm property');
    return {
      formArray: [] as FormArray,
      formObject: {} as FormObject,
      resetEvent: useCallback(() => {}, []),
      updateEvent: useCallback((e?: any) => {}, []),
      setErrorManually: useCallback((name?: string, error?: string) => {}, []),
      setValueManually: useCallback((name?: string, value?: any) => {}, []),
      submitEvent: (callback: OnSubmit<any>) => async (
        e?: React.BaseSyntheticEvent,
      ): Promise<void> => {},
      pristine: true,
    };
  }

  const { defaultValues, initialForm, resetAfterSubmit } = props;
  const [formArray, setFormArray] = useState<FormArray>(
    setDefaultValues(initialForm, defaultValues),
  );
  const [formObject, setFormObject] = useState<FormObject>({});
  const [pristine, setPristine] = useState<boolean>(true);

  // transform each time when some property was updated
  useEffect(() => {
    setFormObject(transformArrayToObject(formArray));
    const isSame = compareValues(
      Array.isArray(initialForm)
        ? setDefaultValues(initialForm, defaultValues)
        : [],
      formArray,
    );
    setPristine(isSame);
  }, [formArray]);

  const resetEvent = () => {
    if (!Array.isArray(initialForm)) return;
    setFormArray(setDefaultValues(initialForm, defaultValues));
  };

  const updateEvent = (e?: any) => {
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

  const submitEvent = (callback: OnSubmit<any>) => async (
    e?: React.BaseSyntheticEvent,
  ): Promise<void> => {
    if (e) {
      e.preventDefault();
      e.persist();
    }
    const hasAnyErrorInForm = hasAnyErrorsInForm(formArray);
    if (hasAnyErrorInForm)
      return setFormArray(
        formArray.map((el) => ({
          ...el,
          touched: true,
          error: el.error ? el.error : validator(el.value, el.validate),
        })),
      );

    const data = getOutputObject(formArray);
    await callback(data, e);
    if (resetAfterSubmit) resetEvent();
  };

  return {
    formArray,
    formObject,
    resetEvent: useCallback(resetEvent, [defaultValues]),
    updateEvent: useCallback(updateEvent, [formArray]),
    setErrorManually: useCallback(setErrorManually, [formArray]),
    setValueManually: useCallback(setValueManually, [formArray]),
    submitEvent,
    pristine,
  };
};
