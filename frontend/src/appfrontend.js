import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          The Playlist Pursuit
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/getplaylistemotion">
                Generate Playlist
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/getplaylist">
                See Our Collection
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/deleteplaylist">
                Admin
              </Link>
            </li>
            {
              <li className="nav-item">
                <Link className="nav-link" to="/studentinfo">
                  Student Information
                </Link>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  // GET all items
  const Getplaylist = () => {
    // Define hooks
    const [playlists, setplaylists] = useState([
      {
        id: "",
        embeddedHtml: "",
        emotion: "",
        mood:"",
        description: ""
      },
    ]);
    const [index, setIndex] = useState(0);
    // useEffect to load playlists when the page loads
    useEffect(() => {
      fetch("http://localhost:8081/playlists")
        .then((response) => response.json())
        .then((data) => {
          console.log("Show playlist of playlists:", data);
          setplaylists(data);
        });
    }, []);

    function getOneByOnePlaylistNext() {
      if (playlists.length > 0) {
        if (index === playlists.length - 1) setIndex(0);
        else setIndex(index + 1);
      }
    }

    // Function to review products like carousel
    function getOneByOnePlaylistPrev() {
      if (playlists.length > 0) {
        if (index === 0) setIndex(playlists.length - 1);
        else setIndex(index - 1);
      }
    }

    // return
    return (
      <div style={{height:"100vh"}} class="text-center text-bg-dark">
        {NavBar()}
        
        {/* Show all playlists*/}
        <div style={{ padding: "40px" }} key={playlists[index].id}>
          Id:{playlists[index].id} <br />
          Emotion: {playlists[index].emotion} <br />
          Weather: {playlists[index].weather} <br />
          Description: {playlists[index].description} <br />
          <iframe
            src={playlists[index].embeddedHtml}
            width="100%"
            height="352"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>
        <button class="btn btn-lg btn-light fw-bold border-white" onClick={() => getOneByOnePlaylistPrev()}>Prev</button>
        <button class="btn btn-lg btn-light fw-bold border-white bg-white" style={{ marginLeft:"10px"}} onClick={() => getOneByOnePlaylistNext()}>Next</button>
        <p>
          Don't see a playlist you like?{" "}
          <Link to="/postplaylist">Click here</Link> to add a new playlist to
          our collection!
        </p>
        <p>
          OR see incorrect information? Help us improve{" "}
          <Link to="/putplaylist">here</Link>
        </p>
      </div>
    );
  };

  const Getplaylistemotion = () => {
    const [playlists, setPlaylists] = useState([]);
    const [moodOptions, setMoodOptions] = useState(["Select"]);
    const [weatherOptions, setWeatherOptions] = useState(["Select"]);
    const [selectedMood, setSelectedMood] = useState("Select");
    const [selectedWeather, setSelectedWeather] = useState("Select");
    const [filteredPlaylist, setFilteredPlaylist] = useState(null);

    useEffect(() => {
      fetch("http://localhost:8081/playlists")
        .then((response) => response.json())
        .then((data) => {
          console.log("Fetched playlists:", data);
          setPlaylists(data);
          getByMoodWeather(data);
        })
        .catch((error) => console.error("Error:", error));
    }, []);


    const getByMoodWeather = (data) => {
      const moodSet = new Set(["Select Mood"]);
      const weatherSet = new Set(["Select Weather"]);
      data.forEach((playlist) => {
        moodSet.add(playlist.emotion);
        weatherSet.add(playlist.weather);
      });
      setMoodOptions(Array.from(moodSet));
      setWeatherOptions(Array.from(weatherSet));
    };

    useEffect(() => {
      const result = playlists.filter(
        (playlist) =>
          (selectedMood === "" || playlist.emotion === selectedMood) &&
          (selectedWeather === "" || playlist.weather === selectedWeather)
      );
      setFilteredPlaylist(result.length > 0 ? result[0] : null); 
    }, [selectedMood, selectedWeather, playlists]);

    return (
      <div style={{height:"100vh"}} class="h-100 text-center text-bg-dark">
        {NavBar()}
        <img 
        src="./images\companyLogo.png" 
        alt="the playlist pursuit logo" 
        width="300"
        >
        </img>
        <div style={{ padding: "20px", height:"100vh"}}>
          <div>
            <select
              class="btn btn-lg btn-light fw-bold border-white bg-white dropdown-toggle"
              id="mood-select"
              onChange={(e) => setSelectedMood(e.target.value)}
              value={selectedMood}
            >
              {moodOptions.map((mood, idx) => (
                <option key={idx} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
            <select
              style={{ marginLeft: "10px"}}
              class="btn btn-lg btn-light fw-bold border-white bg-white dropdown-toggle"
              id="weather-select"
              onChange={(e) => setSelectedWeather(e.target.value)}
              value={selectedWeather}
            >
              {weatherOptions.map((weather, idx) => (
                <option key={idx} value={weather}>
                  {weather}
                </option>
              ))}
            </select>
          </div>
       <br />
        {filteredPlaylist && (
          <div style={{ marginLeft: "4%", marginRight: "4%" }}key={filteredPlaylist.id}>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>You chose: {filteredPlaylist.emotion} and {filteredPlaylist.weather}</div>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>{filteredPlaylist.description}</div>
            <br></br>
            <iframe
              src={filteredPlaylist.embeddedHtml}
              width="100%"
              height="352"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
          </div>
        )}
       
         </div>
         <footer class="mt-auto text-white-50">
          <h6>© 2024 Our Playlist Company, Inc</h6>
        </footer>
      </div>
      
    );
  };

  // POST a new item
  const Postplaylist = () => {
    // Define HOOKS
    // const navigate = useNavigate();
    const [formData, setFormData] = useState({
      id: "",
      embeddedHtml: "",
      emotion: "",
      weather: "",
      description: ""

    });
    // Function to add input in formData HOOK using operator ...
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
    // Function to fetch backend for POST - it sends data in BODY
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(e.target.value);
      fetch("http://localhost:8081/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.status != 200) {
            return response.json().then((errData) => {
              throw new Error(
                `POST response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          alert("Playlist added successfully!");
        })
        .catch((error) => {
          console.error("Error adding playlist:", error);
          alert("Error adding playlist:" + error.message); // Display alert if there's an error
        });
    }; // end handleOnSubmit
    //return
    return (
      <div style={{height:"100vh"}} class="text-center text-bg-dark">
        {NavBar()}
        {/* Form to input data */}
        <form onSubmit={handleSubmit}>
          <h1>Add a Playlist to our Collection</h1>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="ID"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="emotion"
            value={formData.emotion}
            onChange={handleChange}
            placeholder="Emotion"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
            placeholder="Weather"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="embeddedHtml"
            value={formData.embeddedHtml}
            onChange={handleChange}
            placeholder="Link"
            required
          />{" "}
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      
    );
  };

  const Putplaylist = () => {
    // Define HOOKS
    //const navigate = useNavigate();
    const [formData, setFormData] = useState({
      id: "",
      embeddedHtml: "",
      emotion: "",
      weather:"",
      description: ""
      
    });

    // Function to add input in formData HOOK using operator ...
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    // Function to fetch backend for PUT - it sends data in BODY
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData.id);
      fetch(`http://localhost:8081/playlists/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `PUT request was not successful:\nStatus: ${response.status}`
            );
          }
          console.log(response.json);
          return response.json();
        })
        .then((data) => {
          console.log(data);
          alert("Item updated successfully! Thank you for your feedback!");
        })
        .catch((error) => {
          console.error("Error updating item:", error);
          alert("Error updating item:" + error.message); // Display alert if there's an error
        });
    };

    //return
    return (
      <div style={{height:"100vh"}} class="text-center text-bg-dark">
        {NavBar()}

        {/* Form to input data */}
        <form onSubmit={handleSubmit}>
          <h1>Update a Playlist</h1>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="ID"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="emotion"
            value={formData.emotion}
            onChange={handleChange}
            placeholder="Emotion"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
            placeholder="Weather"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="embeddedHtml"
            value={formData.embeddedHtml}
            onChange={handleChange}
            placeholder="URL"
            required
          />{" "}
          <br />
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    );
  };

  // DELETE - Delete an item
  const Deleteplaylist = () => {
    // Define HOOKS
    //onst navigate = useNavigate();

    const [playlists, setplaylists] = useState([
      {
        id: "",
        embeddedHtml: "",
        emotion: "",
        mood:"",
        description: ""
      },
    ]);
    const [index, setIndex] = useState(0);
    // useEffect to load playlist when load page
    useEffect(() => {
      fetch("http://localhost:8081/playlists/")
        .then((response) => response.json())
        .then((data) => {
          setplaylists(data);
          console.log("Load initial playlist of playlists in DELETE :", data);
          alert(
            "Please only proceed if you are an administrator of this website"
          );
        });
    }, []);

    // Function to review products like carousel
    function getOneByOnePlaylistNext() {
      if (playlists.length > 0) {
        if (index === playlists.length - 1) setIndex(0);
        else setIndex(index + 1);
      }
    }

    // Function to review products like carousel
    function getOneByOnePlaylistPrev() {
      if (playlists.length > 0) {
        if (index === 0) setIndex(playlists.length - 1);
        else setIndex(index - 1);
      }
    }

    // Delete de product by its id <- id is Hook

    const deleteOnePlaylist = (id) => {
      console.log("Playlist to delete :", id);
      fetch(`http://localhost:8081/playlists/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id }),
      })
        .then((response) => {
          if (response.status != 200) {
            return response.json().then((errData) => {
              throw new Error(
                `POST response was not ok :\n Status:${response.status}. \n Error: ${errData.error}`
              );
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log("Delete a product completed : ", id);
          console.log(data);
          // reload playlists from the local playlists array
          const newplaylists = playlists.filter(
            (playlists) => playlists.id != id
          );
          setplaylists(newplaylists);
          // show alert
          if (data) {
            const key = Object.keys(data);
            const value = Object.values(data);
            alert(key + value);
          }
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
          alert("Error deleting playlist:" + error.message); // Display alert if there's an error
        });
    };

    // return
    return (
      <div style={{height:"100vh"}} class="text-center text-bg-dark">
        {NavBar()}

        {/* Buttons to simulate carousel */}
        <h3>You are now in admin mode</h3>

        {/* Show product properties, one by one */}
        <div key={playlists[index].id}>
          Id:{playlists[index].id} <br />
          Emotion: {playlists[index].emotion} <br />
          Weather: {playlists[index].weather} <br />
          Description: {playlists[index].description} <br />
          <iframe
            src={playlists[index].embeddedHtml}
            width="100%"
            height="352"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </div>

        <button class="btn btn-lg btn-light fw-bold border-white" onClick={() => getOneByOnePlaylistPrev()}>Prev</button>
        <button class="btn btn-lg btn-light fw-bold border-white bg-white" style={{ marginLeft:"10px"}} onClick={() => getOneByOnePlaylistNext()}>Next</button>
        <button class="btn btn-lg btn-light fw-bold border-white" style={{ marginLeft:"10px", backgroundColor: "red"}} onClick={() => deleteOnePlaylist(playlists[index].id)}>
          Delete
        </button>
      </div>
    );
  };

  const Studentinfo = () => {
    return (
      <div style={{height:"100vh"}} class="text-center text-bg-dark">      
        {NavBar()}
        <div class="container">

          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <div class="col">
              <div class="cards">
                <div class="card shadow-sm">
                  <img
                    src="./images/Julia.jpg"
                    alt="Julia"
                    width="350"
                    height="400"
                    class="center"
                  />
                  <div class="card-body">
                    <h3>Julia Young</h3>
                    <p class="major">Software Engineering</p>
                    <p class="card-text">
                      I'm a sophomore and I've been coding for 4 years, and my
                      favorite language is C#. Outside of school I'm also in
                      digital women and the gymnastics club.
                    </p>
                    <strong>Email: youngj@iastate.edu</strong>
                    <div class="d-flex justify-content-between align-items-center"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="cards">
                <div class="card shadow-sm">
                  <img
                    src="./images/Rahul1.png"
                    alt="Rahul"
                    width="350"
                    height="400"
                    class="center"
                  />
                  <div class="card-body">
                    <h3>Rahul Sudev</h3>
                    <p class="major">Computer Science</p>
                    <p class="card-text">
                      I'm a sophomore and I've worked most with java and python.
                      Outside of class I love hitting the gym and playing
                      soccer.
                    </p>
                    <strong>Email: rahul03@iastate.edu</strong>
                    <div class="d-flex justify-content-between align-items-center"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="cards">
                <div class="card shadow-sm">
                  <img
                    src="./images/miranda.jpg"
                    alt="Miranda"
                    width="350"
                    height="400"
                    class="center"
                  />
                  <div class="card-body">
                    <h3>Miranda Harris</h3>
                    <p class="major">Software Engineering</p>
                    <p class="card-text">
                      I'm a sophomore and I've been coding for 4 years. I have
                      the most experience in Java and C. I am also in a sorority
                      and am a part of Engineers' Week.
                    </p>
                    <strong>Email: mirjharr@iastate.edu</strong>
                    <div class="d-flex justify-content-between align-items-center"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h7>
            <br />
            SE/ComS319 Construction of User Interfaces, Spring 2024
            <br />
          </h7>
        </div>
        <footer>
          <h8>
            5/9/2024 Dr. Abraham N. Aldaco Gastelum aaldaco@iastate.edu Dr. Ali
            Jannesari jannesar@iastate.edu
          </h8>
        </footer>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/getplaylist" element={<Getplaylist />} />
        <Route path="/getplaylistemotion" element={<Getplaylistemotion />} />
        <Route path="/postplaylist" element={<Postplaylist />} />
        <Route path="/putplaylist" element={<Putplaylist />} />
        <Route path="/deleteplaylist" element={<Deleteplaylist />} />
        <Route path="/studentinfo" element={<Studentinfo />} />
        <Route path="/" element={<Getplaylist />} /> {/* Default view */}
      </Routes>
    </Router>
  );
} // App end
export default App;
