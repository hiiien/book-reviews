window.addEventListener("load", async (event) => {
    if(sessionStorage.getItem("favorites")){
        const data = JSON.parse(sessionStorage.getItem("favorites"));
        const displayNextTen = displayDataCreator(data);
        displayNextTen();
        const loadBtn = makeLoadButton();
        loadBtn.addEventListener("click", ()=> {
            displayNextTen();
            loadBtn.style.gridRow = Math.ceil(document.getElementById("favorites-container").children.length / 3); 
        });
    } else {
        try {
            const response = await fetch("/api/book/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response) {
                const data = await response.json()
                sessionStorage.setItem("favorites", JSON.stringify(data.data))
                console.log("Data.data: ", data.data)
                const displayNextTen = displayDataCreator(data.data);
                displayNextTen();
                const loadBtn = makeLoadButton();
                loadBtn.addEventListener("click", ()=> {
                    displayNextTen();
                    loadBtn.style.gridRow = Math.ceil(document.getElementById("favorites-container").children.length / 3); 
                });
            } else {
                alert("Could not load favorites");
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }
})

function displayDataCreator(data) {
    const favoritesContainer = document.getElementById("favorites-container");
    favoritesContainer.innerHTML = "";
    let startVal = 0;
    let i;
    function loopTen(){
        for(i = startVal; i < (startVal + 9) && i < data.length; i++){
            const div = document.createElement("div");
            div.classList.add("favorite-result-card");
            div.innerHTML = `
                <a href="">
                <img src="https://covers.openlibrary.org/b/id/${data[i].cover_id}-L.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png" 
                        width="40" height="60" alt="book cover">
                    <div>
                        <p class="amiri-bold">${data[i].title}</p>
                        <p class="amiri-regular">By: ${data[i].author}</p>
                    </div>
                </a>
            `
            console.log(i);
            favoritesContainer.appendChild(div);   
        }
        startVal = i + 1;
        if(i >= data.length){
            document.querySelector(".load-btn").remove();
        }
    }
    return loopTen;
}

function makeLoadButton(){
    const favoritesContainer = document.getElementById("favorites-container");
    const loadBtn = document.createElement("button");
    favoritesContainer.appendChild(loadBtn);
    loadBtn.innerText = "Load More Results";
    loadBtn.classList.add("btn-log", "load-btn");
    return loadBtn
}
