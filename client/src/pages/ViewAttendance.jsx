import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPrograms, getAttendees, getAttendeeNames } from "../actions/programs";
import { getAllUsers } from "../actions/users";
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto"; 
import { Select } from "@mui/material";

function ViewAttendance() {
  const navigate = useNavigate();
  const [activeComponent, setActiveComponent] = useState("");
  const [currentProgramId, setCurrentProgramId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [programs, setPrograms] = useState([]);
  const ages = ["Select Age Range", "< 10", "10 - 20", "20 - 30", "30 - 40", "40 - 50", "50+"]
  const [ageDistribution, setAgeDistribution] = useState([]);

  Chart.defaults.color = "#FFFFFF";
  Chart.defaults.borderColor = "rgba(0, 0, 0, 0.6)"

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

  const calculateAgeDistribution = (attendees) => {
    const ageRanges = {
      '0-4': 0,
      '5-9': 0,
      '10-14': 0,
      '15-19': 0,
      '20-24': 0,
      // Add more ranges as needed
    };

    attendees.forEach(attendee => {
      const age = calculateAge(new Date(attendee.birthday));
      const range = `${Math.floor(age / 5) * 5}-${Math.floor(age / 5) * 5 + 4}`;
      if (ageRanges[range] !== undefined) {
        ageRanges[range]++;
      } else {
        ageRanges[range] = 1;
      }
    });

    return Object.entries(ageRanges).sort((a, b) => a[0].localeCompare(b[0], undefined, {numeric: true, sensitivity: 'base'}));
  };

  useEffect(() => {
    if (currentProgramId) {
      getAttendeeNames(currentProgramId).then(response => {
        const attendees = response.data;
        const ageRanges = calculateAgeDistribution(attendees);
        console.log(ageRanges);
        setAgeDistribution(ageRanges);
      })
      .catch(error => console.error('Failed to fetch attendees:', error.message));
    }
  }, [currentProgramId]);
  

  
  //returns list of integers for each program
  const attendanceData = () => {
		let participation = [];
		programs.forEach(program =>{
      participation.push(program.attendees.length)
    });
		return participation
	};
  const calculateAge = (birthday) => {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };
  // Bar chart data for age distribution
  const ageChartData = {
    labels: ageDistribution.map(item => item[0]), // Age ranges
    datasets: [{
      label: 'Number of Attendees',
      data: ageDistribution.map(item => item[1]), // Counts of attendees in each age range
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const toHome = () => {
    navigate("/");
  };

  return (
    <center>
      <div className="attendance-view-container">
        <h1 onClick={toHome} style={{color:'white', fontSize:65, display:'inline'}}>RATL</h1> 
	      <img src="https://images.squarespace-cdn.com/content/v1/614c9bfd68d9c26fdceae9fc/99fd7e14-ab6c-405b-8de8-225103396a29/Circle-Logo-%28Line%29.png"
	      style={{width:50, height:50, display:'inline'}} alt="new"/>
	      <hr style={{color:'white'}}></hr>
        <h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("ListByProgram")}>Participation By Program</h2>
        <h2 style={{color:'white', display:'inline', marginRight:260}} onClick={() => modifyActiveComponent("VisualByProgram")}>Visualization</h2>

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

      {activeComponent === "VisualByAge" && <div style={{backgroundColor:"white"}}>	
      <select onChange={handleProgramChange} value={currentProgramId}>
        <option value="">Select a program</option>
        {programs.map((program) => (
          <option key={program._id} value={program._id}>
            {program.name}
          </option>
        ))}
      </select>

      {currentProgramId && (
        <div style={{ width: '600px', height: '500px' }}>
        <h2>Age Distribution of Attendees</h2>
        <Bar data={ageChartData} options={{ 
          scales: {
            y: {
              beginAtZero: true
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }} />
      </div>
      )}
			</div>}

      {activeComponent === "VisualByProgram" && <div >	
      <button onClick={() => modifyActiveComponent("VisualByAge")}>View by Age</button>
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
