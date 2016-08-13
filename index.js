'use strict';
const packageJson = require('package-json');
const co = require('co');
const execa = require('execa');

const runGhqGet = repo => execa('ghq', ['get', '-p', repo]);

function * npmSrc(repos) {
	try {
		const pkgs = yield Promise.all(repos.map(repo => packageJson(repo)));
		const ps = pkgs
			.map(pkg => pkg.repository)
			.filter(repo => repo.type === 'git')
			.map(repo => runGhqGet(repo.url));

		const results = yield Promise.all(ps);
		return results.map(x => x.stdout);
	} catch (err) {
		if (err.code === 'ENOENT') {
			throw new Error(`Retry after npm install ${repos}`);
		}
	}
}

module.exports = repos => {
	if (!Array.isArray(repos)) {
		return Promise.reject('Expected a array');
	}
	return co(npmSrc(repos));
};
