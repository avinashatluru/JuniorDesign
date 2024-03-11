import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPrograms, getAttendeeNames } from "../actions/programs";

function ExportToCsv() {
  const navigate = useNavigate();
  const [currentProgramId, setCurrentProgramId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [programs, setPrograms] = useState([]);

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
    setCurrentProgramId(event.target.value);
  };

  function exportProgramDataToCSV(programData, attendees) {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Program Name,Program Date,Program Site,Attendee Names,Attendee Birthdays\n";

    const attendeeNames = attendees.map(a => a.firstName + ' ' + a.lastName).join('; ');
    const attendeeBirthdays = attendees.map(a => a.birthday.split('T')[0]).join('; ');

    csvContent += `${programData.name},${new Date(programData.date).toISOString().split('T')[0]},${programData.site},"${attendeeNames}","${attendeeBirthdays}"\n`;

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${programData.name.replace(/\s+/g, '_')}_details.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up
  }


  const handleExport = async () => {
    if (!currentProgramId) {
      alert("Please select a program to export.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5050/api/program/${currentProgramId}`);
      if (response.ok) {
        const programData = await response.json();
        console.log(programData)
        console.log(attendees)
        exportProgramDataToCSV(programData, attendees)
      } else {
        throw new Error('Failed to fetch program data');
      }
    }
    catch (error) {
      console.error('Failed to get program data:', error.message);
      alert('Failed to get program data');
    }
  };

  const toHome = () => {
    navigate("/");
  };

  return (
    <center>
      <div className="export-csv-container">
        <h1 onClick={toHome} style={{color: 'white', fontSize: 65, display: 'inline'}}>RATL</h1>
        <hr style={{color: 'white'}}></hr>
        <div>
          <select onChange={handleProgramChange} value={currentProgramId} style={{margin: '20px', padding: '10px'}}>
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program._id} value={program._id}>
                {program.name}
              </option>
            ))}
          </select>
          <button onClick={handleExport} style={{margin: '20px', padding: '10px'}}>Export to CSV</button>
        </div>
      </div>
    </center>
  );
}

export default ExportToCsv;