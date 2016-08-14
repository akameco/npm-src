import test from 'ava';
import fn from './';

test('throws', async t => {
	t.throws(fn('co'), /Expected a array/);
});
