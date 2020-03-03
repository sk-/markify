/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */
import highlight from './highlight';
import markdown from './markdown';
import regexp from './regexp';
import styles from './styles';

class RangeElement {
  public data: GoogleAppsScript.Document.RangeElement[];
  constructor(data: GoogleAppsScript.Document.RangeElement[]) {
    this.data = data;
  }

  public getType(): string {
    return 'RANGE_ELEMENT';
  }

  public getNumChildren(): number {
    return this.data.length;
  }

  public getChild(childIndex: number): GoogleAppsScript.Document.Element {
    return this.data[childIndex].getElement();
  }
}

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e: any) {
  DocumentApp.getUi()
    .createAddonMenu()
    .addItem('Convert whole document', 'convertDocument')
    .addItem('Convert selection', 'convertSelection')
    .addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function onInstall(e: any) {
  onOpen(e);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function convertSelection() {
  const selection = DocumentApp.getActiveDocument().getSelection();
  convert(new RangeElement(selection.getRangeElements()));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function convertDocument() {
  const body = DocumentApp.getActiveDocument().getBody();
  convert(body);
}

const HEADING_SIZE: {
  [key: number]: GoogleAppsScript.Document.ParagraphHeading;
} = {
  1: DocumentApp.ParagraphHeading.HEADING1,
  2: DocumentApp.ParagraphHeading.HEADING2,
  3: DocumentApp.ParagraphHeading.HEADING3,
  4: DocumentApp.ParagraphHeading.HEADING4,
  5: DocumentApp.ParagraphHeading.HEADING5,
  6: DocumentApp.ParagraphHeading.HEADING6,
};

function getTableLanguage(
  table: GoogleAppsScript.Document.Table
): string | null {
  const attributes: {[attribute: number]: any} = table.getAttributes();
  if (attributes[DocumentApp.Attribute.BORDER_WIDTH] === 0) {
    return highlight.decodeLanguage(
      attributes[DocumentApp.Attribute.BORDER_COLOR]
    );
  }
  return null;
}

function convert(element: GoogleAppsScript.Document.Body | RangeElement) {
  for (let i = 0; i < element.getNumChildren(); ++i) {
    const child = element.getChild(i);
    if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
      const paragraph = child.asParagraph();
      const text = paragraph.getText();
      let headingMarkup;
      let indentMarkup;
      let lang;
      if (markdown.isRuler(text)) {
        paragraph.clear();
        paragraph.insertHorizontalRule(0);
      } else if ((indentMarkup = markdown.getIndentMarkup(text))) {
        const indentSize = markdown.getIndentSize(indentMarkup);
        child.setAttributes(styles.getIndentStyle(indentSize));
        paragraph.replaceText('^' + regexp.escape(indentMarkup), '');
      } else if ((headingMarkup = markdown.getHeadingMarkup(text))) {
        const headingSize = markdown.getHeadingSize(headingMarkup);
        const headingStyle = HEADING_SIZE[headingSize];
        if (!headingStyle) {
          continue;
        }
        paragraph.setHeading(headingStyle);
        paragraph.replaceText('^' + regexp.escape(headingMarkup), '');
      } else if ((lang = markdown.getLanguage(text))) {
        const codeParts = [];
        let closed = false;
        let j;
        for (j = i + 1; j < element.getNumChildren(); ++j) {
          const c = element.getChild(j);
          const t = (c as any).getText();
          if (t === '```') {
            closed = true;
            break;
          }
          codeParts.push(t);
        }
        if (closed) {
          const code = codeParts.join('\n');
          const realIndex = child.getParent().getChildIndex(child);
          const table = child
            .getParent()
            .asBody()
            .insertTable(realIndex + j - i + 1, [[code]]);
          table.setBorderWidth(0);
          // This is so that we could identify tables as being code and we could rerender.
          table.setBorderColor(highlight.encodeLanguage(lang));

          for (let idx = 0; idx < j - i + 1; ++idx) {
            table
              .getParent()
              .getChild(realIndex)
              .removeFromParent();
          }
          if (element instanceof RangeElement) {
            element.data.splice(i + 1, j - i);
          }

          applyHighlighting(table.getCell(0, 0), code, lang);
          continue;
        }
      }
    } else if (child.getType() === DocumentApp.ElementType.TABLE) {
      const table = child.asTable();
      const lang = getTableLanguage(table);
      if (lang) {
        const code = table.getText();
        const cell = table.getCell(0, 0);
        // We clear the content so to remove the wrong styles.
        cell.clear();
        cell.setText(code);
        applyHighlighting(cell, code, lang);
        continue;
      }
    }

    convertText(child);
  }
}

function convertText(element: GoogleAppsScript.Document.Element) {
  if (element.getType() === DocumentApp.ElementType.TEXT) {
    const textElement = element.asText();
    replaceStyle(textElement, markdown.BOLD_REGEX, styles.BOLD, 2);
    replaceStyle(textElement, markdown.ITALIC_REGEX, styles.ITALIC, 1);
    replaceStyle(
      textElement,
      markdown.STRIKETHROUGH_REGEX,
      styles.STRIKETHORUGH,
      2
    );
    replaceStyle(
      textElement,
      markdown.INLINE_CODE_REGEX,
      styles.INLINE_CODE,
      1
    );
  } else if (
    (element as any).getNumChildren &&
    element.getType() !== DocumentApp.ElementType.EQUATION &&
    element.getType() !== DocumentApp.ElementType.EQUATION_FUNCTION
  ) {
    for (let i = 0; i < (element as any).getNumChildren(); ++i) {
      convertText((element as any).getChild(i));
    }
  }
}

function replaceStyle(
  element: GoogleAppsScript.Document.Text,
  regex: RegExp,
  style: object,
  size: number
) {
  const matches = regexp.findAll(regex, element.getText());
  for (const match of matches) {
    element.setAttributes(
      match.index,
      match.index + match.match.length - 1,
      style
    );
  }
  let delta = 0;
  for (const match of matches) {
    element.deleteText(match.index - delta, match.index + size - 1 - delta);
    delta += size;
    element.deleteText(
      match.index + match.match.length - size - delta,
      match.index + match.match.length - 1 - delta
    );
    delta += size;
  }
}

function applyHighlighting(
  cell: GoogleAppsScript.Document.TableCell,
  code: string,
  language: string
) {
  cell.setAttributes(styles.CODE);

  let line = 0;
  let pos = 0;
  const nodeStyles: object[] = [];
  function applyStyles(parent: GoogleAppsScript.XML_Service.Element) {
    const children = parent.getAllContent();
    for (const child of children) {
      const type = child.getType();
      if (type === XmlService.ContentTypes.ELEMENT) {
        const element = child.asElement();
        nodeStyles.push(
          styles.GITHUB[element.getAttribute('class').getValue()] || {}
        );
        applyStyles(element);
        nodeStyles.pop();
      } else if (type === XmlService.ContentTypes.TEXT) {
        const parts = child
          .asText()
          .getText()
          .split('\n');
        const oldPos = pos;
        const oldLine = line;
        if (parts.length > 1) {
          pos = 0;
          line += parts.length - 1;
        }
        pos += parts[parts.length - 1].length;

        if (oldLine === line) {
          for (const style of nodeStyles) {
            cell
              .getChild(line)
              .asParagraph()
              .editAsText()
              .setAttributes(oldPos, pos - 1, style);
          }
        } else {
          const paragraph = cell.getChild(oldLine).asParagraph();
          for (const style of nodeStyles) {
            paragraph
              .editAsText()
              .setAttributes(oldPos, paragraph.getText().length - 1, style);
            for (let j = oldLine + 1; j < line; ++j) {
              cell.getChild(j).setAttributes(style);
            }
            if (pos > 0) {
              cell
                .getChild(line)
                .asParagraph()
                .editAsText()
                .setAttributes(0, pos - 1, style);
            }
          }
        }
      }
    }
  }

  const markup = highlight.highlightCode(code, language);
  const document = XmlService.parse(`<root>${markup}</root>`);
  applyStyles(document.getRootElement());
}
