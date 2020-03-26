const BASE_URL = "http://localhost:3000"
const RECIPES_URL = `${BASE_URL}/recipes`
const USER_URL = `${BASE_URL}/users`
const COMMENTS_URL = `${BASE_URL}/comments`

const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.modal.active')
    modals.forEach(modal => {
      closeModal()
    })
  })

  closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal')
      closeModal(modal)
    })
  })

document.addEventListener('DOMContentLoaded', generatePage);
let newForm = document.getElementById('newform')
    newForm.addEventListener('submit', processNew)

function generatePage() {
    fetchRecipes()
}

function fetchRecipes() {
    fetch(RECIPES_URL)
        .then(resp => resp.json())
        .then(recipes => recipes.forEach(recipe => renderRecipes(recipe)))
}

function renderRecipes(recipe){
    let recipeLocation = document.getElementById("recipes")
    let recipeCard = document.createElement('div')
        recipeCard.classList.add('card')
        recipeCard.dataset.id = recipe.id
        recipeCard.addEventListener('click', showRecipe)
    let recipeName = document.createElement('h3')
        recipeName.innerHTML = recipe.name
    let recipeBy = document.createElement('li')
        recipeBy.innerText = `By: ${recipe.user.name}`
    let recipeTime = document.createElement('li')
        recipeTime.innerText = `Cook Time: ${recipe.hours} hour(s) ${recipe.minutes} minutes`
    let recipeFeeds = document.createElement('li')
        recipeFeeds.innerText = `Feeds: ${recipe.feeds}`
    recipeCard.append(recipeName, recipeBy, recipeTime, recipeFeeds)
    recipeLocation.append(recipeCard)
}

function showRecipe(event) {
    let modal = document.getElementById('modal')
    fetch(`${RECIPES_URL}/${event.target.dataset.id}`)
        .then(resp => resp.json())
        .then(recipe => {
            modal.dataset.id = recipe.id
            let recipeTitle = document.getElementById('recipetitle')
                recipeTitle.innerText = recipe.name
            let recipeChef = document.getElementById('recipechef')
                recipeChef.innerText = `By: ${recipe.user.name}`
            let recipeTime = document.getElementById('cooktime')
                recipeTime.innerText = `Cook Time: ${recipe.hours} hour(s) ${recipe.minutes} minutes`
            let recipeFeeds = document.getElementById('recipefeeds')
                recipeFeeds.innerText = `Feeds: ${recipe.feeds}`
            let recipeDirections = document.getElementById('recipedirections')
                recipeDirections.innerText = recipe.directions
            let recipeIngredients = document.getElementById('recipeingredients')
                recipeIngredients.innerText = ''
                for (i = 0; i < recipe.ingredients.length; i++) {
                    let ingredientLine = document.createElement('li')
                        ingredientLine.innerText = `${recipe.recipe_ingredients[i].amount} ${recipe.recipe_ingredients[i].measurement} ${recipe.ingredients[i].name}`
                        recipeIngredients.append(ingredientLine)
                }
                // recipe.ingredients.forEach(ingredient => {
                //     let ingredientLine = document.createElement('li')
                //         ingredientLine.innerText = ingredient.name
                //     recipeIngredients.append(ingredientLine)
                // })
            let recipeComments = document.getElementById('recipecomments')
                recipeComments.innerText = ''
                recipe.comments.forEach(comment => {
                    let commentLine = document.createElement('li')
                        commentLine.innerText = comment.content
                    recipeComments.append(commentLine)
                })
            let commentNew = document.getElementById('commentform')
                commentNew.addEventListener('submit', addComment)
    })
    modal.classList.add('active')
    overlay.classList.add('active')
}

function addComment(event) {
    event.preventDefault()
    console.log('here')
    let commentContent = event.target.content.value
    let recipeID = event.target.parentElement.parentElement.dataset.id
    let payload = {recipe_id: recipeID, content: commentContent}
    fetch(COMMENTS_URL, {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(payload)
    }).then(r => r.json())
    .then(comment => {
        let recipeComments = document.getElementById('recipecomments')
        let commentLine = document.createElement('li')
            commentLine.innerText = comment.content
        recipeComments.append(commentLine)
    })
    event.target.reset()  
}

function processNew(event) {
    event.preventDefault();
    let recipeName = event.target.name.value
    let recipeHours = event.target.hours.value
    let recipeMinutes = event.target.minutes.value
    let recipeFeeds = event.target.feeds.value
    let recipeDirections = event.target.directions.value
    let payload = {name: recipeName, hours: recipeHours, minutes: recipeMinutes, feeds: recipeFeeds, directions: recipeDirections}
    fetch(RECIPES_URL, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    }).then(r => r.json())
    .then(recipe => renderRecipes(recipe))
    event.target.reset()
}

function closeModal() {
    let modal = document.getElementById('modal')
        modal.dataset.id = ''
    modal.classList.remove('active')
    overlay.classList.remove('active')
  }
