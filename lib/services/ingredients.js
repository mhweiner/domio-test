const ingredients = require('../ingredients.json').ingredients;

/**
 * Returns a fully hydrated list of ingredients.
 */
export function getIngredients() {

  return ingredients;

}

/**
 * Returns an ingredient by id.
 * @param {int} id
 * @returns {*}
 */
export function getIngredientById(id) {

  if (!Number.isInteger(id)) throw 'id is not a number';

  let len = ingredients.length;

  for (let i = 0; i < len; i++) {

    if (ingredients[i].id === id) return ingredients[i];

  }

  return null;

}

/**
 * Attempts to find an ingredient by string matching.
 * @param name
 * @returns {*}
 */
export function getIngredientByName(name) {

  if (!name || !name.toUpperCase) throw "name must be a non-empty string";

  let len = ingredients.length;

  for (let i = 0; i < len; i++) {

    if (ingredients[i].name.toUpperCase() === name.toUpperCase()) return ingredients[i];

  }

  return null;

}

export default {
  getIngredients,
  getIngredientByName,
  getIngredientById
}