import { getOutputObject } from '../lib/utils/getOutputObject';

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

const outputData = { FN: 'John', LN: 'Dou' };

describe('getOutputObject()', () => {
  it('should return output object', () => {
    expect(getOutputObject(mockArray)).toEqual(outputData);
  });

  it('should return empty object', () => {
    expect(getOutputObject([])).toEqual({});
  });
});
