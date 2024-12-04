import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

function FamilyList() {
  const [families, setFamilies] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axiosInstance.get('/families')
      .then(response => {
        setFamilies(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleSearch = () => {
    axiosInstance.get(`/families/search?ssn=${query}`)
      .then(response => {
        setFamilies(response.data);
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
      <table>
        <thead>
          <tr>
            <th>Family Member Name</th>
            <th>Relationship</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {families.map(family => (
            <tr key={family.ssn}>
              <td>{family.name}</td>
              <td>{family.relationship}</td>
              <td>{family.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FamilyList;
