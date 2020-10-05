# Flask K-task Demo
[![Issues:](https://img.shields.io/github/issues/attlab/k-task-demo)](https://github.com/attlab/k-task-demo/issues)
https://img.shields.io/github/forks/attlab/k-task-demo 
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This demonstration uses [Flask](https://pypi.org/project/Flask/) and [Heroku](https://www.heroku.com/home) to build and deploy a k-task experiment. 

## Requirements

- [Node](https://nodejs.org/en/download/)
- [Python](https://www.python.org/downloads/)

## Installation

- Clone this repository.  
	`git clone https://github.com/attlab/k-task-demo`
- Install requirements.  
	`npm install package-lock.json`  
	`pip install -r requirements.txt`

## Files included

- **app.py**   
   - Builds the flask application. On a local machine, this can be done by typing `FLASK_APP=app.py flask run` or `flask run` in the command line. 

- **connect.py**
   - Connects to a database URL specified as an environment variable. Can be used to read or add data. More methods can be added easily via the `psycopg2` package, which allows python to connect to PostgreSQL.

- **Procfile**  
   - Configures the application to be launched as a web application on heroku. 

- **templates/**  
   - Directory containing HTML pages to be rendered for the application. 

- **templates/bootstrap/**  
   - Module for nice looking CSS I [found](https://getbootstrap.com/).

- **static/**  
   - Directory containing static resources to be used by HTML templates. The javascript files that run the experiment are found in this folder.

- **flask_cache_buster/**  
   - Module that gives flask cache-busting capabilities. Cache busting is a method that ensures a browser always uses the most up-to-date versions of available javascript resources. 




