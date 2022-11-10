function loadQuestions(jsonData, topic, selected_difficulty) {
  questionObject = [];
  for (i in jsonData.quiz) {
    if (jsonData.quiz[i].topic == topic) {
      for (c in jsonData.quiz[i].quizquestions) {
        if (
          jsonData.quiz[i].quizquestions[c].difficulty == selected_difficulty
        ) {
          questionObject.push(jsonData.quiz[i].quizquestions[c]);
        }
      }
    }
  }
  console.log(questionObject);
  return questionObject;
}

let selected_topic = localStorage.getItem("topic");
let difficulty = localStorage.getItem("difficulty");
console.log(difficulty);
var questionCounter = 0; //Tracks question number
var currentScore = 0;
var selections = []; //Array containing user choices
var quiz = $("#quiz"); //Quiz div object
questions = loadQuestions(questions, selected_topic, difficulty);
updateTopicMetrics(selected_topic, difficulty);

// Display initial question
displayNext();

// Click handler for the 'next' button
$("#next").on("click", function (e) {
  e.preventDefault();

  // Suspend click listener during fade animation
  if (quiz.is(":animated")) {
    return false;
  }
  choose();

  // If no user selection, progress is stopped
  if (isNaN(selections[questionCounter])) {
    alert("Please make a selection!");
  } else {
    checkAnswer(selections[questionCounter], questionCounter);
    questionCounter++;
    displayNext();
  }
});

// Click handler for the 'prev' button
$("#prev").on("click", function (e) {
  e.preventDefault();

  if (quiz.is(":animated")) {
    return false;
  }
  choose();
  questionCounter--;
  if (currentScore > 0) {
    currentScore--;
  }
  updateScore();
  displayNext();
});

// Click handler for the 'Start Over' button
$("#start").on("click", function (e) {
  e.preventDefault();

  if (quiz.is(":animated")) {
    return false;
  }
  questionCounter = 0;
  selections = [];
  currentScore = 0;
  updateScore();
  displayNext();
  $("#start").hide();
});

// Animates buttons on hover
$(".button").on("mouseenter", function () {
  $(this).addClass("active");
});
$(".button").on("mouseleave", function () {
  $(this).removeClass("active");
});

// Creates and returns the div that contains the questions and
// the answer selections
function createQuestionElement(index) {
  var qElement = $("<div>", {
    id: "question",
  });

  var video = createVideo(index);
  qElement.append(video);

  var image = createImage(index);
  qElement.append(image);

  var header = $(
    "<h2 class='gel-card__headline'>Question " + (index + 1) + ":</h2>"
  );
  qElement.append(header);

  var question = $("<p>").append(questions[index].question);
  qElement.append(question);

  var radioButtons = createRadios(index);
  qElement.append(radioButtons);
  updateFormatMetrics(index);
  return qElement;
}

// Creates a list of the answer choices as radio inputs
function createRadios(index) {
  var radioList = $(
    "<ul style='list-style-type: none; padding:0px;display:flex; flex-direction:column'>"
  );
  var item;
  var input = "";
  for (var i = 0; i < questions[index].answers.length; i++) {
    item = $("<li>");
    input =
      '<input id="' +
      "btn" +
      i +
      '"type="radio" name="answer" value=' +
      i +
      " />";
    input +=
      "<label for='" +
      "btn" +
      i +
      "'>" +
      questions[index].answers[i] +
      "</label>";
    item.append(input);
    radioList.append(item);
  }
  return radioList;
}

function createVideo(index) {
  if (questions[index].video) {
    return $(
      '<iframe title="Youtube video" class="gel-card__content question_videos"  src="' +
        questions[index].video +
        '"frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"allowfullscreen></iframe>'
    );
  }
}
function createImage(index) {
  if (questions[index].image && questions[index].altText) {
    return $(
      '<img class="gel-card__content question_images" src="../media/questions/' +
        questions[index].image +
        '" alt="' +
        questions[index].altText +
        '">'
    );
  }
}

// Reads the user selection and pushes the value to an array
function choose() {
  selections[questionCounter] = +$('input[name="answer"]:checked').val();
}

// Displays next requested element
function displayNext() {
  quiz.fadeOut(function () {
    $("#question").remove();
    if (questionCounter < questions.length) {
      var nextQuestion = createQuestionElement(questionCounter);
      quiz.append(nextQuestion).fadeIn();

      // Controls display of 'prev' button
      if (questionCounter === 1) {
        $("#prev").show();
      } else if (questionCounter === 0) {
        $("#prev").hide();
        $("#next").show();
      }
    } else {
      var scoreElem = displayScore();
      quiz.append(scoreElem).fadeIn();
      $("#next").hide();
      $("#prev").hide();
      $("#start").show();
    }
  });
}

