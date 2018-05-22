const Search = {
  params: {
    "api_key": "vx1wCbzp9wKDWaSs3CUBwQ2KfZxbiF9y",
    "q": "",
    "limit": 24,
    "offset": 0
  },

  gifs: [],
  url: "",

  //Prepare search URL and increase the offset value
  prepareURL: function() {
    if ($("#searchInput").val() == "") {
      this.params.q = "Trending";
    } else {
      let searchString = $("#searchInput").val().split("");
      searchString.forEach((char, i) => {
        if (char == ' ') {searchString[i] = '+'}
      });
      this.params.q = searchString.join("");
    };

    Search.url = `http://api.giphy.com/v1/gifs/search?q=${this.params.q}&api_key=${this.params.api_key}&limit=${this.params.limit}&offset=${this.params.offset}`;
    this.params.offset += this.params.limit;
  },

  //Run the search using URL prepared by prepareURL method
  // and render the new Gifs with renderGifs() method
  search: function() {
    this.prepareURL();
    $.ajax({url: this.url, success: (result) => {
      this.gifs = result.data;
      this.renderGifs();
    }});
  },

  //Clearn the page of current GIFs and run the search() method with the current search string
  //This is used when clicking the Fetch! button or pressing enter while in the input field
  handleSearch: function() {
    $("#results").empty();
    this.params.offset = 0;
    this.search();
  },

  //Render all GIFs from the current this.gifs array of GIF objects
  renderGifs: function() {
    for (let i=0;i<this.gifs.length;i++) {
      let a = $("<a></a>").attr({
        href: this.gifs[i].images.original.url,
        target: "_blank"
      });
      let g = $("<img></img>").attr({
        src: this.gifs[i].images.fixed_width_downsampled.url,
        class: "gifThumbnail",
        height: 250,
        width: 250
      });
      a.append(g);
      $("#results").append(a);
    }
  }
};

const Elements = {
  input: $("<input></input>").attr({
    "id":"searchInput"
  }).on({
    keypress: function(e) {
      if (e.which == 13) {
        Search.handleSearch();
      }
    }
  }),

  searchButton: $("<button id=\"searchButton\"></button>").text("Fetch!").on({
    click: function() {
      Search.handleSearch();
    }
  }),

  loadMoreButton: $("<button id=\"loadMoreButton\"></button>").text("Load More GIFs").on("click",() => {
      Search.search();
  }),

  form: $("<div id=\"inputForm\"></div>"),

  results: $("<div id=\"results\"></div>")
}

//Put together all DOM elements
$("body").append(Elements.form.append(Elements.input,Elements.searchButton),"<br>",Elements.results,"<br>",Elements.loadMoreButton);

//Render the trending GIFs when loading the app
Search.prepareURL();
Search.search();
