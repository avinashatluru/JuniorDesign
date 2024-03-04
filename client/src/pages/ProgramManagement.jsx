import React, {useCallback, useState, useEffect} from "react";
import React, {useCallback, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { createProgram, deleteProgram } from "../actions/programs.js";

import './ProgramManagement.css'
import { BarChart } from '@mui/x-charts/BarChart';

function ProgramManagement() {

    const nav = useNavigate();
	const [currentProgram, setCurrentProgram] = useState("select a program")
    document.body.style = 'background: black';
	let p1 = ["parta1", "parta2", "parta3", "parta4", "parta5", "parta6", "parta7", "parta8", "parta9", "parta1", "parta2", "parta3", "parta1", "parta2", "parta3"]
	let p2 = ["partb1", "partb2", "partb3"]
	const [currList, setCurrList] = useState([])
	const [marked, setMarked] = useState([])

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

    const toHome = () => {
		nav("/")
	};

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

	const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);

	const validate = () => {
		for (let key in form) {
			if (form[key].trim().length === 0) {
				return false;
			}
		}
		return true;
	};

	const [error, setError] = useState('');
	const [list, setList] = useState([]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validate()) {
			setError('Please fill out all fields');
			return;
		}

		try {
			// Call createProgram function with form data
	
			const response = await createProgram(form);
			// Handle success (e.g., show success message)
			console.log('Program created successfully:', response.data);
		} catch (error) {
			// Handle error (e.g., display error message)
			console.error('Error creating Program', error.message);
		}
		setForm({ name: "", site: "", date: ""});
		nav("/ProgramManagement");
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
		}

		getPrograms();
	}, []);

	const handleDeleteProgram = async (id) => {
        try {
            await programsActions.deleteProgram(id);
            setPrograms(programs.filter(program => program._id !== id)); // Remove program from state
        } catch (error) {
            console.error("Failed to delete program:", error);
        }
    };

    return (
	<center>
	<div>
	<h1 onClick={toHome} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	style={{width:50, height:50, display:'inline'}} alt="new"/>
	<hr style={{color:'white'}}></hr>
	<h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("Add")}>Add Program</h2>
	<h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("assign")}>View Programs</h2>
	<h2 style={{color:'white', display:'inline'}} onClick={() => modifyActiveComponent("assign")}>Assign Attendees</h2>
	<br />
    <br />
	
	{activeComponent === "Add" && 	<div>
				<form onSubmit={handleSubmit}>
					<label style={{color:'white', marginRight:15}}>Program Name:</label>
					<input name="name" type="text" value={form.name} onChange={handleChange} required /><br/>
			
					<label style={{color:'white', marginRight:17}}>Location:</label>
					<input name="site" type="text" value={form.site} onChange={handleChange} required /><br/>

					<label style={{color:'white', marginRight:17}}>Date:</label>
					<input name="date" type="date" value={form.date} onChange={handleChange} required /><br/>


					{error && <label id="Error" style={{color: 'red'}}>{error}</label>}

					<button type="submit">Add Program</button>
				</form>
									</div>}
    {activeComponent === "assign" && <div>	
				<h1 style={{color:'white'}}>Programs</h1> 
				<div style={{maxHeight:300, width:200, overflow:'auto'}}>
				{list.map(txt => <p key={txt[1]} style={{color:'white'}}>{txt[0]}</p>)}
				</div>
				</div>}
	{activeComponent === "Current" && <div>	
									<h1 style={{color:'white'}}>Current Programs and Statistics</h1> 
									<div style={{color:'white', maxHeight:350, width:550}} className="chart-box">
									<BarChart
									dataset={[{program:"yoga", num:6}, {program:"summer camp", num:16}, {program:"after school", num:8}, {program:"e", num:60}]}
									xAxis={[{scaleType:"band", dataKey:'program'}]}
									series={[{dataKey:"num"}]}
  									width={500}
  									height={300}/>
									</div>
								 </div>}
	</div>
	</center>
    );
};

export default ProgramManagement