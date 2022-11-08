function loadTopics(jsonData) {
    const topics = []

    for (i in jsonData.quiz) {
        topics.push(jsonData.quiz[i].topic)
    }
    return topics;
}

topics = loadTopics(questions)
console.log(topics);
createLinks(topics);


function createLinks(topics) {
    console.log(topics.length);
    for (i = 0; i < topics.length; i++) {
        console.log("test");
        var a = document.createElement('a');
        var linkText = document.createTextNode(topics[i]);
        a.appendChild(linkText);
        a.title = topics[i];
        a.href = "quiz.html";
        topiclinks.appendChild(a);
    }
}