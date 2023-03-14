/*
Created By: Connect/Follow me on LinkedIn.
=> https://www.linkedin.com/in/ujjawal-biswas-b40611142/
          _   _                         _  _      _                           
  _   _  (_) (_)  __ _ __      __ __ _ | || |__  (_) ___ __      __ __ _  ___ 
 | | | | | | | | / _` |\ \ /\ / // _` || || '_ \ | |/ __|\ \ /\ / // _` |/ __|
 | |_| | | | | || (_| | \ V  V /| (_| || || |_) || |\__ \ \ V  V /| (_| |\__ \
  \__,_|_/ |_/ | \__,_|  \_/\_/  \__,_||_||_.__/ |_||___/  \_/\_/  \__,_||___/
       |__/|__/                                                                                                                                                                               
*/


// The OMDB API [Not going to use]
// let API_KEY = "90a6832c";
// let url = `http://www.omdbapi.com/?s=spiderman&page=1&apikey=90a6832c`

// The TMDB API [Using]
// Month Mapping
let mon = {
  "01": "Jan",
  "02": "Feb",
  "03": "Mar",
  "04": "Apr",
  "05": "May",
  "06": "Jun",
  "07": "Jul",
  "08": "Aug",
  "09": "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

// storing html, id to render fast without xhr request.
var favorite_movies = {};
var favs_html = {};

// getting local storage
let x = JSON.parse(localStorage.getItem(favorite_movies));
let y = JSON.parse(localStorage.getItem(favs_html));

// if valid overwrite
if (x && y) {
  var favorite_movies = x;
  var favs_html = y;
}

// init sample vars
let query, movie_id, tv_id, poster_path;

// API Endpoints
const API_KEY = "fe4b25c36833fa63ecf9bd4124f69353";
let popular_movies_uri = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;

let search_movies_uri = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}&language=en-US&page=1&include_adult=false`;
let search_tv_shows_uri = `https://api.themoviedb.org/3/search/tv?query=${query}&api_key=${API_KEY}&language=en-US&page=1&include_adult=false`;
let solo_movie_uri = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${API_KEY}&language=en-US`;
let solo_tv_uri = `https://api.themoviedb.org/3/tv/${tv_id}?api_key=${API_KEY}&language=en-US`;
let movie_credit_uri = `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${API_KEY}&language=en-US`;
let tv_credit_uri = `https://api.themoviedb.org/3/tv/${tv_id}/credits?api_key=${API_KEY}&language=en-US`;
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Initially
// Homepage DOM
let media = document.getElementById("media");
let queryBox = document.getElementById("query-box");
let searchBtn = document.getElementById("search-btn");
if (queryBox) {
  queryBox.addEventListener("input", eventHandler);
}
if (media) {
  setPopularMovies(popular_movies_uri);
}
// on search btn click
if (searchBtn) {
  searchBtn.addEventListener("click", function () {
    let query = queryBox.value;
    let uri = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}&language=en-US&page=1&include_adult=false`;
    setSearchResults(uri);
  });
}

// user input listener
function eventHandler(e) {
  let query = e.target.value;
  let uri = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}&language=en-US&page=1&include_adult=false`;
  setSearchResults(uri);
}

// xhr api call method using fetch
async function fetchApi(uri) {
  try {
    const res = await fetch(uri);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

// set search results
async function setSearchResults(uri) {
  try {
    let res = await fetchApi(uri);
    console.log(res);
    data = res.results;
    if (data.length >= 1) {
      data.reverse().map((elem) => {
        let score = Math.round(elem.vote_average * 10);
        if (elem.poster_path && score > 0) {
          let html = `<div class="card" id="card${elem.id}">
          <div class="cover">
            <a href="./details.html?id=${elem.id}"><img src="${IMG_BASE_URL}${
            elem.poster_path
          }" alt="test" /></a>
          </div>
          <div class="rating" id="meter${elem.id}">
            <div class="hollow">${score}%</div>
          </div>
    
          <div class="details">
            <div class="info">
              <div class="title"><a href="./details.html?id=${elem.id}">${
            elem.title
          }</a></div>
              <div class="release">${formatDate(elem.release_date)}</div>
            </div>
            <div class="fav"><i id="${elem.id}" class="fa fa-heart" data-fav="${
            elem.id
          }"></i></div>
          </div>
        </div>`;

          media.insertAdjacentHTML("afterbegin", html);

          document.getElementById(
            `meter${elem.id}`
          ).style.background = `conic-gradient(hotpink ${
            3.6 * elem.vote_average * 10
          }deg, #eee 0deg)`;
        }
      });
    }

    markToggleFav(favorite_movies);
  } catch (error) {
    console.log(error);
  }
}

// set popular movies
async function setPopularMovies(uri) {
  try {
    let x = await fetchApi(popular_movies_uri);
    let arr = x.results;
    // console.log(arr);
    if (arr.length >= 1) {
      arr.reverse().map((elem) => {
        let score = Math.round(elem.vote_average * 10);
        if (elem.poster_path && score > 0) {
          let html = `<div class="card" id="card${elem.id}">
          <div class="cover">
            <a href="./details.html?id=${elem.id}"><img src="${IMG_BASE_URL}${
            elem.poster_path
          }" alt="test" /></a>
          </div>
          <div class="rating" id="meter${elem.id}">
            <div class="hollow">${score}%</div>
          </div>
    
          <div class="details">
            <div class="info">
              <div class="title"><a href="./details.html?id=${elem.id}">${
            elem.title
          }</a></div>
              <div class="release">${formatDate(elem.release_date)}</div>
            </div>
            <div class="fav"><i id="${elem.id}" class="fa fa-heart" data-fav="${
            elem.id
          }"></i></div>
          </div>
        </div>`;

          media.insertAdjacentHTML("afterbegin", html);

          document.getElementById(
            `meter${elem.id}`
          ).style.background = `conic-gradient(hotpink ${
            3.6 * elem.vote_average * 10
          }deg, #eee 0deg)`;
        }
      });

      markToggleFav(favorite_movies);
    }
  } catch (error) {
    console.log(error);
  }
}

// date formating
function formatDate(date) {
  date = date.split("-");
  new_date = `${mon[date[1]]} ${date[2]}, ${date[0]}`;
  return new_date;
}

// set movie castings
async function setCredits(uri) {
  try {
    const res = await fetchApi(uri);
    // console.log(res);
    casts = res.cast;
    let casting = document.getElementById("scrollbar");
    casts.reverse().map((cast) => {
      if (cast.profile_path) {
        let html = `<div class="cast">
      <div class="cover"><img src="${IMG_BASE_URL}${cast.profile_path}" alt="cast" /></div>
      <div class="character-name"><h4>${cast.character}</h4></div>
      <div class="original-name">${cast.original_name}</div>
    </div>`;

        casting.insertAdjacentHTML("afterbegin", html);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

// set movie details
async function setInfo(uri) {
  try {
    const res = await fetchApi(uri);
    var img = document.querySelector(".information .cover img");
    var title = document.querySelector(".information .extras .name");
    var runtime = document.querySelector(".information .extras .runtime");
    var description = document.querySelector(
      ".information .extras .overview .description"
    );
    img.setAttribute("src", `${IMG_BASE_URL}${res.poster_path}`);
    title.innerHTML = `<h2>${res.original_title}</h2>`;
    runtime.innerHTML = `${res.runtime} min`;
    description.innerHTML = `${res.overview}`;

    // console.log(res);
  } catch (error) {
    console.log(error);
  }
}

// fetching query param
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParm, prop) => searchParm.get(prop),
});
let id = params.id;
let page = params.page;

if (id != null) {
  let uri = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
  let uri2 = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`;

  setInfo(uri);
  setCredits(uri2);
}

if (page && page == "fav") {
  renderFavMovies(favorite_movies, favs_html);
}

// render fav movies
function renderFavMovies(favorite_movies, favs_html) {
  let content = document.getElementById("favorites");

  favorite_movies = JSON.parse(localStorage.getItem(favorite_movies));
  favs_html = JSON.parse(localStorage.getItem(favs_html));

  for (const key in favorite_movies) {
    if (favorite_movies[key]) {
      content.insertAdjacentHTML(
        "afterbegin",
        `<div id="card${key}" class="card"></div>`
      );

      document.getElementById(`card${key}`).innerHTML = favs_html[key];
    }
  }

  markToggleFav(favorite_movies);
}

// document eventListener
document.addEventListener("click", clickHandler);

// toggle color/state of favorite movies
function markToggleFav(favorite_movies) {
  favorite_movies = JSON.parse(localStorage.getItem(favorite_movies));
  // favs_html = JSON.parse(localStorage.getItem(favs_html));

  if (favorite_movies != null) {
    for (const key in favorite_movies) {
      let elem = document.getElementById(key);

      if (elem) {
        if (favorite_movies[key]) {
          elem.style.color = "tomato";
        } else {
          elem.style.color = "#fff";
        }
      }
    }
  }
}

// click handler on heart icon
function clickHandler(e) {
  if (e.target.hasAttribute("data-fav")) {
    let id = e.target.dataset.fav;
    let html = document.getElementById(`card${id}`).innerHTML;

    if (favorite_movies[id] !== undefined && favs_html[id] !== undefined) {
      favorite_movies[id] = !favorite_movies[id];
      if (favorite_movies[id] == false) {
        favs_html[id] = "";
      } else {
        favs_html[id] = html;
      }
    } else {
      favorite_movies[id] = true;
      favs_html[id] = html;
    }

    localStorage.setItem(favorite_movies, JSON.stringify(favorite_movies));
    localStorage.setItem(favs_html, JSON.stringify(favs_html));

    markToggleFav(favorite_movies);
    // refreshing
    if (page && page == "fav") {
      let content = document.getElementById("favorites");
      content.innerHTML = "";
      renderFavMovies(favorite_movies, favs_html);
    }
  }
}
