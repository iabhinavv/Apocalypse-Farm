#!/usr/bin/env python3
"""Optional local server for Apocalypse Farm.

    python3 serve.py     ->  http://localhost:8731/Apocalypse-Farm.html

You do not need it — the game is a single self-contained file, so opening
Apocalypse-Farm.html directly in a browser works. This is here for when you want
an http:// origin, or want to open it on your phone over the same Wi-Fi:

    HOST=0.0.0.0 python3 serve.py
"""
import functools
import http.server
import os
import socketserver

DIR = os.path.dirname(os.path.abspath(__file__))
HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8731"))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


socketserver.TCPServer.allow_reuse_address = True
handler = functools.partial(Handler, directory=DIR)
with socketserver.TCPServer((HOST, PORT), handler) as httpd:
    print(f"Apocalypse Farm on http://{HOST}:{PORT}/Apocalypse-Farm.html", flush=True)
    httpd.serve_forever()
