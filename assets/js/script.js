var containerMovieEl = document.getElementById("movie-container")
var containerRecipeEl = document.getElementById("recipe-container")
var dropdownRecipeEl = document.getElementById("recipe-dropdown")
var dropdownMovieEl = document.getElementById("movie-dropdown")
var containerSavedEl = document.getElementById("saved-container")
var containerSavedMoviesEl = document.getElementById("saved-movies")
var containerSavedRecipesEl = document.getElementById("saved-recipes")
var containerRecButtons = document.getElementById("recipe-buttons")
var containerMovieButtons = document.getElementById("movie-buttons")
var buttonKickback = document.getElementById("kickback-submit")
var pictures = document.getElementById("pictures")

//arrays/objects
var recipes = []
var savedRecipes = []
var movies = []
var savedMovies = []


//API Keys
var APIKeyOMDB = "70f249c8"
var APIKeySpoon = "42efe7879e514db4a352ca064d9a3edc"
var APIKeyMovieDB = "4ee2048f656df52ca79c1b3928871706"

//save recipes into local storage
var saveRecipe = function () {
    event.preventDefault()
    localStorage.setItem("recipes", JSON.stringify(savedRecipes));

}

//load Recipes -- called at site load
var loadRecipes = function () {
    var loadedRecipes = localStorage.getItem("recipes")
    if(!loadedRecipes) {
        return false;
    }

    loadedRecipes = JSON.parse(loadedRecipes)

    //savedRecipes is array for 'recipes' in local storage
    for (var i=0; i < loadedRecipes.length; i++) {
        displaySavedRecipes(loadedRecipes[i])
        savedRecipes.push(loadedRecipes[i])
}

}

//save movies into local storage
var saveMovie = function () {
    event.preventDefault()
    localStorage.setItem("movies", JSON.stringify(savedMovies));
}

//load movies -- called upon page load
var loadMovies = function () {
    var loadedMovies = localStorage.getItem("movies")
    if(!loadedMovies) {
        return false;
    }

    loadedMovies = JSON.parse(loadedMovies)

    //savedMovies is the array for local storage
    for (var i=0; i < loadedMovies.length; i++) {
        displaySavedMovies(loadedMovies[i])
        savedMovies.push(loadedMovies[i])
    }


}

