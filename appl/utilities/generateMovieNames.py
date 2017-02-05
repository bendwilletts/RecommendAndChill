def getMovieDatabase():
	import csv
	# import numpy
	# import pickle
	# import random

	## 0 - color, 1 - director_name, 2 - num_critic_for_reviews, 3 - duration, 4 - director_facebook_likes, 5 - actor_3_facebook_likes, 6 - actor_2_name, 7 - actor_1_facebook_likes, 8 - gross, 9 - genres, 10 - actor_1_name, 11 - movie_title, 12 - num_voted_users, 13 - cast_total_facebook_likes, 14 - actor_3_name, 15 - facenumber_in_poster, 16 - plot_keywords, 17 - movie_imdb_link, 18 - num_user_for_reviews, 19 - language, 20 - country, 21 - content_rating, 22 - budget, 23 - title_year, 24 - actor_2_facebook_likes, 25 - imdb_score, 26 - aspect_ratio, 27 - movie_facebook_likes
	## genreSet = {'Comedy':0, 'Biography':1, 'Adventure':2, 'War':3, 'Reality-TV':4, 'Crime':5, 'Sport':6, 'Thriller':7, 'Game-Show':8, 'Drama':9, 'Short':10, 'Animation':11, 'Family':12, 'Mystery':13, 'Musical':14, 'History':15, 'Documentary':16, 'News':17, 'Horror':18, 'Action':19, 'Film-Noir':20, 'Romance':21, 'Western':22, 'Fantasy':23, 'Sci-Fi':24, 'Music':25}

	movieTitleList = []

	with open('../data/movie_metadata.csv', 'rt') as csvfile:
		reader = csv.reader(csvfile, delimiter=',')
		next(reader)
		for row in reader:
			movie_title = row[11].replace(u'\xa0', u' ').strip()
			imdb_score = float(row[25])
			if imdb_score > 7.0:
				movieTitleList.append(movie_title)

	movieTitleList = sorted(movieTitleList)

	print(movieTitleList)

getMovieDatabase()