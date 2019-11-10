import IngredientsService from "../services/ingredients";

export function getIngredients(req, res) {

  res.json({ingredients: IngredientsService.getIngredients()});

}

export function getIngredientById(req, res) {

  res.json({ingredient: IngredientsService.getIngredientById(parseInt(req.params.id))});

}