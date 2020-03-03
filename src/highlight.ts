import * as hljs from './vendor/highlight';

// eslint-disable-next-line @typescript-eslint/class-name-casing
export default class highlight {
  // You can only append to this list, or otherwise an already highlighted
  // block may be re-rendered with the wrong language.
  static LANGUAGES = [
    'bash',
    'coffeescript',
    'cpp',
    'css',
    'diff',
    'dockerfile',
    'go',
    'http',
    'ini',
    'java',
    'javascript',
    'json',
    'markdown',
    'nginx',
    'objectivec',
    'php',
    'profile',
    'protobuf',
    'python',
    'r',
    'shell',
    'sql',
    'tex',
    'typescript',
    'xml',
    'apache',
    'cs',
    'haskell',
    'kotlin',
    'less',
    'lua',
    'makefile',
    'perl',
    'plaintext',
    'properties',
    'ruby',
    'rust',
    'scss',
    'swift',
    'yaml',
  ];

  private static LANGUAGE_MAP: {[id: string]: string} = {};

  private static initializeLanguageMap() {
    for (const lang of hljs.listLanguages()) {
      this.LANGUAGE_MAP[lang] = lang;
      const langDefinition = hljs.getLanguage(lang) || {};
      const aliases = langDefinition.aliases || [];
      for (const alias of aliases) {
        this.LANGUAGE_MAP[alias] = lang;
      }
    }
  }

  private static isEmpty(obj: object) {
    return Object.keys(obj).length === 0;
  }

  static encodeLanguage(lang: string): string {
    if (this.isEmpty(this.LANGUAGE_MAP)) {
      this.initializeLanguageMap();
    }
    lang = this.LANGUAGE_MAP[lang];
    let i;
    for (i = 0; i < this.LANGUAGES.length; ++i) {
      if (this.LANGUAGES[i] === lang) {
        break;
      }
    }
    if (i === this.LANGUAGES.length) {
      i = 255;
    }
    const encodedLang = i.toString(16);
    return `#c0de${encodedLang}`;
  }

  static decodeLanguage(encodedLang: string): string | null {
    if (!encodedLang.startsWith('#c0de')) {
      return null;
    }
    const langId = Number.parseInt(encodedLang.substr(5), 16);
    if (langId >= this.LANGUAGES.length) {
      return 'auto';
    }
    return this.LANGUAGES[langId];
  }

  static highlightCode(source: string, lang: string): string {
    hljs.configure({classPrefix: ''});
    if (lang && lang !== 'auto') {
      // When trying to highlight the language, hljs will print to the console
      // in case of errors, but given that we are catching the exception,
      // there's no need of reporting that.
      // This changed between versions of hljs.
      // Note: that we do it in this way, as detecting the language is
      // expensive.
      const oldConsoleError = console.error;
      try {
        console.error = () => {
          // Do nothing
        };
        return hljs.highlight(lang, source).value;
      } catch (e) {
        // Do nothing as we will highlight it using the 'auto' option.
      } finally {
        console.error = oldConsoleError;
      }
    }
    return hljs.highlightAuto(source).value;
  }
}
