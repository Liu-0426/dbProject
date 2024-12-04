import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance';

function Statistics() {
  const [statistics, setStatistics] = useState(null);

  useEffect(() => {
    // 獲取統計資料
    axiosInstance.get('/statistics')
      .then(response => {
        setStatistics(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Statistics</h2>
      {statistics ? (
        <div>
          <p>Total Employees: {statistics.totalEmployees}</p>
          <p>Average Salary: {statistics.averageSalary}</p>
          <p>Male Employees: {statistics.maleEmployees}</p>
          <p>Female Employees: {statistics.femaleEmployees}</p>
        </div>
      ) : (
        <p>Loading statistics...</p>
      )}
    </div>
  );
}

export default Statistics;
