import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};
const creatRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = creatRecipeObject(data);
    if (state.bookmarks.some(b => b.id === state.recipe.id))
      state.recipe.bookmarked = true;
    // console.log(state.recipe);
  } catch (err) {
    //handling error
    // console.error(`${err} 🎃🎃🎃🎃🎃`);
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};
export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * servings) / state.recipe.servings)
  );
  state.recipe.servings = servings;
};

const persistBookmark = function () {
  localStorage.setItem(`bookmarks`, JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //add recipe
  state.bookmarks.push(recipe);

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmark();
};

export const deleteBookmark = function (id) {
  // Delete Bookmark
  state.bookmarks.splice(
    state.bookmarks.findIndex(bo => bo.id === id),
    1
  );
  //mark current recipe as Not bookmark
  if (state.recipe.id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmark();
};

const init = function () {
  const storge = localStorage.getItem('bookmarks');
  if (storge) state.bookmarks = JSON.parse(storge);
};
init();

const clearBookmarks = function () {
  localStorage.clear(`bookmarks`);
};
// clearBookmarks() for delet all bookmarks

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith(`ingredient`) && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(`,`).map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(`,`);
        if (ingArr.length !== 3)
          throw new Error(
            `Wrong ingredient format! Please use the correct format :)`
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = creatRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
