import PropertiesService from './services/properties';
import PropertyPriceEventDAO from "./db/PropertyPriceEventDAO";
import onPriceChangeEvent from './priceEventHandler';
import log from 'roarr';
import {serializeError} from 'serialize-error';

let checkInterval;
let dao = new PropertyPriceEventDAO();
let dbIsReady = dao.connect();

/**
 * Compares properties against last price event.
 * @param {array} properties
 * @param {PropertyPriceEventDAO} dao
 * @param {function} onPriceChange //called if there is a new price detected
 * @param dao
 */
function compareProperties(properties, dao, onPriceChange) {

  properties.map(property => {

    dao.getLastPriceEvent(property.id)
      .then(lastPriceEvent => {

        let oldBasePrice = lastPriceEvent ? Number.parseFloat(lastPriceEvent.basePrice) : null;
        let newBasePrice = Number.parseFloat(property.basePrice);
        let oldDynamicDisplayPrice = lastPriceEvent ? Number.parseFloat(lastPriceEvent.dynamicDisplayPrice): null;
        let newDynamicDisplayPrice = Number.parseFloat(property.dynamicDisplayPrice);

        if (oldBasePrice !== newBasePrice || oldDynamicDisplayPrice !== newDynamicDisplayPrice) {

          //new event!

          log.info({
            property_id: property.id,
            oldDynamicDisplayPrice: lastPriceEvent ? oldDynamicDisplayPrice : null,
            newDynamicDisplayPrice: newDynamicDisplayPrice
          }, 'NEW_PRICE_EVENT');

          dao.recordEvent(property.id, property.type, newDynamicDisplayPrice, newBasePrice)
            .then(() => {

              //send to event handler to then apply the rules
              onPriceChange(property, lastPriceEvent);

            })
            .catch(e => {

              log.error({
                error: serializeError(e),
              }, `failed to record last PropertyPriceEvent for ${property.id}`);

              return true;

            })
            .catch(console.log.bind(console));

        }

      })
      .catch(e => {

        log.error({
          error: serializeError(e),
        },`failed to get last PropertyPriceEvent for ${property.id}`);

        return true;

      })
      .catch(console.log.bind(console));

  });

}

function check() {

  let getPropertiesPromise = PropertiesService.getProperties();

  Promise.all([dbIsReady, getPropertiesPromise])
    .then(resp => {

      let properties = resp[1];

      compareProperties(properties, dao, onPriceChangeEvent);

    })
    .catch(console.log.bind(console));

}

function checkEvery(numSeconds) {

  check();
  checkInterval = setInterval(check, numSeconds * 1000);

}

function stopChecking() {

  clearInterval(checkInterval);

}

function clean() {

  return dbIsReady
    .then(() => dao.clean())
    .catch(e => {

      log.error({
        error: serializeError(e),
      },`failed to clean`);

      throw e;

    });

}

export default {
  check: check,
  checkEvery: checkEvery,
  stopChecking: stopChecking,
  clean: clean
}