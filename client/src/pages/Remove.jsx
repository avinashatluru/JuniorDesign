import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../actions/users.js";

const Remove = () => {
    document.body.style = 'background: black;';
    const navigate = useNavigate();
    const [attendees, setAttendees] = useState([]);
    const [selectedAttendee, setSelectedAttendee] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAttendees = async () => {
        try {
            const response = await fetch("http://localhost:5050/api/attendees/");
            if (!response.ok) {
            throw new Error('Failed to fetch attendees');
            }
            const data = await response.json();
            setAttendees(data); 
        } catch (error) {
            console.error('Error fetching attendees:', error);
            setError('Failed to fetch attendees');
        }
        };

        fetchAttendees();
    }, []);

    const deleteAttendee = async (id) => {
        try {
        await fetch(`http://localhost:5050/api/attendees/${id}`, {
            method: 'DELETE',
        });
        const updatedAttendees = attendees.filter(attendee => attendee._id !== id);
        setAttendees(updatedAttendees);
        } catch (error) {
        console.error('Failed to delete the attendee:', error);
        setError('Failed to delete the attendee');
        }
    };

    const confirmAndDeleteAttendee = (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this attendee?");
        if (isConfirmed) {
        deleteAttendee(id);
        }
    };

  return (
    <div>
        <button onClick={() => navigate("/Login")}>Logout</button>
        <center>
            <div>
            <h1 onClick={() => navigate("/")} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1>
            <img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
                style={{width:50, height:50, display:'inline', marginRight:100}} alt="new"/>
            </div>
            <hr style={{color:'white'}}></hr>
            <br />
            <div>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <select value={selectedAttendee} onChange={e => setSelectedAttendee(e.target.value)} 
                style={{ display: 'block', fontSize: '1.2em', padding: '10px', marginBottom: '20px' }}>
                <option value="">Select an attendee to remove</option>
                {attendees.map(attendee => (
                <option key={attendee._id} value={attendee._id}>{attendee.firstName} {attendee.lastName}</option>
                ))}
            </select>
                <button onClick={() => selectedAttendee && confirmAndDeleteAttendee(selectedAttendee)}
                style={{ padding: '10px 20px', fontSize: '1em' }}> Remove Selected Attendee </button>
            </div>
        </center>
    </div>
  );
};

export default Remove;
