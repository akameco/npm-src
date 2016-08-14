import test from 'ava';
import fn from './';

test('throws', async t => {
	t.throws(fn('co'), /Expected a array/);
});

test('not exist', async t => {
	t.throws(fn(['@akameco/not-exist']), /not exits. Check package name/);
});
