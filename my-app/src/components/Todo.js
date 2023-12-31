import React,{useState, useEffect} from 'react';
import { GoDotFill } from "react-icons/go";
import axios from 'axios'

function Todo(){

    const [projPopup, setProjPopup] = useState(false);
    const [todoPopup, setTodoPopup] = useState(false);
    const [edittodoPopup, setEdittodoPopup] = useState(false);
    const [editTaskIndex, setEditTaskIndex] = useState(null);
    const [editTaskName, setEditTaskName] = useState('');
    const [editTaskStartDate, setEditTaskStartDate] = useState('');
    const [editTaskDeadline, setEditTaskDeadline] = useState('');
    const [editTaskStatus, setEditTaskStatus] = useState('');
    const [projects, setProjects] = useState(['Freelance Project', 'SBI Outsource', 'HPCL Project 1']);
    const [newProjectName, setNewProjectName] = useState('');
    const [tasks, setTasks] = useState([]);
    const [tasksInProgress, setTasksInProgress] = useState([]);
    const [tasksInReview, setTasksInReview] = useState([]);
    const [tasksCompleted, setTasksCompleted] = useState([]);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskStartDate, setNewTaskStartDate] = useState('');
    const [newTaskDeadline, setNewTaskDeadline] = useState('');
    const [newTaskStatus, setNewTaskStatus] = useState('');
    const [taskNameFilled, setTaskNameFilled] = useState(true);
    const [startDateFilled, setStartDateFilled] = useState(true);
    const [deadlineFilled, setDeadlineFilled] = useState(true);

    useEffect(()=>{
        axios.get('http://localhost:8585/')
        .then(res => console.log(res))
        .catch(err => console.log(err));
    }, [])

    const handleAddNewProjectClick = () => {
        setProjPopup(true);
    };
    const handleClosePopup = () => {
        setProjPopup(false);
    };

    const handleInputChange = (event) => {
        setNewProjectName(event.target.value);
      };
    
    const handleAddProject = () => {
        if (newProjectName.trim() !== "") {
            setProjects([...projects, newProjectName]);
            setNewProjectName("");
            setProjPopup(false);
        }
    };

    const handleTodoPopup = () => {
        setNewTaskName('');
        setNewTaskStartDate('');
        setNewTaskDeadline('');
        setNewTaskStatus('');
        setTaskNameFilled(true);
        setStartDateFilled(true);
        setDeadlineFilled(true);
        setTodoPopup(true);
    }
    const handleTodoClosePopup = () => {
        setTodoPopup(false);
    }

    const handleAddTodo = () => {
        if (!newTaskName.trim()) {
            setTaskNameFilled(false);
            return;
          } else {
            setTaskNameFilled(true);
          }
      
          if (!newTaskStartDate) {
            setStartDateFilled(false);
            return;
          } else {
            setStartDateFilled(true);
          }
      
          if (!newTaskDeadline) {
            setDeadlineFilled(false);
            return;
          } else {
            setDeadlineFilled(true);
          }

        const taskId = Date.now().toString();

        const newTask = {
            id: taskId,
            name: newTaskName,
            startDate: newTaskStartDate,
            deadline: newTaskDeadline,
            status: newTaskStatus,
        };

        // axios.post('http://localhost:8585/addTask', {taskId,newTaskName,newTaskStartDate,newTaskDeadline,newTaskStatus})
        // .then(res => {
        //     console.log(res.data);
        // })
        // .catch(err => console.error(err));

        axios.post('http://localhost:8585/addTask', {
            newTaskName: newTaskName,
            newTaskStartDate: newTaskStartDate,
            newTaskDeadline: newTaskDeadline,
            newTaskStatus: newTaskStatus
        })
        .then(res => {
            console.log(res.data);
        })
        .catch(err => console.error(err));

      
        if (editTaskIndex !== null) {
          const updatedTasks = [...tasks];
          updatedTasks[editTaskIndex] = newTask;
          setTasks(updatedTasks);
          setEditTaskIndex(null);
        }
        
        else {
          switch (newTaskStatus) {
            case 'To Do':
              setTasks([...tasks, newTask]);
              break;
            case 'In Progress':
              setTasksInProgress([...tasksInProgress, newTask]);
              break;
            case 'In Review':
              setTasksInReview([...tasksInReview, newTask]);
              break;
            case 'Completed':
              setTasksCompleted([...tasksCompleted, newTask]);
              break;
            default:
              break;
          }
        }
        setTodoPopup(false);
    };  

    const handleEditTodoPopup = (index) => {
        const taskToEdit = tasks[index];
       console.log("Index:", index);
    console.log("Task to Edit:", taskToEdit);

    setEditTaskIndex(index);
    setEditTaskName(taskToEdit.name);
    setEditTaskStartDate(taskToEdit.startDate);
    setEditTaskDeadline(taskToEdit.deadline);
    setEditTaskStatus(taskToEdit.status);
    setEdittodoPopup(true);
    };

    const handleSaveEditTodo = () => {
        const updatedTask = {
            id: editTaskIndex,
            name: editTaskName,
            startDate: editTaskStartDate,
            deadline: editTaskDeadline,
            status: editTaskStatus,
            statusColor: editTaskStatus,
        };

        console.log('Update values:', editTaskName, editTaskStartDate, editTaskDeadline, editTaskStatus, editTaskIndex);
        axios.put('http://localhost:8585/update', {
            editTaskName,
            editTaskStartDate,
            editTaskDeadline,
            editTaskStatus,
            editTaskIndex,
        })
        .then(res => {
            console.log(res);
            // Fetch updated data from the server after the update
            axios.get('http://localhost:8585/')
                .then(res => {
                    console.log('Updated data from server:', res.data);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));


        let currentStatusTasks = [];
        switch (editTaskStatus) {
          case 'To Do':
            currentStatusTasks = tasks;
            break;
          case 'In Progress':
            currentStatusTasks = tasksInProgress;
            break;
          case 'In Review':
            currentStatusTasks = tasksInReview;
            break;
          case 'Completed':
            currentStatusTasks = tasksCompleted;
            break;
          default:
            break;
        }

        const updatedTasks = currentStatusTasks.filter((task, index) => index !== editTaskIndex);
        switch (editTaskStatus) {
            case 'To Do':
                setTasks([...updatedTasks, updatedTask]);
                break;
            case 'In Progress':
                setTasksInProgress([...updatedTasks, updatedTask]);
                break;
            case 'In Review':
                setTasksInReview([...updatedTasks, updatedTask]);
                break;
            case 'Completed':
                setTasksCompleted([...updatedTasks, updatedTask]);
                break;
            default:
                break;
        }

        setEdittodoPopup(false);
    };

    return(
        <div className='cnotainer'>
            <div className='row'>
                <div className='col-md-2' id='sidebar'>
                    <span id='sidebar_title'>Task boards</span>

                    <div className='projects'>

                        {projects.map((project, index) => (
                            <div key={index} id='project' style={{ backgroundColor: project === 'Freelance Project' ? '#EBEEFC' : 'transparent' }}>
                                <span id='project_title'>{project}</span>
                            </div>
                        ))}

                        <div className='add_project'>
                            <span className='adding_project' onClick={handleAddNewProjectClick} style={{cursor:'pointer'}}>+ Add new Project</span>
                        </div>
                    </div>

                </div>
                <div className='col-md-10' id='main_content'>
                    <span id='main_title'>My Projects</span>
                    <div className='row'>
                        <div className='col-md-3' id='to_do'>
                            <span style={{backgroundColor:'#EBEEFC',borderRadius:'20px',fontSize:'12px',fontWeight:'400',padding:'6px 10px',color:'#3659E2'}}><GoDotFill /> To Do</span><br/>

                            {tasks.map((task, index) => (
                                <div key={index} style={{cursor:'pointer'}} onClick={() => handleEditTodoPopup(index)}>
                                    <br />
                                    <div className='box'>
                                        <div className='box_title'>{task.name}</div>
                                        <div className='dates'>
                                            <div className='row'>
                                                <div className='col-md-6 start_date'>
                                                    <span className='box_date_title'>Start Date</span>
                                                    <br />
                                                    <span className='box_date'>{task.startDate}</span>
                                                </div>
                                                <div className='col-md-6 end_date'>
                                                    <span className='box_date_title'>Deadline</span>
                                                    <br />
                                                    <span className='box_date'>{task.deadline}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <br></br>
                            <button className='btn' style={{fontSize:'13px',backgroundColor:'#EBEEFC',borderRadius:'10px',width:'100%',color:'#3659E2'}} onClick={handleTodoPopup}>+ Add new</button>
                        </div>
                        
                        <div className='col-md-3' id='in_progress'>
                            <span style={{backgroundColor:'#FDF2FA',borderRadius:'20px',fontSize:'12px',fontWeight:'400',padding:'6px 10px',color:'#EE46BC'}}><GoDotFill /> In Progress</span><br/>

                            {tasksInProgress.map((task, index) => (
                                <div key={index} style={{cursor:'pointer'}} onClick={() => handleEditTodoPopup(index)}>
                                    <br />
                                    <div className='box'>
                                        <div className='box_title'>{task.name}</div>
                                        <div className='dates'>
                                            <div className='row'>
                                                <div className='col-md-6 start_date'>
                                                    <span className='box_date_title'>Start Date</span>
                                                    <br />
                                                    <span className='box_date'>{task.startDate}</span>
                                                </div>
                                                <div className='col-md-6 end_date'>
                                                    <span className='box_date_title'>Deadline</span>
                                                    <br />
                                                    <span className='box_date'>{task.deadline}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <br></br>
                            <button className='btn' style={{fontSize:'13px',backgroundColor:'#FDF2FA',borderRadius:'10px',width:'100%',color:'#EE46BC'}} onClick={handleTodoPopup}>+ Add new</button>
                        </div>
                        
                        <div className='col-md-3' id='in_review'>
                            <span style={{backgroundColor:'#ECF6FC',borderRadius:'20px',fontSize:'12px',fontWeight:'400',padding:'6px 10px',color:'#3FA1E3'}}><GoDotFill /> In Review</span><br/>

                            {tasksInReview.map((task, index) => (
                                <div key={index} style={{cursor:'pointer'}} onClick={() => handleEditTodoPopup(index)}>
                                    <br />
                                    <div className='box'>
                                        <div className='box_title'>{task.name}</div>
                                        <div className='dates'>
                                            <div className='row'>
                                                <div className='col-md-6 start_date'>
                                                    <span className='box_date_title'>Start Date</span>
                                                    <br />
                                                    <span className='box_date'>{task.startDate}</span>
                                                </div>
                                                <div className='col-md-6 end_date'>
                                                    <span className='box_date_title'>Deadline</span>
                                                    <br />
                                                    <span className='box_date'>{task.deadline}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            <br/>
                            <button className='btn' style={{fontSize:'13px',backgroundColor:'#ECF6FC',borderRadius:'10px',width:'100%',color:'#3FA1E3'}} onClick={handleTodoPopup}>+ Add new</button>
                        </div>

                        <div className='col-md-3' id='completed'>
                            <span style={{backgroundColor:'#E7F8E9',borderRadius:'20px',fontSize:'12px',fontWeight:'400',padding:'6px 10px',color:'#12BB23'}}><GoDotFill /> Completed</span><br/>

                            {tasksCompleted.map((task, index) => (
                                <div key={index} style={{cursor:'pointer'}} onClick={() => handleEditTodoPopup(index)}>
                                    <br />
                                    <div className='box'>
                                        <div className='box_title'>{task.name}</div>
                                        <div className='dates'>
                                            <div className='row'>
                                                <div className='col-md-6 start_date'>
                                                    <span className='box_date_title'>Start Date</span>
                                                    <br />
                                                    <span className='box_date'>{task.startDate}</span>
                                                </div>
                                                <div className='col-md-6 end_date'>
                                                    <span className='box_date_title'>Deadline</span>
                                                    <br />
                                                    <span className='box_date'>{task.deadline}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <br/>
                            <button className='btn' style={{fontSize:'13px',backgroundColor:'#E7F8E9',borderRadius:'10px',width:'100%',color:'#12BB23'}} onClick={handleTodoPopup}>+ Add new</button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Popup */}

            {projPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className='popup_head'>
                            <span className='popup_title'>Add New Project</span>
                            <span className="close-popup" onClick={handleClosePopup}>&times;</span>
                        </div><br/><br/>
                        <div className='popup_main'>
                            <input className='form-control' placeholder='Enter Project Name' value={newProjectName} onChange={handleInputChange}/>
                        </div>
                        <div className='popup_footer'>
                            <button className='btn btn-sm' style={{backgroundColor:'#EBEEFC',marginRight:'10px',color:'blue'}} onClick={handleClosePopup}>Cancel</button>
                            <button className='btn btn-sm' style={{backgroundColor:'#3659E2', color:'white'}} onClick={handleAddProject}>Add</button>
                        </div>
                    </div>
                </div>
            )}

            {todoPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <div className='popup_head'>
                            <span className='popup_title'>Add new task</span>
                            <span className="close-popup" onClick={handleTodoClosePopup}>&times;</span>
                        </div><br></br>
                        <div className='popup_main'>
                            <div className='task_name'>
                                <label>Name of the Task</label>
                                <input type='text' className='form-control' placeholder='Text' onChange={(e) => setNewTaskName(e.target.value)}/>
                            </div>
                            {!taskNameFilled && <span style={{color:'red',fontSize:'11px'}}>Please fill the task name</span>}
                            <div className='task_dates'>
                                <div className='row'>
                                    <div className='col-md-6 task_start_date'>
                                        <label>Start date</label>
                                        <input className='form-control' type='date' onChange={(e) => setNewTaskStartDate(e.target.value)}/>
                                        {!startDateFilled && <span style={{color:'red',fontSize:'11px'}}>Please fill the start date</span>}
                                    </div>
                                    <div className='col-md-6 task_end_date'>
                                        <label>Deadline</label>
                                        <input className='form-control' type='date' onChange={(e) => setNewTaskDeadline(e.target.value)}/>
                                        {!deadlineFilled && <span style={{color:'red',fontSize:'11px'}}>Please fill the deadline date</span>}
                                    </div>
                                </div>
                            </div>
                            <div className='task_status'>
                                <label>Status</label>
                                <select className='form-control' onChange={(e) => setNewTaskStatus(e.target.value)}>
                                    <option>To Do</option>
                                    <option>In Progress</option>
                                    <option>In Review</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className='popup_footer'>
                            <button className='btn btn-sm' style={{backgroundColor:'#EBEEFC',marginRight:'10px',color:'blue'}} onClick={handleTodoClosePopup}>Cancel</button>
                            <button className='btn btn-sm' style={{backgroundColor:'#3659E2', color:'white'}} onClick={() => handleAddTodo(
                                {
                                    name: newTaskName,
                                    startDate: newTaskStartDate,
                                    deadline: newTaskDeadline,
                                    status: newTaskStatus,
                                    statusColor: newTaskStatus,
                                })}>Add</button>
                        </div>
                    </div>
                </div>
            )}


            {edittodoPopup && (
                <div className="popup">
                <div className="popup-content">
                    <div className='popup_head'>
                    <span className='popup_title'>Edit task</span>
                    <span className="close-popup" onClick={() => setEdittodoPopup(false)}>&times;</span>
                    </div><br></br>
                    <div className='popup_main'>
                    <div className='task_name'>
                        <label>Name of the Task</label>
                        <input type='text' className='form-control' placeholder='Text' value={editTaskName} onChange={(e) => setEditTaskName(e.target.value)} />
                    </div>
                    <div className='task_dates'>
                        <div className='row'>
                        <div className='col-md-6 task_start_date'>
                            <label>Start date</label>
                            <input className='form-control' type='date' value={editTaskStartDate} onChange={(e) => setEditTaskStartDate(e.target.value)} />
                        </div>
                        <div className='col-md-6 task_end_date'>
                            <label>Deadline</label>
                            <input className='form-control' type='date' value={editTaskDeadline} onChange={(e) => setEditTaskDeadline(e.target.value)} />
                        </div>
                        </div>
                    </div>
                    <div className='task_status'>
                        <label>Status</label>
                        <select className='form-control' value={editTaskStatus} onChange={(e) => setEditTaskStatus(e.target.value)}>
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>In Review</option>
                        <option>Completed</option>
                        </select>
                    </div>
                    </div>
                    <div className='popup_footer'>
                    <button className='btn btn-sm' style={{ backgroundColor: '#EBEEFC', marginRight: '10px', color: 'blue' }} onClick={() => setEdittodoPopup(false)}>Cancel</button>
                    <button className='btn btn-sm' style={{ backgroundColor: '#3659E2', color: 'white' }} onClick={handleSaveEditTodo}>Save</button>
                    </div>
                </div>
                </div>
            )}

        </div>
    )
}

export default Todo;