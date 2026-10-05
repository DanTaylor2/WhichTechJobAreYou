/* Each scored answer gives three points to its main role and one to a related role.
   Not sure answers give no points.
   Every role is a main role exactly three times across the six questions. */
globalThis.TechQuiz = (() => {
  const roles = [
    { id: 'ux', title: 'UX designer', short: 'Make services clear and easy to use.', description: 'A user experience designer makes websites and services easier for people to use. They try out ideas and improve them using feedback.', example: 'Make it easier for residents to report a broken streetlight on a council website.', ask: 'How do you check whether a website is easy to use?', strength: 'making things clear and easy to use' },
    { id: 'research', title: 'User researcher', short: 'Find out what people need.', description: 'A user researcher listens to people and watches how they use services. Their findings help a team solve the right problems.', example: 'Talk to residents about what makes booking a library computer difficult.', ask: 'How do you find out what residents need?', strength: 'listening and understanding people' },
    { id: 'dev', title: 'Software developer', short: 'Build useful things with code.', description: 'A software developer writes and tests code that makes websites and apps work. They turn an idea into something people can use.', example: 'Build a tool that helps residents find their bin collection day.', ask: 'What is something you have built that helps people?', strength: 'building things and trying out ideas' },
    { id: 'data', title: 'Data analyst', short: 'Find patterns that help people decide.', description: 'A data analyst explores information, spots patterns and explains what they mean. Their work helps teams make better decisions.', example: 'Look at library visit numbers to help plan when activities should run.', ask: 'What can data tell you about how to improve a service?', strength: 'spotting patterns and using evidence' },
    { id: 'security', title: 'Cyber security analyst', short: 'Help keep information and services safe.', description: 'A cyber security analyst looks for risks and helps protect computer systems. They investigate unusual activity and help people work safely.', example: 'Help protect residents’ information and spot suspicious sign-ins to council systems.', ask: 'How do you spot when something might be unsafe?', strength: 'checking carefully and thinking about risks' },
    { id: 'architect', title: 'Technical architect', short: 'Plan how technology fits together.', description: 'A technical architect plans how different systems will work together. They help a team choose technology that meets people’s needs.', example: 'Plan how an online council form sends a request to the team who can help.', ask: 'How do you decide which pieces of technology will work together?', strength: 'planning and seeing how things connect' },
    { id: 'systems', title: 'Systems engineer', short: 'Keep the technology running.', description: 'A systems engineer sets up and maintains the computers, networks and systems people rely on. They investigate problems and make things more reliable.', example: 'Keep library computers and their network working so residents can get online.', ask: 'How do you work out why a system has stopped working?', strength: 'working out how things work and fixing problems' },
    { id: 'support', title: 'IT support technician', short: 'Help people get back up and running.', description: 'An IT support technician helps people solve everyday computer problems. They ask questions, explain clearly and find practical fixes.', example: 'Help a council worker get back into their account so they can respond to residents.', ask: 'How do you help someone who is stuck with a computer problem?', strength: 'helping people and explaining things' }
  ];
  const a = (text, main, related) => ({ text, main, related });
  const questions = [
    { title: 'Your group is making a display about keeping the school clean. Which job would you choose?', answers: [
      a("Ask pupils what they'd like to know 🗣️", 'research', 'ux'),
      a('Arrange words and pictures so they are clear 🎨', 'ux', 'support'),
      a('Set up the lights or sound 🔧', 'systems', 'dev'),
      a('Plan how all the parts fit together 🧩', 'architect', 'systems'),
      { text: 'Not sure yet 🤔', unsure: true }
    ] },
    { title: "You're trying a new board game with friends. Which job would you choose to help make it better?", answers: [
      a('Invent and test a new rule 💡', 'dev', 'systems'),
      a('Compare scores to spot tricky rounds 📊', 'data', 'ux'),
      a('Check how someone might cheat 🔒', 'security', 'dev'),
      a('Help a friend who is stuck 🙋', 'support', 'research'),
      { text: 'Not sure yet 🤔', unsure: true }
    ] },
    { title: 'Your class is choosing a school trip. Which job would help the class pick and plan it?', answers: [
      a('Make a clear trip guide 🗺️', 'ux', 'support'),
      a("Ask classmates what they'd enjoy 🗣️", 'research', 'ux'),
      a('Plan the journey and stops 🧩', 'architect', 'systems'),
      a('Compare prices and travel times 📊', 'data', 'architect'),
      { text: 'Not sure yet 🤔', unsure: true }
    ] },
    { title: "Your group is making a model for a class project. Which job would you choose?", answers: [
      a('Find out why a part has stopped working 🔧', 'systems', 'dev'),
      a('Help a teammate with a tricky step 🙋', 'support', 'research'),
      a('Keep photos and names private 🔒', 'security', 'architect'),
      a('Make a quiz that works 💻', 'dev', 'architect'),
      { text: 'Not sure yet 🤔', unsure: true }
    ] },
    { title: "Your class is making a simple escape room with clues and puzzles. Which job sounds fun?", answers: [
      a('Make and test a puzzle 💡', 'dev', 'systems'),
      a('Make the clues easy to follow 🎨', 'ux', 'support'),
      a('Check if a clue can be skipped 🔒', 'security', 'dev'),
      a('Give a helpful hint 🙋', 'support', 'ux'),
      { text: 'Not sure yet 🤔', unsure: true }
    ] },
    { title: 'Your school is planning lunchtime clubs. Which job would help the clubs run well?', answers: [
      a('Ask pupils what they enjoy 🗣️', 'research', 'ux'),
      a('Check which clubs are most popular 📊', 'data', 'research'),
      a('Plan rooms and equipment 🧩', 'architect', 'systems'),
      a('Fix equipment that stops working 🔧', 'systems', 'data'),
      { text: 'Not sure yet 🤔', unsure: true }
    ] }
  ];
  function match(answers) {
    if (!Array.isArray(answers) || answers.length !== questions.length || questions.some((question, i) => !Number.isInteger(answers[i]) || !question.answers[answers[i]])) {
      throw new Error('Complete all six questions before matching.');
    }
    const scores = Object.fromEntries(roles.map(role => [role.id, 0]));
    const primary = Object.fromEntries(roles.map(role => [role.id, 0]));
    answers.forEach((answer, i) => {
      const choice = questions[i].answers[answer];
      if (choice.unsure) return;
      scores[choice.main] += 3;
      scores[choice.related] += 1;
      primary[choice.main]++;
    });
    // Rotate the final tie order using the answers, rather than always favouring
    // the first role. No randomness or personal information is needed.
    const offset = answers.reduce((value, answer, i) => questions[i].answers[answer].unsure
      ? value : value * 5 + answer + 1, 0) % roles.length;
    const ranked = roles.filter(role => scores[role.id] > 0).sort((left, right) => scores[right.id] - scores[left.id]
      || primary[right.id] - primary[left.id]
      || (roles.indexOf(left) + offset) % roles.length - (roles.indexOf(right) + offset) % roles.length);
    return { main: ranked[0] ?? null, alternatives: ranked.slice(1, 3), scores };
  }
  return { roles, questions, match };
})();
