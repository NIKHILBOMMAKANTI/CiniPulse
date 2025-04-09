async function retrieveMovieById() {
  const urlParams = new URLSearchParams(window.location.search);
  movieid = urlParams.get("movie-id");
  const url = `https://cinipulse.onrender.com/movies/retrieveMovieById?movie-id=${movieid}`;
  const token = sessionStorage.getItem("Token");
  obj = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(url, obj);
  const data = await response.json();
  if (data) {
    const moviemediacontainer = document.getElementById("movie-media-container");
    moviemediacontainer.innerHTML = `<div class="movie-poster rounded overflow-hidden">
                    <img class="img-fluid" src=${data.Image_presignedUrl} alt="Movie Poster">
                </div>
                <div class="movie-trailer">
                    <iframe class="trailer-frame" width="560" height="315" src=${data.trailer_presignedUrl} 
                        title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                        gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>`;
    const movieinfo = document.getElementById("movie-info");
    movieinfo.innerHTML = `<h1 class="movie-title mb-2">${data.title}</h1>
                
                <div class="movie-meta d-flex align-items-center mb-3">
                    <span class="rating me-3"><i class="fas fa-star"></i> 9.0/10</span>
                    <span class="me-3"><i class="fas fa-calendar-alt me-1"></i>${
                      data.releaseDate
                    }</span>
                    <span class="me-3"><i class="fas fa-clock me-1"></i> 152 min</span>
                    <span><i class="fas fa-tag me-1"></i> ${data.genere.join(
                      ", "
                    )}</span>
                </div>
                
                <p class="movie-description mb-4">
                   ${data.description}
                </p>`;
  } else {
    Swal.fire({
      icon: "error",
      title: `${data.message}`,
      confirmButtonColor: "#e50914",
    });
  }
}
retrieveMovieById();

async function retriveAllReviews() {
  const urlParams = new URLSearchParams(window.location.search);
  movieid = urlParams.get("movie-id");
  console.log(movieid);
  const url = `https://cinipulse.onrender.com/review/retriveAllReviews?movie-id=${movieid}`;
  const token = sessionStorage.getItem("Token");
  console.log(token);
  const obj = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(url, obj);
  const result = await response.json();
  console.log(result.data);
  reviews_data = result.data;
  console.log(reviews_data);
  console.log(reviews_data.editable)
  if (result) {
    const commentlist = document.getElementById("comment-list");

    reviews_data.forEach((review) => {
      commentlist.innerHTML += `<div class="comment p-4" user-id=${review.userid}>
                        <div class="comment-header d-flex justify-content-between align-items-center mb-2">
                            <div class="user-rating">
                                <span class="comment-author fw-bold">${review.username}</span>
                                <div class="rateYo-${review._id}"></div>

                            </div>
                            <span class="comment-date">${review.createdAt}</span>
                        </div>
                        <p class="comment-text">
                            ${review.content}
                        </p>
                        ${review.editable === true ?
                         `<div class="d-flex mt-3">
                      
                        <button class="btn card-btn updatebtn" type="button"  reviewid = "${review._id}">
                            <i class="fas fa-edit me-1"></i> Update
                        </button>
                        <button class="btn card-btn deletebtn" type="button" reviewid = "${review._id}">
                            <i class="fas fa-trash me-1"></i> Delete
                        </button>
                    </div>`:  ''}
               `;
               $(`.rateYo-${review._id}`).rateYo({
                rating: review.rating,  
                fullStar: true,         
                readOnly: true,        
                starWidth: "15px"       
              });
        
    });
    //Delete EventListner
    const deletebtn = commentlist.querySelectorAll(".deletebtn");
    console.log(deletebtn);
    deletebtn.forEach((delbtn) => {
      delbtn.addEventListener("click", () => {
        const reviewid = delbtn.getAttribute("reviewid");
        deleteReview(reviewid);
      });
    });
    //Update EventListner
    const updatebtn = commentlist.querySelectorAll(".updatebtn");
    console.log(updatebtn);
    updatebtn.forEach((updbtn) => {
      updbtn.addEventListener("click", () => {
        const reviewid = updbtn.getAttribute("reviewid");
        const reviewElement = updbtn.closest(".comment"); 
        const content = reviewElement.querySelector(".comment-text").textContent.trim();
        updateReview(reviewid,content);
      });
    });
  }
}
retriveAllReviews();

