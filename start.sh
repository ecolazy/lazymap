#!/bin/bash
# Start map
rethinkdb &
sleep 1 &
nodemon server.js &
sleep 1 &
google-chrome-stable --app=http://localhost:3000 &



