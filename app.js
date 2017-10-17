const express = require('express');
const path = require('path');

let app = express();

app.set('port', 3000);

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(app.get('port'), () => {
  var port = server.address().port;
  console.log('Magic happens on port ' + port);
})