async function deleteReview(reviewid) {
  const url = "https://cinipulse.onrender.com/review/deleteReview";
  const token = sessionStorage.getItem("Token");
  const obj = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: reviewid }),
  };
  const response = await fetch(url, obj);
  const data = await response.json();
  if (data.message == "Deleted Successfully") {
    Swal.fire({
      title: `${data.message}`,
      icon: "success",
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
      confirmButtonColor: "#e50914",
    });
  }
}

async function updateReview(reviewid,content) {
  const modalElement = document.getElementById("modal");
  const modalContent = modalElement.querySelector(".modal-content");
  modalContent.innerHTML = ` <div class="comment-form rounded p-4 ">
    <h3 class="text-white mb-4"><i class="fas fa-edit me-2"></i>Update Review</h3>
                    <form>
                        <div class="form-group mb-3">
                            <label class="d-block mb-1" for="comment">Your Review</label>
                            <textarea class="w-100 rounded p-2" id="comment" style="min-height: 100px;"
                                required>${content}</textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" id="submitreview">Update Review</button>
                    </form>
                </div>`;

  const submitbtn = modalContent.querySelector("#submitreview");
  submitbtn.addEventListener("click", async (e) => {
    e.preventDefault();

    console.log(movieid);
    const comment = modalContent.querySelector("#comment").value;
    console.log(comment);

    const updatedReview = {
      id: reviewid,
      content: comment,
    };

    const url = "https://cinipulse.onrender.com/review/updateReview";
    const token = sessionStorage.getItem("Token");
    const obj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedReview),
    };
    
    const response = await fetch(url,obj);
    const data = await response.json();
    console.log(data);

    if(data.message === 'Review Updated Successfully'){
      Swal.fire({
        title: `${data.message}`,
        icon: "success",
        confirmButtonColor: "#e50914",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    }else{
      Swal.fire({
        icon: "error",
        title: `${data.message}`,
        confirmButtonColor: "#e50914",
      });
    }

  });

  const modalInstance = new bootstrap.Modal(modalElement);
  modalInstance.show();
}

async function similarMovies(){
  const urlParams = new URLSearchParams(window.location.search);
  movieid = urlParams.get("movie-id");
  const url = `https://cinipulse.onrender.com/movies/similarMovies?movie-id=${movieid}`;
  const obj = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      
    },
  };
  const response = await fetch(url,obj);
  const data = await response.json();
  const result = data.data
  console.log(result);
  if(data){
    const moviesgrid = document.getElementById('movies-grid');
    result.forEach(MoviesData => {
      
        moviecard = document.createElement("div");
        moviecard.className = "movie-card rounded overflow-hidden"
        moviecard.addEventListener("click", () => handleCardClick(MoviesData._id));
        moviecard.innerHTML = `<div class="movie-card-poster">
                            <img class="w-100 h-100" src=${MoviesData.imagesignedurl}
                                alt="Movie Poster">
                        </div>
                        <div class="movie-card-info p-3">
                            <h3 class="movie-card-title fs-5 mb-1 text-truncate">${MoviesData.title}</h3>
                            <div class="movie-card-meta d-flex justify-content-between">
                                <span>${MoviesData.releaseDate}</span>
                                <span>8.2/10</span>
                            </div>
                        </div>`

                        moviesgrid.append(moviecard);
      });
      
    }
}
similarMovies()
function handleCardClick(movieId){
  window.location.href = `../../Views/MovieDetailspage.html?movie-id=${movieId}`
}

let selectedRating = 0;
$(document).ready(function () {
  $("#rateYo").rateYo({
    fullStar: true // Allows selecting only whole stars
}).on("rateyo.set", function (e, data) {
  selectedRating = data.rating; 
  // console.log("Rating selected: " + selectedRating);
});

});

const submitreviewbtn = document.getElementById("submitreview");
submitreviewbtn.addEventListener("click", async (e) => {
  e.preventDefault();
  
  const urlParams = new URLSearchParams(window.location.search);
  movieid = urlParams.get("movie-id");
  console.log(movieid);
  const comment = document.getElementById("comment").value;
  url = `https://cinipulse.onrender.com/review/addReview?movie-id=${movieid}`;
  const token = sessionStorage.getItem("Token");
  obj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      content: comment,
      rating:selectedRating
     }),
  };
  const response = await fetch(url, obj);
  const data = await response.json();
  if (data.message == "Review Added Successfully") {
    Swal.fire({
      title: `${data.message}`,
      confirmButtonColor: "#e50914",
      icon: "success",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  } else {
    Swal.fire({
      icon: "error",
      title: `${data.message}`,
      confirmButtonColor: "#e50914",
    });
  }
});