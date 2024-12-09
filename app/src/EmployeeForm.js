import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const EmployeeForm = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    grade: '',
    salary: '',
    status: '正常',
    phone: '',
    gender: '',
    birthday: '',
    employmentDate: '',
    address: '',
    image: '', // 添加 image 属性
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
    axios.get('http://140.128.102.234:4777/api/employee/enumerate')
      .then(response => {
        const { data } = response.data; // 確保提取出 data 屬性
        if (Array.isArray(data)) {
          // 將每個 JSON 字串解析為物件
          const parsedData = data.map(item => JSON.parse(item));
          setEmployeeData(parsedData);
        } else {
          console.error('API 回應的 data 格式非陣列:', data);
          setEmployeeData([]); // 若格式不符，設定為空
        }
      })
      .catch(error => {
        console.error('獲取員工資料時發生錯誤:', error);
        setEmployeeData([]); // 在出現錯誤時設定為空
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
    // 構造 JSON 格式的資料
    const employeePayload = {
      name: newEmployee.name,
      id: newEmployee.id,
      grade: newEmployee.grade, // 確保轉換為數字
      pay: parseFloat(newEmployee.salary), // 確保轉換為數字
      phoneNumber: newEmployee.phone,
      gender: newEmployee.gender,
      birthday: new Date(newEmployee.birthday).toISOString().split('T')[0],
      employmentDate: new Date(newEmployee.employmentDate).toISOString().split('T')[0],
      address: newEmployee.address,
      image: newEmployee.image, // 假設你需要以 Base64 格式傳送圖片
    };
  
    axios
      .post('http://140.128.102.234:4777/api/employee/create', employeePayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        setEmployeeData([...employeeData, response.data]); // 更新員工資料
        // 清空新增員工表單
        setNewEmployee({
          id: '',
          name: '',
          grade: '',
          salary: '',
          phone: '',
          gender: '',
          birthday: '',
          employmentDate: '',
          address: '',
          image: '',
          status: '正常',
        });
      })
      .catch(error => {
        console.error('There was an error adding the employee!', error);
      });
  };
  
  
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewEmployee({
          ...newEmployee,
          image: reader.result.split(',')[1], // 取出 Base64 編碼部分
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  

  const handleDeleteEmployee = (id) => {
    axios.delete(`http://140.128.102.234:4777/api/employee/remove/${id}`, { status: '刪除' })
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

  const [searchId, setSearchId] = useState(''); // 管理輸入框中的身分證字號
  const [searchResult, setSearchResult] = useState(null); // 存放查詢結果

  const handleSearch = () => {
    axios
      .get(`http://140.128.102.234:4777/api/employee/query/${searchId}`)
      .then((response) => {
        setSearchResult(response.data || null); // 如果後端返回空資料，則設定為 null
      })
      .catch((error) => {
        console.error('There was an error fetching the employee data!', error);
        setSearchResult(null); // 若發生錯誤，設為 null 表示無資料
      });
  };
  
  useEffect(() => {
    axios.get('http://140.128.102.234:4777/api/employee/statistics')
      .then(response => {
        const { averageAge, totalPayment, gradeStats } = response.data;
  
        setStats({
          totalEmployees: gradeStats[selectedGrade] || 0, // 根據選擇的職等顯示員工數量
          averageAge: averageAge,
          averageSalary: totalPayment / (gradeStats[selectedGrade] || 1), // 計算平均薪資
          totalSalaryYear: totalPayment * 12, // 假設是年薪
          totalSalaryMonth: totalPayment, // 本月總薪資
          totalSalaryWeek: totalPayment / 4, // 假設一個月4週
        });
      })
      .catch(error => {
        console.error('There was an error fetching the stats!', error);
      });
  }, [selectedGrade]); // 依賴 selectedGrade，當選擇的職等變更時，重新獲取統計資料
  
  const handlePrint = () => {
    const printContent = document.getElementById('print-section').innerHTML;
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write('<html><head><title>列印查詢結果</title></head><body>');
    newWindow.document.write(printContent);
    newWindow.document.write('</body></html>');
    newWindow.document.close();
    newWindow.print();
  };
  
  // 動態獲取統計資料
  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setSelectedGrade(grade);
  };
  
  



  return (
    <div className="container">
      <h2>員工基本資料</h2>
      <div className="search-employee">
    <h3>查詢員工</h3>
    <input
      type="text"
      placeholder="輸入員工身分證字號"
      value={searchId}
      onChange={(e) => setSearchId(e.target.value)}
    />
    <button type="button" onClick={handleSearch}>
      查詢
    </button>
    <button type="button" onClick={handlePrint}>
          列印查詢結果
    </button>
    {searchResult && (
      <div className="search-result">
        <h4>查詢結果：</h4>
        <p>員工姓名: {searchResult.name}</p>
        <p>職級: {searchResult.grade}</p>
        <p>薪資: {searchResult.salary}</p>
        <p>電話: {searchResult.phone}</p>
        <p>性別: {searchResult.gender}</p>
        <p>生日: {searchResult.birthday}</p>
        <p>錄用日期: {searchResult.employmentDate}</p>
        <p>地址: {searchResult.address}</p>
        <p>圖片: {searchResult.image}</p>
      </div>
    )}
    {searchResult === null && <p></p>}
  </div>



  <form>
  <h2>新增員工</h2>
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
      type="text"
      name="grade"
      value={newEmployee.age}
      onChange={handleInputChange}
      placeholder="職等 (10位字串)"
      maxLength={10}
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
      onChange={handleImageChange}
      accept="image/*"
    />
    <button type="button" onClick={handleAddEmployee}>
      新增員工
    </button>
  </form>



  <div className="employee-stats">
  <h3>員工統計</h3>
  <div>
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
    employeeData.length > 0 ? (
      employeeData.map((employee, index) => (
        <div key={index} className="employee-card">
          <h3>{employee.name}</h3>
          <p>員工編號: {employee.id}</p>
          <p>職級: {employee.grade}</p>
          <p>薪資: {employee.pay}</p>
          <p>電話號碼: {employee.phoneNumber}</p>
          <p>性別: {employee.gender}</p>
          <p>生日: {employee.birthday}</p>
          <p>錄用日期: {employee.employmentDate}</p>
          <p>地址: {employee.address}</p>
          <button className="edit" onClick={() => handleEditEmployee(employee.id)}>編輯</button>
          <button className="delete" onClick={() => handleDeleteEmployee(employee.id)}>刪除</button>
        </div>
      ))
    ) : (
      <p>目前沒有員工資料。</p>
    )
  }
</div>


    </div>
  );
};

export default EmployeeForm;
