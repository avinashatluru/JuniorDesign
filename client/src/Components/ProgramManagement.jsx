import React, {useCallback, useState, useEffect} from "react";
import { createProgram, deleteProgram, getAllPrograms } from "../actions/programs.js";
import { createAttendance, getAllAttendance } from "../actions/attendance.js";
import "../Styles/basic.css"
import '../Styles/ProgramManagement.css'

function ProgramManagement() {

	const [currentProgram, setCurrentProgram] = useState("select a program")
	let p1 = ["parta1", "parta2", "parta3", "parta4", "parta5", "parta6", "parta7", "parta8", "parta9", "parta1", "parta2", "parta3", "parta1", "parta2", "parta3"]
	let p2 = ["partb1", "partb2", "partb3"]
	const [currList, setCurrList] = useState([])
	const [marked, setMarked] = useState([])

	const [error, setError] = useState('');
	const [list, setList] = useState([]);

	const [attendance, setAttendance] = useState([]);

	//Places all attendees whose box was checked into a new list on the side
	const handleMark = (e) => {
		var markedList = [...marked]
		if(e.target.checked){
			markedList = [...marked, e.target.value]
		} else {
			markedList.splice(marked.indexOf(e.target.value), 1)
		}
		setMarked(markedList)
	}

	//changes checklist based on selection for selct field
	const handleSelect = (e) => {
		setCurrentProgram(e.label)
		switchList()
	}

	//switch text to which program was most recently selected
	const switchText = () => {
		let x;
		currentProgram === "select a program"
			?(x = "program")
			:(x = currentProgram)
		return x
	}

	//switch which list is displayed
	const switchList = () => {
		if (currentProgram === "program1"){
			setCurrList(p1);
		}
		if (currentProgram === "program2"){
			setCurrList(p2);
		}
	} 

	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const[form, setForm] = useState({
		name: "",
		site: "",
		date: ""
	});
    const [activeComponent, setActiveComponent] = useState("projects");

	//modifies page based on which header is clicked
	const modifyActiveComponent =(newActiveComponent) => {
		if (newActiveComponent === activeComponent) {setActiveComponent("None");} 
		  else {setActiveComponent(newActiveComponent); console.log(activeComponent)}
		};

	const validate = () => {
		for (let key in form) {
			if (form[key].trim().length === 0) {
				return false;
			}
		}
		return true;
	};

	//Creates a blank attendance record for a particular program
	const makeAttendance = async (program) => {
		const attendanceResponse = await createAttendance({program: program, 
			dates: [], 
			attendees: [[]]});
		return attendanceResponse;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validate()) {
			setError('Please fill out all fields');
			return;
		}

		const isConfirmed = window.confirm("Are you sure you want to add this program?");
		if (!isConfirmed) {
			return; // If the user cancels, exit early
		}

		try {
			// Call createProgram function with form data
	
			const response = await createProgram(form);
			// Handle success (e.g., show success message)
			console.log('Program created successfully:', response.data);
			const attendanceResponse = await createAttendance({program: response.data, 
				dates: [], 
				attendees: [[]]});
			console.log(`Attendance Records for ${response.data.name} created successfully:`, attendanceResponse.data);
		} catch (error) {
			// Handle error (e.g., display error message)
			console.error('Error creating Program', error.message);
		}
		setForm({ name: "", site: "", date: ""});
	}

	useEffect(() => {
		async function getPrograms() {
			const response = await fetch("http://localhost:5050/api/program/");
			
			if (!response.ok) {
				const message = `An error occurred: ${response.statusText}`;
				window.alert(message);
				return;
			}
			
			const data = await response.json();
			const names = data.map(program => [`${program.name}`, program._id]);
			setList(names);

			let a = await getAttendanceByProgramId();

			setAttendance(a);
			data.forEach(async (p) => {
				if (!a[p._id]) {
						try {
							let response = await makeAttendance(p);
							console.log(`Made attendance for program "${p.name}" (${p._id}): `, response.data);
						} catch {
							console.error(`Error creating attendance records for orphan program ${p.name} (${p})`, error.message);
						}
						
				}
			});
		}

		getPrograms();
	}, []);

	async function getAttendanceByProgramId() {
		const response = await getAllAttendance();
		
		if (response.statusText != "OK") {
			const message = `An error occurred: ${response.statusText}`;
			window.alert(message);
			return;
		}
		
		const data = await response.data;
		let stuff = {};
		data.map(attendance => 
			{if (attendance && attendance.program && attendance.program._id) stuff[attendance.program._id] = attendance});
		return stuff;
	}

	const handleDelete = async (id) => {
		const isConfirmed = window.confirm("Are you sure you want to delete this program?");
		if (!isConfirmed) {
			return; // If the user cancels, exit early
		}
		
		try {
			await deleteProgram(id);
			alert('Program deleted successfully');
			// Refresh the list of programs after deletion
			fetchPrograms();
		} catch (error) {
			console.error('Error deleting program:', error.message);
			alert('Failed to delete program');
		}
	};

	const fetchPrograms = async () => {
		try {
			const response = await getAllPrograms();
			const data = await response.data;
			const names = data.map(program => [`${program.name}`, program._id]);
			setList(names);
		} catch (error) {
			console.error('Failed to fetch programs:', error.message);
			alert('Failed to fetch programs');
		}
	};
	
	useEffect(() => {
		fetchPrograms();
	}, []);
		


    return (
	<center>
	<div>
	<hr/>
	<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

	<h3 className={`${activeComponent==="Add"? "clickable active" : "clickable"}`} style={{marginRight:260}} onClick={() => modifyActiveComponent("Add")}>Add Program</h3>
	<h3 className={`${activeComponent==="View"? "clickable active" : "clickable"}`} style={{marginRight:0}} onClick={() => modifyActiveComponent("View")}>View Programs</h3>
	</div>
	<br />
    <br />
	
	{activeComponent === "Add" && 	<div >
		    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
				<form onSubmit={handleSubmit} >
				
					<label style={{marginRight:15}}>Program Name:</label>
					<input name="name" type="text" value={form.name} onChange={handleChange} required /><br/>
			
				
					<label style={{marginRight:17}}>Location:</label>
					<input name="site" type="text" value={form.site} onChange={handleChange} required /><br/>
			
			
					<label style={{marginRight:17}}>Date:</label>
					<input name="date" type="date" value={form.date} onChange={handleChange} required /><br/>
		

					{error && <label id="Error" style={{color: 'red'}}>{error}</label>}

					<button type="submit">Add Program</button>
				</form>
				</div>
									
                    </div>
                }



	{activeComponent === "View" && <div>
					<div style={{width: '90%', height: 200, display: 'flex', flexFlow: 'column wrap', overflow:'auto'}}>
						{list.map(program => (
							<div key={program[1]} style={{display: 'flex', justifyContent: 'space-between', flexFlow: 'row nowrap', width: 200, alignItems: 'center', // This ensures vertical alignment
							lineHeight: '1.5' }}>
								<span>{program[0]}</span>
								<button onClick={() => handleDelete(program[1])} className="delete">Delete</button>
							</div>
						))}
					</div>
					</div>}
	</div>
	</center>
    );
};

export default ProgramManagement
