import React, { useState, useEffect } from 'react';
import { addAttendees } from "../actions/programs.js";

function Attendance() {
  const [programs, setPrograms] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState([]);

  // Fetch programs
  useEffect(() => {
    async function fetchPrograms() {
      const response = await fetch('http://localhost:5050/api/program');
      const data = await response.json();
      setPrograms(data);
    }
    fetchPrograms();
  }, []);

  // Fetch attendees
  useEffect(() => {
    async function fetchAttendees() {
      const response = await fetch('http://localhost:5050/api/attendees');
      const data = await response.json();
      setAttendees(data);
    }
    fetchAttendees();
  }, []);

  const handleProgramSelect = (e) => {
    setSelectedProgram(e.target.value);
  };

  const handleAttendeeSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedAttendees(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProgram || selectedAttendees.length === 0) {
      alert("Please select a program and at least one attendee.");
      return;
    }

    try {
      const response = await addAttendees(selectedProgram, selectedAttendees);
      console.log('Attendee was added', response.selectedAttendees);
      setSelectedProgram('');
      setSelectedAttendees([]);
    } catch (error) {
      console.error("Failed to add attendees:", error);
      alert("There was a problem adding attendees.");
    }
  };

  return (
    <div>
      <h2 style={{color:'white'}}>Select a Program</h2>
      <select onChange={handleProgramSelect} value={selectedProgram}>
        <option value="">Select a program</option>
        {programs.map(program => (
          <option key={program._id} value={program._id}>{program.name}</option>
        ))}
      </select>

      <h2 style={{color:'white'}}>Select Attendees</h2>
      <select multiple onChange={handleAttendeeSelect} value={selectedAttendees}>
        {attendees.map(attendee => (
          <option key={attendee._id} value={attendee._id}>{attendee.firstName} {attendee.lastName}</option>
        ))}
      </select>

      <button onClick={handleSubmit}>Add Selected Attendees to Program</button>
    </div>
  );
}

export default Attendance;
