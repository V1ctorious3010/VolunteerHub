/**
 * Custom JSON Server Configuration
 * 
 * File này tạo một mock API server với các custom routes và middleware
 * để mô phỏng backend API của VolunteerHub
 * 
 * Chạy server: node public/json/server.js
 */

import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors và no-cache)
server.use(middlewares);

// Parse body của request
server.use(jsonServer.bodyParser);

// ============ CUSTOM ROUTES ============

/**
 * POST /api/auth/login
 * Mock login endpoint
 * 
 * Request body: { email, password }
 */
server.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required',
            status: 400
        });
    }

    // Tìm user trong database
    const db = router.db; // Lowdb instance
    const users = db.get('users').value();
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(401).json({
            message: 'Invalid email or password',
            status: 401
        });
    }

    // Mock successful login (không check password trong mock)
    // Trong production, sẽ verify password hash
    const token = `mock_token_${user.id}_${Date.now()}`;

    res.status(200).json({
        token,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName || `${user.firstName} ${user.lastName}`.trim(),
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName)}`,
            role: user.role,
            enabled: user.enabled
        },
        message: 'Login successful'
    });
});

/**
 * POST /api/auth/register
 * Mock register endpoint
 * 
 * Request body: { email, firstName, lastName, phoneNumber, password }
 * hoặc { name, email, password } (từ Register form)
 */
server.post('/api/auth/register', (req, res) => {
    const { email, firstName, lastName, phoneNumber, password, name } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required',
            status: 400
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Invalid email format',
            status: 400
        });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters',
            status: 400
        });
    }

    const db = router.db;
    const users = db.get('users').value();

    // Check if email exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({
            message: 'Email already exists',
            status: 400
        });
    }

    // Parse name nếu có (format: "FirstName LastName")
    let userFirstName = firstName || '';
    let userLastName = lastName || '';

    if (name && !firstName) {
        const nameParts = name.trim().split(' ');
        if (nameParts.length === 1) {
            userFirstName = nameParts[0];
            userLastName = '';
        } else {
            userFirstName = nameParts[0];
            userLastName = nameParts.slice(1).join(' ');
        }
    }

    // Create new user
    const newUser = {
        id: users.length + 1,
        email,
        firstName: userFirstName,
        lastName: userLastName,
        displayName: name || `${userFirstName} ${userLastName}`.trim(),
        phoneNumber: phoneNumber || null,
        role: 'VOLUNTEER',
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Add to database
    db.get('users').push(newUser).write();

    // Generate token
    const token = `mock_token_${newUser.id}_${Date.now()}`;

    res.status(200).json({
        token,
        user: {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            displayName: newUser.displayName,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
            enabled: newUser.enabled
        },
        message: 'User registered successfully'
    });
});

/**
 * POST /jwt
 * Mock JWT endpoint (được gọi sau khi register/login)
 * Frontend gọi endpoint này để lưu cookie
 */
server.post('/jwt', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: 'Email is required',
            status: 400
        });
    }

    const db = router.db;
    const user = db.get('users').find({ email }).value();

    if (!user) {
        return res.status(404).json({
            message: 'User not found',
            status: 404
        });
    }

    // Generate JWT token (mock)
    const token = `jwt_token_${user.id}_${Date.now()}`;

    // Trong production, token sẽ được set vào cookie
    // Ở đây chỉ return token để frontend có thể lưu
    res.status(200).json({
        success: true,
        token,
        message: 'JWT token generated successfully'
    });
});

/**
 * GET /api/auth/current
 * Mock get current user endpoint
 */
server.get('/api/auth/current', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'No token provided',
            status: 401
        });
    }

    // Extract user ID from mock token
    const token = authHeader.substring(7);
    const userId = parseInt(token.split('_')[2]);

    const db = router.db;
    const user = db.get('users').find({ id: userId }).value();

    if (!user) {
        return res.status(401).json({
            message: 'Invalid token',
            status: 401
        });
    }

    res.status(200).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        enabled: user.enabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    });
});

/**
 * POST /api/opportunities/:id/apply
 * Apply for volunteer opportunity
 */
server.post('/api/opportunities/:id/apply', (req, res) => {
    const opportunityId = req.params.id;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authentication required',
            status: 401
        });
    }

    const token = authHeader.substring(7);
    const userId = parseInt(token.split('_')[2]);

    const db = router.db;
    const applications = db.get('applications').value();

    // Check if already applied
    const existing = applications.find(
        app => app.userId === userId && app.opportunityId === opportunityId
    );

    if (existing) {
        return res.status(400).json({
            message: 'You have already applied for this opportunity',
            status: 400
        });
    }

    // Create new application
    const newApplication = {
        id: applications.length + 1,
        userId,
        opportunityId,
        status: 'PENDING',
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    db.get('applications').push(newApplication).write();

    // Update current_volunteers count
    const volunteer = db.get('volunteers').find({ _id: opportunityId }).value();
    if (volunteer) {
        db.get('volunteers')
            .find({ _id: opportunityId })
            .assign({ current_volunteers: volunteer.current_volunteers + 1 })
            .write();
    }

    res.status(200).json({
        message: 'Application submitted successfully',
        application: newApplication
    });
});

/**
 * GET /api/volunteers
 * Get all volunteer opportunities with filters
 */
server.get('/api/volunteers', (req, res) => {
    const { category, status, search } = req.query;

    const db = router.db;
    let volunteers = db.get('volunteers').value();

    // Filter by category
    if (category) {
        volunteers = volunteers.filter(v => v.category === category);
    }

    // Filter by status
    if (status) {
        volunteers = volunteers.filter(v => v.status === status);
    }

    // Search by title or description
    if (search) {
        const searchLower = search.toLowerCase();
        volunteers = volunteers.filter(v =>
            v.post_title.toLowerCase().includes(searchLower) ||
            v.description.toLowerCase().includes(searchLower)
        );
    }

    res.status(200).json(volunteers);
});

// ============ USE DEFAULT ROUTER ============
// Rewrite routes to match API structure
server.use(jsonServer.rewriter({
    '/api/*': '/$1'
}));

// Use default router
server.use(router);

// ============ START SERVER ============
const PORT = 3001;
server.listen(PORT, () => {
    console.log('🚀 Mock API Server is running!');
    console.log(`📍 Server: http://localhost:${PORT}`);
    console.log('\n📋 Available Endpoints:');
    console.log('   POST   /api/auth/login');
    console.log('   POST   /api/auth/register');
    console.log('   GET    /api/auth/current');
    console.log('   GET    /api/volunteers');
    console.log('   POST   /api/opportunities/:id/apply');
    console.log('   GET    /users');
    console.log('   GET    /applications');
    console.log('   GET    /categories');
    console.log('\n💡 Tip: Set VITE_API_URL=http://localhost:3001 in .env file');
});
