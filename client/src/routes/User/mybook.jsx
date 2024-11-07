import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import './mybook.css';
function UserDetail(props) {
  const [userData, setUserData] = useState(null);

useEffect(() => {
    fetch(`http://localhost:8000/getdata/${props.propValue}`, {
      // http://localhost:8000/getdata/${props.propValue}
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email:window.localStorage.getItem("email"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        const pipo=data.data.issuedBooks[0].title;
        console.log(pipo);

        setUserData(data.data);

      });
  }, []);   
return(
  <div className="user-details-container">
  
  {userData ? (
    <div className="user-info">
      <h2>User Info:</h2>
      <p>Name: {userData.userInfo.fname} {userData.userInfo.lname}</p>
      <p>Email: {userData.userInfo.email}</p>
      <p>User Type: {userData.userInfo.userType}</p>

      <h2>Issued Books:</h2>
      <div className="issued-books-container">
        {userData.issuedBooks.map((book) => (
          <div key={book._id} className="issued-book">
            <Link to={`/books/${book.slug}`} className="book-link">
              <img
                src={`http://localhost:8000/uploads/${book.thumbnail}`}
                alt={book.title}
                className="book-thumbnail"
              />
              <h3 className="book-title">{book.title}</h3>
              <h3 className="book-title">Status: {book.status}</h3>
             
            </Link>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p>Loading user data...</p>
  )}
</div>
)
}

export default UserDetail;
