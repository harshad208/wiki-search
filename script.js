function search() {
  var searchTerm = document.getElementById("searchInput").value.trim();
  if (!searchTerm) {
    alert("Please enter a search term.");
    return;
  }

  // Display loading spinner
  var searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = '<div class="loader"></div>';

  // var searchUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=&srlimit=20&srsearch=" + searchTerm;
  var searchUrl = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + searchTerm + "&format=json&callback=processResults";

  var script = document.createElement("script");
  script.src = searchUrl;
  document.body.appendChild(script);
}

function processResults(data) {
  if (data.query.search.length > 0) {
    var title = data.query.search[0].title;
    fetchArticle(title);
  } else {
    displayError("No results found.");
  }
}

function fetchArticle(title) {
  var url = "https://en.wikipedia.org/w/api.php"; 

  var params = {
    action: "query",
    prop: "extracts",
    titles: title,
    format: "json",
    explaintext: true,
    exintro: true,
    redirects: true
  };

  url = url + "?origin=*";
  Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var pageId = Object.keys(data.query.pages)[0];
      var content = data.query.pages[pageId].extract;
      if (content) {
        displayContent(content);
      } else {
        displayError("Content not found.");
      }
    })
    .catch(function(error) {
      console.log(error);
      displayError("Error fetching article.");
    });
}

function displayContent(content) {
  var searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";

  var div = document.createElement("div");
  div.innerHTML = highlightSearchTerms(content);
  searchResults.appendChild(div);
}

function displayError(message) {
  var searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "<p>" + message + "</p>";
}

function highlightSearchTerms(content) {
  var searchTerm = document.getElementById("searchInput").value.trim();
  var regExp = new RegExp(searchTerm, "gi");
  return content.replace(regExp, "<span class='highlight'>" + searchTerm + "</span>");
}
