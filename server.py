#!/usr/bin/env python3
"""
Simple HTTP Server for Fire Risk Lookup Web App Development
Provides local development server with CORS support and proper MIME types.
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse
import json

# Configuration
PORT = 8000
HOST = 'localhost'

# MIME types for proper file serving
MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf'
}

class FireRiskHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with CORS support and proper MIME types."""
    
    def end_headers(self):
        """Add CORS headers to all responses."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests."""
        self.send_response(200)
        self.end_headers()
    
    def guess_type(self, path):
        """Override MIME type guessing to handle modern web files."""
        base, ext = os.path.splitext(path)
        if ext in MIME_TYPES:
            return MIME_TYPES[ext]
        return super().guess_type(path)
    
    def log_message(self, format, *args):
        """Custom logging with timestamp and request details."""
        import datetime
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")
    
    def do_GET(self):
        """Handle GET requests with proper error handling."""
        try:
            # Parse the URL
            parsed_url = urlparse(self.path)
            path = parsed_url.path
            
            # Default to index.html for root requests
            if path == '/':
                path = '/index.html'
            
            # Check if file exists
            file_path = os.path.join(os.getcwd(), path.lstrip('/'))
            
            if not os.path.exists(file_path) or not os.path.isfile(file_path):
                self.send_error(404, f"File not found: {path}")
                return
            
            # Serve the file
            super().do_GET()
            
        except Exception as e:
            print(f"Error serving request: {e}")
            self.send_error(500, f"Internal server error: {str(e)}")

def create_server():
    """Create and configure the HTTP server."""
    try:
        with socketserver.TCPServer((HOST, PORT), FireRiskHTTPRequestHandler) as httpd:
            print(f"🚀 Fire Risk Lookup Development Server")
            print(f"📍 Server running at: http://{HOST}:{PORT}")
            print(f"📁 Serving files from: {os.getcwd()}")
            print(f"🌐 CORS enabled for all origins")
            print(f"⏹️  Press Ctrl+C to stop the server")
            print("-" * 50)
            
            # List available files
            print("📋 Available files:")
            for root, dirs, files in os.walk('.'):
                level = root.replace('.', '').count(os.sep)
                indent = ' ' * 2 * level
                print(f"{indent}{os.path.basename(root)}/")
                subindent = ' ' * 2 * (level + 1)
                for file in files:
                    if not file.startswith('.'):
                        print(f"{subindent}{file}")
            print("-" * 50)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use. Try a different port or stop the existing server.")
            print(f"💡 You can change the port by editing the PORT variable in server.py")
        else:
            print(f"❌ Server error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

if __name__ == '__main__':
    # Check if port is specified as command line argument
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print(f"❌ Invalid port number: {sys.argv[1]}")
            sys.exit(1)
    
    create_server() 