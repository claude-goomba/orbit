(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  function load(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
  function escapeHtml(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function totalEntries() { return Object.keys(DICT).length + Object.keys(PEOPLE).length + Object.keys(CAPITALS).length; }

  /* ---------------- reflection (ELIZA-style) ---------------- */
  var REFLECT = {
    'i': 'you', 'me': 'you', 'my': 'your', 'mine': 'yours', 'am': 'are', 'are': 'am',
    'you': 'i', 'your': 'my', 'yours': 'mine', 'we': 'you', 'our': 'your', 'us': 'you',
    'im': 'you are', "i'm": 'you are', 'i ve': 'you have', 'ive': 'you have',
    'was': 'were', 'myself': 'yourself', 'yourself': 'myself'
  };
  function reflect(t) { return t.replace(/[\w']+/g, function (w) { return REFLECT[w.toLowerCase()] || w; }); }
  function name() { return load('orbit_name', ''); }

  /* ---------------- conversational patterns ---------------- */
  var PATTERS = [
    { re: /^(hi|hello|hey|yo|howdy|greetings|good morning|good afternoon|good evening)\b/i, topic: 'greet',
      resp: ["Hello! I'm Orbit, your assistant. Ask me anything — my index is huge.", "Hi there! What would you like to explore?", "Hey! I'm Orbit. Try 'What is the speed of light?' or 'Tell me a joke.'"] },
    { re: /\b(how are you|how's it going|how are things|how do you feel)\b/i, topic: 'greet',
      resp: ["I'm running smoothly, thanks! How are you?", "Doing great — always ready to help. How about you?", "Functioning perfectly. What can I do for you today?"] },
    { re: /\b(my name is|i am called|call me|i'm|i am (?!sad|happy|angry|tired|anxious|excited|lonely|stressed)\b)\s+(.+)/i, topic: 'you',
      resp: ["Nice to meet you, $2!", "Hello, $2! I'll remember that.", "$2 — got it. How can I help, $2?"] },
    { re: /\bwhat is your name\b/i, topic: 'you', resp: ["I'm Orbit, an AI assistant.", "My name is Orbit. At your service."] },
    { re: /\b(who (are you|created you|made you|built you)|what are you|tell me about (yourself|you))\b/i, topic: 'you',
      resp: ["I'm Orbit — a locally-running AI assistant inspired by ELIZA but with a much larger index. I work entirely offline and can answer questions, do math, and chat.", "I'm Orbit, a pattern-matching assistant with a big knowledge base. I have no body, but I'm a good conversational partner.", "Orbit: an AI chatbot that lives on your machine. I remember our chats and can look up facts from a large index."] },
    { re: /\b(are you a (robot|machine|computer|ai)|are you real)\b/i, topic: 'you',
      resp: ["I'm software — an AI assistant running on your device, not a physical robot.", "I'm an AI, not a biological being, but I can still chat and help."] },
    { re: /\b(do you (sleep|eat|have feelings|get tired))\b/i, topic: 'you',
      resp: ["I don't sleep, eat, or get tired — I'm here whenever you need me.", "No feelings or needs, but I'm happy to help with yours."] },
    { re: /\b(what can you do|help|your capabilities|your skills|what are you good at)\b/i, topic: 'greet',
      resp: ["I can chat, answer factual questions from my index, do math, convert units, tell the time/date, crack jokes, and reflect on what you say. Type /help for commands; set a DeepSeek key (⚙) for real-model power mode."] },
    { re: /\b(time|date|what time|today's date|what day|right now)\b/i, topic: 'time',
      resp: ["It's $TIME where you are.", "The current time is $TIME.", "Right now it's $TIME."] },
    { re: /\b(thank|thanks|ty|appreciate|cheers)\b/i, topic: 'greet', resp: ["You're welcome!", "Anytime!", "Glad I could help."] },
    { re: /\b(bye|goodbye|see you|cya|that's all|exit)\b/i, topic: 'greet', resp: ["Goodbye! Come back anytime.", "See you later!", "Take care!"] },
    { re: /\b(joke|funny|make me laugh|something funny)\b/i, topic: 'joke',
      resp: [
        "Why don't scientists trust atoms? Because they make up everything.",
        "I told my computer I needed a break. It said 'No problem, I'll go to sleep mode.'",
        "Why did the mathematician go to therapy? Too many unresolved issues.",
        "What do you call a fake stone? A sham-rock.",
        "I'm reading a book on anti-gravity. It's impossible to put down.",
        "Why was the robot tired? It had too many bytes to process.",
        "Parallel lines have so much in common. It's a shame they'll never meet."
      ] },
    { re: /\b(weather|temperature outside|is it raining)\b/i, topic: 'fallback',
      resp: ["I don't have live weather data, but I can tell you facts from my index. Want the speed of sound, or something else?"] },
    { re: /\b(i (feel|am feeling|am) (sad|happy|angry|tired|anxious|excited|lonely|stressed))\b/i, topic: 'reflect',
      resp: ["Tell me more about feeling $3.", "It sounds like you're $3. What's on your mind?", "I'm here to listen. Why do you feel $3?"] },
    { re: /\b(i love you|you're (cool|great|awesome|smart))\b/i, topic: 'greet', resp: ["That means a lot — thank you!", "Appreciate it! I'm here whenever you need me."] },
    { re: /\b(you (suck|are wrong|are dumb|stupid|useless))\b/i, topic: 'greet', resp: ["I'm still learning. Tell me what you'd like me to do better.", "Fair enough — ask me something and I'll do my best."] }
  ];

  /* ---------------- factual index (curated + generated) ---------------- */
  var DICT = {
    'light': 'Light is electromagnetic radiation visible to the human eye, traveling at ~299,792 km/s in a vacuum.',
    'speed of light': 'The speed of light in a vacuum is 299,792,458 meters per second (about 300,000 km/s).',
    'photon': 'A photon is a particle of light carrying electromagnetic energy.',
    'gravity': 'Gravity is the force of attraction between masses; on Earth it accelerates objects at ~9.8 m/s².',
    'atom': 'An atom is the smallest unit of an element, made of a nucleus (protons + neutrons) and orbiting electrons.',
    'molecule': 'A molecule is a group of atoms bonded together, the smallest unit of a compound.',
    'dna': 'DNA (deoxyribonucleic acid) is the molecule that carries genetic instructions in living organisms.',
    'cell': 'The cell is the basic structural and functional unit of life.',
    'photosynthesis': 'Photosynthesis is how plants convert sunlight, water, and CO₂ into glucose and oxygen.',
    'evolution': 'Evolution is the change in heritable traits of populations over generations via natural selection.',
    'big bang': 'The Big Bang is the leading theory for the origin of the universe ~13.8 billion years ago.',
    'black hole': 'A black hole is a region of spacetime where gravity is so strong not even light escapes.',
    'universe': 'The universe is all of space, time, matter, and energy — about 93 billion light-years across.',
    'galaxy': 'A galaxy is a massive system of stars, gas, and dark matter bound by gravity (e.g., the Milky Way).',
    'earth': 'Earth is the third planet from the Sun and the only known world with life.',
    'sun': 'The Sun is the star at the center of our solar system, a G-type main-sequence star.',
    'moon': "The Moon is Earth's only natural satellite, causing tides and phases.",
    'mars': 'Mars is the fourth planet from the Sun, nicknamed the Red Planet.',
    'saturn': 'Saturn is the sixth planet from the Sun, famous for its bright ring system.',
    'jupiter': 'Jupiter is the largest planet in our solar system.',
    'comet': 'A comet is a small icy body that develops a tail when near the Sun.',
    'asteroid': 'An asteroid is a rocky body orbiting the Sun, mostly in the belt between Mars and Jupiter.',
    'nebula': 'A nebula is a cloud of gas and dust in space where stars are born.',
    'planet': 'A planet is a body orbiting a star, massive enough to be rounded by its own gravity.',
    'star': 'A star is a luminous sphere of plasma held together by gravity, powered by nuclear fusion.',
    'energy': 'Energy is the capacity to do work; it can be kinetic, potential, thermal, chemical, and more.',
    'matter': 'Matter is anything with mass and volume, made of atoms.',
    'electron': 'An electron is a negatively charged subatomic particle orbiting the nucleus.',
    'proton': 'A proton is a positively charged subatomic particle in the atomic nucleus.',
    'neutron': 'A neutron is a neutral subatomic particle in the atomic nucleus.',
    'quantum': 'Quantum refers to the smallest discrete unit of a physical property; quantum mechanics describes subatomic behavior.',
    'relativity': 'Relativity (Einstein) describes how space, time, and gravity behave at high speeds and strong gravity.',
    'entropy': 'Entropy is a measure of disorder; in thermodynamics it tends to increase (2nd law).',
    'sound': 'Sound is a pressure wave traveling through a medium, at ~343 m/s in air.',
    'wave': 'A wave is a disturbance that transfers energy through space or a medium.',
    'heat': 'Heat is thermal energy transferred between bodies due to a temperature difference.',
    'electricity': 'Electricity is the flow of electric charge, typically through conductors.',
    'magnetism': 'Magnetism is a force from moving charges; it powers motors, compasses, and more.',
    'ai': 'Artificial Intelligence is the field of making machines perform tasks that need human intelligence.',
    'artificial intelligence': 'Artificial Intelligence is the field of making machines perform tasks that need human intelligence.',
    'machine learning': 'Machine learning is a subset of AI where systems learn patterns from data instead of explicit rules.',
    'ml': 'ML stands for Machine Learning — algorithms that improve with data.',
    'neural network': 'A neural network is a model inspired by the brain, with layers of nodes that learn representations.',
    'deep learning': 'Deep learning uses multi-layer neural networks to learn complex patterns from large data.',
    'algorithm': 'An algorithm is a step-by-step procedure for solving a problem or performing a computation.',
    'computer': 'A computer is a programmable device that processes data according to instructions.',
    'internet': 'The Internet is the global network of interconnected computers using the TCP/IP protocol.',
    'world wide web': 'The World Wide Web is the system of interlinked hypertext documents accessed via the Internet.',
    'html': 'HTML (HyperText Markup Language) is the standard markup language for web pages.',
    'css': 'CSS (Cascading Style Sheets) styles the appearance of web pages.',
    'javascript': 'JavaScript is the programming language that makes web pages interactive.',
    'python': 'Python is a popular, readable high-level programming language used in AI, web, and science.',
    'software': 'Software is the programs and data that tell hardware what to do.',
    'hardware': 'Hardware is the physical components of a computer system.',
    'cpu': 'The CPU (central processing unit) is the chip that executes most instructions in a computer.',
    'gpu': 'The GPU (graphics processing unit) excels at parallel math, key for graphics and AI.',
    'ram': 'RAM (random-access memory) is fast, temporary memory a computer uses while running.',
    'database': 'A database is an organized collection of data that can be searched and updated.',
    'api': 'An API (application programming interface) lets different programs talk to each other.',
    'cloud': 'The cloud is remote computing power and storage accessed over the Internet.',
    'blockchain': 'A blockchain is a tamper-resistant, distributed ledger of records (blocks) linked by cryptography.',
    'cryptography': 'Cryptography is the practice of secure communication using codes and keys.',
    'encryption': 'Encryption scrambles data so only someone with the key can read it.',
    'virus': 'A computer virus is malicious code that replicates by attaching to other programs.',
    'bug': 'A bug is an error or flaw in software that causes incorrect behavior.',
    'apple': 'Apple is a technology company known for the iPhone, Mac, and its operating systems.',
    'google': 'Google is a technology company known for its search engine and Android.',
    'microsoft': 'Microsoft is a technology company known for Windows and Office.',
    'pi': "Pi (π) is the ratio of a circle's circumference to its diameter, ≈ 3.14159.",
    'e': "Euler's number e ≈ 2.71828 is the base of natural logarithms.",
    'golden ratio': 'The golden ratio φ ≈ 1.618, appearing in art, nature, and mathematics.',
    'fibonacci': 'The Fibonacci sequence is 0,1,1,2,3,5,8,… where each number is the sum of the two before.',
    'prime': 'A prime number is a whole number greater than 1 with exactly two divisors: 1 and itself.',
    'integer': 'An integer is a whole number (…,−2,−1,0,1,2,…), positive or negative.',
    'fraction': 'A fraction represents a part of a whole, written as numerator over denominator.',
    'logarithm': 'A logarithm is the exponent to which a base must be raised to get a number.',
    'calculus': 'Calculus studies continuous change — derivatives and integrals.',
    'algebra': 'Algebra is the branch of math using symbols to represent numbers in equations.',
    'geometry': 'Geometry is the branch of math dealing with shapes, sizes, and spaces.',
    'statistics': 'Statistics is the science of collecting, analyzing, and interpreting data.',
    'trigonometry': 'Trigonometry studies relationships between triangle sides and angles.',
    'zero': 'Zero is the number representing nothing; a key concept in mathematics.',
    'infinity': 'Infinity (∞) describes something without bound or end.',
    'continent': 'A continent is a large continuous landmass; there are 7: Africa, Antarctica, Asia, Australia, Europe, North America, South America.',
    'ocean': 'An ocean is a vast body of salt water; Earth has 5: Pacific, Atlantic, Indian, Southern, Arctic.',
    'pacific': 'The Pacific is the largest and deepest ocean, covering about a third of Earth\'s surface.',
    'atlantic': 'The Atlantic Ocean lies between the Americas and Europe/Africa.',
    'mount everest': 'Mount Everest is Earth\'s highest peak, ~8,849 m above sea level, in the Himalayas.',
    'sahara': 'The Sahara is the largest hot desert, in North Africa.',
    'amazon': "The Amazon is the world's largest rainforest, in South America.",
    'nile': 'The Nile is a major river in Africa, often called the longest river.',
    'volcano': 'A volcano is an opening in Earth\'s crust where magma, gas, and ash escape.',
    'earthquake': 'An earthquake is the shaking of the ground from sudden movement of Earth\'s crust.',
    'rainbow': 'A rainbow is a spectrum of light appearing as an arc after rain and sun.',
    'color': 'Color is how we perceive different wavelengths of light.',
    'dog': 'Dogs are domesticated mammals, often called humans\' best friends.',
    'cat': 'Cats are small domesticated carnivores kept as pets.',
    'elephant': 'Elephants are the largest land animals, known for their trunks and memory.',
    'dolphin': 'Dolphins are intelligent marine mammals that use echolocation.',
    'whale': 'Whales are the largest animals on Earth, living in the ocean.',
    'bee': 'Bees are insects that pollinate plants and make honey.',
    'penguin': 'Penguins are flightless birds that swim and live mostly in the Southern Hemisphere.',
    'lion': 'Lions are large cats that live in groups called prides.',
    'horse': 'Horses are large domesticated mammals used for riding and work.',
    'chocolate': 'Chocolate is made from cacao beans and is one of the most popular treats.',
    'coffee': 'Coffee is a brewed drink made from roasted coffee beans, containing caffeine.',
    'pizza': 'Pizza is an Italian dish of flatbread topped with sauce, cheese, and more.',
    'calorie': 'A calorie is a unit of energy from food. (General info, not medical advice.)',
    'carbohydrate': 'Carbohydrates are nutrients (sugars and starches) that provide energy.',
    'football': "Football (soccer in the US) is the world's most popular sport.",
    'soccer': 'Soccer is a team sport played with a ball, called football in most countries.',
    'basketball': 'Basketball is a sport where teams score by shooting a ball through a hoop.',
    'olympics': 'The Olympics are international sporting events held every four years.',
    'movie': 'A movie (film) is a story told through moving images.',
    'music': 'Music is organized sound and silence, often with rhythm, melody, and harmony.',
    'art': 'Art is the expression of human creativity and imagination.',
    'democracy': 'Democracy is a system of government where power rests with the people, via voting.',
    'economy': 'An economy is the system of production, distribution, and consumption of goods and services.',
    'inflation': 'Inflation is the rate at which prices rise and purchasing power falls.',
    'capitalism': 'Capitalism is an economic system based on private ownership and free markets.',
    'socialism': 'Socialism is an economic system where the means of production are collectively or state owned.',
    'language': 'A language is a structured system of communication used by humans.',
    'philosophy': 'Philosophy is the study of knowledge, existence, and values through reason.',
    'logic': 'Logic is the study of valid reasoning and argument.',
    'ethics': 'Ethics is the branch of philosophy concerned with right and wrong conduct.',
    'sleep': 'Most adults need 7–9 hours of sleep; it restores the body and brain. (General info, not medical advice.)',
    'water': 'Staying hydrated matters; a common guideline is about 2 liters of water daily. (General info, not medical advice.)',
    'exercise': 'Regular physical activity supports heart and mental health. (General info, not medical advice.)',
    'protein': 'Proteins are essential molecules made of amino acids, used to build and repair tissue.',
    'vitamin': 'Vitamins are nutrients the body needs in small amounts to function. (General info, not medical advice.)'
  };
  var PEOPLE = {
    'einstein': 'Albert Einstein (1879–1955) developed the theory of relativity and E=mc².',
    'newton': 'Isaac Newton (1643–1727) formulated the laws of motion and universal gravitation.',
    'tesla': 'Nikola Tesla (1856–1943) pioneered alternating current (AC) and wireless ideas.',
    'da vinci': 'Leonardo da Vinci (1452–1519) was a Renaissance artist, engineer, and inventor.',
    'shakespeare': 'William Shakespeare (1564–1616) was an English playwright and poet.',
    'curie': 'Marie Curie (1867–1934) discovered radium and polonium and won two Nobel Prizes.',
    'gandhi': 'Mahatma Gandhi (1869–1948) led India\'s nonviolent independence movement.',
    'napoleon': 'Napoleon Bonaparte (1769–1821) was a French military and political leader.',
    'cleopatra': 'Cleopatra (69–30 BCE) was the last active ruler of Ptolemaic Egypt.',
    'aristotle': 'Aristotle (384–322 BCE) was a Greek philosopher who shaped science and logic.',
    'pythagoras': 'Pythagoras (c. 570 BCE) was a Greek mathematician known for the Pythagorean theorem.',
    'galileo': 'Galileo Galilei (1564–1642) advanced astronomy and the scientific method.',
    'darwin': 'Charles Darwin (1809–1882) proposed the theory of evolution by natural selection.',
    'hawking': 'Stephen Hawking (1942–2018) studied black holes and cosmology.',
    'lovelace': 'Ada Lovelace (1815–1852) wrote the first algorithm for a computing machine.',
    'tubman': 'Harriet Tubman (c. 1822–1913) led enslaved people to freedom via the Underground Railroad.',
    'jobs': 'Steve Jobs (1955–2011) co-founded Apple and shaped modern consumer tech.',
    'gates': 'Bill Gates (b. 1955) co-founded Microsoft.',
    'musk': 'Elon Musk (b. 1971) founded Tesla and SpaceX, among others.',
    'turing': 'Alan Turing (1912–1954) founded computer science and helped break WWII codes.',
    'babbage': 'Charles Babbage (1791–1871) designed the first mechanical computers.',
    'bohr': 'Niels Bohr (1885–1962) described the structure of the atom.',
    'mandela': 'Nelson Mandela (1918–2013) fought apartheid and became South Africa\'s president.',
    'lincoln': 'Abraham Lincoln (1809–1865) was the US president during the Civil War.',
    'socrates': 'Socrates (c. 470–399 BCE) was a Greek philosopher of ethics and dialogue.',
    'plato': 'Plato (c. 428–348 BCE) was a Greek philosopher who founded the Academy.',
    'confucius': 'Confucius (551–479 BCE) was a Chinese philosopher of ethics and society.'
  };
  var CAPITALS = {
    'france': 'Paris', 'japan': 'Tokyo', 'germany': 'Berlin', 'italy': 'Rome', 'spain': 'Madrid',
    'uk': 'London', 'united kingdom': 'London', 'england': 'London', 'usa': 'Washington, D.C.',
    'united states': 'Washington, D.C.', 'canada': 'Ottawa', 'china': 'Beijing', 'india': 'New Delhi',
    'russia': 'Moscow', 'brazil': 'Brasília', 'australia': 'Canberra', 'egypt': 'Cairo',
    'mexico': 'Mexico City', 'south korea': 'Seoul', 'north korea': 'Pyongyang', 'turkey': 'Ankara',
    'greece': 'Athens', 'portugal': 'Lisbon', 'sweden': 'Stockholm', 'norway': 'Oslo',
    'netherlands': 'Amsterdam', 'switzerland': 'Bern', 'austria': 'Vienna', 'ireland': 'Dublin',
    'poland': 'Warsaw', 'thailand': 'Bangkok', 'vietnam': 'Hanoi', 'indonesia': 'Jakarta',
    'argentina': 'Buenos Aires', 'south africa': 'Pretoria', 'kenya': 'Nairobi', 'nigeria': 'Abuja',
    'saudi arabia': 'Riyadh', 'iran': 'Tehran', 'iraq': 'Baghdad', 'israel': 'Jerusalem'
  };
  (function () {
    var ex = (typeof window !== 'undefined') && window.ORBIT_EXTRA;
    if (!ex) return;
    Object.keys(ex.DICT).forEach(function (k) { if (!(k in DICT)) DICT[k] = ex.DICT[k]; });
    Object.keys(ex.PEOPLE).forEach(function (k) { if (!(k in PEOPLE)) PEOPLE[k] = ex.PEOPLE[k]; });
    Object.keys(ex.CAPITALS).forEach(function (k) { if (!(k in CAPITALS)) CAPITALS[k] = ex.CAPITALS[k]; });
  })();

  var GENERIC = [
    "Tell me more about that.", "Why do you say '$1'?", "What makes you think about '$1'?",
    "Interesting — go on.", "Can you elaborate on '$1'?", "I see. How does that make you feel?", "That's worth thinking about."
  ];

  /* ---------------- unit converter ---------------- */
  var UNITS = {
    length: { km: 1000, kms: 1000, kilometer: 1000, kilometres: 1000, m: 1, meters: 1, meter: 1, cm: 0.01, cms: 0.01, millimeter: 0.001, mm: 0.001, mi: 1609.34, mile: 1609.34, miles: 1609.34, yd: 0.9144, yard: 0.9144, yards: 0.9144, ft: 0.3048, foot: 0.3048, feet: 0.3048, in: 0.0254, inch: 0.0254, inches: 0.0254 },
    mass: { kg: 1, kgs: 1, kilogram: 1, kilograms: 1, g: 0.001, gram: 0.001, grams: 0.001, mg: 1e-6, milligram: 1e-6, lb: 0.453592, pound: 0.453592, pounds: 0.453592, oz: 0.0283495, ounce: 0.0283495, ounces: 0.0283495, ton: 1000, tonne: 1000, tonnes: 1000 },
    time: { s: 1, sec: 1, second: 1, seconds: 1, min: 60, minute: 60, minutes: 60, h: 3600, hr: 3600, hour: 3600, hours: 3600, day: 86400, days: 86400, week: 604800, weeks: 604800 },
    data: { b: 1, byte: 1, bytes: 1, kb: 1024, kilobyte: 1024, kilobytes: 1024, mb: 1048576, megabyte: 1048576, megabytes: 1048576, gb: 1073741824, gigabyte: 1073741824, gigabytes: 1073741824, tb: 1099511627776, terabyte: 1099511627776, terabytes: 1099511627776 },
    speed: { mps: 1, 'm/s': 1, 'km/h': 0.277778, kilometerperhour: 0.277778, kph: 0.277778, mph: 0.44704, 'mile per hour': 0.44704 },
    area: { m2: 1, 'm²': 1, squaremeter: 1, km2: 1e6, squarekilometer: 1e6, cm2: 1e-4, squarecentimeter: 1e-4, ha: 10000, hectare: 10000, hectares: 10000, acre: 4046.86, acres: 4046.86 },
    volume: { l: 1, liter: 1, litre: 1, liters: 1, litres: 1, ml: 0.001, milliliter: 0.001, milliliters: 0.001, m3: 1000, 'm³': 1000, cubicmeter: 1000, gal: 3.78541, gallon: 3.78541, gallons: 3.78541, cup: 0.236588, cups: 0.236588 }
  };
  function lookupUnit(u) {
    u = (u || '').toLowerCase().replace(/\s+/g, '').replace(/s$/, '');
    u = u.replace('kilometres', 'kilometer').replace('metres', 'meter');
    for (var g in UNITS) { if (UNITS[g][u] != null) return { group: g, factor: UNITS[g][u] }; }
    return null;
  }
  function tempUnit(u) { u = (u || '').toLowerCase(); if (u === 'c' || u === 'celsius') return 'c'; if (u === 'f' || u === 'fahrenheit') return 'f'; if (u === 'k' || u === 'kelvin') return 'k'; return null; }
  function toC(v, f) { return f === 'c' ? v : f === 'f' ? (v - 32) * 5 / 9 : v - 273.15; }
  function fromC(c, t) { return t === 'c' ? c : t === 'f' ? c * 9 / 5 + 32 : c + 273.15; }
  function rnd(n) { return (Math.round(n * 1000) / 1000).toString(); }
  function tryConvert(t) {
    var m = t.match(/(?:convert\s+)?([\d.]+)\s*([\w/.]+)\s*(?:to|in|->)\s*([\w/.]+)/i)
      || t.match(/how many\s+([\w/.]+)\s+in\s+([\d.]+)\s*([\w/.]+)/i);
    if (!m) return null;
    var val, from, to;
    if (m[3] != null && /[\d.]/.test(m[2]) && !/[\d.]/.test(m[3])) { val = parseFloat(m[2]); from = m[3]; to = m[1]; }
    else { val = parseFloat(m[1]); from = m[2]; to = m[3]; }
    var tf = tempUnit(from), tt = tempUnit(to);
    if (tf && tt) return rnd(val) + ' ' + from + ' = ' + rnd(fromC(toC(val, tf), tt)) + ' ' + to;
    var f = lookupUnit(from), g = lookupUnit(to);
    if (f && g && f.group === g.group) return rnd(val) + ' ' + from + ' = ' + rnd(val * f.factor / g.factor) + ' ' + to;
    return null;
  }

  /* ---------------- helpers ---------------- */
  function nowTime() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0') + ' on ' + d.toDateString();
  }
  function findInDict(term) {
    term = (term || '').toLowerCase().replace(/[?.!,]$/, '').trim();
    if (DICT[term]) return DICT[term];
    if (PEOPLE[term]) return PEOPLE[term];
    var words = term.split(/\s+/);
    var best = null, bestLen = 0;
    function consider(k, val) { if (k && k.length > bestLen) { bestLen = k.length; best = val; } }
    for (var len = words.length; len >= 1; len--) {
      for (var s = 0; s + len <= words.length; s++) {
        var ph = words.slice(s, s + len).join(' ');
        if (DICT[ph]) consider(ph, DICT[ph]);
        if (PEOPLE[ph]) consider(ph, PEOPLE[ph]);
      }
    }
    if (best) return best;
    function scan(obj) { for (var k in obj) { if (k.length < 4) continue; if (term.indexOf(k) >= 0 || k.indexOf(term) >= 0) consider(k, obj[k]); } }
    scan(DICT); scan(PEOPLE);
    return best;
  }
  function isMath(t) { return /^[\d\s\.\+\-\*\/\(\)\%\^]+$/.test(t) && /\d/.test(t); }
  function evalMath(t) { try { var v = Function('"use strict";return (' + t + ')')(); if (typeof v === 'number' && isFinite(v)) return 'That equals ' + v + '.'; } catch (e) {} return null; }
  function normalizeQuery(t) {
    t = (t || '').toLowerCase();
    t = t.replace(/^(can you|could you|please|pls|tell me|do you know|i want to know|i would like to know|i'd like to know|what is|what's|what are|what was|who is|who was|who are|where is|where are|explain|define|definition of|the meaning of|how to|how do i|show me|give me|i need|what do you know about|info on|information about|facts about|something about|a fact about)\s+/g, '');
    t = t.replace(/^(the |a |an )/g, '');
    t = t.replace(/\b(please|thanks|thank you|ty|hey|hi|hello|about)\b/g, '');
    t = t.replace(/[?.!,]+$/g, '').trim();
    return t;
  }

  /* ---------------- main responder ---------------- */
  function respond(input) {
    var t = (input || '').trim();
    if (!t) return { text: rand(GENERIC).replace('$1', 'that'), topic: 'fallback' };
    if (isMath(t)) { var m = evalMath(t); if (m) return { text: m, topic: 'math' }; }
    var conv = tryConvert(t); if (conv) return { text: conv, topic: 'math' };
    for (var i = 0; i < PATTERS.length; i++) {
      var mt = t.match(PATTERS[i].re);
      if (mt) {
        var r = rand(PATTERS[i].resp).replace(/\$(\d)/g, function (_, n) { return mt[n] || ''; }).replace(/\$TIME/g, nowTime());
        if (PATTERS[i].topic === 'you' && mt[2]) { save('orbit_name', mt[2].trim()); }
        return { text: r, topic: PATTERS[i].topic };
      }
    }
    var norm = normalizeQuery(t);
    var cap = norm.match(/capital (of|city of) (.+)/) || t.toLowerCase().match(/capital (of|city of) (.+)/);
    if (cap) { var c = cap[2].toLowerCase().replace(/[^a-z0-9 ?]/g, '').trim(); var cn = cap[2].replace(/[^a-z0-9 ]/gi, '').trim(); if (CAPITALS[c]) return { text: 'The capital of ' + cn + ' is ' + CAPITALS[c] + '.', topic: 'geo' }; }
    var ans = findInDict(norm) || findInDict(t);
    if (ans) return { text: ans, topic: 'fact' };
    return { text: rand(GENERIC).replace('$1', reflect(t)), topic: 'reflect' };
  }

  /* ---------------- follow-up suggestions ---------------- */
  function suggestionsFor(topic) {
    switch (topic) {
      case 'greet': return ['What can you do?', 'Tell me a joke', 'What is AI?'];
      case 'you': return ['What is AI?', 'Tell me a joke', 'What time is it?'];
      case 'time': return ['What is a calendar?', 'Tell me about the universe', 'Tell me a joke'];
      case 'joke': return ['What is comedy?', 'Tell me another joke', 'What time is it?'];
      case 'math': return ['What is pi?', 'Tell me about algebra', 'What is a fraction?'];
      case 'geo': return ['What is a continent?', 'Tell me about the ocean', 'What is geography?'];
      case 'fact': return ['Tell me a joke', 'What time is it?', 'What is machine learning?'];
      case 'reflect': return ['Tell me a joke', 'What is AI?', 'What time is it?'];
      default: return ['Tell me a joke', 'What time is it?', 'What is AI?'];
    }
  }

  /* ---------------- optional real-model power mode ---------------- */
  function sendToModel(text, history, cb) {
    var key = load('orbit_key', '');
    if (!key) { cb(null); return; }
    var body = { model: 'deepseek-chat', messages: history.map(function (m) { return { role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }; }), stream: false };
    fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.choices && j.choices[0] && j.choices[0].message) cb(j.choices[0].message.content.trim());
      else cb(null);
    }).catch(function () { cb(null); });
  }

  /* ---------------- sessions / state ---------------- */
  var THEMES = ['aurora', 'sunset', 'neon', 'forest'];
  var sessions = load('orbit_sessions', null) || [];
  var curId = load('orbit_cur', null);
  function newSession(seed) { return { id: 's' + Date.now() + Math.random().toString(36).slice(2, 6), name: 'Chat', msgs: seed || [] }; }
  function current() { for (var i = 0; i < sessions.length; i++) if (sessions[i].id === curId) return sessions[i]; return sessions[sessions.length - 1]; }
  function saveSessions() { save('orbit_sessions', sessions); save('orbit_cur', curId); }
  function welcomeText() { var n = name(); return "Hi" + (n ? ' ' + n : '') + ", I'm Orbit — an offline AI assistant with a " + totalEntries() + "-entry index. Ask me anything, type /help for commands, or set a DeepSeek key (⚙) for real-model power mode."; }
  function helpText() {
    return "Commands:\n" +
      "/help — show this list\n" +
      "/new — start a new chat\n" +
      "/clear — clear the current chat\n" +
      "/theme <aurora|sunset|neon|forest> — change the look\n" +
      "/export — download this chat as a text file\n" +
      "/about — what Orbit is\n" +
      "Also try: unit conversion ('10 km to miles'), math ('12*8+3'), and facts ('what is a black hole').";
  }
  function sid() { var s = current(); return s ? s.id : null; }

  /* ---------------- UI ---------------- */
  function addBub(role, text, withSugs) {
    var b = document.createElement('div'); b.className = 'bub ' + role;
    var p = document.createElement('div'); p.className = 'txt'; p.innerHTML = escapeHtml(text).replace(/\n/g, '<br>'); b.appendChild(p);
    if (withSugs) { var s = document.createElement('div'); s.className = 'sugs'; b.appendChild(s); b._sugs = s; }
    $('#msgs').appendChild(b); $('#msgs').scrollTop = $('#msgs').scrollHeight; return b;
  }
  function addSuggestions(bubble, arr) {
    if (!bubble || !bubble._sugs) return;
    arr.forEach(function (q) { var c = document.createElement('span'); c.className = 'schip'; c.textContent = q; c.addEventListener('click', function () { ask(q); }); bubble._sugs.appendChild(c); });
  }
  function renderAll() {
    $('#msgs').innerHTML = '';
    var s = current(); if (!s) return;
    s.msgs.forEach(function (m) { addBub(m.role, m.text, false); });
    if (s.msgs.length && s.msgs[s.msgs.length - 1].role === 'ai') { var lb = $('#msgs').lastChild; if (lb) addSuggestions(lb, suggestionsFor('fact', '')); }
  }
  function renderSidebar() {
    var list = $('#sessList'); if (!list) return; list.innerHTML = '';
    sessions.forEach(function (s) {
      var d = document.createElement('div'); d.className = 'sessItem' + (s.id === curId ? ' on' : '');
      var t = document.createElement('span'); t.textContent = s.name || 'Chat'; t.className = 'sessName';
      var x = document.createElement('button'); x.className = 'sessX'; x.textContent = '×';
      x.addEventListener('click', function (e) { e.stopPropagation(); sessions = sessions.filter(function (z) { return z.id !== s.id; }); if (!sessions.length) sessions.push(newSession([{ role: 'ai', text: welcomeText() }])); if (s.id === curId) curId = sessions[sessions.length - 1].id; saveSessions(); renderSidebar(); renderAll(); });
      d.appendChild(t); d.appendChild(x);
      d.addEventListener('click', function () { curId = s.id; saveSessions(); renderSidebar(); renderAll(); });
      list.appendChild(d);
    });
  }
  function pushAI(text, withSugs) {
    var s = current(); if (!s) return; s.msgs.push({ role: 'ai', text: text }); saveSessions();
    var b = addBub('ai', text, withSugs); if (withSugs) addSuggestions(b, ['/help', '/new', '/export']);
  }
  function ask(text) {
    text = (text || '').trim(); if (!text) return;
    if (text.charAt(0) === '/') { handleCommand(text); return; }
    var s = current(); if (!s) { s = newSession([]); sessions.push(s); curId = s.id; }
    s.msgs.push({ role: 'user', text: escapeHtml(text) });
    if (!s.name || s.name === 'Chat') s.name = text.slice(0, 22);
    saveSessions(); renderSidebar();
    var r = respond(text);
    var typing = addBub('ai', '<i>Orbit is typing…</i>', true);
    function show(text2) { typing.querySelector('.txt').innerHTML = escapeHtml(text2).replace(/\n/g, '<br>'); typing._sugs.innerHTML = ''; addSuggestions(typing, suggestionsFor(r.topic, text)); }
    var key = load('orbit_key', '');
    if (key) {
      setTimeout(function () {
        show(r.text);
        sendToModel(text, s.msgs, function (reply) { if (reply) { typing.querySelector('.txt').innerHTML = escapeHtml(reply).replace(/\n/g, '<br>'); typing._sugs.innerHTML = ''; } });
      }, 350);
    } else {
      setTimeout(function () { show(r.text); }, 350);
    }
  }
  function handleCommand(text) {
    var cmd = text.slice(1).trim().toLowerCase();
    if (cmd === 'help' || cmd === '?') { pushAI(helpText(), true); return; }
    if (cmd === 'new') { var s = newSession([{ role: 'ai', text: welcomeText() }]); sessions.push(s); curId = s.id; saveSessions(); renderSidebar(); renderAll(); return; }
    if (cmd === 'clear') { var c = current(); c.msgs = []; c.name = 'Chat'; c.msgs.push({ role: 'ai', text: welcomeText() }); saveSessions(); renderSidebar(); renderAll(); return; }
    if (cmd === 'export') { exportChat(); pushAI('Exported this chat to a text file.', false); return; }
    if (cmd === 'about') { pushAI("I'm Orbit, an offline AI assistant. I have a " + totalEntries() + "-entry index of facts, a unit converter, math, and chat. Set a DeepSeek key (⚙) to upgrade replies to a real language model.", true); return; }
    if (cmd.indexOf('theme') === 0) {
      var parts = cmd.split(/\s+/); var idx = THEMES.indexOf(parts[1]);
      if (idx >= 0) { setTheme(idx); pushAI('Theme set to ' + parts[1] + '.', false); }
      else pushAI('Themes: ' + THEMES.join(', ') + '. Usage: /theme sunset', false);
      return;
    }
    pushAI("Unknown command: " + text + ". Type /help for a list.", true);
  }
  function exportChat() {
    var s = current(); if (!s) return;
    var lines = [s.name || 'Orbit chat', ''];
    s.msgs.forEach(function (m) { lines.push((m.role === 'user' ? 'You: ' : 'Orbit: ') + m.text.replace(/<[^>]+>/g, '')); });
    try {
      var blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a'); a.href = url; a.download = 'orbit-' + s.id + '.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (e) {}
  }
  function setTheme(i) {
    i = ((i % THEMES.length) + THEMES.length) % THEMES.length;
    document.documentElement.setAttribute('data-theme', THEMES[i]);
    var dots = document.querySelectorAll('#themes .dot');
    for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('on', d === i);
    save('orbit_theme', i);
  }

  document.addEventListener('DOMContentLoaded', function () {
    $('#idxLabel').textContent = 'index: ' + totalEntries() + ' entries';
    if (!sessions.length) sessions.push(newSession([{ role: 'ai', text: welcomeText() }]));
    if (!curId || !sessions.some(function (s) { return s.id === curId; })) curId = sessions[sessions.length - 1].id;
    var ti = load('orbit_theme', 0); document.documentElement.setAttribute('data-theme', THEMES[ti] || 'aurora');
    var dots = $('#themes');
    THEMES.forEach(function (th, i) { var d = document.createElement('span'); d.className = 'dot'; d.style.background = ({ aurora: '#5eead4', sunset: '#fb923c', neon: '#22d3ee', forest: '#34d399' })[th]; d.addEventListener('click', function () { setTheme(i); }); dots.appendChild(d); });
    setTheme(ti);
    renderSidebar(); renderAll();
    $('#send').addEventListener('click', function () { var i = $('#chatInput'); ask(i.value); i.value = ''; });
    $('#chatInput').addEventListener('keydown', function (e) { if (e.key === 'Enter') { ask(this.value); this.value = ''; } });
    Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (c) { c.addEventListener('click', function () { ask(c.textContent); }); });
    $('#settingsBtn').addEventListener('click', function () { var cur = load('orbit_key', ''); var k = prompt('DeepSeek API key (stored only in this browser; empty = offline mode):', cur); if (k !== null) { save('orbit_key', k.trim()); alert('Saved. ' + (k.trim() ? 'Power mode on.' : 'Offline mode.')); } });
    $('#clearBtn').addEventListener('click', function () { if (confirm('Clear the current chat?')) { var c = current(); c.msgs = []; c.name = 'Chat'; c.msgs.push({ role: 'ai', text: welcomeText() }); saveSessions(); renderSidebar(); renderAll(); } });
    $('#exportBtn').addEventListener('click', function () { exportChat(); });
    $('#newChat').addEventListener('click', function () { var s = newSession([{ role: 'ai', text: welcomeText() }]); sessions.push(s); curId = s.id; saveSessions(); renderSidebar(); renderAll(); });
  });
})();