//displays the cards after user hits "save for later"!
var displaySavedRecipes = function (recipeObject) {

    containerSavedMoviesEl.setAttribute("class", "colA col-10 col-md-8 col-xl-5 m-2")
    containerSavedRecipesEl.setAttribute("class", "colA col-10 col-md-8 col-xl-5 m-2")


    if (!containerSavedRecipesEl.firstChild) {
    var favoritesHeader = document.createElement("h5");
    favoritesHeader.textContent = "Favorite Recipes"
    containerSavedRecipesEl.appendChild(favoritesHeader)
    }

    if (!containerSavedMoviesEl.firstChild) {
        var favoritesHeader = document.createElement("h5");
        favoritesHeader.textContent = "Favorite Movies"
        containerSavedMoviesEl.appendChild(favoritesHeader)
        }

    //Build cards with recipe data
    var savedRecipeCardEl = document.createElement("div");
    savedRecipeCardEl.setAttribute("class", "card mb-3")
    savedRecipeCardEl.setAttribute("recipe-id", recipeObject.id)
    var savedRecipeInfoEl = document.createElement ("div");
    savedRecipeInfoEl.setAttribute("class", "card-body saved-card")
    var savedRecipeNameEl = document.createElement("h5")
    var savedCuisineNameEl = document.createElement("p")
    savedRecipeNameEl.textContent = recipeObject.title
    savedCuisineNameEl.textContent = recipeObject.cuisine

    //delete button attached to each recipe ID
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Remove";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("recipe-id", recipeObject.id);

    //add event to delete button that removes the card and the recipe from local storage
    deleteButtonEl.addEventListener("click", function () {
        event.preventDefault()
        var recipeDeleted = document.querySelector(".card[recipe-id='" + recipeObject.id + "']");
        recipeDeleted.remove()

        var updatedRecipes = []

        for (var i=0; i < savedRecipes.length; i++) {
            if (savedRecipes[i].id !== recipeObject.id) {
                updatedRecipes.push(savedRecipes[i])
            }
        }

        savedRecipes = updatedRecipes

        saveRecipe()

    })

    //make each card a button to load the page/ load the recipe or movie data
    savedRecipeInfoEl.addEventListener("click", function() {

        //handles display if clicked without using Kickback button yet
        pictures.style.display = "none"
        containerRecipeEl.setAttribute("class","colA col-10 col-md-8 col-xl-5 m-2")
        containerMovieEl.setAttribute("class", "colA col-10 col-md-8 col-xl-5 m-2")

        //if user clicks a card, it will load a Comedy movie if genre value is blank
        if (!dropdownMovieEl.value) {
            dropdownMovieEl.value = "Comedy"
            getGenreInfo(dropdownMovieEl.value)
        } else {
            //just load user choice for genre
            getGenreInfo(dropdownMovieEl.value)
        }

        
        //set array to current recipe data
        recipes = { 
            id: recipeObject.id,
            title: recipeObject.title,
            cuisine: recipeObject.cuisine
        }

        //set dropdown for user efficiency 
        dropdownRecipeEl.value = recipeObject.cuisine

        getRecipeInfo(recipeObject.id)
        
    } )

    //append to card element
    savedRecipeInfoEl.appendChild(savedRecipeNameEl)
    savedRecipeInfoEl.appendChild(savedCuisineNameEl)
    savedRecipeCardEl.appendChild(savedRecipeInfoEl)
    savedRecipeCardEl.appendChild(deleteButtonEl)
   
    //append ot saved container
    containerSavedRecipesEl.appendChild(savedRecipeCardEl)
    
}
//displays cards of movies to watch later
var displaySavedMovies = function (moviearray) {
    containerSavedMoviesEl.setAttribute("class", "colA col-10 col-md-8 col-xl-5 m-2")
    containerSavedRecipesEl.setAttribute("class", "colA col-10 col-md-8 col-xl-5 m-2")

    
    if (!containerSavedMoviesEl.firstChild) {
    var favoritesHeader = document.createElement("h5");
    favoritesHeader.textContent = "Favorite Movies"
    containerSavedMoviesEl.appendChild(favoritesHeader)
    }

    if (!containerSavedRecipesEl.firstChild) {
        var favoritesHeader = document.createElement("h5");
        favoritesHeader.textContent = "Favorite Recipes"
        containerSavedRecipesEl.appendChild(favoritesHeader)
        }

    //create card elements for saved movies 
    var savedMovieCardEl = document.createElement("div");
    savedMovieCardEl.setAttribute("class", "card mb-3")
    savedMovieCardEl.setAttribute("movie-id", moviearray.id)
    var savedMovieInfoEl = document.createElement("div")
    savedMovieInfoEl.setAttribute("class", "card-body saved-card")
    var savedMovieNameEl = document.createElement("h5")
    savedMovieNameEl.textContent = moviearray.title
    var savedMoviegenreEl = document.createElement("p")
    savedMoviegenreEl.textContent = moviearray.genre

    //delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Remove";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("movie-id", moviearray.id);
    //add Evenet listener to remove movie from local storage and card element
    deleteButtonEl.addEventListener("click", function () {
        event.preventDefault()
        //find matching card
        var movieDeleted = document.querySelector(".card[movie-id='" + moviearray.id + "']");
        movieDeleted.remove()

        //updated array and then remove matching ID
        var updatedMovies = []

        for (var i=0; i<savedMovies.length; i++) {
            if (savedMovies[i].id !== moviearray.id) {
                updatedMovies.push(savedMovies[i])
            }
        }

        savedMovies = updatedMovies 

        saveMovie()

    })

    //create click event for card to pull up recipe/set up page
    savedMovieInfoEl.addEventListener("click", function () {

        //handles display if clicked without using Kickback button yet
        pictures.style.display = "none"
        containerRecipeEl.setAttribute("class","colA col-10 col-md-8 col-xl-5 m-2")
        containerMovieEl.setAttribute("class", "colA col-10 col-md-8 col-xl-5 m-2")

        //depending on value in dropdown when card is clicked, run code or enter Chinese for user efficiency
        if (!dropdownRecipeEl.value) {
            dropdownRecipeEl.value = "Chinese";
            getRandomRecipe(dropdownRecipeEl.value)
        } else {
            getRandomRecipe(dropdownRecipeEl.value)
        }


        //update active movie array with current 'saved' movie data
        movies = {
            id: moviearray.id,
            genre: moviearray.genre,
            title: moviearray.title,
            poster: moviearray.poster
        }

        dropdownMovieEl.value = moviearray.genre

        //call functions to display movie in container
        displayMoviePoster(moviearray.title, moviearray.poster)
        getMovieInfo(moviearray.id)
    })

    //append children 
    savedMovieInfoEl.appendChild(savedMovieNameEl)
    savedMovieInfoEl.appendChild(savedMoviegenreEl)
    savedMovieCardEl.appendChild(savedMovieInfoEl)
    savedMovieCardEl.appendChild(deleteButtonEl)

    //append container to saved sections
    containerSavedMoviesEl.appendChild(savedMovieCardEl)
    
}

