import urllib.parse
import json

from search import searchObject
from http.server import BaseHTTPRequestHandler, HTTPServer


class RequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write("UNKO".encode())

    def do_POST(self):
        content_length = int(self.headers["Content-Length"])
        post_data = self.rfile.read(content_length).decode("utf-8")
        search_query = urllib.parse.parse_qs(post_data)
        print("Query:", search_query)

        candidate_discs = json.dumps(searchObject(search_query))
        self.send_response(200)
        self.send_header("Content-type", "text/plain")
        self.end_headers()
        self.wfile.write(candidate_discs.encode("utf-8"))


def main(server_class=HTTPServer, handler_class=RequestHandler, port=25565):
    server_address = ("", port)
    httpd = server_class(server_address, handler_class)
    print(f"Local Search Server httpd on port {port}...")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