function checkAnswer(index, questionIndex) {
  if (index + 1 === questions[questionIndex].correct_answer) {
    currentScore++;
    updateScore();
  }
}

function updateScore() {
  let number = document.querySelector("#scoreNum");
  number.innerText = currentScore;
}

// Computes score and returns a paragraph element to be displayed
function displayScore() {
  returnLeaderboard();
  var numCorrect = 0;
  for (var i = 0; i < selections.length; i++) {
    if (selections[i] + 1 === questions[i].correct_answer) {
      numCorrect++;
    }
  }

  var score = $("<p>", { id: "question" });
  var name = $("<input>", { type: "text", id: "name" });
  var namelabel = $("<label for='name'>Input your name</label>");
  var name = document.createElement("input");
  name.type = "text";
  name.id = "name";
  var submitName = document.createElement("button");
  submitName.id = "submitName";
  submitName.innerText = "submit";
  submitName.addEventListener("click", () => {
    console.log(score);
    addLeaderboardEntry(name.value, numCorrect);
    $(name).hide();
    $(submitName).hide();
  });

  document.querySelector("#container").appendChild(name);
  document.querySelector("#container").appendChild(submitName);

  score.append(
    "You got " +
      numCorrect +
      " questions out of " +
      questions.length +
      " right!!!"
  );
  return score;
}

function updateTopicMetrics(topic, difficulty) {
  jsonFile = localStorage.getItem("metrics");
  console.log(jsonFile);

  if (!jsonFile) {
    jsonFile = metrics;
  } else {
    jsonFile = JSON.parse(jsonFile);
  }
  console.log(jsonFile);
  var currentDate = new Date();
  let date = currentDate.toGMTString();
  jsonFile.topics[topic].noOfClicks++;
  if (difficulty === "Beginner") {
    jsonFile.topics[topic].beginnerClicks++;
  } else {
    jsonFile.topics[topic].expertClicks++;
  }
  jsonFile.topics[topic].timesAccessed.push(date);
  console.log(jsonFile);
  localStorage.setItem("metrics", JSON.stringify(jsonFile));
}

function updateFormatMetrics(index) {
  jsonFile = localStorage.getItem("metrics");

  if (!jsonFile) {
    jsonFile = metrics;
  } else {
    jsonFile = JSON.parse(jsonFile);
  }
  if (questions[index].video) {
    jsonFile.formats.video++;
  } else if (questions[index].image) {
    jsonFile.formats.image++;
  } else {
    jsonFile.formats.multi_choice++;
  }

  console.log(jsonFile);
  localStorage.setItem("metrics", JSON.stringify(jsonFile));
}

function addLeaderboardEntry(name, score) {
  if (!name) {
    alert("Enter a name!");
    return;
  }
  jsonFile = localStorage.getItem(selected_topic + difficulty);

  if (!jsonFile) {
    jsonFile = leaderboard;
  } else {
    jsonFile = JSON.parse(jsonFile);
  }
  var item = jsonFile.entries.find((x) => x.name == name);
  if (item) {
    item.score = score;
  } else {
    jsonFile.entries.push({ name: name, score: score });
  }
  jsonFile.entries.sort(leaderboardSort("score"));
  localStorage.setItem(selected_topic + difficulty, JSON.stringify(jsonFile));
  console.log(jsonFile);
}

function leaderboardSort(prop) {
  return function (a, b) {
    if (a[prop] < b[prop]) {
      return 1;
    } else if (a[prop] > b[prop]) {
      return -1;
    }
    return 0;
  };
}

function returnLeaderboard() {
  jsonFile = localStorage.getItem(selected_topic + difficulty);
  if (!jsonFile) {
    return;
  } else {
    jsonFile = JSON.parse(jsonFile);
  }

  let col = ["name", "score"];

  // Create table.
  const table = document.createElement("table");

  // Create table header row using the extracted headers above.
  let tr = table.insertRow(-1); // table row.
  for (let i = 0; i < col.length; i++) {
    let th = document.createElement("th"); // table header.
    th.innerHTML = col[i];
    tr.appendChild(th);
  }
  console.log(jsonFile.entries);
  // add json data to the table as rows.
  for (let i = 0; i < jsonFile.entries.length; i++) {
    tr = table.insertRow(-1);
    for (let j = 0; j < col.length; j++) {
      let tabCell = tr.insertCell(-1);
      tabCell.innerHTML = jsonFile.entries[i][col[j]];
    }
  }

  // Now, add the newly created table with json data, to a container.
  document.querySelector("#container").appendChild(table);
}
