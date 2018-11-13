from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
import klas
import json

class S(BaseHTTPRequestHandler):
    def _set_headers(self, status_code):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode("utf-8")
        qs = parse_qs(post_data)
        KLASObj = klas.KLAS(qs['id'][0], qs['password'][0])

        if KLASObj.get_lecture_list() == False:
            self._set_headers(500)
            self.wfile.write(json.dumps({'message':'KLAS Error'}).encode())
        else:
            self._set_headers(200)
            self.wfile.write(json.dumps(KLASObj.return_list()).encode())


if __name__ == "__main__":
    server_address = ('', 5000)
    httpd = HTTPServer(server_address, S)
    print("Crawling Server Start")
    httpd.serve_forever()