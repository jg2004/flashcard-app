export default class UI {
  constructor() {
    this.flashcardElement = document.getElementById('flashcards');
    this.questionElement = document.getElementById('question');
    this.answerElement = document.getElementById('answer');
    this.showElement = document.getElementById('show');
    this.nextElement = document.getElementById('next');
    this.prevElement = document.getElementById('prev');
    this.flashCardTitle = document.getElementById('flashcard-title');
    this.editLinkElement = document.getElementById('edit-link');
    this.deleteLinkElement = document.getElementById('delete-link');
    this.submitButton = document.getElementById('submit-button');
    this.flashcardsTitle = document.getElementById('flashcards-title');
    this.progressBar = document.getElementById('progress-bar');
    this.searchText = document.getElementById('search-text');
    this.deleteButton = document.getElementById('delete-flashcard-set-button');
  }

  showProgressBar() {
    this.progressBar.classList.remove('hide');
  }
  hideProgressBar() {
    this.progressBar.classList.add('hide');
  }

  showEditDeleteLinks() {
    this.editLinkElement.classList.remove('hide');
    this.deleteLinkElement.classList.remove('hide');
  }
  hideEditDeleteLinks() {
    this.editLinkElement.classList.add('hide');
    this.deleteLinkElement.classList.add('hide');
  }

  disableButtons() {
    console.log('disabling buttons');
    this.showElement.setAttribute('disabled', true)
    this.nextElement.setAttribute('disabled', true)
    this.prevElement.setAttribute('disabled', true)
  }

  enableButtons() {
    console.log('enabling buttons')
    this.showElement.removeAttribute('disabled')
    this.nextElement.removeAttribute('disabled')
    this.prevElement.removeAttribute('disabled')
  }

  renderFlashcards(flashcards) {

    this.flashcardsTitle.textContent = `FlashCard Sets (${flashcards.length})`
    this.flashcardElement.innerHTML = ''
    if (flashcards) {
      flashcards.forEach(flashcard => {
        this.flashcardElement.appendChild(this.createLink(flashcard));
      })
    }
  }

  resetQA() {
    this.flashCardTitle.textContent = "Questions"
    this.questionElement.textContent = ''
    this.answerElement.textContent = ''
    this.hideEditDeleteLinks();
  }

  renderQuestion(questions, number) {
    if (questions.length > 0) {
      this.questionElement.textContent = questions[number].question
      this.answerElement.textContent = questions[number].answer
    } else {
      this.questionElement.textContent = 'NO questions in flash card!'
    }
    this.hideAnswer()
  }

  /* Private methods */
  createLink(flashcard) {
    const linkElement = document.createElement('a');
    linkElement.href = `#${flashcard._id}`
    linkElement.textContent = `${flashcard.title} (${flashcard.subject.name}) - ${flashcard.questions.length}`;
    linkElement.classList.add("collection-item")
    return linkElement;
  }

  toggleAnswer() {
    if (this.showElement.textContent === 'show') {
      this.answerElement.classList.remove('white-text')
      this.showElement.textContent = 'hide'

    } else {
      this.answerElement.classList.add('white-text')
      this.showElement.textContent = 'show'
    }
  }

  hideAnswer() {
    this.answerElement.classList.add('white-text')
    this.showElement.textContent = 'show'
  }

  renderTitle(title, currentQuestion) {
    console.log('test',currentQuestion)
    this.flashCardTitle.textContent = `${title} questions (${currentQuestion})`
  }
}