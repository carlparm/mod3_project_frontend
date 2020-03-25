const BASE_URL = "http://localhost:3000"
const RECIPES_URL = `${BASE_URL}/recipes`
const USER_URL = `${BASE_URL}/users`

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
    let recipeInfo = document.createElement('ul')
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
    fetch(`${RECIPES_URL}/${event.target.dataset.id}`)
        .then(resp => resp.json())
        .then(recipe => {let showLocation = document.getElementById('show')
        showLocation.innerHTML = ''
        let recipeTitle = document.createElement('h3')
            recipeTitle.innerText = recipe.name
        let recipeCookTime = document.createElement('p')
            recipeCookTime.innerText = `${recipe.hours}:${recipe.minutes}`
        showLocation.append(recipeTitle, recipeCookTime)
    })
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
