import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { BsFillFileEarmarkPlusFill } from "react-icons/bs"
import bg from "./recc.jpg"
import Trial from "../TrialRec/Trial"

function Recommendations() {
    const baseUrl = "http://localhost:8000/api/books";
    const [data, setData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
      const filteredResults = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setSearchResults(filteredResults);
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
  }, [selectedCategory, searchTerm, data])

  return (
    <div>
    <h2 style={{"color": "lightgreen"}}>Search Engine for Books: </h2>
      <form>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      {searchTerm !== '' && (
        <div className="search-results-container">
          <ul>
            {searchResults.map((item) => (
              <li key={item._id}>
                <Link to={`../books/${item.slug}`}>
                  <h4>{item.title}</h4>
                </Link>
                
              </li>
            ))}
          </ul>
        </div>
      )}

        <h1 style={{"color":"violet"}}>Recommendation System</h1>
        <span style={{"color": "cyan"}}><li><u>Data Collection and Preprocessing:</u></li></span> Gather and clean user data, such as preferences and interactions with items.
        <br/><br/>
        <span style={{"color": "cyan"}}><li><u>User and Item Representation:</u></li></span> Create structured profiles for users and items, often using techniques like embeddings or matrix factorization.
        <br/><br/>
        <span style={{"color": "cyan"}}><li><u>Data Splitting:</u></li></span> Divide the data into training, validation, and test sets for model evaluation.
        <br/><br/>
        <span style={{"color": "cyan"}}><li><u>Recommendation Algorithms:</u></li></span> Choose the core algorithms for making recommendations, like Collaborative Filtering or Content-Based Filtering.
        <br/><br/>
        <span style={{"color": "lightgreen"}}>These components work together to build a recommendation system that suggests items to users based on their preferences and behavior.</span>
        <br />
        <br />       
        <br />  
        <img src={bg} alt="girl-with-sword" style={{borderRadius:"5px"}} /> <br /> 
        <br />  


        <Trial />



    </div>
  )
}

export default Recommendations