import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

const BookAppointment = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorId, setDoctorId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [patientId, setPatientId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await axiosClient.get("/doctors");
      setDoctors(res.data);
    })();
    // if user data available in localStorage you can prefill patientId
    const user = localStorage.getItem("user");
    if (user) setPatientId(JSON.parse(user)._id);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosClient.post("/appointments", { patientId, doctorId, scheduledAt });
      alert("Appointment booked");
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Book Appointment</h2>
      <label>Doctor</label>
      <select value={doctorId} onChange={e => setDoctorId(e.target.value)}>
        <option value="">Select a doctor</option>
        {doctors.map(d => (
          <option key={d._id} value={d._id}>
            {d.userId?.name} — {d.specialization}
          </option>
        ))}
      </select>

      <label>When</label>
      <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} />

      <label>Patient ID</label>
      <input value={patientId} onChange={e => setPatientId(e.target.value)} placeholder="Your user id" />

      <button type="submit">Book</button>
    </form>
  );
};

export default BookAppointment;
