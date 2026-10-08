function getJwtSecret() {
  const secret = (process.env.JWT_SECRET || '').trim();
  if (!secret) {
    throw new Error('JWT_SECRET must be configured in backend/.env');
  }
  return secret;
}

module.exports = { getJwtSecret };