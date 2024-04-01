import React, { useState, useEffect, useCallback } from "react";
import { getAllPrograms, getAttendees, getAttendeeNames } from "../actions/programs";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto"; 

function ViewAttendance() {
  const [activeComponent, setActiveComponent] = useState("");
  const [currentProgramId, setCurrentProgramId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [programs, setPrograms] = useState([]);
  const ages = ["Select Age Range", "< 10", "10 - 20", "20 - 30", "30 - 40", "40 - 50", "50+"]

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

  // Fetch attendees whenever the currentProgramId changes
  useEffect(() => {
    if (currentProgramId) {
      const fetchAttendees = async () => {
        try {
          const response = await getAttendeeNames(currentProgramId);
          setAttendees(response.data);
        } catch (error) {
          console.error('Failed to fetch attendees:', error.message);
          alert('Failed to fetch attendees');
        }
      };

      fetchAttendees();
    }
  }, [currentProgramId]);

  const modifyActiveComponent = useCallback(
	  newActiveComponent => {setActiveComponent(newActiveComponent);},
	  [setActiveComponent]
	);

  const handleProgramChange = (event) => {
    const selectedProgramId = event.target.value;
    setCurrentProgramId(selectedProgramId);
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
      participation.push(program.attendees.length)
    });
		return participation
	};

  return (
    <center>
      <div className="attendance-view-container">
	      <hr style={{color:'white'}}></hr>
        <h3 style={{color:'white', display:'inline', margin:30}} onClick={() => modifyActiveComponent("ListByProgram")}>Participation By Program</h3>
        <h3 style={{color:'white', display:'inline', margin:30}} onClick={() => modifyActiveComponent("VisualByProgram")}>Visualization</h3>

        {activeComponent === "ListByProgram" && <div>	
        <button onClick={() => modifyActiveComponent("ListByAge")}>View by Age</button><br/>
        <select onChange={handleProgramChange} value={currentProgramId}>
          <option value="">Select a program</option>
          {programs.map((program) => (
            <option key={program._id} value={program._id}>
              {program.name}
            </option>
          ))}
        </select>

        {currentProgramId && (
          <>
            <h3 style={{ color: 'white'}}>Attendees:</h3>
            <ul style={{ color: 'white' }}>
                {attendees.length > 0 ? (
                    attendees.map((attendee, index) => (
                      <li key={index}>{attendee.firstName} {attendee.lastName}</li>
                    ))) : 
                    (<li>No attendees to display</li>)
                }
            </ul>
          </>
        )}
			</div>}

      {activeComponent === "ListByAge" && <div>	
        <button onClick={() => modifyActiveComponent("ListByProgram")}>View by Program</button><br/>
        <select>{ages.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
        ))}</select>
			</div>}

      {activeComponent === "VisualByProgram" && <div style={{backgroundColor:"white"}}>	
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

        {activeComponent === "VisualByAge" && <div style={{backgroundColor:"white"}}>	
        <button onClick={() => modifyActiveComponent("VisualByProgram")}>View by Program</button>
        <h1>PARTICIPATION FOR THIS WEEK</h1>
            <div style={{maxWidth: "650px"}}>
                <Pie
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
                                    ["aqua", "red", "green"],
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
};

export default ViewAttendance;
