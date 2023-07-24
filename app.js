const path = require("path");
const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
const dbPath = path.join(__dirname, "moviesData.db");
const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeDbAndServer();
//get all movies
app.get("/movies/", async (request, response) => {
  const dbQuery = "Select movie_name from movie;";
  const movies = await db.all(dbQuery);
  let ans = (movies) => {
    return {
      //   movieId: movies.movie_id,
      //   directorId: movies.director_id,
      movieName: movies.movie_name,
    };
  };
  response.send(movies.map((each) => ans(each)));
  //   response.send(movies);
});
//add movie
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  // const dbQuery=`Insert into movie (director_id,movie_name,lead_actor) values (${directorId},'${movieName}','${leadActor');`;
  const dbQuery = `Insert into movie (director_id,movie_name,lead_actor) values (${directorId},'${movieName}','${leadActor}');`;
  await db.run(dbQuery);
  response.send("Movie Successfully Added");
});
//get only 1movie
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const dbQuery = `Select * from movie where movie_id=${movieId};`;
  const book = await db.get(dbQuery);
  const res = (book) => {
    return {
      movieId: book.movie_id,
      directorId: book.director_id,
      movieName: book.movie_name,
      leadActor: book.lead_actor,
    };
  };
  response.send(res(book));
});
//put movie
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const dbQuery = `Update movie set director_id=${directorId},movie_name='${movieName}',lead_actor='${leadActor}' where movie_id=${movieId};`;
  await db.run(dbQuery);
  response.send("Movie Details Updated");
});
//delete movie
app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const dbQuery = `Delete from movie where movie_id=${movieId};`;
  await db.run(dbQuery);
  response.send("Movie Removed");
});
//

app.get("/directors/", async (request, response) => {
  const dbQuery = "Select * from director;";
  const movies = await db.all(dbQuery);
  let ans = (movies) => {
    return {
      directorId: movies.director_id,
      directorName: movies.director_name,
    };
  };
  response.send(movies.map((each) => ans(each)));
});
//

app.get("/directors/:directorId/movies", async (request, response) => {
  const { directorId } = request.params;
  const dbQuery = `Select movie_name from movie where director_id=${directorId};`;
  const movies = await db.all(dbQuery);
  let ans = (movies) => {
    return {
      movieName: movies.movie_name,
    };
  };
  response.send(movies.map((each) => ans(each)));
});

module.exports = app;
