import icons from 'url:../../img/icons.svg'; //parcel 2

export default class View {
  /**
   *Render the ricvied object to the dom
   *@param {Object | Object[]} data the data to be render (e.g. recipe)
   *@param {boolean}{render = true} if false , creat markup string instade of rendrring to the dom
   *@returns {undefined | string} A mark up string is returned if render = false
   *@this {object}View object
   *@author Abdelrahman Maged
   *@todo Finish implementation
   */
  parentElement = document.querySelector('.recipe');
  data;
  Message = `No recipes found for your query. Please try again!`;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderMessage();
    this.data = data;
    const markup = this.generateMarkup();

    if (!render) return markup;

    // console.log(this.generateMarkup());
    this.clear();
    this.parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
  update(data) {
    this.data = data;
    const newMarkup = this.generateMarkup();
    // console.log(newMarkup);
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this.parentElement.querySelectorAll('*'));
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));
      // console.log(newEl.firstChild.nodeValue);
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent;
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }
  clear() {
    this.parentElement.innerHTML = '';
  }
  renderSpiiner() {
    const markup = `
          <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
          </div>
      `;
    this.clear();
    this.parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
  renderMessage(message = this.Message) {
    const markup = `
      <div class="error">
      <div>
      <svg>
      <use href="${icons}#icon-alert-triangle"></use>
      </svg>
      </div>
      <p>${message}</p>
      </div>
      `;
    this.clear();
    this.parentElement.insertAdjacentHTML(`afterbegin`, markup);
  }
}
