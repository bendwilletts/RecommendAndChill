def movieRecommendation(query):
	import csv
	import numpy
	import pickle
	import random

	# 0 - color, 1 - director_name, 2 - num_critic_for_reviews, 3 - duration, 4 - director_facebook_likes, 5 - actor_3_facebook_likes, 6 - actor_2_name, 7 - actor_1_facebook_likes, 8 - gross, 9 - genres, 10 - actor_1_name, 11 - movie_title, 12 - num_voted_users, 13 - cast_total_facebook_likes, 14 - actor_3_name, 15 - facenumber_in_poster, 16 - plot_keywords, 17 - movie_imdb_link, 18 - num_user_for_reviews, 19 - language, 20 - country, 21 - content_rating, 22 - budget, 23 - title_year, 24 - actor_2_facebook_likes, 25 - imdb_score, 26 - aspect_ratio, 27 - movie_facebook_likes

	# genreSet = {'Comedy':0, 'Biography':1, 'Adventure':2, 'War':3, 'Reality-TV':4, 'Crime':5, 'Sport':6, 'Thriller':7, 'Game-Show':8, 'Drama':9, 'Short':10, 'Animation':11, 'Family':12, 'Mystery':13, 'Musical':14, 'History':15, 'Documentary':16, 'News':17, 'Horror':18, 'Action':19, 'Film-Noir':20, 'Romance':21, 'Western':22, 'Fantasy':23, 'Sci-Fi':24, 'Music':25}

	#X = []
	#Y = []

	# with open('data/movie_metadata.csv', 'rt') as csvfile:
	# 	reader = csv.reader(csvfile, delimiter=',')
	# 	next(reader)
	# 	for row in reader:
	# 		movie_title = row[11].replace(u'\xa0', u' ').strip()
	# 		genres = row[9].split("|")
	# 		imdb_score = float(row[25])
	# 		# if(len(genres) == 1):
	# 		# 	print(features)
	# 		features = [imdb_score/20] * 26;
	# 		for a in genres:
	# 			features[genreSet[a]] = 1
	# 		X.append(features)
	# 		Y.append(movie_title)
 
	# pickle.dump(X, open("data/movieDatabaseX.p", "wb"))
	# pickle.dump(Y, open("data/movieDatabaseY.p", "wb"))

	X=pickle.load( open("data/movieDatabaseX.p", "rb" ) )
	Y=pickle.load( open("data/movieDatabaseY.p", "rb" ) )

	# r = random.random()  
	# random.shuffle(X, lambda : r)  # lambda : r is an unary function which returns r
	# random.shuffle(Y, lambda : r) 
	X_train = X
	Y_train = Y
	Y_test = query
	indexSearch = 0
	for index, val in enumerate(Y_train):
		if(val.lower() == Y_test.lower()):
			indexSearch = index
			break
	X_test = [X[indexSearch]]

	# #Create and fit a nearest-neighbor classifier
	# from sklearn.neighbors import KNeighborsClassifier
	# knn = KNeighborsClassifier()
	# knn.fit(X_train, Y_train) 
	# # KNeighborsClassifier(algorithm='auto', leaf_size=30, metric='minkowski',
	# #            metric_params=None, n_jobs=1, n_neighbors=5, p=2,
	# #            weights='uniform')
	# result = knn.predict(X_test)[0];

	print(X_train)
	from sklearn.neighbors import NearestNeighbors
	neigh = NearestNeighbors(n_neighbors=3)
	neigh.fit(X_train) 
	dist, ind = neigh.kneighbors(X_test, n_neighbors=6)
	result = []
	for i in ind[0]:
		if(Y_train[i] != query):
			result.append(Y_train[i])
	print(result)
	return(result)