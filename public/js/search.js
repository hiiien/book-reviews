function createSearchContainer(){
    const searchContainer = document.createElement("div")
    searchContainer.classList.add("search-result-container");
    document.querySelector(".home-container").appendChild(searchContainer);
    return searchContainer
}

function displaySubsection(docs){
    if(document.querySelector(".home-container").contains(document.querySelector(".search-result-container"))){
        document.querySelector(".home-container").removeChild(document.querySelector(".search-result-container"));
    }
    const searchContainer = createSearchContainer();
    let startVal = 0;
    let i;
    function loopTen(){
        for(i = startVal; i < (startVal + 9) && i < docs.length; i++){
            const div = document.createElement("div");
            div.classList.add("search-result-card");
            div.innerHTML = `
                <a href="/book?title=${docs[i].title}&author=${docs[i].author_name[0]}&cover_id=${docs[i].cover_i}">
                <img src="https://covers.openlibrary.org/b/id/${docs[i].cover_i}-L.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png" 
                        width="40" height="60" alt="book cover">
                    <div>
                        <p class="amiri-bold">${docs[i].title}</p>
                        <p class="amiri-regular">By: ${docs[i].author_name[0]}</p>
                    </div>
                </a>
            `
            searchContainer.appendChild(div)
        }
        startVal = i + 1;
        if(i >= docs.length){
            document.querySelector(".load-btn").remove();
        }
    }
    
    return loopTen;
}

function makeLoadButton(){
    const searchContainer = document.querySelector(".search-result-container");
    const loadBtn = document.createElement("button");
    searchContainer.appendChild(loadBtn);
    loadBtn.innerText = "Load More results";
    loadBtn.classList.add("btn-log", "load-btn");
    return loadBtn
}

let docs = []
window.addEventListener("load", async (event) => {
    try {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        console.log(query);
        const response = await fetch(`https://openlibrary.org/search.json?title=${query}&fields=title,author_name,cover_i`);
        if (response.ok){
            searchList.innerHTML = ""
            let elements = document.querySelectorAll(".hide");
            elements.forEach(element => {
                element.style.display = "none"
            });

            const data = await response.json();
            docs = data.docs;
            filterDocs = docs.filter((doc) => doc.cover_i != null && doc.author_name != null); 
            document.querySelector(".home-container").style.paddingTop = "0px"; 
            displayNextTen = displaySubsection(filterDocs);
            
            displayNextTen();
            const loadBtn = makeLoadButton();
            loadBtn.addEventListener('click', () => {
                displayNextTen();
                loadBtn.style.gridRow = Math.ceil(document.querySelector(".search-result-container").children.length / 3);
            });
        } else {
            alert("Error fetching books");
        }
    } catch (error) {
        console.log(error)
    }
})