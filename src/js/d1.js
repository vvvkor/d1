// (c) Vadim Korolev (vadimkor@yandex.ru) 2018
// uglifyjs --verbose d1.js > d1.min.js

var app = new(function() {

	"use strict";

	this.togglable = '.hide.toggle, ul.toggle ul, .tabs>.hide';
	this.escapable = '.pop>.hide, ul.nav.toggle ul';
	this.forget = '.pop>.hide, ul.toggle.nav ul, .tabs>.hide';
	this.unhover = 'ul.nav.toggle ul';

	//common

	this.init = function(func) {
		if (document.addEventListener) this.b('', [document], 'DOMContentLoaded', func);
	}

	this.q = function(s, i, n) {
		if (!s) return i === undefined ? [] : null;
		var f = (i === 0) ? 'querySelector' : 'querySelectorAll';
		var a = (n || document)[f](s);
		if (i) a = a[i < 0 ? a.length + i : i];
		return a;
	}

	this.b = function(n, sel, type, fn) {
		var ref = this;
		var a = (typeof sel === 'string') ? (n || document).querySelectorAll(sel) : sel;
		if (a.length) [].forEach.call(a, this.handle.bind(this, type, fn));
	}

	this.handle = function(type, fn, n) {
		type
			? n.addEventListener(type, fn.bind(this, n), false)
			: fn.call(this, n);
	}

	this.par = function(q, n) {
		while (n = n.parentNode){
			if (n.matches && n.matches(q)) return n; //ie-
		}
	}

	//basic

	this.confirm = function(n, e) {
		if (n.form && !n.form.checkValidity());
		else if (!confirm(n.title)) e.preventDefault();
	}

	this.prompt = function(n, e) {
		var x = prompt(n.title + ':', n.getAttribute('data-default') || '');
		if (x != null) location.href = n.href + x;
		e.preventDefault();
	}

	this.checks = function(b) {
		this.b(b.form, 'input[type="checkbox"][class~="' + b.getAttribute('data-group') + '"]', '', function(n, e) {
			n.checked = b.checked;
		})
	}

	this.tabAlign = function(n) {
		var m = n.className.match(/\b[lcr]\d\d?\b/g);
		if (m) {
			for (var i = 0; i < m.length; i++) {
				this.b(n, 'tr>*:nth-child(' + m[i].substr(1) + ')', '', function(c, e) {
					c.classList.add(m[i].substr(0, 1));
				});
			}
		}
	}

	this.gotoPrev = function(n, e) {
		if (e.clientX < n.clientWidth / 3) {
			var p = n.previousElementSibling || this.q('a[id]', -1, n.parentNode);
			if (p.id) {
				location.hash = '#' + p.id;
				e.preventDefault();
			}
		}
	}

	//inspired by https://picnicss.com/documentation#dropimage
	this.dropImg = function(n, e) {
		var f = new FileReader();
		f.onloadend = function() {
			n.style['background-image'] = 'url(' + f.result + ')';
			n.title = e.target.files[0].name + ', ' + e.target.files[0].size + ' B';
		}
		f.readAsDataURL(e.target.files[0]);
	}

	//toggle

	//n = #hash|link|target
	this.toggle = function(n, e) {
		if (n.hash || !n.tagName) n = this.q(n.hash || n, 0);
		if (n && n.matches(this.togglable)) {
			var on = 1;
			n.classList.add('js-control');
			if (e && !n.parentNode.matches('.tabs')) on = n.classList.toggle('js-show');
			else n.classList[on ? 'add' : 'remove']('js-show');
			this.setLinks(on, n);
			if (on) this.hideSiblings(n);
			if (e) { //mem, hash change
				if (localStorage && !n.matches(this.forget)) {
					localStorage[on ? 'setItem' : 'removeItem']('vis#' + n.id, 1);
				}
				e.preventDefault();
				if (!n.matches(this.unhover)) {
					if (on) this.addHistory('#' + n.id);
					else location.hash = '#cancel';
				}
			}
		}
	}

	this.hideSiblings = function(n) {
		if (this.par('ul.nav.toggle, ul.accordion', n)) this.b(this.par('ul', n), 'ul:not([id="' + n.id + '"])', '', this.hide);
		else if (n.parentNode.matches('.tabs')) this.b(n.parentNode, '.hide:not([id="' + n.id + '"])', '', this.hide);
		//:scope>.hide... - for nested tabs - fails in ie
	}

	this.setLinks = function(on, n) {
		if (n.id) this.b('', 'a[href="#' + n.id + '"]', '', function(n) {
			n.classList[on ? 'add' : 'remove']('act')
		});
	}

	this.addHistory = function(h) {
		history.pushState({}, '', h);
		history.pushState({}, '', h);
		history.go(-1);
	}

	this.restore = function(n, e) {
		for (var i = 0; i < localStorage.length; i++) {
			var k = localStorage.key(i);
			if (k.substr(0, 4) == 'vis#') this.toggle(k.substr(3));
		}
	}

	//esc

	this.esc = function(n, e) {
		if (e.keyCode == 27 
			|| (e.button === 0)) {
			//ext: click out
			var p = null;
			if (e.button === 0) {
				var q = 'a, .hide, .drawer, .nav';
				var t = e.target;
				var p = (t.matches(q))
					? t
					: this.par(q, t);
			}
			//escape
			if (!p) {
				this.b('', this.escapable, '', this.hide);
				location.hash = '#cancel';
			}
		}
	}

	this.hide = function(n) {
		n.classList.remove('js-show');
		this.setLinks(0, n);
		if (n.id) localStorage.removeItem('vis#' + n.id);
	}

	this.control = function(d) {
		d.classList.add('js-control');
	}
	
	//run

	this.refresh = function(n) {
		//set js
		if (!n) this.b('', 'body', '', function(n) { n.classList.add('js'); });

		//a.confirm[href][title], input.confirm [title]
		this.b(n, 'a.confirm[href], .confirm[name]', 'click', this.confirm);
		//a.prompt[href] [title] [data-default]
		this.b(n, 'a.prompt[href]', 'click', this.prompt);
		//check all checkbox [data-group] to [class]
		this.b(n, 'input[data-group]', 'click', this.checks);
		//table cells align
		this.b(n, 'table[class]', '', this.tabAlign);
		//gallery back
		this.b(n, 'a.slide[id]', 'click', this.gotoPrev);
		//drop image
		this.b(n, '.drop', 'change', this.dropImg);

		//prepere nav (unhover)
		this.b(n, this.unhover, '', function(n) { n.classList.add('js-control'); });
		//prepare tabs (hilite first)
		this.b(n, '.tabs>.hide:last-child', '', this.toggle);
		//prepare mem
		if (localStorage) this.restore();
		//prepare hash
		if (location.hash) this.toggle(location.hash);
		//toggle
		this.b(n, 'a[href^="#"]', 'click', this.toggle);

		//escape closes targeted elements
		if (!n) this.b('', [window], 'keydown', this.esc);
		//close on click out
		if (!n) this.b('', 'html', 'click', this.esc);//mousedown
	}

})();

app.init(function() {
	if (location.hash == '#disable-js') return;
	if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector; //ie9+
	app.refresh();
});