function loadQuestions(jsonData, topic) {
  for (i in jsonData.quiz) {
    if (jsonData.quiz[i].topic == topic) {
      return jsonData.quiz[i].quizquestions;
    }
  }
}
let selected_topic = localStorage.getItem("topic");
var questionCounter = 0; //Tracks question number
var currentScore = 0;
var selections = []; //Array containing user choices
var quiz = $("#quiz"); //Quiz div object
questions = loadQuestions(questions, selected_topic);

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

  return qElement;
}

// Creates a list of the answer choices as radio inputs
function createRadios(index) {
  var radioList = $("<ul>");
  var item;
  var input = "";
  for (var i = 0; i < questions[index].answers.length; i++) {
    item = $("<li>");
    input = '<input type="radio" name="answer" value=' + i + " />";
    input += questions[index].answers[i];
    item.append(input);
    radioList.append(item);
  }
  return radioList;
}

function createVideo(index) {
  if (questions[index].video) {
    // return $(
    //   '<iframe width="1212" height="682" src="' +
    //     questions[index].video +
    //     '"frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"allowfullscreen></iframe>'
    // );
    return $(
      '<iframe class="gel-card__content" src="' +
        questions[index].video +
        '"frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"allowfullscreen></iframe>'
    );
  }
}
function createImage(index) {
  if (questions[index].image && questions[index].altText) {
    return $(
      '<img class="gel-card__content" src="../media/questions/' +
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
  var score = $("<p>", { id: "question" });

  var numCorrect = 0;
  for (var i = 0; i < selections.length; i++) {
    if (selections[i] + 1 === questions[i].correct_answer) {
      numCorrect++;
    }
  }

  score.append(
    "You got " +
      numCorrect +
      " questions out of " +
      questions.length +
      " right!!!"
  );
  return score;
}
