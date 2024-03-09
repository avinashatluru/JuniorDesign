import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Select from "react-select"
import { addAttendees } from "../actions/programs.js";
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

  //modifies page based on which header is clicked
  const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);
  
  //Sets currentProgram to which ever program is chosen in Selct component
  const handleSelectAttendance = (e) => {
		setCurrentProgram(e.label);
	};

  //changes checklist header to currentProgram.name
  const switchText = () => {
		let x = currentProgram;
		return x
	};

  //returns a list in the form of {label:program.name, value:program.id} for each program
  const programsList = () => {
		let x = [];
		programs.forEach(program =>{
      x.push({label:program.name, value:program.id})
    });
		return x
	};

  //returns list of program names
  const programNames = () => {
		let x = [];
		programs.forEach(program =>{
      x.push(program.name)
    });
		return x
	};

  //returns list of integers for each program
  const attendanceData = () => {
		let x = [];
		programs.forEach(program =>{
      x.push(15)
    });
		return x
	};

  //Places and removes attendees to/from checked based on whether or not thei checkbox is checked 
	const handleCheck = (e) => {
		var x = [...checked]
		if(e.target.checked){
			x = [...checked, e.target.value]
		} else {
			x.splice(checked.indexOf(e.target.value), 1)
		}
		setChecked(x)
	}

  return (
    <center>
    <div>
      <h1 onClick={toHome} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	    <img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	    style={{width:50, height:50, display:'inline'}} alt="new"/>
	    <hr style={{color:'white'}}></hr>
      <h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("Add")}>Add to Program</h2>
      <h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("Attend")}>Mark Attendance</h2>
      <h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("Stats")}>Stats</h2>

      {activeComponent === "Add" && 	<div>
        <h2 style={{color:'white'}}>Select a Program</h2>
        <select onChange={handleProgramSelect} value={selectedProgram}>
          <option value="">Select a program</option>
          {programs.map(program => (
            <option key={program._id} value={program._id}>{program.name}</option>
          ))}
        </select>
        <h2 style={{color:'white'}}>Select Attendees</h2>
        <select multiple='true' onChange={handleAttendeeSelect} value={selectedAttendees} className='AttendeesList'>
          {attendees.map(attendee => (
            <option key={attendee._id} value={attendee._id}>{attendee.firstName} {attendee.lastName}</option>
          ))}
        </select> <br/>
        <button onClick={handleSubmit} className='AttendeesButton'>Add Selected Attendees to Program</button>
			</div>}

      {activeComponent === "Attend" && <div>	
				<h1 style={{color:'white'}}>Select Program</h1> 
        <Select style={{color:'black'}} options={programsList()} value={currentProgram} onChange={handleSelectAttendance}/><br/>
				<h1 style={{color:'white'}}>Mark Attendance for {switchText()}</h1> 								
				<div style={{color:'white', maxHeight:200, width:200, overflow:'auto'}} className="list-container">
       		{attendees.map(attendee => (
       			<div key={attendee._id}>
							<input value={attendee._id} type="checkbox" onChange={handleCheck}/>
        				<span>{attendee.firstName} {attendee.lastName}</span>
       			</div>))}
   			</div> 
				<div style={{color:'white', maxHeight:200, width:200, overflow:'auto'}} className="marked-ones">
					<h2>Marked Attendees</h2>
					{checked.map((item, value) => (
       			<div key={value}>
        			<span>{item}</span>
       			</div>))}
				</div>
				<br/>
				<button type="submitAttendance">Mark Attendance</button>
				</div>}

        {activeComponent === "Stats" && <div style={{backgroundColor:"white"}}>	
        <h1>PARTICIPATION FOR THIS WEEK</h1>
            <div style={{maxWidth: "650px"}}>
                <Bar
                    data={{
                        // Name of the variables on x-axies for each bar
                        labels: programNames(),
                        datasets: [
                            {
                                // Label for bars
                                label: "Number of Participants",
                                // Data or value of your each variable
                                data: attendanceData(),
                                // Color of each bar
                                backgroundColor: 
                                    ["aqua"],
                                // Border color of each bar
                                borderColor: ["aqua"],
                                borderWidth: 0.5,
                            },
                        ],
                    }}
                    // Height of graph
                    height={400}
                    options={{
                        maintainAspectRatio: false,
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                  // The y-axis value will start from zero
                                        beginAtZero: true,
                                    },
                                },
                            ],
                        },
                        legend: {labels: {fontSize: 15,},},
                    }}
                />
            </div>
				</div>}
    </div>
    </center>
  );
}

export default Attendance;
