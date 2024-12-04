import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

function EmployeeForm() {
  const [employee, setEmployee] = useState({
    name: '',
    ssn: '',
    age: '',
    salary: '',
  });
  const navigate = useNavigate(); // Updated hook
  const { ssn } = useParams();

  useEffect(() => {
    if (ssn) {
      // Fetch existing employee data for editing
      axiosInstance.get(`/employees/${ssn}`)
        .then(response => {
          setEmployee(response.data);
        })
        .catch(error => console.error(error));
    }
  }, [ssn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({
      ...employee,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ssn) {
      // Update existing employee
      axiosInstance.put(`/employees/${ssn}`, employee)
        .then(() => navigate('/employees'))  // Use navigate instead of history.push
        .catch(error => console.error(error));
    } else {
      // Add new employee
      axiosInstance.post('/employees', employee)
        .then(() => navigate('/employees'))  // Use navigate instead of history.push
        .catch(error => console.error(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={employee.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>SSN:</label>
        <input
          type="text"
          name="ssn"
          value={employee.ssn}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={employee.age}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Salary:</label>
        <input
          type="number"
          name="salary"
          value={employee.salary}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default EmployeeForm;
