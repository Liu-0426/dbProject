import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeForm = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    age: '',
    salary: '',
    status: '正常'
  });

  // 獲取員工資料
  useEffect(() => {
    axios.get('http://172.24.8.156:9998/employees/get')  
      .then(response => {
        setEmployeeData(response.data);
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
          status: '正常'
        });
      })
      .catch(error => {
        console.error('There was an error adding the employee!', error);
      });
  };

  const handleDeleteEmployee = (id) => {
    axios.put(`http://172.24.8.156:9998/employees/delete/${id}`, { status: '刪除' })
      .then(response => {
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

  return (
    <div>
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
        <button type="button" onClick={handleAddEmployee}>
          新增員工
        </button>
      </form>

      <div>
        <h3>員工列表</h3>
        {
          employeeData.map((employee, index) => (
            <div key={index}>
              <h2>{employee.name}</h2>
              <p>員工編號: {employee.id}</p>
              <p>職級: {employee.grade}</p>
              <p>薪資: {employee.pay}</p>
              <p>電話號碼: {employee.phoneNumber}</p>
              <p>性別: {employee.gender}</p>
              <p>生日: {employee.birthday}</p>
              <p>入職日期: {employee.employmentDate}</p>
              <p>地址: {employee.address}</p>
              <p>圖片: {employee.image}</p>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default EmployeeForm;
