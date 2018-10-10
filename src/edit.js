import * as DOM from './dom';
const url = 'https://flashcard-2018.herokuapp.com/api/flashcards/';
let questionsArray = [];
let currentQuestion = 0;
let flashcard;
let flashcardId;

/* SAVE TO DATABASE */
DOM.saveButton.addEventListener('click', async () => {

  if (DOM.title.value) flashcard.title = DOM.title.value;

  //if there is a question/answer present, push onto questions array
  if (DOM.question.value && DOM.answer.value) questionsArray.push({ question: DOM.question.value, answer: DOM.answer.value })
  const flashcardBody = { title: flashcard.title, questions: questionsArray }
  const response = await fetch(`${url}${flashcardId}`, {
    method: 'PATCH',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(flashcardBody)
  });
  const data = await response.json();
  console.log('data saved!')
  window.location = 'index.html'
})

/* DELETE A QUESTION */
DOM.delElement.addEventListener('click', (e) => {
  questionsArray.splice(currentQuestion, 1);
  if (currentQuestion > 0) {
    currentQuestion--
  }
  renderQuestion()
  DOM.next.removeAttribute('disabled');
})

/* PREVIOUS QUESTION */
DOM.prev.addEventListener('click', (e) => {
  currentQuestion--;
  flashcard.title = DOM.title.value;
  DOM.next.removeAttribute('disabled');
  if (!validateFields() && currentQuestion !== questionsArray.length - 1) {
    DOM.error.classList.remove('hide');
    setTimeout(() => {
      DOM.error.classList.add('hide')
    }, 2000)
    return
  }

  if (DOM.question.value && DOM.answer.value) {
    questionsArray[currentQuestion + 1].question = DOM.question.value
    questionsArray[currentQuestion + 1].answer = DOM.answer.value
  }

  if (currentQuestion <= 0) {
    currentQuestion = 0;
    DOM.prev.setAttribute('disabled', true);
  }
  renderQuestion();
  console.log(flashcard)
})

/* NEXT QUESTION */
DOM.next.addEventListener('click', (e) => {
  currentQuestion++;
  flashcard.title = DOM.title.value;
  DOM.prev.removeAttribute('disabled');

  if (!validateFields()) {
    DOM.error.classList.remove('hide');
    setTimeout(() => {
      DOM.error.classList.add('hide')
    }, 2000)
    return
  }

  if (questionsArray.length > 0) {
    if (currentQuestion < questionsArray.length) {
      questionsArray[currentQuestion - 1].question = DOM.question.value
      questionsArray[currentQuestion - 1].answer = DOM.answer.value

    } else if (currentQuestion === questionsArray.length) {
      questionsArray[currentQuestion - 1].question = DOM.question.value
      questionsArray[currentQuestion - 1].answer = DOM.answer.value
      clearQAFields()
      DOM.next.setAttribute('disabled', true);

    } else if (currentQuestion > questionsArray.length) {
      questionsArray.push({ question: DOM.question.value, answer: DOM.answer.value })
      clearQAFields()
      DOM.next.setAttribute('disabled', true);
    }

  } else {
    questionsArray.push({ question: DOM.question.value, answer: DOM.answer.value })
    clearQAFields()
  }
  renderQuestion()
})

/* ENABLE AND DISABLE NEXT,PREV BTNS ON INPUT QUESTION AND ANSWER INPUT CHANGE */
DOM.question.addEventListener('input', (e) => {
  if (DOM.question.value && DOM.answer.value) {
    enableButtons();
  } else {
    disableButtons();
  }
})
DOM.answer.addEventListener('input', (e) => {
  if (DOM.answer.value && DOM.question.value) {
    enableButtons();
  } else {
    disableButtons();
  }
})

/* FETCH FLASHCARD AFTER DOM CONTENT IS LOADED */
document.addEventListener('DOMContentLoaded', async (e) => {
  flashcardId = location.hash.substring(1);
  if (!flashcardId) {
    console.log('no flashcard id supplied')
    return;
  }
  const response = await fetch(`${url}${flashcardId}`);
  flashcard = await response.json();
  console.log(flashcard)
  questionsArray = flashcard.questions;
  DOM.title.value = flashcard.title;
  renderQuestion();
  DOM.prev.setAttribute('disabled', true);
})

/* ********************** private functions*********************** */

function enableButtons() {
  DOM.next.removeAttribute('disabled');
  DOM.prev.removeAttribute('disabled');
}

function disableButtons() {
  DOM.next.setAttribute('disabled', true)
  DOM.prev.setAttribute('disabled', true)
}
function validateFields() {
  if (!DOM.title.value || !DOM.question.value || !DOM.answer.value) {
    console.log(DOM.title.value)
    return false
  }
  return true;
}

function renderQuestion() {
  if (questionsArray.length === 0) {
    DOM.questionNumber.innerText = "No questions in flashcard set!";
    clearQAFields()
    return
  }
  if (currentQuestion < questionsArray.length) {
    DOM.question.value = questionsArray[currentQuestion].question;
    DOM.answer.value = questionsArray[currentQuestion].answer;
    DOM.questionNumber.innerText = `Question ${currentQuestion + 1} of ${questionsArray.length}`

  } else {
    DOM.questionNumber.innerText = `Question ${currentQuestion + 1} of ${questionsArray.length + 1}`
  }
}

function clearQAFields() {
  DOM.question.value = '';
  DOM.answer.value = '';
}
