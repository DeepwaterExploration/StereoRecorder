from flask import Flask, send_from_directory, redirect, url_for, request
import os
import shutil
import json

app = Flask(__name__)

VIDEOS_DIR = os.path.expanduser('~/Videos')
CONFIG_FILE = '/home/ubuntu/camera_config.json'

def load_config():
    with open(CONFIG_FILE, 'r') as f:
        return json.load(f)

def save_config(config):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=4)

@app.route('/')
def index():
    config = load_config()
    files = os.listdir(VIDEOS_DIR)
    files_list = ''.join([f'<li><a href="/download/{file}">{file}</a></li>' for file in files])
    camera_form = ''.join([
        f'''
        <form id="camera_form_{cam}" class="camera-form" oninput="autoUpdate('{cam}')">
            <h3>Camera {cam}</h3>
            <label for="enabled_{cam}">Enabled:</label>
            <input type="checkbox" name="enabled_{cam}" {"checked" if properties["enabled"] else ""}><br>
            <label for="frameWidth_{cam}">Frame Width:</label>
            <input type="text" name="frameWidth_{cam}" value="{properties["frameWidth"]}"><br>
            <label for="framerate_{cam}">Framerate:</label>
            <input type="text" name="framerate_{cam}" value="{properties["framerate"]}"><br>
            <label for="dev_{cam}">Device:</label>
            <input type="text" name="dev_{cam}" value="{properties["dev"]}"><br>
        </form>
        ''' for cam, properties in config.items()
    ])
    return f'''
        <style>
            .camera-form {{
                display: inline-block;
                margin-right: 20px;
                vertical-align: top;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 5px;
            }}
        </style>
        <h1>Camera Configuration</h1>
        {camera_form}
        <h1>Files in ~/Videos</h1>
        <ul>{files_list}</ul>
        <form action="/delete_all" method="post">
            <button type="submit">Delete All Videos</button>
        </form>
        <button onclick="downloadAll()">Download All Videos</button>
        <script>
            function autoUpdate(cam) {{
                var form = document.getElementById('camera_form_' + cam);
                var formData = new FormData(form);
                formData.append('camera', cam);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/update_config', true);
                xhr.send(formData);
            }}

            function downloadAll() {{
                var files = {json.dumps(files)};
                files.forEach(file => {{
                    var link = document.createElement('a');
                    link.href = '/download/' + file;
                    link.download = file;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }});
            }}
        </script>
    '''

@app.route('/download/<filename>')
def download_file(filename):
    return send_from_directory(VIDEOS_DIR, filename)

@app.route('/delete_all', methods=['POST'])
def delete_all():
    for filename in os.listdir(VIDEOS_DIR):
        file_path = os.path.join(VIDEOS_DIR, filename)
        if os.path.isfile(file_path) or os.path.islink(file_path):
            os.unlink(file_path)
        elif os.path.isdir(file_path):
            shutil.rmtree(file_path)
    return redirect(url_for('index'))

@app.route('/update_config', methods=['POST'])
def update_config():
    config = load_config()
    cam = request.form['camera']
    config[cam]['enabled'] = 'enabled_' + cam in request.form
    config[cam]['frameWidth'] = int(request.form['frameWidth_' + cam])
    config[cam]['framerate'] = int(request.form['framerate_' + cam])
    config[cam]['dev'] = int(request.form['dev_' + cam])
    save_config(config)
    return '', 204

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8089, debug=True)