//Display movie poster from MovieDB API URL
var displayMoviePoster = function (movieTitle, posterId) {

    containerMovieEl.textContent = ""

    //posterId identifies unique poster identifier for movie
    var posterUrl = "https://image.tmdb.org/t/p/w200/" + posterId

    //create div and img elements to hold image
    var posterEl = document.createElement("div")
    posterEl.setAttribute("class", "text-center")
    var movieTitleEl = document.createElement("h3")
    var posterImg = document.createElement("img")
    var movieTitleEl = document.createElement("h3")
    posterImg.setAttribute("src", posterUrl)
    movieTitleEl.textContent = movieTitle
    movieTitleEl.setAttribute("class","movieTitle")
    posterImg.setAttribute("class","posterImg")
    
    //append to the poster element and then the movie container
    posterEl.appendChild(movieTitleEl);
    posterEl.appendChild(posterImg);

    containerMovieEl.appendChild(posterEl)
    
}

//Display movie information like Name, run time , etc 
var displayMovieInfo = function (data) {

    var moviePlot = data.Plot
    var movieYear = data.Year
    var movieRuntime = data.Runtime
    var movieRating = data.Rated 
    
    //create elements to display movie data
    var movieInfoEl = document.createElement("div");
    var moviePlotEl = document.createElement("p");
    var movieRuntimeEl = document.createElement("p");
    var movieYearEl = document.createElement("p");
    var movieRatingEl = document.createElement("p")
    var movieRatingColor = document.createElement("span")
    movieRatingColor.textContent = movieRating

        if (movieRating === "R" || movieRating === "TV-MA") {
            movieRatingColor.setAttribute("class", "bg-danger text-white p-1")
        } else if (movieRating === "PG-13") {
            movieRatingColor.setAttribute("class", "bg-warning text-black p-1")
        } else {
            movieRatingColor.setAttribute("class", "bg-success text-white p-1")
        }


    //add movie data to HTML elements
    moviePlotEl.textContent = moviePlot;
    movieRuntimeEl.textContent = "Runtime: " + movieRuntime;
    movieRatingEl.textContent = "Rating: ";
    movieYearEl.textContent = "Year: " + movieYear;

    movieRatingEl.appendChild(movieRatingColor)

    //Append to div section
    movieInfoEl.appendChild(moviePlotEl);
    movieInfoEl.appendChild(movieRuntimeEl);
    movieInfoEl.appendChild(movieRatingEl);
    movieInfoEl.appendChild(movieYearEl);
    moviePlotEl.setAttribute("class","moviePlot")
    movieRuntimeEl.setAttribute("class","movieExtraInfo")
    movieRatingEl.setAttribute("class","movieExtraInfo")
    movieYearEl.setAttribute("class","movieExtraInfo")

    //append to movie container
    containerMovieEl.appendChild(movieInfoEl)

    var newMovieBtn = document.createElement("button")
    newMovieBtn.setAttribute("type", "submit");
    newMovieBtn.setAttribute("class", "btn-action col-8 col-lg-4 m-2");
    newMovieBtn.textContent = "New Movie"
    newMovieBtn.addEventListener("click", function () {
        getGenreInfo(dropdownMovieEl.value)
    })

    var saveMovieBtn = document.createElement("button")
    saveMovieBtn.setAttribute("type", "submit");
    saveMovieBtn.setAttribute("class","btn-action col-8 col-lg-4 m-2");
    saveMovieBtn.textContent = "Save for Later"
    saveMovieBtn.addEventListener("click", function() {


        for (var i = 0; i < savedMovies.length; i++) {
            if (movies.id === savedMovies[i].id) {
                var prevSave = true
                }

            }

            if (!prevSave) {
                savedMovies.push(movies)
                saveMovie()
                displaySavedMovies(movies)
        }
    });

    containerMovieEl.appendChild(saveMovieBtn)
    containerMovieEl.appendChild(newMovieBtn)
    


}

