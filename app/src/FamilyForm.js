import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const FamilyForm = () => {
  const [familyData, setFamilyData] = useState([]);
  const [newFamily, setNewFamily] = useState({
    employeeId: '',
    familyId: '',
    familyName: '',
    age: '',
    gender: '',
    relationship: '',
    status: '正常',
  });
  const [searchId, setSearchId] = useState(''); // 查詢的身分證字號
  const [searchResult, setSearchResult] = useState(null); // 查詢結果
  const [stats, setStats] = useState({
    averageAge: 0,
    averageAgeMale: 0,
    averageAgeFemale: 0,
    totalMale: 0,
    totalFemale: 0,
  });

  // 獲取所有眷屬資料並計算統計數據
  useEffect(() => {
    axios.get('http://172.24.8.156:9998/family/get')
      .then(response => {
        setFamilyData(response.data);

        // 計算統計數據
        const totalAge = response.data.reduce((sum, family) => sum + Number(family.age), 0);
        const totalMaleAge = response.data.filter(family => family.gender === 'M').reduce((sum, family) => sum + Number(family.age), 0);
        const totalFemaleAge = response.data.filter(family => family.gender === 'F').reduce((sum, family) => sum + Number(family.age), 0);

        const totalMale = response.data.filter(family => family.gender === 'M').length;
        const totalFemale = response.data.filter(family => family.gender === 'F').length;

        setStats({
          averageAge: totalAge / response.data.length || 0,
          averageAgeMale: totalMale > 0 ? totalMaleAge / totalMale : 0,
          averageAgeFemale: totalFemale > 0 ? totalFemaleAge / totalFemale : 0,
          totalMale,
          totalFemale,
        });
      })
      .catch(error => {
        console.error('There was an error fetching the family data!', error);
      });
  }, []);

  // 查詢功能：根據員工ID或眷屬ID查詢
  const handleSearch = () => {
    // 判斷查詢的是員工ID還是眷屬ID
    if (!searchId) {
      setSearchResult(null);
      return;
    }

    axios.get(`http://172.24.8.156:9998/family/search/${searchId}`)
      .then((response) => {
        setSearchResult(response.data || null); // 若無查詢結果，設為null
      })
      .catch((error) => {
        console.error('There was an error fetching the family data!', error);
        setSearchResult(null); // 若發生錯誤，設為null表示無資料
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamily({
      ...newFamily,
      [name]: value
    });
  };

  const handleAddFamily = () => {
    axios.post('http://172.24.8.156:9998/family/create', newFamily)
      .then(response => {
        setFamilyData([...familyData, response.data]);
        setNewFamily({
          employeeId: '',
          familyId: '',
          familyName: '',
          age: '',
          gender: '',
          relationship: '',
          status: '正常',
        });
      })
      .catch(error => {
        console.error('There was an error adding the family member!', error);
      });
  };

  const handleDeleteFamily = (id) => {
    axios.put(`http://172.24.8.156:9998/family/delete/${id}`, { status: '刪除' })
      .then(() => {
        setFamilyData(familyData.map(family =>
          family.familyId === id ? { ...family, status: '刪除' } : family
        ));
      })
      .catch(error => {
        console.error('There was an error deleting the family member!', error);
      });
  };

  const handleEditFamily = (id) => {
    const family = familyData.find((fam) => fam.familyId === id);
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
          placeholder="輸入員工或眷屬身分證字號"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>查詢</button>

        {searchResult && (
          <div className="search-result">
            <h4>查詢結果：</h4>
            <p>員工ID: {searchResult.employeeId}</p>
            <p>眷屬姓名: {searchResult.familyName}</p>
            <p>關係: {searchResult.relationship}</p>
            <p>性別: {searchResult.gender}</p>
            <p>年齡: {searchResult.age}</p>
            <p>狀態: {searchResult.status}</p>
          </div>
        )}

        {searchResult === null && <p>查無此資料。</p>}
      </div>

      {/* 眷屬統計 */}
      <div className="family-stats">
        <h3>眷屬統計</h3>
        <p>平均眷屬年齡: {stats.averageAge.toFixed(2)} 歲</p>
        <p>男眷屬平均年齡: {stats.averageAgeMale.toFixed(2)} 歲</p>
        <p>女眷屬平均年齡: {stats.averageAgeFemale.toFixed(2)} 歲</p>
        <p>男眷屬人數: {stats.totalMale}</p>
        <p>女眷屬人數: {stats.totalFemale}</p>
      </div>

      {/* 新增眷屬表單 */}
      <form>
        <input
          type="text"
          name="employeeId"
          value={newFamily.employeeId}
          onChange={handleInputChange}
          placeholder="員工ID"
        />
        <input
          type="text"
          name="familyId"
          value={newFamily.familyId}
          onChange={handleInputChange}
          placeholder="眷屬身分證字號"
        />
        <input
          type="text"
          name="familyName"
          value={newFamily.familyName}
          onChange={handleInputChange}
          placeholder="眷屬姓名"
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
          name="gender"
          value={newFamily.gender}
          onChange={handleInputChange}
          placeholder="性別 (M/F)"
          maxLength={1} // 限制輸入1個字元
        />
        <input
          type="text"
          name="relationship"
          value={newFamily.relationship}
          onChange={handleInputChange}
          placeholder="與員工關係"
        />
        <button type="button" onClick={handleAddFamily}>新增眷屬資料</button>
      </form>

      {/* 眷屬列表 */}
      <div className="family-list">
        <h3>眷屬資料列表</h3>
        {familyData.map((family) => (
          <div key={family.familyId} className="family-card">
            <p>員工ID: {family.employeeId}</p>
            <p>眷屬姓名: {family.familyName}</p>
            <p>關係: {family.relationship}</p>
            <p>性別: {family.gender}</p>
            <p>年齡: {family.age}</p>
            <p>狀態: {family.status}</p>
            <button onClick={() => handleEditFamily(family.familyId)}>編輯</button>
            <button onClick={() => handleDeleteFamily(family.familyId)}>刪除</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyForm;
