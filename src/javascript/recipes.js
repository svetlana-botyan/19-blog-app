class Recipes {
  constructor (containerElement) {
    this.containerElement = containerElement

    this.currentRecipe = null // выделенный recipe
    this.init()
  }

  init () {
    this.render()

    this.handleRecipesNeedsRender = this.handleRecipesNeedsRender.bind(this)
    this.handleClickRecipe = this.handleClickRecipe.bind(this)

    window.addEventListener('recipes:needsRender', this.handleRecipesNeedsRender)
    this.containerElement.addEventListener('click', this.handleClickRecipe)
  }

  handleRecipesNeedsRender () {
    this.render()
  }

  // обр-ка клика на элемент списка рецептов
  handleClickRecipe (event) {
    event.preventDefault()

    const { target } = event

    if (target.tagName === 'A') {
      this.activateRecipe(target)

      // получаем id и передаем в recipe на отрисовку
      const event = new CustomEvent('recipe:click', {
        detail: { id: target.id }
      })
      window.dispatchEvent(event)
    }
  }

  // выделение recipe в списке по клику
  activateRecipe (element) {
    if (this.currentRecipe) {
      this.currentRecipe.classList.remove('active')
    }
    element.classList.add('active')

    this.currentRecipe = element
  }

  getTemplateRecipe ({ title, category, cookingTime, typeTime, id }) {
    return `
      <div class="island__item">
          <h3><a href="#${id}" id="${id}" class="stretched-link">${title}</a></h3>
          <div ><time>${category}</time></div>
          <div ><svg class="pe-none align-baseline" width="14" height="14">
          <use href="#clock" /></svg> ${cookingTime} ${typeTime}</div>
      </div>
    `
  }

  createRecipes (recipes) {
    const result = recipes.map((recipe) => {
      return this.getTemplateRecipe(recipe)
    })

    return result.join(' ')
  }

  async getRecipes () {
    const responce = await fetch('/api/posts')
    const data = await responce.json()

    // console.log(data.list)
    return data.list
  }

  async render () {
    const recipes = await this.getRecipes()

    const recipesHTML = this.createRecipes(recipes)
    this.containerElement.innerHTML = recipesHTML
  }
}

export { Recipes }
