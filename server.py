"""
server.py — local dev server for the portfolio admin panel.
Serves all static files (like python3 -m http.server) and adds a /save
endpoint so admin.html can write content.json directly without downloading.

Usage:
    python3 server.py

Then open: http://localhost:3000/admin.html
"""

from http.server import SimpleHTTPRequestHandler, HTTPServer
import json, os

PORT = 3000


class Handler(SimpleHTTPRequestHandler):

    def do_POST(self):
        # only one POST endpoint: write content.json to disk
        if self.path == '/save':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            try:
                # validate JSON before touching the file
                json.loads(body)
                with open('content.json', 'wb') as f:
                    f.write(body)
                self._respond(200, b'{"ok":true}')
                print('[saved] content.json')
            except Exception as e:
                self._respond(500, json.dumps({'error': str(e)}).encode())
        else:
            self._respond(404, b'not found')

    def _respond(self, status, body):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    # quieter logs — only show errors, not every GET request
    def log_message(self, fmt, *args):
        if args and str(args[1]) not in ('200', '304'):
            super().log_message(fmt, *args)


if __name__ == '__main__':
    # always serve from the directory this script lives in
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    httpd = HTTPServer(('', PORT), Handler)
    print(f'Server running at http://localhost:{PORT}')
    print(f'Admin panel:  http://localhost:{PORT}/admin.html')
    print('Press Ctrl+C to stop.\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
