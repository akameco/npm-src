#!/usr/bin/env node
'use strict';
const npmSrc = require('./');

npmSrc(process.argv.slice(2))
	.then(results => {
		results.forEach(x => console.log(x));
	}).catch(err => {
		console.log(err);
	});
