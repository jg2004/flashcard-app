export default class FlashCardController {

  constructor() {
    this.baseUrl = 'https://flashcard-2018.herokuapp.com/api/'
    this.flashcardsUrl = `${this.baseUrl}flashcards`
    this.subjectsUrl = `${this.baseUrl}subjects`
    this.questions = [];
    this.currentQuestion = 0;
    this.flashcardSets = [];
    this.flashcard = {};
  }

  getFlashCardSets() {
    return this.flashcardSets;
  }

  incrementQuestion() {
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    }
  }

  decrementQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }
  async loadFlashCardSets() {
    const response = await fetch(this.flashcardsUrl);
    this.flashcardSets = await response.json();
    return this.flashcardSets;
  }

  async saveFlashcard(data) {

    const response = await fetch(this.flashcardsUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log('data', data);
    console.log(response);
    //return await response.json();
  }

  async deleteFlashcardSet(id) {
    return await fetch(`${this.flashcardsUrl}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' }
    })
  }

  async getSubjects() {
    const response = await fetch(this.subjectsUrl);
    return await response.json();
  }

  removeFlashCardQuestions() {
    this.questions = [];
    this.currentQuestion = 0;
  }

  getFlashCard() {
    return this.flashcard;
  }

  async loadFlashCard(id) {
    if (id) {
      const response = await fetch(`${this.flashcardsUrl}/${id}`);
      const flashcard = await response.json();
      this.flashcard = flashcard;
      console.log(flashcard)
      this.questions = flashcard.questions;
      this.currentQuestion = 0;
      console.log('questions', this.questions)
      return flashcard;

    } else {
      console.log('no id provided', id)
    }
  }
}