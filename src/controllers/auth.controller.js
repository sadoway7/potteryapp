const authService = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { email, password, 'confirm-password': confirmPassword } = req.body;
    
    // Validate required fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).render('register', {
        error: 'All fields are required.',
        email
      });
    }
    
    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).render('register', {
        error: 'Passwords do not match.',
        email
      });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).render('register', {
        error: 'Password must be at least 8 characters.',
        email
      });
    }
    
    const user = await authService.register(email, password);
    res.redirect('/login?registered=true');
  } catch (error) {
    if (error.message.includes('duplicate key value')) {
      return res.status(409).render('register', {
        error: 'Email already registered.',
        email
      });
    }
    res.status(500).render('register', {
      error: 'Error registering user: ' + error.message,
      email
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).render('login', {
        error: 'Email and password are required.',
        email
      });
    }
    
    const { token, userId } = await authService.login(email, password);
    
    // Set JWT as HTTP-only cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000 // 1 hour
    });
    
    res.redirect('/dashboard');
  } catch (error) {
    res.status(401).render('login', {
      error: 'Invalid credentials',
      email
    });
  }
};

module.exports = {
  register,
  login,
};
