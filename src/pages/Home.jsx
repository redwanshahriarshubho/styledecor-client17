import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function Home() {
  const [services, setServices] = useState([]);
  const [decorators, setDecorators] = useState([]);

  useEffect(() => {
    apiClient.get("/api/services?limit=6").then(res => {
      setServices(res.data.services || []);
    });

    apiClient.get("/api/decorators/top?limit=6").then(res => {
      setDecorators(res.data || []);
    });
  }, []);

  return (
    <div>
      <h1>Top Services</h1>
      {services.map(s => (
        <p key={s._id}>{s.name}</p>
      ))}

      <h1>Top Decorators</h1>
      {decorators.map(d => (
        <p key={d._id}>{d.name}</p>
      ))}
    </div>
  );
}
