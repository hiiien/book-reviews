const input = document.getElementById("small-search");
const searchList = document.getElementById("search-list");
let timeoutID = 0
input.addEventListener("input", (event) => {
    let inputs = encodeURIComponent(event.target.value.trim());
    clearTimeout(timeoutID);
    if(!inputs){
        searchList.innerHTML = "";
        return;
    }
    
    timeoutID = setTimeout(fetchData, 300, inputs);
})

const searchForm = document.getElementById("search-form")
input.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchForm.dispatchEvent(new Event("submit"));
    }; 
});

searchForm.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();
        const form = new FormData(searchForm);
        const queryData = form.get("query");
        window.location.href = `/search?q=${encodeURIComponent(queryData)}`;
    } catch (error) {
        console.log(error)
    }
})

async function fetchData(queryData) {
    try {
        const response = await fetch(`https://openlibrary.org/search.json?title=${queryData}&fields=title,author_name,cover_i&limit=4`);
        if(!response.ok){
            throw new Error(`HTTP Error! Status: ${response.status}`)
        }
        const data = await response.json();
        const docs = data.docs;
        
        searchList.innerHTML = "";

        docs.forEach(doc => {
            const li = document.createElement('li');
            li.classList.add("list-item");
            li.innerHTML = `
            <a href="">
            <img src="https://covers.openlibrary.org/b/id/${doc.cover_i}-S.jpg?default=https://openlibrary.org/static/images/icons/avatar_book-sm.png" 
                     width="40" height="60" alt="book cover">
                <div>
                    <p class="amiri-bold">${doc.title}</p>
                    <p class="amiri-regular">By: ${doc.author_name[0]}</p>
                </div>
            </a>`
            searchList.append(li)
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}