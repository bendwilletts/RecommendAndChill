README.md

Team: Strawberry Jam
Repo: Senior_Team29

URL: http://45.55.152.150:5000/
(if doesnt work)
	install python3
	pip3 install flask
	pip3 install numpy
	pip3 install scikit
	pip3 install sklearn

	in /appl run "python3 app.py"
Design process:

Come up with recommendation engine:
	Found a basic movie dataset from kaggle to do analysis on (imdb-5000-movie-dataset)
	One hot encoded the genre types and added bias base on imdb score
	Use scikit nearest neighbours to return 5 neighbours from a 5KNN

Used flask as a backend engine
	Added search functionality and autocompletion
	Dynamically builds website based on recommended movies
	Scrapes more data from the movie database (https://developers.themoviedb.org/3/) to get more metadata for our website
	

DEMO: Start at front page
		There are top movies display on the bottom front page
		Click the movie to find out more
			(There is close button on top right)

	  Type movie title into search bar
		Make sure to pick movie from autocompleted selections
		Click go
		A list of 5 recommended movies should appear
			Can click on movie to show more details
			Information like Actors, description, link to trailer should appear