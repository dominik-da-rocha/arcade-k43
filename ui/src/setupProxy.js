const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log(app);
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:9090",
      changeOrigin: true,
    })
  );
};
