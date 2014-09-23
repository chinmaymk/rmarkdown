rmarkdown
=========

A real time markdown editor which seamlessly merges your markdown into html. It is written in pure javascript without jquery, and it is really tiny - 942 bytes, compressed and minified.

##Installation
Grab the zip from github, copy `dist/rmarkdown.min.js` to your js folder and refer it from you page. Only dependency is [marked](https://github.com/chjj/marked), and if you like syntax highlighting refer [highlight.js](https://highlightjs.org/)

```html
<script src="http://cdnjs.cloudflare.com/ajax/libs/marked/0.3.2/marked.min.js"></script>
<script src="path/to/js/rmarkdown.min.js" type="text/javascript"></script>
``` 

##Usage

```html
<div id="rmarkdown"></div>
<script type="text/javascript">
  //needs a dom element, not jquery selector
  var editor = new rmarkdown(document.getElementById('rmarkdown'));  
</script>
```
That's about it.

If you would like to remove the annoying border of contenteditable divs, use this css

```css
[contenteditable]:focus {
  outline: none;
}
```

**api**

```js
var markdown = editor.markdown(); //returns markdown typed so far
var html = editor.html(); //returns markdown converted to html
```

##Todo
1. Allow setting initial value through api
2. Check on other browsers than chrome
3. Write some tests
4. Make it work on server

##Got suggestions ?
Feel free to submit a pull request, file an issue, or get in touch on twitter [@_chinmaymk](https://twitter.com/_chinmaymk)