import { marked } from 'marked'
import { Modal } from 'bootstrap'
import { removeBackground, installBackground } from './helpers'

class Recipe {
  constructor (containerElement, mainContainerElement, recipesElement, modalElement) {
    this.containerElement = containerElement
    this.mainContainerElement = mainContainerElement
    this.recipesElement = recipesElement
    this.modalElement = modalElement

    this.init()
  }

  init () {
    this.instanceModal = Modal.getOrCreateInstance(this.modalElement)

    this.handleClickRecipe = this.handleClickRecipe.bind(this)
    this.handleClickDelete = this.handleClickDelete.bind(this)
    this.handleClickClose = this.handleClickClose.bind(this)
    this.handleClickEdit = this.handleClickEdit.bind(this)
    this.handleRecipeClear = this.handleRecipeClear.bind(this)
    this.handleRecipeRecover = this.handleRecipeRecover.bind(this)

    window.addEventListener('recipe:click', this.handleClickRecipe)
    window.addEventListener('recipe:clear', this.handleRecipeClear)
    window.addEventListener('recipe:recover', this.handleRecipeRecover)
    this.containerElement.addEventListener('click', this.handleClickDelete)
    this.containerElement.addEventListener('click', this.handleClickClose)
    this.containerElement.addEventListener('click', this.handleClickEdit)
  }

  async handleClickRecipe ({ detail }) {
    // console.log(detail.id)
    const { id } = detail

    removeBackground(this.mainContainerElement)

    const data = await this.getRecipe(id) // получаем данные recipe

    this.render(data)
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
    const htmlIngredients = marked.parse(recipe.ingredients)
    const htmlPreparation = marked.parse(recipe.preparation)

    return ` <div class="p-2">
          <div class= "d-flex justify-content-end">
            <button type="button" class="btn btn-success my-0" data-toggle="tooltip" data-id = "${recipe.id}" data-role ="edit" data-placement="top" title="Edit">
              <svg class="pe-none align-center" width="23" height="23" >
                <use  href="#edit-pencil" />
              </svg>
            </button>
            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" data-id = "${recipe.id}" data-role ="setTrash" title="Add to trash">
              <svg class="pe-none align-center" width="23" height="23" >
                <use href="#trash" />
              </svg>
            </button>
            <button type="button" class="btn btn-secondary" data-toggle="tooltip" data-placement="top" data-role ="close" title="Close">
              <svg class="pe-none align-basiline" width="30" height="30" >
                <use href="#close" />
              </svg>
            </button>
          </div>

        <div class="block-recipe d-flex flex-column">
            <h2 class="text-center my-2">${recipe.title}</h2>

          <div class="content">
            <p><span>Category: </span>${recipe.category}</p>
            <p><span>Сooking time:
            </span>${recipe.cookingTime} ${recipe.typeTime}</p>
            <img src="${recipe.photo}" alt="photo">
            <p><span>Ingredients: </span>${htmlIngredients}</p>
            <p><span>Preparation mode: </span>${htmlPreparation}</p>
            <p class="text-muted"><span>Author: </span>${recipe.author}</p>
            <p class="text-muted"><span>Date of creation:</span>
              ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}
               </p>
          </div>
        </div>
  </div>
    `
  }

  handleRecipeClear () {
    this.clear()
    installBackground(this.mainContainerElement)
  }

  async render (data) {
    const recipeHTML = this.getTemplateRecipe(data)
    this.containerElement.innerHTML = recipeHTML
  }

  async handleClickDelete ({ target }) {
    if (target.dataset.role === 'setTrash') {
      const { id } = target.dataset

      const data = await this.getRecipe(id)
      data.setTrash = 'yes'
      // console.log(data)

      await this.sendTrashRecipe(data, id)

      this.containerElement.innerHTML = ''
      installBackground(this.mainContainerElement)

      const event = new Event('recipes:needsRender')
      window.dispatchEvent(event)
    }
  }

  async sendTrashRecipe (data, id) {
    const dataJson = JSON.stringify(data)
    const url = `/api/posts/${id}`

    const opts = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: dataJson
    }

    await fetch(url, opts)
  }

  async handleRecipeRecover ({ detail }) {
    const { id } = detail

    const data = await this.getRecipe(id)

    data.setTrash = null

    await this.sendTrashRecipe(data, id)

    const event = new Event('recipes:needsRender')
    window.dispatchEvent(event)
  }

  handleClickClose ({ target }) {
    // console.log({ target })

    if (target.dataset.role === 'close') {
      this.containerElement.innerHTML = ''
      installBackground(this.mainContainerElement)

      const link = this.recipesElement.querySelector('.active')
      link.classList.remove('.active')
    }
  }

  async handleClickEdit ({ target }) {
    if (target.dataset.role === 'edit') {
      const { id } = target.dataset

      // запрос за данными на сервер
      const data = await this.getRecipe(id)

      const event = new CustomEvent('form:setEdit', {
        detail: { data }
      })
      window.dispatchEvent(event)
    }
  }

  // отчистка поля после редактирования
  clear () {
    this.containerElement.innerHTML = ''
  }
}

export { Recipe }
