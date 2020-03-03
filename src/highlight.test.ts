import highlight from './highlight';

import * as hljs from './vendor/highlight';

describe('encodeLanguage', () => {
  test('returns #c0deff for auto lang', () => {
    expect(highlight.encodeLanguage('auto')).toBe('#c0deff');
  });

  test('returns #c0deff for unknown lang', () => {
    expect(highlight.encodeLanguage('unknown')).toBe('#c0deff');
  });

  test('returns #c0de12 for python lang', () => {
    expect(highlight.encodeLanguage('python')).toBe('#c0de12');
  });

  test('returns #c0de12 for python py alias', () => {
    expect(highlight.encodeLanguage('py')).toBe('#c0de12');
  });
});

describe('decodeLanguage', () => {
  test('returns auto for #c0deff', () => {
    expect(highlight.decodeLanguage('#c0deff')).toBe('auto');
  });

  test('returns auto for value outside range', () => {
    expect(highlight.decodeLanguage('#c0defe')).toBe('auto');
  });

  test('returns python for #c0de12', () => {
    expect(highlight.decodeLanguage('#c0de12')).toBe('python');
  });

  test('returns null for invalid encoding', () => {
    expect(highlight.decodeLanguage('#ccdea3')).toBeNull();
  });
});

describe('highlightCode', () => {
  test('uses the provided language', () => {
    expect(highlight.highlightCode('foo + 3', 'python')).toBe(
      'foo + <span class="number">3</span>'
    );
  });

  test('defaults to auto for unknown language', () => {
    expect(highlight.highlightCode('foo 3', 'unknown')).toBe(
      '<span class="string">foo</span> <span class="number">3</span>'
    );
  });
});

describe('LANGUAGES', () => {
  test('contains the same entries as hljs', () => {
    expect(highlight.LANGUAGES).toEqual(
      expect.arrayContaining(hljs.listLanguages())
    );
  });
});
