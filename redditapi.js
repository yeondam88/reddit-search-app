export default {
  search: function(searchTerm, searchLimit, sortBy) {
    return fetch(
      `http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`
    )
      .then(response => response.json())
      .then(json => json.data.children.map(data => data.data))
      .catch(err => console.error(err));
  }
};
