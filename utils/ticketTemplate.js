exports.generateTicketMessage = (booking, bus) => `
🎟️ *BUS TICKET CONFIRMED*

🚌 Bus: ${bus.travelname}
📍 Route: ${bus.from} → ${bus.to}
📅 Date: ${new Date(booking.travelDate).toDateString()}
💺 Seats: ${booking.seats.join(", ")}
💰 Amount: ₹${booking.totalFare}

📞 Driver: ${bus.driver_name}
📲 Contact: ${bus.contact_number}

🆔 Order ID: ${booking.orderId}

✨ Happy Journey!
`;
