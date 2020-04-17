import { setDefaultValues } from '../lib/utils/setDefaultValuesToArray';

const mockArray = [
  {
    name: 'FN',
    value: '',
  },
  {
    name: 'LN',
    value: '',
  },
];

const mockObject = {
  FN: 'John',
  LN: 'Dou',
};

describe('setDefaultValues()', () => {
  it('should return array with default values', () => {
    const outputArray = [
      {
        name: 'FN',
        value: 'John',
      },
      {
        name: 'LN',
        value: 'Dou',
      },
    ];
    expect(setDefaultValues(mockArray, mockObject)).toEqual(outputArray);
  });

  it('should return array without default values', () => {
    expect(setDefaultValues([])).toEqual([]);
    expect(setDefaultValues(mockArray)).toEqual(mockArray);
  });
});
