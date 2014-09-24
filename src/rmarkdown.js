//TODO:
//Handle default values

var rmarkdown = (function() {
  /**
   * Main function to hold the state of editor
   * @param  {[type]} div [description]
   * @return {[type]}     [description]
   */
  function rmarkdown(options) {
    //element for which we have to create markdown editor
    this._div = options.el;
    //create internal structure
    //source div is where actual markdown resides
    this._sourceDiv = document.createElement('div');
    this._sourceDiv.setAttribute('contenteditable', true);
    this._sourceDiv.textContent = options.default || ' ';
    //html div is where generate markup resides
    this._htmlDiv = document.createElement('div');
    //add those things to main div
    this._div.appendChild(this._htmlDiv);
    this._div.appendChild(this._sourceDiv);
    this._lines = [];

    //get the add line function
    this.addLine = this.lineIterator();

    if (options.value) {
      var self = this;
      options.value.split('\n').map(function(line) {
        var ro = self.addLine(line);
        //create a span to hold line no and avoid any distortions on page
        var d = document.createElement('span');
        d.setAttribute('data-line-no', ro.lineNo);
        d.innerHTML = ro.html;
        self.setEditListener(d);
        self._htmlDiv.appendChild(d);
      });

    }

    //let the party begin!
    this.attachEvents();
    this.placeCaretAtEnd(this._sourceDiv);
  }

  /**
   * Attach events of keydown - to convert text to html and mousedown - to update any un entered changed
   * @return {[type]} [description]
   */
  rmarkdown.prototype.attachEvents = function() {
    var self = this;

    self._sourceDiv.addEventListener('keydown', sourceDivKeyDown);
    self._sourceDiv.addEventListener('mousedown', function(evt) {
      evt.stopPropagation();
    });
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
      var ro = self.addLine(self._sourceDiv.textContent);

      //create a span to hold line no and avoid any distortions on page
      var d = document.createElement('span');
      d.setAttribute('data-line-no', ro.lineNo);
      d.innerHTML = ro.html;
      self.setEditListener(d);
      self._htmlDiv.appendChild(d);
      //empty out the source div for further additions
      self._sourceDiv.textContent = '';
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
      var ele = document.getElementsByClassName('my-god-editing');
      if (!ele) {
        return;
      }

      ele.map(function(d) {
        var ele = d.parentNode;
        var lineNo = ele.getAttribute('data-line-no');
        self._lines[lineNo] = d.textContent;
        var m = marked(d.textContent);
        ele.firstChild = null;
        ele.innerHTML = m;
      });
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
      ele.innerHTML = '<div contenteditable="true" class="my-god-editing">' + self._lines[lineNo] + '</div>';
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

  /**
   * returns a function to add line
   * @return {[type]} [description]
   */
  rmarkdown.prototype.lineIterator = function() {
    var lineNo = 0;
    var self = this;

    return function addLine(value) {
      var m = marked(value);
      self._lines[lineNo] = value;
      lineNo++;
      return {
        html: m,
        lineNo: lineNo - 1
      };
    };
  };

  //don't forget the return!
  return rmarkdown;
})();