import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ IMPORTANT
import "./MyBookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("https://travel-backend-83lh.onrender.com/api/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setBookings(res.data.bookings))
      .catch((err) => console.error(err));
  }, [token]);

  if (!token) return <p>Please login to see bookings</p>;

  // ✅ PDF DOWNLOAD FUNCTION (FIXED)
  const downloadPDF = (b) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("BUS TICKET CONFIRMATION", 14, 20);

  doc.setFontSize(12);
  doc.text(`Order ID: ${b.orderId}`, 14, 30);
  doc.text("Status: CONFIRMED", 14, 38);

  autoTable(doc, {
    startY: 45,
    head: [["Field", "Details"]],
    body: [
      ["Bus Name", b.busId.travelname],
      ["Route", `${b.busId.from} -> ${b.busId.to}`], // ✅ FIX
      ["Travel Date", new Date(b.travelDate).toDateString()],
      ["Departure Time", b.busId.departure_time],
      ["Arrival Time", b.busId.arrival_time],
      ["Seats", b.seats.join(", ")],
      ["Fare", `Rs. ${b.totalFare}`],               // ✅ FIX
      ["Driver", b.busId.driver_name],
      ["Contact", b.busId.contact_number],
    ],
  });

  doc.text(
    "Happy Journey! Thank you for booking with us.",
    14,
    doc.lastAutoTable.finalY + 15
  );

  doc.save(`Ticket_${b.orderId}.pdf`);
};


  return (
    <div className="my-bookings">
      <h2>🎟️ My Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b) => (
          <div key={b._id} className="ticket-card">
            <h3>{b.busId.travelname}</h3>
            <p>{b.busId.from} → {b.busId.to}</p>
            <p>Date: {new Date(b.travelDate).toDateString()}</p>
            <p>Seats: {b.seats.join(", ")}</p>
            <p>Total Fare: ₹{b.totalFare}</p>

            <button onClick={() => downloadPDF(b)}>
              📄 Download Ticket PDF
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;
