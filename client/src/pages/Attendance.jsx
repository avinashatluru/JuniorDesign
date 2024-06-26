import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Select from "react-select"
import { addAttendees, getAttendeeNames  } from "../actions/programs.js";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto"; 

function Attendance() {
  const nav = useNavigate();
  const [activeComponent, setActiveComponent] = useState("");
  const [programs, setPrograms] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [checked, setChecked] = useState([]);
  const [currentProgram, setCurrentProgram] = useState("select a program");
  const [currentProgramId, setCurrentProgramId] = useState('');
  const [currentAttendees, setCurrentAttendees] = useState([])
  const toHome = () => {nav("/")};

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
  
    if (!selectedProgramId) {
      // If the "Select a program" option is chosen, clear the currentAttendees
      setCurrentAttendees([]);
    } else {
      // Otherwise, fetch and display the attendees for the active program
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
  const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);
  
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

  return (
    <center>
    <div>
      <h1 onClick={toHome} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	    <img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	    style={{width:50, height:50, display:'inline'}} alt="new"/>
	    <hr style={{color:'white'}}></hr>
      <h2 style={{color:'white', display:'inline', marginRight:180}} onClick={() => modifyActiveComponent("Add")}>Add to Program</h2>
      <h2 style={{color:'white', display:'inline', marginRight:110}} onClick={() => modifyActiveComponent("Remove")}>Remove from Program</h2>
      <h2 style={{color:'white', display:'inline', marginRight:110}} onClick={() => modifyActiveComponent("Attend")}>Mark Attendance</h2>

      {activeComponent === "Add" && 	<div>
        <h2 style={{color:'white'}}>Select a Program</h2>
        <select onChange={handleProgramSelect} value={selectedProgram}>
          <option value="">Select a program</option>
          {programs.map(program => (
            <option key={program._id} value={program._id}>{program.name}</option>
          ))}
        </select>
        <h2 style={{color:'white'}}>Select Attendees To Add</h2>
        <select multiple='true' onChange={handleAttendeeSelect} value={selectedAttendees} >
          {attendees.map(attendee => (
            <option key={attendee._id} value={attendee._id}>{attendee.firstName} {attendee.lastName}</option>
          ))}
        </select> <br/>
        <button onClick={handleSubmit} >Add Selected Attendees to Program</button>
			</div>}

      {activeComponent === "Remove" && (
          <div>
            <h2 style={{color:'white'}}>Select a Program</h2>
            <select onChange={handleProgramSelect} value={selectedProgram}>
              <option value="">Select a program</option>
              {programs.map(program => (
                <option key={program._id} value={program._id}>{program.name}</option>
              ))}
            </select>
            <h2 style={{color:'white'}}>Select Attendees to Remove</h2>
            <select multiple='true' onChange={handleAttendeeSelect} value={selectedAttendees} >
              {currentAttendees.map(attendee => (
                <option key={attendee._id} value={attendee._id}>{attendee.firstName} {attendee.lastName}</option>
              ))}
            </select> <br/>
            <button onClick={handleRemove} className='AttendeesButton'>Remove Selected Attendees from Program</button>
          </div>
        )}

      {activeComponent === "Attend" && <div>	
				<h1 style={{color:'white'}}>Select Program</h1> 
        <Select style={{color:'black'}} options={programsList()} value={currentProgram} onChange={handleSelectAttendance}/><br/>
				<h1 style={{color:'white'}}>Mark Attendance for {switchText()}</h1> 								
				<div style={{color:'white', maxHeight:200, width:200, overflow:'auto'}} className="list-container">
       		{currentAttendees.map(attendee => (
       			<div key={attendee._id}>
							<input value={`${attendee._id};${attendee.firstName} ${attendee.lastName}`} type="checkbox" onChange={handleCheck}/>
        				<span>{attendee.firstName} {attendee.lastName}</span>
       			</div>))}
   			</div> 
				<div style={{color:'white', maxHeight:200, width:200, overflow:'auto'}} className="marked-ones">
					<h2>Marked Attendees</h2>
					{checked.map((item, index) => ( 
            /** 
             * Note attendees are passed in formated strings `${attendee._id};${attendee.firstName} ${attendee.lastName}`
             * splitting ensures only the name is displayed
            */
       			<div key={index}>
        			<span>{item.split(";")[1]}</span>
       			</div>))}
				</div>
				<br/>
				<button type="submitAttendance">Mark Attendance</button>
				</div>}
    </div>
    </center>
  );
}

export default Attendance;
