const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path')

const app = express();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'script-src': ['\'self\'', 'localhost', '127.0.0.1', 'cdn.jsdelivr.net'],
      'default-src': ['\'self\'', 'localhost', '127.0.0.1', 'racetime.gg']
    }
  }
}));

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/ootr', async (req, res, next) => {
  const axios = require('axios');

  try {
    const response = await axios({
      method: 'get',
        url: 'https://racetime.gg/ootr/data'
    })

    res.send(response.data.current_races);
  } catch(error) {
    console.log('ERROR!')
    console.log(error);
  }
});

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 505);
});

app.listen(8080);
console.log('Listening on port 8080...');
