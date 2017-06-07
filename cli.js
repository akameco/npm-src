#!/usr/bin/env node
'use strict'
const meow = require('meow')
const updateNotifier = require('update-notifier')
const npmSrc = require('./')

const cli = meow(`
	Usage
	  $ npm-src <package name> [string, array]

	Examples
	  $ npm-src ava xo
`)

if (cli.input.length === 0) {
	console.error('Specify a package name')
	process.exit(1)
}

updateNotifier({ pkg: cli.pkg }).notify()

npmSrc(cli.input)
