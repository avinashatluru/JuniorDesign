import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPrograms, getAttendees, getAttendeeNames } from "../actions/programs";
import './ProgramManagement.css';

function ViewAttendance() {
  const navigate = useNavigate();
  const [currentProgramId, setCurrentProgramId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [programs, setPrograms] = useState([]);

  // Fetch all programs on component mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await getAllPrograms();
        setPrograms(response.data);
      } catch (error) {
        console.error('Failed to fetch programs:', error.message);
        alert('Failed to fetch programs');
      }
    };

    fetchPrograms();
  }, []);

  // Fetch attendees whenever the currentProgramId changes
  useEffect(() => {
    if (currentProgramId) {
      const fetchAttendees = async () => {
        try {
          const response = await getAttendeeNames(currentProgramId);
          setAttendees(response.data);
        } catch (error) {
          console.error('Failed to fetch attendees:', error.message);
          alert('Failed to fetch attendees');
        }
      };

      fetchAttendees();
    }
  }, [currentProgramId]);

  const handleProgramChange = (event) => {
    const selectedProgramId = event.target.value;
    setCurrentProgramId(selectedProgramId);
  };

  const toHome = () => {
    navigate("/");
  };

  return (
    <center>
      <div className="attendance-view-container">
        <h1 onClick={toHome} style={{ color: 'white', fontSize: 65 }}>RATL</h1>
        <img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png" style={{ width: 50, height: 50 }} alt="logo" />
        <hr style={{ color: 'white' }} />
        <br />
        <br />

        <select onChange={handleProgramChange} value={currentProgramId}>
          <option value="">Select a program</option>
          {programs.map((program) => (
            <option key={program._id} value={program._id}>
              {program.name}
            </option>
          ))}
        </select>

        {currentProgramId && (
          <>
            <h3 style={{ color: 'white'}}>Attendees:</h3>
            <ul style={{ color: 'white' }}>
                {attendees.length > 0 ? (
                    attendees.map((attendee, index) => (
            <li key={index}>
                {attendee.firstName} {attendee.lastName}
        </li>
        ))
            ) : (
        <li>No attendees to display</li>
  )}
</ul>
          </>
        )}
      </div>
    </center>
  );
};

export default ViewAttendance;
