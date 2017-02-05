from flask import Flask, render_template, request
from recommendationEngine import movieRecommendation
from movieDatabase import getMovieDatabase
import json

app = Flask(__name__)
FLASK_DEBUG=1
TEMPLATES_AUTO_RELOAD = True
database = getMovieDatabase()

@app.route("/")
def main():
    return render_template('index.html')

@app.route('/search')
def search():
    # here we want to get the value of user (i.e. ?user=some-value)
    query = request.args.get('query')
    recommendation = movieRecommendation(query)
    results = []
    for i in recommendation:
        results.append(database[i])
    print(results)
    JSONstring = json.dumps(results)
    return(JSONstring)

if __name__ == "__main__":
    app.run(host='0.0.0.0')

#strawberryjam
#strawberryjam



