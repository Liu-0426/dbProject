import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignmentForm = () => {
  const [assignmentData, setAssignmentData] = useState([]);
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

  return (
    <div>
      <h2>員工派駐資料</h2>
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
