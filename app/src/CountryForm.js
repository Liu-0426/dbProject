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
  const [searchCode1, setSearchCode1] = useState('');
  const [statistics, setStatistics] = useState(null); // 用於儲存統計數據

  // 獲取國家資料
  useEffect(() => {
    axios
      .get('http://140.128.102.234:4777/api/country/enumerate')
      .then((response) => {
        if (response.data && response.data.code === 200) {
          const parsedData = response.data.data.map((item) => {
            const country = JSON.parse(item);
            return {
              code: country.id || '',
              name: country.name || '',
              status: country.status || '正常',
              continent: country.continent || '',
              leadershipName: country.leadershipName || '',
              affairsName: country.affairsName || '',
              contactName: country.contactName || '',
              population: country.population || '',
              territorialArea: country.territorialArea || '',
              contact: country.contact || '',
              isDiploma: country.isDiploma || false,
            };
          });
          setCountryData(parsedData);
        } else {
          console.error('Unexpected response structure', response.data);
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the country data!', error);
      });
  }, []);

  // 獲取統計數據
  useEffect(() => {
    axios
      .get('http://140.128.102.234:4777/api/country/statistics')
      .then((response) => {
        setStatistics(response.data); // 儲存統計數據
      })
      .catch((error) => {
        console.error('There was an error fetching the statistics!', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCountry({
      ...newCountry,
      [name]: value,
    });
  };

  const handleAddCountry = () => {
    const newCountryData = {
      id: newCountry.code,
      name: newCountry.name,
      continent: newCountry.continent,
      leadershipName: newCountry.leadershipName,
      affairsName: newCountry.affairsName,
      contactName: newCountry.contactName,
      population: newCountry.population,
      territorialArea: newCountry.territorialArea,
      contact: newCountry.contact,
      isDiploma: false,
    };

    axios
      .post('http://140.128.102.234:4777/api/country/create', newCountryData)
      .then((response) => {
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
      .catch((error) => {
        console.error('There was an error adding the country!', error);
      });
  };

  const handlePrint = () => {
    const printContent = document.getElementById('print-section').innerHTML;
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write('<html><head><title>列印查詢結果</title></head><body>');
    newWindow.document.write(printContent);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
  };

  const handleDeleteCountry = (code) => {
    axios
      .delete(`http://140.128.102.234:4777/api/country/remove/${code}`, { status: '刪除' })
      .then(() => {
        setCountryData(countryData.map((country) =>
          country.code === code ? { ...country, status: '刪除' } : country
        ));
      })
      .catch((error) => {
        console.error('There was an error deleting the country!', error);
      });
  };

  const handleEditCountry = (code) => {
    const country = countryData.find((country) => country.code === code);
    setNewCountry(country);
  };

  const [searchCode, setSearchCode] = useState(''); // 管理輸入框中的國家代碼
  const [searchResult, setSearchResult] = useState(null); // 存放查詢結果
  const handleSearch = () => {
    axios
      .get(`http://140.128.102.234:4777/api/country/query/${searchCode}`)
      .then((response) => {
        setSearchResult(response.data || null); // 如果後端返回空資料，則設定為 null
      })
      .catch((error) => {
        console.error('There was an error fetching the country data!', error);
        setSearchResult(null); // 若發生錯誤，設為 null 表示無資料
      });
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
          value={newCountry.territorialArea}
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
        <select
          name="isDiploma"
          value={newCountry.isDiploma || false}
          onChange={(e) =>
            setNewCountry({ ...newCountry, isDiploma: e.target.value === 'true' })
          }
        >
          <option value="false">非外交國家</option>
          <option value="true">外交國家</option>
        </select>

        <button type="button" onClick={handleAddCountry}>
          新增國家
        </button>
      </form>

      <div>
        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
          placeholder="搜尋國家代碼"
        />
        <button type="button" onClick={handleSearch}>
          查詢國家
        </button>
        <button type="button" onClick={handlePrint}>
          列印查詢結果
        </button>
        {searchResult && (
          <div>
            <h3>查詢結果</h3>
            <p>國家代碼: {searchResult.code}</p>
            <p>國家名稱: {searchResult.name}</p>
            <p>狀態: {searchResult.status}</p>
            <p>所屬洲名: {searchResult.continent}</p>
            <p>元首姓名: {searchResult.leadershipName}</p>
            <p>外交部長姓名: {searchResult.affairsName}</p>
            <p>聯絡人姓名: {searchResult.contactName}</p>
            <p>人口數: {searchResult.population}</p>
            <p>國土面積: {searchResult.territorialArea}</p>
            <p>聯絡電話: {searchResult.contact}</p>
            <p>是否有外交: {searchResult.isDiploma ? '是' : '否'}</p>
          </div>
        )}
      </div>

      {/* 國家列表 */}
      <div id="print-section">
        <h3>國家列表</h3>
        {countryData.length > 0 ? (
          countryData.map((country) => (
            <div key={country.code}>
              <p>國家代碼: {country.code}</p>
              <p>國家名稱: {country.name}</p>
              <p>狀態: {country.status}</p>
              <p>所屬洲名: {country.continent}</p>
              <p>元首姓名: {country.leadershipName}</p>
              <p>外交部長姓名: {country.affairsName}</p>
              <p>聯絡人姓名: {country.contactName}</p>
              <p>人口數: {country.population}</p>
              <p>國土面積: {country.territorialArea}</p>
              <p>聯絡電話: {country.contact}</p>
              <p>是否有外交: {country.isDiploma ? '是' : '否'}</p>
              <button className="edit" onClick={() => handleEditCountry(country.id)}>編輯</button>
          <button className="delete" onClick={() => handleDeleteCountry(country.code)}>刪除</button>
            </div>
          ))
        ) : (
          <p>目前沒有國家資料。</p>
        )}
      </div>

      {/* 統計數據 */}
      {statistics && (
        <div>
          <h3>統計數據</h3>
          <p>外交國家數量: {statistics.diplomatic_country}</p>
          <p>非外交國家數量: {statistics.non_diplomatic_country}</p>
          <p>外交國家總人口: {statistics.total_diploma_citizens}</p>
          <p>非外交國家總人口: {statistics.total_non_diploma_citizens}</p>
          {statistics.diplomatic_continents &&
            Object.entries(statistics.diplomatic_continents).map(([continent, data]) => (
              <div key={continent}>
                <p>洲名: {continent}</p>
                <p>外交國家數: {data.diplomatic}</p>
                <p>非外交國家數: {data.not_diplomatic}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CountryForm;
