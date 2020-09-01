import { useState, useEffect, useCallback } from 'react';

import { validator } from './utils/validator';
import { transformArrayToObject } from './utils/transformArrayToObject';
import { hasAnyErrorsInForm, checkFormValid } from './utils/hasErrors';
import { getOutputObject, getOtherValues } from './utils/getOutputObject';
import { compareValues } from './utils/compareValuesInArrays';
import { setDefaultValues } from './utils/setDefaultValuesToArray';

import {
  EasyFormTypes,
  FormArray,
  FormObject,
  OnSubmit,
  DefaultValues,
} from './types';

export const useEasyForm = ({
  defaultValues,
  initialForm,
  resetAfterSubmit,
}: EasyFormTypes) => {
  const [formArray, setFormArray] = useState<FormArray>(
    setDefaultValues(initialForm, defaultValues),
  );
  const [df, setDf] = useState<DefaultValues | undefined>(defaultValues);
  const [formObject, setFormObject] = useState<FormObject>({});
  const [pristine, setPristine] = useState<boolean>(true);
  const [valid, setValid] = useState<boolean>(true);

  // transform each time when some property was updated
  useEffect(() => {
    setFormObject(transformArrayToObject(formArray));
    const isSame = compareValues(
      Array.isArray(initialForm) ? setDefaultValues(initialForm, df) : [],
      formArray,
    );
    setPristine(isSame);
    const otherValues = getOtherValues(formArray);
    const hasAnyErrorInForm = hasAnyErrorsInForm(formArray, otherValues);

    setValid(!hasAnyErrorInForm && checkFormValid(formArray));
  }, [formArray]);

  const resetEvent = () => {
    if (!Array.isArray(initialForm)) return;
    setFormArray(setDefaultValues(initialForm, df));
  };

  const updateDefaultValues = (v: DefaultValues) => {
    if (!v || Object.keys(v).length === 0) return;
    setDf(v);
    setFormArray(setDefaultValues(initialForm, v));
  };

  const updateFormArray = (array: FormArray, defaultValues?: DefaultValues) => {
    if (!array || !Array.isArray(array)) return;
    setDf(defaultValues);
    setFormArray(setDefaultValues(array, defaultValues));
  };

  const updateEvent = (e?: any) => {
    if (!e || !e.target) return;

    const { value, type, checked, name } = e.target;

    const otherValues = getOtherValues(formArray, name);
    setFormArray(
      formArray.map((el) => {
        if (el.name === name) {
          const v = type === 'checkbox' ? checked : value;
          return {
            ...el,
            value: v,
            touched: true,
            error: validator(v, otherValues, el.validate),
          };
        }
        return el;
      }),
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
    setFormArray((ps) => {
      const otherValues = getOtherValues(ps, name);

      return ps.map((el) =>
        el.name === name
          ? {
              ...el,
              touched: true,
              value,
              error: validator(value, otherValues, el.validate),
            }
          : el,
      );
    });
  };

  const submitEvent = (callback: OnSubmit<any>) => async (
    e?: React.BaseSyntheticEvent,
  ): Promise<void> => {
    if (e) {
      e.preventDefault();
      e.persist();
    }

    if (!checkFormValid(formArray)) return;

    const otherValues = getOtherValues(formArray);
    const hasAnyErrorInForm = hasAnyErrorsInForm(formArray, otherValues);
    if (hasAnyErrorInForm) {
      return setFormArray(
        formArray.map((el) => ({
          ...el,
          touched: true,
          error: el.error
            ? el.error
            : validator(el.value, otherValues, el.validate),
        })),
      );
    }

    const data = getOutputObject(formArray);
    await callback(data, e);
    if (resetAfterSubmit) resetEvent();
  };

  return {
    formArray,
    formObject,
    resetEvent: useCallback(resetEvent, [df]),
    updateEvent: useCallback(updateEvent, [formArray]),
    setErrorManually: useCallback(setErrorManually, [formArray]),
    setValueManually: useCallback(setValueManually, [formArray]),
    updateDefaultValues: useCallback(updateDefaultValues, [formArray]),
    updateFormArray: useCallback(updateFormArray, [formArray, df]),
    submitEvent,
    pristine,
    valid,
  };
};
