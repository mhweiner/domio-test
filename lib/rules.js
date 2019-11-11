import {sendEmail} from "./ruleActions";

export const rules = {
  apartment: [
    {
      type: "APARTMENT_DYNAMIC_LT_BASEPRICE",
      trigger: (property, lastEvent) => {

        return !!(property.dynamicDisplayPrice < property.basePrice &&
          lastEvent.dynamicDisplayPrice >= lastEvent.basePrice
        );

      },
      action: (property, lastEvent) => {

        sendEmail('admin@staydomio.com', 'Apartment Price Trigger',
          "Apartment " + property.id + " has just had a price trigger one of the rules: \n\n" +
          "Type: APARTMENT_DYNAMIC_LT_BASEPRICE\n" +
          "Description: dynamicDisplayPrice (" + property.dynamicDisplayPrice + ") is less than basePrice " +
          "(" + property.basePrice + ")."
        );

      }
    }
  ],
  home: [
    {
      type: "HOME_DYNAMIC_MT_BASEPRICE",
      trigger: (property, lastEvent) => {

        return !!(property.dynamicDisplayPrice > property.basePrice &&
          lastEvent.dynamicDisplayPrice <= lastEvent.basePrice
        );

      },
      action: (property, lastEvent) => {

        sendEmail('admin@staydomio.com', 'Apartment Price Trigger',
          "Home " + property.id + " has just had a price trigger one of the rules: \n\n" +
          "Type: HOME_DYNAMIC_MT_BASEPRICE\n" +
          "Description: dynamicDisplayPrice (" + property.dynamicDisplayPrice + ") is more than basePrice " +
          "(" + property.basePrice + ")."
        );

      }
    }
  ]
};
