const express = require('express');
const url = require('url');
const op = require('./options/app/core/config/config.js').default;

const themes = op.themes;
const oembedUrl = 'https://gis.vplanas.lt/oembed/?url=https://maps.vilnius.lt';
const oembedTitle = 'Vilniaus miesto interaktyvūs žemėlapiai';
const oembedDescription = 'Vilniaus miesto savivaldybės interaktyvūs žemėlapiai';
const oembedImg = './app/img/vilnius_logo_o.png';

const app = express();

// using dotenv for prod and test, .env file must be specified, check .envexample
require('dotenv').config();

app.set('view engine', 'ejs');
app.use("/dist", express.static(__dirname + '/./dist'));
app.use("/arcgis_js_api", express.static(__dirname + '/./arcgis_js_api'));

app.get('/*', (req, res) => {
  const pathname = url.parse(req.url, parseQueryString = false).pathname;
  if (pathname.slice(1)) {
		let themeName;
		let themesIds = [];
    for (theme in themes) {
			themesIds.push(themes[theme].id);
			if (themes[theme].id === pathname.slice(1)) {
				themeName = theme;
			}

    }

		const incudesTheme = themesIds.includes(pathname.slice(1));
		if (incudesTheme) {
			//console.log('\x1b[33m%s\x1b[0m', `1 themes' id ${themes[themeName].id}`);
			res.render('index.ejs', {
				oembedUrl: oembedUrl + req.url,
				oembedDescription: `${themes[themeName].description} `,
				oembedTitle: `${themes[themeName].name} / ${oembedTitle}`,
				oembedImg: themes[themeName].imgUrl,
				noIndex: themes[themeName].name.hide
			});

		} else {
			// still using legacy maps application with static url routing
			if (pathname.slice(1) !== 'maps_vilnius' ) {
				// redirect to home page
				res.redirect('/');
			}

		}


  } else {
		// Home page
    res.render('index.ejs', {
      oembedUrl: oembedUrl + req.url,
      oembedDescription,
      oembedTitle: oembedTitle,
			oembedImg,
			noIndex: false
    });
  }

});

app.listen(process.env.PORT);
