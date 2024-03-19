from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/images/<folder>')
def get_images(folder):
    # Directory where your images are stored
    directory = os.path.join('project_data', folder)

    # Get all files in the directory
    files = os.listdir(directory)

    # Remove directories from the list
    files = [f for f in files if os.path.isfile(os.path.join(directory, f))]

    # Send the list of files as JSON response
    return jsonify(files)

if __name__ == '__main__':
    app.run(debug=True)