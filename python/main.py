from multiprocessing import Process
import os
import asyncio
import sys
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs
from cgi import parse_header #, parse_multipart
from random import random
from requests_toolbelt.multipart import decoder


experiment_dir = "vcs/style_transfer/PyTorch-Style-Transfer/experiments"
workingdir = '{}/{}'.format(os.environ['HOME'], experiment_dir)
path2script = '{}/main.py'.format(workingdir)

def mix_nn(styleImgFileName, contentImgFileName, outfilename):
  
    # specify the list of arguments to be used as input to main.py
    args = ['eval',
            '--content-image',
            contentImgFileName,
            '--style-image',
            styleImgFileName,
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
            print("httphan.postvars:", postvars)
            styleImage = postvars['styleImage'] # [b'...']
            contentImage = postvars['contentImage'] # [b'...']
            print("styleImage  [0][:50]:", styleImage  [0][:50])
            print("contentImage[0][:50]:", contentImage[0][:50])

            outfilename = '{}/{}.jpg'.format(workingdir, f"out{random()}")
            fnstyle = '{}/{}.jpg'.format(workingdir, f'stl{random()}')
            fncontent = '{}/{}.jpg'.format(workingdir, f'cnt{random()}')
            
            with open(fnstyle, "wb") as f: f.write(styleImage[0])
            with open(fncontent, "wb") as f: f.write(contentImage[0])

            p = Process(target=mix_nn, args=(fnstyle, fncontent, outfilename))
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
        length = int(self.headers['content-length'])
        print("Detected content-length:", length)
        if ctype == 'multipart/form-data':
            print("Detected multipart/form-data")
            content = self.rfile.read(length)
            content_type = self.headers.get('content-type', None)
            multipart_data = decoder.MultipartDecoder(content, content_type, encoding="utf-8")
            postvars = {}
            print("parts BEGIN");
            for part in multipart_data.parts:
                print("part.content[:50]:", part.content[:50])  # Alternatively, part.text if you want unicode
                print("part.headers:", part.headers)
                cdisp = part.headers[b'Content-Disposition'].decode("utf-8")
                print("content-disposition:", cdisp)
                cdisp=[value.strip().split('=') for value in cdisp.split(";")]
                for kv in cdisp:
                    if len(kv) != 2: continue
                    k=kv[0]
                    v=kv[1]
                    if k == "name":
                        if v == '"styleImage"':
                            postvars['styleImage'] = [part.content] # [b'']
                            break
                        if v == '"contentImage"':
                            postvars['contentImage'] = [part.content] # [b'']
                            break
                        break
            print("parts END");
            """
                parts BEGIN
                part.content[:50]: b'\xef\xbf\xbd\xef\xbf\xbd\xef\xbf\xbd\xef\xbf\xbd\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xef\xbf\xbd\xef\xbf\xbd\x00C\x00\x05\x03\x04\x04\x04\x03\x05\x04\x04\x04\x05\x05\x05'
                part.headers: {b'Content-Disposition': b'form-data; name="styleImage"; filename="blob"', b'Content-Type': b'application/octet-stream'}
                part.content[:50]: b'\xef\xbf\xbd\xef\xbf\xbd\xef\xbf\xbd\xef\xbf\xbd\x00\x10JFIF\x00\x01\x02\x00\x00\x01\x00\x01\x00\x00\xef\xbf\xbd\xef\xbf\xbd\x006Photoshop 3.0\x00'
                part.headers: {b'Content-Disposition': b'form-data; name="contentImage"; filename="blob"', b'Content-Type': b'application/octet-stream'}
                parts END
                httphan.postvars: {'styleImage': [], 'contentImage': []}
            """
            #if "boundary" in pdict: pdict["boundary"]=pdict["boundary"].encode("ascii")
            #postvars = parse_multipart(self.rfile, pdict)
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
