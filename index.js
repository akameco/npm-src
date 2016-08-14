'use strict';
const packageJson = require('package-json');
const execa = require('execa');
const Listr = require('listr');

const runGhqGet = repo => execa.stdout('ghq', ['get', '-p', repo]);

const clone = repo =>
	packageJson(repo)
		.then(pkg => pkg.repository)
		.then(repo => {
			if (repo.type !== 'git') {
				return Promise.reject('Expected a git repository');
			}
			return runGhqGet(repo.url);
		});

const ghqTasks = repos => {
	const tasks = repos.map(repo => ({
		title: `ghq get ${repo}`,
		task: () => clone(repo)
	}));

	return new Listr(tasks);
};

module.exports = repos => {
	if (!Array.isArray(repos)) {
		return Promise.reject('Expected a array');
	}

	const tasks = new Listr([{
		title: 'Install package repository',
		task: () => ghqTasks(repos)
	}]);

	return tasks.run().catch(err => {
		console.error(err);
	});
};
