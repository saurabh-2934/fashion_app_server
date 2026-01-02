const http = require("http");
const app = require("./app");
const { sequelize } = require("./models");

require("dotenv").config();

const port = process.env.PORT;

const server = http.createServer(app);

sequelize
  .authenticate()
  .then(() => console.log("✅ Connected to Railway MySQL"))
  .catch((err) => console.error("❌ DB Error:", err));

server.listen(port, "0.0.0.0", () => {
  console.log("Server running on all networks");
});
