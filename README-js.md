# d1

Javascript enhancements for [d1 CSS](https://github.com/vvvkor/d1).  
[Demo & docs](http://vadimkor.ru/projects/d1#js)

## Install

```
npm install d1
```

## Usage

On page load call:
```
d1.init(options);
```

## Features

* Dropdown ``.toggle``: toggle, escape
* Tree ``.toggle``: multiple, unscroll, toggle, remember (``.mem``), ``.accordion``
* Toggle ``.toggle``: multiple, unscroll, toggle, remember (``.mem``)
* Popup ``.toggle``: multiple, unscroll, toggle, escape
* Tabs ``.toggle``: multiple, unscroll, remember (``.mem``)
* Dialog: escape
* Gallery: previous, escape
* Link or button with confirmation: ``.dialog[title]``
* Link with prompt: ``.dialog[title][data-prompt]``
* Check group of boxes: ``input[data-group]``, ``[class~="data-group"]``
* Set value of target input: ``a[href^='#'][data-value]``
* Show value of color input: ``input[type="color"]``
* Align table columns: ``table.r5``
* Asynchronous request: ``[data-target]``


## Options

### attrStr

Attribute from which translation strings are read.  
Alternative captions of icons are prefixed with underscore.  
Default: ``"data-str"``

### cAct

CSS class of active links.  
Default: ``"act"``

### cAlert

CSS class of links with alert.  
Default: ``"alert"``

### cClose

CSS class of close links.  
Default: ``"close"``

### cDialog

CSS class of links with dialog.  
Default: ``"dialog"``

### cGallery

CSS class of image gallery.  
Default: ``"gal"``

### cHide

CSS class of hidden elements with CSS-controlled visibility.  
Default: ``"hide"``

### cIcon

CSS class of SVG icons.  
Default: ``"icon"``

### cJsControl

CSS class of elements with Javascript-controlled visibility.  
Default: ``"js-control"``

### cJsHide

CSS class of hidden elements with Javascript-controlled visibility.  
Default: ``"js-hide"``

### hashCancel

Hash of "close" and "cancel" links.  
Default: ``"#cancel"``


## Browser Support

* IE 10+
* Latest Stable: Chrome, Firefox, Opera, Safari

## License

[MIT](./LICENSE)