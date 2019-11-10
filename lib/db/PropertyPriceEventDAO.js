import moment from 'moment';

const sqlite3 = require('sqlite3');

function sqlError(sqliteError, sql, attemptedAction) {

  let e = new Error(sqliteError.message);
  e.sql = sql;
  e.attemptedAction = attemptedAction;

  return e;

}

export default class PropertyPriceEventDAO {

  /**
   * @returns {Promise}
   */
  connect() {

    return new Promise((resolve, reject) => {

      this.db = new sqlite3.Database('./property_price_events.sqlite3', (err) => {

        if (err) {

          reject(err);

        } else {

          this.isConnected = true;

          this.createTable()
            .then(() => {

              this.ready = true;
              resolve();

            })
            .catch(reject);

        }

      });

    });

  }

  /**
   * @returns {Promise}
   */
  createTable() {

    if (!this.isConnected) throw "no database connection.";

    const sql = `
      
      CREATE TABLE IF NOT EXISTS property_price_events (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         property_id text NOT NULL,
         type text NOT NULL,
         dynamicDisplayPrice REAL NOT NULL,
         basePrice text REAL NULL,
         date integer NOT NULL
      );
      
      `;

    return new Promise((resolve, reject) => {

      this.db.run(sql, [], function (err) {

        if (err) {

          reject(sqlError(err, sql, 'attempting to create table'));

        } else {

          resolve()

        }

      });

    });

  }

  /**
   * @param property_id
   * @param type
   * @param dynamicDisplayPrice
   * @param basePrice
   * @returns {Promise}
   */
  recordEvent(property_id, type, dynamicDisplayPrice, basePrice) {

    if (!this.ready) throw "not ready";

    let values = {
      $property_id: property_id,
      $type: type,
      $dynamicDisplayPrice: dynamicDisplayPrice,
      $basePrice: basePrice,
      $date: moment().unix()
    };

    const sql = `
      INSERT INTO 'property_price_events' 
      (property_id, type, dynamicDisplayPrice, basePrice, date)
      VALUES
      ($property_id, $type, $dynamicDisplayPrice, $basePrice, $date)
      `;

    return new Promise((resolve, reject) => {

      this.db.run(sql, values, err => {

        if (err) {

          reject(sqlError(err, sql, 'attempting to insert into property_price_events'));

        } else {

          resolve();

        }

      });

    });

  }

  /**
   * @param propertyId
   * @returns {Promise}
   */
  getLastPriceEvent(propertyId) {

    if (!this.ready) throw "not ready";

    const sql = `
      SELECT * FROM 'property_price_events' WHERE property_id = ?
      ORDER BY date DESC
      LIMIT 1
      `;

    return new Promise((resolve, reject) => {

      this.db.get(sql, [propertyId], (err, row) => {

        if (err) {

          reject(sqlError(err, sql, `attempting to get last price event for ${propertyId}`));

        } else {

          resolve(row);

        }

      });

    });

  }

  clean() {

    if (!this.ready) throw "not ready";

    const sql = `DELETE FROM property_price_events`;

    return new Promise((resolve, reject) => {

      this.db.run(sql, [], (err, row) => {

        if (err) {

          reject(sqlError(err, sql, `attempting to clean database`));

        } else {

          resolve(row);

        }

      });

    });

  }

}