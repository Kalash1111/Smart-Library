import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./routes/Home/home";
import About from "./routes/About/about";
import Book from "./routes/Book/book";
import Movie from "./routes/Movie/movie";
import SingleBook from "./routes/Book/singleBook";
import SingUp from "./routes/login/SingUp";
import Login from "./routes/login/login_component";
import CreateBook from "./routes/Book/createBook";
import Edit from "./routes/Book/edit";
import CreateAnime from "./routes/About/createAnime";
import CreateMovie from "./routes/Movie/createMovie";
import EditAnime from "./routes/About/editAnime";
import SingleAnime from "./routes/About/singleAnime";
import SingleMovie from "./routes/Movie/singleMovie";
import EditBook from "./routes/Book/bookedit";
import RateBook from "./routes/Book/rateBook";
// import EditMovie from "./routes/Movie/editMovie";
import Header from "./components/Header";
import Footer from "./components/Footer";
import DarkMode from "./routes/Home/darkMode";
import Recommendations from "./routes/Recommendations/recommendations";
import Popular from "./routes/Popular/popular";
import Trial from "./routes/TrialRec/Trial";
import Details from "./routes/login/details";
import UserDetails from "./routes/login/Admin";
import UserDetailComponent from "./routes/User/student";
import IssueBookListComponent from "./routes/User/issuebook";

function App() {
  // const [userData, setUserData] = useState("");
  
  return (
    <div className="no-select-img">
      <DarkMode />
      <Router>
        <Header />
        <Routes>

          <Route path="/" element={ <Home/> } />
          {/* <Route path="/about" element={ <About/> } />
          <Route path="/about/:slug" element={ <SingleAnime/> } />
          <Route path="/createanime" element={ <CreateAnime/> } />
          <Route path="/editanime/:slug" element={ <EditAnime/> } /> */}
          <Route path="/books" element={ <Book/> } />
          <Route path="/books/:slug" element={ <SingleBook/> } />
          <Route path="/createbook" element={ <CreateBook/> } />
          <Route path="/Signup" element={ <SingUp/> } />
          <Route path="/sign-in" element={ <Login/> } />
          <Route path="/editbook/:slug" element={ <EditBook/> } />
          {/* <Route path="/editrating/:slug" element={ <EditRating/> } /> */}
          <Route path="/recommendations" element={ <Recommendations/> } />
          <Route path="/popular" element={ <Popular /> } />
          <Route path="/trial" element={ <Trial /> } />
          <Route path="/details" element={ <Details/> } />
          <Route path="/userDetails" element={ <UserDetails/> } />
          <Route path="/mybookdetails" element={ <UserDetailComponent  /> } />
          <Route path="/issuebook" element={ <IssueBookListComponent/>} />
          <Route path="/edit" element={ <Edit/>} />
          <Route path="/ratebook/:slug" element={ <RateBook/>} />
          {/* <Route path="/movies" element={ <Movie /> }  />
          <Route path="/movies/:slug" element={ <SingleMovie />} />
          <Route path="/editmovie/:slug" element={ <EditMovie />} />
          <Route path="/createmovie" element={ <CreateMovie/> } /> */}

        </Routes>
        <Footer />
      </Router>
    </div>
  )
}

export default App
