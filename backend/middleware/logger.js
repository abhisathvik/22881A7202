module.exports = (req, res, next) => {
  const logEntry = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    body: req.body
  };

  console.log("[Custom Logger]", JSON.stringify(logEntry));
  next();
};
