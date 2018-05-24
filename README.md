# d1

Functional CSS micro framework with optional JS enhancements.  
Its aim is to implement most widely used components with less code.

## Features

* lightweight (minified, gzipped: CSS ~3 KB, optional JS ~2 KB)
* not bloated with class names
* functional
* modern
* responsive (flexbox, mobile first)
* performant
* semantic (use native elements)
* valid
* cross-browser
* javascript not required
* enhanced with javascript
* neutral style, configurable
* accessibility is not much covered

## Getting Started

### CDN

#### [jsdelivr](https://www.jsdelivr.com/package/npm/d1css)

```html
<link href="https://cdn.jsdelivr.net/npm/d1css@1/dist/d1.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/d1css@1/dist/d1.min.js"></script><!-- optional -->
```

#### [GitCDN](https://gitcdn.link/)

```html
<link href="https://gitcdn.link/repo/vvvkor/d1/master/dist/d1.min.css" rel="stylesheet">
<script src="https://gitcdn.link/repo/vvvkor/d1/master/dist/d1.min.js"></script><!-- optional -->
```

### NPM

Install to your repository:
```
npm install d1css --save
```
Then use in your CSS file:
```css
@import "../node_modules/d1css/dist/d1.min.css";
```
and optionally in your JS file:
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
* IE 10+
* Latest Stable: Chrome, Firefox, Opera, Safari, Edge
* iOS 6-8
* Android 4.x

## Docs

[Docs and demo](http://vadimkor.ru/d1/)

### Layout

### Elements

### Components

## Thanks

[List of CSS frameworks](https://github.com/troxler/awesome-css-frameworks)

## Plans

* more confiuaration options, compile from SASS
* version without class names

## License

[MIT](./LICENSE)
