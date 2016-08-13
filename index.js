'use strict';
const path = require('path');
const co = require('co');
const execa = require('execa');
const readPkg = require('read-pkg');

const runGhqGet = repo => execa('ghq', ['get', '-p', repo]);

function * npmSrc(args) {
	try {
		const readPkgs = args.map(pkg =>
			readPkg(path.resolve('node_modules', pkg))
		);

		const pkgs = yield Promise.all(readPkgs);
		const ps = pkgs
			.map(pkg => pkg.repository)
			.filter(repo => repo.type === 'git')
			.map(repo => runGhqGet(repo.url));

		const results = yield Promise.all(ps);
		return results.map(x => x.stdout);
	} catch (err) {
		if (err.code === 'ENOENT') {
			throw new Error(`Retry after npm install ${args}`);
		}
	}
}

module.exports = args => {
	if (!Array.isArray(args)) {
		return Promise.reject('Expected array');
	}

	return co(npmSrc(args));
};
