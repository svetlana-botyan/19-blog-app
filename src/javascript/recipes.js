class Recipes {
  constructor (containerElement) {
    this.containerElement = containerElement

    this.init()
  }

  init () {
    this.render()

    this.handleRecipesNeedsRender = this.handleRecipesNeedsRender.bind(this)

    window.addEventListener('recipes:needsRender', this.handleRecipesNeedsRender)
  }

  handleRecipesNeedsRender () {
    this.render()
  }

  getTemplateRecipe ({ title, category, cookingTime, typeTime }) {
    return `
      <div class="island__item">
        <h3>${title}</h3>
        <div class="text-mited"><time>${category}</time></div>
        <div class="text-mited "><svg class="pe-none align-baseline" width="14" height="14">
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
