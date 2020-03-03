# Markify

[![Get from G Suite Marketplace][gsuite-image]][gsuite-url]
[![Circle CI][circle-image]][circle-url]
[![TypeScript Style Guide][gts-image]][gts-url]

An easier way to write Google Docs by using Markdown. This is specially useful when writing technical documents for software engineering.

# Installation

Go to the [GSuite Marketplace listing][gsuite-url] and follow the instructions.

# Features

Headings (only with `#`), rulers, bold, italics, strike-trough, quotes, inline code and code highlighting.

We support all the major languages via [Highlight.js][highlightjs-url]. See the full list [here][language-list].

# Example

You can copy paste the block below to test out the features.

````markdown
# H1

## H2

### H3

#### H4

##### H5

###### H6

---

Support for **bold**, _italics_, ~~strikethrough~~. And also any combinations of those **bold _italic_**, _italic **\*bold**_, _italic **bold** ~~strikethrough~~_.

> Blockquotes are also supported, but sometimes when you copy paste the text will stop working.
>
> > Multiple levels are also supported

This is back to normal.

We also support `inline code`.

And of course highlighted code, you can omit the language or specify it.

```
for x in range(10):
  print('This is number {}'.format(x))
```

```python
for x in range(10):
  print('This is number {}'.format(x))
```

Once the code is highlighted you can make changes and the code will be re-highlighted.

```python
for x in range(10):
  print('This is number {}'.format(x))

@requires_authorization
def somefunc(param1='', param2=0):
    r'''A docstring'''
    if param1 > param2: # interesting https://github.com
        print 'Greater'
    return (param2 - param1 + 1 + 0b10l + "x") or None

class SomeClass:
    pass
```
````

# Notes

ES6 modules cannot be used yet with Google Apps Scripts, not even with the new V8 runtime, so the code looks a little funky.

[language-list]: https://github.com/sk-/markify/blob/master/src/highlight.ts#L7-L48
[circle-image]: https://circleci.com/gh/sk-/markify.svg?style=shield
[circle-url]: https://circleci.com/gh/sk-/markify
[gts-image]: https://img.shields.io/badge/code%20style-google-blueviolet.svg
[gts-url]: https://github.com/google/gts
[gsuite-image]: https://img.shields.io/badge/markify-G%20Suite-red
[gsuite-url]: https://google.com
[highlightjs-url]: https://highlightjs.org/
