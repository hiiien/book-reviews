

export const ensureAuthenticated = (req, res, next) => {
  console.log('Authenticated:', req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next(); // Proceed if user is authenticated
    }
    res.redirect('/auth/login'); // Redirect if not authenticated
  };