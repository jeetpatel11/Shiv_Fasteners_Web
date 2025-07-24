#!/usr/bin/env python3
import csv
import json
import os
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
import urllib.parse

class ContactFormHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle contact form submissions"""
        if self.path == '/submit-contact':
            try:
                # Get content length
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                # Parse form data
                form_data = parse_qs(post_data.decode('utf-8'))
                
                # Extract form fields
                name = form_data.get('name', [''])[0]
                email = form_data.get('email', [''])[0]
                phone = form_data.get('phone', [''])[0]
                message = form_data.get('message', [''])[0]
                
                # Create timestamp
                timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                
                # Save to CSV file
                csv_file = 'contact_submissions.csv'
                file_exists = os.path.isfile(csv_file)
                
                with open(csv_file, 'a', newline='', encoding='utf-8') as file:
                    writer = csv.writer(file)
                    
                    # Write header if file is new
                    if not file_exists:
                        writer.writerow(['Timestamp', 'Name', 'Email', 'Phone', 'Message'])
                    
                    # Write form data
                    writer.writerow([timestamp, name, email, phone, message])
                
                # Send success response
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = json.dumps({'status': 'success', 'message': 'Form submitted successfully!'})
                self.wfile.write(response.encode('utf-8'))
                
            except Exception as e:
                # Send error response
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = json.dumps({'status': 'error', 'message': str(e)})
                self.wfile.write(response.encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', 8080), ContactFormHandler)
    print("Contact form server running on http://0.0.0.0:8080")
    server.serve_forever()

