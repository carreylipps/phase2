
// In this version data are handled as STRINGS and string operations are used.
const express = require('express');
const bodyParser=require('body-parser');
const app = express();
const port = 3000;
var fs = require("fs");
const { clear } = require('console');

app.listen(port);
console.log('Server started at port:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------
// Routes for the app
// ---------------------

app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Started and listening... ';
  res.send(outstring);
});


// Show the form for POSTing input
app.get('/form', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('./post.html', 'utf8', (err, contents) => {
    if(err) {
        console.log('Form file Read Error', err);
        res.write("<p>Form file Read Error");
    } else {
        console.log('Form loaded\n');
        res.write(contents + "<br>");
    }
    res.end();
  });
});


// List all tickets (which are stored in a file)
app.get('/rest/list', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('./tickets.txt', 'utf8', (err, data) => {
    if(err) {
        console.log('File Read Error', err);
        res.write("<p>File Read Error");
    } else {
        console.log('Tickets loaded\n');
        res.write(data.replace('\n','<br>') + "<br>Listing completed");
    }
    res.end();
  });
});

// Search for a specific ticket (id)
// The file assumed to contain records as strings, one record per line.
// Here we use a regular expression match to find the record of interest.
app.get('/rest/ticket/:id', function(req, res) {
  const regexString = new RegExp('id":"' + req.params.id + '.*');
  console.log("Request for ID: " + req.params.id);
  console.log("RegExp: " + regexString + "\n");

  var allrecords = fs.readFile("./tickets.txt", 'utf8', function(err, doc) {
    var result = doc.match(regexString);
    console.log("Result: " + result + "Done\n");
    res.send(result);
  });
});



// A POST request to insert a record by appending it as a string in a new line
app.post('/rest/maketicket', function(req, res) {
  const body = req.body;
  // Report to console what was received (for debugging)
  console.log(req.body);
  var inp_string = JSON.stringify(req.body);
  fs.appendFile("tickets.txt", inp_string +'\n', (err) => {
    if (err)
      console.log(err);
    else {
      console.log("Wrote inp_string to file");
    }
  // Report to the user
  res.send(inp_string + " <p>stored to file");
  });
});
