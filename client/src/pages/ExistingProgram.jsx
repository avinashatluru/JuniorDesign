import React,{useCallback,  useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



function ExistingProgram () {
    const [programs, setPrograms] = useState([]);
    useEffect(() => {
        // Function to fetch data from the database
        const fetchPrograms = async () => {
          try {
            const response = await axios.get("/api/programs"); // Assuming you have an API endpoint for fetching programs
            setPrograms(response.data);
          } catch (error) {
            console.error("Error fetching programs:", error);
          }
        };
    
        fetchPrograms();
      }, []);
    
      const handleProgramClick = (program) => {
        // Handle click on program button, later need to implement click the button to diplay program user list function
        console.log("Clicked program:", program);
      };
    
      return (
        
        <div>
            <h1>Existing Programs</h1>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <button style={{width: "150px", height: "20px", marginBottom: "20px"} }>Summer Camp</button>
                <button style={{width: "150px", height: "20px", marginBottom: "20px"} }>After School</button>
                <button style={{width: "150px", height: "20px", marginBottom: "20px"} }>Spiritual Development</button>
            </div>
            {/* Created temp buttons above to show the functionaties, will remove once the db connection is fixed */}
            {programs.map((program) => (
                <div key={program._id}>
                    <div>Name: {program.Name}</div>
                    <div>Creation Date: {program.Date}</div>
                    <div>Program Type: {program.type}</div>
                </div>
            ))}

        </div>
      );

};
export default ExistingProgram;