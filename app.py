import functools
import json
import requests
from flask import Flask, g, jsonify
from flask_restful import Api, Resource, reqparse
import os
from  requests_oauthlib import OAuth1Session
from random import randint


app = Flask(__name__, static_url_path="/assets/public/index.html", static_folder="assets")
api = Api(app)
app.config.from_object("settings")

headers = {'Authorization': app.config["BEARER_TOKEN"], 'Accept': 'application/json', 'Content-Type': 'application/json'}

def _get_token():
    """
    A sample method for getting a Twitter bearer token.
    Uses application credentials and stores the token as flask.g.access_token

    Returns True on Success, False on Failure

    reference:
      https://developer.twitter.com/en/docs/authentication/oauth-2-0/application-only
    """
    r = requests.post(
        "https://api.twitter.com/oauth2/token",
        data={"grant_type": "client_credentials"},
        auth=(app.config["TWITTER_API_KEY"], app.config["TWITTER_API_SECRET"]),
    )
    if r.status_code >= 400:
        return False

    try:
        g.access_token = r.json()["access_token"]
    except (ValueError, KeyError):
        return False

    return True


def retry_on_expired_token(func):
    """decorator which wraps a function in a retry which ensures that
    g.access_token is (re)populated with a token if it is unset or expired

    expects the wrapped function to return a requests Response object"""

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # if there is no token at the start, get one
        if not hasattr(g, "access_token"):
            if not _get_token():
                raise RuntimeError("failure getting initial token")

        # make the call and retry if the response is a '401 Unauthorized'
        r = func(*args, **kwargs)
        if r.status_code == 401:
            if not _get_token():
                raise RuntimeError("failure getting token on retry")
            r = func(*args, **kwargs)
        return r

    return wrapper


@retry_on_expired_token
def user_show(screen_name=None, user_id=None):
    """
    a sample method for getting user data from Twitter
    https://developer.twitter.com/en/docs/twitter-api/v1/accounts-and-users/follow-search-get-users/api-reference/get-users-show
    """
    return requests.get(
        "https://api.twitter.com/1.1/users/show.json",
        headers={"Authorization": "Bearer " + g.access_token},
        params={"user_id": user_id} if user_id else {"screen_name": screen_name},
    )
    
@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

@app.route('/')
def index():
    return app.send_static_file('index.html')

class SearchTweet(Resource):
    def get(self, tweet):
        _get_token()
        headers = {'Authorization': app.config["BEARER_TOKEN"], 'Accept': 'application/json', 'Content-Type': 'application/json'}
        payload = {'q': tweet, 'result_type': 'recent', 'count': 10}
        searchTweet = requests.get('https://api.twitter.com/2/search/tweets.json', params=payload, headers=headers).json()
        print(payload)
        return jsonify(searchTweet)

api.add_resource(SearchTweet, '/api/searchtweet/<string:tweet>')

class SearchUser(Resource):
    def get(self, user):
        _get_token()
        headers = {'Authorization': app.config["BEARER_TOKEN"], 'Accept' : 'application/json', 'Content-Type':'application/json'}
        payload = {'q':'from:' + user, 'result_type':'recent', 'count': 10}
        searchUser = requests.get('https://api.twitter.com/2/users/', params=payload, headers=headers).json()
        return jsonify(searchUser)

api.add_resource(SearchUser, '/api/searchuser/<string:user>')

class RandomTweet(Resource):
    def get(self, user):
        payload6 = {'q': 'from:' + user, 'result_type': 'recent', 'count': 20}
        results = requests.get('https://api.twitter.com/2/search/tweets.json', params=payload6, headers=headers).json()
        number = randint(1, 20)
        return jsonify(results['statuses'][number])

api.add_resource(RandomTweet, '/api/random-tweet/<string:user>')

