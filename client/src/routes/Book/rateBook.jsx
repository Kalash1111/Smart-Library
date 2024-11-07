import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NoImageSelected from "../../assets/no-image-selected.jpg";
// import { useHistory } from "react-router-dom";
function RateBook({ tata }) {
  // const history = useHistory();
  const navigate = useNavigate();
  const urlSlug = useParams();
  const t=tata;
  const baseUrl = `http://localhost:8000/api/books/${urlSlug.slug}`;

  const [bookId, setBookId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [stars, setStars] = useState(0);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [submitted, setSubmitted] = useState("");
  const [image, setImage] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const data = await response.json();
      setBookId(data._id);
      setTitle(data.title);
      setSlug(data.slug);
      setStars(data.stars);
      setCategories(data.category);
      setDescription(data.description);
      setThumbnail(data.thumbnail);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createBook = async (e) => {
    e.preventDefault();
    console.table([title, slug]);

    const formData = new FormData();
    formData.append("bookId", bookId);
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("stars", stars);
    formData.append("description", description);
    formData.append("category", categories);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      const response = await fetch("http://localhost:8000/api/books", {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        setTitle("");
        setSlug("");
        setSubmitted(true);
        // history.goBack();
        // window.location.href = `/books/${urlSlug.slug}`;
        
      } else {
        console.log("Failed to submit data.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryChange = (e) => {
    setCategories(e.target.value.split(",").map((category) => category.trim()));
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setThumbnail(e.target.files[0]);
    }
  };

  const removeBook = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/books/" + bookId,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        navigate("/books");
        console.log("Book removed.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
    <h3>Given a rating</h3>
  
    {submitted ? (
      <p>Data submitted successfully!</p>
    ) : (
      <form
        className="bookdetails"
        onSubmit={createBook}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Stars</label>
          <input
            type="text"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
          />
        </div>
  
        <input
          type="submit"
          style={{ backgroundColor: 'none', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer',}}
        />
      </form>
    )}
  </div>
  
  );
}

export default RateBook;