from flask import Flask, flash, render_template, request, jsonify, Response, redirect, url_for
from flask_cache_buster import CacheBuster
import sys
import os

# configure cachebuster (ensures that updated javascript resources are used, instead of old cached resources)
config = {
     'extensions': ['.js', '.css', '.csv'],
     'hash_size': 10
}
cache_buster = CacheBuster(config=config)

# start a flask app and tell it where templates and static resources are
# templates are HTML pages that are loaded on the page
# static resources are classes/functions used by the page
app = Flask(__name__, template_folder='./templates', static_folder='./static')
cache_buster.register_cache_buster(app)

# import a class used to send data to the database
from connect import HandleData 

# the '/' argument specifies the home page
@app.route('/')     
def home():
    # tell flask to render the 'home' html template at the home directory
    return render_template('home.html')     

@app.route('/exp')
def test():
    return render_template('exp.html')

# the 'GET' argument for the methods parameter tells flask that this page will be getting data
@app.route('/data',methods=['GET'])     
def data():

    # recieve data sent by request
    participant_id=request.args.get('participant_id')
    block=request.args.get('block')
    trial=request.args.get('trial')
    trial_resp=request.args.get('trial_resp')
    trial_rt=request.args.get('trial_rt')
    trial_acc=request.args.get('trial_acc')
    change=request.args.get('change')

    handle_data = HandleData()
    
    # add the data to the database
    return Response(handle_data.addData(participant_id,block,trial,trial_resp,trial_rt,trial_acc,change))


# run the app
# use 'flask run' or 'FLASK_APP=app.py flask run' from the command line
if __name__ == "__main__":
    app.run()

