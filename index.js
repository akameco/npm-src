'use strict';
const packageJson = require('package-json');
const execa = require('execa');

const runGhqGet = repo => execa('ghq', ['get', '-p', repo]);

const clone = repo =>
	packageJson(repo)
		.then(pkg => pkg.repository)
		.then(repo => {
			if (repo.type !== 'git') {
				return Promise.reject('Expected a git repository');
			}
			return runGhqGet(repo.url);
		}).then(result => result.stdout);

module.exports = repos => {
	if (!Array.isArray(repos)) {
		return Promise.reject('Expected a array');
	}

	const ps = repos.map(repo => clone(repo));
	return Promise.all(ps);
};
