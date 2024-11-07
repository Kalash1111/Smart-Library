import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BsFillFileEarmarkPlusFill } from "react-icons/bs"
import bg from "./bookpc.jpg"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useTeacher } from "../../components/TeacherContext";
import TeacherLogin from "../../components/TeacherLogin";

// const jwt = require('jsonwebtoken');

function Book() {
    const baseUrl = "http://localhost:8000/api/books";
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLog, setIsLog] = useState(localStorage.getItem("isLog") === "true");

    const student_logout = () => {
        localStorage.setItem("isLog", "false");
        setIsLog(false);
    }


    const [teacherId, setTeacherId] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [tloggedIn, settLoggedIn] = useState(false);

    useEffect(() => {
            // Check if the user is already logged in from previous sessions
            const storedLoggedIn = localStorage.getItem("loggedtIn");
            if (storedLoggedIn === "true") {
            settLoggedIn(true);
            }
        }, []);

        const loginAsTeacher = () => {
            if (teacherId === "6969" || teacherId === "7272") {
            settLoggedIn(true);
            localStorage.setItem("loggedtIn", "true"); // Store login status in local storage
            } else {
                console.error("Err");
            }
        };

        const logout = () => {
            settLoggedIn(false);
            localStorage.setItem("loggedtIn","false"); // Remove the login status from local storage
        };


    
 
    useEffect(() => {
        const fetchData = async() => {
            try {
                
                let url = baseUrl;
                if(selectedCategory) {
                url += `?category=${selectedCategory}`
                }

                const response = await fetch(url);
                if(!response.ok) {
                    throw new Error("Try Again Failed to fetch Data");
                }

                const jsonData= await response.json();
                setData(jsonData);
                setIsLoading(false);


            } catch (error) {
                console.log(error);
                setError("Error fecthing Data lol");
                setIsLoading(false);
            }
        }
        fetchData();
    }, [selectedCategory])


  return (
    <div>
        <h1>Books</h1>
        <p style={{color:"cyan"}}>A book is a medium for recording information in the form of writing or images, 
        typically composed of many pages bound together and protected by a cover. <span style={{color:"lightgreen"}}>
        This SmartLibrary is a digital repository of books, documents, journals, articles, 
        and other written or multimedia content that can exponentially increase a learner's learning speed. </span>
        This SmartLibrary will greatly help many in the need of quick resources for adding to their knowledge. </p>
        <img src={bg} alt="girl-with-sword" style={{borderRadius:"5px"}} />
        <br />
        <br />        
        {/* <TeacherLogin /> */}



        {tloggedIn? (
        <div>
          <p>Logged in as a teacher.</p>
          <Link to="/createbook"><BsFillFileEarmarkPlusFill size={20} /> Add New Book</Link>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <label htmlFor="teacherId">Enter Teacher ID: </label>
          <p style={{textAlign:"right", display:"flex", margin:"2px"}}>
          <input
            type="text"
            id="teacherId"
            placeholder="Enter your teacher ID"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          />
          <button onClick={loginAsTeacher} style={{padding:"2px", marginLeft:"5px"}}>Login</button></p>
        </div>
      )}



        

        {/* {loggedIn ? <Link to="/createbook"><BsFillFileEarmarkPlusFill size={20} /> Add New Book</Link> : "Please log in as teacher to add and view books"} */}
        <p style={{textAlign:"left"}}>
        <GoogleOAuthProvider clientId="708742317572-ph8lfs19qhs3mrtv7s93bebp3ruiko7m.apps.googleusercontent.com">
        Login as student : {!isLog ? (<GoogleLogin
          onSuccess={credentialResponse => {
            localStorage.setItem("isLog", "true");
            setIsLog(true);
            console.log(credentialResponse);
          }}
          onError={() => {
            setIsLog(false);
            console.log('Login Failed');
          }}
          
        />) : <button onClick={student_logout}>Logout</button>}
        </GoogleOAuthProvider></p>
        
        {isLog ? "Successfully logged in" : "Not Logged in"} <br /><br />


        


        
        

        <h2>Books List</h2>
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        {/* <div className="filters">
          <label style={{"color":"cyan"}}>Sort by: </label>
          <select onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">All</option>
            <option value="sem1">Sem1</option>
            <option value="sem2">Sem2</option>
            <option value="sem3">Sem3</option>
            <option value="sem4">Sem4</option>
            <option value="ece">ECE</option>
            <option value="maths">Maths</option>
          </select>
        </div> */}


        {/* <div className="filters">
            <label style={{color:"cyan"}}>Sort by: </label>
                <select onChange={(e)=> setSelectedCategory(e.target.value)}>
                <option value="">All</option>
                <option value="sem1">Sem1</option>
                <option value="sem2">Sem2</option>
                <option value="sem3">Sem3</option>
                <option value="sem4">Sem4</option>
                <option value="action">Action</option>
                <option value="food">Food</option>
                <option value="adventure">Adventure</option>
                <option value="ece">ECE</option>
                </select>
      </div> */}


        {isLoading ? (
            <p>Loading....</p>
        ) : error ? (
            <p>{error}</p>
        ) : (
            <ul className="books">
            {data.map((item) => (
                <li key={item._id}>
                {isLog ? (<Link to={`/books/${item.slug}`}>
                    <img
                    src={`http://localhost:8000/uploads/${item.thumbnail}`}
                    alt={item.title}
                    />
                    <h3>{item.title}</h3>
                </Link>) :
                    (
                        <Link to={`/books/`}>
                            <img
                            src={`http://localhost:8000/uploads/${item.thumbnail}`}
                            alt={item.title}
                            />
                            <h3>{item.title}</h3>
                        </Link>
                    )
                }
                </li>
            ))}
            </ul> 
        )}


    </div>
  )
}

export default Book