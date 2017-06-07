'use strict'
const packageJson = require('package-json')
const execa = require('execa')
const Listr = require('listr')

const runGhqGet = repoUrl => execa.stdout('ghq', ['get', '-p', repoUrl])

const ghqTasks = repos => {
	const tasks = repos.map(repo => ({
		title: `ghq get ${repo}`,
		task: (ctx, task) =>
			packageJson(repo, { fullMetadata: true })
				.then(pkg => {
					task.output = pkg.repository.url
					return pkg.repository
				})
				.then(repo => {
					if (repo.type !== 'git') {
						return Promise.reject(new Error('Expected a git repository'))
					}
					return runGhqGet(repo.url)
				})
				.catch(() => {
					return Promise.reject(
						new Error(`${repo} not exits. Check package name`)
					)
				})
	}))

	return new Listr(tasks)
}

module.exports = repos => {
	if (!Array.isArray(repos)) {
		return Promise.reject(new TypeError('Expected a array'))
	}

	const tasks = new Listr([
		{
			title: 'Install package repository',
			task: () => ghqTasks(repos)
		}
	])

	return tasks.run()
}
