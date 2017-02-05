var headerDivOpen = true;
$(document).ready(function(){
	$.get( "https://api.themoviedb.org/3/movie/popular?api_key=37946df92f5e388631f319c87acd055a&language=en-US", function(data) {
		console.log(data);
		var pictures = 0;
		for(var i = 0; i<2; i++){
			var row= document.createElement("div");
			row.className = "row";
			var col = document.createElement("div");
			col.className += "col-lg-1";
			row.appendChild(col);
			for(var j = 0; j<10; j++){
				var col = document.createElement("div");
				col.className += "col-lg-1";
				var poster_path = data.results[pictures].poster_path;
				var image = document.createElement("img");
				image.src = "https://image.tmdb.org/t/p/original"+poster_path;
				image.className += "topPoster"
				image.setAttribute("backdrop", "https://image.tmdb.org/t/p/original"+data.results[pictures].backdrop_path);
				image.setAttribute("lightboxTitle", data.results[pictures].original_title); 
				image.setAttribute("lightboxDescription", data.results[pictures].overview);
				image.setAttribute("lightboxDirector", "");
				image.setAttribute("lightboxActors", "");
				image.setAttribute("lightboxId", data.results[pictures].id);
				col.appendChild(image);
				pictures++;
				row.appendChild(col);
			}
			var col = document.createElement("div");
			col.className += "col-lg-1";
			row.appendChild(col);
			document.getElementById("topMovies").appendChild(row);

			
		}
	});

	console.log("loaded");
	$("#searchButton").click(function(){
		$("#topMovies").empty();

		var query = $("#searchInput").val();
		console.log(query);
		$.get( "/search", {	query: query }, function(data) {
			$("#resultsContainer").empty();
			if(headerDivOpen == true){
				$("#headerDiv").css("height","260px");
				$("#headerDiv").css("padding-top","20px");
		  		headerDivOpen = false;
		  	}
		  	data = JSON.parse(data);
		  	console.log(data);
	
		  	for(var i = 0; i<data.length; i++){
		  		movieDetails = data[i];
			  	console.log(i);
			  	var movieName = movieDetails.movie_title;
			  	$.ajax({
				    url : buildTMDBQuery(movieName),
				    type : "get",
				    async: false,
				    success : function(tmdb) {
				       tmdb = tmdb.results[0];
				  		console.log("details["+i+"]: "+movieDetails);
				  		createMovieListing(tmdb, movieDetails);
				    }
				 });
			  		
		  	}
		  	
		})

	});


	$("#headerDiv").click(function(e){
		if (e.target !== this)
    		return;
		if(headerDivOpen == true){
			$("#headerDiv").css("height","260px");
			$("#headerDiv").css("padding-top","20px");
		  	headerDivOpen = false;
		}
		else{
			$("#headerDiv").css("height","45vh");
			$("#headerDiv").css("padding-top","80px");
		  	headerDivOpen = true;
		}
	});

	$("body").on("click",".movieDetails",function(){
		document.getElementById("backdrop").src= $(this).attr("backdrop");
		document.getElementById("lightboxTitle").innerHTML = $(this).attr("lightboxTitle");
		document.getElementById("lightboxDescription").innerHTML = $(this).attr("lightboxDescription");
		document.getElementById("lightboxDirector").innerHTML = $(this).attr("lightboxDirector");
		document.getElementById("lightboxActors").innerHTML = $(this).attr("lightboxActors");


		$("#lightbox").css("display", "block");
		$("#lightbox").css("opacity", "1");
	});
	$("#closeLightbox").click(function(){
		$("#lightbox").css("display", "none");
	});

	$("body").on("click",".topPoster",function(){
		document.getElementById("backdrop").src= $(this).attr("backdrop");
		document.getElementById("lightboxTitle").innerHTML = $(this).attr("lightboxTitle");
		document.getElementById("lightboxDescription").innerHTML = $(this).attr("lightboxDescription");
		document.getElementById("lightboxDirector").innerHTML = $(this).attr("lightboxDirector");
		document.getElementById("lightboxActors").innerHTML = $(this).attr("lightboxActors");

		request = "http://api.themoviedb.org/3/movie/"+$(this).attr("lightboxId")+"/videos?api_key=37946df92f5e388631f319c87acd055a"
		$.get(request, function(trailer){
			trailerId = trailer.results[0].key;
			console.log(trailer);	
			document.getElementById("traileriframe").src = "https://www.youtube.com/embed/"+trailerId;
		});

		$("#lightbox").css("display", "block");
		$("#lightbox").css("opacity", "1");
	});
});

function buildTMDBQuery(movieName){
	var request = "https://api.themoviedb.org/3/search/movie?api_key=37946df92f5e388631f319c87acd055a&query="
 	return request+movieName;
}

