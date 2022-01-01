# React Flask App - Twitter User & Keyword Display

The Flask app creates an API accessible at localhost:5000, and is proxied in to the React frontend in package.json.

Create a Python environment and install flask and other libraries
```
$ virtualenv venv
$ . venv/bin/activate
$ pip install flask requests flask_restful requests_oauthlib
```

Run the Flask API from challenge/
```
$ FLASK_APP=app.py flask run
 * Serving Flask app "app.py"
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

Run the React Frontend from challenge/assets
```
npm install
npm start
```