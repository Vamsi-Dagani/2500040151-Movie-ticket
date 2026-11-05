
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [movies, setMovies] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("movies")) || [];
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    genre: "",
    director: "",
    rating: "",
    releaseDate: ""
  });

  useEffect(() => {
    localStorage.setItem("movies", JSON.stringify(movies));
  }, [movies]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rating = Number(form.rating);

    if (!form.name.trim() || !form.genre ||
        !form.director.trim() || !form.releaseDate ||
        form.rating === "" || rating < 0 || rating > 10) {
      alert("Please enter valid details. Rating must be 0-10.");
      return;
    }

    if (editId !== null) {
      setMovies(movies.map(movie =>
        movie.id === editId
          ? { ...form, name: form.name.trim(),
              director: form.director.trim(), rating }
          : movie
      ));
      alert("Movie updated successfully!");
      setEditId(null);
    } else {
      const newMovie = {
        ...form,
        name: form.name.trim(),
        director: form.director.trim(),
        rating,
        id: Date.now()
      };

      setMovies([...movies, newMovie]);
      alert("Movie added successfully!");
    }

    setForm({
      name: "",
      genre: "",
      director: "",
      rating: "",
      releaseDate: ""
    });
  };

  const handleEdit = (movie) => {
    setForm({
      name: movie.name,
      genre: movie.genre,
      director: movie.director,
      rating: String(movie.rating),
      releaseDate: movie.releaseDate
    });

    setEditId(movie.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      setMovies(movies.filter(movie => movie.id !== id));

      if (editId === id) {
        setEditId(null);
        setForm({
          name: "",
          genre: "",
          director: "",
          rating: "",
          releaseDate: ""
        });
      }
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm({
      name: "",
      genre: "",
      director: "",
      rating: "",
      releaseDate: ""
    });
  };

  const filteredMovies = movies.filter(movie =>
    [movie.name, movie.genre, movie.director]
      .some(value => value.toLowerCase().includes(search.toLowerCase()))
  );

  const averageRating = movies.length
    ? (movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length).toFixed(1)
    : "0.0";

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div className="logo">🎬 Movie Club</div>
        <p>Digital Movie Record Management System</p>
      </header>

      <main className="container">

        {/* Dashboard */}
        <section className="dashboard">
          <div className="stat-card">
            <span>🎥</span>
            <h3>Total Movies</h3>
            <h2>{movies.length}</h2>
          </div>

          <div className="stat-card">
            <span>⭐</span>
            <h3>Average Rating</h3>
            <h2>{averageRating}/10</h2>
          </div>

          <div className="stat-card">
            <span>📚</span>
            <h3>Movie Genres</h3>
            <h2>{new Set(movies.map(m => m.genre)).size}</h2>
          </div>
        </section>

        {/* Add Movie Form */}
        <section className="form-section">
          <h2>{editId !== null ? "✏️ Edit Movie" : "➕ Add New Movie"}</h2>

          <form onSubmit={handleSubmit} className="movie-form">

            <div className="form-group">
              <label>Movie Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter movie name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Movie Genre</label>
              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                required
              >
                <option value="">Select Genre</option>
                <option>Action</option>
                <option>Comedy</option>
                <option>Drama</option>
                <option>Romance</option>
                <option>Thriller</option>
                <option>Horror</option>
                <option>Sci-Fi</option>
                <option>Adventure</option>
                <option>Animation</option>
                <option>Documentary</option>
              </select>
            </div>

            <div className="form-group">
              <label>Movie Director</label>
              <input
                type="text"
                name="director"
                placeholder="Enter director name"
                value={form.director}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Movie Rating (0-10)</label>
              <input
                type="number"
                name="rating"
                placeholder="Enter rating"
                min="0"
                max="10"
                step="0.1"
                value={form.rating}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Movie Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={form.releaseDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="add-btn">
                {editId !== null ? "Update Movie" : "Add Movie"}
              </button>

              {editId !== null && (
                <button type="button" className="cancel-btn"
                  onClick={cancelEdit}>
                  Cancel
                </button>
              )}
            </div>

          </form>
        </section>

        {/* Movie Records */}
        <section className="records-section">
          <div className="records-header">
            <h2>📋 Movie Records</h2>

            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Movie Name</th>
                  <th>Genre</th>
                  <th>Director</th>
                  <th>Rating</th>
                  <th>Release Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMovies.length > 0 ? (
                  filteredMovies.map((movie, index) => (
                    <tr key={movie.id}>
                      <td>{index + 1}</td>
                      <td className="movie-name">{movie.name}</td>
                      <td>{movie.genre}</td>
                      <td>{movie.director}</td>
                      <td>⭐ {movie.rating}/10</td>
                      <td>{movie.releaseDate}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(movie)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(movie.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="empty">
                      No movie records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <footer>
        <p>🎬 Movie Club Management System | Digital Records © 2026</p>
      </footer>

    </div>
  );
}

export default App;