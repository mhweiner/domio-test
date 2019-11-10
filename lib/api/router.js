import express from 'express';

import {run} from '../priceEventCheck';

let router = express.Router();

//inventory

router.get('/priceCheck', run);

export default router;