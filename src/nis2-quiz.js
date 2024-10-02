class NIS2Quiz extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.currentQuestion = 0;
    this.showResult = false;
    this.result = '';
    this.explanation = '';
  }

  connectedCallback() {
    this.fetchQuizData().then(quizData => {
      this.quizData = quizData;
      this.render();
    });
  }

  async fetchQuizData() {
    const response = await fetch('./data/quizData.json');
    return response.json();
  }

  handleAnswerClick(nextQuestion, result, explanation) {
    if (result) {
      this.result = result;
      this.explanation = explanation || '';
      this.showResult = true;
    } else if (nextQuestion) {
      this.currentQuestion = nextQuestion - 1;
    }
    this.render();
  }

  render() {
    if (!this.quizData) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .question-section, .result-section {
          margin-bottom: 20px;
        }
        .question-count {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .question-text {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .answer-section {
          display: flex;
          flex-direction: column;
        }
        button {
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
        }
        button:hover {
          background-color: #45a049;
        }
        .explanation {
          font-style: italic;
          margin-top: 10px;
        }
      </style>
      ${this.showResult ? this.renderResult() : this.renderQuestion()}
    `;

    this.shadowRoot.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const nextQuestion = button.dataset.nextQuestion;
        const result = button.dataset.result;
        const explanation = button.dataset.explanation;
        this.handleAnswerClick(nextQuestion, result, explanation);
      });
    });
  }

  renderQuestion() {
    const question = this.quizData.questions[this.currentQuestion];
    return `
      <div class="question-section">
        <div class="question-count">
          <span>Question ${this.currentQuestion + 1}</span>
        </div>
        <div class="question-text">${question.text}</div>
      </div>
      <div class="answer-section">
        ${question.options.map((option, index) => `
          <button 
            data-next-question="${option.nextQuestion || ''}"
            data-result="${option.result || ''}"
            data-explanation="${option.explanation || ''}"
          >
            ${option.text}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderResult() {
    return `
      <div class="result-section">
        <h2>Result</h2>
        <p>${this.result}</p>
        ${this.explanation ? `<p class="explanation">${this.explanation}</p>` : ''}
      </div>
    `;
  }
}

customElements.define('nis2-quiz', NIS2Quiz);