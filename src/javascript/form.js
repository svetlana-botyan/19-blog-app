import { nanoid } from 'nanoid'
import { Modal } from 'bootstrap'
import { resetForm } from './helpers'

class Form {
  constructor (formElement, buttonCreateRecipe, modalElement) {
    this.formElement = formElement
    this.buttonCreateRecipe = buttonCreateRecipe
    this.modalElement = modalElement

    this.init()
  }

  init () {
    this.instanceModal = Modal.getOrCreateInstance(this.modalElement)

    this.handleSubmitForm = this.handleSubmitForm.bind(this)
    this.handleClickButtonCreate = this.handleClickButtonCreate.bind(this)
    this.handleFormSetEdit = this.handleFormSetEdit.bind(this)

    this.formElement.addEventListener('submit', this.handleSubmitForm)
    this.buttonCreateRecipe.addEventListener('click', this.handleClickButtonCreate)
    window.addEventListener('form:setEdit', this.handleFormSetEdit)
  }

  async handleSubmitForm (event) {
    if (!this.formElement.checkValidity()) {
      event.preventDefault()
      this.formElement.classList.add('was-validated')
    } else {
      event.preventDefault()

      const recipe = {
        setTrash: null
      }

      const formData = new FormData(this.formElement)

      for (const [name, value] of formData.entries()) {
        recipe[name] = value
      }

      if (!recipe.id) recipe.id = nanoid() // Generate unique id
      if (!recipe.createdAt) recipe.createdAt = new Date() // Data of creating

      await this.sendRecipe(recipe)
      resetForm(this.formElement)

      this.instanceModal.hide()
    }
    const customEvent = new Event('recipe:clear')
    window.dispatchEvent(customEvent)
  }

  handleClickButtonCreate () {
    resetForm(this.formElement)
    this.setFormCreateRecipe()
    this.instanceModal.show()
  }

  handleFormSetEdit ({ detail }) {
    const { data } = detail

    this.setFormEditRecipe()
    this.instanceModal.show()

    for (const prop in data) {
      const fieldElement = document.querySelector(`[name="${prop}"]`)
      // querySelector вернет null если не найдется поля
      if (fieldElement) {
        fieldElement.value = data[prop]
      }
    }
  }

  setFormCreateRecipe () {
    this.formElement.method = 'POST'
  }

  setFormEditRecipe () {
    this.formElement.method = 'PUT'
  }

  // отправка на сервер
  async sendRecipe (data) {
    const dataJson = JSON.stringify(data)
    const method = this.formElement.getAttribute('method')

    let url = '/api/posts'

    if (method === 'PUT') {
      url += `/${data.id}`
    }

    const opts = {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: dataJson
    }

    await fetch(url, opts)

    const event = new Event('recipes:needsRender')
    window.dispatchEvent(event)
  }
}

export { Form }
