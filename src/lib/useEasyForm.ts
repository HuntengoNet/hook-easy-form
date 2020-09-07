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
  DefaultValues,
  AsyncValidationFunc,
  HookType,
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

  const updateDefaultValues = (v: DefaultValues) => {
    if (!v || Object.keys(v).length === 0) return;
    df.current = v;
    setFormArray(setDefaultValues(initialForm, v));
  };

  const updateFormArray = (array: FormArray) => {
    if (!array || !Array.isArray(array)) return;

    setFormArray(array);
  };

  const updateEvent = (e?: any) => {
    if (!e || !e.target) return;

    const { value, type, checked, name } = e.target;

    const otherValues = getOtherValues(formArray, name);
    setFormArray(
      formArray.map((el) => {
        if (el.name === name) {
          const v = type === 'checkbox' ? checked : value;

          asyncValidation(el, v, otherValues);

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

  const asyncValidation: AsyncValidationFunc = async (item, v, otherValues) => {
    if (item.asyncValidation && typeof item.asyncValidation === 'function') {
      const errorString = await item.asyncValidation(v, otherValues);
      if (errorString) {
        setFormArray((ps) =>
          ps.map((el) =>
            el.name === item.name ? { ...el, error: errorString } : el,
          ),
        );
      }
    }
  };

  const submitEvent: OnSubmit<T> = (callback) => async (e) => {
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
