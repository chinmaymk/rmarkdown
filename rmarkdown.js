//TODO:
//Handle default values
//Save un entered changes on loose focus

var rmarkdown = (function() {
  /**
   * Main function to hold the state of editor
   * @param  {[type]} div [description]
   * @return {[type]}     [description]
   */
  function rmarkdown(div) {
    //element for which we have to create markdown editor
    this._div = div;
    //create internal structure
    //source div is where actual markdown resides
    this._sourceDiv = document.createElement('div');
    this._sourceDiv.setAttribute('contenteditable', true);
    this._sourceDiv.textContent = 'Type something for me';
    //html div is where generate markup resides
    this._htmlDiv = document.createElement('div');
    //add those things to main div
    this._div.appendChild(this._htmlDiv);
    this._div.appendChild(this._sourceDiv);
    this._lines = [];
    //let the party begin!
    this.attachEvents();
  }

  /**
   * Attach events of keydown - to convert text to html and mousedown - to update any un entered changed
   * @return {[type]} [description]
   */
  rmarkdown.prototype.attachEvents = function() {
    var self = this;
    var lineNo = 0;

    self._sourceDiv.addEventListener('keydown', sourceDivKeyDown);
    self._div.addEventListener('mousedown', divMouseDown);

    /**
     * takes out the text from source, creates markdown, shoves into html div
     * @param  {[type]} evt [description]
     * @return {[type]}     [description]
     */
    function sourceDivKeyDown(evt) {
      if (!self.isMyEvent(evt)) {
        return;
      }

      var m = marked(self._sourceDiv.textContent);
      self._lines[lineNo] = self._sourceDiv.textContent;

      var d = document.createElement('span');
      d.setAttribute('data-line-no', lineNo);
      d.innerHTML = m;
      self.setEditListener(d);
      self._htmlDiv.appendChild(d);
      self._sourceDiv.textContent = '';
      lineNo++;
    }

    /**
     * Just a helper function to ensure caret is at right position
     * @return {[type]} [description]
     */
    function divMouseDown() {
      setTimeout(function() {
        self.placeCaretAtEnd(self._sourceDiv);
      }, 200);
    }

    /**
     * Clear out any un entered changes
     * @return {[type]} [description]
     */
    document.addEventListener('mousedown', function() {

    });
  };

  rmarkdown.prototype.setEditListener = function(ele) {
    var self = this;
    var lineNo = ele.getAttribute('data-line-no');

    /**
     * When clicked on a markdown element, fetch its markdown representation and put it inside editable div
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    function mouseDownEle(e) {
      e.stopPropagation();
      ele.innerHTML = '<div contenteditable="true" id="my-god-editing">' + self._lines[lineNo] + '</div>';
      //Browser takes some time to render this HTML
      setTimeout(function() {
        self.placeCaretAtEnd(ele.firstChild);
      }, 200);

      ele.firstChild.addEventListener('mousedown', function(evt) {
        evt.stopPropagation();
      }, true);
    }

    /**
     * The usual, convert markdown to html
     * @param  {[type]} evt [description]
     * @return {[type]}     [description]
     */
    function keyUpEle(evt) {
      if (!self.isMyEvent(evt)) {
        return;
      }
      replaceHtml.call(this);
      self.placeCaretAtEnd(self._sourceDiv);
    }

    /**
     * helper function to keep code DRY
     * @return {[type]} [description]
     */
    function replaceHtml() {
      var m = marked(this.textContent);
      self._lines[lineNo] = this.textContent;
      //remove attached events
      ele.firstChild = null;
      ele.innerHTML = m;
    }

    ele.addEventListener('mousedown', mouseDownEle);
    ele.addEventListener('keyup', keyUpEle);
  };

  /**
   * as the name suggests
   * courtesy: http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
   * @param  {[type]} el [description]
   * @return {[type]}    [description]
   */
  rmarkdown.prototype.placeCaretAtEnd = function(el) {
    el.focus();
    if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  };

  /**
   * Api to return markdown entered so far
   * @param  {[type]} first_argument [description]
   * @return {[type]}                [description]
   */
  rmarkdown.prototype.markdown = function(first_argument) {
    return this._lines.join('\n');
  };

  /**
   * Api to return the html itself
   * @param  {[type]} first_argument [description]
   * @return {[type]}                [description]
   */
  rmarkdown.prototype.html = function(first_argument) {
    return this._htmlDiv.outerHTML;
  };

  /**
   * Helper function to decide should we convert markdown to html or not
   * @param  {[type]}  evt [description]
   * @return {Boolean}     [description]
   */
  rmarkdown.prototype.isMyEvent = function(evt) {
    return evt.keyCode === 13 && !evt.shiftKey;
  };

  //don't forget the return!
  return rmarkdown;
})();