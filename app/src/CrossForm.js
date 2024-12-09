import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const DataIntegration = () => {
  const [country, setCountry] = useState(''); // 用於記錄選擇的國家
  const [continent, setContinent] = useState(''); // 用於記錄選擇的洲
  const [results, setResults] = useState({
    employeesInCountry: 0,
    employeesInContinent: 0,
    averageDependentAge: 0,
    averageDependentCount: 0,
  });

  const handleSearchByCountry = () => {
    axios
      .get(`http://140.128.102.234:8080/api/query/country/${country}`)
      .then((response) => {
        setResults((prev) => ({
          ...prev,
          employeesInCountry: response.data.count || 0,
        }));
      })
      .catch((error) => {
        console.error('查詢國家員工時出錯:', error);
        setResults((prev) => ({ ...prev, employeesInCountry: 0 }));
      });
  };

  const handleSearchByContinent = () => {
    axios
      .get(`http://140.128.102.234:8080/api/query/continent/${continent}`)
      .then((response) => {
        setResults((prev) => ({
          ...prev,
          employeesInContinent: response.data.count || 0,
        }));
      })
      .catch((error) => {
        console.error('查詢洲員工時出錯:', error);
        setResults((prev) => ({ ...prev, employeesInContinent: 0 }));
      });
  };

  const handleAverageDependentAge = () => {
    axios
      .get('http://140.128.102.234:8080/api/query/average-dependent-age')
      .then((response) => {
        setResults((prev) => ({
          ...prev,
          averageDependentAge: response.data.averageAge || 0,
        }));
      })
      .catch((error) => {
        console.error('查詢平均眷屬年齡時出錯:', error);
        setResults((prev) => ({ ...prev, averageDependentAge: 0 }));
      });
  };

  const handleAverageDependentCount = () => {
    axios
      .get('http://140.128.102.234:8080/api/query/average-dependent-count')
      .then((response) => {
        setResults((prev) => ({
          ...prev,
          averageDependentCount: response.data.averageCount || 0,
        }));
      })
      .catch((error) => {
        console.error('查詢平均眷屬人數時出錯:', error);
        setResults((prev) => ({ ...prev, averageDependentCount: 0 }));
      });
  };

  return (
    <div className="container">
      <h2>跨資料表整合介面</h2>

      {/* 查詢某國家 30 歲以上員工人數 */}
      <div className="search-section">
        <h3>查詢某國家 30 歲以上員工人數</h3>
        <input
          type="text"
          placeholder="輸入國家 (例如: 美國)"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        <button type="button" onClick={handleSearchByCountry}>
          查詢
        </button>
        <p>30 歲以上員工人數: {results.employeesInCountry}</p>
      </div>

      {/* 查詢某洲員工總數 */}
      <div className="search-section">
        <h3>查詢某洲員工總數</h3>
        <input
          type="text"
          placeholder="輸入洲 (例如: 歐洲)"
          value={continent}
          onChange={(e) => setContinent(e.target.value)}
        />
        <button type="button" onClick={handleSearchByContinent}>
          查詢
        </button>
        <p>員工總數: {results.employeesInContinent}</p>
      </div>

      {/* 查詢 30 歲以上員工的平均眷屬年齡 */}
      <div className="search-section">
        <h3>查詢 30 歲以上員工的平均眷屬年齡</h3>
        <button type="button" onClick={handleAverageDependentAge}>
          查詢
        </button>
        <p>平均眷屬年齡: {results.averageDependentAge.toFixed(2)} 歲</p>
      </div>

      {/* 查詢 30 歲以上員工的平均眷屬人數 */}
      <div className="search-section">
        <h3>查詢 30 歲以上員工的平均眷屬人數</h3>
        <button type="button" onClick={handleAverageDependentCount}>
          查詢
        </button>
        <p>平均眷屬人數: {results.averageDependentCount.toFixed(2)} 人</p>
      </div>
    </div>
  );
};

export default DataIntegration;
