/*! d1css v# */

(function(window, document, Element){
  
  "use strict";

  //check single instance
  if (window && window.d1) {
    console.log("d1 already included");
  }
  else {

// begin module

var main = new(function() {

  "use strict";

  this.opt = {
    hashCancel: '#cancel',
  };
  
  this.togglable = ".hide.toggle[id], .pop>div.toggle[id], ul.toggle ul[id], .tabs>.hide[id]";
  this.escapable = ".pop>div, ul.nav.toggle ul, .esc";
  this.mem = ".mem, .tabs.mem>.hide, ul.mem ul[id]";
  this.unhover = "ul.toggle ul[id], .pop>div.toggle[id]";

  //common

  this.load = function(obj, opt) {
    if (!obj) obj = this;
    this.b("", [document], "DOMContentLoaded", obj.init.bind(obj, opt));
  }
  
  this.init = function(opt) {
    if (location.hash == "#disable-js") return;
    if (window && !Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector; //ie9+
    this.refresh();
  }
  
  this.q = function(s, i, n) {
    if (!s) return i === undefined ? [] : null;
    var f = (i === 0) ? "querySelector" : "querySelectorAll";
    var a = (n || document)[f](s);
    if (i) a = a[i < 0 ? a.length + i : i];
    return a;
  }

  this.b = function(n, sel, type, fn) {
    var ref = this;
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

  this.askConfirm = function(n, e) {
    if (n.form && !n.form.checkValidity());
    else if (!confirm(n.title)) e.preventDefault();
  }

  this.askPrompt = function(n, e) {
    var x = prompt(n.title + ":", n.getAttribute("data-default") || "");
    if (x != null) location.href = n.href + x;
    e.preventDefault();
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
    if (e.clientX < n.clientWidth / 3) {
      var p = n.previousElementSibling || this.q("a[id]", -1, n.parentNode);
      if (p.id) {
        location.hash = "#" + p.id;
        e.preventDefault();
      }
    }
  }

  this.prepareColor = function(n, e) {
    var m = document.createElement("input");
    m.type = "text";
    m.value = n.value;
    m.size = 7;
    n.parentNode.insertBefore(m, n);
    n.parentNode.insertBefore(document.createTextNode(" "), n);
    this.b("", [n, m], "input", function(x, e){ (x==n ? m : n).value = x.value; });
  }
  
  this.dropImage = function(n, e) {
    var f = new FileReader();
    f.onloadend = function() {
      n.style["background-image"] = "url('" + f.result + "')";
      n.title = e.target.files[0].name + ", " + e.target.files[0].size + " B";
    }
    f.readAsDataURL(e.target.files[0]);
  }
  
  this.prepareCode = function(n) {
    var s = this.q(n.getAttribute("data-src"), 0);
    if(s){
      n.textContent = s.innerHTML.
        replace(/^\s*\r?\n|\s+$/g, "").
        replace(/\t/g, "  ").
        replace(/=""/g, "");
      n.classList.remove("hide");
    }
  }

  //toggle
  
  this.getState = function(n) {
    return n.classList.contains("js-show");
  }
  
  this.setState = function(n, on) {
    n.classList.add("js-control");
    n.classList[on ? "add" : "remove"]("js-show");
  }
  
  this.targetState = function(n, e, on){
    if (e && on === undefined){
      if (n.parentNode.matches(".tabs")) on = true; //tabs: on
      else on = !this.getState(n); //toggle
    }
    return on;
  }

  //n = #hash|link|target
  this.handleState = function(n, e, on) {
    if (n.hash || !n.tagName) n = this.q(n.hash || n, 0); //target
    if (n && n.matches(this.togglable)){
      on = this.targetState(n, e, on);
      this.setState(n, on);
      if (on) this.hideSiblings(n);
      this.store(n, on); //mem
      this.updateLinks(on, n);
      //hash change
      if (e && e.type=="click") {
        e.preventDefault();
        if (!n.matches(this.unhover)) {
          if (on) this.addHistory("#" + n.id);
          else location.hash = this.opt.hashCancel;
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
  
  this.showFirstTab = function(n) {
    var a = this.q("a[href^='#']", 0, n.parentNode); //first link
    var d = this.q(a.hash, 0, n); //corresponding tab
    if(d && !d.matches(".js-control")) this.show(d);
  }

  this.hideSiblings = function(n) {
    var p = n.parentNode;
    if (this.ancestor("ul.nav.toggle, ul.accordion", p)){
      this.b(this.ancestor("ul", p), "ul:not([id='" + n.id + "'])", "", this.hide);
    }
    else if (p.matches(".tabs")){
      this.b(p, ".hide:not([id='" + n.id + "'])", "", this.hide);
      //:scope>.hide... - for nested tabs - fails in ie
    }
  }

  this.updateLinks = function(on, n) {
    if (n.id) this.b("", "a[href='#" + n.id + "']", "", function(n) {
      n.classList[on ? "add" : "remove"]("act")
    });
  }

  this.addHistory = function(h) {
    history.pushState({}, "", h);
    history.pushState({}, "", h);
    history.go(-1);
  }

  this.store = function(n, on) {
    if (n && n.id && localStorage && n.matches(this.mem)) {
      localStorage[on ? "setItem" : "removeItem"]("vis#" + n.id, 1); //store only shown
      localStorage.setItem("vis#" + n.id, on ? 1 : 0); //also store hidden
    }
  }
  
  this.restore = function(n, e) {
    if (localStorage) {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        //if (k.substr(0, 4) == "vis#") this.show(k.substr(3)); //store only shown
        if (k.substr(0, 4) == "vis#"){
          var d = this.q(k.substr(3), 0);
          if (d && d.matches(this.mem)) this.handleState(d, null, localStorage.getItem(k)==1); //also store hidden
        }
      }
    }
  }

  //esc

  this.esc = function(n, e) {
    if (e.keyCode==90 && e.ctrlKey) localStorage.clear(); //ctrl+z
    if (e.keyCode == 27 || e.button === 0) {
      //escape or click with no active ancestor
      if( e.keyCode 
        || this.ancestor("a.close", e.target)
        || !this.ancestor("a, .hide, .nav, .pop>div, .drawer, .unesc", e.target)
      ) {
        this.b("", this.escapable, "", this.hide);
        if(location.hash.length > 0) location.hash = this.opt.hashCancel;
      }
    }
  }

  this.control = function(d) {
    d.classList.add("js-control");
  }
  
  //ajax
  
  this.getAjax = function(n, e) {
    e.preventDefault();
    this.ajax(n.getAttribute("href"), this.q(n.getAttribute("data-target"),0));
  }
  
  this.ajax = function(url, node, callback) {
    if (typeof node === "string" && node) node = document.querySelector(node);
    var x = new XMLHttpRequest();
    var ref = this;
    if (node || callback) x.addEventListener("load", function(e) {
      if (this.status == "200") {
        if (node){
          node.innerHTML = this.responseText;
          var dlg = ref.ancestor('.dlg, .full', node);
          if(dlg && dlg.id) location.hash = '#'+dlg.id;//ref.setState(dlg, 1);
        }
        if (callback) callback(this, node, e);
      }
      else console.error("XHTTP request failed",this);
    });
    x.open("GET", url/* + "?t=" + (new Date()).getTime()*/);
    x.send();
  }
  
  //common

  //after: 0 = appendChild, 1 = siblingAfter
  this.ins = function(tag, t, attrs, n, after) {
    var c = document.createElement(tag || 'span');
    if (t) c.innerHTML = t; //c.appendChild(document.createTextNode(t||''));
    if (attrs) {
      for (var i in attrs) c[i] = attrs[i];
    }
    return n ? (after ? n.parentNode.insertBefore(c, n.nextSibling) : n.appendChild(c)) : c;
  }

  this.svg = function(i,c,alt){
    if(!document.getElementById(i)) return this.ins('span', alt, {className: c || ''});
    return d1.ins('span', '<svg class="icon ' + (c || '') + '" width="24" height="24"><use xlink:href="#' + i + '"></use></svg>');
  }

  this.arg = function(u, a){
    var i = 0, k, s;
    for(k in a){
      s = (!i && u.indexOf('?')==-1) ? '?' : '&';
      u += s + k + '=' + a[k];
      i++;
    }
    return u;
  }

  //run

  this.refresh = function(n) {
    //set js
    if (!n) this.b("", "body", "", function(n) { n.classList.add("js"); });

    //pre
    this.b(n, "pre[data-src]", "", this.prepareCode);
    //a.confirm[href][title], input.confirm [title]
    this.b(n, "a.confirm[href], .confirm[name]", "click", this.askConfirm);
    //a.prompt[href] [title] [data-default]
    this.b(n, "a.prompt[href]", "click", this.askPrompt);
    //check all checkbox [data-group] to [class]
    this.b(n, "input[data-group]", "click", this.checkBoxes);
    //table cells align
    this.b(n, "table[class]", "", this.alignCells);
    //gallery back
    this.b(n, ".gal a[id]", "click", this.gotoPrev);
    //color
    this.b(n, "input[type='color']", "", this.prepareColor);
    //drop image
    this.b(n, ".drop", "change", this.dropImage);

    //prepere nav
    this.b(n, this.unhover, "", function(n) { n.classList.add("js-control"); });
    //prepare mem
    this.restore();
    //prepare tabs (hilite first if not remembered)
    this.b(n, ".nav+.tabs", "", this.showFirstTab);
    //prepare hash
    if (location.hash) this.show(location.hash);
    //toggle
    this.b(n, "a[href^='#']", "click", this.handleState);

    //escape closes targeted elements
    if (!n) this.b("", [window], "keydown", this.esc);
    //close on click out
    if (!n) this.b("", "html, .close", "click", this.esc);//mousedown
    //[data-target]
    this.b("", "a[data-target]", "click", this.getAjax);
  }

})();


// end module

    if (typeof module !== "undefined") {
      //console.log("npm require d1", module);
      module.exports = main;
    }
    else if(window) {
      //console.log("browser include d1");
      window.d1 = main;
    }
  }

})(window, document, Element);
