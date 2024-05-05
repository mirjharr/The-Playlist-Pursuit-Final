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
    const [playlists, setplaylists] = useState([]);
    // useEffect to load playlists when the page loads
    useEffect(() => {
      fetch("http://localhost:8081/playlists")
        .then((response) => response.json())
        .then((data) => {
          console.log("Show playlist of playlists:", data);
          setplaylists(data);
        });
    }, []);

    // return
    return (
      <div>
        {NavBar()}
        <img 
        src="./images\companyLogo.png" 
        alt="the playlist pursuit logo" 
        style={{ paddingLeft: "550px" }}
        >
        </img>
        {/* Show all playlists*/}
        {playlists.map((el) => (
          <div style={{ marginLeft: "4%" , marginRight: "4%"}} key={el.id}>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>Id: {el.id}</div>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>Emotion: {el.emotion}</div>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>Weather: {el.weather}</div>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>Description: {el.description}</div>
            <iframe
              src={el.embeddedHtml}
              width="100%"
              height="352"
              allowFullScreen=""
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            ></iframe>
            <br></br> <br></br>
          </div>
         
        ))}
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
      const moodSet = new Set(["Select"]);
      const weatherSet = new Set(["Select"]);
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
          (selectedMood === "Select" || playlist.emotion === selectedMood) &&
          (selectedWeather === "Select" || playlist.weather === selectedWeather)
      );
      setFilteredPlaylist(result.length > 0 ? result[0] : null); 
    }, [selectedMood, selectedWeather, playlists]);

    return (
      <div>
        {NavBar()}
        <div style={{ padding: "20px" }}>
          <div>
            <label htmlFor="mood-select">Mood:</label>
            <select
              style={{ marginLeft: "10px" }}
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

          </div>
          <div style={{ marginTop: "10px" }}>
            <label htmlFor="weather-select">Weather: </label>
            <select
              style={{ marginLeft: "10px" }}
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
        </div>
        {filteredPlaylist && (
          <div style={{ marginLeft: "4%", marginRight: "4%" }}key={filteredPlaylist.id}>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>Id: {filteredPlaylist.id}</div>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>Emotion: {filteredPlaylist.emotion}</div>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>Weather: {filteredPlaylist.weather}</div>
            <div style={{ marginLeft: "2%", marginRight: "2%" }}>Description: {filteredPlaylist.description}</div>
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
    );
  };

  // POST a new item
  const Postplaylist = () => {
    // Define HOOKS
    // const navigate = useNavigate();
    const [formData, setFormData] = useState({
      id: "",
      emotion: "",
      description: "",
      embeddedHtml: "",
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
          alert("Item added successfully!");
        })
        .catch((error) => {
          console.error("Error adding item:", error);
          alert("Error adding robot:" + error.message); // Display alert if there's an error
        });
    }; // end handleOnSubmit
    //return
    return (
      <div>
        {NavBar()}
        {/* Form to input data */}
        <form onSubmit={handleSubmit}>
          <h1>Post a New Product</h1>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            style={{ marginLeft: "4%" }}
            placeholder="ID"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="emotion"
            value={formData.emotion}
            onChange={handleChange}
            style={{ marginLeft: "4%" }}
            placeholder="Emotion"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ marginLeft: "4%" }}
            placeholder="Description"
            required
          />{" "}
          <br />
          <input
            type="text"
            name="embeddedHtml"
            value={formData.embeddedHtml}
            onChange={handleChange}
            style={{ marginLeft: "4%" }}
            placeholder="Link"
            required
          />{" "}
          <br />
          <button style={{ marginLeft: "7%" }} type="submit">Submit</button>
        </form>
      </div>
    );
  };

  const Putplaylist = () => {
    // Define HOOKS
    //const navigate = useNavigate();
    const [formData, setFormData] = useState({
      id: "",
      emotion: "",
      description: "",
      embeddedHtml: "",
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
          alert("Item updated successfully!");
        })
        .catch((error) => {
          console.error("Error updating item:", error);
          alert("Error updating item:" + error.message); // Display alert if there's an error
        });
    };

    //return
    return (
      <div>
        {NavBar()}

        {/* Form to input data */}
        <form onSubmit={handleSubmit}>
          <h1>Update Product</h1>
          <input
            type="number"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="ID"
            required
            style={{ marginLeft: "4%" }}
          />{" "}
          <br />
          <input
            type="text"
            name="emotion"
            value={formData.emotion}
            onChange={handleChange}
            placeholder="Emotion"
            required
            style={{ marginLeft: "4%" }}
          />{" "}
          <br />
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            style={{ marginLeft: "4%" }}
          />{" "}
          <br />
          <input
            type="text"
            name="embeddedHtml"
            value={formData.embeddedHtml}
            onChange={handleChange}
            placeholder="URL"
            required
            style={{ marginLeft: "4%" }}
          />{" "}
          <br />
          <button type="submit" style={{ marginLeft: "5%" }}>
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
        emotion: "",
        description: "",
        embeddedHtml: "",
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
      <div>
        {NavBar()}

        {/* Buttons to simulate carousel */}
        <h3>Delete one product:</h3>
        <button onClick={() => getOneByOnePlaylistPrev()}>Prev</button>
        <button onClick={() => getOneByOnePlaylistNext()}>Next</button>
        <button onClick={() => deleteOnePlaylist(playlists[index].id)}>
          Delete
        </button>
        {/* Show product properties, one by one */}
        <div key={playlists[index].id}>
          Id:{playlists[index].id} <br />
          Emotion: {playlists[index].emotion} <br />
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
      </div>
    );
  };

  const Studentinfo = () => {
    return (
      <div>
        {NavBar()}
        <div class="container">
          <br></br>
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
        <div style={{ marginLeft: "33%" }}>
          <h7>
            <br />
            SE/ComS319 Construction of User Interfaces, Spring 2024
            <br />
            <br />
          </h7>
        </div>
        <div style={{ marginLeft: "20%" }}>
          <h8>
            5/9/2024 Dr. Abraham N. Aldaco Gastelum aaldaco@iastate.edu Dr. Ali
            Jannesari jannesar@iastate.edu
          </h8>
        </div>
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
