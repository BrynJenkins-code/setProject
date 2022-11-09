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
    localStorage.clear();
    localStorage.setItem("topic", links[index].innerHTML);
  });
}

function createLinks(topics) {
  for (i = 0; i < topics.length; i++) {
    let topicImage = document.createElement("img");
    topicImage.src = `../media/topics/${topics[i]}.jpg`;
    topicImage.classList.add("topicimages");
    topicImage.alt = `${topics[i]}`;
    topiclinks.appendChild(topicImage);
    var a = document.createElement("a");
    var linkText = document.createTextNode(topics[i]);
    a.appendChild(linkText);
    a.title = topics[i];
    a.href = "quiz.html";
    a.classList.add("link");
    a.innerText = topics[i];
    topiclinks.appendChild(a);
  }
}
