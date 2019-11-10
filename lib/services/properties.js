import fetch from 'node-fetch';

function getProperties() {

  return fetch('https://interview.domio.io/properties/')
    .then(response => response.json())
    .then(data => {
      return Promise.resolve(data.properties);
    });

}

export default {
  getProperties: getProperties
};