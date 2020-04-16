import { compareValues } from '../lib/utils/compareValuesInArrays';

const mockArray = [
  {
    name: 'FN',
    value: 'John',
  },
  {
    name: 'LN',
    value: 'Dou',
  },
];

const mockArrayInit = [
  {
    name: 'FN',
    value: 'John',
  },
  {
    name: 'LN',
    value: 'Dou',
  },
];

describe('compareValues()', () => {
  it('should return true', () => {
    expect(compareValues(mockArrayInit, mockArray)).toBe(true);
    expect(compareValues([], mockArray)).toBe(true);
  });

  it('should return false', () => {
    expect(
      compareValues(
        mockArrayInit,
        mockArray.map((el) => ({ ...el, value: 'diff' })),
      ),
    ).toBe(false);
  });
});
