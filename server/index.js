const app = require("./app");

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
  });
}

module.exports = app;
