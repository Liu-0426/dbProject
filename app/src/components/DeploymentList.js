import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

function DeploymentList() {
  const [deployments, setDeployments] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axiosInstance.get('/deployments')
      .then(response => {
        setDeployments(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleSearch = () => {
    axiosInstance.get(`/deployments/search?country=${query}`)
      .then(response => {
        setDeployments(response.data);
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
          placeholder="Search by Country"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Country</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map(deployment => (
            <tr key={deployment.id}>
              <td>{deployment.employeeName}</td>
              <td>{deployment.country}</td>
              <td>{deployment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DeploymentList;
