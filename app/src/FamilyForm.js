import React, { useState } from 'react';

const FamilyForm = () => {
  const [familyData, setFamilyData] = useState([]);
  const [newFamily, setNewFamily] = useState({
    employeeId: '',
    familyId: '',
    relationship: '',
    status: '正常'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFamily({
      ...newFamily,
      [name]: value
    });
  };

  const handleAddFamily = () => {
    setFamilyData([...familyData, newFamily]);
    setNewFamily({
      employeeId: '',
      familyId: '',
      relationship: '',
      status: '正常'
    });
  };

  const handleDeleteFamily = (id) => {
    setFamilyData(
      familyData.map((family) =>
        family.familyId === id ? { ...family, status: '離婚' } : family
      )
    );
  };

  return (
    <div>
      <h2>眷屬資料</h2>
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
          name="relationship"
          value={newFamily.relationship}
          onChange={handleInputChange}
          placeholder="與員工關係"
        />
        <button type="button" onClick={handleAddFamily}>
          新增眷屬資料
        </button>
      </form>

      <div>
        <h3>眷屬資料列表</h3>
        {familyData.map((family) => (
          <div key={family.familyId}>
            <p>員工ID: {family.employeeId}, 眷屬ID: {family.familyId}</p>
            <button onClick={() => handleDeleteFamily(family.familyId)}>
              刪除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyForm;
