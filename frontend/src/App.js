import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProjectDashboard from './ProjectDashboard'
import CreateProject from './CreateProject'
import ProjectOverview from './ProjectOverview'
import CreateTask from './CreateTask'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProjectDashboard />}></Route>
          <Route path='/new-project' element={<CreateProject />}></Route>
          <Route path='/project/:slug' element={<ProjectOverview />}></Route>
          <Route path='new-task/projects/:id' element={<CreateTask />}></Route> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
