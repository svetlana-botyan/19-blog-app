class Recipe {
  constructor (containerElement, mainContainerElement) {
    this.containerElement = containerElement
    this.mainContainerElement = mainContainerElement

    this.init()
  }

  init () {
    this.handleClickRecipe = this.handleClickRecipe.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleClickClose = this.handleClickClose.bind(this)

    window.addEventListener('recipe:click', this.handleClickRecipe)
    this.containerElement.addEventListener('click', this.handleClickDelete)
    this.containerElement.addEventListener('click', this.handleClickClose)
  }

  async handleClickRecipe ({ detail }) {
    // console.log(detail.id)
    const { id } = detail

    this.removeBackground()

    const data = await this.getRecipe(id) // получаем данные recipe

    this.render(data)
  }

  removeBackground () {
    this.mainContainerElement.style.backgroundImage = 'none'
  }

  installBackground () {
    this.mainContainerElement.style.backgroundImage = 'url(dish.jpg)'
  }

  async getRecipe (id) {
    const url = `/api/posts/${id}` // от backend

    const responce = await fetch(url)
    const recipe = await responce.json()
    // console.log(recipe)

    return recipe
  }

  getTemplateRecipe (recipe) {
    const date = new Date(recipe.createdAt)

    return ` <div class="">
          <div class= "d-flex justify-content-end">
            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Edit">
              <svg class="pe-none align-baseline pr-3" width="20" height="20" >
                <use href="#edit-pencil" />
              </svg>
            </button>
            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" data-id = "${recipe.id}" data-role ="delete" title="Add to trash">
              <svg class="pe-none align-baseline pr-3" width="20" height="20" >
                <use href="#trash" />
              </svg>
            </button>
            <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" data-role ="close" title="Close">
              <svg class="pe-none align-baseline pr-3" width="20" height="20" >
                <use href="#close" />
              </svg>
            </button>
          </div>

          <div class="block-recipe d-flex flex-column">
          <h2>${recipe.title}</h2>

          <div class="content">
            <p><span>Category: </span>${recipe.category}</p>
            <p><span>Сooking time:
                </span>${recipe.cookingTime} ${recipe.typeTime}</p>
            <p><span>Ingredients: </span>${recipe.ingredients}</p>
            <p><span>Preparation mode: </span>${recipe.preparation}</p>
            <p class="text-muted"><span>Author: </span>${recipe.author}</p>
              <p class="text-muted"><span>Date of creation:</span>
              ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}
               </p>
              </div>
        </div>
  </div>
    `
  }

  async render (data) {
    const recipeHTML = this.getTemplateRecipe(data)
    this.containerElement.innerHTML = recipeHTML
  }

  async handleClickDelete ({ target }) {
    if (target.dataset.role === 'delete') {
      const { id } = target.dataset

      const isRemove = confirm('Do you want to delete recipe?')

      if (!isRemove) return

      await this.removeRecipe(id)

      this.containerElement.innerHTML = ''

      const event = new Event('recipes:needsRender')
      window.dispatchEvent(event)
    }
  }

  // удаление из базы
  async removeRecipe (id) {
    const url = `/api/posts/${id}` // от backend

    const responce = await fetch(url, { method: 'DELETE' })
    const recipe = await responce.json()

    return recipe
  }

  handleClickClose ({ target }) {
    if (target.dataset.role === 'close') {
      this.containerElement.innerHTML = ''
      this.installBackground()
    }
  }
}

export { Recipe }
