const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET = 'your_jwt_secret'; // Use a secure env value in real apps

app.use(express.json());

// Dummy user for demonstration
const USER = {
  username: 'testuser',
  password: 'password123'
};

// Login Route to generate a token
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    // Payload with username, user id, and expiration example
    const payload = {
      username,
      userId: 1
    };
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware for verifying the token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid' });
    req.user = user; // attach payload to request
    next();
  });
}

// Protected Route Example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'You have accessed a protected route!',
    user: {
      username: req.user.username,
      userId: req.user.userId,
      exp: req.user.exp
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
