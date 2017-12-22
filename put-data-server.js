var express = require('express');
var jsonParser = require('body-parser').json();

function PutDataServer() {
  var router = express.Router();
  var nano = require('nano')('http://localhost:5984');
  // nano.db.destroy('telemetry');
  nano.db.create('telemetry');
  var db = nano.use('telemetry');

  router.post('/', jsonParser, function(req, res) {
    if (!req.body) return res.sendStatus(400);
    db.insert(req.body, (new Date().toJSON()), function(err, body, header) {
      if (err) {
        console.log('db insert error ', err.message);
        return;
      }
      console.log('db insert success ', req.body);
      console.log(body);
      res.end('ok');
    })
  });
  router.use('/list', function(req, res) {
     db.list({include_docs: true}, function(err, body) {
       body.rows.forEach(function(doc) {
         console.log(doc.doc);
         res.write(JSON.stringify(doc.doc));
         res.write('\n');
       });
       res.end();
     });
  });

  return router;
}

module.exports = PutDataServer;
