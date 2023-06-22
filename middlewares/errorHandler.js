export function errorHandler(err, req, res, next) {
  if (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  } else next();
}
