import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RESTAURANTS_FILE = path.join(__dirname, 'restaurants.json');

app.use(cors());
app.use(bodyParser.json());

async function readRestaurants() {
    try {
        const data = await fs.readFile(RESTAURANTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeRestaurants(restaurants) {
    try {
        await fs.writeFile(RESTAURANTS_FILE, JSON.stringify(restaurants, null, 2));
    } catch (error) {
        console.error('Error writing to file:', error);
        throw error;
    }
}

app.get('/api/restaurants', async (req, res) => {
    try {
        const restaurants = await readRestaurants();
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Error reading restaurants' });
    }
});

app.get('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurants = await readRestaurants();
        const restaurant = restaurants.find(r => r.id === req.params.id);
        if (!restaurant) {
            return res.status(404).json('Restaurant not found');
        }
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ error: 'Error reading restaurants' });
    }
});

app.post('/api/restaurants', async (req, res) => {
    try {
        console.log('Received request:', req.body);
        const restaurants = await readRestaurants();
        console.log('Current restaurants:', restaurants);
        const restaurant = { ...req.body, id: Date.now().toString() };
        restaurants.push(restaurant);
        console.log('Updated restaurants:', restaurants);
        await writeRestaurants(restaurants);
        res.status(201).json(restaurant);
    } catch (error) {
        console.error('Error in POST:', error);
        res.status(500).json({ error: 'Error creating restaurant' });
    }
});

app.put('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurants = await readRestaurants();
        const index = restaurants.findIndex(r => r.id === req.params.id);
        if (index === -1) {
            return res.status(404).json('Restaurant not found');
        }
        restaurants[index] = { ...req.body, id: req.params.id };
        await writeRestaurants(restaurants);
        res.json(restaurants[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error updating restaurant' });
    }
});

app.delete('/api/restaurants/:id', async (req, res) => {
    try {
        const restaurants = await readRestaurants();
        const index = restaurants.findIndex(r => r.id === req.params.id);
        if (index === -1) {
            return res.status(404).json('Restaurant not found');
        }
        restaurants.splice(index, 1);
        await writeRestaurants(restaurants);
        res.json('Restaurant deleted');
    } catch (error) {
        res.status(500).json({ error: 'Error deleting restaurant' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
