const express = require('express');
const app = express();
const session = require('express-session');
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended:true }));
app.use(session({
  secret: 'hahahehe secret eddwdawdw',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // masih development, production pakai true
    sameSite: true // security csrf attack
  } 
}));

app.use(require('./routes'));

app.listen(port, () => {
  console.log(`Listening to http://localhost:${port}`);
})