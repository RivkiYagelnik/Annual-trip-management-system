###  Annual trip management system

The system allows for management of teachers and students, real-time location tracking, and alerts when students move away from the teacher.

## What it does

- Teacher login and access to the dashboard
- Students and teachers are managed through a dashboard
- Each student carries a GPS device that sends location pings every minute
- Locations appear on a live map (no refresh needed)
- The system alerts the teacher if a student is more than 3km away

## Tech stack

**Client:** React, Vite, Google Maps API, Socket.io-client  
**Server:** Node.js, Express, MongoDB, Socket.io  

## Getting started

### Server

cd server
npm install

Create a `.env` file:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret

npm start

### Client

cd client
npm install

Create a `.env` file:

VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

npm run dev

## Notes

- The map requires a valid Google Maps API key
- Teacher location is also tracked and displayed on the map in green