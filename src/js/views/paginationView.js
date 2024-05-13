import View from './View.js';
import icons from 'url:../../img/icons.svg'; //parcel 2

class paginationView extends View {
  parentElement = document.querySelector('.pagination');
  addHandlerRender(handler) {
    this.parentElement.addEventListener(`click`, function (e) {
      const btn = e.target.closest(`.btn--inline`);
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }

  generateMarkup() {
    const curPage = this.data.page;
    const numPages = Math.ceil(
      this.data.results.length / this.data.resultsPerPage
    );
    const btnprev = `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
    </button>
    `;
    const btnnext = `
    <button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
           <span>Page ${curPage + 1}</span>
           <svg class="search__icon">
             <use href="${icons}#icon-arrow-right"></use>
           </svg>
     </button>
     `;
    //page 1 and other pages
    if (curPage === 1 && numPages > 1) {
      return btnnext;
    }
    //page 1 no other pages
    if (numPages === 1) return '';
    //last page
    if (curPage === numPages) {
      return btnprev;
    }
    //other page
    if (curPage < numPages) {
      return btnprev + btnnext;
    }
  }
}
export default new paginationView();
