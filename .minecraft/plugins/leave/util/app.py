import http.server
import socketserver
import time
import threading
import os


PORT = 22313

Handler = http.server.SimpleHTTPRequestHandler

class ReqHTTP(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        _path = self.path
        self.path = (self.path+"p")[:self.path.find("?")]
        print(self.path)
        if not os.path.exists("." + self.path) or (
            not self.path.startswith("/tickets/") and
            not _path.endswith("?per=kanokiw")
            ):
            print(os.path.exists("." + self.path))
            self.path = "/index.html"

        super().do_GET()


def start(port, handler):
    server_address = ('', port)  # Change port as needed
    httpd = http.server.HTTPServer(server_address, ReqHTTP)
    print(f"HTTPserver has started on port: {port}")
    httpd.serve_forever()

start(PORT, None)
