import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Select, { NonceProvider } from "react-select"
import { addAttendees, getAttendeeNames  } from "../actions/programs.js";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto"; 
import '../Styles/basic.css'; // Ensure the path is correct

function ManageAttendance() {
  const [activeComponent, setActiveComponent] = useState("");
  const [programs, setPrograms] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [checked, setChecked] = useState([]);
  const [currentProgram, setCurrentProgram] = useState("select a program");
  const [currentProgramId, setCurrentProgramId] = useState('');
  const [currentAttendees, setCurrentAttendees] = useState([])

  // Fetch programsa
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

  // Fetch attendees whenever the currentProgramId changes
  useEffect(() => {
    if (currentProgramId) {
      const fetchAttendees = async () => {
        try {
          const response = await getAttendeeNames(currentProgramId);
          setCurrentAttendees(response.data);
        } catch (error) {
          console.error('Failed to fetch attendees:', error.message);
          alert('Failed to fetch attendees');
        }
      };

      fetchAttendees();
    }
  }, [currentProgramId]);

  const handleProgramSelect = (e) => {
    const selectedProgramId = e.target.value;
    setSelectedProgram(selectedProgramId);
    let programsById = {};
    programs.forEach( (p) => {
      programsById[p._id] = p;
    });
    setCurrentProgram(programsById[selectedProgramId]);
    setCurrentProgramId(selectedProgramId);
  
    if (!selectedProgramId) {
      // If the "Select a program" option is chosen, clear the currentAttendees
      setCurrentAttendees([]);
    } else {
      // Otherwise, fetch and display the attendees for the selected program
      fetchAttendeesForProgram(selectedProgramId);
    }
  };

  const fetchAttendeesForProgram = async (programId) => {   
    try {
      const response = await getAttendeeNames(programId);
      setCurrentAttendees(response.data);
    } catch (error) {
      console.error('Failed to fetch attendees for the program:', error.message);
      alert('Failed to fetch attendees for the selected program');
    }
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

    const isConfirmed = window.confirm("Are you sure you want to add this program?");
    if (!isConfirmed) {
        return;
    }

    try {
      const response = await addAttendees(selectedProgram, selectedAttendees);
      console.log('Attendee was added', response.selectedAttendees);
      setSelectedProgram('');
      setSelectedAttendees([]);
      //fetchAttendeesForProgram(currentProgramId);
    } catch (error) {
      console.error("Failed to add attendees:", error);
      alert("There was a problem adding attendees.");
    }
  };

  //modifies page based on which header is clicked
  const modifyActiveComponent = (newActiveComponent) => {
    if (newActiveComponent === activeComponent) {setActiveComponent("None");} 
      else {setActiveComponent(newActiveComponent); console.log(activeComponent)}
    };
  
  //Sets currentProgram to which ever program is chosen in Selct component
  const handleSelectAttendance = (e) => {
    const Selected = e.value
		setCurrentProgram(Selected);
    setCurrentProgramId(Selected._id);
	};

  //changes checklist header to currentProgram.name
  const switchText = () => {
		let name = currentProgram.name;
		return name
	};

  //returns a list in the form of {label:program.name, value:program.id} for each program
  const programsList = () => {
		let listOfPrograms = [];
		programs.forEach(program =>{
      listOfPrograms.push({label:program.name, value:program})
    });
		return listOfPrograms
	};

  //returns list of program names
  const programNames = () => {
		let names = [];
		programs.forEach(program =>{
      names.push(program.name)
    });
		return names
	};

  //returns list of integers for each program
  const attendanceData = () => {
		let participation = [];
		programs.forEach(program =>{
      participation.push(15)
    });
		return participation
	};

  //Places and removes attendees to/from checked based on whether or not thei checkbox is checked 
  //Note attendees are passed in formated strings `${attendee._id};${attendee.firstName} ${attendee.lastName}` through e.target.value
	const handleCheck = (e) => {
		var x = [...checked]
		if(e.target.checked) {
			x = [...checked, e.target.value]

      //Dirty hack to sort attendees based on ID
      x = x.sort((a, b) => {
          let str1 = a.split(";")[0];
          let str2 = b.split(";")[0];
          return (str1 < str2 ) ? -1 : ( str1 > str2 ? 1 : 0 )})
		} else {
      //Selectively delete the unselected attendees
			x.splice(checked.indexOf(e.target.value), 1)
		}
		setChecked(x)
	}

  const removeAttendees = async (programId, attendeeIds) => {
    try {
      const response = await fetch(`http://localhost:5050/api/program/${programId}/removeAttendees`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attendeeIds }),
      });
      
      // Check if the response header contains 'application/json'
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        throw new Error(`Expected JSON, but received: ${errorText}`);
      }
  
      const data = await response.json();
      
      // Check for the 'ok' status based on fetch API standard
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove attendees');
      }
      
      fetchAttendeesForProgram(programId);
      return data;
    } catch (error) {
      console.error('Failed to remove attendees:', error);
      throw error;
    }
  };

  // The handler for the remove button
  const handleRemove = async (e) => {
    e.preventDefault();
    if (!selectedProgram || selectedAttendees.length === 0) {
      alert("Please select a program and at least one attendee to remove.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to remove the selected attendees from the program?");
    if (!isConfirmed) {
        return;
    }

    try {
      const response = await removeAttendees(selectedProgram, selectedAttendees);
      console.log('Attendee(s) removed:', response);
      setSelectedProgram('');
      setSelectedAttendees([]);
    } catch (error) {
      console.error("Failed to remove attendees:", error);
      alert(`There was a problem removing attendees: ${error.message}`);
    }
  };
  const selectStyles = {
    container: (provided) => ({
        ...provided,
        width: '40%',
        marginBottom: '20px',
    }),
    control: (provided) => ({
        ...provided,
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: 'rgb(105, 105, 105)',
        borderColor: '#ffffff',
        borderWidth: '2px',
        color: 'white',
        boxShadow: 'none', // Removes any existing shadows
        '&:hover': {
            borderColor: '#ffffff' // Border color on hover
        }
    }),
    valueContainer: (provided) => ({
        ...provided,
        color: 'white'
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'white'
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'rgb(153, 153, 153)' : 'rgb(105, 105, 105)',
        color: 'white',
        '&:hover': {
            backgroundColor: 'rgb(153, 153, 153)', // Darker grey on hover
        }
    }),
};

  return (
    <center>
    <div className="manage-attendance-container">
	    <hr ></hr>
      <h3 className={`clickable ${activeComponent === "Add" ? "active" : ""}`}style={{display:'inline', marginRight:60}} onClick={() => modifyActiveComponent("Add")}>Add Attendees to Program</h3>
      <h3 className={`clickable ${activeComponent === "Remove" ? "active" : ""}`}style={{display:'inline', marginRight:60}} onClick={() => modifyActiveComponent("Remove")}>Remove Attendees from Program</h3>
      <h3 className={`clickable ${activeComponent === "Attend" ? "active" : ""}`}style={{display:'inline', marginRight:60}} onClick={() => modifyActiveComponent("Attend")}>Mark Attendance</h3>

      {/* {activeComponent === "Add" && 	<div>
        <h3 style={{color:'white'}}>Select a Program</h3>
        <select onChange={handleProgramSelect} value={selectedProgram}>
          <option value="">Select a program</option>
          {programs.map(program => (
            <option key={program._id} value={program._id}>{program.name}</option>
          ))}
        </select>
        <h3 style={{color:'white'}}>Select Attendees To Add</h3>
        <select multiple='true' onChange={handleAttendeeSelect} value={selectedAttendees} className='AttendeesList'>
          {attendees.map(attendee => (
            <option key={attendee._id} value={attendee._id}>{attendee.firstName} {attendee.lastName}</option>
          ))}
        </select> <br/>
        <button onClick={handleSubmit} className='AttendeesButton'>Add Selected Attendees to Program</button>
			</div>} */}
           {activeComponent === "Add" && (
    <div className="manage-attendance-section">
        <h3 style={{
            fontFamily: '"Times New Roman", serif'
        }}>Select a Program</h3>

        <select
            onChange={handleProgramSelect}
            value={selectedProgram}
            className="manage-attendance-select"
        >
            <option value="">Select a program</option>
            {programs.map(program => (
                <option key={program._id} value={program._id}>{program.name}</option>
            ))}
        </select>

        <h3>Select Attendees To Add</h3>

        <select
            multiple={true}
            onChange={handleAttendeeSelect}
            value={selectedAttendees}
            className="manage-attendance-multiple-select manage-attendance-select"
        >
            {attendees.map(attendee => (
                <option key={attendee._id} value={attendee._id}>{attendee.firstName} {attendee.lastName}</option>
            ))}
        </select>
        <br/>
        <button
            onClick={handleSubmit}
            className="manage-attendance-button"
        >Add Selected Attendees to Program</button>
    </div>
)}


      {activeComponent === "Remove" && (
          <div className="manage-attendance-section">
            <h3 >Select a Program</h3>
            <select onChange={handleProgramSelect} value={selectedProgram} className="manage-attendance-select">
              <option value="">Select a program</option>
              {programs.map(program => (
                <option key={program._id} value={program._id}>{program.name}</option>
              ))}
            </select>
            <h3 style={{color:'white'}}>Select Attendees to Remove</h3>
            <select multiple='true' onChange={handleAttendeeSelect} value={selectedAttendees} className="manage-attendance-multiple-select manage-attendance-select">
              {currentAttendees.map(attendee => (
                <option key={attendee._id} value={attendee._id}>{attendee.firstName} {attendee.lastName}</option>
              ))}
            </select> <br/>
            <button onClick={handleRemove} className="manage-attendance-button">Remove Selected Attendees from Program</button>
          </div>
        )}


{activeComponent === "Attend" && (
    <div className="manage-attendance-section">
        <h3>Select Program</h3>
        <div className="attendance-select-container">
          <select className="program-select" onChange={handleProgramSelect} value={selectedProgram}>
              <option value="">Select a program</option>
              {programs.map(program => (
                  <option key={program._id} value={program._id}>{program.name}</option>
              ))}
          </select>
        </div>
        
        <div className="attendance-flex-container">
            <div className="attendance-list-container">
                <h3>Mark Attendance for <span className="active">{switchText()}</span></h3>
                {currentAttendees.map(attendee => (
                    <div key={attendee._id} className="attendance-item">
                        <input type="checkbox" className="attendance-checkbox" value={`${attendee._id};${attendee.firstName} ${attendee.lastName}`} onChange={handleCheck}/>
                        <span>{attendee.firstName} {attendee.lastName}</span>
                    </div>
                ))}
            </div>

            <div className="marked-ones">
                <h3>Selected Attendees</h3>
                {checked.map((item, index) => (
                    <div key={index} className="attendance-item">
                        <span>{item.split(";")[1]}</span>
                    </div>
                ))}
            </div>
        </div>

        <button type="submitAttendance" className="attendance-button">Mark Attendance</button>
    </div>
)}


    </div>
    </center>
  );
}
export default ManageAttendance;
