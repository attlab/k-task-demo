# Flask K-task Demo
[![Issues:](https://img.shields.io/github/issues/attlab/k-task-demo)](https://github.com/attlab/k-task-demo/issues)
[![Forks:](https://img.shields.io/github/forks/attlab/k-task-demo )](https://github.com/attlab/k-task-demo/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

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
   - Directory containing static resources to be used by HTML templates. The javascript files that run the experiment are found in this folder. Read `ktask_source.js` for annotated code, `ktask_bundle.js` is a file generated for the browser and is not intended to be read.

- **flask_cache_buster/**  
   - Module that gives flask cache-busting capabilities. Cache busting is a method that ensures a browser always uses the most up-to-date versions of available javascript resources. 

## Deploying to Heroku

- Create a free Heroku [account](https://signup.heroku.com/)
- Install the Heroku [CLI](https://devcenter.heroku.com/articles/heroku-cli)
- Create a new app from the Heroku [dashboard](https://dashboard.heroku.com/apps)
- Add Heroku as a remote [repository](https://devcenter.heroku.com/articles/git)
	- To do this via the CLI, type `heroku git:remote -a <your app name>`
- Deploy your app to Heroku.
	- To do this via CLI, type `git push heroku master`

## Configuring a database (exmaple with Heroku PostgreSQL)
*Note - if you already have a database you want to connect to your app, skip to the last two steps.*
- Go to your Heroku app's page and click 'Resources' at the top of the page.
- In 'Configure Add-ons' select 'Heroku Postgres' and add it under a free ['hobby dev'](https://devcenter.heroku.com/articles/heroku-postgres-plans#hobby-tier) plan
   - To do this via CLI, type `heroku addons:create heroku-postgresql:hobby-dev`
- To check that the database is setup, type `heroku pg:psql` in the command line and a SQL interface should load in the command line. 
- To [create a table](https://www.w3schools.com/sql/sql_create_table.asp) in the Heroku SQL interface, type `CREATE TABLE <your table name> (<your table column 1> <your column 1 value type>, <your table column 2> <your table column 2 value>, ...)`. Click the link for example specifying value type syntax. 
- To connect the database to you app, you'll to create a `.env` file. To do this on mac/linux, type `touch .env` in your root app directory.
- Go to your Heroku app page and click on the postgres [database link](https://data.heroku.com/datastores/c04cf3fa-add5-4025-9632-0ddb8fc9050a). Once on the page for the database, click 'Settings' then 'View Credentials' to see your database credentials. 
- Copy the URI and paste it in your `.env` file as `DATABASE_URL="<your data base URI>"` 
- To check that the database is configured, type `export DATABASE_URL="<your data base URI>` then type `python -c 'from connect import HandleData; data=HandleData(); data.getData()'`. This should return your data as rows printed to the terminal.



