import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import CountryList from './components/CountryList';
import DeploymentList from './components/DeploymentList';
import FamilyList from './components/FamilyList';
import Statistics from './components/Statistics';
import './App.css';
import './components/EmployeeForm.css';
import './components/EmployeeList.css';
import './components/CountryList.css';
import './components/Statistics.css';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Employee Management System</h1>
        <Routes>
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<EmployeeForm />} />
          <Route path="/employees/edit/:ssn" element={<EmployeeForm />} />
          <Route path="/countries" element={<CountryList />} />
          <Route path="/deployments" element={<DeploymentList />} />
          <Route path="/families" element={<FamilyList />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/" element={<EmployeeList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