//pass in genre choice to get genre IDs from MovieDB API
var getGenreInfo = function (choice) { 
    event.preventDefault()
    var genreUrl = "https://api.themoviedb.org/3/genre/movie/list?api_key=" + APIKeyMovieDB + "&language=en-US";

    fetch(genreUrl).then(function(response) {
        response.json().then(function(data) {
        
        //for loop to find the ID for matching choice
        for (var i=0; i < data.genres.length; i++)
            if (data.genres[i].name === choice) {
                var genreId = data.genres[i].id
                var genreName = data.genres[i].name
            }

            //get array of movies with that genreID
            getMovieArray(genreId, genreName)
    });
  });
};

//Movie array
var getMovieArray = function (genreId, genreName) {
    //random page -- organized from most to least popular - 50 is accessing top 1000 movies - can be variable
    pageNumber = Math.floor(Math.random() * Math.floor(50))

    //fetching movies what genre
    var movieArrayURL = "https://api.themoviedb.org/3/discover/movie?api_key=" + APIKeyMovieDB + "&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=" + pageNumber + "&with_genres=" + genreId;
    fetch(movieArrayURL).then(function(response) {
        response.json().then(function(data) {
        
        //get a random movie from the random page
        randomMovie = Math.floor(Math.random() * Math.floor(20))
        
        var movieId = data.results[randomMovie].id
        var movieTitle = data.results[randomMovie].title 
        var posterId = data.results[randomMovie].poster_path
        
        //set working array to current information, in case of save. 
        movies = {
            id: movieId,
            genre: genreName,
            title: movieTitle,
            poster: posterId
        }

        displayMoviePoster(movieTitle, posterId)
        getMovieInfo(movieId)
        });
    });
};

//Movie information from the Movie DB with movie ID. This will get a OMDB/IMDB movie ID.
var getMovieInfo = function (movieId) {

    var getMovieDetailsUrl = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + APIKeyMovieDB + "&language=en-US";
    fetch(getMovieDetailsUrl).then(function(response) {
        response.json().then(function(data) {

    idIMDB = data.imdb_id;

    getIMDBinfo(idIMDB);

    });
    });
};

//call to OMDB for cleaner data and synopsis 
var getIMDBinfo = function (idIMDB) {
    var getMovieInfoIMDBUrl = "https://www.omdbapi.com/?i=" + idIMDB + "&apikey=" + APIKeyOMDB;
    fetch(getMovieInfoIMDBUrl).then(function(response) {
        response.json().then(function(data) {

    displayMovieInfo(data)

    
        });
    });

};

//fetching food Ids based on cuisine type
var getRandomRecipe = function (cuisineType) {
    event.preventDefault()
    
    //offset the array to get a variation of the reciepes
    var offsetId = Math.floor(Math.random() * Math.floor(200));
    var typeFoodUrl = "https://api.spoonacular.com/recipes/complexSearch?cuisine=" + cuisineType + "&number=100&apiKey=" + APIKeySpoon + "&offset=" + offsetId; 
    fetch(typeFoodUrl).then(function(response) {
        response.json().then(function(data) {
            
            //random recipe
            randomFoodId = Math.floor(Math.random() * Math.floor(100))

            var foodId = data.results[randomFoodId].id;
           
            getRecipeInfo(foodId);
        })
    })
} 

//get the recipe information for the random choice
var getRecipeInfo = function(foodId){
    var recInfoUrl ="https://api.spoonacular.com/recipes/" + foodId + "/information?apiKey=" + APIKeySpoon;
    fetch(recInfoUrl).then(function(response) {
        response.json().then(function(data) {

        displayFoodRecipe(foodId, data);
})
})
}

