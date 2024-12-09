import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignmentForm = () => {
  const [assignmentData, setAssignmentData] = useState([]);  // 儲存員工派駐資料
  const [newAssignment, setNewAssignment] = useState({
    employeeId: '',
    country: '',
    status: '派駐'
  });

  // 獲取員工派駐資料
  useEffect(() => {
    axios.get('http://172.24.8.156:9998/api/assignments')  // 假設後端的員工派駐API是這樣的
      .then(response => {
        setAssignmentData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the assignment data!', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment({
      ...newAssignment,
      [name]: value
    });
  };

  const handleAddAssignment = () => {
    axios.post('http://172.24.8.156:9998/api/assignments', newAssignment)
      .then(response => {
        setAssignmentData([...assignmentData, response.data]);
        setNewAssignment({ employeeId: '', country: '', status: '派駐' });
      })
      .catch(error => {
        console.error('There was an error adding the assignment!', error);
      });
  };

  // 查詢員工統計資料
  const CountryEmployeeStats = () => {
    const [countries, setCountries] = useState([]);  // 儲存國家列表
    const [selectedCountry, setSelectedCountry] = useState('');  // 儲存選擇的國家
    const [employeeCount, setEmployeeCount] = useState(null);  // 儲存選定國家的總員工數
    const [employeeDensity, setEmployeeDensity] = useState(null);  // 儲存選定國家的員工密度
    const [loading, setLoading] = useState(false);  // 加載狀態
    const [error, setError] = useState(null);  // 錯誤狀態

    // 獲取所有國家的列表
    useEffect(() => {
      axios.get('http://140.128.102.234:8080/api/country/enumerate')  // 假設後端有提供國家列表的API
        .then(response => {
          setCountries(response.data);  // 設置國家列表
        })
        .catch(err => {
          console.error('無法獲取國家資料', err);
          setError('無法獲取國家資料');
        });
    }, []);

    // 查詢選定國家的總員工人數
    const fetchEmployeeCount = () => {
      setLoading(true);
      axios
        .get(`http://your-backend-api/countries/${selectedCountry}/employee-count`)
        .then(response => {
          setEmployeeCount(response.data.employee_count);  // 設置總員工數
          setError(null);
        })
        .catch(err => {
          console.error('無法獲取員工總數資料', err);
          setError('無法獲取員工總數資料');
        })
        .finally(() => setLoading(false));
    };

    // 查詢選定國家的員工密度
    const fetchEmployeeDensity = () => {
      setLoading(true);
      axios
        .get(`http://your-backend-api/countries/${selectedCountry}/employee-density`)
        .then(response => {
          setEmployeeDensity(response.data.employee_density);  // 設置員工密度
          setError(null);
        })
        .catch(err => {
          console.error('無法獲取員工密度資料', err);
          setError('無法獲取員工密度資料');
        })
        .finally(() => setLoading(false));
    };

    return (
      <div>
        <h3>查詢員工統計資料</h3>
        {/* 國家選擇 */}
        <div>
          <label htmlFor="country">選擇國家：</label>
          <select
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}  // 設置選擇的國家
          >
            <option value="">請選擇國家</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* 查詢功能區 */}
        <div className="button-group">
          <button onClick={fetchEmployeeCount} disabled={!selectedCountry}>
            查詢總員工人數
          </button>
          <button onClick={fetchEmployeeDensity} disabled={!selectedCountry}>
            查詢員工密度
          </button>
        </div>

        {loading && <p>資料加載中...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* 顯示員工總數和員工密度 */}
        {employeeCount !== null && (
          <div>
            <h4>員工總數：{employeeCount}</h4>
          </div>
        )}

        {employeeDensity !== null && (
          <div>
            <h4>員工密度 (人/單位面積)：{employeeDensity}</h4>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>員工派駐資料</h2>

      {/* 查詢功能區 */}
      <CountryEmployeeStats />  {/* 加入查詢功能區 */}

      {/* 其他派駐資料表單 */}
      <form>
        <input
          type="text"
          name="employeeId"
          value={newAssignment.employeeId}
          onChange={handleInputChange}
          placeholder="員工ID"
        />
        <input
          type="text"
          name="country"
          value={newAssignment.country}
          onChange={handleInputChange}
          placeholder="派駐國家"
        />
        <input
          type="text"
          name="country"
          value={newAssignment.country}
          onChange={handleInputChange}
          placeholder="大使姓名"
        />
        <button type="button" onClick={handleAddAssignment}>
          新增派駐資料
        </button>
      </form>

      <div>
        <h3>派駐資料列表</h3>
        {assignmentData.map((assignment) => (
          <div key={assignment.employeeId}>
            <p>員工ID: {assignment.employeeId}, 國家: {assignment.country}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentForm;
