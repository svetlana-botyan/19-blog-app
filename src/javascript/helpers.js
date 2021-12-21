function resetForm (formElement) {
  formElement.reset()

  const inputHiddenElements = [...formElement.querySelectorAll('[type="hidden"]')]
  inputHiddenElements.forEach(inputElement => { inputElement.value = '' })
}

export { resetForm }
