import { hasAnyErrorsInForm } from '../lib/utils/hasErrors';

const mockArray = [
  {
    name: 'FN',
    value: '',
    validate: {
      required: (v: string) => (v.trim() === '' ? 'Required' : ''),
    },
  },
  {
    name: 'LN',
    value: 'Dou',
  },
];

describe('hasAnyErrorsInForm()', () => {
  it('should return error = true ', () => {
    expect(hasAnyErrorsInForm(mockArray)).toEqual(true);
  });

  it('should return error = false', () => {
    const form = mockArray.map((el) =>
      el.name === 'FN' ? { ...el, value: 'John' } : el,
    );
    expect(hasAnyErrorsInForm(form)).toEqual(false);
  });
});
