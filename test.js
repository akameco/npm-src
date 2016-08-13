import test from 'ava';
import execa from 'execa';
import fn from './';

const runGhqGet = repo => execa('ghq', ['get', '-p', repo]);

test.before(async () => {
	await runGhqGet('tj/co');
});

test('ghq install', async t => {
	t.regex(await fn(['co']), /exists/);
});

test('throws', async t => {
	t.throws(fn('co'), /Expected a array/);
});
