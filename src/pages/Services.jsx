import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    apiClient
      .get("/api/services")
      .then((res) => setServices(res.data.services || []));
  }, []);

  return (
    <div>
      <h1>All Services</h1>
      {services.map(service => (
        <div key={service._id}>
          <h3>{service.name}</h3>
          <p>{service.price}</p>
        </div>
      ))}
    </div>
  );
}
