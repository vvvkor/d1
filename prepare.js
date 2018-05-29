/*
// dependencies
var fs = require("fs")
var postcss = require("postcss")
var calc = require("postcss-calc")

// css to be processed
var css = fs.readFileSync("dist/d1.css", "utf8")

// process css
var output = postcss()
  .use(calc())
  .process(css)
  //.css
  .then(result => {
            fs.writeFile('dist/d1x.css', result.css, () => true);
            if ( result.map ) {
                fs.writeFile('dist/d1.css.map', result.map, () => true);
            }
        });
*/		
		
const fs = require('fs');
const postcss = require('postcss');
//const precss = require('precss');
//const autoprefixer = require('autoprefixer');
var calc = require("postcss-calc")

fs.readFile('src/app.css', (err, css) => {
    postcss([/*precss, autoprefixer*/ calc])
        .process(css, { from: 'dist/d1.css', to: 'dist/d1x.css' })
        .then(result => {
            fs.writeFile('dist/d1x.css', result.css, () => true);
            if ( result.map ) {
                fs.writeFile('dist/d1.css.map', result.map, () => true);
            }
        });
});