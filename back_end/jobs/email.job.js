const transporter = require("../utils/mailer");

module.exports = (agenda) => {
  agenda.define("sendEmployeeEmail", async (job, done) => {
    const { email, subject, html } = job.attrs.data;

    try {
      await transporter.sendMail({
        from: `"HR Team" <${process.env.FROM_EMAIL}>`,
        to: email,
        subject,
        html,
      });

      console.log("✅ Email sent to:", email);
      done();
    } catch (err) {
      console.error("❌ Email failed:", err);
      done(err);
    }
  });
};
