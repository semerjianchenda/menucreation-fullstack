module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('menuitems').find().toArray((err, menuitems) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            menuitems: menuitems
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

// message board routes ===============================================================

app.post('/menuitems', (req, res) => {
  db.collection('menuitems').insertOne(
    {
      food: req.body.food,
      description: req.body.description,
      price: req.body.price,
    },
    (err, result) => {
      if (err) return res.status(500).send(err);
      console.log('Saved to database');
      res.redirect('/profile');
    }
  );
});

// PUT: Edit a Menu Item
app.put('/menuitems', (req, res) => {
  db.collection('menuitems').findOneAndUpdate(
    { food: req.body.oldFood }, // Find item by old food name
    {
      $set: {
        food: req.body.newFood,
        description: req.body.description,
        price: req.body.price,
      },
    },
    { sort: { _id: -1 }, upsert: false },
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    }
  );
});

app.delete('/menuitems', (req, res) => {
  db.collection('menuitems').findOneAndDelete(
    { food: req.body.food },
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send('Menu item deleted!');
    }
  );
});
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
