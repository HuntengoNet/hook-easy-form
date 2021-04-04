import { renderHook, act } from '@testing-library/react-hooks';

import { useEasyForm } from '../lib/useEasyForm';

const mockArray = [
  {
    name: 'FN',
    value: 'John',
  },
];

const mockObject = {
  FN: {
    name: 'FN',
    value: 'John',
  },
};

describe('useEasyForm()', () => {
  it('render simple form', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );
    expect(result.current.formArray).toEqual(mockArray);
    expect(result.current.formObject).toEqual(mockObject);
  });

  it('render with empty object', () => {
    const { result } = renderHook(() => useEasyForm({} as any));

    expect(result.current.formArray).toEqual([]);
    expect(result.current.formObject).toEqual({});
  });

  it('render with empty form data', () => {
    const { result } = renderHook(() => useEasyForm({ initialForm: [] }));

    expect(result.current.formArray).toEqual([]);
    expect(result.current.formObject).toEqual({});
  });

  it('submitEvent simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray, resetAfterSubmit: true }),
    );

    const f = jest.fn(() => {});
    const event = {
      preventDefault: () => console.log('preventDefault'),
      persist: () => console.log('persist'),
      target: {},
    };
    act(() => {
      result.current.submitEvent(f)(event as any);
    });

    expect(f).toHaveBeenCalled();

    expect(result.current.formArray).toEqual(mockArray);
    expect(result.current.formObject).toEqual(mockObject);
  });

  it('submitEvent simple case with error', () => {
    const rules = {
      required: (v: any) => (v.trim() === '' ? 'Required' : ''),
    };

    const initialForm = mockArray.map((el) => ({
      ...el,
      error: 'required',
      value: '',
      validate: rules,
    }));
    const { result } = renderHook(() =>
      useEasyForm({ initialForm, resetAfterSubmit: true }),
    );

    const f = jest.fn(() => {});
    const event = {
      preventDefault: () => console.log('preventDefault'),
      persist: () => console.log('persist'),
      target: {},
    };

    act(() => {
      result.current.submitEvent(f)(event as any);
    });

    const array = mockArray.map((el) => ({
      ...el,
      error: 'required',
      validate: rules,
      touched: true,
      value: '',
    }));

    const object = {
      FN: {
        name: 'FN',
        value: '',
        error: 'required',
        validate: rules,
        touched: true,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('render with default props', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray, defaultValues: { FN: 'Tony' } }),
    );

    expect(result.current.formArray).toEqual([{ name: 'FN', value: 'Tony' }]);
    expect(result.current.formObject).toEqual({
      FN: { name: 'FN', value: 'Tony' },
    });
  });

  it('reset func simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.resetEvent();
    });

    expect(result.current.formArray).toEqual(mockArray);
    expect(result.current.formObject).toEqual(mockObject);
  });

  it('reset func with wrong form data', () => {
    const { result } = renderHook(() => useEasyForm({ initialForm: [] }));

    act(() => {
      result.current.resetEvent();
    });

    expect(result.current.formArray).toEqual([]);
    expect(result.current.formObject).toEqual({});
  });

  it('updateEvent func simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      const params = {
        target: {
          type: 'text',
          value: 'Tony',
          name: 'FN',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.updateEvent(params);
    });

    const array = [
      {
        name: 'FN',
        value: 'Tony',
        touched: true,
        error: '',
      },
    ];

    const object = {
      FN: {
        name: 'FN',
        value: 'Tony',
        touched: true,
        error: '',
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('updateEvent func with incorrect name', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      const params = {
        target: {
          type: 'text',
          value: 'Tony',
          name: 'FN311',
        },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.updateEvent(params);
    });

    const array = mockArray.map((el) => ({ ...el, error: '' }));

    const object = {
      FN: {
        name: 'FN',
        value: 'John',
        error: '',
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('updateEvent func without params', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.updateEvent();
    });

    expect(result.current.formArray).toEqual(mockArray);
    expect(result.current.formObject).toEqual(mockObject);
  });

  it('setErrorManually func simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setErrorManually('FN', 'Incorrect');
    });

    const array = [
      {
        name: 'FN',
        value: 'John',
        touched: true,
        error: 'Incorrect',
      },
    ];

    const object = {
      FN: {
        name: 'FN',
        value: 'John',
        touched: true,
        error: 'Incorrect',
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('setErrorManually func without params', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setErrorManually();
    });

    expect(result.current.formArray).toEqual(mockArray);
    expect(result.current.formObject).toEqual(mockObject);
  });

  it('setValueManually func simple case', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setValueManually('FN', 'Tony');
    });

    const array = [
      {
        name: 'FN',
        value: 'Tony',
        touched: true,
        error: '',
      },
    ];

    const object = {
      FN: {
        name: 'FN',
        value: 'Tony',
        touched: true,
        error: '',
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('setValueManually func without params', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setValueManually();
    });

    const array = [
      {
        name: 'FN',
        value: 'John',
        error: '',
      },
    ];

    const object = {
      FN: {
        name: 'FN',
        value: 'John',
        error: '',
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('valid property should be true', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    expect(result.current.valid).toEqual(true);
  });

  it('pristine property should be true', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    expect(result.current.pristine).toEqual(true);
  });

  it('pristine property should be false', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setValueManually('FN', 'some value string');
    });

    expect(result.current.pristine).toEqual(false);
  });

  it('updateDefaultValues function', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    const df = { FN: 'Tony' };

    act(() => {
      result.current.updateDefaultValues(df);
    });

    const array = [
      {
        name: 'FN',
        value: df.FN,
      },
    ];

    const object = {
      FN: {
        name: 'FN',
        value: df.FN,
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });

  it('updateFormArray function', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    const array = [
      {
        name: 'FN',
        value: 'Tony',
      },
    ];

    act(() => {
      result.current.updateFormArray(array);
    });

    const object = {
      FN: {
        name: 'FN',
        value: 'Tony',
      },
    };

    expect(result.current.formArray).toEqual(array);
    expect(result.current.formObject).toEqual(object);
  });
});
