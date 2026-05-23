import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Project() {
    const backgroundImage = "/high-tech-pic.png"
    const [projects, setProjects] = useState([])
    const navigate = useNavigate();

    const handleProjectNav = (projectName) => {
        const cleanedProjectName = projectName.trim().replace(/\s+/g, '-');
        navigate(`/project/${cleanedProjectName}`);
    }

    const handleAddProject = () => {
        navigate('/new-project');
    }

    useEffect(() => {
        axios.get('http://localhost:8081/api/projects')
        .then(res => setProjects(res.data))
        .catch(err => console.error(err));
    }, [])
  return (

    <div className='d-flex vh-100 justify-content-center align-items-center' style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}
    >
      <div className='w-50 bg-white rounded p-3'>
        <button className='btn btn-success' onClick={() => handleAddProject()}>New Project</button>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {
              projects.map((data)=> (
                <tr key={data.id} onClick={() => handleProjectNav(data.name)} style={{cursor: 'pointer'}}>
                  <td>{data.name}</td>
                  <td>{data.description}</td>
                  <td>{data.author_id}</td>
                </tr>
              ))
            }
          </tbody>
        </table>

      </div>

    </div>
  )
}

export default Project