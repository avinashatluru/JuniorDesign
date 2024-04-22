import React,{useState, useCallback, useEffect} from "react";
import { getAllPrograms, addAttendees } from "../actions/programs.js";
import UserDisplayHack from "../Components/UserDisplayHack";
import "../Styles/basic.css"

const AttendeeDisplay = ({list, onUpdate}) => {
	const [multiSelectEnabled, setMultiSelect] = useState(false);
	const [attendees, setAttendees] = useState([]);
	const [checked, setChecked] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [currentProgramId, setCurrentProgramId] = useState('');
	const [currentFilterType, setCurrentFilterType] = useState("");
	const [currentFilters, setCurrentFilters] = useState([])

	const ageRanges = [	
		'0-4',
		'5-9',
		'10-14',
		'15-19',
		'20-24',
		// Add more ranges as needed
		];
	
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

	const addSelectedUsers = async (e) => {
		e.preventDefault();
		if (!currentProgramId || checked.length === 0) {
		alert("Please select a program and at least one attendee.");
		return;
		}

		const isConfirmed = window.confirm("Are you sure you want to add this program?");
		if (!isConfirmed) {
			return;
		}

		try {
			const response = await addAttendees(currentProgramId, checked.map((a) => {return a.split(";")[0]}));
			console.log('Attendee was added', response.selectedAttendees);
			setCurrentProgramId('');
		//fetchAttendeesForProgram(currentProgramId);
		} catch (error) {
			console.error("Failed to add attendees:", error);
			alert("There was a problem adding attendees.");
		}
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
		  
		  return data;
		} catch (error) {
		  console.error('Failed to remove attendees:', error);
		  throw error;
		}
	  };

	const removeSelectedUsers = async (e) => {
		e.preventDefault();
		if (!currentProgramId || checked.length === 0) {
			alert("Please select a program and at least one attendee to remove.");
			return;
		}

		console.log(checked);

		const isConfirmed = window.confirm(`Are you sure you want to remove the selected attendees from program ${getProgramsById()[currentProgramId].name}?`);
		if (!isConfirmed) {
			return;
		}

		try {
			const response = await removeAttendees(currentProgramId, checked.map((a) => {return a.split(";")[0]}));
			console.log('Attendee(s) removed:', response);
			setCurrentProgramId('');
		} catch (error) {
			console.error("Failed to remove attendees:", error);
			alert(`There was a problem removing attendees: ${error.message}`);
		}
	}

	const clearMultiSelection = () => {
		Array.from(document.getElementsByClassName("attendeeCheck")).forEach(element => {
			element.checked = false;
		});
		setChecked([]);
	}

	const handleProgramSelect = (e) => {
		const selectedProgramId = e.target.value;
		setCurrentProgramId(selectedProgramId);
	}

	const handleFilterTypeSelect = (e) => {
		setCurrentFilterType(e.target.value);
	}

	const createFilter = (e) => {
		console.log("I'm not impletemented yet!")
	}

	return (
		<div className="container horizontal" id="rosterContainer" style={{overflow: "hidden"}}>
			<div style={{width: "33%"}}>
				<div className="container vertical">
					<h4>Filters</h4>
					<div style={{marginBottom: "4pt"}}><p>Filter by:</p>
						<select onChange={handleFilterTypeSelect}t>
							<option value={""}>Select an Option</option>
							<option value={"Program"}>Program</option>
							<option value={"Age Range"}>Age Range</option>
							<option value={"Name"}>Name</option>
						</select>
					</div>
					<div>
						{currentFilterType == "Program" && <>
							<select>
								<option value="">Select a program</option>
								{programs.map(program => (
									<option key={program._id} value={program._id}>{program.name}</option>
								))}
							</select>
						</>}
						{currentFilterType == "Age Range" && <>
							<select>
								<option value="">Select an Age Range</option>
								{ageRanges.map((ageRange) => (
									<option value={ageRange}>{ageRange}</option>
								))}
							</select>
						</>}
						{currentFilterType == "Name" && <>
								<textarea/>
						</>}
						{currentFilterType != "" && <>
							<button onClick={createFilter}>Create Filter</button>
						</>}
					</div>
					<div>
						<p>No Current Filters</p>
						<button className="delete">Remove Selected Filters</button>
					</div>
				</div>
			</div>
			<div style={{width: "33%"}}>
				<h1>ATTENDEES</h1> 
				<div className="container vertical" style={{overflow: "auto"}}>
					{list.map(txt => <div><p/><input value={`${txt[1]};${txt[0]}`} type="checkbox" className={`${multiSelectEnabled ? "attendeeCheck" : "hide"}`} onChange={handleCheck}/> <UserDisplayHack key={txt[1]} data={txt} style={{display: "inline-block"}} onUserUpdate={onUpdate}/></div>)}
				</div>
			</div>
			<div style={{width: "33%"}}>
				<div><input style={{display: "inline"}} type="checkbox" value={"Multi-Selection"} onChange={() => {setMultiSelect(!multiSelectEnabled)}}/><h4 style={{display: "inline"}} className={`${multiSelectEnabled ? "active" : ""}`}>Multi-Selection</h4></div>
				{multiSelectEnabled ? <><h4>Selected Attendees</h4>
				{checked.map((item, index) => ( 
					/** 
					 * Note attendees are passed in formated strings `${attendee._id};${attendee.firstName} ${attendee.lastName}`
					 * splitting ensures only the name is displayed
					*/
					<div key={index}>
						<span>{item.split(";")[1]}</span>
					</div>))}
					<div className="container vertical">
						<select style={{width: "100%"}} onChange={handleProgramSelect} value={currentProgramId}>
						<option value="">Select a program</option>
						{programs.map(program => (
							<option key={program._id} value={program._id}>{program.name}</option>
						))}
						</select>
						<button onClick={addSelectedUsers}>Add to Program</button>
						<button onClick={removeSelectedUsers}>Remove from Program</button>
						<button className="delete" onClick={clearMultiSelection}>Clear Selection</button>
				</div></> : null}
			</div>
		</div>
	);
};

export default AttendeeDisplay;