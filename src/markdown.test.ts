import markdown from './markdown';

describe('isRuler', () => {
  test('matches rulers with ---', () => {
    expect(markdown.isRuler('---')).toBeTruthy();
    expect(markdown.isRuler('----')).toBeTruthy();
    expect(markdown.isRuler('-----')).toBeTruthy();
  });

  test('matches rulers with ___', () => {
    expect(markdown.isRuler('___')).toBeTruthy();
    expect(markdown.isRuler('____')).toBeTruthy();
    expect(markdown.isRuler('_____')).toBeTruthy();
  });

  test('matches rulers with ***', () => {
    expect(markdown.isRuler('***')).toBeTruthy();
    expect(markdown.isRuler('****')).toBeTruthy();
    expect(markdown.isRuler('*****')).toBeTruthy();
  });

  test('does not match ruler with trailing char', () => {
    expect(markdown.isRuler('--- ')).toBeFalsy();
    expect(markdown.isRuler('___ ')).toBeFalsy();
    expect(markdown.isRuler('*** ')).toBeFalsy();
  });

  test('does not match ruler with leading char', () => {
    expect(markdown.isRuler(' ---')).toBeFalsy();
    expect(markdown.isRuler(' ___')).toBeFalsy();
    expect(markdown.isRuler(' ***')).toBeFalsy();
  });
});

describe('getIndentMarkup', () => {
  test('accepts indent with spaces', () => {
    expect(markdown.getIndentMarkup(' >  > >> this is indented by 4')).toBe(
      ' >  > >> '
    );
  });

  test('returns null when no indent', () => {
    expect(markdown.getIndentMarkup(' this is not indented')).toBeNull();
  });
});

describe('getIndentSize', () => {
  test('counts all levels', () => {
    expect(markdown.getIndentSize(' >  > >> ')).toBe(4);
  });
});

describe('getHeadingMarkup', () => {
  test('accepts headings', () => {
    expect(markdown.getHeadingMarkup('# H1')).toBe('# ');
    expect(markdown.getHeadingMarkup('## H2')).toBe('## ');
    expect(markdown.getHeadingMarkup('### H3')).toBe('### ');
    expect(markdown.getHeadingMarkup('#### H4')).toBe('#### ');
    expect(markdown.getHeadingMarkup('##### H5')).toBe('##### ');
    expect(markdown.getHeadingMarkup('###### H6')).toBe('###### ');
  });

  test('accepts headings with leading and trailing sspaces', () => {
    expect(markdown.getHeadingMarkup('   #    H1')).toBe('   #    ');
  });

  test('returns null when heading is too deep', () => {
    expect(
      markdown.getHeadingMarkup('####### this is 7 levels deep')
    ).toBeNull();
  });

  test('returns null when no heading', () => {
    expect(markdown.getHeadingMarkup(' this is not a header')).toBeNull();
  });
});

describe('getHeadingSize', () => {
  test('counts all levels', () => {
    expect(markdown.getHeadingSize('#  ')).toBe(1);
    expect(markdown.getHeadingSize('##  ')).toBe(2);
    expect(markdown.getHeadingSize('###  ')).toBe(3);
    expect(markdown.getHeadingSize('#### ')).toBe(4);
    expect(markdown.getHeadingSize('##### ')).toBe(5);
    expect(markdown.getHeadingSize('######  ')).toBe(6);
  });
});

describe('getLanguage', () => {
  test('returns auto when no language is specified', () => {
    expect(markdown.getLanguage('```')).toBe('auto');
  });

  test('returns the specified language', () => {
    expect(markdown.getLanguage('```python')).toBe('python');
  });

  test('returns null for malformed string', () => {
    expect(markdown.getLanguage('``python')).toBeNull();
  });
});

describe('BOLD_REGEX', () => {
  test('works with **', () => {
    expect(markdown.BOLD_REGEX.exec('this is **bold**')![0]).toBe('**bold**');
  });

  test('works with __', () => {
    expect(markdown.BOLD_REGEX.exec('this is __bold__')![0]).toBe('__bold__');
  });

  test('rejects snake case', () => {
    expect(markdown.BOLD_REGEX.test('this is __snake__case'));
  });
});

describe('ITALIC_REGEX', () => {
  test('works with *', () => {
    expect(markdown.ITALIC_REGEX.exec('this is *italic*')![0]).toBe('*italic*');
  });

  test('works with _', () => {
    expect(markdown.ITALIC_REGEX.exec('this is _italic_')![0]).toBe('_italic_');
  });

  test('rejects snake case', () => {
    expect(markdown.ITALIC_REGEX.test('this is _snake_case')).toBeFalsy();
  });

  test('rejects bold **', () => {
    expect(markdown.ITALIC_REGEX.test('this is **bold**')).toBeFalsy();
  });

  test('rejects bold __', () => {
    expect(markdown.ITALIC_REGEX.test('this is __bold__')).toBeFalsy();
  });
});

describe('STRIKETHROUGH_REGEX', () => {
  test('works with ~~', () => {
    expect(
      markdown.STRIKETHROUGH_REGEX.exec('this is ~~strikedthrough~~')![0]
    ).toBe('~~strikedthrough~~');
  });
});

describe('INLINE_CODE_REGEX', () => {
  test('works with `', () => {
    expect(markdown.INLINE_CODE_REGEX.exec('this is `code`')![0]).toBe(
      '`code`'
    );
  });
});
