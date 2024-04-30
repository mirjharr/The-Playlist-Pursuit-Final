import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css"

function NavBar(){
    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
                <Link className="nav-link" to="/getplaylist">
                  Generate Playlist
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/getplaylistemotion">
                  See Our Collection
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/postplaylist">
                  POST a new Playlist
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/putplaylist">
                  PUT (modify) an Playlist
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/deleteplaylist">
                  DELETE a Playlist
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link" to="/studentinfo">
                  Student Information
                </Link>
              </li> */}
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
      //const navigate = useNavigate();
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
      return (<div>

            {/* Buttons to show CRUD */}
            {/* <button onClick={() => navigate('/getplaylist')}>GET playlist</button>
            <button onClick={() => navigate('/getplaylistemotion')}>GET Playlist by Emotion</button>
            <button onClick={() => navigate('/postplaylist')}>POST a new Emotion</button>
            <button onClick={() => navigate('/putplaylist')}>PUT (modify) a Playlsit</button>
            <button onClick={() => navigate('/deleteplaylist')}>DELETE a Playlist</button> */}
            {NavBar()}

            {/* Show all playlists*/}
            {playlists.map ((el) => (
                <div key={el.id}>
                <div>Id: {el.id}</div>
                <div>Emotion: {el.emotion}</div>
                <div>Description: {el.description}</div>
                <iframe src={el.embeddedHtml} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
            ))}
        </div>
      );
    };
  
    // GET one item
    // GET one item
    const Getplaylistemotion = () => {
      // Define hooks
      const [onePlaylist, setonePlaylist] = useState(null); // Initialize as null
      const options = ["Select", "happy", "sad", "silly", "focused", "content"];
      const [mood, setMyMood] = useState(options[0]);
      //const navigate = useNavigate();
      // useEffect to load playlist once HOOK id is modified
      useEffect(() => {
        if (`${mood}`) {
          fetch(`http://localhost:8081/playlists/${mood}`)
            .then((response) => response.json())
            .then((data) => {
              console.log("Show one playlist :", data);
              setonePlaylist(data);
            });
        }
      }, [`${mood}`]); // Fetch only when id changes
  
      // return
      return (
        <div>
          {/* Buttons to show CRUD */}
          {/* <button onClick={() => navigate('/getplaylist')}>GET playlist</button>
            <button onClick={() => navigate('/getplaylistemotion')}>GET Playlist by Emotion</button>
            <button onClick={() => navigate('/postplaylist')}>POST a new Emotion</button>
            <button onClick={() => navigate('/putplaylist')}>PUT (modify) a Playlsit</button>
            <button onClick={() => navigate('/deleteplaylist')}>DELETE a Playlist</button> */}
            {NavBar()}
            <div>
            <select
                onChange={(e) => setMyMood(e.target.value)}
                defaultValue={mood}
            >
                {options.map((option, idx) => (
                <option key={idx}>{option}</option>
                ))}
            </select>

            </div>
            {onePlaylist && (
                <div key={onePlaylist.id}>
                <div>Id: {onePlaylist.id}</div>
                <div>Emotion: {onePlaylist.emotion}</div>
                <div>Description: {onePlaylist.description}</div>
                <iframe src={onePlaylist.embeddedHtml} width="100%" height="352" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
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
        id: '',
        emotion: "",
        description: "",
        embeddedHtml: ""
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
            {/* <button onClick={() => navigate('/getplaylist')}>GET playlist</button>
            <button onClick={() => navigate('/getplaylistemotion')}>GET Playlist by Emotion</button>
            <button onClick={() => navigate('/postplaylist')}>POST a new Emotion</button>
            <button onClick={() => navigate('/putplaylist')}>PUT (modify) a Playlist</button>
            <button onClick={() => navigate('/deleteplaylist')}>DELETE a Playlist</button> */}
            {NavBar()}
          {/* Form to input data */}
          <form onSubmit={handleSubmit}>
            <h1>Post a New Product</h1>
            <input type="number" name="id" value={formData.id} onChange={handleChange} placeholder="ID" required /> <br />
            <input type="text" name="emotion" value={formData.emotion} onChange={handleChange} placeholder="Emotion" required /> <br />
            <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required /> <br />
            <input type="text" name="embeddedHtml" value={formData.embeddedHtml} onChange={handleChange} placeholder="Link" required /> <br />
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
        emotion: "",
        description: "",
        embeddedHtml: ""
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
          {/* <button onClick={() => navigate('/getplaylist')}>GET playlist</button>
            <button onClick={() => navigate('/getplaylistemotion')}>GET Playlist by Emotion</button>
            <button onClick={() => navigate('/postplaylist')}>POST a new Emotion</button>
            <button onClick={() => navigate('/putplaylist')}>PUT (modify) a Playlist</button>
            <button onClick={() => navigate('/deleteplaylist')}>DELETE a Playlist</button> */}
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
              style={{ marginLeft: "2%" }}
            />{" "}
            <br />
            <input
              type="text"
              name="emotion"
              value={formData.emotion}
              onChange={handleChange}
              placeholder="Emotion"
              required
              style={{ marginLeft: "2%" }}
            />{" "}
            <br />
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
              style={{ marginLeft: "2%" }}
            />{" "}
            <br />

            <input
              type="text"
              name="embeddedHtml"
              value={formData.embeddedHtml}
              onChange={handleChange}
              placeholder="URL"
              required
              style={{ marginLeft: "2%" }}
            />{" "}
            <br />
            <button type="submit" style={{ marginLeft: "5%" }}>Submit</button>
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
          embeddedHtml: ""
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
            const newplaylists = playlists.filter((playlists) => playlists.id != id);
            setplaylists(newplaylists);
            // show alert
            if (data) {
              const key = Object.keys(data);
              const value = Object.values(data);
              alert(key + value);
            }
          })
          .catch((error) => {
            console.error("Error adding item:", error);
            alert("Error adding robot:" + error.message); // Display alert if there's an error
          });
      };
    
  
      // return
      return (
        <div>
        {/* <button onClick={() => navigate('/getplaylist')}>GET playlist</button>
        <button onClick={() => navigate('/getplaylistemotion')}>GET Playlist by Emotion</button>
        <button onClick={() => navigate('/postplaylist')}>POST a new Emotion</button>
        <button onClick={() => navigate('/putplaylist')}>PUT (modify) a Playlist</button>
        <button onClick={() => navigate('/deleteplaylist')}>DELETE a Playlist</button> */}
        {NavBar()}
        
          {/* Buttons to simulate carousel */}
        <h3>Delete one product:</h3>
        <button onClick={() => getOneByOnePlaylistPrev()}>Prev</button>
        <button onClick={() => getOneByOnePlaylistNext()}>Next</button>
        <button onClick={() => deleteOnePlaylist(playlists[index].id)}>Delete</button>
        {/* Show product properties, one by one */}
        <div key={playlists[index].id}>
        Id:{playlists[index].id} <br />
        Emotion: {playlists[index].emotion} <br />
        Description: {playlists[index].description} <br />
        <iframe src={playlists[index].embeddedHtml} width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
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
          <Route path="/" element={<Getplaylist />} /> {/* Default view */}
        </Routes>
      </Router>
    );
  } // App end
  export default App;