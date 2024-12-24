window.addEventListener("load", async (event) => {
    const params = new URLSearchParams(window.location.search);
    let found = false;
    if(sessionStorage.getItem("favorites")){
        const data = JSON.parse(sessionStorage.getItem("favorites"));
        data.forEach(element => {
            if(element["title"] === params.get("title") && element["author"] === params.get("author") && element["cover_id"] === params.get("cover_id")){
                found = true;
                displayFavorite(params, element);
            }
        });
        if(!found) displayUnAdded(params);
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
                data.data.forEach(element => {
                    if(element["title"] === params.get("title") && element["author"] === params.get("author") && element["cover_id"] === params.get("cover_id")){
                        found = true;
                        displayFavorite(params, element);
                    }
                });
                if(!found) displayUnAdded(params);
                
            } else {
                alert("Could not load favorites");
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    }
})

function displayFavorite(params, data){
    console.log("old value");
    console.log(data);
}

function displayUnAdded(params){
    console.log("New value")
}