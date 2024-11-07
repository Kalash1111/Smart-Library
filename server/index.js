require("dotenv").config();
const mongoose = require("mongoose");
const cors= require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Book = require("./models/Books");
const Anime = require("./models/Anime");
const Movie = require("./models/Movie");
const multer = require("multer");



const bcrypt = require("bcryptjs");



const jwt = require("jsonwebtoken");
// var nodemailer = require("nodemailer");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// POST FOR POSTING
// PUT FOR UPDATING
// GET FOR FETCHING
// DELETE FOR DELETING
// PATCH = PUT BUT SPECIFIC UPDATE NOT EVERYTHING
// HEAD = GET BUT FETCHES/REQUESTS ONLY HEADERS. NO CONTENT
// TRACE = FOR DEBUGGING. GET TRACES
// OPTIONS = PROVIDES WITH A MENU OF ACTIONS POSSIBLE WITH ALL THESE

const app = express();
app.set("view engine", "ejs");
const PORT = process.env.PORT || 8000;


connectDB();
app.use(cors());
app.use(express.urlencoded({ extended: true } ));
app.use(express.json());
app.use("/uploads", express.static("uploads"));



app.get("/api/movies", async (req, res) => {
  try {
    const category = req.query.category;
    
    const filter = {};
    if(category) {
      filter.category = category;
    }

    const data = await Movie.find(filter);
    if(!data) {
      throw new Error("Error occurred while fetching Movies");
    }
    res.status(201).json(data);

  } catch (error) {
    res.status(500).json({error: "Error occurred while fetching Movies"});
  }
})
require("./userDetails");
const IssueRequest = require('./issuedetail'); 


const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }
    console.log(fname);
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});


