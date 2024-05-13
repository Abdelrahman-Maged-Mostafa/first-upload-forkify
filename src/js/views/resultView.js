import previewView from './previewView.js';
import View from './View.js';

// console.log(previewView);
class ResultsView extends View {
  parentElement = document.querySelector('.results');
  Message = `No recipes found for your query. Please try again!`;
  generateMarkup() {
    return this.data.map(result => previewView.render(result, false)).join(``);
  }
}
export default new ResultsView();
