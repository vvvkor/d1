// live theme configurator for d1

d1.load(function(e){
  var restore = function(){
    var css = localStorage.getItem('theme');
    if(css) document.documentElement.style = document.body.style = css;
  }
  
  var style = function(k, v, deep){
    if(k instanceof Array) k.forEach(function(w){ style(w, v, 1) });
    else{
      document.documentElement.style.setProperty(k, v);
      document.body.style.setProperty(k, v);
    }
    if(!deep) localStorage.setItem('theme', document.documentElement.style.cssText);
  }
  
  var unstyle = function(n, e){
    e.preventDefault();
    document.documentElement.style = document.body.style = '';
    localStorage.removeItem('theme');
  }
  
  var h = function(s, d, l){
    d1.ins('h'+(l || 3), s, {className: 'mar'}, d);
  }
  
  var put = function(arr, func, el){
    var c = [];
    arr.forEach(function(v, k){
      var color = (v.substr(0, 1)=='#');
      var a = d1.ins('a', color ? '' : v, {href:'#', title: v, className: 'pad hover bord'}, d);
      if(color) a.style.backgroundColor = v;
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
  
  //restore theme
  restore();
  //button
  var a = d1.ins('a', 'Theme', {href: '#theme', className: 'fix pad bg-i btn'}, document.body);
  var s = a.style;
  s.transform = 'rotate(-90deg)';
  s.transformOrigin = '100% 100%';
  s.top = '10vh';
  s.right = '-.2em';
  s.bottom = s.left = 'auto';
  s.margin = 0;
  //drawer
  var d = d1.ins('div', '', {id: 'theme', className: 'drawer pad shift'}, document.body);
  d1.ins('a', '&#x2715;', {href: '#cancel', className: 'pad hover close'}, d);
  
  //menu
  var a = [];
  h('Theme', d, 2);
  //bg
  h('Background', d);
  put(['#fff', '#eee', '#ffe', '#efe', '#eff', '#eef', '#f9e9ff', '#fee'], '--bg');
  //text
  h('Text', d);
  put(['#000', '#222', '#444', '#555',  '#666', '#777', '#888', '#999'], '--text');
  //color
  h('Links', d);
  put(['#000', '#777', '#c60', '#090', '#099', '#00c', '#909', '#b00'], ['--link', '--visited', '--hover']);
  //font
  h('Font', d);
  put(['sans-serif', 'serif', 'monospace', 'Roboto', 'Open Sans', 'Georgia', 'PT Sans', 'PT Serif', 'PT Mono'], 'font-family');
  //gap
  h('Gaps', d);
  put(['0.5', '0.7', '1', '1.2', '1.5'], '--gap');
  //reset
  h('Reset', d);
  var r = d1.ins('a', 'Defaults', {href:'#', className: ''}, d);
  d1.b('', [r], 'click', unstyle);
});