import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProjectDashboard() {
    const backgroundImage = "/high-tech-pic.png"
    const [projects, setProjects] = useState([])
    const navigate = useNavigate();

    const handleProjectNav = (projectSlug) => {
      navigate(`/project/${projectSlug}`);
    }

    const handleAddProject = () => {
        navigate('/new-project');
    }

    useEffect(() => {
        axios.get('http://localhost:8081/api/projects')
        .then(res => setProjects(res.data))
        .catch(err => console.error(err));
    }, [])

    const formatDate = (dateString) => {
      if (!dateString) {
        return "N/A";
      }
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
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
              <th>Project</th>
              <th>Description</th>
              <th>Author</th>
              <th>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {
              projects.map((data)=> (
                <tr key={data.project_id} onClick={() => handleProjectNav(data.slug)} style={{cursor: 'pointer'}}>
                  <td>{data.project_name}</td>
                  <td>{data.description}</td>
                  <td>{data.author_id}</td>
                  <td>{formatDate(data.date_created)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>

      </div>

    </div>
  )
}

export default ProjectDashboard