var displayFoodRecipe = function(foodId, data) {

    //clear content from the section
    containerRecipeEl.textContent = ""

    var foodTitle = data.title
    var timePrep = data.readyInMinutes
    var foodCuisine = data.cuisines[0]
    var foodImage = data.image
    var foodSource = data.sourceUrl

    //update temp recipe array in case of local save 
    recipes = {
        id: foodId,
        title: foodTitle,
        cuisine: foodCuisine
    };

    var recipeInfoEl = document.createElement("div");
    var recipeNameEl = document.createElement("h3");

    var recipeSourceLink = document.createElement("a");
    var recipeImageEl = document.createElement("img");
    var recipePreptimeEl = document.createElement("p");
    var recipeInstructionsEl = document.createElement("p");
    
    //add the href to the picture so it links out to the recipe
    recipeSourceLink.setAttribute("href", foodSource)
    recipeImageEl.setAttribute("src", foodImage)
    recipeImageEl.setAttribute("class", "recipeImage")
    recipeNameEl.setAttribute("class", "recipeName")
    recipePreptimeEl.setAttribute("class", "recipePreptime")
    recipeInstructionsEl.setAttribute("class", "recipePreptime")

    recipeSourceLink.appendChild(recipeImageEl)

    recipeNameEl.textContent = foodTitle;
    recipePreptimeEl.textContent = "Prep time: " + timePrep + "  minutes";
    recipeInstructionsEl.textContent = "Click picture for recipe."
    
    recipeInfoEl.appendChild(recipeNameEl)
    recipeInfoEl.appendChild(recipePreptimeEl)
    recipeInfoEl.appendChild(recipeInstructionsEl)
    recipeInfoEl.appendChild(recipeSourceLink)

    containerRecipeEl.appendChild(recipeInfoEl)

    var newRecipeBtn = document.createElement("button")
    newRecipeBtn.setAttribute("type", "submit");
    newRecipeBtn.setAttribute("class", "btn-action col-8 col-lg-4 m-2");
    newRecipeBtn.textContent = "New Recipe"
    newRecipeBtn.addEventListener("click", function () {
        getRandomRecipe(dropdownRecipeEl.value)
    })

    var saveRecipeBtn = document.createElement("button")
    saveRecipeBtn.setAttribute("type", "submit");
    saveRecipeBtn.setAttribute("class", "btn-action col-8 col-lg-4 m-2");
    saveRecipeBtn.textContent = "Save for Later"
    saveRecipeBtn.addEventListener("click", function() {
        //added logic so you can't save twice
        for (var i = 0; i < savedRecipes.length; i++) {
            if (recipes.id === savedRecipes[i].id) {
                var prevSave = true
                }

            }

            if (!prevSave) {
                savedRecipes.push(recipes)
                saveRecipe()
                displaySavedRecipes(recipes)
        }
    });
    
    containerRecipeEl.appendChild(saveRecipeBtn)
    containerRecipeEl.appendChild(newRecipeBtn)

}

var generateRandRecMov = function(choiceMov, choiceRec) {
    event.preventDefault()

    // MODALS IF choiceMov or choiceRec is empty

        if (!choiceMov && !choiceRec) {
        document.getElementById("modal").style.display = "block";
        document.getElementById("modalText").innerHTML = "Please choose a cuisine type and a movie genre to continue!";
        return
        }

        if (!choiceMov) {
            document.getElementById("modal").style.display = "block";
            document.getElementById("modalText").innerHTML = "Please choose a movie genre!";
            return
        }

    //add here. if choiceMovie is blank, if choiceRecipe is blank, do this //
        if (!choiceRec) {
            document.getElementById("modal").style.display = "block";
            document.getElementById("modalText").innerHTML = "Please choose a cuisine type!";
            return
        }
    

    pictures.style.display = "none"
    containerRecipeEl.setAttribute("class","colA col-10 col-md-8 col-xl-5 m-2")
    containerMovieEl.setAttribute("class", "colA col-10 col-md-8 col-xl-5 m-2")

    getRandomRecipe(choiceRec);
    getGenreInfo(choiceMov);
}

//load movies upon opening of page
loadMovies()
loadRecipes()

//button click 
buttonKickback.addEventListener("click", function () {
    var choiceMovie = dropdownMovieEl.value;
    var choiceRecipe = dropdownRecipeEl.value;
    generateRandRecMov(choiceMovie, choiceRecipe)
});

// X button and CLOSE button on modals
var button = document.getElementById("close");
button.onclick = function() {
    var div = document.getElementById("modal");
    if (div.style.display !== "none") {
        div.style.display = "none";
    }
};

var button = document.getElementById("ok");
button.onclick = function() {
    var div = document.getElementById("modal");
    if (div.style.display !== "none") {
        div.style.display = "none";
    }
};
