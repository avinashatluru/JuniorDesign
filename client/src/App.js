import React from "react";
 
// We use Route in order to define the different routes of our application
import { BrowserRouter as Router, Route, Navigate, Routes,} from "react-router-dom";
 
// We import all the components we need in our app
import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Add from "./pages/Add";
import AddConfirm from "./pages/AddConfirm";
import UserManagement from "./pages/UserManagement";
import ProgramManagement from "./pages/ProgramManagement";
import Attendance from "./pages/Attendance";
import Remove from "./pages/Remove";
import ViewAttendance from "./pages/ViewAttendance";
import ExportToCsv from "./pages/ExportToCsv";

const App = () => {
 return (
   <div>
     <Routes>
       <Route path="/Login" element={<Login />}/>
       <Route exact path="/" element={<Home />}/>
       <Route path="/Add" element={<Add />}/>
       <Route path="/Remove" element={<Remove />} />
       <Route path="/AddConfirm" element={<AddConfirm />}/>
       <Route path="/UserManagement" element={<UserManagement />}/>
       <Route path="/ProgramManagement" element={<ProgramManagement />}/>
       <Route path="/Attendance" element={<Attendance />}/>
       <Route path="/ViewAttendance" element={<ViewAttendance />}/>
       <Route path="/ExportToCsv" element={<ExportToCsv />}/>
       <Route path="*" element={<Navigate to="/Login"replace={true}/>} />
     </Routes>
   </div>
 );
};
 
export default App;
