import React, {useCallback, useState} from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select"


function UserManagement() {

    const nav = useNavigate();
    document.body.style = 'background: black';

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

    return (
	<center>
	<div>
	<h1 onClick={toHome} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	<img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	style={{width:50, height:50, display:'inline'}} alt="new"/>
	<hr style={{color:'white'}}></hr>
	<h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("Add")}>Add Program</h2>
	<h2 style={{color:'white', display:'inline'}} onClick={() => modifyActiveComponent("assign")}>Assign Attendees</h2>
	<br />
    <br />
	{activeComponent === "Add" && 	<div>
										<label style={{color:'white', marginRight:15}}>Program Name:	</label>
										<input name="Username" type="text" id="name" required /><br/>
										<label style={{color:'white', marginRight:17}}>Date:</label>
					                    <input name="birthDay" type="date"/><br/>
                                        <label style={{color:'white', marginRight:17}}>Type of Program:</label>
					                    <select name="program">
						                    <option value="">Select a program</option>
						                    <option value="After School">After School</option>
						                    <option value="Summer Camp">Summer Camp</option>
						                    <option value="Spiritual Developement">Spiritual Developement</option>
						                    <option value="Summer Staff">Summer Staff</option>
						                    <option value="Family Events">Family Events</option>
					                    </select><br/>
										{/* <label style={{color:'white', marginRight:17}}>Start Time:		</label>
										<Select options={time}/><br/>
										<label style={{color:'white', marginRight:17}}>End Time:		</label>
										<Select options={time}/><br/>
										<label style={{color:'white', marginRight:17}}>Max no. of participants:</label>
					                    <input name="capacity" type="text"/><br/> */}
                                        <label style={{color:'white', marginRight:17}}>Site:</label>
					                    <select name="site">
						                    <option value="">Select a site</option>
					                        <option value="North Avenue">North Avenue</option>
					                    </select><br/>
                                        </div>}
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
										<button type="submit">Remove</button>
										</div>
										</div>}
	</div>
	</center>
    );
};

export default UserManagement