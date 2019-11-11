import {rules} from './rules';
import log from 'roarr';

export default function priceEventHandler(property, lastEvent) {

  if (!lastEvent) return; //ignore first event

  let applicableRules = rules[property.type];

  if (applicableRules && applicableRules.length) {

    applicableRules.map(rule => {

      if (rule.trigger(property, lastEvent)) {

        rule.action(property, lastEvent);

        log.info({
          ruleType: rule.type,
          propertyId: property.id
        }, 'PRICE_RULE_TRIGGERED');

      }

    });

  }

}