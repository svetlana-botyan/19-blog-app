/* eslint-disable no-unused-vars */
import '../scss/app.scss'

// import { Modal } from 'bootstrap' //для модального окна

import { Form } from './form'
import { Recipes } from './recipes'
import { Recipe } from './recipe'

const formElement = document.querySelector('#form')
const recipesElement = document.querySelector('#recipes')
const recipeElement = document.querySelector('#recipe')
const containerElement = document.querySelector('.description')

const form = new Form(formElement)
const recipes = new Recipes(recipesElement)
const recipe = new Recipe(recipeElement, containerElement)
