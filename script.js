var questions = [
  "Quem na Mitologia Grega engolia seus filhos após nascerem?",
  "Qual é a deusa da fogueira e do lar? ",
  "Qual era o nome de Zeus em latim?",
  "Qual era o nome de Poseidon em latim?",
  "Quem é a mãe de Apolo e Ártemis? ",
  "Qual o animal sagrado de Atenas?",
  "Quem sequestrou Perséfone para se casar com ela?",
  "Qual poema épico foi primeiramente escrito?",
  "Quem criou e construiu o Labirinto de Creta?",
  "Por quem os Gigantes foram gerados?"
];

var questionType = [0, 0, 1, 1, 0, 0, 0, 1, 1, 0];

var images = ["cronos.jpg", "hestia.jpg", "jupter.jpg", "neptuno.jpg", "latona.jpg", "athenas.jpg", "hades.jpg", "ilíada.jpg", "dedalo.jpg", "gaia.jpg"];

var answers = [
  "Cronos",
  "Héstia",
  "Jupiter",
  "Neptuno",
  "Leto",
  "Coruja",
  "Hades",
  "Ilíada",
  "Dédalo",
  "Gaia"
];

var deuses = ["Poseidon", "Eros", "Apolo", "Ártemis", "Deméter", "Dionísio", "Hermes", "Hefesto", "Hera", "Hebe", "Perséfone", "Éris", "Afrodite", "Zeus"];

var animais = ["Leão", "Cobra", "Falcão", "Águia", "Javali", "Pantera", "Lobo", "Pomba", "Vaca"];

var textWinner = ["Parabéns!", "Você é um detentor dos conhecimentos de mitologia grega", "Continue o ótimo trabalho na busca por conhecimento!"];
var textLoser  = ["Que Pena!", "Você não alcançou uma pontuação satisfatória", "Procure mais conhecimento e volte para tentar novamente!"];

var currentQuestion = -1;
var time = 21;
var progressBarValue = 0;
var rightAnswers = 0;
var timeOut;

var inputsRadio;

window.onload = function() {
    if(location.pathname.split("/").pop() != "feedback.html") {
      nextQuestion();
      timeLapse();
    } else {
      var ra = localStorage.getItem("rightAnswers");
      if (ra >= 7) {
        document.getElementById('imageFeedback').src = "img/ganhou.png";
        for(var i = 0; i < 3; i++) {
            document.getElementById('textFeedback'+(i+1)).innerHTML = textWinner[i];
        }
      } else {
        document.getElementById('imageFeedback').src = "img/perdeu.png";
        for(var i = 0; i < 3; i++) {
            document.getElementById('textFeedback'+(i+1)).innerHTML = textLoser[i];
        }
      }
      document.getElementById('userPoints').innerHTML = ra;
      document.getElementById('userScore').innerHTML = (ra*10) + "%";

      localStorage.removeItem("rightAnswers");
    }
}

function timeLapse() {
  time -= 1;
  document.getElementById('timeRemain').innerHTML = "Tempo Restante: " + time + "s";
  if(time == 0) {
    time = 21;
    submitAnswer();
  }
  timeOut = setTimeout(timeLapse, 1000);
}

function showResults() {
  clearTimeout(timeOut);
  localStorage.setItem("rightAnswers", rightAnswers);
  location.href = "feedback.html";
}

function nextQuestion() {
  currentQuestion += 1;
  if(currentQuestion == 10) {
      showResults();
  }
  document.getElementById('q'+(currentQuestion+1)).style.backgroundColor = "#999900";
  document.getElementById('textQuestion').innerHTML = questions[currentQuestion];
  document.getElementById('imageQuestion').src = "img/" + images[currentQuestion];
  var form = document.getElementById('inputAnswer');
  form.innerHTML = "";
  if(questionType[currentQuestion] == 0) {
      var sortedAnswers = [];
      while(sortedAnswers.length < 4) {
        if(currentQuestion == 5) {
          var randomNumber = Math.ceil(Math.random()*(animais.length-1));
          if(sortedAnswers.indexOf(animais[randomNumber]) == -1) {
            sortedAnswers.push(animais[randomNumber]);
          }
        } else {
          var randomNumber = Math.ceil(Math.random()*(deuses.length-1));
          if(sortedAnswers.indexOf(deuses[randomNumber]) == -1) {
            sortedAnswers.push(deuses[randomNumber]);
          }
        }
      }
      sortedAnswers.push(answers[currentQuestion]);
      sortedAnswers.sort();
      for(i = 0; i < 5; i++) {
          var div = document.createElement('div');
          var input = document.createElement('input');
          input.setAttribute("id", sortedAnswers[i]);
          input.setAttribute("type", "radio");
          input.setAttribute("name", "answer");
          input.setAttribute("value", sortedAnswers[i]);
          div.appendChild(input);
          var label = document.createElement('label');
          label.setAttribute("for", sortedAnswers[i]);
          label.appendChild(document.createTextNode(sortedAnswers[i]));
          div.appendChild(label);
          form.appendChild(div);
      }
  } else {
      var paragraph = document.createElement("p");
      paragraph.innerHTML = "Resposta:";
      form.appendChild(paragraph);
      var input = document.createElement("input");
      input.setAttribute("id", "textAnswer");
      input.setAttribute("type", "text");
      input.setAttribute("name", "answer");
      input.onkeydown = function(e) {
        if(e.keyCode == 13) {
          e.preventDefault();
          return false;
        }
      }
      form.appendChild(input);
  }
  time = 20;
  document.getElementById('timeRemain').innerHTML = "Tempo Restante: " + time + "s";
}

function checkAnswer(type) {
  userAnswer = "";
  switch(type) {
    case 0:
      inputsRadio = document.getElementsByName('answer');
      for(i = 0; i < inputsRadio.length; i++) {
         if(inputsRadio[i].checked) {
           userAnswer = inputsRadio[i].value;
         }
      }
      break;
    case 1:
      userAnswer = document.getElementById('textAnswer').value;
      break;
  }
  if(answers[currentQuestion].toLowerCase().trim() == userAnswer.toLowerCase().trim()) {
    rightAnswers += 1;
    return true;
  } else {
    return false;
  }
}

function modifyProgressbar(isCorrect) {
  var li = document.getElementById('q'+(currentQuestion+1));
  if(isCorrect) {
    li.style.backgroundColor = "darkgreen";
    li.style.backgroundImage = "url('img/correct.png')";
  } else {
    li.style.backgroundColor = "darkred";
    li.style.backgroundImage = "url('img/incorrect.png')";
  }
  progressBarValue += 10;
  document.getElementById("textPorcent").innerHTML = progressBarValue + "%";
}

function submitAnswer() {
  var isCorrect = checkAnswer(questionType[currentQuestion]);
  modifyProgressbar(isCorrect);
  nextQuestion();
}
