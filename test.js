import test from 'ava'
import fn from './'

test('throws', async t => {
	try {
		await fn('co')
	} catch (err) {
		t.is(err.message, 'Expected a array')
	}
})

test('not exist', async t => {
	try {
		await fn(['@akameco/not-exist'])
	} catch (err) {
		t.is(err.message, '@akameco/not-exist not exits. Check package name')
	}
})
