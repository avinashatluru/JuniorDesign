import React, { useState, useEffect, useCallback } from "react";
import { getAllPrograms, getAttendees, getAttendeeNames } from "../actions/programs";
import { getAllAttendance, updatedAttendance } from '../actions/attendance.js';
import { Bar, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto"; 

function ViewAttendance() {
  const [activeComponent, setActiveComponent] = useState("");
  const [currentProgramId, setCurrentProgramId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const ages = ["Select Age Range", "< 10", "10 - 20", "20 - 30", "30 - 40", "40 - 50", "50+"];
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

  useEffect(() => {
    async function fetchAttendance() {
      try {
        const response = await getAllAttendance();
        setAttendance(response.data);
      } catch (error) {
          console.error('Error getting attendees', error.message);
      }
      
    }
  
    fetchAttendance();
  })

  //modifies page based on which header is clicked
	const modifyActiveComponent =(newActiveComponent) => {
		if (newActiveComponent === activeComponent) {setActiveComponent("None");} 
		  else {setActiveComponent(newActiveComponent); console.log(activeComponent)}
		};

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

	function getAttendanceByProgramId() {
		let stuff = {};
		attendance.map(attendance => 
			{if (attendance && attendance.program && attendance.program._id) stuff[attendance.program._id] = attendance});
		return stuff;
	}

  const inWeek = (date) => {
    const input = new Date(date)
    const today = new Date()
    const diff = Math.abs(input - today)
    const week = 7 * 24 * 60 * 60 * 1000
    return diff <= week
  }

  //returns list of integers for each program
  const attendanceData = () => {
		let participation = [];
		programs.forEach(program =>{
      const today = new Date();
      let count = 0;
      let att = getAttendanceByProgramId()[program._id];
      if (att != null){
        let dates = att.dates
        let peops = att.attendees
        for(let i = 0; i < dates.length; i++) {
          if(inWeek(dates[i]) && peops[i] != null){
            count += peops[i].length
          }
        }
      }
      participation.push(count)
    });
		return participation
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

  const calculateAge = (birthday) => {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
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
  
  // Bar chart data for age distribution
  const ageChartData = {
    labels: ageDistribution.map(item => item[0]), // Age ranges
    datasets: [{
      label: 'Number of Attendees',
      data: ageDistribution.map(item => item[1]), // Counts of attendees in each age range
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 3
    }]
  };

  return (
    <center>
      <div className="attendance-view-container">
	      <hr/>
        <h3 className={`${activeComponent=="ListByProgram"? "clickable active" : "clickable"}`} style={{display:'inline', margin:30}} onClick={() => modifyActiveComponent("ListByProgram")}>Participation By Program</h3>
        <h3 className={`${activeComponent=="VisualByProgram"? "clickable active" : "clickable"}`} style={{display:'inline', margin:30}} onClick={() => modifyActiveComponent("VisualByProgram")}>Visualization</h3>

        {activeComponent === "ListByProgram" && <div>	
{/* 
        <button onClick={() => modifyActiveComponent("ListByAge")}>View by Age</button><br/>
         */}
        <select onChange={handleProgramChange} value={currentProgramId}>
          <option value="">Select a program</option>
          {programs.map((program) => (
            <option key={program._id} value={program._id}>
              {program.name}
            </option>
          ))}
        </select><br/>

            {currentProgramId && (
              <>
                <h3 style={{ color: 'white'}}>Attendees:</h3>
                {attendees.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <table>
                      <thead>
                        <tr>
                          <th style={{ color: 'white', borderBottom: '1px solid white' }}>First Name</th>
                          <th style={{ color: 'white', borderBottom: '1px solid white' }}>Last Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendees.map((attendee, index) => (
                          <tr key={index}>
                            <td style={{ color: 'white' }}>{attendee.firstName}</td>
                            <td style={{ color: 'white' }}>{attendee.lastName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: 'white' }}>No attendees to display</p>
                )}
              </>
            )}
          </div>
        }


      {/* {activeComponent === "ListByAge" && <div>	
        <button onClick={() => modifyActiveComponent("ListByProgram")}>View by Program</button><br/>
        <select>{ages.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
        ))}</select>
			</div>} */}

      {activeComponent === "VisualByProgram" && <div>	
      <button onClick={() => modifyActiveComponent("VisualByAge")}>View by Age</button><br/>
        <h4>Participation for this Week</h4>
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
                                borderColor: ["white"],
                                borderWidth: 2,
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

        {activeComponent === "VisualByAge" && <div style={{height:"700px"}}>	
        <button onClick={() => modifyActiveComponent("VisualByProgram")}>View by Program</button><br/>
        <select onChange={handleProgramChange} value={currentProgramId}>
        <option value="">Select a program</option>
        {programs.map((program) => (
          <option key={program._id} value={program._id}>
            {program.name}
          </option>
        ))}
      </select>

      {currentProgramId && (
        <div style={{ maxWidth: '650px', height: '500px' }}>
        <h3>Age Distribution of Attendees</h3>
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

      </div>
    </center>
  );
};

export default ViewAttendance;
