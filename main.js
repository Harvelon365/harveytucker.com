const projectsContainer = document.getElementById("projects-container");


fetch("projects.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        data.sort((a, b) => new Date(b["sorting-date"]) - new Date(a["sorting-date"]));
        data.forEach(p => {
            const titleDiv = document.createElement("div");
            titleDiv.className = "project-title";
            const titleH3 = document.createElement("h3");
            titleH3.innerText = p["title"];
            const titleSubtext = document.createElement("p");
            titleSubtext.className = "subtext";
            titleSubtext.innerText = p["display-date"];

            titleDiv.appendChild(titleH3);
            titleDiv.appendChild(titleSubtext);

            const description = document.createElement("p");
            description.innerText = p["description"];

            projectsContainer.appendChild(titleDiv);
            projectsContainer.appendChild(description);
        });
    })
    .catch(error => {
        console.error("There was a problem loading projects:", error);
    });