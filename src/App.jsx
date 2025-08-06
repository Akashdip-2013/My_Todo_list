import { useState, useEffect } from 'react'
import './App.css'
// import Navbar from './navbar'

function App() {

  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState("")

  const [dates, setDates] = useState([])
  const [date, setDate] = useState("")

  const [checked, setChecked] = useState([]);

  const [moved, setMoved] = useState(false)
  const [moves, setMoves] = useState([])


  useEffect(() => {
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    const savedDates = JSON.parse(localStorage.getItem("dates")) || [];
    const savedChecked = JSON.parse(localStorage.getItem("checked")) || [];
    const savedmoves = JSON.parse(localStorage.getItem("moves")) || [];

    setTodos(savedTodos);
    setDates(savedDates);
    setChecked(savedChecked);
    setMoves(savedmoves);

  }, []);

  const handleADD = (e) => {
    e.preventDefault();
    if (todo.trim() === "") return;

    if (new Date(date) < new Date()) {
      alert("Please select a future date and time.");
      return;
    }

    playClickSound();

    const newTodos = [...todos, todo];
    const newDates = [...dates, date];
    const newChecked = [...checked, false];
    const newmoves = [...moves, false];

    setTodos(newTodos);
    setDates(newDates);
    setChecked(newChecked);
    setMoves(newmoves);
    setTodo("");
    setDate("");

    localStorage.setItem("todos", JSON.stringify(newTodos));
    localStorage.setItem("dates", JSON.stringify(newDates)); // ✅ FIXED LINE
    localStorage.setItem("checked", JSON.stringify(newChecked));
    localStorage.setItem("moves", JSON.stringify(newmoves));

    document.getElementById("date").value = "";
    // console.log(dates)
  }

  const toggleCheck = (index) => {
    const updatedChecked = [...checked];
    updatedChecked[index] = !updatedChecked[index];
    setChecked(updatedChecked);
    localStorage.setItem("checked", JSON.stringify(updatedChecked));
  };

  const handleDELETE = async (index) => {

    playClickSound();

    const updatedMoves = [...moves];
    updatedMoves[index] = true;
    setMoves(updatedMoves);


    setTimeout(() => {

      const newTodos = todos.filter((_, i) => i !== index);
      const newDates = dates.filter((_, i) => i !== index);
      const newChecked = checked.filter((_, i) => i !== index);
      const newmoves = moves.filter((_, i) => i !== index);

      setTodos(newTodos);
      setDates(newDates);
      setChecked(newChecked);
      setMoves(newmoves);

      localStorage.removeItem("todos")
      localStorage.removeItem("dates")
      localStorage.removeItem("checked")
      localStorage.removeItem("moves");

      localStorage.setItem("todos", JSON.stringify(newTodos));
      localStorage.setItem("dates", JSON.stringify(newDates));
      localStorage.setItem("checked", JSON.stringify(newChecked));
      localStorage.setItem("moves", JSON.stringify(newmoves));

    }, 500);


  }

  function formatDateTimeLocal(datetimeStr) {
    if (!datetimeStr || !datetimeStr.includes('T')) return datetimeStr;

    const [datePart, timePart] = datetimeStr.split('T'); // "2025-07-23", "12:30"
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const monthIndex = parseInt(month, 10) - 1;
    const monthName = monthNames[monthIndex];

    let hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    hourNum = hourNum % 12 || 12;

    const formattedDate = `${day} ${monthName} ${year}`;
    const formattedTime = `${hourNum}:${minute} ${ampm}`;

    return `${formattedDate} — ${formattedTime}`;
  }

  function complete() {

    const completedCount = checked.filter((val) => val).length;
    return completedCount;

  }

  function playClickSound() {
    const audio = new Audio("/click.mp3");
    audio.play();
  }

  function getCurrentDateTimeLocal() {
    const now = new Date();
    now.setSeconds(0);
    const offset = now.getTimezoneOffset();
    now.setMinutes(now.getMinutes() - offset);
    return now.toISOString().slice(0, 16);
  }

  return (
    <div className=' bg-[#1c1c1e] h-screen px-[2rem] py-[4%] min-h-fit flex justify-center items-center '>
      {/* <Navbar /> */}
      <div className=' flex flex-col justify-center items-center [background:#2c2c2e] w-[35%] min-w-[300px]  rounded-[10px_10px_10px_10px]  p-[1.5rem] px-[0.8rem] m-auto h-[90%] [box-shadow:0px_0px_20px_#FFFFFF0D] '>

        <h1 className=' text-[1.6rem] text-center font-extrabold text-white mb-[0.1rem] '>📝 MY TODO-LIST</h1>

        <form className="inputText flex flex-col  items-center gap-y-3 justify-between w-[100%]  py-[0.2rem] my-[2%] ">

          <input id='date' required type='datetime-local' min={getCurrentDateTimeLocal()} onChange={(e) => setDate(e.target.value)} className='  p-[0.4rem] px-[0.5rem] rounded-[8px] w-[90%] min-w-fit text-[0.85rem] [border-bottom:0.1px_solid_black] filter invert ' />

          {/* <span className=' flex justify-between text-[0.85rem] gap-x-2 max-w-[90%] '> */}
          <input id='task' required type="text" placeholder='Enter task...' value={todo} onChange={(e) => setTodo(e.target.value)} className=' [border-bottom:0.1px_solid_black] placeholder-black filter invert p-[0.4rem] px-[0.5rem] rounded-[8px]  w-[90%] flex flex-wrap overflow-x-hidden ' />

          <button onClick={handleADD} className='bg-[#00f2fe] font-bold px-[0.8rem] py-[0.2rem] rounded-[0.4rem] hover:scale-115 cursor-pointer text-white transition-all duration-[300ms] '>ADD</button>
          {/* </span> */}

        </form>
        {todos.length === 0 && <div className=' mb-2 text-center text-gray-400 text-[1rem] '>No Todos to display 😴</div>}

        {todos.length !== 0 && <div className=' mb-2 text-center text-gray-400 text-[1rem] '> Tasks: {todos.length} | Left: {todos.length - complete()} </div>}
        <div className="allTasks w-[87%] h-[100%] overflow-auto scrollbar-hide  ">
          {
            todos.map((item, index) => (
              <div id={index} key={index} className={"tasks w-[100%] flex flex-col py-[0.1rem] "}>

                <div className={`todos text-white flex items-start justify-between bg-[#1c1c1e] p-[0.5rem] overflow-x-auto scrollbar-hide rounded-[0.5rem] my-[0.2rem] gap-x-[5%]  [box-shadow:0px_2px_2px_#444] transition-transform  [animation-fill-mode:backwards] ${moves[index] ? 'translate-x-[-100%] opacity-50 duration-500 ' : 'translate-x-[0%] duration-0 '}`}>
                  <span className='flex flex-wrap gap-2 items-baseline w-[60%]  scrollbar-hide '>
                    <input type="checkbox" className=' mr-[0.4rem] cursor-pointer ' checked={checked[index] || false} onChange={() => toggleCheck(index)} />
                    <div className=' overflow-x-auto scrollbar-hide '>
                      <h1 className={`text-[90%] flex flex-wrap ${checked[index] ? 'line-through text-gray-500' : ''}`}>{item}</h1>
                    </div>
                    {dates[index].length != 0 && <p className=' [text-decoration:underline] text-[#B0BEC5] text-[68%] '>
                      Due: {formatDateTimeLocal(dates[index])}
                    </p>}
                  </span>
                  <button onClick={() => { handleDELETE(index) }} className=' [background:crimson] text-white px-[0.6rem] rounded-[0.3rem] font-bold h-[1.5rem] hover:scale-110 cursor-pointer transition-all duration-[200ms] text-[100%] w-30% [border-bottom:0.1px_solid_white] '>Delete</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default App
