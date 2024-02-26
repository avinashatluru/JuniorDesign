import React from 'react';
import { useNavigate } from "react-router-dom";

function AddConfirm() {

    const nav = useNavigate();
    //Shut up VSCode's typescript linter
	//@ts-ignore
	document.body.style = 'background: black';

    const toHome = () => {
		nav("/")
	};

    const toAdd = () => (
		nav("/Add")
	);

    return (
	    <center>
	    <div>
	    <h1 onClick={toHome} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	    <img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	    style={{width:50, height:50, display:'inline', marginRight:100}} alt="new"/>
	    </div>
	    <hr style={{color:'white'}}></hr>
	    <br />
        <h1 id="confirm" style={{color:'white'}}> New Attendee was Successfully Added </h1>
        <button onClick={toHome}>Return to Home</button>
        <button onClick={toAdd}>Add Another Attendee</button>
        </center>
    );
};

export default AddConfirm