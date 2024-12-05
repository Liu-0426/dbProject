import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryForm = () => {
  const [countryData, setCountryData] = useState([]);
  const [newCountry, setNewCountry] = useState({
    code: '',
    name: '',
    status: '正常'
  });

  // 獲取國家資料
  useEffect(() => {
    axios.get('http://172.24.8.156:9998/api/countries')  // 假設後端的國家API是這樣的
      .then(response => {
        setCountryData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the country data!', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCountry({
      ...newCountry,
      [name]: value
    });
  };

  const handleAddCountry = () => {
    axios.post('http://172.24.8.156:9998/api/countries', newCountry)
      .then(response => {
        setCountryData([...countryData, response.data]);
        setNewCountry({ code: '', name: '', status: '正常' });
      })
      .catch(error => {
        console.error('There was an error adding the country!', error);
      });
  };

  const handleSearchCountry = (code) => {
    return countryData.filter((country) => country.code === code);
  };

  return (
    <div>
      <h2>國家資料</h2>
      <form>
        <input
          type="text"
          name="code"
          value={newCountry.code}
          onChange={handleInputChange}
          placeholder="國家代碼"
        />
        <input
          type="text"
          name="name"
          value={newCountry.name}
          onChange={handleInputChange}
          placeholder="國家名稱"
        />
        <button type="button" onClick={handleAddCountry}>
          新增國家
        </button>
      </form>

      <div>
        <h3>國家列表</h3>
        {countryData.map((country) => (
          <div key={country.code}>
            <p>國家代碼: {country.code}, 國家名稱: {country.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountryForm;
