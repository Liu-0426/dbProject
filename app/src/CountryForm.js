import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CountryForm = () => {
  const [countryData, setCountryData] = useState([]);
  const [newCountry, setNewCountry] = useState({
    code: '',
    name: '',
    status: '正常',
    continent: '',
    leadershipName: '',
    affairsName: '',
    contactName: '',
    population: '',
    territorialArea: '',
    contact: '',
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
    const newCountryData = {
      code: newCountry.code,
      name: newCountry.name,
      status: newCountry.status,
      continent: newCountry.continent,
      leadershipName: newCountry.leadershipName,
      affairsName: newCountry.affairsName,
      contactName: newCountry.contactName,
      population: newCountry.population,
      territorialArea: newCountry.territorialArea,
      contact: newCountry.contact,
    };
    axios.post('http://172.24.8.156:9998/api/countries', newCountryData)
    .then(response => {
      setCountryData([...countryData, response.data]);
      setNewCountry({
        code: '',
        name: '',
        status: '正常',
        continent: '',
        leadershipName: '',
        affairsName: '',
        contactName: '',
        population: '',
        territorialArea: '',
        contact: '',
      });
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
        <input
          type="text"
          name="continent"
          value={newCountry.continent}
          onChange={handleInputChange}
          placeholder="所屬洲名"
        />

        <input
          type="text"
          name="leadershipName"
          value={newCountry.leadershipName}  
          onChange={handleInputChange}  
          placeholder="元首姓名"  
        />  

        <input
          type="text"
          name="affairsName"
          value={newCountry.affairsName}  
          onChange={handleInputChange}  
          placeholder="外交部長姓名"  
        />  

        <input
          type="text"
          name="contactName"
          value={newCountry.contactName}  
          onChange={handleInputChange}  
          placeholder="聯絡人姓名"  
        />  

        <input
          type="text"
          name="population"
          value={newCountry.population}  
          onChange={handleInputChange}  
          placeholder="人口數"  
        />  

        <input
          type="text"
          name="territorialArea"
          value={newCountry.area}  
          onChange={handleInputChange}  
          placeholder="國土面積"  
        />

        <input
          type="text"
          name="contact"
          value={newCountry.contact}
          onChange={handleInputChange}
          placeholder="聯絡電話"
        />  

        <input
          type="text"
          name="isDiploma"
          value={newCountry.isDiploma}
          onChange={handleInputChange}
          placeholder="是否為邦交國 ( 請輸入是/否 )"
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
