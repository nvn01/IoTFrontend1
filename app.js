const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.get('/api/ListMahasiswa/GetData', async (req, res) => {
    try {
        const response = await axios.get('http://52.64.235.179:1211/api/ListMahasiswa/GetData');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching mahasiswa data:', error.message);
        res.status(500).json({ type: 'error', message: error.message });
    }
});

app.get('/api/ListAbsen/GetData', async (req, res) => {
    try {
        const response = await axios.get('http://52.64.235.179:1211/api/ListAbsen/GetData');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching absen data:', error.message);
        res.status(500).json({ type: 'error', message: error.message });
    }
});

app.post('/api/ListMahasiswa/InsertData', async (req, res) => {
    try {
        const response = await axios.post('http://52.64.235.179:1211/api/ListMahasiswa/InsertData', req.body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error inserting mahasiswa data:', error.message);
        res.status(500).json({ type: 'error', message: error.message });
    }
});

app.put('/api/proxy/UpdateData', async (req, res) => {
    try {
        console.log('Update request body:', req.body); // Log request body
        const response = await axios.put('http://52.64.235.179:1211/api/ListMahasiswa/UpdateData', req.body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error updating mahasiswa data:', error.message);
        res.status(500).json({ type: 'error', message: error.message });
    }
});

app.delete('/api/proxy/DeleteData', async (req, res) => {
    try {
        const uuid_card = req.body.uuid_card; // Ambil uuid_card dari request body
        
        if (!uuid_card) {
            return res.status(400).json({ type: 'error', message: 'Invalid request body. Expected a uuid_card.' });
        }

        const response = await axios.delete('http://52.64.235.179:1211/api/ListMahasiswa/DeleteData', {
            headers: {
                'Content-Type': 'application/json'
            },
            data: { uuid_card } // Kirimkan uuid_card sebagai objek
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error deleting mahasiswa data:', error.message);
        res.status(500).json({ type: 'error', message: 'Failed to delete data on the server. Please check server logs for more details.' });
    }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT} http://frontendabsensi-env.eba-ypjm3kja.ap-southeast-2.elasticbeanstalk.com/${PORT}/`));
