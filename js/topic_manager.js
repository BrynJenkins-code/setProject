function loadTopics(jsonData) {
  const topics = [];

  for (i in jsonData.quiz) {
    topics.push(jsonData.quiz[i].topic);
  }
  return topics;
}
let selected_topic;
topics = loadTopics(questions);
createLinks(topics);
let links = document.querySelectorAll(".link");
for (let index = 0; index < links.length; index++) {
  links[index].addEventListener("click", () => {
    if (links[index].href == "http://localhost:3000/quiz.html") {
      localStorage.clear();
      localStorage.setItem("topic", links[index].innerText);
    } else {
      localStorage.clear();
      localStorage.setItem("topic", links[index].alt);
    }
  });
}

function createLinks(topics) {
  for (i = 0; i < topics.length; i++) {
    let topicContainer = document.createElement("li");
    topicContainer.classList.add("topicContainers");
    topicContainer.classList.add('class="gel-card"');

    let imageAnchor = document.createElement("a");
    imageAnchor.classList.add("gel-card__content");
    imageAnchor.href = "quiz.html";

    let topicImage = document.createElement("img");
    topicImage.src = `../media/topics/${topics[i]}.jpg`;
    topicImage.classList.add("topicimages");
    topicImage.classList.add("link");
    topicImage.alt = `${topics[i]}`;
    imageAnchor.appendChild(topicImage);
    topicContainer.appendChild(imageAnchor);
    var a = document.createElement("a");
    var linkText = document.createTextNode(topics[i]);
    a.appendChild(linkText);
    a.title = topics[i];
    a.href = "quiz.html";
    a.classList.add("link");
    a.classList.add("gel-card__headline");
    a.tabIndex = "-1";
    a.innerText = topics[i];
    topicContainer.appendChild(a);

    topiclinks.appendChild(topicContainer);
  }
}
