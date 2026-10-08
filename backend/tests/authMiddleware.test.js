const test = require('node:test');
const assert = require('node:assert/strict');
const { roleMiddleware } = require('../middleware/auth');
const { getJwtSecret } = require('../config/jwt');

test('getJwtSecret requires configured secret and returns it', () => {
  const originalSecret = process.env.JWT_SECRET;

  try {
    delete process.env.JWT_SECRET;
    assert.throws(() => getJwtSecret(), /JWT_SECRET must be configured/);

    process.env.JWT_SECRET = 'test-only-jwt-secret';
    assert.equal(getJwtSecret(), 'test-only-jwt-secret');
  } finally {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  }
});

function createReq(user) {
  return { user };
}

function createRes() {
  const res = {};
  res.statusCode = 200;
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (body) => body;
  return res;
}

test('roleMiddleware allows the matching role', () => {
  const req = createReq({ role: 'mentor' });
  const res = createRes();
  let called = false;
  const next = () => { called = true; };

  roleMiddleware('mentor', 'supervisor')(req, res, next);

  assert.equal(called, true);
  assert.equal(res.statusCode, 200);
});

test('roleMiddleware blocks the wrong role', () => {
  const req = createReq({ role: 'student' });
  const res = createRes();
  let called = false;
  const next = () => { called = true; };

  roleMiddleware('mentor', 'supervisor')(req, res, next);

  assert.equal(called, false);
  assert.equal(res.statusCode, 403);
});
