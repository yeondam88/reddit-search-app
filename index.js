"use strict";
/**
 *  Use IIFE to prevent to expose to global scope. (Also prevent name conflict with 3rd party library)
 *  Variables, functions, API wrapper object is not accessible in the browser.
 */
(function(document) {
  const $ = document.querySelector.bind(document); // Make alias for document.querySelector() to $
  /**
   *  DOM Selections
   */
  const searchForm = $("#search-form");
  const searchInput = $(".input-phone");
  const sortBySelect = $("#sortBy");
  const searchLimitSelect = $("#limit");
  const resultContainer = $("#result");

  /**
   * reddit API wrapper
   * returning promise with response.
   * @param {string} searchTerm
   * @param {string} sortBy
   * @param {number} searchLimit
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
    event.preventDefault(); // Prevent default action - by calling this method, browser will not refresh after subtmit.

    const searchTerm = searchInput.value; // get search term
    const sortBy = sortBySelect.value; // get sort option e.g. Relevance or latest
    const searchLimit = searchLimitSelect.value; // get searchlimit e.g. 5 or 10 or more

    // validation - if there is no search term and submitted, display error message.
    if (searchTerm === "") {
      showMessage("Please type any keyword to search", "alert alert-danger");
    }

    searchInput.value = ""; // resetting input value to empty

    redditAPI
      .search(searchTerm, sortBy, searchLimit)
      .then(results => renderCard(results))
      .catch(err => {
        console.error(err); // Display error message to the console.
        showMessage(
          // Display error message to User for better User Experience.
          "Oops something went wrong.. try later",
          "alert alert-danger"
        );
      });
  });

  /**
   * Rendering Cards
   * Get the data from API response and populating html
   * templates and insert to container to render.
   * @param {Object[]} data
   */
  function renderCard(data) {
    let output = '<div class="card-columns">';
    data.forEach(post => {
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
    resultContainer.innerHTML = output;
  }

  /**
   * Displaying Message - Helper function
   * @param {string} message
   * @param {string} className
   */
  function showMessage(message, className) {
    const div = document.createElement("div"); // element created
    div.className = `${className}`; // adding className to newly created div object.
    div.appendChild(document.createTextNode(message)); // append child element into div object.
    const innerContainer = $(".inner");
    const formGroup = $(".form-group");

    innerContainer.insertBefore(div, formGroup); // insert element before formGroup.

    setTimeout(() => {
      $(".alert").remove();
    }, 3000); // remove alert message after 3s.
  }

  /**
   * Truncate text with given limit number.
   * @param {string} text
   * @param {number} limit
   * @returns truncated text.
   */
  function truncateText(text, limit) {
    // find " " index start with index of limit (e.g. if limit is 30, then look for next " " start from index of 30)
    const shortened = text.indexOf(" ", limit);
    if (shortened == -1) {
      // if shortened not found - it means text is shorter than limit length then just return text.
      return text;
    } else {
      // if text is longer than limit, then slice it with shortened value and add '...' and return it.
      return text.substring(0, shortened) + "...";
    }
  }
})(document);
