import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPrograms, getAttendeeNames } from "../actions/programs";

function ExportToCsv() {
  const navigate = useNavigate();
  const [currentProgramId, setCurrentProgramId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [displayCsvContent, setDisplayCsvContent] = useState('');
  const [currentProgram, setCurrentProgram] = useState({});

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
      const selectedProgram = programs.find(p => p._id === currentProgramId);
      setCurrentProgram(selectedProgram);

      const fetchAttendees = async () => {
        try {
          const response = await getAttendeeNames(currentProgramId);
          setAttendees(response.data);
          updateDisplayCsv(response.data, selectedProgram);
        } catch (error) {
          console.error('Failed to fetch attendees:', error.message);
          alert('Failed to fetch attendees');
        }
      };
      fetchAttendees();
    }
  }, [currentProgramId, programs]);

  const handleProgramChange = (event) => {
    setCurrentProgramId(event.target.value);
  };

  const updateDisplayCsv = (attendees, program) => {
    let tempCsvContent = "Program Name,Program Date,Program Site,Attendee Names,Attendee Birthdays\n";
    attendees.forEach(attendee => {
      const csvLine = `${program.name},${new Date(program.date).toISOString().split('T')[0]},${program.site},${attendee.firstName} ${attendee.lastName},${new Date(attendee.birthday).toISOString().split('T')[0]}`;
      tempCsvContent += `${csvLine}\n`;
    });
    setDisplayCsvContent(tempCsvContent);
  };

  const handleExport = () => {
    // Construct the full CSV content with MIME type, and then encode only the CSV data
    const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(displayCsvContent)}`;
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `${currentProgram.name.replace(/\s+/g, '_')}_details.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const toHome = () => {
    navigate("/");
  };

  return (
    <center>
      <div className="export-csv-container">
        <h1 onClick={toHome} style={{ color: 'white', fontSize: 65, display: 'inline' }}>RATL</h1>
        <hr style={{ color: 'white' }}></hr>
        <div>
          <select onChange={handleProgramChange} value={currentProgramId} style={{ margin: '20px', padding: '10px' }}>
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program._id} value={program._id}>
                {program.name}
              </option>
            ))}
          </select>
          <button onClick={handleExport} style={{ margin: '20px', padding: '10px' }}>Export to CSV</button>
          {displayCsvContent && <pre style={{ fontSize: '16px', lineHeight: '1.5', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{displayCsvContent}</pre>}
        </div>
      </div>
    </center>
  );

}

export default ExportToCsv;
