# d1

**d1** is lightweight yet functional responsive CSS microframework with optional JavaScript enhancements.  
It aims to implement most widely used interface components with less code.

## Features

* lightweight (minified and gzipped: CSS <4 KB, optional JS <4 KB)
* non-bloated class names
* functional
* modern
* responsive (flexbox, mobile first)
* performant
* semantic (uses native elements)
* valid
* cross-browser
* JavaScript not required
* [enhanced with JavaScript](README-js.md)
* neutral style
* configurable (css vars)
* no floats
* no hacks
* accessibility is not much covered

## Add-ons

* [d1calendar](https://github.com/vvvkor/d1calendar) replaces standard HTML ``date`` and ``datetime-local`` inputs with custom dropdown calendar
* [d1dialog](https://github.com/vvvkor/d1dialog) replaces standard Javascript dialogs: ``alert``, ``confirm``, ``prompt``
* [d1edit](https://github.com/vvvkor/d1edit) turns textarea into lightweight WYSIWYG editor
* [d1gallery](https://github.com/vvvkor/d1gallery) makes lighweight image gallery
* [d1lookup](https://github.com/vvvkor/d1lookup) autocompletes lookups with data from XHTTP request
* [d1tablex](https://github.com/vvvkor/d1tablex) makes HTML table searchable and sortable

## Getting Started

### Use from CDN

#### [jsDelivr](https://www.jsdelivr.com/package/npm/d1css)

```html
<link href="https://cdn.jsdelivr.net/npm/d1css@1/dist/d1.compat.min.css" rel="stylesheet">
<!-- optional -->
<script src="https://cdn.jsdelivr.net/npm/d1css@1/dist/d1.min.js"></script>
<script>
  d1.load();
</script>
```

#### [GitCDN](https://gitcdn.link/)

```html
<link href="https://gitcdn.link/repo/vvvkor/d1/master/dist/d1.compat.min.css" rel="stylesheet">
<!-- optional -->
<script src="https://gitcdn.link/repo/vvvkor/d1/master/dist/d1.min.js"></script>
<script>
  d1.load();
</script>
```

### Install with NPM

Install to your repository:
```
npm install d1css
```
Then use in your CSS file:
```css
@import "../node_modules/d1css/dist/d1.compat.min.css";
```
And optionally bundle into your JavaScript file:
```javascript
var d1 = require("d1css");
d1.load();
```

### Install manually

Download minified [d1 files](https://github.com/vvvkor/d1/tree/master/dist).

```html
<link href="d1.compat.min.css" rel="stylesheet">
<!-- optional -->
<script src="d1.min.js"></script>
<script>
  d1.load();
</script>
```

## Browser Support

* IE 9 (mobile style only, no js enhancements)
* IE 10+, Edge (except details/summary component)
* Latest Stable: Chrome, Firefox, Opera, Safari
* iOS 6-8
* Android 4.x

## Docs

[Docs and demo](http://vadimkor.ru/projects/d1/)

## Thanks

* [List of CSS frameworks](https://github.com/troxler/awesome-css-frameworks)
* [Small CSS Frameworks](https://www.webpagefx.com/blog/web-design/small-css-frameworks/)

## License

[MIT](./LICENSE)
