/* Each scored answer gives three points to its main role and one to a related role.
   Not sure answers give no points.
   Every role is a main role exactly three times across the six questions. */
globalThis.TechQuiz = (() => {
  const roles = [
  {
    "id": "ux",
    "title": "UX designer",
    "short": "Make websites easy to use.",
    "description": "UX stands for user experience. A UX designer makes websites and apps easy to use. They test ideas with people to see what works best.",
    "example": "Design council web pages and online forms so people can find what they need and ask for help. Try out new designs with local people and council staff.",
    "ask": "How do you check whether a website is easy to use?",
    "strength": "making things clear and easy to use",
    "image": "./images/ux.jpg",
    "imageAlt": "Two people planning ideas with sticky notes on a board.",
    "explanationHeading": "What is a UX designer?"
  },
  {
    "id": "research",
    "title": "User researcher",
    "short": "Find out what people need.",
    "description": "A user researcher asks people about their needs. They watch people try a website or app. This helps the team find ways to make it better.",
    "example": "Talk to local people and council staff about how they use council services. Find out what causes problems, then share what you learn to help teams make things easier.",
    "ask": "How do you find out what residents need?",
    "strength": "listening to people and learning what they need",
    "image": "./images/research.jpg",
    "imageAlt": "A group talking together around a laptop.",
    "explanationHeading": "What is a user researcher?"
  },
  {
    "id": "dev",
    "title": "Software developer",
    "short": "Build websites and apps.",
    "description": "A software developer builds websites and apps. They write code, which is a set of steps for a computer to follow. They test it and fix mistakes.",
    "example": "Build and update online services for local people and tools for council staff. Test new features and fix problems so people can get things done.",
    "ask": "What is something you have built that helps people?",
    "strength": "building things and testing ideas",
    "image": "./images/dev.jpg",
    "imageAlt": "A person typing code on a laptop with another screen nearby.",
    "explanationHeading": "What is a software developer?"
  },
  {
    "id": "data",
    "title": "Data analyst",
    "short": "Use facts and numbers to find answers.",
    "description": "A data analyst looks at facts and numbers to find patterns. They use charts to show what they find. This helps people decide what to do next.",
    "example": "Look at information from across the council to see which services people need and how well they work. Make charts and reports to help teams plan their work and spending.",
    "ask": "What can data tell you about how to improve a service?",
    "strength": "spotting patterns and using facts",
    "image": "./images/data.jpg",
    "imageAlt": "Two people looking at charts on paper and a laptop.",
    "explanationHeading": "What is a data analyst?"
  },
  {
    "id": "security",
    "title": "Cyber security analyst",
    "short": "Keep computers and information safe.",
    "description": "A cyber security analyst helps keep computers and information safe. They look for signs of trouble, like someone trying to break into an account. They help stop these attacks.",
    "example": "Check council computers for signs of online attacks and look into warnings. Help staff spot scam emails and keep information about local people safe.",
    "ask": "How do you spot when something might be unsafe?",
    "strength": "checking things carefully and spotting danger",
    "image": "./images/security.jpg",
    "imageAlt": "A laptop screen with the words Cyber Security.",
    "explanationHeading": "What is a cyber security analyst?"
  },
  {
    "id": "architect",
    "title": "Technical architect",
    "short": "Plan how computer tools work together.",
    "description": "A technical architect plans how computer tools will work together. They choose the parts a team needs and show how to link them up.",
    "example": "Work with council teams to plan new computer tools and choose which ones to use. Make sure they work with the tools the council already has and can meet future needs.",
    "ask": "How do you decide which pieces of technology will work together?",
    "strength": "planning and seeing how things fit together",
    "image": "./images/architect.jpg",
    "imageAlt": "A team planning together using boards in an office.",
    "explanationHeading": "What is a technical architect?"
  },
  {
    "id": "systems",
    "title": "Systems engineer",
    "short": "Keep computers working.",
    "description": "A systems engineer sets up computers and keeps them working. They also look after the links between computers. When something breaks, they find out why and fix it.",
    "example": "Look after the computers and connections that council teams rely on. Install updates, keep backup copies of important files and fix faults so services can keep running.",
    "ask": "How do you work out why a system has stopped working?",
    "strength": "finding out how things work and fixing problems",
    "image": "./images/systems.jpg",
    "imageAlt": "A person working at a computer beside racks of computer equipment.",
    "explanationHeading": "What is a systems engineer?"
  },
  {
    "id": "support",
    "title": "IT support technician",
    "short": "Help people fix computer problems.",
    "description": "IT means information technology, such as computers and apps. An IT support technician helps people when these stop working. They ask questions and show people how to fix the problem.",
    "example": "Help council staff with problems on their laptops, phones and apps. Set up equipment for new staff and show people how to use it.",
    "ask": "How do you help someone who is stuck with a computer problem?",
    "strength": "helping people and explaining things",
    "image": "./images/support.jpg",
    "imageAlt": "A person wearing a headset and talking while using a computer.",
    "explanationHeading": "What is an IT support technician?"
  }
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
