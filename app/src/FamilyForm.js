import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const FamilyForm = () => {
  const [familyData, setFamilyData] = useState([]);
  const [newFamily, setNewFamily] = useState({
    id: '',
    relativeId: '',
    relativeName: '',
    age: '',
    relativeGender: '',
    relationship: '',
    status: '正常',
  });
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [stats, setStats] = useState({
    averageAge: 0,
    averageAgeMale: 0,
    averageAgeFemale: 0,
    totalMale: 0,
    totalFemale: 0,
  });

  // 獲取所有眷屬資料並計算統計數據
  useEffect(() => {
    axios
      .get('http://140.128.102.234:4777/api/employeeRelative/enumerate')
      .then((response) => {
        setFamilyData(response.data);

        // 計算統計數據
        const totalAge = response.data.reduce((sum, family) => sum + Number(family.age), 0);
        const totalMaleAge = response.data.filter((family) => family.relativeGender === 'M').reduce((sum, family) => sum + Number(family.age), 0);
        const totalFemaleAge = response.data.filter((family) => family.relativeGender === 'F').reduce((sum, family) => sum + Number(family.age), 0);

        const totalMale = response.data.filter((family) => family.relativeGender === 'M').length;
        const totalFemale = response.data.filter((family) => family.relativeGender === 'F').length;

        setStats({
          averageAge: totalAge / response.data.length || 0,
          averageAgeMale: totalMale > 0 ? totalMaleAge / totalMale : 0,
          averageAgeFemale: totalFemale > 0 ? totalFemaleAge / totalFemale : 0,
          totalMale,
          totalFemale,
        });
      })
      .catch((error) => {
        console.error('Error fetching family data:', error);
      });
  }, []);

  // 查詢功能
  const handleSearch = () => {
    if (!searchId) {
      setSearchResult(null);
      return;
    }

    axios
      .get(`http://172.24.8.156:4777/relatives/search/${searchId}`)
      .then((response) => {
        setSearchResult(response.data || null);
      })
      .catch((error) => {
        console.error('Error searching family data:', error);
        setSearchResult(null);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamily({
      ...newFamily,
      [name]: value,
    });
  };

  const handleAddFamily = () => {
    axios
      .post('http://172.24.8.156:9998/relatives/create', newFamily)
      .then((response) => {
        setFamilyData([...familyData, response.data]);
        setNewFamily({
          id: '',
          relativeId: '',
          relativeName: '',
          age: '',
          relativeGender: '',
          relationship: '',
          status: '正常',
        });
      })
      .catch((error) => {
        console.error('Error adding family member:', error);
      });
  };

  const handleDeleteFamily = (relativeId) => {
    axios
      .put(`http://172.24.8.156:9998/relatives/delete/${relativeId}`, { status: '刪除' })
      .then(() => {
        setFamilyData(
          familyData.map((family) =>
            family.relativeId === relativeId ? { ...family, status: '刪除' } : family
          )
        );
      })
      .catch((error) => {
        console.error('Error deleting family member:', error);
      });
  };

  const handleEditFamily = (relativeId) => {
    const family = familyData.find((fam) => fam.relativeId === relativeId);
    setNewFamily(family);
  };

  return (
    <div className="container">
      <h2>眷屬資料</h2>

      {/* 查詢眷屬資料 */}
      <div className="search-family">
        <h3>查詢眷屬資料</h3>
        <input
          type="text"
          placeholder="輸入員工或眷屬ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          查詢
        </button>

        {searchResult && (
          <div className="search-result">
            <h4>查詢結果：</h4>
            <p>員工ID: {searchResult.id}</p>
            <p>眷屬ID: {searchResult.relativeId}</p>
            <p>姓名: {searchResult.relativeName}</p>
            <p>性別: {searchResult.relativeGender}</p>
            <p>年齡: {searchResult.age}</p>
            <p>關係: {searchResult.relationship}</p>
            <p>狀態: {searchResult.status}</p>
          </div>
        )}

        {searchResult === null && <p>查無此資料。</p>}
      </div>

      {/* 統計資料 */}
      <div className="family-stats">
        <h3>眷屬統計</h3>
        <p>平均年齡: {stats.averageAge.toFixed(2)} 歲</p>
        <p>男眷屬平均年齡: {stats.averageAgeMale.toFixed(2)} 歲</p>
        <p>女眷屬平均年齡: {stats.averageAgeFemale.toFixed(2)} 歲</p>
        <p>男眷屬人數: {stats.totalMale}</p>
        <p>女眷屬人數: {stats.totalFemale}</p>
      </div>

      {/* 新增眷屬 */}
      <form>
        <input
          type="text"
          name="id"
          value={newFamily.id}
          onChange={handleInputChange}
          placeholder="員工ID"
        />
        <input
          type="text"
          name="relativeId"
          value={newFamily.relativeId}
          onChange={handleInputChange}
          placeholder="眷屬ID"
        />
        <input
          type="text"
          name="relativeName"
          value={newFamily.relativeName}
          onChange={handleInputChange}
          placeholder="姓名"
        />
        <input
          type="number"
          name="age"
          value={newFamily.age}
          onChange={handleInputChange}
          placeholder="年齡"
        />
        <input
          type="text"
          name="relativeGender"
          value={newFamily.relativeGender}
          onChange={handleInputChange}
          placeholder="性別 (M/F)"
        />
        <input
          type="text"
          name="relationship"
          value={newFamily.relationship}
          onChange={handleInputChange}
          placeholder="關係"
        />
        <button type="button" onClick={handleAddFamily}>
          新增
        </button>
      </form>

      {/* 列表 */}
      <div className="family-list">
        <h3>眷屬列表</h3>
        {familyData.map((family) => (
          <div key={family.relativeId}>
            <p>員工ID: {family.id}</p>
            <p>眷屬ID: {family.relativeId}</p>
            <p>姓名: {family.relativeName}</p>
            <p>性別: {family.relativeGender}</p>
            <p>年齡: {family.age}</p>
            <p>關係: {family.relationship}</p>
            <p>狀態: {family.status}</p>
            <button onClick={() => handleEditFamily(family.relativeId)}>編輯</button>
            <button onClick={() => handleDeleteFamily(family.relativeId)}>刪除</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyForm;
