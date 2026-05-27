import React, { useState } from 'react'
import { useParams } from 'react-router-dom';

function CreateTask() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        task_title: '',
        description: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('form submited: ', formData);
        // logic to send data to server
        try {
            const response = await fetch(`http://localhost:8081/api/projects/${id}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error(`http error! status: ${response.status}`);
            }

            const createdTask = await response.json();
            console.log('task successfully created: ', createdTask);
            setFormData({ task_title: '', description: ''});
        } catch (error) {
            console.error('failed to create task:', error);
        }
    }
  return (
    <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
        <div className='w-40 bg-white rounded p-3'>
            <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="task_title" className="form-label">Task title:</label>
                <input
                type="text"
                id="task_title"
                name="task_title"
                value={formData.task_title}
                onChange={handleChange}
                className="form-control"
                />
            </div>
            <div>
                <label htmlFor="description" className="form-label">description:</label>
                <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                />
            </div>
            <button className='btn btn-success' type="submit">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default CreateTask