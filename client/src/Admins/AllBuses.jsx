import axios from "axios";
import React, { useEffect, useState } from "react";
import "./AllBuses.css";

const initialFormState = {
  travelname: "",
  description: "",
  bus_no: "",
  bus_type: "Seater",
  capacity: "",
  contact_number: "",
  alternative_no: "",
  driver_name: "",
  from: "",
  to: "",
  departure_time: "",
  arrival_time: "",
  duration: "",
  fare: ""
};

const AllBuses = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [buses, setBuses] = useState([]);
  const [dailyRuns, setDailyRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBus, setEditingBus] = useState(null);
  const [runDate, setRunDate] = useState("");
  const [formData, setFormData] = useState(initialFormState);

  const API = "http://localhost:3000/admin";

  
  // ================= FETCH =================
  const fetchBuses = async () => {
    const res = await axios.get(`${API}/all-buses`);
    setBuses(res.data.buses || []);
  };

  const fetchDailyRuns = async () => {
    const res = await axios.get(`${API}/daily-running`);
    setDailyRuns(res.data.buses || []);
  };

  useEffect(() => {
    Promise.all([fetchBuses(), fetchDailyRuns()]).finally(() =>
      setLoading(false)
    );
  }, []);

  // ================= HELPERS =================
  const isScheduled = (busId) =>
    dailyRuns.some(
      (d) =>
        d.busId?._id === busId &&
        new Date(d.runDate).toDateString() ===
          new Date(runDate).toDateString()
    );

  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival) return "";

    const [dh, dm] = departure.split(":").map(Number);
    const [ah, am] = arrival.split(":").map(Number);

    let depMin = dh * 60 + dm;
    let arrMin = ah * 60 + am;

    // overnight handling
    if (arrMin < depMin) arrMin += 24 * 60;

    return ((arrMin - depMin) / 60).toFixed(2);
  };

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
  //   if(!initialFormState.duration){
  //   alert("Please fill departure and arrival time to calculate duration");
  // }
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "departure_time" || name === "arrival_time") {
        updated.duration = calculateDuration(
          updated.departure_time,
          updated.arrival_time
        );
      }
      return updated;
    });
  };

  const resetForm = () => setFormData(initialFormState);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBus) {
        await axios.put(`${API}/edit-bus/${editingBus._id}`, formData);
        alert("Bus updated successfully");
      } else {
        await axios.post(`${API}/add-newbus`, formData);
        alert("Bus added successfully");
      }
      resetForm();
      setEditingBus(null);
      setActiveTab("all");
      fetchBuses();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting bus");
    }
  };

  // ================= EDIT / DELETE =================
  const handleEdit = (bus) => {
    setEditingBus(bus);
    setFormData({ ...initialFormState, ...bus });
    setActiveTab("registerbus");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bus?")) return;
    await axios.delete(`${API}/delete-bus/${id}`);
    fetchBuses();
  };

  // ================= ALLOW RUN =================
  // const allowRun = async (busId) => {
  //   if (!runDate) return alert("Please select a date");
  //   try {
  //     await axios.post(`${API}/allowrun`, { busId, runDate });
  //     fetchDailyRuns();
  //     alert("Bus scheduled");
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Already scheduled");
  //   }
  // };
  const allowRun = async (busId) => {
  if (!runDate) return alert("Please select a date");

  // ✅ FORCE LOCAL DATE (CRITICAL FIX)
  const normalizedDate = new Date(runDate + "T00:00:00");

  console.log("🟢 Admin scheduling bus:", {
    busId,
    runDate: normalizedDate
  });

  try {
    await axios.post(`${API}/allowrun`, {
      busId,
      runDate: normalizedDate,
    });

    fetchDailyRuns();
    alert("Bus scheduled successfully");
  } catch (err) {
    alert(err.response?.data?.message || "Already scheduled");
  }
};

  return (
    <div className="bus-container">
      {/* ================= TABS ================= */}
      <div className="bus-operations">
        <button className={activeTab === "all" ? "active-tab" : ""} onClick={() => setActiveTab("all")}>
          All Buses
        </button>
        <button className={activeTab === "registerbus" ? "active-tab" : ""} onClick={() => { resetForm(); setEditingBus(null); setActiveTab("registerbus"); }}>
          Register Bus
        </button>
        <button className={activeTab === "daily" ? "active-tab" : ""} onClick={() => setActiveTab("daily")}>
          Daily Running Buses
        </button>
      </div>

      {/* ================= ALL BUSES ================= */}
      {activeTab === "all" && (
        <div className="allbustabs">
          {loading ? <p>Loading...</p> : (
            <table>
              <thead>
                <tr>
                  <th>Travel</th>
                  <th>Bus No</th>
                  <th>Type</th>
                  <th>Route</th>
                  <th>Duration</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((b) => (
                  <tr key={b._id}>
                    <td>{b.travelname}</td>
                    <td>{b.bus_no}</td>
                    <td>{b.bus_type}</td>
                    <td>{b.from} → {b.to}</td>
                    <td>{b.duration} hrs</td>
                    <td><button onClick={() => handleEdit(b)}>Edit</button></td>
                    <td><button onClick={() => handleDelete(b._id)}>Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ================= REGISTER BUS ================= */}
      {activeTab === "registerbus" && (
        <div className="addbustabs">
          <h2>{editingBus ? "Edit Bus" : "Add New Bus"}</h2>

          <form onSubmit={handleSubmit} className="add-bus-form">
            {Object.keys(initialFormState).map((key) =>
              key === "bus_type" ? null : key.includes("time") ? (
                <div key={key} className="form-group">
                  <label>{key.replace("_", " ").toUpperCase()}</label>
                  <input type="time" name={key} value={formData[key]} onChange={handleChange} />
                </div>
              ) : (
                <input
                  key={key}
                  type={["bus_no", "capacity", "fare", "duration"].includes(key) ? "number" : "text"}
                  name={key}
                  placeholder={key.replace("_", " ").toUpperCase()}
                  value={formData[key]}
                  onChange={handleChange}
                />
              )
            )}
            <select name="bus_type" value={formData.bus_type} onChange={handleChange}>
              <option value="AC">AC</option>
              <option value="Sleeper">Sleeper</option>
              <option value="Seater">Seater</option>
            </select>
            <button type="submit">{editingBus ? "Update Bus" : "Add Bus"}</button>
          </form>
        </div>
      )}

      {/* ================= DAILY RUNNING BUSES ================= */}
      {activeTab === "daily" && (
        <div className="addbustabs">
          <h2>Daily Schedule</h2>

          <input type="date" value={runDate} onChange={(e) => setRunDate(e.target.value)} />

          <table className="bus-table">
            <thead>
              <tr>
                <th>Travel</th>
                <th>Bus No</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((b) => {
                const scheduled = runDate && isScheduled(b._id);
                return (
                  <tr key={b._id}>
                    <td>{b.travelname}</td>
                    <td>{b.bus_no}</td>
                    <td>
                      {scheduled ? (
                        <span className="badge green">🟢 Scheduled</span>
                      ) : (
                        <span className="badge red">🔴 Not Scheduled</span>
                      )}
                    </td>
                    <td>
                      <button disabled={scheduled} onClick={() => allowRun(b._id)}>
                        {scheduled ? "Scheduled" : "Allow Run"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBuses;
