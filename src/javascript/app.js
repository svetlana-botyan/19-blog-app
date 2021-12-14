/* eslint-disable no-unused-vars */
import '../scss/app.scss'

// import { Modal } from 'bootstrap' //для модального окна

import { Form } from './form'
import { Recipes } from './recipes'

const formElement = document.querySelector('#form')
const recipesElement = document.querySelector('#recipes')

const form = new Form(formElement)
const recipes = new Recipes(recipesElement)
