/*! d1css v1.2.43 https://github.com/vvvkor/d1 */
/* Enhancements for d1css microframework */

(function(window, document, Element) {
  
  "use strict";

  
  //check single instance
  if (window && window.d1) {
    console.log("d1 already included");
  }
  else {

// begin module

var main = new(function() {

  "use strict";

  this.name = 'd1';
  
  this.opt = {
    cAct: 'act',
    cAlert: 'alert',
    cClose: 'close',
    cDialog: 'dialog',
    cGallery: 'gal',
    cHide: 'hide',
    cIcon: 'icon',
    cTabs: 'tabs',
    hashCancel: '#cancel',
    //internal
    cToggle: 'toggle',
    cJsControl: 'js-control',
    cJsHide: 'js-hide',
    cHashed: 'js-hashed',
    attrStr: 'data-str',
    qsEsc: ".pop>div.toggle, .nav.toggle ul",//, .dlg, .full
    qsMem: ".mem, ul.tabs.mem+div>div, ul.mem ul[id]",
    qsRehash: "",
    //secondary
    qsJsShow: '.js-control:not(.js-hide)'
  };
  
  this.str = {
    cancel: 'Cancel',
    ok: 'OK',
    //input validation localization
    /*
    valueMissing: '- Please fill out this field.',
    typeMismatch: '- Please enter a valid %type%.',
    tooLong: '- Please shorten this text to %maxlength% characters or less.',
    tooShort: '- Please lengthen this text to %minlength% characters or more.',
    patternMismatch: '- Please match the requested format.',
    rangeUnderflow: '- Value must be greater then or equal to %min%.',
    rangeOverflow: '- Value must be less then or equal to %max%.',
    stepMismatch: '- Please enter a valid value. Value step is %step%.',
    badInput: '- Please enter a valid %type%!',
    //customError: '',
    */
    //icons
    _close: '&#10005;',//'&#10005;',//'&times;',
    _delete: '&#10005;',
    _edit: '&rarr;',
    _now: '&#10003;',//'&bull;',
    _date: '&#9744;',//'&#9744;', '&#10063;', '&#8862;', '&darr;',
    _prev: '&lsaquo;',
    _next: '&rsaquo;',
    _prev2: '&laquo;',
    _next2: '&raquo;'
  };
  
  this.ico = {};
  
  this.noMem = 0;
  
  this.plugins = [];
  
  //common

  this.load = function(obj, opt, str, ico, plug) {
    if (!obj) obj = this;
    this.b("", [document], "DOMContentLoaded", typeof obj === "function" ? obj : obj.init.bind(obj, opt, str, ico, plug));
  }
  
  this.loadAll = function(plug){
    if(!plug) plug = {};
    this.load(this, plug.opt, plug.str, plug.ico, plug);
  }
  
  this.init = function(opt, str, ico, plug) {
    var i;
    for (i in opt) this.opt[i] = opt[i];
    for (i in str) this.str[i] = str[i];
    for (i in ico) this.ico[i] = ico[i];
    this.opt.qsJsShow = '.' + this.opt.cJsControl + ':not(.' + this.opt.cJsHide + ')';
    
    if (location.hash == "#disable-js") return;
    if (window && !Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector; //ie9+
    this.getStrings();
    this.refresh();
    if(plug) this.initPlugins(plug);
  }
  
  this.plug = function(p) {
    this.plugins.push(p);
  }
  
  this.initPlugins = function(opts){
    for (var i in this.plugins) this.plugins[i].init(opts ? opts[this.plugins[i].name] : {});
  }
  
  this.q = function(s, i, n) {
    if (!s || s.match(/\.\d|[?&]/)) return i === undefined ? [] : null;
    var f = (i === 0) ? "querySelector" : "querySelectorAll";
    var a = (n || document)[f](s);
    if (i) a = a[i < 0 ? a.length + i : i];
    return a;
  }

  this.b = function(n, sel, type, fn) {
    var a = (typeof sel === "string") ? (n || document).querySelectorAll(sel) : sel;
    if (a.length) [].forEach.call(a, this.handle.bind(this, type, fn));
  }

  this.handle = function(type, fn, n) {
    type
      ? n.addEventListener(type, fn.bind(this, n), false)
      : fn.call(this, n);
  }

  this.ancestor = function(q, n) {
    //return n.parentNode.closest(q); //-ie
    do{
      if (n.matches && n.matches(q)) return n;
    } while (n = n.parentNode);
  }

  //basic

  this.showDialog = function(t, ask, enter, def) {
    t = t.replace(/<.*?>/g, '');
    if (!ask) return alert(t);
    else if (!enter) {
      if (confirm(t)) ask();
    }
    else{
      var v = prompt(t, def);
      if (v!==null) ask(v);
    }
  }
  
  this.openDialog = function(n, e) {
    return this.dialog(n, e);
  }
  
  this.dialog = function(n, e) {
    if (n.form && !n.form.checkValidity()) return;
    
    var p = n.getAttribute("data-prompt") || '';
    var t = n.getAttribute("data-caption") || n.title || p || '!'
    var h = false;
    var a = ((n.getAttribute("href") || "").substr(0, 1) == "#") ? {} : {_confirm: 1};
    if (n.classList.contains(this.opt.cAlert)) {
      alert(t);
      h = n.href || false;
    }
    else if (p) {
      var x = prompt(t, this.get(n.href, p) || "");
      if (x != null) {
        a[p] = x;
        h = this.arg(n.href, a);
      }
    }
    else {
      if (confirm(t)) h = n.form ? true : this.arg(n.href, a);//optional
    }
    if (h!==true) {
      e.preventDefault();
      e.stopPropagation();
      if (h) location.href = h;
    }
  }

  this.checkBoxes = function(b) {
    this.b(b.form, "input[type='checkbox'][class~='" + b.getAttribute('data-group') + "']", "", function(n, e) {
      n.checked = b.checked;
    })
  }
  
  this.alignCells = function(n) {
    var m = n.className.match(/\b[lcr]\d\d?\b/g);
    if (m) {
      for (var i = 0; i < m.length; i++) {
        this.b(n, "tr>*:nth-child(" + m[i].substr(1) + ")", "", function(c, e) {
          c.classList.add(m[i].substr(0, 1));
        });
      }
    }
  }

  this.gotoPrev = function(n, e) {
    if (!e || (e.clientX + e.clientY > 0 && e.clientX < n.clientWidth / 3)) {
      var p = n.previousElementSibling || this.q("a[id]", -1, n.parentNode);
      if (p.id) {
        location.hash = "#" + p.id;
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    }
  }

  //toggle
  
  this.setToggle = function(n) {
    n.classList.add(this.opt.cToggle);
  }
  
  this.setState = function(n, on) {
    n.classList.add(this.opt.cJsControl);
    n.classList[on ? "remove" : "add"](this.opt.cJsHide);
  }
  
  this.getState = function(n) {
    return !n.classList.contains(n.classList.contains(this.opt.cJsControl) ? this.opt.cJsHide : this.opt.cHide);
  }
  
  this.toggle = function(n) {
    d1.setState(n, !d1.getState(n));
  }
  
  this.targetState = function(n, e, on) {
    if (e && on === undefined) {
      if (n.matches("ul." + this.opt.cTabs + "+div>div")) on = true; //tabs: on
      else on = !this.getState(n); //toggle
    }
    return on;
  }

  this.toggleClass = function(n, e) {
    var box = (n.type == 'checkbox');
    if (e && !box) e.preventDefault();
    var q = n.getAttribute("data-nodes") || n.hash;
    var c = n.getAttribute("data-class");
    var on = box ? n.checked : n.classList.contains(this.opt.cAct);
    if(e && !box) on = !on;
    if (c) this.b("", q, "", this.setClass.bind(this, n, c, on, e));
  }
  
  this.setClass = function(a, c, on, e, n){
    n.classList[on ? "add" : "remove"](c);
    a.classList[on ? "add" : "remove"](this.opt.cAct);
  }

  //n = #hash|link|target
  this.handleState = function(n, e, on) {
    if (on===undefined && n.hasAttribute("data-class")) return this.toggleClass(n, e);
    if (n && (n.hash || !n.tagName)) n = this.q(n.hash || n, 0); //target
    if (n && n.matches("." + this.opt.cToggle + "[id]")) {
      on = this.targetState(n, e, on);
      if (on) this.hideSiblings(n);//before setState!
      this.setState(n, on);
      this.updateLinks(on, n);
      if (!this.noMem) {
        this.store(n, on); //mem
        //hash change
        if (e && e.type=="click") {
          e.preventDefault();
          if (this.opt.qsRehash && n.matches(this.opt.qsRehash)) {
            if (on) this.addHistory("#" + n.id);
            else location.hash = this.opt.hashCancel;
          }
        }
      }
    }
  }

  this.show = function(n) {
    this.handleState(n, null, true);
  }

  this.hide = function(n) {
    this.handleState(n, null, false);
  }
  
  this.hideSiblings = function(n) {
    var p = n.parentNode;
    if (p.matches("ul.accordion li")) {
      this.b(p.parentNode, "ul", "", this.hide);
    }
    else if (p.matches("ul." + this.opt.cTabs + "+div")) {
      this.b(p, [].slice.call(p.children), "", this.hide);
    }
  }

  this.updateLinks = function(on, n, hash) {
    var id  = (typeof n === "string") ? n : n.id;
    if(hash) this.b("", "." + this.opt.cHashed, "", function(m) {
      m.classList.remove(this.opt.cHashed);
      m.classList.remove(this.opt.cAct);
    });
    if (id) this.b("", "a[href='#" + id + "']", "", function(m) {
      m.classList[on ? "add" : "remove"](this.opt.cAct);
      if(hash) m.classList[on ? "add" : "remove"](this.opt.cHashed);
    });
  }

  this.addHistory = function(h) {
    history.pushState({}, "", h);
    history.pushState({}, "", h);
    history.go(-1);
  }

  this.store = function(n, on) {
    if (n && n.id && localStorage && n.matches(this.opt.qsMem)) {
      //localStorage[on ? "setItem" : "removeItem"]("vis#" + n.id, 1); //store only shown
      localStorage.setItem("vis#" + n.id, on ? 1 : 0); //also store hidden
    }
  }
  
  this.restore = function(n, e) {
    this.noMem = 1;
    //hilite first tab
    this.b(n, "ul." + this.opt.cTabs + ">li:first-child>a", "", this.show);
    //restore from mem
    if (localStorage) {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        //if (k.substr(0, 4) == "vis#") this.show(k.substr(3)); //restore only shown
        if (k.substr(0, 4) == "vis#") {
          var d = this.q(k.substr(3), 0);
          if (d && d.matches(this.opt.qsMem)) this.handleState(d, null, localStorage.getItem(k)==1); //also restore hidden
        }
      }
    }
    this.noMem = 0;
  }

  //esc

  this.esc = function(n, e) {
    if (e && e.keyCode==90 && e.ctrlKey) localStorage.clear(); //ctrl+z
    if (!e || e.keyCode == 27 || e.button === 0) {
      //escape or click - check ancestor
      this.b("", this.opt.qsEsc, "", e ? this.checkHide.bind(this, e.keyCode ? null : e.target) : this.hide);
      //if(n && n.hash==this.opt.hashCancel) this.hide(this.ancestor(this.opt.qsEsc, n));
      if (location.hash.length > 0) {
        var d = this.q(location.hash, 0);
        if (!e || e.keyCode == 27 || (document.body.contains(e.target) && !this.ancestor(location.hash, e.target))) location.hash = this.opt.hashCancel;
      }
    }
  }
  
  this.checkHide = function(t, n) {
    if (n.matches(this.opt.qsJsShow)) {
      if (t ? (!n.parentNode.contains(t)) : !this.q(this.opt.qsJsShow, 0, n)) this.hide(n);
    }
  }

  this.onHash = function() {
    if (location.hash) {
      this.show(location.hash);
      this.updateLinks(1, location.hash.substr(1), 1);
      var d = this.q(location.hash+' [name]', 0);
      if (d) d.focus();
    }
  }
  
  this.setValue = function(n, e) {
    e.preventDefault();
    var d = this.q(n.hash, 0);
    if (d) {
      d.value = n.getAttribute('data-value');
      this.esc();
    }
  }

  this.prepareColor = function(n, e) {
    var m = document.createElement("input");
    m.type = "text";
    m.value = n.value;
    m.size = 7;
    m.className = 'color';
    n.parentNode.insertBefore(m, n);
    n.parentNode.insertBefore(document.createTextNode(" "), n);
    this.b("", [n, m], "input", function(x, e){ (x==n ? m : n).value = x.value; });
  }
  
  //ajax
  
  this.getAjax = function(n, e) {
    e.preventDefault();
    var qs = n.getAttribute("data-target");
    this.ajax(n.getAttribute("href"), qs=='#' ? true : this.q(qs,0));
  }
  
  this.ajax = function(url, n, callback) {
    if (typeof n === "string" && n) n = document.querySelector(n);
    var req = new XMLHttpRequest();
    if (n || callback) req.addEventListener("load", this.recv.bind(this, req, n, callback));
    req.open("GET", url);
    req.send();
  }
  
  this.recv = function(req, n, callback, e) {
    if (req.status == "200") {
      if (n===true){
        this.showDialog(req.responseText);
      }
      else if (n) {
        n.innerHTML = req.responseText;
        var dlg = this.ancestor(".dlg, .full", n);
        if (dlg && dlg.id) location.hash = "#" + dlg.id;
      }
      if (callback) callback(req, n, e); // JSON.parse(req.responseText)
    }
    else console.error("XHTTP request failed", req);
  }
  
  //url
  
  this.get = function(h, p) {
    var v = false;
    if (p) {
      var re = new RegExp('([?&]' + p + '=)([^&]*)');
      var m = h.match(re);
      if (m) v = decodeURIComponent(m[2]).replace(/\+/, ' ');
    }
    return v;
  }
  
  this.arg = function(u, a) {
    var i = 0, h = '', k, s, re, m;
    m = u.match(/#.*$/);
    if (m) {
      h = m[0];
      u = u.substr(0, u.length - m[0].length);
    }
    for (k in a) {
      re = new RegExp('([?&]' + k + '=)([^&]*)');
      m = u.match(re);
      if (m) u = u.replace(re, '$1' + a[k]);
      else {
        s = (!i && u.indexOf('?')==-1) ? '?' : '&';
        u += s + k + '=' + encodeURIComponent(a[k]);
      }
      i++;
    }
    return u + h;
  }
  
  //insert
  
  //after: 0 = appendChild, 1 = siblingAfter
  this.ins = function(tag, t, attrs, n, after) {
    var c = document.createElement(tag || 'span');
    if (t && t.tagName) c.appendChild(t);
    else if (t) c.innerHTML = t; //c.appendChild(document.createTextNode(t||''));
    if (attrs) {
      for (var i in attrs) c[i] = attrs[i];
    }
    return n ? (after ? n.parentNode.insertBefore(c, n.nextSibling) : n.appendChild(c)) : c;
  }

  this.svg = function(i, c, alt) {
    if (!document.getElementById(i)) return this.ins('span', alt, {className: c || ''});
    return this.ins('span', '<svg class="' + this.opt.cIcon + ' ' + (c || '') + '" width="24" height="24"><use xlink:href="#' + i + '"></use></svg>');
  }
  
  this.i = function(s, c) {
    return this.svg(this.ico[s] || '', c || '', this.s('_' + s) );
  }
  
  //localization

  this.getStrings = function() {
    var d = document.querySelector('[' + this.opt.attrStr + ']');
    if (d) {
      var s = JSON.parse(d.getAttribute(this.opt.attrStr));
      for (var i in s) this.str[i] = s[i];
    }
  }

  this.s = function(s, def) {
    return this.str[s] || (def===undefined ? s : def);
  }

  //run

  this.refresh = function(n) {
    //set js
    if (!n) this.b("", "body", "", function(n) { n.classList.add("js"); });

    //a.dialog[href]([title]|[data-caption])[data-prompt], a.alert, input.dialog
    this.b(n, "." + this.opt.cAlert + ", ." + this.opt.cDialog, "click", this.openDialog);
    //check all checkbox [data-group] to [class]
    this.b(n, "input[data-group]", "click", this.checkBoxes);
    //table cells align
    this.b(n, "table[class]", "", this.alignCells);
    //gallery back
    this.b(n, "." + this.opt.cGallery + " a[id]", "click", this.gotoPrev);
    
    //prepere nav & tabs
    this.b(n, "ul." + this.opt.cToggle + " ul[id], ul." + this.opt.cToggle + "." + this.opt.cTabs +"+div>div[id]", "", this.setToggle);//,.dlg,.full
    //prepare togglers
    this.b(n, "." + this.opt.cToggle + "[id]", "", this.setState);
    //prepare tabs, mem
    this.restore();
    //prepare hash
    //if (location.hash) this.show(location.hash);
    this.onHash();
    //toggle visiblity or class
    this.b(n, "[data-class]", "", this.handleState);
    this.b(n, "a[href^='#'], [data-class]", "click", this.handleState);
    //set input value
    this.b(n, "a[href^='#'][data-value]", "click", this.setValue);
    //color input
    this.b(n, "input[type='color']", "", this.prepareColor);
    //escape closes targeted elements
    if (!n) this.b("", [window], "keydown", this.esc);
    //close on click out
    if (!n) this.b("", "html, a[href='" + this.opt.hashCancel + "']", "click", this.esc);//mousedown
    //[data-target]
    this.b("", "a[data-target]", "click", this.getAjax);
    //focus dialog
    this.b("", [window], "hashchange", this.onHash);
  }

})();


// end module
// var isNode    = (typeof module !== 'undefined' && this.module !== module); // use module or global
// var isBrowser = (typeof window !== 'undefined' && this.window === this);

    if (typeof module !== "undefined") {
      //console.log("npm require d1", module);
      module.exports = main;
    }
    else if (window) {
      //console.log("browser include d1");
      window.d1 = main;
    }
  }

})(window, document, Element);