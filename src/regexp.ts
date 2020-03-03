interface Match {
  match: string;
  index: number;
}

// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class regexp {
  static SYNTAX_CHARS = /[\^$\\.*+?()[\]{}|]/g;

  static findAll(regex: RegExp, text: string): Match[] {
    // GoogleAppsScript returns undefined if no flags are defined.
    const flags = regex.flags || '';
    if (flags.indexOf('g') === -1) {
      regex = new RegExp(regex.source, `${flags}g`);
    }
    const output: Match[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      output.push({
        index: match.index,
        match: match[0],
      });
    }
    return output;
  }

  static escape(text: string): string {
    return text.replace(this.SYNTAX_CHARS, '\\$&');
  }
}
