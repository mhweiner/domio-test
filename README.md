# Daily Harvest Coding Test

This is my solution for the coding test assignment for a Software Engineer role at Daily Harvest. The assignment was to write a program that would return a list of matching inventory that contain a given ingredient.

## My approach

My approach was to build a very simple REST API. Since the assignment didn't specify the UI to be used, and considering the time constraints, I left it as a simple API interface that can be used directly from the URL bar. It should be straightforward to build a client GUI (such as React or iOS) that could utilize this API service.

## Areas for improvement

There is plenty of room for improvement in terms of performance and other areas. For example, it does not using any caching and it loads in the provided JSON files into RAM every time the `node` process is started. I would also like to add linting, unit tests, and integration tests. I recommend 100% branch coverage for unit tests, utilizing a BDD approach. [Istanbul](https://istanbul.js.org/) is a great way to see coverage. I also recommend a thorough integration test suite. The [OpenAPI Specification](https://swagger.io/specification/) can be used to document the API in a standardized format. Swagger also provides a great UI for documentation.

## Example usage

After running locally (see "To build and run locally"), you can search for all of the inventory with "Organic Bananna" by typing the following into the URL bar of your browser:

http://localhost:3000/api/inventory/search/ingredient/Organic%20Banana

## To build and run locally

You'll need to have node, npm, and yarn installed. Then do:

```
yarn
npm run dev
```

Then open browser to http://localhost:3000

## API

The base URL for the API is located at `/api/`.

### getProductsByIngredientName

`/inventory/search/ingredient/:name`

Returns a list of fully-hydrated inventory that contain a given ingredient.

Ex: `http://localhost:3000/api/inventory`

### getIngredients

`/ingredients/`

Returns a list of fully-hydrated list of known ingredients.

Ex: `http://localhost:3000/api/ingredients`

### getIngredientById

`/ingredients/:id`

Returns a fully-hydrated ingredient by ID.

Ex: `http://localhost:3000/api/ingredients/26`
