# d1

**d1** is lightweight yet functional responsive CSS microframework with optional JavaScript enhancements.  
It aims to implement most widely used interface components with less code.

## Features

* lightweight (minified and gzipped: CSS ~2.5 KB, optional JS ~2.2 KB)
* non-bloated class names
* functional
* modern
* responsive (flexbox, mobile first)
* performant
* semantic (uses native elements)
* valid
* cross-browser
* JavaScript not required
* enhanced with JavaScript
* neutral style
* configurable (css vars)
* no floats
* no hacks
* accessibility is not much covered

## Getting Started

### Use from CDN

#### [jsDelivr](https://www.jsdelivr.com/package/npm/d1css)

```html
<link href="https://cdn.jsdelivr.net/npm/d1css@1/dist/d1.min.css" rel="stylesheet">
<!-- optional -->
<script src="https://cdn.jsdelivr.net/npm/d1css@1/dist/d1.min.js"></script>
<script>
  d1.run();
</script>
```

#### [GitCDN](https://gitcdn.link/)

```html
<link href="https://gitcdn.link/repo/vvvkor/d1/master/dist/d1.min.css" rel="stylesheet">
<!-- optional -->
<script src="https://gitcdn.link/repo/vvvkor/d1/master/dist/d1.min.js"></script>
<script>
  d1.run();
</script>
```

### Install with NPM

Install to your repository:
```
npm install d1css --save
```
Then use in your CSS file:
```css
@import "../node_modules/d1css/dist/d1.min.css";
```
and optionally bundle into your JavaScript file:
```javascript
var d1 = require("d1css");
d1.run();
```

### Install manually

Download minified [d1 files](https://github.com/vvvkor/d1/tree/master/dist).

```html
<link href="d1.min.css" rel="stylesheet">
<!-- optional -->
<script src="d1.min.js"></script>
<script>
  d1.run();
</script>
```

## Browser Support

* IE 9 (mobile style only, no js enhancements)
* IE 10+, Edge (except details/summary component)
* Latest Stable: Chrome, Firefox, Opera, Safari
* iOS 6-8
* Android 4.x

## Docs

[Docs and demo](http://vadimkor.ru/d1/)

## Thanks

* [List of CSS frameworks](https://github.com/troxler/awesome-css-frameworks)
* [Small CSS Frameworks](https://www.webpagefx.com/blog/web-design/small-css-frameworks/)

## License

[MIT](./LICENSE)
