import PriceCheck from './priceEventCheck';
import argParser from 'command-line-args';

const argDefs = [
  { name: 'poll', alias: 'p', type: Number },
  { name: 'clean', type: Boolean }
];
const args = argParser(argDefs);

if (args.clean) {

  console.log('cleaning...');

  PriceCheck.clean()
    .then(() => {

      console.log('done');

    })
    .catch((e) => {

      console.log('failed:');
      console.log(e);

    });

} else if (args.poll) {

  PriceCheck.checkEvery(Number.parseInt(args.poll));

} else {

  PriceCheck.check();

}