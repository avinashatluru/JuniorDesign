import React,{useState, useCallback, useEffect} from "react";
import { getAllPrograms } from "../actions/programs";
import UserDisplayHack from "../Components/UserDisplayHack";
import "../Styles/basic.css"

const AttendeeDisplay = ({list, onUpdate}) => {
	const [multiSelectEnabled, setMultiSelect] = useState(false);
	const [attendees, setAttendees] = useState([]);
	const [checked, setChecked] = useState([]);
	const [programs, setPrograms] = useState([]);
	const [currentProgramId, setCurrentProgramId] = useState('');

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

	return (
		<div className="container horizontal" id="rosterContainer">
			<div style={{width: "33%"}}><p>Placeholdeer for filtering UI</p></div>
			<div style={{width: "33%"}}>
				<h1>ATTENDEES</h1> 
				<div className="container vertical">
					{list.map(txt => <div><p/><input value={`${txt[1]};${txt[0]}`} type="checkbox" className={`${multiSelectEnabled ? "attendeeCheck" : "hide"}`} onChange={handleCheck}/> <UserDisplayHack key={txt[1]} data={txt} style={{display: "inline-block"}} onUserUpdate={onUpdate}/></div>)}
				</div>
			</div>
			<div style={{width: "33%"}}>
				<div><input type="checkbox" value={"Multi-Selection"} onChange={() => {setMultiSelect(!multiSelectEnabled)}}/><h4 className={`${multiSelectEnabled ? "active" : ""}`}>Multi-Selection</h4></div>
				{multiSelectEnabled ? <><h4>Selected Attendees</h4>
				{checked.map((item, index) => ( 
				/** 
				 * Note attendees are passed in formated strings `${attendee._id};${attendee.firstName} ${attendee.lastName}`
				 * splitting ensures only the name is displayed
				*/
       			<div key={index}>
        			<span>{item.split(";")[1]}</span>
       			</div>))}
				<div className="container vertical"><select onChange={handleProgramSelect} value={currentProgramId}>
					<option value="">Select a program</option>
					{programs.map(program => (
						<option key={program._id} value={program._id}>{program.name}</option>
					))}
					</select>
				<input type="button" value={"Add to Program"}/><input type="button" value={"Remove from Program"}/><input style={{color: "red"}} type="button" value={"Clear Selection"} onClick={clearMultiSelection}/></div></> : null}
			</div>
		</div>
	);
};

export default AttendeeDisplay;