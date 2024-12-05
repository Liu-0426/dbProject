import React from 'react';
import EmployeeForm from './EmployeeForm';
import CountryForm from './CountryForm';
import AssignmentForm from './AssignmentForm';
import FamilyForm from './FamilyForm';
import './App.css';

const App = () => {
  return (
    <div className="container">
      <h1>員工管理系統</h1>
      <EmployeeForm />
      <CountryForm />
      <AssignmentForm />
      <FamilyForm />
    </div>
  );
};

export default App;
