import PropertyService from "../services/properties";
import PropertyPriceEventsDAO from "../dao/PropertyPriceEventDAO";

export function getInventory(req, res) {

  PropertyService.getProperties()
    .then(properties => {


      //try to connect to database
      let db = new PropertyPriceEventsDAO();

      res.json({inventory: properties});

    })
    .catch(e => {

      res.status(500).send(e.message);
      return Promise.resolve();

    })
    .catch(console.log.bind(console));

}