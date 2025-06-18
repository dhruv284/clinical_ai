import React, { useEffect, useState } from "react";
import { fetchAppointments } from "../api";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 5;

  useEffect(() => {
    fetchAppointments()
      .then(data => setAppointments(data))
      .catch(err => console.error("Error:", err));
  }, []);

  // Filter appointments based on search input
  const filteredAppointments = appointments.filter(appt =>
    appt.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
    appt.doctor?.toLowerCase().includes(search.toLowerCase()) ||
    appt.symptoms?.toLowerCase().includes(search.toLowerCase()) ||
    appt.status?.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Appointments</h2>

      <input
        type="text"
        placeholder="Search by name, doctor, symptoms, status..."
        className="form-control my-3"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }}
      />

      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Patient</th>
            <th>Age</th>
            <th>Symptoms</th>
            <th>Specialist</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentAppointments.length > 0 ? (
            currentAppointments.map(appt => (
              <tr key={appt.id}>
                <td>{appt.id}</td>
                <td>{appt.patient_name}</td>
                <td>{appt.age}</td>
                <td>{appt.symptoms}</td>
                <td>{appt.specialist}</td>
                <td>{appt.doctor}</td>
                <td>{appt.date}</td>
                <td>{appt.time}</td>
                <td>{appt.status}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="9" className="text-center">No appointments found</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-outline-primary mx-1"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`btn mx-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="btn btn-outline-primary mx-1"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Appointments;
