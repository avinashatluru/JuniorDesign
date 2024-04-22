import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Select, { NonceProvider } from "react-select"
import { addAttendees, getAllPrograms, getAttendees, getAttendeeNames  } from "../actions/programs.js";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto"; 
import '../Styles/basic.css'; // Ensure the path is correct
import { getAllAttendance, updatedAttendance } from '../actions/attendance.js';
import { getAllUsers, getPrograms } from '../actions/users.js';
import AttendeeDisplay from './AttendeeDisplay.jsx';

function ManageAttendance() {
  const [activeComponent, setActiveComponent] = useState("");

  const [programs, setPrograms] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState('');

  const [checked, setChecked] = useState([]);
  const [currentProgram, setCurrentProgram] = useState("select a program");
  const [currentProgramId, setCurrentProgramId] = useState('');
  const [currentAttendees, setCurrentAttendees] = useState([]);

  const [currentDate, setDate] = useState(Date);
  const [sortPreference, setSortPreference] = useState("firstName");

  // Fetch programs & attendance records
  useEffect(() => {
    async function fetchPrograms() {
      const response = await getAllPrograms();
      const data = response.data;
      setPrograms(data);
    }

    fetchPrograms();
    setDate(new Date());  //Eliminate ME!
  }, []);

  // Fetch attendees
  useEffect(() => {
    async function fetchAttendees() {
      const response = await getAllUsers();
      const data = response.data;
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

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const response = await getAllAttendance();
        setAttendance(response.data);
      } catch (error) {
          console.error('Error getting attendees', error.message);
      }
      
    }
  
    fetchAttendance();
  })

  const getProgramsById = () => {
    let programsById = {};
    programs.forEach( (p) => {
      programsById[p._id] = p;
    });
    return programsById;
  }

  const getAttendeesById = () => {
    let attendeesById = {};
    attendees.forEach( (p) => {
      attendeesById[p._id] = p;
    });
    return attendeesById;
  }
  
	function getAttendanceByProgramId() {
		let stuff = {};
		attendance.map(attendance => 
			{if (attendance && attendance.program && attendance.program._id) stuff[attendance.program._id] = attendance});
		return stuff;
	}

  const handleProgramSelect = (e) => {
    const selectedProgramId = e.target.value;
    setSelectedProgram(selectedProgramId);
    let programsById = getProgramsById();
    setCurrentProgram(programsById[selectedProgramId]);
    setCurrentProgramId(selectedProgramId);
  
    if (!selectedProgramId) {
      // If the "Select a program" option is chosen, clear the currentAttendees
      setCurrentAttendees([]);
    } else {
      // Otherwise, fetch and display the attendees for the selected program
      fetchAttendeesForProgram(selectedProgramId);
    }

    clearChecked();
    handlePresetCheck();
  };

  const clearChecked = () => {
    setChecked([]);
    Array.from(document.getElementsByClassName("attendance-checkbox")).forEach(element => {
      element.checked = false;
    });
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
    const attendeeId = e.target.value;
    const isChecked = e.target.checked;
    setSelectedAttendees(prevSelected => {
      if (isChecked) {
        // Add the attendee ID if it's checked
        return [...prevSelected, attendeeId];
      } else {
        // Remove the attendee ID if it's unchecked
        return prevSelected.filter(id => id !== attendeeId);
      }
    });
  };

  const handleSelect = (e) => {
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
      else {setActiveComponent(newActiveComponent);}
    if (newActiveComponent === "Attend") {
      clearChecked();
      handlePresetCheck();
    }
  };
  
  //Sets currentProgram to which ever program is chosen in Selct component
  const handleSelectAttendance = (e) => {
    const Selected = e.value
		setCurrentProgram(Selected);
    setCurrentProgramId(Selected._id);
	};

  //changes checklist header to currentProgram.name
  const switchText = () => {
    if (currentProgram) {
      let name = currentProgram.name;
      return name
    } else {
      return "";
    }
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

  const handlePresetCheck = () => {
      let checkBoxes = Array.from(document.getElementsByClassName("attendance-checkbox"));
      
      if (currentProgramId && getAttendanceByProgramId()[currentProgramId].dates && 
            getAttendanceByProgramId()[currentProgramId].dates.includes(currentDate)) {
          let i = getAttendanceByProgramId()[currentProgramId].dates.indexOf(currentDate);
          let ids = [], x = [], a = [];
          getAttendanceByProgramId()[currentProgramId].attendees[i].forEach((attendee) => {
              ids.push(attendee._id);
              x.push(`${attendee._id};${attendee.firstName} ${attendee.lastName}`);
          });

          checkBoxes.forEach((e) => {
              if (ids.includes(e.value.split(";")[0])) {
                e.checked = true;
              }
          });

          setChecked(x);
      }
  }

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

  const takeAttendance = async (e) => {
      let attendance = getAttendanceByProgramId()[currentProgramId];
      
      let ids = [];
      checked.forEach((a) => {
          ids.push(a.split(";")[0]);
      });

      if (attendance.dates.includes(currentDate)) {
          let i = attendance.dates.indexOf(currentDate);

            //Filter the existing list & current list of attendees for only the checked attendees & concat them to get the list of all attendees who attended (whether deleted or not)
          attendance.attendees[i] = attendance.attendees[i].filter((attendee) => {
              return ids.includes(attendee._id);
            }).concat(currentAttendees.filter((attendee) => {
              return ids.includes(attendee._id);})
            ).sort((a, b) => {
              return (a._id < b._id ) ? -1 : ( a._id > b._id ? 1 : 0 )});
            //Of course, sort the attendees by ID too

          console.log(`Attendance: ${attendees}`)
      } else {
          attendance.dates.push(currentDate);

          if (attendance.attendees.length > 1) {
            attendance.attendees.push(currentAttendees.filter((attendee) => {
              return ids.includes(attendee._id);}));
          } else if (attendance.attendees[0].length == 0) {
            attendance.attendees[0] = currentAttendees.filter((attendee) => {
              return ids.includes(attendee._id);});
          }
          
      }

      let d = attendance.dates;
      let sortedAttendeeRecords = [];
      if (attendance.dates.length > 1) {
        //Sort the attendance records by date
        let d = attendance.dates.toSorted((a, b) => {
          return (a.valueOf() < b.valueOf()) ? -1 : (a.valueOf() > b.valueOf() ? 1 : 0 )
        });

        //Use the sorted date records to create a sorted array of their respective attendee records
        for (let i = 0; i < d.length; i++) {
            sortedAttendeeRecords.push(attendance.attendees[attendance.dates.indexOf(d[i])])
            console.log(sortedAttendeeRecords)
        }

        console.log("sorted attendance? ", sortedAttendeeRecords)
      } else {
        sortedAttendeeRecords = attendance.attendees;
      }

      let newAttendance = {program: attendance.program, dates: d, attendees: sortedAttendeeRecords};

      try {
        let response = await updatedAttendance(attendance._id, newAttendance);
        console.log(`Took attendance: `, response, newAttendance);
        clearChecked();
        return response;
      } catch (error) {
        console.error("Failed to take attendance: ", error, newAttendance);
        alert(`Error taking attendance: ${error}`);
        return error;
      }
  }

  // Helper function to sort the attendees based on the sort preference
  const sortAttendees = (attendees) => {
    return attendees.sort((a, b) => {
      if (sortPreference === "firstName") {
        return a.firstName.localeCompare(b.firstName);
      } else {
        return a.lastName.localeCompare(b.lastName);
      }
    });
  };

  const handleTakeAttendance = async (e) => {
    e.preventDefault();
    let confirm = true;
    if (!checked || checked.length <= 0) {
      confirm = window.confirm("You have selected no attendees. This will create an empty attendance record for the selected date. Are you sure you want to do this?");
    } else if (getAttendanceByProgramId()[currentProgramId].dates.includes(currentDate)) {
      confirm = window.confirm("There is an existing attendance record for this program on this date, do you want to overwrite it?");
    }
    
    await takeAttendance(e);
  }

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

      {activeComponent === "Add" && (
            <div className="manage-attendance-section">
              <h3>Select a Program</h3>
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
              {/* Dropdown to select sorting preference */}
              <div style={{ marginBottom: '10px' }}>
                <label htmlFor="sortPreferenceSelect" style={{ marginRight: '10px' }}>Sort by: </label>
                <select
                  id="sortPreferenceSelect"
                  value={sortPreference}
                  onChange={(e) => setSortPreference(e.target.value)}
                  className="manage-attendance-select"
                >
                  <option value="firstName">First Name</option>
                  <option value="lastName">Last Name</option>
                </select>
              </div>
              {/* Attendees sorted based on selected preference */}
              <div>
                {sortAttendees(attendees).map(attendee => (
                  <div key={attendee._id}>
                    <input
                      type="checkbox"
                      id={`attendee-${attendee._id}`}
                      value={attendee._id}
                      checked={selectedAttendees.includes(attendee._id)}
                      onChange={handleAttendeeSelect}
                    />
                    <label htmlFor={`attendee-${attendee._id}`}>
                      {attendee.firstName} {attendee.lastName}
                    </label>
                  </div>
                ))}
              </div>
              <br />
              <button onClick={handleSubmit} className="manage-attendance-button">
                Add Selected Attendees to Program
              </button>
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
            <div>
              {selectedProgram && getProgramsById()[selectedProgram] && getProgramsById()[selectedProgram].attendees.length > 0 && getProgramsById()[selectedProgram].attendees.map(id => (id &&
                  <div key={id}>
                      <input
                          type="checkbox"
                          id={`attendee-${id}`}
                          value={id}
                          checked={selectedAttendees.includes(id)}
                          onChange={handleAttendeeSelect}
                      />
                      <label htmlFor={`attendee-${id}`}>
                          {getAttendeesById()[id] && getAttendeesById()[id].firstName} {getAttendeesById()[id] && getAttendeesById()[id].lastName}
                      </label>
                  </div>
              ))}
          </div> <br/>
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

        <button type="submitAttendance" onClick={handleTakeAttendance} className="attendance-button">Mark Attendance</button>
    </div>
)}

    </div>
    </center>
  );
}
export default ManageAttendance;
