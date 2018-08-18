/**
 *  DOM Selections
 */
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector(".input-phone");

/*
** Creating redditAPI wrapper object with search method.
** Search method required 3 parameters (searchTerm, sortBy, searchLimit)
*/
const redditAPI = {
  search: function(searchTerm, sortBy, searchLimit) {
    return fetch(
      `http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`
    )
      .then(response => response.json())
      .then(json => json.data.children.map(data => data.data)) // extract actual data within json object.
      .catch(err => console.error(err));
  }
};

/**
 *  add event listener to search form element.
 */
searchForm.addEventListener("submit", event => {
  const searchTerm = searchInput.value; // get search term

  const sortBy = document.querySelector('input[name="sortby"]:checked').value; // get sort option e.g. Relevance or latest

  const searchLimit = document.querySelector("#limit").value; // get searchlimit e.g. 5 or 10

  // validation - if there is no search term and submitted, display error message.
  if (searchTerm === "") {
    showMessage("Please fill out the form", "alert alert-danger");
  }

  searchInput.value = ""; // resetting input value to empty

  redditAPI.search(searchTerm, sortBy, searchLimit).then(results => {
    let output = '<div class="card-columns">';
    results.forEach(post => {
      let image = post.preview // if there is no image provided, replace with this placeholder image
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

/**
 * Displaying Message - Helper function
 * @param {string} message
 * @param {string} className
 */
function showMessage(message, className) {
  const div = document.createElement("div"); // element created
  div.className = `${className}`; // adding className to newly created div object.
  div.appendChild(document.createTextNode(message)); // append child element into div object.
  const innerContainer = document.querySelector(".inner");
  const formGroup = document.querySelector(".form-group");

  innerContainer.insertBefore(div, formGroup); // insert element before formGroup.

  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 3000); // remove alert message after 3s.
}

/**
 *
 * Truncate text with given limit number.
 * @param {string} text
 * @param {number} limit
 * @returns truncated text.
 */
function truncateText(text, limit) {
  const shortened = text.indexOf(" ", limit);
  if (shortened == -1) {
    return text;
  } else {
    return text.substring(0, shortened);
  }
}
