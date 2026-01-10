const twilio = require("twilio");

// ✅ CREATE CLIENT PROPERLY
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// ✅ SEND WHATSAPP MESSAGE
exports.sendWhatsApp = async (to, message) => {
  if (!to) throw new Error("Phone number missing");

  const formattedTo = to.startsWith("+")
    ? `whatsapp:${to}`
    : `whatsapp:+91${to}`;

  return await client.messages.create({
    body: message,
    from: process.env.TWILIO_WHATSAPP, // whatsapp:+14155238886
    to: formattedTo,
  });
};
