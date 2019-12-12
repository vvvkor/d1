// live theme configurator for d1

window.addEventListener('DOMContentLoaded', function(e){
  
  if(!window.d1){
    console.error('d1 is required');
    return;
  }
  
  var restore = function(n, v){
    var css = localStorage.getItem(v);
    if(css) n.style = css;
  }
  
  var style = function(k, v, deep){
    if(k instanceof Array) k.forEach(function(w){ style(w, v, 1) });
    else{
      var n = (k.substr(0, 2)=='--') ? document.documentElement : document.body;
      n.style.setProperty(k, v);
      localStorage.setItem('theme-'+n.tagName.toLowerCase(), n.style.cssText);
    }
  }
  
  var unstyle = function(n, e){
    e.preventDefault();
    document.documentElement.style = document.body.style = '';
    localStorage.removeItem('theme-html');
    localStorage.removeItem('theme-body');
  }
  
  var h = function(s, d, l){
    d1.ins('h'+(l || 3), s, {className: 'mar'}, d);
  }
  var put = function(hh, arr, func){
    h(hh, d);
    var c = [];
    arr.forEach(function(v, k){
      var color = v.match(/[#\(]/);
      var a = d1.ins('a', color ? '' : v, {href:'#', title: v, className: color ? 'pad hover bord' : 'pad hover'}, d);
      if(color) a.style.backgroundColor = v;
      else if(typeof func === 'string') a.style[func] = v;
      c.push(a);
    });
    d1.b('', c, 'click', (func instanceof Function
      ? func
      : function(n, e){
          e.preventDefault();
          style(func, n.title);
        }
    ));
  }
  
  restore(document.documentElement, 'theme-html');
  restore(document.body, 'theme-body');

  //button
  var a = d1.ins('a', 'Theme', {href: '#theme', className: 'fix pad btn theme-btn'}, document.body);
  var s = a.style;
  s.transform = 'rotate(-90deg)';
  s.transformOrigin = '100% 100%';
  s.top = '10vh';
  s.right = '-.2em';
  s.bottom = s.left = 'auto';
  s.margin = 0;
  //drawer
  var d = d1.ins('div', '', {id: 'theme', className: 'drawer pad shift theme-drawer'}, document.body);
  d1.ins('a', '&#x2715;', {href: '#cancel', className: 'pad hover close'}, d);
  
  //menu
  var a = [];
  h('Theme', d, 2);
  d1.b('', [d1.ins('a', 'Reset to default', {href:'#', className: ''}, d)], 'click', unstyle);
  put('Background', ['#fff', '#eee', '#ffeee6', '#ffe', '#efe', '#e6fcf9', '#e3eeff', '#f9e9ff'], '--bg');
  put('Menu', ['rgba(255,255,255,0)', 'rgba(0,0,0,.1)', 'hsla(1,100%,55%,.3)', 'hsla(45,100%,50%,.3)', 'hsla(120,100%,35%,.3)', 'hsla(180,100%,35%,.3)', 'hsla(220,100%,55%,.3)', 'hsla(290,100%,50%,.3)'], ['--bg-pane', '--bg-hilite']);
  put('Links', ['#000', '#777', '#c00', '#c60', '#090', '#088', '#00c', '#909'], ['--link', '--visited', '--hover']);
  put('Text', ['#000', '#222', '#444', '#555',  '#666', '#777', '#888', '#999'], '--text');
  put('Font', ['sans-serif', 'serif', 'monospace', 'Roboto', 'Open Sans', 'Georgia', 'PT Sans', 'PT Serif', 'PT Mono'], 'font-family');
  put('Gaps', ['0.5', '0.7', '1', '1.2', '1.5'], '--gap');
}, false);