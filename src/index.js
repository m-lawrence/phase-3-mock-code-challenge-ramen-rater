const url = 'http://localhost:3000/ramens'
const form = document.querySelector('form#ramen-rating')
const detailDiv = document.querySelector('div#ramen-detail')
const newForm = document.querySelector('form#new-ramen')


function renderOneRamen(ramenObj) {
    const ramImg = document.createElement('img')
    ramImg.src = ramenObj.image
    ramImg.alt = ramenObj.name 
    ramImg.dataset.id = ramenObj.id

    const ramensDiv = document.querySelector('div#ramen-menu')
    ramensDiv.append(ramImg)

    ramImg.addEventListener('click', event => {
        
        const detailImg = detailDiv.querySelector('img.detail-image')
        const detailName = detailDiv.querySelector('h2.name')
        const detailRestaurant = detailDiv.querySelector('h3.restaurant')
        detailDiv.dataset.id = ramenObj.id

        detailImg.src = `${ramenObj.image}`
        detailName.textContent = `${ramenObj.name}`
        detailRestaurant.textContent = `${ramenObj.restaurant}`

        const formRating = form.querySelector('input')
        const formComment = form.querySelector('textarea')

       
        fetch(`${url}/${detailDiv.dataset.id}`)
          .then(response => response.json())
          .then(data => {
                formRating.value = `${data.rating}`
                formComment.value = `${data.comment}`
          })
        

    })

    detailDiv.addEventListener('click', event => {
        event.preventDefault()
    
        if (event.target.className === "delete-button") {
            if (ramImg.dataset.id === detailDiv.dataset.id) {
                ramImg.remove()
                fetch(`${url}`)
                .then(response => response.json())
                .then(ramensArr => {
                defaultDispay(ramensArr[0])
            })
            }
            fetch(`${url}/${detailDiv.dataset.id}`, {
                method: "DELETE"
            })
        }
    })

    form.addEventListener('submit', event => {
        event.preventDefault()
        
        const rating = event.target.rating.value
        const comment = event.target.comment.value
        // if (detailDiv.dataset.id === ramenObj.id) {
        //     ramenObj.rating = rating
        //     ramenObj.comment = comment
        // }
    
        fetch(`${url}/${detailDiv.dataset.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ rating, comment })
        })
           
    })
}

function defaultDispay(ramObject) {
    const defaultImg = detailDiv.querySelector('img.detail-image')
    const defaultName = detailDiv.querySelector('h2.name')
    const defaultRestaurant = detailDiv.querySelector('h3.restaurant')
    detailDiv.dataset.id = ramObject.id
    defaultImg.src = `${ramObject.image}`
    defaultName.textContent = `${ramObject.name}`
    defaultRestaurant.textContent = `${ramObject.restaurant}`

    const defaultRating = form.querySelector('input')
    const defaultComment = form.querySelector('textarea')
    defaultRating.value = `${ramObject.rating}`
    defaultComment.value = `${ramObject.comment}`
}

function renderAllRamens() {
    fetch(`${url}`)
        .then(response => response.json())
        .then(ramensArr => {
            ramensArr.forEach((ramen) =>
                renderOneRamen(ramen)
            )
            defaultDispay(ramensArr[0])
        })
}



newForm.addEventListener('submit', event => {
    event.preventDefault()

    const name = event.target.name.value
    const restaurant = event.target.restaurant.value
    const image = event.target.image.value
    const ratingInput = event.target.rating.value
    const commentInput = event.target['new-comment'].value

    const newRamen = {
        name,
        restaurant,
        image,
        rating: ratingInput,
        comment: commentInput
    }

    fetch(`${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newRamen)
    })
        .then(response => response.json())
        .then(ramenData => {
            renderOneRamen(ramenData)
        })
   
})

function createDelete() {
    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('delete-button')
    deleteBtn.textContent = "Delete Ramen"

    detailDiv.append(deleteBtn)
}








renderAllRamens()
createDelete()