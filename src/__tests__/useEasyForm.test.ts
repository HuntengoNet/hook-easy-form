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
      useEasyForm({ initialForm: mockArray }),
    );

    const f = jest.fn(() => {});
    act(() => {
      result.current.submitEvent(f);
    });

    expect(result.current.formArray).toEqual(mockArray);
    expect(result.current.formObject).toEqual(mockObject);
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

  it('updateEvent func with without params', () => {
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

    expect(result.current.formArray).toEqual(mockArray);
    expect(result.current.formObject).toEqual(mockObject);
  });

  it('valid property should be true', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    expect(result.current.valid).toEqual(true);
  });

  it('valid property should be false', () => {
    const { result } = renderHook(() =>
      useEasyForm({ initialForm: mockArray }),
    );

    act(() => {
      result.current.setErrorManually('FN', 'some error string');
    });

    expect(result.current.valid).toEqual(false);
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
});