function createMovieListing(tmdb, movieDetails){
	console.log(movieDetails);
	var overviewLimit = 300;
	console.log(tmdb);
	var jumbotron = document.createElement("div");
	jumbotron.className +="jumbotron";
	
	var leftdiv = document.createElement("div");
	leftdiv.className+="col-lg-4";
	var poster = document.createElement("img");
	poster.className+="poster";
	poster.src = "https://image.tmdb.org/t/p/original"+tmdb.poster_path;

	var actorPictures = document.createElement("div");
	actorPictures.className+="actorPictures";	
	leftdiv.appendChild(poster);
	leftdiv.appendChild(actorPictures);
	var rightdiv = document.createElement("div");
	rightdiv.className+="col-lg-8";
	var movieTitle = document.createElement("h2");
	movieTitle.innerHTML = tmdb.original_title;
	movieTitle.className += "movieTitleAttribute";
	var year = document.createElement("h3");
	year.innerHTML = "("+tmdb.release_date.substring(0,4)+")";
	year.className += "yearAttribute";
	var description = document.createElement("p");
	description.className += "descriptionAttribute";
	overview = tmdb.overview;
	if(overview.length > overviewLimit){
		var shorterOverview = "";
		overviewArr = overview.split(".");
		for(var i = 0; i< overviewArr.length && shorterOverview.length < overviewLimit; i++){
			shorterOverview += overviewArr[i];
			shorterOverview += ".";
		}
		description.innerHTML = shorterOverview;
	}
	else{
		description.innerHTML = overview;
	}
	var director = document.createElement("h4");
	director.className += "directorAttribute";
	director.innerHTML = "Director: "+movieDetails.director_name;
	var cast = document.createElement("h4");
	cast.className += "castAttribute";
	cast.innerHTML = "Cast: "+ movieDetails.actor_1_name+", "+movieDetails.actor_2_name+", "+movieDetails.actor_3_name;


	var seeMore = document.createElement("button");
	seeMore.className += "btn btn-success movieDetails";
	seeMore.innerHTML = "Get more details";
	
	rightdiv.appendChild(movieTitle);
	rightdiv.appendChild(year);
	rightdiv.appendChild(description);
	rightdiv.appendChild(director);
	rightdiv.appendChild(cast);
	rightdiv.appendChild(seeMore);

	jumbotron.appendChild(leftdiv);

	jumbotron.appendChild(rightdiv);

	addActorPhoto(actorPictures, movieDetails.actor_1_name);
	addActorPhoto(actorPictures, movieDetails.actor_2_name);
	addActorPhoto(actorPictures, movieDetails.actor_3_name);
	document.getElementById("resultsContainer").appendChild(jumbotron);

	seeMore.setAttribute("backdrop", "https://image.tmdb.org/t/p/original"+tmdb.backdrop_path);
	seeMore.setAttribute("lightboxTitle", tmdb.original_title); 
	seeMore.setAttribute("lightboxDescription", overview);
	seeMore.setAttribute("lightboxDirector", "Director:" +movieDetails.director_name);
	seeMore.setAttribute("lightboxActors", "Cast: "+ movieDetails.actor_1_name+", "+movieDetails.actor_2_name+", "+movieDetails.actor_3_name);

	request = "http://api.themoviedb.org/3/movie/"+tmdb.id+"/videos?api_key=37946df92f5e388631f319c87acd055a"
	$.get(request, function(trailer){
		trailerId = trailer.results[0].key;
		document.getElementById("traileriframe").src = "https://www.youtube.com/embed/"+trailerId;
	});
	
}

function addActorPhoto(leftdiv, actorname){
	console.log(actorname);
	request = "http://api.tmdb.org/3/search/person?api_key=37946df92f5e388631f319c87acd055a&query="+actorname;
	$.get(request, function(actorInfo){
		actorImage = actorInfo.results[0].profile_path;
		if(actorImage!= null){
			var image = document.createElement("img");
			image.className +="img-responsive actorImage";
			console.log("https://image.tmdb.org/t/p/original"+actorImage);
			image.src = "https://image.tmdb.org/t/p/original"+actorImage;

			leftdiv.append(image);
		}
	});
}

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
    // an array that will be populated with substring matches
    matches = [];
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });
    cb(matches);
  };
};

