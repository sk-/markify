// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class styles {
  static BOLD = {[DocumentApp.Attribute.BOLD]: true};

  static ITALIC = {[DocumentApp.Attribute.ITALIC]: true};

  static STRIKETHORUGH = {[DocumentApp.Attribute.STRIKETHROUGH]: true};

  static INLINE_CODE = {
    [DocumentApp.Attribute.BACKGROUND_COLOR]: '#f3f4f4',
    [DocumentApp.Attribute.FONT_FAMILY]: 'Consolas',
  };
  static CODE = styles.INLINE_CODE;

  static getIndentStyle(indentSize: number) {
    return {
      [DocumentApp.Attribute.INDENT_START]: indentSize * 36,
      [DocumentApp.Attribute.INDENT_FIRST_LINE]: indentSize * 36,
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#6a737d',
    };
  }

  private static GITHUB_STRING = {
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#032f62',
  };

  private static GITHUB_KEYWORD = {
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#d73a49',
  };

  private static GITHUB_LITERAL = {
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#0086b3',
  };

  private static GITHUB_SECTION = {
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#63a35c',
  };

  private static GITHUB_TITLE = {
    [DocumentApp.Attribute.FOREGROUND_COLOR]: '#6f42c1',
  };

  static GITHUB: {[style: string]: any} = {
    comment: {
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#6a737d',
    },
    string: styles.GITHUB_STRING,
    variable: styles.GITHUB_STRING,
    'template-variable': styles.GITHUB_STRING,
    strong: styles.GITHUB_STRING,
    emphasis: styles.GITHUB_STRING,
    quote: styles.GITHUB_STRING,
    doctag: styles.GITHUB_STRING,
    number: {
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#005cc5',
    },
    keyword: styles.GITHUB_KEYWORD,
    'selector-tag': styles.GITHUB_KEYWORD,
    type: styles.GITHUB_KEYWORD,
    subst: styles.GITHUB_KEYWORD,

    literal: styles.GITHUB_LITERAL,
    symbol: styles.GITHUB_LITERAL,
    bullet: styles.GITHUB_LITERAL,
    attribute: styles.GITHUB_LITERAL,

    section: styles.GITHUB_SECTION,
    name: styles.GITHUB_SECTION,

    tag: {
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#333333',
    },

    title: styles.GITHUB_TITLE,
    attr: styles.GITHUB_TITLE,
    meta: styles.GITHUB_TITLE,
    'selector-id': styles.GITHUB_TITLE,
    'selector-class': styles.GITHUB_TITLE,
    'selector-attr': styles.GITHUB_TITLE,
    'selector-pseudo': styles.GITHUB_TITLE,

    addition: {
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#55a532',
      [DocumentApp.Attribute.BACKGROUND_COLOR]: '#eaffea',
    },

    deletion: {
      [DocumentApp.Attribute.FOREGROUND_COLOR]: '#bd2c00',
      [DocumentApp.Attribute.BACKGROUND_COLOR]: '#ffecec',
    },

    link: {
      [DocumentApp.Attribute.UNDERLINE]: true,
    },
  };
}
