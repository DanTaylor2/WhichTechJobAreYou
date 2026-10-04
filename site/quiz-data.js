/* Each answer gives three points to its main role and one to a related role.
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
    { title: 'Your group is making a display for school. Which part would you choose?', answers: [
      a("Asking other pupils what they'd find interesting.", 'research', 'ux'),
      a('Arranging the words and pictures so the display is easy to follow.', 'ux', 'support'),
      a('Getting the lights, sound or moving parts working.', 'systems', 'dev'),
      a("Working out how everyone's pieces will fit into one display.", 'architect', 'systems')
    ] },
    { title: "You're trying out a new game with friends. What would you most enjoy?", answers: [
      a('Making up a new rule and testing how it changes the game.', 'dev', 'systems'),
      a('Comparing the scores to see whether any round is too hard.', 'data', 'ux'),
      a('Finding gaps in the rules that someone could use to cheat.', 'security', 'dev'),
      a("Helping someone who's stuck work out their next move.", 'support', 'research')
    ] },
    { title: 'Your class can suggest a school trip. Which part interests you most?', answers: [
      a('Making a guide so everyone can find the times and meeting places.', 'ux', 'support'),
      a("Asking classmates what they'd like to do and why.", 'research', 'ux'),
      a('Working out how the journey, activities and breaks fit into the day.', 'architect', 'systems'),
      a('Comparing costs and travel times to help choose a destination.', 'data', 'architect')
    ] },
    { title: "You're working on a group project. Which task would you pick?", answers: [
      a('Working out why a model or piece of equipment has stopped working.', 'systems', 'dev'),
      a("Helping a teammate through a step they're finding difficult.", 'support', 'research'),
      a("Checking that photos or personal details won't be shared with the wrong people.", 'security', 'architect'),
      a('Making a quiz where each answer sends the player to a different question.', 'dev', 'architect')
    ] },
    { title: "Imagine you're helping make an escape room challenge. What sounds most fun?", answers: [
      a('Creating a puzzle and trying it out to see whether it works.', 'dev', 'systems'),
      a('Changing the clues so players understand what they need to do.', 'ux', 'support'),
      a('Checking whether players could get the final answer without solving the clues.', 'security', 'dev'),
      a('Giving a stuck player a hint that helps them carry on.', 'support', 'ux')
    ] },
    { title: 'Your school is trying out lunchtime activities. Which job would you choose?', answers: [
      a('Talking to pupils about what they enjoyed and what put them off.', 'research', 'ux'),
      a('Looking at attendance numbers to spot which activities bring people back.', 'data', 'research'),
      a('Planning how activities can share rooms and equipment without clashing.', 'architect', 'systems'),
      a('Finding out why equipment keeps failing and trying a fix.', 'systems', 'data')
    ] }
  ];
  function match(answers) {
    if (answers.length !== questions.length || answers.some((answer, i) => !Number.isInteger(answer) || !questions[i].answers[answer])) {
      throw new Error('Complete all six questions before matching.');
    }
    const scores = Object.fromEntries(roles.map(role => [role.id, 0]));
    const primary = Object.fromEntries(roles.map(role => [role.id, 0]));
    answers.forEach((answer, i) => {
      const choice = questions[i].answers[answer];
      scores[choice.main] += 3;
      scores[choice.related] += 1;
      primary[choice.main]++;
    });
    // Rotate the final tie order using the answers, rather than always favouring
    // the first role. No randomness or personal information is needed.
    const offset = answers.reduce((value, answer) => value * 5 + answer + 1, 0) % roles.length;
    const ranked = [...roles].sort((left, right) => scores[right.id] - scores[left.id]
      || primary[right.id] - primary[left.id]
      || (roles.indexOf(left) + offset) % roles.length - (roles.indexOf(right) + offset) % roles.length);
    return { main: ranked[0], alternatives: ranked.slice(1, 3), scores };
  }
  return { roles, questions, match };
})();
