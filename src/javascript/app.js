/* eslint-disable no-unused-vars */
import '../scss/app.scss'
import bootstrap from 'bootstrap'

// import { Modal } from 'bootstrap' //для модального окна

import { Form } from './form'
import { Recipes } from './recipes'
import { Recipe } from './recipe'
import { Trash } from './trash'

const formElement = document.querySelector('#form')
const buttonCreateRecipe = document.querySelector('#buttonCreateRecipe')
const modalElement = document.querySelector('#formModal')

const recipesElement = document.querySelector('#recipes')
const recipeElement = document.querySelector('#recipe')
const containerElement = document.querySelector('.description')

const trashElement = document.querySelector('.trash')

const form = new Form(formElement, buttonCreateRecipe, modalElement)
const recipes = new Recipes(recipesElement)
const recipe = new Recipe(recipeElement,
  containerElement,
  recipesElement,
  modalElement)

const trash = new Trash(trashElement, recipeElement, containerElement)
