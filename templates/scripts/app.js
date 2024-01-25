import express from "express";
import fs from "fs/promises";
import { engine } from "express-handlebars";
import { loadMovie, loadMovies } from "./movies.js";
import { marked } from "marked";

const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./templates");

const headerInfo = [
  {
    label: "Home Page",
    link: "/",
  },
  {
    label: "Movies",
    link: "/filmer",
  },
  {
    label: "About Us",
    link: "/ourHistory",
  },
  {
    label: "News and Events",
    link: "/newsEvents",
  },
];

async function renderPage(response, page) {
  const currentPath = page == "index" ? "/" : `/${page}`;

  response.render(page, {
    menu: headerInfo.map((item) => {
      return {
        active: currentPath == item.link,
        label: item.label,
        link: item.link,
      };
    }),
  });
}

app.get("/", async (request, response) => {
  renderPage(response, "index");
});

app.get("/filmer", async (request, response) => {
  const movies = await loadMovies();
  response.render("filmer", { movies });
  renderPage(response, "filmer");
});

app.get("/ourHistory", async (request, response) => {
  renderPage(response, "ourHistory");
});

app.get("/newsEvents", async (request, response) => {
  renderPage(response, "newsEvents");
});

app.get("/filmer/:movieId", async (request, response) => {
  const movie = await loadMovie(request.params.movieId);
  const markdownedIntro = marked(movie.attributes.intro);
  response.render("movie", { movie, markdownedIntro });
  renderPage(response, "filmer");
});

app.use("/static", express.static("./static"));
app.use(express.static("./templates"));
app.use(express.static("./data"));

export default app;
