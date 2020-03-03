// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class markdown {
  static isRuler(text: string): boolean {
    return /^(-{3,}|\*{3,}|_{3,})$/.test(text);
  }

  static getIndentMarkup(text: string): string | null {
    const match = /^\s*>[>\s]*/.exec(text);
    if (match) {
      return match[0];
    }
    return null;
  }

  static getIndentSize(text: string): number {
    return (text.match(/>/g) || []).length;
  }

  static getHeadingMarkup(text: string): string | null {
    const match = /^\s*#{1,6}(?!#)\s*/.exec(text);
    if (match) {
      return match[0];
    }
    return null;
  }

  static getHeadingSize(text: string): number {
    return (text.match(/#/g) || []).length;
  }

  static getLanguage(text: string): string | null {
    const match = /^```(.*)/.exec(text);
    if (match) {
      return match[1] || 'auto';
    }
    return null;
  }

  static BOLD_REGEX = /\b__.+?__\b|\*\*.+?\*\*/;
  static ITALIC_REGEX = /\b_[^_]+?_\b|\*[^*]+?\*(?!\*)/;
  static STRIKETHROUGH_REGEX = /~~.+?~~/;
  static INLINE_CODE_REGEX = /`.+?`/;
}
