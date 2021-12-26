function resetForm (formElement) {
  formElement.reset()

  const inputHiddenElements = [...formElement.querySelectorAll('[type="hidden"]')]
  inputHiddenElements.forEach(inputElement => { inputElement.value = '' })
}

function removeBackground (containerElement) {
  containerElement.style.backgroundImage = 'none'
}

function installBackground (containerElement) {
  containerElement.style.backgroundImage = 'url(dish.jpg)'
}

export { resetForm, removeBackground, installBackground }
