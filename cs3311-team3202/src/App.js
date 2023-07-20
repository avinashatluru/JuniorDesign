import './App.css';
import { BrowserRouter as Router, Route, Navigate, Routes,} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Add from "./pages/Add";
import AddConfirm from "./pages/AddConfirm";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}/>
        <Route path="/Login" element={<Login />}/>
        <Route path="/Add" element={<Add />}/>
        <Route path="/AddConfirm" element={<AddConfirm />}/>
        <Route path="*" element={<Navigate to="/Login"replace={true}/>} />
      </Routes>
    </Router>
  );
}

export default App;
