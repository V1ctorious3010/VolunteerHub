/**
 * Custom Mock API Server for VolunteerHub
 * Using Express to create authentication endpoints
 * Run: npm run mock-api:custom
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Helper functions
const readDB = () => {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// ============ AUTH ENDPOINTS ============

/**
 * POST /api/auth/register - Register new user
 */
app.post('/api/auth/register', (req, res) => {
    try {
        const { email, password, name, firstName, lastName, phoneNumber } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                status: 400
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format',
                status: 400
            });
        }

        const db = readDB();

        const existingUser = db.users.find(u => u.email === email);
        if (existingUser) {
            return res.status(409).json({
                message: 'Email already registered',
                status: 409
            });
        }

        let fName = firstName || '';
        let lName = lastName || '';

        if (name && !firstName && !lastName) {
            const parts = name.trim().split(' ');
            fName = parts[0] || '';
            lName = parts.slice(1).join(' ') || '';
        }

        const newUser = {
            id: db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) + 1 : 1,
            email,
            password,
            firstName: fName,
            lastName: lName,
            displayName: name || `${fName} ${lName}`.trim(),
            phoneNumber: phoneNumber || '',
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(fName)}`,
            role: 'user',
            enabled: true,
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        writeDB(db);

        const token = `mock_token_${newUser.id}_${Date.now()}`;

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                displayName: newUser.displayName,
                phoneNumber: newUser.phoneNumber,
                photoURL: newUser.photoURL,
                role: newUser.role,
                enabled: newUser.enabled
            },
            message: 'Registration successful'
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            message: 'Internal server error',
            status: 500
        });
    }
});

/**
 * POST /api/auth/login - Login user
 */
app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                status: 400
            });
        }

        const db = readDB();
        const user = db.users.find(u => u.email === email);

        if (!user || user.password !== password) {
            return res.status(401).json({
                message: 'Invalid email or password',
                status: 401
            });
        }

        const token = `mock_token_${user.id}_${Date.now()}`;

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                role: user.role,
                enabled: user.enabled
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error',
            status: 500
        });
    }
});

/**
 * POST /api/auth/logout - Logout user
 */
app.post('/api/auth/logout', (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
});

/**
 * GET /api/auth/current - Get current user
 */
app.get('/api/auth/current', (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'No token provided',
                status: 401
            });
        }

        const token = authHeader.split(' ')[1];
        const parts = token.split('_');

        if (parts.length !== 4 || parts[0] !== 'mock' || parts[1] !== 'token') {
            return res.status(401).json({
                message: 'Invalid token',
                status: 401
            });
        }

        const userId = parseInt(parts[2]);
        const db = readDB();
        const user = db.users.find(u => u.id === userId);

        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                status: 401
            });
        }

        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                displayName: user.displayName,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                role: user.role,
                enabled: user.enabled
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            message: 'Internal server error',
            status: 500
        });
    }
});

/**
 * POST /jwt - Legacy endpoint
 */
app.post('/jwt', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    const token = `mock_jwt_${email}_${Date.now()}`;
    res.json({ token });
});

// ============ DATA ENDPOINTS ============

app.get('/users', (req, res) => {
    const db = readDB();
    res.json(db.users);
});

app.get('/volunteers', (req, res) => {
    const db = readDB();
    res.json(db.volunteers || []);
});

app.get('/applications', (req, res) => {
    const db = readDB();
    res.json(db.applications || []);
});

app.get('/categories', (req, res) => {
    const db = readDB();
    res.json(db.categories || []);
});

// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`\n🚀 Mock API Server is running!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`\n🔗 Auth Endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   POST http://localhost:${PORT}/api/auth/logout`);
    console.log(`   GET  http://localhost:${PORT}/api/auth/current`);
    console.log(`\n🔗 Data Endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/users`);
    console.log(`   GET  http://localhost:${PORT}/volunteers`);
    console.log(`\n💾 Database: ${DB_PATH}`);
    console.log(`\n Press Ctrl+C to stop\n`);
});
