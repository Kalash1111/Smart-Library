import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { BsPencilSquare } from "react-icons/bs"
import RateBook from "./rateBook";
import './singlebook.css';
function singleBook() {
    const [showComponent, setShowComponent] = useState(false);

    const handleButtonClick = () => {
      setShowComponent(true);
    }
    const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);
  const [data, setData] = useState([]);
  const urlSlug = useParams();
  const baseUrl = `http://localhost:8000/api/books/${urlSlug.slug}`;
  useEffect(() => {
    const fetchData = async() => {
        try {

            const response = await fetch(baseUrl);
            if(!response.ok) {
                throw new Error("Try Again Failed to fetch Data");
            }

            const jsonData= await response.json();
            setData(jsonData);

        } catch (error) {
            console.log(error);
        }
    }
    fetchData();
    fetch("http://localhost:8000/userData", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        if (data.data.userType == "Admin") {
          setAdmin(true);
        }
    
        setUserData(data.data);
    
      });

  }, []);
    


   


    function StarRating({ numberOfStars} ) {
        const stars = [];
    
        for(let i = 0; i < numberOfStars; i++ ) {
          stars.push(<span key={i}>⭐</span>)
        }
    
        return <div>Rating: {stars}</div>
      }


      function issueBook(e) {
        e.preventDefault();
    const useremail=userData.email;
    const slug=urlSlug.slug;

        // console.log(email, password);
        fetch("http://localhost:8000/issuebook", {
          method: "POST",
          crossDomain: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            useremail,
           slug,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "userRegister");
            if (data.status == "ok") {
              alert("Issue request send successfully");
             
    
            }
            else{
                alert("issue unsuccessful"); 
            }
          });
      }
      

  return (
    <div className="user-details-container">
  
 
  {/* Rest of your component */}

  <h1 className="user-type">{userData.userType}</h1>
  <div className="book-details">
    <div className="col-1">
      <img
        src={`http://localhost:8000/uploads/${data?.thumbnail}`}
        alt={data?.title}
        className="book-thumbnail"
      />
      {admin ? (
       <>

       </>
      ) : ( 
      <div className="button-container">
        <button onClick={issueBook} className="issue-button">
          Issue
        </button>
      </div>)}
    </div>

    <div className="col-2">
      <h1 className="book-title">Book Title: {data?.title}</h1>
      <p className="book-description">{data?.description}</p>
      {/* <h1 className="user-email">{userData.email}</h1> */}
      <StarRating numberOfStars={data?.stars} />
      <p className="category-title">Category</p>
      <ul className="category-list">
      
        {data?.category?.map((item, index) => (
          <li key={index} className="category-item">
             {item}
          </li>
        ))}

      </ul>
      {admin ? (
        <Link to={`/editbook/${data.slug}`} className="edit-book-link">
          Edit Book <BsPencilSquare size={20} />
        </Link>
      ) : (
        
        <div>
      
      <div className="button-container">
        {setShowComponent ? (
          <RateBook data={data.slug} />
        ) : (
          <button onClick={handleButtonClick} className="rate-book-button">
            Rate Book
          </button>
        )}
      </div>
    </div>
          
        
          
        
      )}
    </div>
  </div>
  <Link to="/books" className="link-back">🔙 Books</Link>
</div>

  )
}

export default singleBook