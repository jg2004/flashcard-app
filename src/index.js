import FlashCardController from './models/FlashCardController'
import UI from './models/UI'

const flashcardController = new FlashCardController();
const ui = new UI();

initializeEventListeners();

/* event listeners */
function initializeEventListeners() {

  /* filter flash card sets that contain search term */
  ui.searchText.addEventListener('input', (e) => {
    const flashcardSets = flashcardController.getFlashCardSets();
    const searchTerm = ui.searchText.value.trim().toLowerCase();
    const filteredFlashCards = flashcardSets.filter(flashcardSet => flashcardSet.title.toLowerCase().includes(searchTerm) || flashcardSet.subject.name.toLowerCase().includes(searchTerm))
    ui.resetQA()
    location.hash = ''
    ui.renderFlashcards(filteredFlashCards);
  })


  /* DOM content loaded listener */
  document.addEventListener('DOMContentLoaded', async () => {
    var elems = document.querySelectorAll('.modal');
    const modalInstance = M.Modal.init(elems, {});
    location.hash = '';
    ui.showProgressBar();
    await loadFlashcards();
    ui.hideProgressBar()
  });


  /* hash change listener. hash change occurs when flash card set link is clicked */
  window.addEventListener('hashchange', async () => {
    const id = location.hash.substring(1)
    if (id) {
      ui.showProgressBar()
      const flashcard = await flashcardController.loadFlashCard(id)
      initFlashCard(flashcard);
      renderQuestion();
      ui.hideProgressBar();
    } else {
      flashcardController.removeFlashCardQuestions();
      renderQuestion()
      ui.hideEditDeleteLinks();
    }
  });

  /* when edit link pressed, go to edit.html to edit flash card */
  ui.editLinkElement.addEventListener('click', () => {

    const id = location.hash.substring(1);
    if (!id) {
      console.log('no id provided')
      return
    }
    location.assign(`edit.html#${id}`);
  })
  ui.submitButton.addEventListener('click', async (e) => {

    const subjectElement = document.getElementById('subject');
    const titleElement = document.getElementById('title');
    const errorElement = document.getElementById('error-message');
    // get mdoal for adding flash card
    const elem = document.getElementById('modal1');
    var instance = M.Modal.getInstance(elem);

    errorElement.classList.add('hide');
    if (!subjectElement.value || !titleElement.value) {
      errorElement.classList.remove('hide');
      return
    }
    await flashcardController.saveFlashcard({ subject: subjectElement.value, title: titleElement.value });
    subjectElement.value = '';
    titleElement.value = '';
    instance.close();
    loadFlashcards();
  })

  /* Delete the currently selected flashcard set */
  ui.deleteButton.addEventListener('click', async (e) => {
    const elem = document.getElementById('modal2');
    const instance = M.Modal.getInstance(elem);
    const id = location.hash.substring(1);
    if (!id) {
      console.log('no id provided')
    }
    console.log('deleting flash card!', id);
    const response = await flashcardController.deleteFlashcardSet(id);
    loadFlashcards();
    instance.close();
  })

  ui.flashcardElement.addEventListener('click', (e) => {
    ui.showEditDeleteLinks();
  })

  ui.showElement.addEventListener('click', () => {
    ui.toggleAnswer();
  });

  ui.nextElement.addEventListener('click', () => {
    flashcardController.incrementQuestion();
    ui.renderTitle(flashcardController.getFlashCard().title, flashcardController.currentQuestion + 1)
    renderQuestion();
  })

  ui.prevElement.addEventListener('click', () => {
    flashcardController.decrementQuestion();
    ui.renderTitle(flashcardController.getFlashCard().title, flashcardController.currentQuestion + 1)
    renderQuestion()
  })
}

/* private functions */

async function loadFlashcards() {
  const flashcards = await flashcardController.loadFlashCardSets();
  console.log(flashcards)
  //ui.resetFlashCardTitle();
  ui.resetQA();
  ui.renderFlashcards(flashcards);
  ui.disableButtons()
}

function initFlashCard(flashcard) {
  ui.resetQA();

  if (flashcard.questions.length === 0) {
    ui.renderTitle(flashcard.title, 0)
  } else {
    ui.renderTitle(flashcard.title, flashcardController.currentQuestion + 1)
  }
  ui.enableButtons();
  ui.showEditDeleteLinks();
}
function renderQuestion() {

  ui.renderQuestion(flashcardController.questions, flashcardController.currentQuestion)

  //disable next button if last question
  if (flashcardController.currentQuestion >= flashcardController.questions.length - 1) {
    ui.nextElement.setAttribute('disabled', true)
  } else {
    ui.nextElement.removeAttribute('disabled')
  }

  //disable prev button if first question
  if (flashcardController.currentQuestion === 0) {
    ui.prevElement.setAttribute('disabled', true)
  } else {
    ui.prevElement.removeAttribute('disabled')
  }
}