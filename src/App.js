import React, { useState, useEffect } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import Todo from "./Todo";
import { db } from "./firebase";
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import axios from "axios";

const style = {
  bg: `w-full `,
  banner: `w-screen bg-slate-800 text-white sm:text-sm md:text-1xl md:p-4 sm:h-12 font-bold top-0 md:h-10  flex items-center justify-center  p-2`,
  container: `bg-slate-100 bg-opacity-20 md:bg-opacity-100 max-w-[500px] md:w-full m-auto mt-20 rounded-md shadow-2xl p-4 z-0`,
  heading: `text-6xl font-bold text-center  mb-4 text-gray-800 p-2`,
  line: `bg-slate-500 w-25 mx-10 mb-4 h-1 rounded`,
  form: `flex justify-between m-5 px-4 z-2 `,
  input: ` focus:outline-none focus:border-cyan-400 focus:border-2 border-2 p-2 w-full text-xl  shadow-md rounded-lg mt-2`,
  button: `ring-white ring-1.5 p-4 ml-4 bg-cyan-400  text-slate-100 rounded-full text-xs mt-2 hover:bg-cyan-600`,
  quote: `text-center `,
  quotebtn: `ml-4 pt-2.5 text-center  `,
  count: `text-center font-bold    p-2`,
};

//set states for todo app
function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

 


  // Create todo
  const createTodo = async (e) => {
    e.preventDefault(e);
    if (input === '') {
      alert("Please enter a valid todo");
      return
    }else{
      setInput("")
      await addDoc(collection(db, "TodoApp"), {
        text: input,
        completed: false,
       
        
      })
    } if(input.length >2){
        setInput('')
    }
  
  

  };


  // Read todo from firebase
  useEffect(() => {
    const q = query(collection(db, "TodoApp"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
    });
    return () => unsubscribe();
  }, []);

  // Update todo in firebase
  const toggleComplete = async (todo) => {
    await updateDoc(doc(db, "TodoApp", todo.id), {
      completed: !todo.completed,
    });
  };

  
  // Delete todo
  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "TodoApp", id));
  };

  const getQuotes = () => {
    axios
      .get("https://api.quotable.io/random")
      .then((res) => {
        console.log(res);
        setQuote(res.data.content);
        setAuthor(res.data.author);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={style.bg}>
      <div className={style.banner}>
        <div>
          <>
            {quote.length < 1 ? (
              <p>Get the quote of the day </p>
            ) : (
              <p className={style.qoute}>
                {quote}  {author}
              </p>
            )}{" "}
          </>
        </div>
        <div>
          {" "}
          <>
            <button className={style.quotebtn} onClick={getQuotes}>
              {" "}
              <BsFillArrowRightCircleFill />
            </button>
          </>
        </div>
      </div>

      <div className={style.container}>
        <h3 className={style.heading}>TO-DO </h3>
        <hr className={style.line} />
        <form onSubmit={createTodo} className={style.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={style.input}
            type="text"
            placeholder="Add Todo"
          />
          <button  className={style.button}>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <Todo
              key={index}
              todo={todo}
              toggleComplete={toggleComplete}
              deleteTodo={deleteTodo}
            />
          ))}
        </ul>
        {todos.length < 1 ? null : (
          <p className={style.count}>{`Remaing tasks: ${todos.length} `}</p>
        )}
      </div>
    </div>
  );
}

export default App;
