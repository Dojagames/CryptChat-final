const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

// Set this to true if running in production with a domain
const production = false; // Change to true for production mode

// Define the domain URL for production mode
const domain = 'https://tempcloud.jonx.dev'; // Replace with your actual domain

// Middleware to parse JSON bodies
app.use(express.json());

// Create the storage directory if it doesn't exist
const storageDir = path.join(__dirname, 'storage');
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir);
}

// Define path for persisting filesMap data
const filesMapPath = path.join(__dirname, 'filesMap.json');

// Load existing filesMap from disk if it exists
let filesMap = new Map();
if (fs.existsSync(filesMapPath)) {
    try {
        const data = fs.readFileSync(filesMapPath, 'utf8');
        filesMap = new Map(Object.entries(JSON.parse(data)));
    } catch (err) {
        console.error('Error loading filesMap from disk:', err);
    }
}

// Function to save filesMap to disk
function saveFilesMapToDisk() {
    try {
        const filesMapObject = Object.fromEntries(filesMap);
        fs.writeFileSync(filesMapPath, JSON.stringify(filesMapObject));
    } catch (err) {
        console.error('Error saving filesMap to disk:', err);
    }
}

// POST request: Save incoming JSON data to a file and create a unique link
app.post('/upload', (req, res) => {
    try {
        // Extract the JSON data from the request body
        const jsonData = req.body;

        // Validate that the data is provided
        if (!jsonData || Object.keys(jsonData).length === 0) {
            return res.status(400).send('No data provided.');
        }

        // Create a unique filename for the JSON file
        const uniqueId = uuidv4();
        const jsonFilename = `${uniqueId}.json`;
        const jsonFilePath = path.join(storageDir, jsonFilename);

        // Save the JSON file to disk in the storage directory
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData));

        // Store the file path in a map with the unique link
        filesMap.set(uniqueId, jsonFilePath);

        // Save the updated filesMap to disk for persistence
        saveFilesMapToDisk();

        // Create a unique link for accessing the file
        const link = production
            ? `${domain}/download/${uniqueId}`
            : `http://localhost:${PORT}/download/${uniqueId}`;

        // Respond with the link
        res.json({ link });
    } catch (err) {
        console.error('Error during file upload:', err);
        res.status(500).send('Internal server error');
    }
});

// GET request: Retrieve the file by its unique link, send data, delete the JSON file
app.get('/download/:id', (req, res) => {
    const uniqueId = req.params.id;

    // Check if the file exists in the map
    if (!filesMap.has(uniqueId)) {
        return res.status(404).send('Link not found or already used.');
    }

    // Get the file path from the map
    const jsonFilePath = filesMap.get(uniqueId);

    // Read the JSON file from disk
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file.');
        }

        // Send the JSON data to the client
        res.type('application/json').send(data);

        // Delete the JSON file from disk
        fs.unlink(jsonFilePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log(`File ${jsonFilePath} deleted successfully.`);
            }
        });

        // Remove the link from the map to make it invalid
        filesMap.delete(uniqueId);

        // Save the updated filesMap to disk for persistence
        saveFilesMapToDisk();
    });
});

// Start the server and handle startup errors
try {
    app.listen(PORT, () => {
        if (production) {
            console.log(`Server is running in production mode on ${domain}`);
        } else {
            console.log(`Server is running on http://localhost:${PORT}`);
        }
    });
} catch (err) {
    console.error('Error starting server:', err);
}

// Global error handlers for uncaught exceptions and promise rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});
