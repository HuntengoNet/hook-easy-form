import { useState, useRef, useCallback } from 'react';

import { validator } from './utils/validator';
import { transformArrayToObject } from './utils/transformArrayToObject';
import { hasAnyErrorsInForm, checkFormValid } from './utils/hasErrors';
import { getOutputObject, getOtherValues } from './utils/getOutputObject';
import { compareValues } from './utils/compareValuesInArrays';
import { setDefaultValues } from './utils/setDefaultValuesToArray';

import {
  EasyFormTypes,
  FormArray,
  OnSubmit,
  HookType,
  SetValueManually,
  SetErrorManually,
  UpdateEvent,
  UpdateFormArray,
  UpdateDefaultValues,
} from './types';

export const useEasyForm = <T>({
  defaultValues,
  initialForm,
  resetAfterSubmit,
}: EasyFormTypes): HookType<T> => {
  const [formArray, setFormArray] = useState<FormArray>(
    setDefaultValues(initialForm, defaultValues),
  );

  const df = useRef(defaultValues || {});
  const formObject = transformArrayToObject(formArray);

  const pristine = compareValues(
    Array.isArray(initialForm) ? setDefaultValues(initialForm, df.current) : [],
    formArray,
  );

  const valid =
    !hasAnyErrorsInForm(formArray, getOtherValues(formArray)) &&
    checkFormValid(formArray);

  const resetEvent = () => {
    if (!Array.isArray(initialForm)) return;
    setFormArray(setDefaultValues(initialForm, df.current));
  };

  const updateDefaultValues: UpdateDefaultValues = (v) => {
    if (!v || Object.keys(v).length === 0) return;
    df.current = v;
    setFormArray(setDefaultValues(initialForm, v));
  };

  const updateFormArray: UpdateFormArray = (array) => {
    if (!array || !Array.isArray(array)) return;

    setFormArray(array);
  };

  const updateEvent: UpdateEvent = (e) => {
    if (!e || !e.target) return;
    const { value, type, checked, name } = e.target;
    const v = type === 'checkbox' ? checked : value;

    setFormArray((ps: FormArray) => {
      const newForm = ps.map((el) => {
        if (el.name === name) {
          return { ...el, value: v, touched: true };
        }
        return el;
      });

      return newForm.map((el) => {
        const otherValues = getOtherValues(newForm, el.name);
        const error = validator(el.value, otherValues, el.validate);
        return { ...el, error };
      });
    });
  };

  const setErrorManually: SetErrorManually = (name, error) => {
    setFormArray((ps: FormArray) =>
      ps.map((el) => (el.name === name ? { ...el, touched: true, error } : el)),
    );
  };

  const setValueManually: SetValueManually = (name, value) => {
    setFormArray((ps: FormArray) => {
      const newForm = ps.map((el) => {
        if (el.name === name) {
          return { ...el, value, touched: true };
        }
        return el;
      });

      return newForm.map((el) => {
        const otherValues = getOtherValues(newForm, el.name);
        const error = validator(el.value, otherValues, el.validate);
        return { ...el, error };
      });
    });
  };

  const submitEvent: OnSubmit<T> = (callback) => async (e) => {
    if (e) {
      e.preventDefault();
      e.persist();
    }

    const otherValues = getOtherValues(formArray);
    const hasAnyErrorInForm = hasAnyErrorsInForm(formArray, otherValues);
    if (hasAnyErrorInForm) {
      setFormArray(
        formArray.map((el) => ({
          ...el,
          touched: true,
          error: el.error
            ? el.error
            : validator(el.value, otherValues, el.validate),
        })),
      );

      return {};
    }

    const data = getOutputObject<T>(formArray);
    await callback(data, e);
    if (resetAfterSubmit) resetEvent();
  };

  return {
    formArray,
    formObject,
    resetEvent: useCallback(resetEvent, [df.current]),
    updateEvent: useCallback(updateEvent, [formArray]),
    setErrorManually: useCallback(setErrorManually, [formArray]),
    setValueManually: useCallback(setValueManually, [formArray]),
    updateDefaultValues: useCallback(updateDefaultValues, [formArray]),
    updateFormArray: useCallback(updateFormArray, [formArray, df.current]),
    submitEvent,
    pristine,
    valid,
  };
};
