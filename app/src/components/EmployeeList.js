import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import { Link } from 'react-router-dom';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    // 獲取員工資料
    axiosInstance.get('/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleSearch = () => {
    axiosInstance.get(`/employees/search?ssn=${query}`)
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error(error));
  };

  const handleDelete = (ssn) => {
    axiosInstance.put(`/employees/${ssn}/delete`)
      .then(() => {
        // 刪除後重新載入資料
        setEmployees(employees.filter(employee => employee.ssn !== ssn));
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by SSN"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <Link to="/employees/add">Add Employee</Link>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>SSN</th>
            <th>Age</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.ssn}>
              <td>{employee.name}</td>
              <td>{employee.ssn}</td>
              <td>{employee.age}</td>
              <td>{employee.salary}</td>
              <td>
                <Link to={`/employees/edit/${employee.ssn}`}>Edit</Link>
                <button onClick={() => handleDelete(employee.ssn)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
