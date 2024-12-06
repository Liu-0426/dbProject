import React, { useState } from 'react';
import EmployeeForm from './EmployeeForm';
import CountryForm from './CountryForm';
import AssignmentForm from './AssignmentForm';
import FamilyForm from './FamilyForm';
import './App.css';

const App = () => {
  const [currentForm, setCurrentForm] = useState('employee'); // 初始顯示員工表單

  // 切換表單顯示
  const handleFormChange = (form) => {
    setCurrentForm(form);
  };

  return (
    <div className="container">
      <h2>員工管理系統</h2>

      {/* 按鈕區域 */}
      <div className="button-group">
        <button className="form-button" onClick={() => handleFormChange('employee')}>員工表單</button>
        <button className="form-button" onClick={() => handleFormChange('country')}>國家表單</button>
        <button className="form-button" onClick={() => handleFormChange('assignment')}>指派表單</button>
        <button className="form-button" onClick={() => handleFormChange('family')}>家庭表單</button>
      </div>

      {/* 根據狀態顯示對應表單 */}
      {currentForm === 'employee' && <EmployeeForm />}
      {currentForm === 'country' && <CountryForm />}
      {currentForm === 'assignment' && <AssignmentForm />}
      {currentForm === 'family' && <FamilyForm />}
    </div>
  );
};

export default App;
