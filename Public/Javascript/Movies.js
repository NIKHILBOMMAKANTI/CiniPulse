const limit = 12;
let currentpage = 1;
let searchQuery = "";
async function retriveAllMovies(limit,offset = 0,search="") {
  let url = `http://localhost:3001/movies/retriveAllMovies?limit=${limit}&offset=${offset}`;
  if(search){
    url = `http://localhost:3001/movies/search?filter=${search}&limit=${limit}&offset=${offset}`
  }
  const token = sessionStorage.getItem("Token");
  const obj = {
    method: "GET",
  };
  const response = await fetch(url, obj);
  const moviesdata = await response.json();
  const result = moviesdata.data
  console.log(result);
  const cardcontainer = document.getElementById("card-container");
  cardcontainer.innerHTML = "";
  result.forEach((Movie) => {
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("movie-id", `${Movie._id}`);
    card.addEventListener("click", () => handleCardClick(Movie._id));
    card.innerHTML = `
        <img src=${Movie.Image_presignedUrl} class="card-img-top" alt="Movie Poster">
                <div class="card-body">
                    <h5 class="card-title"><span>Movie:</span>${Movie.title}</h5>
                    <h6 class="card-subtitle"><span>Director:</span>${Movie.director}</h6>
                    <h6 class="card-subtitle"><span>Release Date:</span>${Movie.releaseDate}</h6>
                    <h6 class="card-subtitle"><span>Genre:</span>${Movie.genere}</h6>
                    <p class="card-text">${Movie.slicedcontent}.</p>
                    <div class="d-flex justify-content-center align-items-center">
                    <div class="rateYo-${Movie._id}"></div>
                    </div>
                </div>`;
    cardcontainer.append(card);
    console.log(Movie.avg_rating);
    $(`.rateYo-${Movie._id}`).rateYo({
      rating:  `${Movie.avg_rating}` ,
      fullStar: true,         
      readOnly: true,        
      starWidth: "20px"       
    });


  });
}
retriveAllMovies(limit);


const next = document.getElementById("next");
next.addEventListener("click", () => {
  let previouspage = document.getElementById("previouspage");
  let activepage = document.getElementById("activepage");
  let nextpage = document.getElementById("nextpage");

  let previouspage_value = previouspage.textContent;
  let activepage_value = activepage.textContent;
  let nextpage_value = nextpage.textContent;
  
  currentpage++
  const offset = (currentpage-1)*limit;

  previouspage_value++;
  activepage_value++;
  nextpage_value++;

  previouspage.textContent = previouspage_value;
  activepage.textContent = activepage_value;
  nextpage.textContent = nextpage_value;

  retriveAllMovies(limit,offset);
  
});

const prev = document.getElementById("prev");
prev.addEventListener("click", () => {
  let previouspage = document.getElementById("previouspage");
  let activepage = document.getElementById("activepage");
  let nextpage = document.getElementById("nextpage");

  let previouspage_value = parseInt(previouspage.textContent);
  let activepage_value = parseInt(activepage.textContent);
  let nextpage_value = parseInt(nextpage.textContent);
 
  if (activepage_value > 2) {
    currentpage--;
    const offset = (currentpage-1)*limit;

    previouspage_value--;
    activepage_value--;
    nextpage_value--;

    previouspage.textContent = previouspage_value;
    activepage.textContent = activepage_value;
    nextpage.textContent = nextpage_value;

    retriveAllMovies(limit,offset);
  }

});
console.log(prev);

function handleCardClick(movieId) {
  window.location.href = `../../Views/MovieDetailspage.html?movie-id=${movieId}`;
}

//Search Functinality
const searchbtn = document.getElementById("search-btn");
searchbtn.addEventListener("click",async ()=>{
  searchQuery = document.getElementById("search-input").value;
  currentpage = 1;
  retriveAllMovies(limit,0,searchQuery)
});
