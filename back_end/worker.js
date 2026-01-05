require("dotenv").config();
const agenda = require("./config/agenda");
require("./jobs/email.job")(agenda);

(async function () {
  await agenda.start();
  console.log("✅ Agenda worker started");
})();
