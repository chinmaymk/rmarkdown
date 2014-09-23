rmarkdown
=========

A real time markdown editor which seamlessly merges your markdown into html.

##Installation
Grab the zip from github, copy `dist/rmarkdown.min.js` to your js folder and refer it from you page

```html
<script src="path/to/js/rmarkdown.min.js" type="text/javascript"></script>
``` 

##Usage

**html**
This is about it.

```html
<div id="rmarkdown"></div>
```

**javascript**

```js
//needs a dom element, not jquery selector
var editor = new rmarkdown(document.getElementById('rmarkdown'));
```