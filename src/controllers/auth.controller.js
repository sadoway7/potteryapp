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
    const { email, password, rememberMe } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).render('login', {
        error: 'Email and password are required.',
        email
      });
    }
    
    const user = await authService.login(email, password);
    
    // Determine token expiration based on "Remember me" selection
    const tokenExpiration = rememberMe === 'on' ? '7d' : '24h';
    const maxAge = rememberMe === 'on' ? 7 * 24 * 60 * 60 * 1000 : 86400000; // 7 days or 24 hours
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: tokenExpiration
    });
    
    // Set JWT as HTTP-only cookie named 'token'
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: maxAge,
      sameSite: 'strict'
    });
    
    res.redirect('/dashboard');
  } catch (error) {
    res.status(401).render('login', {
      error: 'Invalid credentials',
      email
    });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};

module.exports = {
  register,
  login,
  logout,
};
