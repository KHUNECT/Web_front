from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import klas
import json

class S(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_POST(self):
        self._set_headers()
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode("utf-8")
        qs = parse_qs(post_data)
        KLASObj = klas.KLAS(qs['id'][0], qs['password'][0])
        self.wfile.write(json.dumps(KLASObj.get_lecture_list()).encode())


if __name__ == "__main__":
    server_address = ('', 5000)
    httpd = HTTPServer(server_address, S)
    httpd.serve_forever()