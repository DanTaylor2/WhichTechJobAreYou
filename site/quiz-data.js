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
    { title: 'Your group is organising a school event. Which part would you most enjoy?', answers: [
      a('Finding out what people want to do.', 'research', 'data'),
      a('Making the information clear and easy to follow.', 'ux', 'support'),
      a('Getting the equipment working.', 'systems', 'dev'),
      a('Planning how everything fits together.', 'architect', 'security')
    ] },
    { title: 'You are helping create a new game. What sounds most interesting?', answers: [
      a('Building a feature and trying it out.', 'dev', 'ux'),
      a('Looking at scores to see which levels need changing.', 'data', 'research'),
      a('Checking how to keep players’ accounts safe.', 'security', 'architect'),
      a('Helping a player who cannot get started.', 'support', 'systems')
    ] },
    { title: 'A club wants more people to join. What would you like to try?', answers: [
      a('Making a clearer poster or sign-up page.', 'ux', 'dev'),
      a('Asking people what would make them want to join.', 'research', 'support'),
      a('Planning how bookings, spaces and activities will work together.', 'architect', 'systems'),
      a('Comparing which activities have been most popular.', 'data', 'security')
    ] },
    { title: 'Your team is testing a new app. Which task would you pick?', answers: [
      a('Tracking down why it stops working on one device.', 'systems', 'architect'),
      a('Helping someone through a step they are stuck on.', 'support', 'research'),
      a('Checking that private messages stay private.', 'security', 'data'),
      a('Making a new feature work.', 'dev', 'ux')
    ] },
    { title: 'You have a free afternoon for a project. What would you choose?', answers: [
      a('Making a small interactive story or game.', 'dev', 'architect'),
      a('Trying different ways to make instructions easier to follow.', 'ux', 'research'),
      a('Exploring a puzzle where you need to spot something unusual.', 'security', 'systems'),
      a('Helping someone learn to use a tool or gadget.', 'support', 'data')
    ] },
    { title: 'At the end of a team project, what would feel most satisfying?', answers: [
      a('We understood what people actually needed.', 'research', 'ux'),
      a('We found a pattern that helped us make a decision.', 'data', 'dev'),
      a('All the different parts worked well together.', 'architect', 'support'),
      a('We fixed a tricky problem and kept things running.', 'systems', 'security')
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
