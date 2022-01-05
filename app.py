import functools
import json
import requests
from flask import Flask, g, jsonify
from flask_restful import Api, Resource, reqparse
import os
from requests_oauthlib import OAuth1Session
from random import randint


app = Flask(__name__, static_url_path="/assets/public/index.html",
            static_folder="assets")
api = Api(app)
app.config.from_object("settings")


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


class SearchUser(Resource):
    def get(self, user, count):
        if not user or not count:
            print("ERROR")
            return jsonify({})
        _get_token()
        token = g.access_token or app.config["BEARER_TOKEN"]
        print(user+"--"+str(count) + "----" + token)
        headers = {'Authorization': f"Bearer {token}",
                   'Accept': 'application/json', 'Content-Type': 'application/json'}
        params = {"user.fields": "profile_image_url,verified"}
        searchUser = requests.get(f"https://api.twitter.com/2/users/by/username/{user}",
                                  headers=headers, params=params).json()

        id = searchUser["data"]["id"]
        # do something with id, store in redis or something for a session
        # two step process, because v2 doesn't let you get the tweets from the username
        tweet_params = {"tweet.fields": "created_at"}
        last_count_tweets = requests.get(
            f"https://api.twitter.com/2/users/{id}/tweets?max_results={count}", headers=headers, params=tweet_params).json()
        last_count_tweets["profile"] = searchUser
        return jsonify(last_count_tweets)


api.add_resource(SearchUser, '/api/searchuser/<string:user>/<int:count>')