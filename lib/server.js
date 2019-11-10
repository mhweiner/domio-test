import express from 'express';

import api from './api/router';

const app = express();

(async () => {

  //index
  app.get('/', (req, res) => {
    res.send('OK');
  });

  //api
  app.use('/api', api);

  let port = process.env.PORT || 3000;

  //start server
  app.listen(port, () => console.log(`Server running on port ${port}`));

})();