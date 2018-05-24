(function(window, document, Element) {
    var name = "d1";
    if (window && window[name]) {} else {
        var main = new function() {
            "use strict";
            this.togglable = ".hide.toggle[id], ul.toggle ul[id], .tabs>.hide, details";
            this.escapable = ".pop>.hide, ul.nav.toggle ul, details.pop, .esc";
            this.mem = ".mem, .tabs.mem>.hide, ul.mem ul[id], details.mem details";
            this.unhover = "ul.nav.toggle ul[id]";
            this.run = function(func) {
                console.log("run", func || "d1");
                if (document.addEventListener && "classList" in document.createElement("p")) {
                    this.b("", [ document ], "DOMContentLoaded", func || this.init);
                }
            };
            this.q = function(s, i, n) {
                if (!s) return i === undefined ? [] : null;
                var f = i === 0 ? "querySelector" : "querySelectorAll";
                var a = (n || document)[f](s);
                if (i) a = a[i < 0 ? a.length + i : i];
                return a;
            };
            this.b = function(n, sel, type, fn) {
                var ref = this;
                var a = typeof sel === "string" ? (n || document).querySelectorAll(sel) : sel;
                if (a.length) [].forEach.call(a, this.handle.bind(this, type, fn));
            };
            this.handle = function(type, fn, n) {
                type ? n.addEventListener(type, fn.bind(this, n), false) : fn.call(this, n);
            };
            this.ancestor = function(q, n) {
                do {
                    if (n.matches && n.matches(q)) return n;
                } while (n = n.parentNode);
            };
            this.askConfirm = function(n, e) {
                if (n.form && !n.form.checkValidity()) ; else if (!confirm(n.title)) e.preventDefault();
            };
            this.askPrompt = function(n, e) {
                var x = prompt(n.title + ":", n.getAttribute("data-default") || "");
                if (x != null) location.href = n.href + x;
                e.preventDefault();
            };
            this.checkBoxes = function(b) {
                this.b(b.form, 'input[type="checkbox"][class~="' + b.getAttribute("data-group") + '"]', "", function(n, e) {
                    n.checked = b.checked;
                });
            };
            this.alignCells = function(n) {
                var m = n.className.match(/\b[lcr]\d\d?\b/g);
                if (m) {
                    for (var i = 0; i < m.length; i++) {
                        this.b(n, "tr>*:nth-child(" + m[i].substr(1) + ")", "", function(c, e) {
                            c.classList.add(m[i].substr(0, 1));
                        });
                    }
                }
            };
            this.gotoPrev = function(n, e) {
                if (e.clientX < n.clientWidth / 3) {
                    var p = n.previousElementSibling || this.q("a[id]", -1, n.parentNode);
                    if (p.id) {
                        location.hash = "#" + p.id;
                        e.preventDefault();
                    }
                }
            };
            this.dropImage = function(n, e) {
                var f = new FileReader();
                f.onloadend = function() {
                    n.style["background-image"] = "url(" + f.result + ")";
                    n.title = e.target.files[0].name + ", " + e.target.files[0].size + " B";
                };
                f.readAsDataURL(e.target.files[0]);
            };
            this.getState = function(n) {
                return n.tagName == "DETAILS" ? n.open : n.classList.contains("js-show");
            };
            this.setState = function(n, on) {
                if (n.tagName == "DETAILS") n.open = on; else {
                    n.classList.add("js-control");
                    n.classList[on ? "add" : "remove"]("js-show");
                }
            };
            this.targetState = function(n, e, on) {
                if (e && on === undefined) {
                    if (n.parentNode.matches(".tabs")) on = true; else if (e.type == "toggle") on = this.getState(n); else on = !this.getState(n);
                }
                return on;
            };
            this.handleState = function(n, e, on) {
                if (n.hash || !n.tagName) n = this.q(n.hash || n, 0);
                if (n && n.matches(this.togglable)) {
                    on = this.targetState(n, e, on);
                    this.setState(n, on);
                    if (on) this.hideSiblings(n);
                    this.store(n, on);
                    this.updateLinks(on, n);
                    if (e && e.type == "click") {
                        e.preventDefault();
                        if (!n.matches(this.unhover)) {
                            if (on) this.addHistory("#" + n.id); else location.hash = "#cancel";
                        }
                    }
                }
            };
            this.show = function(n) {
                this.handleState(n, null, true);
            };
            this.hide = function(n) {
                this.handleState(n, null, false);
            };
            this.hideSiblings = function(n) {
                var p = n.parentNode;
                if (this.ancestor("ul.nav.toggle, ul.accordion", p)) {
                    this.b(this.ancestor("ul", p), 'ul:not([id="' + n.id + '"])', "", this.hide);
                } else if (p.matches(".tabs")) {
                    this.b(p, '.hide:not([id="' + n.id + '"])', "", this.hide);
                }
            };
            this.updateLinks = function(on, n) {
                if (n.id) this.b("", 'a[href="#' + n.id + '"]', "", function(n) {
                    n.classList[on ? "add" : "remove"]("act");
                });
            };
            this.addHistory = function(h) {
                history.pushState({}, "", h);
                history.pushState({}, "", h);
                history.go(-1);
            };
            this.store = function(n, on) {
                if (n && n.id && localStorage && n.matches(this.mem)) {
                    localStorage[on ? "setItem" : "removeItem"]("vis#" + n.id, 1);
                    localStorage.setItem("vis#" + n.id, on ? 1 : 0);
                }
            };
            this.restore = function(n, e) {
                if (localStorage) {
                    for (var i = 0; i < localStorage.length; i++) {
                        var k = localStorage.key(i);
                        if (k.substr(0, 4) == "vis#") {
                            var d = this.q(k.substr(3), 0);
                            if (d && d.matches(this.mem)) this.handleState(d, null, localStorage.getItem(k) == 1);
                        }
                    }
                }
            };
            this.esc = function(n, e) {
                if (e.keyCode == 90 && e.ctrlKey) localStorage.clear();
                if (e.keyCode == 27 || e.button === 0) {
                    if (e.keyCode || !this.ancestor("a, .hide, .drawer, .nav, details.pop", e.target)) {
                        this.b("", this.escapable, "", this.hide);
                        location.hash = "#cancel";
                    }
                }
            };
            this.control = function(d) {
                d.classList.add("js-control");
            };
            this.refresh = function(n) {
                if (!n) this.b("", "body", "", function(n) {
                    n.classList.add("js");
                });
                this.b(n, "a.confirm[href], .confirm[name]", "click", this.askConfirm);
                this.b(n, "a.prompt[href]", "click", this.askPrompt);
                this.b(n, "input[data-group]", "click", this.checkBoxes);
                this.b(n, "table[class]", "", this.alignCells);
                this.b(n, "a.slide[id]", "click", this.gotoPrev);
                this.b(n, ".drop", "change", this.dropImage);
                this.b(n, this.unhover, "", function(n) {
                    n.classList.add("js-control");
                });
                this.restore();
                this.b(n, ".tabs>.hide:last-child:not(.js-control)", "", this.show);
                if (location.hash) this.show(location.hash);
                this.b(n, 'a[href^="#"]', "click", this.handleState);
                this.b(n, "details[id]", "toggle", this.handleState);
                if (!n) this.b("", [ window ], "keydown", this.esc);
                if (!n) this.b("", "html", "click", this.esc);
            };
            this.init = function() {
                if (location.hash == "#disable-js") return;
                if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector;
                this.refresh();
            };
        }();
        if (typeof module !== "undefined") {
            module.exports = main;
        } else if (window) {
            window[name] = main;
        }
    }
})(window, document, Element);