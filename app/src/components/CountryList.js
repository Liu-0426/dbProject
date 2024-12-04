import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

function CountryList() {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axiosInstance.get('/countries')
      .then(response => {
        setCountries(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const handleSearch = () => {
    axiosInstance.get(`/countries/search?code=${query}`)
      .then(response => {
        setCountries(response.data);
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
          placeholder="Search by Country Code"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Country Name</th>
            <th>Country Code</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {countries.map(country => (
            <tr key={country.code}>
              <td>{country.name}</td>
              <td>{country.code}</td>
              <td>{country.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CountryList;
