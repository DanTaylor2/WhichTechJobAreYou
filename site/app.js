(() => {
  const { questions, roles, match } = TechQuiz;
  const main = document.querySelector('#main');
  const avatars = [
    ['coffee', 'Office worker holding a coffee mug'],
    ['plant', 'Office worker holding a plant'],
    ['headphones', 'Office worker wearing headphones'],
    ['stationery', 'Office worker holding colourful pencils'],
    ['planner', 'Office worker holding a planner'],
    ['hoodie', 'Office worker wearing a blue hoodie'],
    ['smart', 'Office worker wearing a smart blazer'],
    ['snacks', 'Office worker offering snacks'],
    ['multitasker', 'Office worker holding a phone and folders']
  ];
  const totalSteps = questions.length + 1;
  let avatar;
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
    avatar = undefined;
    step = 0;
    document.title = 'Which tech job are you? | Wirral Council';
    main.innerHTML = `
      <div class="intro">
        <section>
          <p class="eyebrow">Weatherhead Careers Fair</p>
          <h1>Which tech job<br>are you?</h1>
          <p class="lead">Discover a job you could enjoy, and how you could help people in Wirral.</p>
          <ul class="facts"><li>${totalSteps} questions</li><li>About 2 minutes</li></ul>
          <button class="button" id="start">Start the quiz <span aria-hidden="true">→</span></button>
        </section>
      </div>`;
    main.querySelector('#start').addEventListener('click', () => showQuestion());
    if (focus) focusHeading();
  }
  function avatarPortrait(className = '') {
    if (avatar === undefined) return '';
    return `<img class="chosen-avatar ${className}" src="images/avatar-${avatars[avatar][0]}.png" alt="Your avatar: ${avatars[avatar][1]}" width="64" height="64">`;
  }
  function showQuestion() {
    const choosingAvatar = step === 0;
    const answerIndex = step - 1;
    const question = questions[answerIndex];
    const selected = choosingAvatar ? avatar : answers[answerIndex];
    document.title = `Question ${step + 1} of ${totalSteps} | Which tech job are you?`;
    main.innerHTML = `
      <div class="question-top"><p>Question ${step + 1} of ${totalSteps}</p>${choosingAvatar ? '' : avatarPortrait()}<button class="text-button" id="restart">Start again</button></div>
      <div class="progress" aria-hidden="true"><span style="width: ${(step + 1) / totalSteps * 100}%"></span></div>
      <form novalidate>
        <fieldset>
          <legend><h1>${choosingAvatar ? 'Choose your avatar' : question.title}</h1></legend>
          <p class="error" id="answer-error" role="alert" hidden>Choose ${choosingAvatar ? 'an avatar' : 'an answer'} to continue.</p>
          <div class="answers ${choosingAvatar ? 'avatar-options' : ''}">${choosingAvatar
            ? avatars.map(([id, label], i) => `
              <label class="answer avatar-option"><input type="radio" name="answer" value="${i}" aria-label="${label}" ${selected === i ? 'checked' : ''}><img src="images/avatar-${id}.png" alt="" width="128" height="128"></label>`).join('')
            : question.answers.map((answer, i) => `
              <label class="answer"><input type="radio" name="answer" value="${i}" ${selected === i ? 'checked' : ''}><span>${answer.text}</span></label>`).join('')}</div>
        </fieldset>
        <div class="actions"><button class="button" type="submit">${step === totalSteps - 1 ? 'See my match' : 'Continue'} <span aria-hidden="true">→</span></button><button class="text-button" type="button" id="back">Back</button></div>
      </form>`;
    main.querySelector('#restart').addEventListener('click', () => showHome());
    main.querySelector('#back').addEventListener('click', () => {
      if (step === 0) showHome();
      else { step--; showQuestion(); }
    });
    const form = main.querySelector('form');
    form.addEventListener('change', event => {
      if (choosingAvatar) avatar = Number(event.target.value);
      else answers[answerIndex] = Number(event.target.value);
      main.querySelector('#answer-error').hidden = true;
      main.querySelector('fieldset').classList.remove('invalid');
      main.querySelector('fieldset').removeAttribute('aria-describedby');
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if ((choosingAvatar ? avatar : answers[answerIndex]) === undefined) {
        main.querySelector('#answer-error').hidden = false;
        main.querySelector('fieldset').classList.add('invalid');
        main.querySelector('fieldset').setAttribute('aria-describedby', 'answer-error');
        main.querySelector('input').focus();
        return;
      }
      if (step < totalSteps - 1) { step++; showQuestion(); }
      else showResult();
    });
    focusHeading();
  }
  function showResult() {
    const { main: role, alternatives } = match(answers);
    document.title = role ? `${role.title} | Your tech job match` : 'Explore tech jobs | Wirral Council';
    main.innerHTML = avatarPortrait('result-avatar') + (role ? `
      <div class="result-heading"><p>You could enjoy being a</p><h1>${role.title}</h1></div>
      <div class="result-grid">
        <section aria-label="About your match">
          <h2>${role.explanationHeading}</h2>
          <p>${role.description}</p>
          <h2>Why this could suit you</h2>
          <p>Your answers show you might like ${role.strength}. This could help you in this job.</p>
          <div class="example"><h2>At Wirral Council, you could...</h2><p>${role.example}</p></div>
        </section>
        <aside>
          <img class="job-photo" src="${role.image}" alt="${role.imageAlt}" width="800" height="450">
          <h2>Other jobs you might like</h2>
          <ul class="alternatives">${alternatives.map(other => `<li><strong>${other.title}</strong>${other.short}</li>`).join('')}</ul>
        </aside>
      </div>
      <p class="result-note">This is just one idea. You can try any of these jobs.</p>
      <p class="career-link">Learn more about this job and other jobs on the <a href="https://nationalcareers.service.gov.uk/explore-careers">National Careers Service</a>.</p>` : `
      <h1>Explore tech jobs</h1>
      <p>You chose “Not sure yet” each time. That's OK! We need to know more to suggest a job.</p>
      <p>Look at these jobs, or change your answers to find one you might like.</p>
      <ul class="alternatives">${roles.map(other => `<li><strong>${other.title}</strong>${other.short}</li>`).join('')}</ul>
      `) + `
      <div class="actions"><button class="button" id="finish">Finish</button><button class="text-button" id="change">Change my answers</button></div>`;
    main.querySelector('#finish').addEventListener('click', () => showHome());
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
