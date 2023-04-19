const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema for the ticket model
const ticketSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  status: String
});

// Create a model for the ticket schema
const Ticket = mongoose.model('Ticket', ticketSchema);

app.listen(port);
console.log('Server started at port:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes will go here

app.get('/', function(req, res) {
  var outstring = 'Started and listening... ';
  res.send(outstring);
});


// Write to a database 

app.get('/wfile', function(req, res) {
  const myquery = req.query;

  var ticket = new Ticket({
    id: myquery.id,
    title: myquery.title,
    description: myquery.description,
    status: myquery.status
  });

  ticket.save(function(err, ticket) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log("Ticket saved successfully\n");
      console.log("Contents of database now:\n");
      Ticket.find(function(err, tickets) {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(tickets);
          res.send(tickets);
        }
      });
    }
  });
});


// Show the form
app.get('/form', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.sendFile(__dirname + '/post.html');
});


// List all tickets (which are stored in the database)
app.get('/rest/list', function(req, res) {
  Ticket.find(function(err, tickets) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log('Tickets loaded\n');
      res.send(tickets);
    }
  });
});


// Search for a specific ticket (id)
app.get('/rest/ticket/:id', function(req, res) {
  Ticket.findOne({ id: req.params.id }, function(err, ticket) {
    if (err) {
      console.log(err);
      res.send(err);
    } else if (!ticket) {
      console.log("Ticket not found");
      res.send("Ticket not found");
    } else {
      console.log("Ticket found: " + ticket);
      res.send(ticket);
    }
  });
});


// A POST request
app.post('/rest/maketicket', function(req, res) {
  const body = req.body;
  var ticket = new Ticket({
    id: body.id,
    title: body.title,
    description: body.description,
    status: body.status
  });

  ticket.save(function(err, ticket) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log("Ticket saved successfully\n");
      res.send(ticket);
    }
  });
});
