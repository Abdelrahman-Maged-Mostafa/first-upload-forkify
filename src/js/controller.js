'use strict';
import * as model from './model.js';
import { MODEL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
///////////////////////////////////////
// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpiiner();
    //0)update results
    resultView.update(model.getSearchResultsPage());
    //Loding recipe
    await model.loadRecipe(id);
    //2) Rendering recipe
    recipeView.render(model.state.recipe);
    // console.log(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    console.error(err.message);
    recipeView.renderMessage();
  }
};
const controlSearchResults = async function () {
  try {
    resultView.renderSpiiner();

    const query = searchView.getQuery();
    if (!query) return;

    //2)Load search results
    await model.loadSearchResults(query);

    //3)Render results
    // console.log(model.state.search.results);
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());
    //4)render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //1)Render results
  resultView.render(model.getSearchResultsPage(goToPage));
  //2)render pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings
  model.updateServings(newServings);
  //update the recipe View
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add and remove bookmarks
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);
  //render icon
  recipeView.update(model.state.recipe);
  //render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddrecipe = async function (newRecipe) {
  try {
    Object.assign();
    //show loading spinner
    addRecipeView.renderSpiiner();
    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    //Render new recipy
    recipeView.render(model.state.recipe);
    //Render succes message
    addRecipeView.renderMessage();
    //Render the book mark view
    bookmarksView.render(model.state.bookmarks);
    //change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();// go to last bage
    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🎃🎃', err);
    addRecipeView.renderMessage(err.message);
  }
};
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerUpdateBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerRender(controlPagination);
  addRecipeView.addHandlerUpload(controlAddrecipe);
};
init();
//Start in vedio(26) in part (18)
