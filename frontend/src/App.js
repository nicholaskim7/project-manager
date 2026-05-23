import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Project from './Project'
import CreateProject from './CreateProject'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Project />}></Route>
          <Route path='new-project' element={<CreateProject />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