app.post('/getdata/:id', async (req, res) => {
  try {
    const userEmail = req.params.id;
    const emails=req.body.email;
    console.log(emails);
    console.log(userEmail );
    console.log("fite" );
    const user = await User.findOne({ email:emails });
    console.log(user);
    console.log("hi");

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
// console.log(user.issuedBooks);

// const books = [];
const issuedBooks=user.issuedBooks;
const bookIds = issuedBooks.map((issuedBook) => issuedBook.bookId);
    
    // Find books by the array of bookId values
    // console.log( bookIds);
    // console.log(issuedBooks);
    const books = await Book.find({ _id: { $in: bookIds } });
    // const bookIds = issuedBooks.map((issuedBook) => issuedBook.bookId);

    // // Find books by the array of bookId values
    // const books = await Book.find({ _id: { $in: bookIds } });
    
    // Merge status with corresponding books
    const booksWithStatus = issuedBooks.map((issuedBook) => {
      const matchingBook = books.find((book) => book._id.equals(issuedBook.bookId));
      return {
        ...matchingBook.toObject(), // Convert Mongoose document to plain object
        status: issuedBook.status,
      };
    });
    
    console.log(booksWithStatus);
    

// console.log(bookStatusMap);

    const userData = {
      userInfo: user,
      issuedBooks: booksWithStatus,
    };
    // const data=json(userData);
    console.log(userData);

    if (res.status(201)) {
      return res.json({ status: "ok", data: userData });
    } else {
      return res.json({ error: "error" });
    }
    
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post("/issuebook",async (req, res) => {
  const { useremail, slug } = req.body;
  const user = await User.findOne({ email: useremail });
  const book = await Book.findOne({ slug: slug});
  console.log(book);
  const bookId=(book._id);
  user.issuedBooks.push({
    bookId: bookId,
    // issueDate: issueDate,
    status: "Pending",
  });
  await user.save();
  console.log(user);
  // const book=await 
  const newIssueRequest = new IssueRequest({
    userName: user.fname,  // Replace with the user's name
    bookName: book.title,  // Replace with the book's name
    userId: user._id,  // Replace with the user's ID
    bookId: book._id,  // Replace with the book's ID
    // You can add more fields if needed, such as issue date, due date, etc.
  });
  
  // Save the issue request to the database
  newIssueRequest.save()
    .then((savedIssueRequest) => {
      console.log('Issue request saved:', savedIssueRequest);
    })
    .catch((error) => {
      console.error('Error saving issue request:', error);
    });


res.send({ status: "ok" });
  // try {
  
   
  // } catch () {
 
  // }
});


// Get all issue book data
app.get('/api/issue', async (req, res) => {
  
  try {
    const issueRequests = await IssueRequest.find();
    console.log(issueRequests);
    res.json(issueRequests);
  } catch (error) {
    console.error('Error fetching issue book data:', error);
    console.log('sjj');
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.delete('/api/issue-requests/:id', async (req, res) => {
  try {
    const issueRequestId = req.params.id;
    await IssueRequest.findByIdAndDelete(issueRequestId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting issue request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/api/issued/:id', async (req, res) => {
 console.log("hipppp");
    const issueRequestId = req.params.id;
    const data=await IssueRequest.findById(issueRequestId);
  
const userId = data.userId; 
const bookId = data.bookId; 

// Update the status from 'pending' to 'done'
User.findOneAndUpdate(
  {
    _id: userId,
    'issuedBooks.bookId': bookId,
  },
  {
    $set: {
      'issuedBooks.$.status': 'done',
    },
  },
  { new: true }
)
  .then((user) => {
    if (!user) {
      console.log('User not found or book not issued.');
    } else {
      // console.log('Status updated successfully:', user);
       console.log("fail");
    }
  })
  .catch((error) => {
    console.error('Error updating status:', error);
  });

    res.status(204).send();
 
});

app.get("/api/books", async (req, res) => {
  try {
    const category = req.query.category;
    //const stars = req.query.stars;

    const filter = {};
    if(category) {
      filter.category = category;
    }

    const data = await Book.find(filter);
    
    if (!data) {
      throw new Error("An error occurred while fetching books.");
    }
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
});

app.get("/api/animes", async (req, res) => {
  try {
    const category = req.query.category;
    //const stars = req.query.stars;

    const filter = {};
    if(category) {
      filter.category = category;
    }

    const data = await Anime.find(filter);
    
    if (!data) {
      throw new Error("An error occurred while fetching animes.");
    }
    
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching animes." });
  }
});




app.get("/api/books/:slug", async (req, res) => {
    try {
      const slugParam = req.params.slug;
      const data = await Book.findOne({ slug: slugParam});
  
      if (!data) {
        throw new Error("An error occurred while fetching a book.");
      }
      
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching books." });
    }
  });


app.get("/api/movies/:slug", async (req, res) => {
  try {
    const slugParams = req.params.slug;
    const data = await Movie.findOne({ slug: slugParams });
    if(!data) {
      throw new Error("An error occurred while fetching a Movie.")
    }
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching Movies." });
  }
})
  
  app.get("/api/animes/:slug", async (req, res) => {
    try {
      const slugParam = req.params.slug;
      const data = await Anime.findOne({ slug: slugParam});
  
      if (!data) {
        throw new Error("An error occurred while fetching a anime.");
      }
      
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching animes." });
    }
  });
  


  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + "-" + file.originalname);
    }
  })
  
  const upload = multer({ storage: storage })
  


 app.post("/api/books", upload.single("thumbnail")  ,async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const newBook = new Book({
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
      thumbnail: req.file.filename,
    })

    await Book.create(newBook);
    res.json("Data Submitted");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books." });
  }
});

app.post("/api/animes", upload.single("thumbnail")  ,async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    const newAnime = new Anime({
      title: req.body.title,
      slug: req.body.slug,
      stars: req.body.stars,
      description: req.body.description,
      category: req.body.category,
      thumbnail: req.file.filename,
    })

    await Anime.create(newAnime);
    res.json("Data Submitted");
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching anime." });
  }
});

app.post("/api/movies", upload.single("thumbnail"), async (req, res) => {
  try {
    const newMovie = new Movie({
      title: req.body.title,
      description: req.body.description,
      slug: req.body.slug,
      stars: req.body.stars,
      category: req.body.category,
      thumbnail: req.body.filename,
    })

    await Movie.create(newMovie);
    res.json("Movie Data Submitted successfully.");

  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching Movies." });
  }
})



app.put("/api/books", upload.single("thumbnail"), async (req, res) => {
    try {
  
      const bookId = req.body.bookId;
  
      const updateBook = {
        title: req.body.title,
        slug: req.body.slug,
        stars: req.body.stars,
        description: req.body.description,
        category: req.body.category,
      }
  
      if (req.file) {
        updateBook.thumbnail = req.file.filename;
      }
  
      await Book.findByIdAndUpdate(bookId, updateBook)
      res.json("Data Submitted");
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching books." });
    }
  });

  app.put("/api/animes", upload.single("thumbnail"), async (req, res) => {
    try {
  
      const animeId = req.body.animeId;
  
      const updateAnime = {
        title: req.body.title,
        slug: req.body.slug,
        stars: req.body.stars,
        description: req.body.description,
        category: req.body.category,
      }
  
      if (req.file) {
        updateAnime.thumbnail = req.file.filename;
      }
  
      await Anime.findByIdAndUpdate(animeId, updateAnime)
      res.json("Data Submitted");
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching Anime." });
    }
  });

  app.put("/api/movies", upload.single("thumbnail"), async (req, res) => {
    try {
      const movieId = req.body.movieId;
      const updateMovie = {
        title: req.body.title,
        description: req.body.description,
        slug: req.body.slug,
        stars: req.body.stars,
        category: req.body.category,
        thumbnail: req.body.filename,
      }
      if(req.file) {
        updateMovie.thumbnail = req.file.filename;
      }
      await Movie.findByIdAndUpdate(movieId, updateMovie);
      res.json("Movie updated successfully");
    } catch (error) {
      res.status(500).json({ error: "An error occurred while fetching Movies." });
    }
  })

  
  app.delete("/api/books/:id", async(req,res) => {
    const bookId = req.params.id;
  
    try {
      await Book.deleteOne({_id: bookId});
      res.json("Successfully Deleted " + req.body.bookId);
    } catch (error) {
      res.json(error);
    }
  });


  app.delete("/api/animes/:id", async(req,res) => {
    const animeId = req.params.id;
  
    try {
      await Anime.deleteOne({_id: animeId});
      res.json("Successfully Deleted " + req.body.animeId);
    } catch (error) {
      res.json(error);
    }
  });

  app.delete("/api/movies/:id", async(req, res) => {
    const movieId = req.params.id;
    try {
      await Movie.deleteOne({_id: movieId});
      res.json("Successfully Deleted "+req.body.movieId);
    } catch (error) {
      res.json(error);
    }
  })










app.get("/", (req, res) => {
    res.json("This is the home page. For testing goto api/books OR api/animes");
});

app.get("*", (req, res) => {
    res.sendStatus("404");
});

app.listen(PORT, () => {
    console.log(`Sever running at Port: ${PORT}`)
});



app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) { }
});


app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:8000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "adarsh438tcsckandivali@gmail.com",
        pass: "rmdklolcsmswvyfw",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "thedebugarena@gmail.com",
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) { }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});


app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 });
    res.send({ Status: "ok" })

  } catch (error) {
    res.send({ Status: "error", data: error });

  }
})

app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then(data => {
      res.send({ status: "ok", data: data })
    })

  } catch (error) {

  }
})

app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page)
  const limit = parseInt(req.query.limit)

  const startIndex = (page - 1) * limit
  const lastIndex = (page) * limit

  const results = {}
  results.totalUser=allUser.length;
  results.pageCount=Math.ceil(allUser.length/limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    }
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    }
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results)
})