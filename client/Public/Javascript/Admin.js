const addmovie = document.getElementById("addbtn");
addmovie.addEventListener("click", async () => {
  const formData = new FormData();
  formData.append("Image", document.getElementById("Image").files[0]);
  formData.append("Trailer", document.getElementById("Trailer").files[0]);
  formData.append("title", document.getElementById("title").value);
  formData.append("director", document.getElementById("director").value);
  formData.append("genere", document.getElementById("genere").value);
  formData.append("releaseDate", document.getElementById("releaseDate").value);
  formData.append("description", document.getElementById("description").value);

  const url = "https://cinipulse.onrender.com/movies/addMovie";
  const token = sessionStorage.getItem("Token");

  const obj = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  };

  const response = await fetch(url, obj);
  const data = await response.json();
  console.log(data);
  if (data.message === "Movie Added Successfully") {
    Swal.fire({
      title: `${data.message}`,
      icon: "success",
      draggable: true,
      confirmButtonColor: "#e50914",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      title: `${data.message}`,
      draggable: true,
      confirmButtonColor: "#e50914",
    });
  }
});

const limit = 12;
let currentpage = 1;
async function retriveAllMovies(limit,offset = 0) {
  const url = `https://cinipulse.onrender.com/movies/retriveAllMovies?limit=${limit}&offset=${offset}`;
  const token = sessionStorage.getItem("Token");
  const obj = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(url, obj);
  const moviesdata = await response.json();
  const data = moviesdata.data;
  const cardcontainer = document.getElementById("card-container");
  cardcontainer.innerHTML = "";
  data.forEach((Movie) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `<img src=${Movie.Image_presignedUrl} class="card-img-top" alt="Movie Poster">
                <div class="card-body">
                    <h5 class="card-title"><span>Movie:</span>${Movie.title}</h5>
                    <h6 class="card-subtitle"><span>Director:</span>${Movie.director}</h6>
                    <h6 class="card-subtitle"><span>Release Date:</span>${Movie.releaseDate}</h6>
                    <h6 class="card-subtitle"><span>Genre:</span> Action, Adventure, Sci-Fi</h6>
                    <p class="card-text">${Movie.slicedcontent}.</p>
                    <div class="d-flex mt-3 action-buttons">
                        <button class="btn card-btn updatebtn" type="button"  data-movie-id = "${Movie._id}">
                            <i class="fas fa-edit me-1"></i> Update
                        </button>
                        <button class="btn card-btn deletebtn" type="button" data-movie-id = "${Movie._id}">
                            <i class="fas fa-trash me-1"></i> Delete
                        </button>
                    </div>
                </div>`;

    //UpdateMovie Event Listner
    const updatebtn = card.querySelector(".updatebtn");
    updatebtn.addEventListener("click", () => {
      updateMovie(Movie);
    });

    //DeleteMovie Event Listner
    const deletebtn = card.querySelector(".deletebtn");
    deletebtn.addEventListener("click", () => {
      id = deletebtn.getAttribute("data-movie-id");

      deleteMovie(id);
    });
    cardcontainer.append(card);
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

function updateMovie(Movie) {

    console.log(Movie);

    const genere = Movie.genere;
    console.log(genere);
    const generestr = genere.join(",");
    console.log(generestr);

const modalElement = document.getElementById("modal"); 
const modalContent = modalElement.querySelector(".modal-content");

modalContent.innerHTML = `<div class="update-form-container">
    <h3 class="text-white mb-4"><i class="fas fa-edit me-2"></i>Update Movie</h3>
    <div class="row g-3">
        <div class="col-md-3">
            <label class="form-label ">Movie Banner</label>
            <div class="input-group">
                <input type="file" class="form-control" id="Image" accept="image/*">
                <label class="input-group-text" for="bannerUpload"><i class="fas fa-image"></i></label>
            </div>
        </div>
        <div class="col-md-3">
            <label class="form-label ">Movie File</label>
            <div class="input-group">
                <input type="file" class="form-control" id="Trailer" accept="video/*">
                <label class="input-group-text" for="movieUpload"><i class="fas fa-video"></i></label>
            </div>
        </div>
        <div class="col-md-3">
            <label class="form-label ">Movie Title</label>
            <input type="text" class="form-control" id="title" placeholder="Enter movie title" value="${Movie.title}">
        </div>
        <div class="col-md-3">
            <label class="form-label ">Director</label>
            <input type="text" class="form-control" id="director" placeholder="Enter director name" value="${Movie.director}">
        </div>
        <div class="col-md-3">
            <label class="form-label">Genre</label>
            <input type="text" class="form-control" id="genere" placeholder="Enter Genre" value="${generestr}" >
        </div>
        <div class="col-md-3">
            <label class="form-label">Release Date</label>
            <input type="date" class="form-control" id="releaseDate" value="${Movie.releaseDate}">
        </div>
        <div class="col-md-4">
            <label class="form-label">Description</label>
            <textarea class="form-control" rows="1" placeholder="Enter movie description" id="description" ></textarea>
        </div>
        <div class="col-md-2 d-flex align-items-end">
            <button class="btn submitbtn w-100" id="submitbtn" movie-id="${Movie._id}">
                <i class="fas fa-save me-2"></i> Submit
            </button>
        </div>
    </div>
</div>`;


const description = modalContent.querySelector("#description");
description.value = Movie.description;

const submitbtn = modalContent.querySelector("#submitbtn")

submitbtn.addEventListener("click",async ()=>{

  // const id = 
  const formData = new FormData();
  const ImageInput = modalContent.querySelector("#Image")
  if(ImageInput.files.length>0){
    formData.append("Image", ImageInput.files[0]);
  }
  const TrailerInput = modalContent.querySelector("#Trailer");
  if(TrailerInput.files.length>0){
    formData.append("Trailer", TrailerInput.files[0]);
  }
  formData.append("id",submitbtn.getAttribute("movie-id"))
  formData.append("title", modalContent.querySelector("#title").value);
  formData.append("director", modalContent.querySelector("#director").value);
  formData.append("genere", modalContent.querySelector("#genere").value);
  formData.append("releaseDate", modalContent.querySelector("#releaseDate").value);
  formData.append("description", modalContent.querySelector("#description").value);

  // console.log([...formData.entries()])
  const url = 'https://cinipulse.onrender.com/movies/updateMovie'
  const token = sessionStorage.getItem("Token");
 
  const obj = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  };
  const response = await fetch(url,obj);
  const data = await response.json();
  console.log(data);
  if(data.message === 'Movie Updated Successfully'){
    Swal.fire({
      title: `${data.message}`,
      icon: "success",
      draggable: true,
      confirmButtonColor: "#e50914"
    }).then((result)=>{
      if(result.isConfirmed){
        window.location.reload();
      }
    });
  }else{
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `${data.message}`,
      confirmButtonColor: "#e50914"
    });
  }
})

  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();

}


function deleteMovie(id) {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn custom-confirm-btn",
      cancelButton: "btn custom-cancel-btn me-3",
    },
    buttonsStyling: false,
  });
  swalWithBootstrapButtons
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    })
    .then(async (result) => {
      if (result.isConfirmed) {
        const url = "https://cinipulse.onrender.com/movies/deleteMovie";
        const token = sessionStorage.getItem("Token");
        obj = {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        };
        const response = await fetch(url, obj);
        const data = await response.json();

        swalWithBootstrapButtons
          .fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          })
          .then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
      }
    });
}
