import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const EmployeeForm = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    age: '',
    salary: '',
    status: '正常',
  });
  const [selectedGrade, setSelectedGrade] = useState(1); // 預設為 1 職等
  const [maxGrade, setMaxGrade] = useState(1); // 最大職等
  const [stats, setStats] = useState({
    totalEmployees: 0,
    averageAge: 0,
    averageSalary: 0,
    totalSalaryYear: 0,
    totalSalaryMonth: 0,
    totalSalaryWeek: 0,
  });

  // 獲取員工資料與計算最大職等
  useEffect(() => {
    axios.get('http://172.24.8.156:9998/employees/get')
      .then(response => {
        setEmployeeData(response.data);
        const maxGrade = Math.max(...response.data.map(emp => emp.grade));
        setMaxGrade(maxGrade);
      })
      .catch(error => {
        console.error('There was an error fetching the employee data!', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value
    });
  };
  

  const handleAddEmployee = () => {
    axios.post('http://172.24.8.156:9998/employees/create', newEmployee)
      .then(response => {
        setEmployeeData([...employeeData, response.data]);
        setNewEmployee({
          id: '',
          name: '',
          age: '',
          salary: '',
          phone: '',
          gender: '',
          birthday: '',
          employmentDate: '',
          address: '',
          image: null,
          status: '正常'
        });
      })
      .catch(error => {
        console.error('There was an error adding the employee!', error);
      });
  };

  

  const handleDeleteEmployee = (id) => {
    axios.put(`http://172.24.8.156:9998/employees/delete/${id}`, { status: '刪除' })
      .then(() => {
        setEmployeeData(employeeData.map(emp =>
          emp.id === id ? { ...emp, status: '刪除' } : emp
        ));
      })
      .catch(error => {
        console.error('There was an error deleting the employee!', error);
      });
  };

  const handleEditEmployee = (id) => {
    const emp = employeeData.find((emp) => emp.id === id);
    setNewEmployee(emp);
  };

  const handleSearchEmployee = (id) => {
    return employeeData.filter((emp) => emp.id === id);
  };

  // 動態獲取統計資料
  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setSelectedGrade(grade);

    axios.get(`http://172.24.8.156:9998/employees/stats/${grade}`)
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the stats!', error);
      });
  };



  return (
    <div className="container">
      <h2>員工基本資料</h2>
  <form>
    <input
      type="text"
      name="id"
      value={newEmployee.id}
      onChange={handleInputChange}
      placeholder="員工身分證字號"
    />
    <input
      type="text"
      name="name"
      value={newEmployee.name}
      onChange={handleInputChange}
      placeholder="員工姓名"
    />
    <input
      type="number"
      name="age"
      value={newEmployee.age}
      onChange={handleInputChange}
      placeholder="年齡"
    />
    <input
      type="number"
      name="salary"
      value={newEmployee.salary}
      onChange={handleInputChange}
      placeholder="薪水"
    />
    <input
      type="text"
      name="phone"
      value={newEmployee.phone}
      onChange={handleInputChange}
      placeholder="電話號碼 (14位數字)"
      pattern="\d{0,14}" // 限制只能輸入0-14位數字
    />
    <input
      type="text"
      name="gender"
      value={newEmployee.gender}
      onChange={handleInputChange}
      placeholder="性別 (M/F)"
      maxLength={1} // 限制輸入1個字元
    />
    <input
      type="date"
      name="birthday"
      value={newEmployee.birthday}
      onChange={handleInputChange}
      placeholder="出生年月日"
    />
    <input
      type="date"
      name="employmentDate"
      value={newEmployee.employmentDate}
      onChange={handleInputChange}
      placeholder="錄用日期"
    />
    <input
      type="text"
      name="address"
      value={newEmployee.address}
      onChange={handleInputChange}
      placeholder="住址 (最多30位)"
      maxLength={30} // 限制住址字串長度
    />
    <input
      type="file"
      name="image"
      onChange={(e) =>
        setNewEmployee({ ...newEmployee, image: e.target.files[0] })
      }
      accept="image/*"
    />
    <button type="button" onClick={handleAddEmployee}>
      新增員工
    </button>
  </form>



      <div className="employee-stats">
        <h3>員工統計</h3>
        <div>
          <label htmlFor="grade-select">選擇職等: </label>
          <select
            id="grade-select"
            value={selectedGrade}
            onChange={handleGradeChange}
          >
            {[...Array(maxGrade).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{i + 1} 職等</option>
            ))}
          </select>
        </div>
        <p>員工總數: {stats.totalEmployees}</p>
        <p>平均年齡: {stats.averageAge.toFixed(2)} 歲</p>
        <p>平均薪資: {stats.averageSalary.toFixed(2)} 元</p>
        <p>全年總薪資: {stats.totalSalaryYear} 元</p>
        <p>本月總薪資: {stats.totalSalaryMonth} 元</p>
        <p>本週總薪資: {stats.totalSalaryWeek} 元</p>
      </div>

      <div className="employee-list">
        <h3>員工列表</h3>
        {
          employeeData.map((employee, index) => (
            <div key={index} className="employee-card">
              <h3>{employee.name}</h3>
              <p>員工編號: {employee.id}</p>
              <p>職級: {employee.grade}</p>
              <p>薪資: {employee.salary}</p>
              <p>電話號碼: {employee.phoneNumber}</p>
              <p>性別: {employee.gender}</p>
              <p>生日: {employee.birthday}</p>
              <p>入職日期: {employee.employmentDate}</p>
              <p>地址: {employee.address}</p>
              <p>圖片: {employee.image}</p>
              <button className="edit" onClick={() => handleEditEmployee(employee.id)}>編輯</button>
              <button className="delete" onClick={() => handleDeleteEmployee(employee.id)}>刪除</button>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default EmployeeForm;
