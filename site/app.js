(() => {
  const { questions, roles, match } = TechQuiz;
  const main = document.querySelector('#main');
  let answers = [];
  let step = 0;
  function focusHeading() {
    const heading = main.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus();
    window.scrollTo(0, 0);
  }
  function showHome(focus = true) {
    answers = [];
    step = 0;
    document.title = 'Which tech job are you? | Wirral Council';
    main.innerHTML = `
      <div class="intro">
        <section>
          <p class="eyebrow">Weatherhead Careers Fair</p>
          <h1>Which tech job<br>are you?</h1>
          <p class="lead">Discover a job you could enjoy, and how you could help people in Wirral.</p>
          <ul class="facts"><li>6 questions</li><li>About 2 minutes</li></ul>
          <button class="button" id="start">Start the quiz <span aria-hidden="true">→</span></button>
          <p class="small intro-note">Just pick what sounds most like you.</p>
        </section>
        <aside class="intro-aside" aria-labelledby="tech-heading">
          <h2 id="tech-heading">Tech that helps people</h2>
          <p>At a council, technology is part of everyday life. You could help:</p>
          <ul><li>Make council services easier to use.</li><li>Keep libraries connected.</li><li>Protect people’s information.</li><li>Use data to improve local services.</li></ul>
        </aside>
      </div>`;
    main.querySelector('#start').addEventListener('click', () => showQuestion());
    if (focus) focusHeading();
  }
  function showQuestion() {
    const question = questions[step];
    document.title = `Question ${step + 1} of 6 | Which tech job are you?`;
    main.innerHTML = `
      <div class="question-top"><p>Question ${step + 1} of ${questions.length}</p><button class="text-button" id="restart">Start again</button></div>
      <div class="progress" aria-hidden="true"><span style="width: ${(step + 1) / questions.length * 100}%"></span></div>
      <form novalidate>
        <fieldset aria-describedby="question-hint">
          <legend><h1>${question.title}</h1></legend>
          <p class="hint" id="question-hint">Choose the one that sounds most like you.</p>
          <p class="error" id="answer-error" role="alert" hidden>Choose an answer to continue.</p>
          <div class="answers">${question.answers.map((answer, i) => `
            <label class="answer"><input type="radio" name="answer" value="${i}" ${answers[step] === i ? 'checked' : ''}><span>${answer.text}</span></label>`).join('')}</div>
        </fieldset>
        <div class="actions"><button class="button" type="submit">${step === questions.length - 1 ? 'See my match' : 'Continue'} <span aria-hidden="true">→</span></button><button class="text-button" type="button" id="back">Back</button></div>
      </form>`;
    main.querySelector('#restart').addEventListener('click', () => showHome());
    main.querySelector('#back').addEventListener('click', () => {
      if (step === 0) showHome();
      else { step--; showQuestion(); }
    });
    const form = main.querySelector('form');
    form.addEventListener('change', event => {
      answers[step] = Number(event.target.value);
      main.querySelector('#answer-error').hidden = true;
      main.querySelector('fieldset').classList.remove('invalid');
      main.querySelector('fieldset').setAttribute('aria-describedby', 'question-hint');
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (answers[step] === undefined) {
        main.querySelector('#answer-error').hidden = false;
        main.querySelector('fieldset').classList.add('invalid');
        main.querySelector('fieldset').setAttribute('aria-describedby', 'question-hint answer-error');
        main.querySelector('input').focus();
        return;
      }
      if (step < questions.length - 1) { step++; showQuestion(); }
      else showResult();
    });
    focusHeading();
  }
  function showResult() {
    const { main: role, alternatives } = match(answers);
    document.title = `${role.title} | Your tech job match`;
    main.innerHTML = `
      <div class="result-heading"><p>You could enjoy being a</p><h1>${role.title}</h1></div>
      <div class="result-grid">
        <section aria-label="About your match">
          <p>${role.description}</p>
          <h2>Why this could suit you</h2>
          <p>Your choices suggest you enjoy ${role.strength}. Those interests can help in this job.</p>
          <div class="example"><h2>At a council, you could...</h2><p>${role.example}</p></div>
        </section>
        <aside>
          <h2>You could also explore</h2>
          <ul class="alternatives">${alternatives.map(other => `<li><strong>${other.title}</strong>${other.short}</li>`).join('')}</ul>
        </aside>
      </div>
      <p class="result-note">This is a starting point. You can explore any of these jobs.</p>
      <p class="small">Want to remember your match? You can take a photo of this screen.</p>
      <div class="actions"><button class="button" id="next-person">Next person <span aria-hidden="true">→</span></button><button class="text-button" id="change">Change my answers</button></div>`;
    main.querySelector('#next-person').addEventListener('click', () => showHome());
    main.querySelector('#change').addEventListener('click', () => { step = 0; showQuestion(); });
    focusHeading();
  }
  document.querySelector('#copyright-year').textContent = new Date().getFullYear();
  showHome(false);
  // The cache contains only public site files. Answers stay in this closure.
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('./sw.js').catch(error => {
      console.warn('Offline cache registration failed.', error);
    });
  }
})();
