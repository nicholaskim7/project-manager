import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
function ProjectOverview() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [projectError, setProjectError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(true);
  const [taskError, setTaskError] = useState(null);

  // using slug from url param fetch project info
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchProject() {
      setProjectLoading(true);
      setProjectError(null);
      try {
        const res = await fetch(`http://localhost:8081/api/projects/${slug}`, { signal });

        if (! res.ok) {
          throw new Error(`Failed to fetch project: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        // ignore error if caused by abortController
        if (err.name === 'AbortError') {
          console.log('Project fetch aborted');
          return;
        }
        setProjectError(err.message);
      } finally {
        setProjectLoading(false);
      }
    }
    fetchProject();

    return () => {
      controller.abort();
    };
  }, [slug]);

  useEffect(() => {
    // if no project id meaning the above fetch for project failed dont continue
    if(!project?.project_id) return;

    async function fetchTasks() {
      setTaskLoading(true);
      setTaskError(null);
      
      try {
        const res = await fetch(`http://localhost:8081/api/projects/${project.project_id}/tasks`);
        // no need to throw error here since we successfully tried to fetch and determined there are no rows
        if (res.status === 404) {
          setTasks([]);
          return;
        }
        // if there was an actual error
        if (! res.ok) {
          throw new Error(`Failed to fetch tasks: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setTasks(data);
      } catch (err) {
        // ignore error if caused by abortController
        if (err.name === 'AbortError') {
          console.log('Task fetch aborted');
          return;
        }
        setTaskError(err.message);
      } finally {
        setTaskLoading(false);
      }
    }
    fetchTasks();
  }, [project?.project_id]);

  if (projectLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Project...</span>
        </div>
      </div>
    );
  }

  if (projectError) return <p style={{ color: 'red' }}>Error: {projectError}</p>;
  if (!project) return null;
  

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

  const handleAddTask = (projectId) => {
        navigate(`/new-task/projects/${projectId}`);
  }

  return (
    <div className="container my-5"> 
      <div className="row justify-content-center">
        <div className="col-md-10">
          
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-2">
              <h1 className="fw-bold text-dark m-0">{project.project_name}</h1>
              <span className="text-muted fs-6">Started: {formatDate(project.date_created)}</span>
            </div>
            <p className="text-secondary fs-5">{project.description}</p>
          </div>

          <hr className="my-4" />

          <div className="mt-4">
            <h4 className="fw-semibold mb-3">Project Tasks</h4>
            <div className="text-muted p-4 bg-light border rounded text-center">
              <button className='btn btn-success' onClick={() => handleAddTask(project.project_id)}>New Task</button>
               {/* inline conditional rendering for task states */}
              {taskLoading ? (
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading Task...</span>
                    </div>
              ) : taskError ? (
                <p style={{ color: 'red' }}>Error: {taskError}</p>
              ) : tasks.length === 0 ? (
                <p>No tasks yet.</p>
              ) : (

                <div>
                  <table className='table'>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Description</th>
                      <th>Date Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tasks.map((data)=> (
                        <tr key={data.tasks_id} style={{cursor: 'pointer'}}>
                          <td>{data.task_title}</td>
                          <td>{data.description}</td>
                          <td>{formatDate(data.date_created)}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div> 
  ); 
} 

export default ProjectOverview