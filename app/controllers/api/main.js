module.exports = {
  onLost(req, res) {
      res.status(404).json({
          status: "failed",
          message: "Route not found!",
      });
  },

  onParseError(err, req, res, next) {
      if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
          console.error(err);
          return res.status(400).send({ status: "error", message: err.message });
      }
      next();
  },

  onError(err, req, res, next) {
      res.status(err.status || 500).json({
          status: "error",
          message: err.message || err
      });
  },
};
