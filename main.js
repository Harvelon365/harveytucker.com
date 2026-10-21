const projectsContainer = document.getElementById("projects-container");
const meDescription = document.getElementById("me-description");
const projectsDescription = document.getElementById("projects-description");

fetch("content.json")
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        const sections = data["sections"];
        meDescription.innerText = sections["me"];
        projectsDescription.innerText = sections["projects"];

        const projects = data["projects"];
        projects.sort((a, b) => new Date(b["sorting-date"]) - new Date(a["sorting-date"]));
        projects.forEach(p => {
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