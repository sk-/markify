import regexp from './regexp';

describe('findAll', () => {
  test('return an empty array when there are no matches', () => {
    expect(regexp.findAll(/foo/, 'bar')).toHaveLength(0);
  });

  test('return the whole matches', () => {
    expect(regexp.findAll(/\w(\w) /g, 'xy bar yz foo')).toEqual([
      {
        index: 0,
        match: 'xy ',
      },
      {
        index: 4,
        match: 'ar ',
      },
      {
        index: 7,
        match: 'yz ',
      },
    ]);
  });

  test('return all matches for non global regex', () => {
    expect(regexp.findAll(/\w(\w) /, 'xy bar yz foo')).toEqual([
      {
        index: 0,
        match: 'xy ',
      },
      {
        index: 4,
        match: 'ar ',
      },
      {
        index: 7,
        match: 'yz ',
      },
    ]);
  });
});

describe('escape', () => {
  test('escape special symbols', () => {
    expect(regexp.escape('\\ ^ $ * + ? . ( ) | { } [ ]')).toBe(
      '\\\\ \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]'
    );
  });

  test('do not escape non special symbols', () => {
    expect(regexp.escape('Nothing special here')).toBe('Nothing special here');
  });
});
