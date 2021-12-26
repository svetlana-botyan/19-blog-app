import { removeBackground, installBackground } from './helpers'

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
    this.handleClickRecover = this.handleClickRecover.bind(this)

    this.buttonElement.addEventListener('click', this.handleClickTrash)
    this.containerElement.addEventListener('click', this.handleClickDelete)
    this.containerElement.addEventListener('click', this.handleClickRecover)
  }

  async handleClickTrash () {
    this.renderTrash()
  }

  async renderTrash () {
    const recipes = await this.getRecipes()

    removeBackground(this.mainContainerElement)

    const containerTrashHTML = this.getTemplateContainerTrash()
    this.containerElement.innerHTML = containerTrashHTML

    const boxRecipesElement = this.containerElement.querySelector('#recipeTrash')

    const recipesTrashHTML = this.createTrashRecipes(recipes)
    boxRecipesElement.innerHTML = recipesTrashHTML
  }

  getTemplateContainerTrash () {
    return `
    <div class= "d-flex flex-column">
      <div class= "d-flex  justify-content-end">
        <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" data-role ="close" title="Close">
         <svg class="pe-none align-basiline" width="30" height="30" >
           <use href="#close" />
         </svg>
        </button>
      </div>

      <div id="recipeTrash">
      </div>
    </div>
    `
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

  getTemplateRecipe ({ title, id }) {
    return `
    <div class="p-2 trash__item">
      <div class="d-flex flex-row justify-content-between">
          <h3 class="mb-0">${title}</h3>
          <div>
            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="top" data-id = "${id}" data-role ="recover" title="Delete">Recover</button>

            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" data-id = "${id}" data-role ="delete" title="Delete">Delete</button>
          </div>
      </div>
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
      installBackground(this.mainContainerElement)
    }
  }

  // удаление из базы
  async removeRecipe (id) {
    const url = `/api/posts/${id}` // от backend

    const responce = await fetch(url, { method: 'DELETE' })
    const recipe = await responce.json()

    return recipe
  }

  async handleClickRecover ({ target }) {
    if (target.dataset.role === 'recover') {
      const { id } = target.dataset

      await this.recoverRecipe(id)

      this.containerElement.innerHTML = ''
      installBackground(this.mainContainerElement)
    }
  }

  recoverRecipe (id) {
    const event = new CustomEvent('recipe:recover', {
      detail: { id }
    })
    window.dispatchEvent(event)
  }
}

export { Trash }
