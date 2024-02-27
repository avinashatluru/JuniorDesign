import React, {useCallback, useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select"
import programsActions from "../actions/programs";

function UserManagement() {

    const nav = useNavigate();
	const [programs, setPrograms] = useState([]);
	const [newProgram, setNewProgram] = useState({ name: "", date: "", type: "", site: "" });
	const [selectedAttendees, setSelectedAttendees] = useState([]);
	const [currentProgram, setCurrentProgram] = useState("select a program")
    document.body.style = 'background: black';
	const programss = [{label:"program1", value:"program1"}, {label:"program2", value:"program2"}]
	let p1 = ["parta1", "parta2", "parta3", "parta1", "parta2", "parta3", "parta1", "parta2", "parta3", "parta1", "parta2", "parta3", "parta1", "parta2", "parta3"]
	let p2 = ["partb1", "partb2", "partb3"]
	const [currList, setCurrList] = useState([])

	const handleSelect = (e) => {
		setCurrentProgram(e.label)
		switchList()
	}

	const switchText = () => {
		let x;
		currentProgram === "select a program"
			?(x = "program")
			:(x = currentProgram)
		return x
	}

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

    const people = [{label:"jim", value:'e'}, {label:"tim", value:'e'}, {label:"bob", value:'e'},]

    // const time = [{label:"1:00", value:"1am"}, {label:"2:00", value:"2am"}, {label:"3:00", value:"3am"},
    // {label:"4:00", value:"4am"}, {label:"5:00", value:"5am"}, {label:"6:00", value:"6am"}, {label:"7:00", value:"7am"}, 
    // {label:"8:00", value:"8am"}, {label:"9:00", value:"9am"}, {label:"10:00", value:"10am"}, {label:"11:00", value:"11am"},
    // {label:"12:00", value:"12pm"}, {label:"13:00", value:"1pm"}, {label:"14:00", value:"2pm"}, {label:"15:00", value:"3pm"},
    // {label:"16:00", value:"4pm"}, {label:"17:00", value:"5pm"}, {label:"18:00", value:"6pm"}, {label:"19:00", value:"7pm"},
    // {label:"20:00", value:"8pm"}, {label:"21:00", value:"9pm"}, {label:"22:00", value:"10pm"}, {label:"23:00", value:"11pm"}, {label:"24:00", value:"12am"}]

    const [activeComponent, setActiveComponent] = useState("projects");

	const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);

    // Function to fetch programs from the backend
    const fetchPrograms = async () => {
        try {
            const response = await programsActions.getAllPrograms();
            setPrograms(response.data); // Update the programs state with fetched data
        } catch (error) {
            console.error("Failed to fetch programs:", error);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    // Function to handle the form submission for adding a new program
    const handleAddProgram = async (event) => {
        event.preventDefault();
        try {
            // Call the createProgram action and pass the newProgram state
            await programsActions.createProgram(newProgram);
            // Reset the newProgram state to clear the form fields
            setNewProgram({ name: "", date: "", type: "", site: "" });
            // Fetch the updated list of programs to include the newly added program
            fetchPrograms();
        } catch (error) {
            console.error("Failed to add program:", error);
        }
    };

	// Handle form submit for adding a new program
	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			await programsActions.createProgram(newProgram);
			// re-fetch programs or just update the local state
			setPrograms([...programs, newProgram]);
			setNewProgram({ name: "", date: "" }); // Reset form
		} catch (error) {
		  	console.error("Failed to add program:", error);
		}
	};
	

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
                <h1 onClick={toHome} style={{ color: 'white', fontSize: 65, display: 'inline' }}>RATL</h1>
                <img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
                     style={{ width: 50, height: 50, display: 'inline' }} alt="new" />
                <hr style={{ color: 'white' }}></hr>
                <h2 style={{ color: 'white', display: 'inline', marginRight: 260 }} onClick={() => setActiveComponent("Add")}>Add Program</h2>
				<h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("Attend")}>Attendance</h2>
                <h2 style={{ color: 'white', display: 'inline' }} onClick={() => setActiveComponent("assign")}>Assign Attendees</h2>
                <br /><br />
	{activeComponent === 'Add' && (
											<form onSubmit={handleSubmit}>
												<div>
													<label style={{ color: 'white', marginRight: 15 }}>Program Name:</label>
													<input
														type="text"
														value={newProgram.name}
														onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
														required
													/><br />
													<label style={{ color: 'white', marginRight: 17 }}>Date:</label>
													<input
														type="date"
														value={newProgram.date}
														onChange={(e) => setNewProgram({ ...newProgram, date: e.target.value })}
														required
													/><br />
													<label style={{ color: 'white', marginRight: 17 }}>Type of Program:</label>
													<select
														value={newProgram.type}
														onChange={(e) => setNewProgram({ ...newProgram, type: e.target.value })}
														required
													>
														<option value="">Select a program type</option>
														<option value="After School">After School</option>
														<option value="Summer Camp">Summer Camp</option>
														<option value="Spiritual Development">Spiritual Development</option>
														<option value="Summer Staff">Summer Staff</option>
														<option value="Family Events">Family Events</option>
													</select><br />
													<label style={{ color: 'white', marginRight: 17 }}>Site:</label>
													<select
														value={newProgram.site}
														onChange={(e) => setNewProgram({ ...newProgram, site: e.target.value })}
														required
													>
														<option value="">Select a site</option>
														<option value="North Avenue">North Avenue</option>
														{/* Add more site options as necessary */}
													</select><br />
													<button type="submit">Add Program</button>
												</div>
											</form>
										)}
    {activeComponent === "assign" && <div>	
										<h1 style={{color:'white'}}>Assign Attendees to Programs</h1> 
										<div style={{maxHeight:300, width:400, overflow:'auto'}}>
										<label style={{color:'white', marginRight:17}}>Select Attendees:</label>
										<Select isMulti name="attendee" options={people}>
                                        </Select>
                                        <label style={{color:'white', marginRight:17}}>Select Program:</label>
										<select class="program">
                                            <option value="">Select a program</option>
						                    <option value="After School">After School</option>
						                    <option value="Summer Camp">Summer Camp</option>
						                    <option value="Spiritual Developement">Spiritual Developement</option>
						                    <option value="Summer Staff">Summer Staff</option>
						                    <option value="Family Events">Family Events</option>
										</select><br/>
                                        <label style={{color:'white', marginRight:17}}>Site:</label>
					                    <select name="site">
						                    <option value="">Select a site</option>
					                        <option value="North Avenue">North Avenue</option>
					                    </select><br/>
										<button type="submit">Submit</button>
										</div>
										</div>}
	{activeComponent === "Attend" && <div>	
									<h1 style={{color:'white'}}>Select Program</h1> 
									<Select options={programss} value={currentProgram} onChange={handleSelect}></Select><br/>
									<h1 style={{color:'white'}}>Mark Attendance for {switchText()}</h1> 								<div style={{color:'white', maxHeight:200, width:200, overflow:'auto'}} className="list-container">
       								{currList.map((item, value) => (
       									<div key={value}>
											<input value={item} type="checkbox" />
        										<span>{item}</span>
       										</div>))}
   									</div> <br/>
									<button type="submitAttendance">Mark Attendance</button>
								 </div>}
	</div>
	</center>
    );
};


export default UserManagement