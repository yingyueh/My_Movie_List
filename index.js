const BASE_URL = 'https://movie-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/movies/';
const POSTER_URL = BASE_URL + '/posters/';
const dataPanel = document.querySelector('#data-panel');
const movies = [];
let filteredMovies = [];
const btnSubmit = document.querySelector('#search-submit');
const input = document.querySelector('#search-input');
const MOVIES_PER_PAGE = 12;
const paginator = document.querySelector('#paginator');

function renderMovieList(data) {
  let rawHTML = '';
  data.forEach(function (item) {
    rawHTML += `
    <div class="col-sm-3">
    <div class="mb-3">
    <div class="card">
        <img
        src=${POSTER_URL + item.image}
        class="card-img-top" alt="movie-poster" />
        <div class="card-body">
        <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
        <a
            href="#"
            class="btn btn-primary btn-show-movie"
            data-bs-toggle="modal"
            data-bs-target="#movie-modal" data-id="${item.id}"
            >More</a
        >
        <a href="#" class="btn btn-info btn-add-movie" data-id="${
          item.id
        }">+</a>
        </div>
    </div>
    </div>
    </div>
`;
  });
  dataPanel.innerHTML = rawHTML;
}

//listen to data panel
dataPanel.addEventListener('click', function (event) {
  if (event.target.matches('.btn-show-movie')) {
    renderMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches('.btn-add-movie')) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

function renderMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title');
  const modalImage = document.querySelector('#movie-modal-image');
  const releaseDate = document.querySelector('#movie-modal-date');
  const description = document.querySelector('#movie-modal-description');

  axios
    .get(INDEX_URL + id)
    .then(function (response) {
      const data = response.data.results;
      modalTitle.innerHTML = data.title;
      modalImage.innerHTML = `<img
      src="${POSTER_URL + data.image}"
      alt=""
      class="img-fluid"
    />`;
      releaseDate.innerHTML = data.release_date;
      description.innerHTML = data.description;
    })
    .catch(function (error) {
      console.log(error);
    });
}

//listen to search form
btnSubmit.addEventListener('click', function (event) {
  event.preventDefault();
  const keyword = input.value.trim().toLowerCase();
  if (!keyword.length) {
    return alert('請輸入有效字串!');
  }
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  if (filteredMovies.length === 0) {
    return alert(`您輸入關鍵字: ${keyword}沒有符合的搜尋結果`);
  }
  renderMovieList(filteredMovies);
  renderPaginator(filteredMovies.length);
});

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
  const movie = movies.find((movie) => movie.id === id);
  // console.log(movie);
  if (list.some((movie) => movie.id === id)) {
    return alert('此部電影已經在收藏清單中！');
  }
  list.push(movie);
  localStorage.setItem('favoriteMovies', JSON.stringify(list));
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = '';
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-id="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function getMoviesByPage(page) {
  const startIndex = MOVIES_PER_PAGE * (page - 1);
  const data = filteredMovies.length ? filteredMovies : movies;
  return data.slice(startIndex, startIndex + 12);
}

//listen to paginator
paginator.addEventListener('click', function (event) {
  // page 1 -> 0-11
  // page 2 -> 12-23
  // page 3 -> 24-35
  if (event.target.tagName !== 'A') return;
  const page = event.target.dataset.id;
  renderMovieList(getMoviesByPage(page));
});

//send request to index API
axios
  .get(INDEX_URL)
  .then(function (response) {
    // renderMovieList(response.data.results);
    movies.push(...response.data.results);
    console.log(response.data.results);
    renderMovieList(getMoviesByPage(1));
    renderPaginator(movies.length);
  })
  .catch(function (error) {
    console.log(error);
  });
