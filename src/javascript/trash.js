class Trash {
  constructor (buttonElement, containerElement, mainContainerElement) {
    this.buttonElement = buttonElement
    this.containerElement = containerElement
    this.mainContainerElement = mainContainerElement

    this.init()
  }

  init () {
    this.handleClickTrash = this.handleClickTrash.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)

    this.buttonElement.addEventListener('click', this.handleClickTrash)
    this.containerElement.addEventListener('click', this.handleClickDelete)
  }

  async handleClickTrash () {
    this.renderTrash()
  }

  async renderTrash () {
    const recipes = await this.getRecipes()

    this.removeBackground()

    const recipesTrashHTML = this.createTrashRecipes(recipes)
    this.containerElement.innerHTML = recipesTrashHTML
  }

  async getRecipes () {
    const responce = await fetch('/api/posts')
    const data = await responce.json()
    return data.list
  }

  createTrashRecipes (array) {
    const recipes = array.filter((array) => array.setTrash)

    const result = recipes.map((recipe) => {
      return this.getTemplateRecipe(recipe)
    })

    return result.join(' ')
  }

  getTemplateRecipe ({ title, category, id }) {
    return `
      <div class="d-flex flex-row w-70 justify-content-between trash__item">
          <h3 class="mb-0">${title}</h3>
          <div ><time>${category}</time></div>
          <button type="button" class="btn btn-warning" data-toggle="tooltip" data-placement="top" data-id = "${id}" data-role ="delete" title="Delete">Del</button>
      </div>
    `
  }

  async handleClickDelete ({ target }) {
    if (target.dataset.role === 'delete') {
      const { id } = target.dataset

      const isRemove = confirm('Do you want to delete recipe?')

      if (!isRemove) return

      await this.removeRecipe(id)

      this.containerElement.innerHTML = ''
      this.installBackground()
    }
  }

  // удаление из базы
  async removeRecipe (id) {
    const url = `/api/posts/${id}` // от backend

    const responce = await fetch(url, { method: 'DELETE' })
    const recipe = await responce.json()

    return recipe
  }

  removeBackground () {
    this.mainContainerElement.style.backgroundImage = 'none'
  }

  installBackground () {
    this.mainContainerElement.style.backgroundImage = 'url(dish.jpg)'
  }
}

export { Trash }
