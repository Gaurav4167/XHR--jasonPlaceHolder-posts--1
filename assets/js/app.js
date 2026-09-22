var cl = console.log;

let form = document.getElementById("form")
let titleControl = document.getElementById("titleControl")
let bodyControl = document.getElementById("bodyControl")
let userId = document.getElementById("userId")
let addBtn = document.getElementById("addBtn")
let updateBtn = document.getElementById("updateBtn")
let cancelBtn = document.getElementById("cancelBtn")
let row = document.getElementById("row")
let addHeading = document.getElementById("add-heading")
let updateHeading = document.getElementById("update-heading")
let spinner = document.getElementById("spinner")

let cardContent = document.getElementById("cardContent")
// let postContainer = document.getElementById("postContainer")
// cl(postContainer)

const BASE_URL = `https://jsonplaceholder.typicode.com`;
const POST_URL = `${BASE_URL}/posts`

function showCards() {
    spinner.classList.remove("d-none") //Spinner Added 
    let xhr = new XMLHttpRequest()

    xhr.open("GET", POST_URL);

    xhr.onload = function () {
        let data = JSON.parse(xhr.response)
        // cl(data)
        let result = ""
        data.reverse().forEach((ele) => {
            result += `<div class="col-4 mt-5 select" id=${ele.id}>
                <div class="card" id="card">
                    <div class="card-header" id="card-header">
                        <h3> ${ele.title} </h3>
                    </div>
                    <div class="card-body" id="card-body">
                        <div class="card-content">
                        <p> ${ele.body} </p>

                        </div>
                    </div>
                    <div class="card-footer" id="card-footer">
                        <div class="d-flex justify-content-between">
                            <i onClick="editCard(this)" role="button" class="fa-solid fa-pen-to-square"> Edit</i>

                            <i onClick="removeCard(this)" role="button" class="fa-solid fa-trash"> Remove</i>
                        </div>
                    </div>
                </div>
            </div>`
        })

        row.innerHTML = result
        spinner.classList.add("d-none")

    }

    xhr.send(null)
}
showCards()

function addNewCard(ele) {
    ele.preventDefault()

    let newPostsObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userId.value,
    }
    // cl(newPostsObj)

    //API call (POST)
    const xhr = new XMLHttpRequest()
    spinner.classList.remove("d-none")


    xhr.open("POST", POST_URL)

    xhr.send(JSON.stringify(newPostsObj))
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {

            // cl("DONE")
            let res = JSON.parse(xhr.responseText)
            // cl(res.id)

            let col = document.createElement('div');
            col.className = "col-4 mt-5 select";
            col.id = res.id
            col.innerHTML = ` <div class="card" id="card">
                    <div class="card-header" id="card-header">
                        <h3> ${newPostsObj.title} </h3>
                    </div>
                    <div class="card-body" id="card-body">
                        <div class="card-content">
                        <p> ${newPostsObj.body} </p>

                        </div>
                    </div>
                    <div class="card-footer" id="card-footer">
                        <div class="d-flex justify-content-between">
                            <i onClick="editCard(this)" role="button" class="fa-solid fa-pen-to-square"> Edit</i>
                            <i onClick="removeCard(this)" role="button" class="fa-solid fa-trash"> Remove</i>
                        </div>
                    </div>
                </div>`

            row.prepend(col)
            spinner.classList.add("d-none")
            successSnackBar("Added", "Post added successfully!")
            form.reset()

        }
        else {
            spinner.classList.add("d-none")
            cl("Something went Wrong")
            errorSnackBar()
        }
    }

}

function editCard(ele) {
    addHeading.classList.add("d-none")
    updateHeading.classList.remove("d-none")
    let EDIT_ID = ele.closest(".select").id;

    // cl(EDIT_ID)
    let EDIT_URl = `${BASE_URL}/posts/${EDIT_ID}`

    let xhr = new XMLHttpRequest()
    spinner.classList.remove("d-none")
    xhr.open("PATCH", EDIT_URl)


    xhr.send(null);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            // cl("done")
            let res = JSON.parse(xhr.response)
            cl(res)
            titleControl.value = res.title
            bodyControl.value = res.body
            userId.value = res.userId

            localStorage.setItem("EDIT_ID", EDIT_ID);

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
        }
        else {
            cl("Something went wrong")
        }
        spinner.classList.add("d-none")
    }
}

function updatepost(ele) {
    let UPDATE_ID = localStorage.getItem("EDIT_ID")
    localStorage.removeItem("EDIT_ID");

    let updatedPost = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userId.value,
    }

    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`;

    let xhr = new XMLHttpRequest();
    spinner.classList.remove("d-none")
    xhr.open("PATCH", UPDATE_URL)

    xhr.send(JSON.stringify(updatedPost))

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
            let data = JSON.parse(xhr.response)
            // cl(data)
            let editCol = document.getElementById(UPDATE_ID)
            editCol.innerHTML = ` <div class="card" id="card">
                    <div class="card-header" id="card-header">
                        <h3> ${updatedPost.title} </h3>
                    </div>
                    <div class="card-body" id="card-body">
                        <div class="card-content">
                        <p> ${updatedPost.body} </p>

                        </div>
                    </div>
                    <div class="card-footer" id="card-footer">
                        <div class="d-flex justify-content-between">
                            <i onClick="editCard(this)" role="button" class="fa-solid fa-pen-to-square"> Edit</i>
                            <i onClick="removeCard(this)" role="button" class="fa-solid fa-trash"> Remove</i>
                        </div>
                    </div>
                </div>`

            addBtn.classList.remove("d-none")
            updateBtn.classList.add("d-none")
            addHeading.classList.remove("d-none")
            updateHeading.classList.add("d-none")
            successSnackBar("Updated", "Post update successfully!")
            form.reset();

        }
        else {
            cl("Something went wrong")
            errorSnackBar()
        }

        spinner.classList.add("d-none")
    }
}

function removeCard(ele) {
    let DELETE_ID = ele.closest(".select").id;
    Swal.fire({
        title: "Are you sure?",
        text: "You cant get it back!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            let DELETE_URL = `${BASE_URL}/posts/${DELETE_ID}`
            let xhr = new XMLHttpRequest()

            xhr.open("DELETE", DELETE_URL)

            xhr.send(null);

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let res = JSON.parse(xhr.response);

                    ele.closest(".select").remove()
                    successSnackBar("Deleted", "Post deleted Successfully!")
                }
                else {
                    cl("something went wrong")
                    errorSnackBar()
                }
            }
        }
    });
}

function successSnackBar(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: "success"
    });
}
function errorSnackBar() {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
    });
}

form.addEventListener("submit", addNewCard)
updateBtn.addEventListener("click", updatepost)



























