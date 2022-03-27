const BASE_URL = 'https://movie-list.alphacamp.io';
const INDEX_URL = BASE_URL + '/api/v1/movies/';
const POSTER_URL = BASE_URL + '/posters/';
const dataPanel = document.querySelector('#data-panel');
const movies = JSON.parse(localStorage.getItem('favoriteMovies'));

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
        <a href="#" class="btn btn-danger btn-remove-movie" data-id="${
          item.id
        }">x</a>
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
  } else if (event.target.matches('.btn-remove-movie')) {
    removeFromFavorite(Number(event.target.dataset.id));
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

function removeFromFavorite(id) {
  const selected = movies.find((movie) => movie.id === id);
  const startIndex = movies.indexOf(selected);
  movies.splice(startIndex, 1);
  localStorage.setItem('favoriteMovies', JSON.stringify(movies));
  renderMovieList(movies);
}

renderMovieList(movies);