var movies = ['10 Cloverfield Lane', '10 Days in a Madhouse', '10 Things I Hate About You', '10,000 B.C.', '11:14', '12 Angry Men', '12 Monkeys', '12 Years a Slave', '127 Hours', '13 Hours', '1776', '1982', '20 Feet from Stardom', '20,000 Leagues Under the Sea', '20,000 Leagues Under the Sea', '2001: A Space Odyssey', '2046', '21 Grams', '21 Jump Street', '22 Jump Street', '24 7: Twenty Four Seven', '25th Hour', '28 Days Later...', '300', '3:10 to Yuma', '3rd Rock from the Sun', '4 Months, 3 Weeks and 2 Days', '42', '42nd Street', '50/50', '500 Days of Summer', '51 Birch Street', '8 Women', '8: The Mormon Proposition', '9', 'A Beautiful Mind', "A Beginner's Guide to Snuff", 'A Better Life', 'A Bridge Too Far', "A Bug's Life", 'A Charlie Brown Christmas', 'A Christmas Story', 'A Few Good Men', 'A Fistful of Dollars', "A Hard Day's Night", 'A History of Violence', 'A League of Their Own', 'A Man for All Seasons', 'A Mighty Wind', 'A Nightmare on Elm Street', 'A Nightmare on Elm Street', 'A Passage to India', 'A Room for Romeo Brass', 'A Room with a View', 'A Scanner Darkly', 'A Separation', 'A Shine of Rainbows', 'A Simple Plan', 'A Single Man', 'A Streetcar Named Desire', 'A Time to Kill', 'A Touch of Frost', 'A Very Long Engagement', 'A Walk to Remember', 'A.I. Artificial Intelligence', 'Aberdeen', 'About Schmidt', 'About Time', 'About a Boy', 'Across the Universe', 'Across the Universe', 'Adam', 'Adaptation.', 'Agora', 'Aimee & Jaguar', 'Airlift', 'Airplane!', 'Ajami', 'Akeelah and the Bee', 'Akira', 'Aladdin', 'Alien', 'Aliens', 'Alive', 'All That Jazz', 'All or Nothing', "Alleluia! The Devil's Carnival", 'Almost Famous', 'Along the Roadside', 'Amadeus', 'Amen.', 'America Is Still the Place', 'American Beauty', 'American Gangster', 'American Graffiti', 'American History X', 'American Hustle', 'American Psycho', 'American Sniper', 'American Splendor', 'Amistad', 'Amores Perros', 'Amour', 'Amélie', 'An American Girl Holiday', 'An American in Hollywood', 'An Education', 'An Inconvenient Truth', 'Anastasia', 'Anchorman: The Legend of Ron Burgundy', "Anderson's Cross", "Angela's Ashes", 'Animal House', 'Animal Kingdom', 'Anne of Green Gables', 'Annie Hall', 'Anomalisa', 'Another Year', 'Ant-Man', 'Antarctica: A Year on Ice', 'Antwone Fisher', 'Apocalypse Now', 'Apocalypto', 'Apollo 13', 'Archaeology of a Woman', 'Argo', 'Arlington Road', 'Army of Darkness', 'Arthur', 'Arthur Christmas', 'As Good as It Gets', 'As It Is in Heaven', 'Atonement', 'August Rush', 'August: Osage County', 'Avatar', 'Avengers: Age of Ultron', 'Away We Go', 'Ayurveda: Art of Being', 'Baahubali: The Beginning', 'Babel', 'Back to the Future', 'Back to the Future Part II', 'Back to the Future Part III', 'Bad Santa', 'Bambi', 'Bananas', 'Barfi', "Barney's Version", 'Barry Lyndon', 'Batman', 'Batman Begins', 'Batman: The Dark Knight Returns, Part 2', 'Beasts of the Southern Wild', 'Becoming Jane', 'Beetlejuice', 'Before Midnight', 'Before Sunrise', 'Before Sunset', 'Begin Again', 'Beginners', 'Being John Malkovich', 'Being Julia', 'Bella', 'Bending Steel', 'Beneath Hill 60', 'Best in Show', 'Better Luck Tomorrow', 'Beverly Hills Cop', 'Bewitched', 'Beyond the Mat', 'Big', 'Big Fish', 'Big Hero 6', 'Big Trouble in Little China', 'Billy Elliot', 'Birdman or (The Unexpected Virtue of Ignorance)', 'Biutiful', 'Black Book', 'Black Hawk Down', 'Black Swan', 'Black Water Transit', 'Blade', 'Blade Runner', 'Blazing Saddles', 'Blood Diamond', 'Blood In, Blood Out', 'Bloody Sunday', 'Blow', 'Blow Out', 'Blue Jasmine', 'Blue Ruin', 'Blue Valentine', 'Body of Lies', 'Bones', 'Boogie Nights', 'Boom Town', 'Borat: Cultural Learnings of America for Make Benefit Glorious Nation of Kazakhstan', 'Born on the Fourth of July', 'Bottle Rocket', 'Bound', 'Bowling for Columbine', 'Boyhood', "Boys Don't Cry", 'Boyz n the Hood', 'BrainDead', "Bram Stoker's Dracula", 'Brave', 'Braveheart', 'Brazil', 'Bridge of Spies', 'Bridge to Terabithia', 'Brigham City', 'Brokeback Mountain', 'Bronson', 'Brooklyn', 'Brother', 'Brotherly Love', 'Brothers', 'Brothers', 'Bubba Ho-Tep', 'Buen Día, Ramón', "Buffalo '66", 'Buffy the Vampire Slayer', 'Bullets Over Broadway', 'Burn', 'Butch Cassidy and the Sundance Kid', 'Butterfly Girl', 'Caddyshack', 'Call + Response', 'Cape Fear', 'Capitalism: A Love Story', 'Capote', 'Captain America: Civil War', 'Captain America: The Winter Soldier', 'Captain Phillips', 'Caramel', 'Carlos', 'Carnage', 'Cars', 'Casablanca', 'Casino', 'Casino Royale', 'Casino Royale', 'Cast Away', 'Cat on a Hot Tin Roof', 'Catch Me If You Can', 'Catch-22', 'Censored Voices', 'Central Station', 'Changeling', 'Character', 'Chariots of Fire', "Charlie Wilson's War", 'Charly', 'Chasing Amy', 'Chasing Mavericks', 'Chicago', 'Children of Heaven', 'Children of Men', 'Chocolat', 'Chronicle', 'Cinderella Man', 'City Island', 'City of God', 'City of Life and Death', 'Clerks', 'Clerks II', 'Close Encounters of the Third Kind', 'Closer', 'Closer to the Moon', 'Cloud Atlas', 'Coach Carter', "Coal Miner's Daughter", 'Cold Mountain', 'Collateral', 'Coming Home', 'Concussion', 'Confessions of a Dangerous Mind', 'Constantine', 'Contact', 'Control', 'Conversations with Other Women', 'Coraline', 'Corpse Bride', 'Crash', 'Crash', 'Crazy Heart', 'Crazy Stone', 'Crazy, Stupid, Love.', 'Creed', 'Cries & Whispers', 'Crimson Tide', 'Crouching Tiger, Hidden Dragon', 'Cry Freedom', 'Cube', 'Dallas Buyers Club', 'Dancer in the Dark', 'Dances with Wolves', 'Dangerous Liaisons', 'Dangerous Liaisons', 'Danny Collins', 'Daredevil', 'Dark Angel', 'Dark City', 'Das Boot', "Dave Chappelle's Block Party", 'Dawn of the Dead', 'Dawn of the Dead', 'Dawn of the Planet of the Apes', 'Day of the Dead', 'Day of the Dead', 'Days of Heaven', 'Dazed and Confused', 'Dead Man Walking', "Dead Man's Shoes", 'Dead Poets Society', 'Deadline - U.S.A.', 'Deadline Gallipoli', 'Deadpool', 'Dear Frankie', 'Death at a Funeral', 'Death at a Funeral', 'Deceptive Practice: The Mysteries and Mentors of Ricky Jay', 'Deconstructing Harry', 'Definitely, Maybe', 'Dekalog', 'Dekalog', 'Del 1 - Män som hatar kvinnor', 'Desperado', 'Despicable Me', 'Despicable Me 2', 'Destiny', 'Die Hard', 'Die Hard 2', 'Die Hard with a Vengeance', 'Diner', 'Dinner Rush', 'Dirty Pretty Things', 'District 9', 'District B13', 'Django Unchained', 'Do the Right Thing', 'Doctor Zhivago', 'Dogma', 'Dogtooth', 'Dogtown and Z-Boys', 'Donnie Brasco', 'Donnie Darko', 'Dope', 'Doubt', 'Down for Life', 'Downfall', 'Dr. No', 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', 'Dredd', 'Dredd', 'Dressed to Kill', 'Drive', 'Driving Miss Daisy', 'Duma', 'Dumb & Dumber', 'E.T. the Extra-Terrestrial', 'Earth', 'Eastern Promises', 'Easy A', 'Ed Wood', 'Eddie the Eagle', 'Eddie the Eagle', 'Edge of Tomorrow', 'Edward Scissorhands', 'Eight Below', 'Election', 'Elite Squad', 'Elizabeth', 'Elling', 'Elmer Gantry', 'Emma', 'Empire', 'Enchanted', 'End of Watch', 'Enemy at the Gates', 'Enemy of the State', 'Enough Said', 'Enter the Void', 'Entourage', 'Equilibrium', 'Eraserhead', 'Erin Brockovich', 'Ernest & Celestine', 'Escape from Alcatraz', 'Escape from New York', 'Eternal Sunshine of the Spotless Mind', 'Eureka', "Eve's Bayou", 'Everest', "Everybody's Fine", 'Evil Dead II', 'Ex Machina', 'Exiled', 'Exotica', 'Eyes Wide Shut', 'Face/Off', 'Fahrenheit 9/11', 'Fantasia', 'Fantasia 2000', 'Fantastic Mr. Fox', 'Far from Heaven', 'Far from Men', 'Fargo', 'Fast Five', 'Fast Times at Ridgemont High', 'Fat, Sick & Nearly Dead', 'Fateless', 'Fear and Loathing in Las Vegas', 'Fiddler on the Roof', 'Fight Club', 'Find Me Guilty', 'Finding Forrester', 'Finding Nemo', 'Finding Neverland', 'First Blood', 'First Blood', 'Fish Tank', 'Flags of Our Fathers', 'Flame and Citron', 'Flight', 'Flipped', 'Florence Foster Jenkins', 'Food Chains', 'Food, Inc.', 'Forgetting Sarah Marshall', 'Forrest Gump', 'Four Lions', 'Four Weddings and a Funeral', 'Frailty', 'Frances Ha', 'Freedom Writers', 'Frenzy', 'Frequency', 'Frida', 'Friday', 'Friday Night Lights', 'From Dusk Till Dawn', 'From Here to Eternity', 'From Russia with Love', 'Frost/Nixon', 'Frozen', 'Frozen River', 'Fruitvale Station', 'Fuel', 'Furious 7', 'Fury', 'Galaxy Quest', 'Gandhi', 'Gandhi, My Father', 'Gangs of New York', "Gangster's Paradise: Jerusalema", 'Garden State', 'Gattaca', "Gentleman's Agreement", 'George Washington', 'Get Low', 'Get Real', 'Gettysburg', 'Ghost Dog: The Way of the Samurai', 'Ghost World', 'Girl, Interrupted', 'Give Me Shelter', 'Gladiator', 'Glengarry Glen Ross', 'Glory', 'Glory', 'Glory Road', 'Go', 'Gods and Monsters', 'Godzilla Resurgence', 'Godzilla Resurgence', 'GoldenEye', 'Goldfinger', 'Gomorrah', 'Gone Girl', 'Gone with the Wind', 'Good Bye Lenin!', 'Good Morning, Vietnam', 'Good Night, and Good Luck.', 'Good Will Hunting', 'Goodfellas', 'Gosford Park', 'Gran Torino', 'Gravity', 'Grease', 'Green Room', 'Gremlins', 'Grindhouse', 'Grosse Pointe Blank', 'Groundhog Day', 'Growing Up Smith', 'Guardians of the Galaxy', 'Guiana 1838', "Hachi: A Dog's Tale", 'Half Nelson', 'Halloween', 'Halloween', 'Halloween', 'Hamlet', 'Hamlet', 'Hands of Stone', 'Hannibal', 'Happiness', 'Happy Valley', 'Hard Candy', 'Harold & Kumar Go to White Castle', 'Harrison Montgomery', 'Harry Brown', 'Harry Potter and the Chamber of Secrets', 'Harry Potter and the Deathly Hallows: Part II', 'Harry Potter and the Goblet of Fire', 'Harry Potter and the Half-Blood Prince', 'Harry Potter and the Order of the Phoenix', 'Harry Potter and the Prisoner of Azkaban', "Harry Potter and the Sorcerer's Stone", 'Headhunters', 'Heavenly Creatures', 'Hedwig and the Angry Inch', "Hell's Angels", 'Henry V', 'Her', 'Hero', 'Hero', 'Heroes', 'Heroes of Dirt', 'Hesher', 'Hidden Away', 'High Fidelity', 'High Noon', 'High Plains Drifter', 'Highlander', 'Holes', 'Holy Motors', 'Home Alone', 'Home Movies', 'Hoop Dreams', 'Hot Fuzz', 'Hotel Rwanda', 'Hotel Transylvania', 'House of Flying Daggers', 'House of Sand', 'House of Sand and Fog', 'How Green Was My Valley', 'How to Train Your Dragon', 'How to Train Your Dragon 2', 'Howards End', "Howl's Moving Castle", 'Hud', 'Hugo', 'Human Traffic', 'Hustle & Flow', 'I Am Legend', 'I Am Sam', 'I Love You, Man', 'I Origins', 'I Served the King of England', 'I, Robot', 'Ice Age', 'Ida', 'Identity', 'Imaginary Heroes', 'In Bruges', 'In Cold Blood', 'In the Bedroom', 'In the Company of Men', 'In the Heat of the Night', 'In the Shadow of the Moon', 'In the Valley of Elah', 'Incendies', 'Inception', 'Indiana Jones and the Last Crusade', 'Indiana Jones and the Temple of Doom', 'Indie Game: The Movie', 'Indignation', 'Infamous', 'Inglourious Basterds', 'Inside Job', 'Inside Llewyn Davis', 'Inside Man', 'Inside Out', 'Insomnia', 'Instructions Not Included', 'Interstellar', 'Interview with the Vampire: The Vampire Chronicles', 'Into the Wild', "Intolerance: Love's Struggle Throughout the Ages", 'Invictus', 'Ip Man 3', 'Iraq for Sale: The War Profiteers', 'Iris', 'Iron Man', 'Iron Man 3', 'Irreplaceable', 'Irreversible', 'It Happened One Night', "It's All Gone Pete Tong", "It's Always Sunny in Philadelphia", "It's Kind of a Funny Story", "It's a Mad, Mad, Mad, Mad World", "It's a Wonderful Life", 'JFK', 'Jackass 3D', 'Jackass Number Two', 'Jackie Brown', 'Jarhead', 'Jason Bourne', 'Jaws', 'Jerry Maguire', 'Journey from the Fall', 'Joyeux Noel', 'Judgment at Nuremberg', 'Julia', 'Juno', 'Juno', 'Jurassic Park', 'K-PAX', 'Kevin Hart: Laugh at My Pain', 'Kick-Ass', 'Kickboxer: Vengeance', 'Kicks', 'Kill Bill: Vol. 1', 'Kill Bill: Vol. 2', 'King Kong', 'King Kong', 'King Kong', 'Kingdom of Heaven', 'Kinsey', 'Kiss Kiss Bang Bang', 'Kung Fu Hustle', 'Kung Fu Panda', 'Kung Fu Panda 2', 'Kung Fu Panda 3', "L'auberge espagnole", 'L.A. Confidential', 'L.I.E.', 'La Famille Bélier', 'Lady Vengeance', 'Lage Raho Munna Bhai', 'Lake of Fire', 'Lars and the Real Girl', 'Last Man Standing', 'Latter Days', 'Law Abiding Citizen', 'Lawrence of Arabia', 'Layer Cake', 'Le Havre', 'Leaving Las Vegas', "Lee Daniels' The Butler", 'Legends of the Fall', 'Les Misérables', 'Let Me In', 'Letters from Iwo Jima', 'Life', 'Life as a House', 'Life of Pi', 'Light from the Darkroom', 'Lilo & Stitch', 'Lilya 4-Ever', 'Lilyhammer', 'Limbo', 'Limitless', 'Lincoln', 'Lion of the Desert', 'Little Boy', 'Little Children', 'Little Miss Sunshine', 'Little Nicholas', 'Little White Lies', 'Little Women', 'Live Free or Die Hard', 'Live-In Maid', 'Lock, Stock and Two Smoking Barrels', 'Lolita', 'Lolita', 'Lone Star', 'Lone Survivor', 'Looper', 'Loose Cannons', 'Lord of War', 'Lords of Dogtown', 'Lost in Translation', 'Love & Basketball', 'Love Actually', 'Love Jones', 'Love and Death on Long Island', "Love's Abiding Joy", 'Lovely, Still', 'Lovesick', 'Lucky Number Slevin', 'Lucky Number Slevin', 'Luther', 'M*A*S*H', 'Mad Hot Ballroom', 'Mad Max 2: The Road Warrior', 'Mad Max: Fury Road', 'Madadayo', 'Made in Dagenham', 'Magnolia', 'Major League', 'Malcolm X', 'Mallrats', 'Man of Steel', 'Man on Fire', 'Man on Wire', 'Man on the Moon', 'Mandela: Long Walk to Freedom', 'Manderlay', "Mao's Last Dancer", 'March of the Penguins', 'Margin Call', 'Maria Full of Grace', "Marilyn Hotchkiss' Ballroom Dancing and Charm School", 'Marley & Me', 'Mary Poppins', 'Master and Commander: The Far Side of the World', 'Match Point', 'Maurice', 'McFarland, USA', "McHale's Navy", 'Me Before You', 'Me You and Five Bucks', 'Me and You and Everyone We Know', 'Mean Creek', 'Mean Streets', 'Meet Joe Black', 'Megamind', 'Melancholia', 'Memento', 'Memoirs of a Geisha', 'Men in Black', 'Men of Honor', 'Menace II Society', 'Metallica Through the Never', 'Metropolis', 'Metropolitan', 'Mi America', 'Miami Vice', 'Michael Clayton', 'Michael Collins', 'Michael Jordan to the Max', 'Micmacs', 'Midnight Cowboy', 'Midnight Run', 'Midnight in Paris', 'Milk', 'Million Dollar Baby', 'Minority Report', 'Miracle', 'Mission: Impossible', 'Mission: Impossible - Ghost Protocol', 'Mission: Impossible - Rogue Nation', 'Mississippi Mermaid', 'Moby Dick', 'Modern Times', 'Molière', 'Mondays in the Sun', 'Moneyball', 'Mongol: The Rise of Genghis Khan', 'Monsoon Wedding', 'Monster', "Monster's Ball", 'Monsters University', 'Monsters, Inc.', 'Monty Python and the Holy Grail', 'Moon', 'Moonrise Kingdom', 'Mother and Child', 'Moulin Rouge!', 'Mr. Church', "Mr. Holland's Opus", 'Mr. Smith Goes to Washington', 'Mrs Henderson Presents', 'Much Ado About Nothing', 'Mud', 'Mulan', 'Mulholland Drive', 'Munich', 'Murderball', 'My Cousin Vinny', 'My Fair Lady', 'My Life Without Me', 'My Name Is Khan', 'My Own Private Idaho', "My Sister's Keeper", 'Mystic River', 'Namastey London', 'Narc', "National Lampoon's Vacation", 'Nebraska', 'Nerve', 'Network', 'Never Let Me Go', 'Niagara', 'Nicholas Nickleby', 'Night of the Living Dead', 'Night of the Living Dead', 'Nightcrawler', 'Nikita', 'Nine Queens', 'Nixon', 'No Country for Old Men', 'No End in Sight', 'North Country', 'Notes on a Scandal', 'Nothing But a Man', 'Now Is Good', 'Now You See Me', 'Nowhere Boy', 'Nowhere in Africa', 'O Brother, Where Art Thou?', "Ocean's Eleven", 'Oceans', 'Of Gods and Men', 'Office Space', 'Old School', 'Oldboy', 'Oliver!', 'On the Waterfront', 'Once', 'Once Upon a Time in America', 'Once Upon a Time in the West', 'Once in a Lifetime: The Extraordinary Story of the New York Cosmos', "One Flew Over the Cuckoo's Nest", 'Open Range', 'Open Secret', 'Ordet', 'Ordinary People', 'Osama', 'Out of Africa', 'Out of the Blue', 'Out of the Blue', 'Outlander', 'Owning Mahowny', 'P.S. I Love You', 'Paa', 'Paddington', 'Pale Rider', "Pan's Labyrinth", "Pandora's Box", "Paris, je t'aime", 'Pat Garrett & Billy the Kid', 'Patton', 'Pay It Forward', 'Payback', 'Peace, Propaganda & the Promised Land', 'Peaceful Warrior', 'Perception', 'Perfume: The Story of a Murderer', 'Persepolis', "Pete's Dragon", 'Philadelphia', 'Philomena', 'Phone Booth', 'Pi', 'Pieces of April', 'Pierrot le Fou', 'Pink Ribbons, Inc.', 'Pinocchio', 'Pirate Radio', "Pirates of the Caribbean: At World's End", "Pirates of the Caribbean: Dead Man's Chest", 'Pirates of the Caribbean: The Curse of the Black Pearl', 'Pitch Black', 'Pitch Perfect', 'Platoon', 'Pocketful of Miracles', 'Point Blank', 'Polisse', 'Poltergeist', 'Poltergeist', 'Ponyo', 'Preacher', 'Precious', 'Precious', 'Predator', 'Pride & Prejudice', 'Princess Mononoke', 'Prisoners', 'Psych', 'Psycho', 'Pulp Fiction', 'Punch-Drunk Love', 'Queen of the Mountains', 'Quest for Fire', 'Quills', 'Quinceañera', 'Quo Vadis', 'RED', 'Rabbit-Proof Fence', 'Race', 'Radio Days', 'Raging Bull', 'Raiders of the Lost Ark', 'Rain Man', 'Raising Victor Vargas', 'Rang De Basanti', 'Rango', 'Ratatouille', 'Ravenous', 'Ray', 'Real Steel', 'Rebecca', 'Red Cliff', 'Red Dog', 'Red Dragon', 'Red Riding: In the Year of Our Lord 1974', 'Red River', 'Reds', 'Reign Over Me', 'Religulous', 'Remember Me', 'Remember the Titans', 'Requiem for a Dream', 'Rescue Dawn', 'Reservoir Dogs', 'Restless', 'Revolutionary Road', 'Richard III', 'Riding Giants', 'Rise of the Entrepreneur: The Search for a Better Way', 'Rise of the Guardians', 'Rise of the Planet of the Apes', "River's Edge", 'Rize', 'Road to Perdition', 'Robot & Frank', 'Robot Chicken', 'Rocket Singh: Salesman of the Year', 'RocknRolla', 'Rocky', 'Rocky Balboa', 'Roger & Me', 'Ronin', 'Room', "Rosemary's Baby", 'Rounders', 'Ruby in Paradise', 'Rudderless', 'Rules of Engagement', 'Run Lola Run', 'Running Forever', 'Running Scared', 'Rush', 'Rushmore', 'Saint Ralph', 'Salvador', 'Samsara', 'Sands of Iwo Jima', "Sarah's Key", 'Sausage Party', 'Saving Face', 'Saving Grace', 'Saving Grace', 'Saving Mr. Banks', 'Saving Private Ryan', 'Saw', 'Scarface', "Schindler's List", 'School of Rock', 'Scott Pilgrim vs. the World', 'Scott Walker: 30 Century Man', 'Scream', 'Scream: The TV Series', 'Se7en', 'Seabiscuit', 'Secondhand Lions', 'Secretariat', 'Secretary', 'Secrets and Lies', 'Selma', 'Sense and Sensibility', 'Serenity', 'Seven Pounds', 'Seven Psychopaths', 'Seven Samurai', 'Sex, Lies, and Videotape', 'Sexy Beast', 'Shadowlands', 'Shakespeare in Love', 'Shame', 'Shaolin Soccer', 'Shattered Glass', 'Shaun of the Dead', 'Shaun the Sheep', 'She Wore a Yellow Ribbon', 'Sherlock Holmes', 'Sherlock Holmes: A Game of Shadows', 'Shine', 'Shine a Light', 'Shinjuku Incident', 'Shooter', 'Short Cut to Nirvana: Kumbh Mela', 'Shotgun Stories', 'Shrek', 'Shrek 2', 'Shutter Island', 'Sicario', 'Sicko', 'Side Effects', 'Side Effects', 'Sideways', 'Signed Sealed Delivered', 'Silmido', 'Silver Linings Playbook', 'Silver Medallist', 'Silverado', 'Sin City', "Singin' in the Rain", 'Sisters in Law', 'Skyfall', 'Skyfall', 'Slacker', 'Slam', 'Sleep Tight', 'Sleeper', 'Sleepers', 'Sleepy Hollow', 'Sling Blade', 'Slumdog Millionaire', 'Smiling Fish & Goat on Fire', 'Smoke Signals', 'Snatch', 'Snatch', 'Snow White and the Seven Dwarfs', 'Solaris', 'Some Like It Hot', 'Somewhere in Time', 'Songcatcher', 'Sorcerer', 'Soul Kitchen', 'Soul Surfer', 'Source Code', 'South Park: Bigger Longer & Uncut', 'Southpaw', 'Space: Above and Beyond', 'Spaceballs', 'Spartacus: War of the Damned', 'Speed', 'Spellbound', 'Spider-Man', 'Spider-Man 2', 'Spirited Away', 'Spotlight', 'St. Vincent', 'Stand by Me', 'Standard Operating Procedure', 'Star Trek', 'Star Trek Beyond', 'Star Trek II: The Wrath of Khan', 'Star Trek IV: The Voyage Home', 'Star Trek Into Darkness', 'Star Trek VI: The Undiscovered Country', 'Star Trek: First Contact', 'Star Wars: Episode III - Revenge of the Sith', 'Star Wars: Episode IV - A New Hope', 'Star Wars: Episode V - The Empire Strikes Back', 'Star Wars: Episode VI - Return of the Jedi', 'Star Wars: Episode VII - The Force Awakens', 'Star Wars: The Clone Wars', 'Stardust', 'Stargate SG-1', 'Stargate: The Ark of Truth', 'Starship Troopers', 'Starsuckers', 'State Fair', 'State of Play', 'Steve Jobs', 'Still Alice', 'Stories of Our Lives', 'Straight Outta Compton', 'Stranger Than Fiction', 'Strangers with Candy', 'Submarine', 'Summer Storm', 'Sunshine', 'Super 8', 'Super Size Me', 'Super Troopers', 'Superbad', 'Superman', 'Swingers', 'Synecdoche, New York', 'Tae Guk Gi: The Brotherhood of War', 'Take Shelter', 'Taken', 'Talk Radio', 'Tangled', 'Tango', 'Tarnation', 'Taxi Driver', 'Taxi to the Dark Side', 'Team America: World Police', 'Terminator 2: Judgment Day', 'Thank You for Smoking', 'The 40-Year-Old Virgin', 'The A-Team', 'The Abyss', 'The Act of Killing', 'The Adjustment Bureau', 'The Adventures of Tintin', 'The Age of Adaline', 'The Age of Innocence', 'The Algerian', 'The Andromeda Strain', 'The Apartment', 'The Apostle', 'The Artist', 'The Assassination of Jesse James by the Coward Robert Ford', 'The Avengers', 'The Avengers', 'The Aviator', 'The Baader Meinhof Complex', 'The Bad News Bears', 'The Ballad of Cable Hogue', 'The Ballad of Gregorio Cortez', 'The Bank Job', 'The Barbarian Invasions', 'The Believer', 'The Best Exotic Marigold Hotel', 'The Best Offer', 'The Best Years of Our Lives', 'The Big Lebowski', 'The Big Parade', 'The Big Short', 'The Black Stallion', 'The Blind Side', 'The Blues Brothers', 'The Book Thief', 'The Book of Life', 'The Boondock Saints', 'The Border', 'The Bourne Identity', 'The Bourne Supremacy', 'The Bourne Ultimatum', 'The Boy in the Striped Pajamas', 'The Brain That Sings', 'The Brave Little Toaster', 'The Bridge on the River Kwai', 'The Bridges of Madison County', 'The Bubble', 'The Bucket List', 'The Butterfly Effect', 'The Call of Cthulhu', 'The Case of the Grinning Cat', 'The Celebration', 'The Charge of the Light Brigade', 'The Children of Huang Shi', 'The Chorus', 'The Circle', 'The Class', 'The Color Purple', 'The Color of Freedom', 'The Company', 'The Conformist', 'The Conjuring', 'The Conjuring 2', 'The Constant Gardener', 'The Conversation', 'The Count of Monte Cristo', 'The Croods', 'The Crow', 'The Crying Game', 'The Cure', 'The Curious Case of Benjamin Button', 'The Curse of the Were-Rabbit', 'The Damned United', 'The Dangerous Lives of Altar Boys', 'The Dark Knight', 'The Dark Knight Rises', 'The Dead Zone', 'The Dead Zone', 'The Deer Hunter', 'The Departed', 'The Descendants', 'The Descent', "The Devil's Advocate", "The Devil's Double", 'The Diving Bell and the Butterfly', 'The Doombolt Chase', 'The Doors', 'The Elephant Man', "The Emperor's New Groove", 'The End of the Affair', 'The English Patient', 'The Equalizer', 'The Evil Dead', 'The Exorcist', 'The Express', 'The Family', 'The Fault in Our Stars', 'The Fifth Element', 'The Fighter', 'The Fisher King', 'The Flowers of War', 'The Following', 'The Fountain', 'The Four Seasons', 'The French Connection', 'The French Connection', 'The Front Page', 'The Fugitive', 'The Full Monty', 'The Full Monty', 'The Game', 'The Gatekeepers', 'The Geographer Drank His Globe Away', 'The Ghost Writer', 'The Gift', 'The Gift', 'The Girl with the Dragon Tattoo', 'The Girlfriend Experience', 'The Godfather', 'The Godfather: Part II', 'The Godfather: Part III', 'The Good, the Bad and the Ugly', 'The Good, the Bad, the Weird', 'The Grand', 'The Grand Budapest Hotel', 'The Great Beauty', 'The Great Debaters', 'The Great Escape', 'The Great Gatsby', 'The Great Gatsby', 'The Greatest Game Ever Played', 'The Green Mile', 'The Guard', 'The Hadza: Last of the First', 'The Hammer', 'The Hangover', 'The Harvest/La Cosecha', 'The Hateful Eight', 'The Help', 'The Hobbit: An Unexpected Journey', 'The Hobbit: The Battle of the Five Armies', 'The Hobbit: The Desolation of Smaug', 'The Honeymooners', 'The Horror Network Vol. 1', 'The Horse Boy', 'The Horseman on the Roof', 'The Hours', 'The House of Mirth', 'The Hudsucker Proxy', 'The Hundred-Foot Journey', 'The Hunger Games', 'The Hunger Games: Catching Fire', 'The Hunt', 'The Hunt for Red October', 'The Hurricane', 'The Hurt Locker', 'The Hustler', 'The Ice Storm', 'The Ides of March', 'The Illusionist', 'The Illusionist', 'The Image Revolution', 'The Imitation Game', 'The Impossible', 'The Inbetweeners', 'The Incredibles', 'The Infiltrator', 'The Insider', 'The Intern', 'The Iron Giant', 'The Jacket', 'The Judge', 'The Jungle Book', 'The Jungle Book', 'The Karate Kid', 'The Karate Kid', 'The Kids Are All Right', "The King's Speech", 'The Kingdom', 'The Kite Runner', 'The Knife of Don Juan', 'The Lady from Shanghai', 'The Land Before Time', 'The Last Emperor', 'The Last King of Scotland', 'The Last Samurai', 'The Last Temptation of Christ', 'The Last Waltz', 'The Last of the Mohicans', 'The Legend of Drunken Master', 'The Lego Movie', 'The Life Aquatic with Steve Zissou', 'The Life of David Gale', 'The Limey', 'The Lincoln Lawyer', 'The Lion King', 'The Little Prince', 'The Lives of Others', 'The Long Riders', 'The Longest Day', 'The Longest Ride', 'The Lord of the Rings: The Fellowship of the Ring', 'The Lord of the Rings: The Return of the King', 'The Lord of the Rings: The Two Towers', 'The Lost Boys', 'The Lost Weekend', 'The Love Letter', 'The Love Letter', 'The Lunchbox', 'The Machinist', 'The Man Who Shot Liberty Valance', 'The Man from Earth', 'The Man from Snowy River', 'The Man from U.N.C.L.E.', 'The Martian', 'The Master', 'The Matrix', 'The Matrix Reloaded', 'The Merchant of Venice', 'The Messenger', 'The Mighty', 'The Misfits', 'The Missing', 'The Mist', 'The Mongol King', 'The Mudge Boy', 'The Muppet Christmas Carol', 'The Muppet Movie', 'The Muppets', 'The Names of Love', 'The Namesake', 'The Negotiator', 'The NeverEnding Story', 'The Next Three Days', 'The Notebook', "The Nun's Story", 'The O.C.', 'The Omen', 'The Omen', 'The Orphanage', 'The Other Dream Team', 'The Others', 'The Outrageous Sophie Tucker', 'The Outsiders', 'The Painted Veil', "The Party's Over", 'The Passion of the Christ', 'The Past is a Grotesque Animal', 'The Patriot', 'The Peanuts Movie', 'The Perks of Being a Wallflower', 'The Phantom of the Opera', 'The Pianist', 'The Piano', 'The Pirate', 'The Place Beyond the Pines', 'The Player', 'The Powerpuff Girls', 'The Prestige', 'The Princess Bride', 'The Princess and the Cobbler', 'The Princess and the Frog', 'The Prisoner of Zenda', 'The Proposition', 'The Protector', 'The Pursuit of Happyness', 'The Queen', 'The Quiet American', 'The Raid: Redemption', 'The Railway Man', 'The Rainmaker', 'The Reader', 'The Red Violin', 'The Remains of the Day', 'The Return', 'The Return of the Living Dead', 'The Return of the Living Dead', 'The Return of the Pink Panther', 'The Returned', 'The Revenant', 'The Right Stuff', 'The Road', 'The Rock', 'The Rocket: The Legend of Rocket Richard', 'The Royal Tenenbaums', 'The Salton Sea', 'The Savages', 'The Sea Inside', 'The Second Mother', 'The Secret', 'The Secret Life of Bees', 'The Secret Life of Walter Mitty', 'The Secret in Their Eyes', 'The Secret of Kells', 'The Sessions', 'The Shawshank Redemption', 'The Shining', 'The Silence of the Lambs', 'The Simpsons Movie', 'The Sixth Sense', 'The Social Network', 'The Sound and the Shadow', 'The Sound of Music', 'The Spanish Prisoner', 'The Spectacular Now', 'The Spy Who Loved Me', 'The Square', 'The Squid and the Whale', 'The Station Agent', 'The Sting', 'The Straight Story', 'The Streets of San Francisco', 'The Sweet Hereafter', 'The Talented Mr. Ripley', 'The Terminal', 'The Terminator', 'The Texas Chain Saw Massacre', 'The Texas Chain Saw Massacre', 'The Theory of Everything', 'The Thin Red Line', 'The Thing', "The Time Traveler's Wife", 'The Town', 'The Train', 'The Trials of Darryl Hunt', 'The Triplets of Belleville', 'The Trouble with Harry', 'The Truman Show', 'The Ultimate Gift', 'The Untouchables', 'The Usual Suspects', 'The Valley of Decision', 'The Verdict', 'The Virgin Suicides', 'The Visual Bible: The Gospel of John', 'The Wailing', 'The Walk', 'The Warlords', 'The Water Diviner', 'The Wave', 'The Way Way Back', 'The White Ribbon', 'The Widow of Saint-Pierre', 'The Wild Bunch', 'The Wind That Shakes the Barley', 'The Wizard of Oz', 'The Wolf of Wall Street', 'The Woman Chaser', 'The Words', "The World's Fastest Indian", 'The Wrestler', 'The Young Victoria', 'The Young and Prodigious T.S. Spivet', 'There Will Be Blood', "There's Something About Mary", 'They Live', 'They Will Have to Kill Us First', 'Things We Lost in the Fire', 'Thirteen Conversations About One Thing', 'Thirteen Days', 'This Is England', 'This Is It', 'Thor: The Dark World', 'Three Burials', 'Three Kings', 'Timecrimes', 'Tinker Tailor Soldier Spy', 'Titanic', 'To Be Frank, Sinatra at 100', 'To Kill a Mockingbird', 'To Save a Life', 'Tombstone', 'Tootsie', 'Top Hat', 'Top Spin', 'Topsy-Turvy', 'Tora! Tora! Tora!', 'Total Recall', 'Total Recall', 'Touching the Void', 'Towering Inferno', 'Toy Story', 'Toy Story 2', 'Toy Story 3', 'Trade', 'Trading Places', 'Traffic', 'Training Day', 'Trainspotting', 'Transamerica', 'Transformers', 'Trapped', 'Trash', 'Travelers and Magicians', 'Treasure Planet', 'Trees Lounge', 'Tremors', 'Troy', 'True Grit', 'True Lies', 'True Romance', 'Tsotsi', 'Tucker and Dale vs Evil', 'Tupac: Resurrection', 'Twin Falls Idaho', 'Twisted', 'Two Brothers', 'Two Lovers', 'Two Lovers and a Bear', 'U2 3D', "Ulee's Gold", 'UnDivided', 'Unbreakable', 'Unbroken', 'Unbroken', 'Under the Same Moon', 'Une Femme Mariée', 'Unforgiven', 'Unforgotten', 'United 93', 'Up', 'Up in the Air', 'V for Vendetta', 'Valkyrie', 'Veer-Zaara', 'Vera Drake', 'Veronica Mars', 'Vicky Cristina Barcelona', 'Videodrome', 'Volver', 'WALL·E', 'Wag the Dog', 'Waiting for Guffman', 'Waitress', 'Waking Ned Devine', 'Walk the Line', 'Wall Street', 'Waltz with Bashir', 'War & Peace', 'War Horse', 'WarGames', 'Warcraft', 'Warrior', 'Watchmen', 'Water', 'Waterloo', 'We Are Marshall', 'We Bought a Zoo', 'We Need to Talk About Kevin', 'We Were Soldiers', 'Weekend', 'Welcome to the Dollhouse', 'Welcome to the Sticks', 'Wendy and Lucy', 'West Side Story', 'Whale Rider', "What's Eating Gilbert Grape", "What's Love Got to Do with It", 'Whatever Works', 'When Harry Met Sally...', 'Whiplash', 'White Oleander', 'Who Killed the Electric Car?', 'Wild', 'Willy Wonka & the Chocolate Factory', 'Winged Migration', 'Wings', 'Winnie the Pooh', 'Winter in Wartime', "Winter's Bone", 'Without Limits', 'Witness', 'Wolf Creek', 'Woman in Gold', 'Wonder Boys', 'Woodstock', 'Wordplay', 'Wreck-It Ralph', 'Wristcutters: A Love Story', 'Wuthering Heights', 'X-Men', 'X-Men 2', 'X-Men: Apocalypse', 'X-Men: Days of Future Past', 'X-Men: First Class', 'Y Tu Mamá También', 'You Can Count on Me', "You Can't Take It with You", 'Young Frankenstein', 'Yours, Mine and Ours', 'Zero Dark Thirty', 'Zodiac', 'Zombieland', 'Rec'];

$('.typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'movies',
  source: substringMatcher(movies)
});

