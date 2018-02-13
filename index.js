import reddit from "./redditapi";
import moment from "moment";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector(".input-phone");

searchForm.addEventListener("submit", event => {
  // get search term
  const searchTerm = searchInput.value;
  // get sort
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  // get limit
  const searchLimit = document.querySelector("#limit").value;
  // check input
  if (searchTerm === "") {
    showMessage("Please fill out the form", "alert alert-danger");
  }

  searchInput.value = "";

  reddit.search(searchTerm, searchLimit, sortBy).then(results => {
    let output = '<div class="card-columns">';
    results.forEach(post => {
      let image = post.preview
        ? post.preview.images[0].source.url
        : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
      output += `
        <div class="card">
          <img class="card-img-top" src=${image} alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p>Created at: ${moment.unix(post.created).format("YYYY-MM-DD")}</p>
            <p class="card-text">${truncateText(post.selftext, 100)}</p>
            <a href="${
              post.url
            }" target="_blank" class="btn btn-primary mt-4">Read More</a>
            <hr />
            <span class="badge badge-pill badge-info m-1">score: ${
              post.score
            }</span>
            <span class="badge badge-pill badge-dark m-1">comments: ${
              post.num_comments
            }</span>
            <span class="badge badge-pill badge-secondary m-1">subreddit: ${
              post.subreddit
            }</span>
          </div>
        </div>
        `;
    });
    output += "</div>";
    document.querySelector("#result").innerHTML = output;
  });

  event.preventDefault();
});

function showMessage(message, className) {
  // create div
  const div = document.createElement("div");
  div.className = `${className}`;
  div.appendChild(document.createTextNode(message));
  const innerContainer = document.querySelector(".inner");
  const formGroup = document.querySelector(".form-group");

  innerContainer.insertBefore(div, formGroup);

  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 3000);
}

function truncateText(text, limit) {
  const shortened = text.indexOf(" ", limit);
  if (shortened == -1) {
    return text;
  } else {
    return text.substring(0, shortened);
  }
}
