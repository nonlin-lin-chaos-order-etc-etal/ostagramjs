from multiprocessing import Process
import os
import asyncio
import sys
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs
from cgi import parse_header, parse_multipart
from random import random

experiment_dir = "vcs/style_transfer/PyTorch-Style-Transfer/experiments"
workingdir = '{}/{}'.format(os.environ['HOME'], experiment_dir)
path2script = '{}/main.py'.format(workingdir)

def mix_nn(styleImgFileName, contentImgFileName, outfilename):
  
    # specify the list of arguments to be used as input to main.py
    args = ['eval',
            '--content-image',
            '{}/images/content/venice-boat.jpg'.format(workingdir),
            '--style-image',
            '{}/images/21styles/starry_night.jpg'.format(workingdir),
            '--model',
            '{}/models/21styles.model'.format(workingdir),
            '--output-image',
            outfilename,
            '--cuda=0'] # if pytorch is built for ROCm, this will use it despite the `--cuda` option name

    # content_image = Image('{}/images/content/venice-boat.jpg'.format(workingdir))
    # style_image = Image('{}/images/21styles/starry_night.jpg'.format(workingdir))

    # build subprocess command
    cmd = ["../ostagramjs_venv3.9/bin/python", path2script] + args
    cmd = " ".join(cmd)

    print("running the shell command: ", cmd)
    
    async def runcmd():
        proc = await asyncio.create_subprocess_shell(
            cmd,
            stdout=asyncio.subprocess.PIPE)
        while not proc.stdout.at_eof():
            # Read one line of output.
            data = await proc.stdout.readline()
            data = data.decode('utf-8')
            print(data)
        # Wait for the subprocess exit.
        await proc.wait()
        if proc.returncode != 0:
            raise Exception(f"command returned error exit status {proc.returncode}")
    asyncio.run(runcmd())


class HttpHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            postvars = self.parse_POST()
            print(postvars)

            outfilename = '{}/{}.jpg'.format(workingdir, str(random()))
            p = Process(target=mix_nn, args=(None, None, outfilename))
            p.start()
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status_code":"sc_uploaded_processing_started"}')
            # Pool
            """
            with open(filename, "rb") as file:
                binary = file.read()
                self.send_response(200)
                self.send_header('Content-type', 'image/jpg')
                self.end_headers()
                self.wfile.write(binary)
            """
        except KeyboardInterrupt as ex:
            self.send_error(500, message=""+ex, explain="The httpd is shutting down due to a KeyboardInterrupt")
            raise
        except BaseException as ex:
            import traceback as tb
            tb.print_exc()
            self.send_error(500, f"{ex}", explain=None)
        
    def parse_POST(self):
        print("post headers:", self.headers)
        ctype, pdict = parse_header(self.headers['content-type'])
        print("Detected Content-Type:", ctype)
        print("Detected pdict:", pdict)
        if ctype == 'multipart/form-data':
            postvars = parse_multipart(self.rfile, pdict)
        elif ctype == 'application/x-www-form-urlencoded':
            length = int(self.headers['content-length'])
            postvars = parse_qs(
                self.rfile.read(length).decode('utf8'),
                keep_blank_values=1)
        elif ctype == 'application/json':
            postvars = json.loads(self.rfile.read().decode('utf8'))
        else:
            raise Exception(f"Bad content type: '${ctype}'")
        return postvars

def run(server_class=ThreadingHTTPServer, handler_class=HttpHandler):
    server_address = ('', 9999)
    try:
        print('Starting httpd')
        httpd = server_class(server_address, handler_class)
        httpd.serve_forever()
    except BaseException:
        import traceback as tb
        tb.print_exc()
        print('Exception catched; shutting down the httpd')
        server.socket.close()
        print('Done.');

if __name__ == "__main__":
    run()
