import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

type Doctor = {
  _id: string;
  specialization: string;
  hourlyRate: number;
  userId: { name: string; email: string };
  bio?: string;
};

const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    (async () => {
      const res = await axiosClient.get("/provider");
      setDoctors(res.data);
    })();
  }, []);

  return (
    <div>
      <h2>Doctors</h2>
      <ul>
        {doctors.map(d => (
          <li key={d._id}>
            <h3>{d.userId?.name || "Unknown"}</h3>
            <p>{d.specialization} — Rate: ${d.hourlyRate}/hr</p>
            <p>{d.bio}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Doctors;
