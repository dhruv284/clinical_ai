import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDoctorAppointments, updateAppointmentStatus } from "../api";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [doctorId, setDoctorId] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!userId || !token) {
      navigate('/login');
      return;
    }

    setDoctorId(userId);
    if (user?.full_name) {
      setDoctorName(user.full_name);
    }

    fetchData(userId);
  }, []);

  const fetchData = async (id) => {
    try {
      const data = await fetchDoctorAppointments(id);
      setAppointments(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lower = searchName.toLowerCase();
    const filteredData = appointments.filter(appt =>
      (!searchName || appt.patient_name.toLowerCase().includes(lower)) &&
      (!filterStatus || appt.status === filterStatus) &&
      (!filterDate || appt.date === filterDate)
    );
    setFiltered(filteredData);
    setCurrentPage(1); // reset to first page when filter changes
  }, [searchName, filterStatus, filterDate, appointments]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      fetchData(doctorId); // refresh list
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginatedData = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="container mt-4">
      <h2>Welcome, Dr. {doctorName || "User"} 👨‍⚕️</h2>
      <hr />

      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by patient name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Filter by status</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading appointments...</p>
      ) : filtered.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <>
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Age</th>
                <th>Symptoms</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.patient_name}</td>
                  <td>{a.age}</td>
                  <td>{a.symptoms}</td>
                  <td>{a.date}</td>
                  <td>{formatTime(a.start_time)} - {formatTime(a.end_time)}</td>

                  <td>{a.status}</td>
                  <td>
                    {a.status === "pending" && (
                      <>
                        <button className="btn btn-success btn-sm mx-1" onClick={() => handleStatusUpdate(a.id, "confirmed")}>Accept</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleStatusUpdate(a.id, "rejected")}>Reject</button>
                      </>
                    )}
                    {a.status === "confirmed" && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleStatusUpdate(a.id, "completed")}>Mark Completed</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-center">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default DoctorDashboard;
