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
        <h2>${title}</h2>
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

  getRecipes () {
    return new Promise((resolve, reject) => {
      fetch('/api/posts')
        .then((response) => response.json())
        .then((data) => resolve(data.list))
        .catch((error) => reject(error))
    })
  }

  render () {
    this.getRecipes()
      .then(recipes => {
        const recipesHTML = this.createRecipes(recipes)

        this.containerElement.innerHTML = recipesHTML
      })
  }
}

export { Recipes }
