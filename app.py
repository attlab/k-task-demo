from flask import Flask, flash, render_template, request, jsonify, Response, redirect, url_for
from flask_cache_buster import CacheBuster
import sys
import os

# configure cachebuster 
config = {
     'extensions': ['.js', '.css', '.csv'],
     'hash_size': 10
}
# configure an extension used to bust caches
cache_buster = CacheBuster(config=config)

app = Flask(__name__, template_folder='./templates', static_folder='./static')
cache_buster.register_cache_buster(app)

from connect import HandleData 

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/exp')
def test():
    return render_template('exp.html')

@app.route('/data',methods=['GET'])
def data():

    participant_id=request.args.get('participant_id')
    block=request.args.get('block')
    trial=request.args.get('trial')
    trial_resp=request.args.get('trial_resp')
    trial_rt=request.args.get('trial_rt')
    trial_acc=request.args.get('trial_acc')
    change=request.args.get('change')

    handle_data = HandleData()
    
    return Response(handle_data.addData(participant_id,block,trial,trial_resp,trial_rt,trial_acc,change))


if __name__ == "__main__":
    app.run()

