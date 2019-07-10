module.exports = gate;

function gate(req, res, next) {
  const password = req.headers.password;

  if (password && password === 'test') {
    next();
  } else {
    next('Password incorrect'); // go to next error handling middleware
  }
}
