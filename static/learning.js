(() => {
  const app = document.querySelector('.learn-app');
  if (!app) return;
  const themeToggle = document.querySelector('#themeToggle');
  const savedTheme = localStorage.getItem('northstar-catalog-theme');
  const applyTheme = theme => {
    const isLight = theme === 'light';
    document.body.dataset.theme = isLight ? 'light' : 'dark';
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = isLight ? '#f2f4f7' : '#0b1220';
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    themeToggle.querySelector('.theme-toggle-icon').textContent = isLight ? '☾' : '☀';
    themeToggle.querySelector('.theme-toggle-label').textContent = isLight ? 'Dark mode' : 'Light mode';
  };
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('northstar-catalog-theme', nextTheme);
    applyTheme(nextTheme);
  });
  const catalogSearch = document.querySelector('#catalogSearch');
  const catalogEmpty = document.querySelector('#catalogEmpty');
  catalogSearch?.addEventListener('input', () => {
    const query = catalogSearch.value.trim().toLowerCase();
    const cards = [...document.querySelectorAll('.catalog-card, .academy-card')];
    let visibleCatalogCards = 0;
    cards.forEach(card => {
      const matches = !query || card.textContent.toLowerCase().includes(query);
      card.hidden = !matches;
      if (card.classList.contains('catalog-card') && matches) visibleCatalogCards += 1;
    });
    if (catalogEmpty) catalogEmpty.hidden = !query || visibleCatalogCards > 0;
  });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      catalogSearch?.focus();
    }
  });
  const csrf = app.dataset.csrf;
  const languages = [
    ['Arabic','ar','ar-SA'],['Bengali','bn','bn-BD'],['Chinese (Mandarin)','zh','zh-CN'],['Dutch','nl','nl-NL'],['English','en','en-US'],['French','fr','fr-FR'],['German','de','de-DE'],['Greek','el','el-GR'],['Gujarati','gu','gu-IN'],['Hebrew','he','he-IL'],['Hindi','hi','hi-IN'],['Indonesian','id','id-ID'],['Italian','it','it-IT'],['Japanese','ja','ja-JP'],['Kannada','kn','kn-IN'],['Korean','ko','ko-KR'],['Malayalam','ml','ml-IN'],['Marathi','mr','mr-IN'],['Nepali','ne','ne-NP'],['Persian','fa','fa-IR'],['Polish','pl','pl-PL'],['Portuguese','pt','pt-BR'],['Punjabi','pa','pa-IN'],['Russian','ru','ru-RU'],['Spanish','es','es-ES'],['Swahili','sw','sw-KE'],['Tamil','ta','ta-IN'],['Telugu','te','te-IN'],['Thai','th','th-TH'],['Turkish','tr','tr-TR'],['Ukrainian','uk','uk-UA'],['Urdu','ur','ur-PK'],['Vietnamese','vi','vi-VN'],['Other language','','']
  ];
  const localizedPrompts = {
    es:['¡Hola! Practiquemos español. Cuéntame algo bueno que te pasó esta semana.','¿Qué te gustaría aprender este año y por qué?','Describe un lugar que te gustaría visitar.'],
    fr:['Bonjour ! Pratiquons le français. Raconte-moi une petite chose qui t’a fait sourire cette semaine.','Qu’aimerais-tu apprendre cette année, et pourquoi ?','Décris un endroit que tu aimerais visiter.'],
    de:['Hallo! Lass uns Deutsch üben. Erzähl mir von einer kleinen Sache, die dich diese Woche gefreut hat.','Was möchtest du dieses Jahr lernen und warum?','Beschreibe einen Ort, den du gern besuchen würdest.'],
    hi:['नमस्ते! आज हिंदी का अभ्यास करते हैं। इस हफ़्ते की कोई अच्छी बात बताइए।','आप इस साल क्या सीखना चाहेंगे और क्यों?','उस जगह के बारे में बताइए जहाँ आप जाना चाहेंगे।'],
    it:['Ciao! Facciamo pratica di italiano. Raccontami una piccola cosa che ti ha fatto sorridere questa settimana.','Che cosa ti piacerebbe imparare quest’anno e perché?','Descrivi un posto che vorresti visitare.'],
    pt:['Olá! Vamos praticar português. Conte-me uma coisa boa que aconteceu nesta semana.','O que você gostaria de aprender este ano e por quê?','Descreva um lugar que você gostaria de visitar.'],
    ja:['こんにちは。日本語を練習しましょう。今週うれしかったことを一つ教えてください。','今年、何を学びたいですか。それはなぜですか。','行ってみたい場所について話してください。'],
    zh:['你好！我们来练习中文。告诉我这周一件让你开心的小事。','你今年想学什么？为什么？','请介绍一个你想去的地方。'],
    ar:['مرحبًا! لنتدرّب على العربية. أخبرني عن شيء صغير أسعدك هذا الأسبوع.','ما الذي تودّ تعلّمه هذا العام؟ ولماذا؟','صِف مكانًا تودّ زيارته.'],
    ur:['السلام علیکم! آئیے اردو کی مشق کرتے ہیں۔ اس ہفتے کی کوئی اچھی بات بتائیں۔','آپ اس سال کیا سیکھنا چاہیں گے اور کیوں؟','اس جگہ کے بارے میں بتائیں جہاں آپ جانا چاہتے ہیں۔'],
    ru:['Привет! Давай практиковать русский. Расскажи о чём-нибудь хорошем на этой неделе.','Чему ты хотел бы научиться в этом году и почему?','Опиши место, которое ты хотел бы посетить.'],
    ko:['안녕하세요! 한국어를 연습해 봐요. 이번 주에 기분 좋았던 일을 하나 말해 주세요.','올해 무엇을 배우고 싶고, 그 이유는 무엇인가요?','가 보고 싶은 장소를 설명해 주세요.'],
    tr:['Merhaba! Türkçe pratik yapalım. Bu hafta seni mutlu eden küçük bir şeyi anlat.','Bu yıl ne öğrenmek istersin ve neden?','Gitmek istediğin bir yeri anlat.'],
    bn:['হ্যালো! চলুন বাংলা অনুশীলন করি। এই সপ্তাহে ভালো লেগেছে এমন একটি ছোট ঘটনা বলুন।','এই বছর আপনি কী শিখতে চান এবং কেন?','আপনি যে জায়গায় যেতে চান সেটি বর্ণনা করুন.'],
    pa:['ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਆਓ ਪੰਜਾਬੀ ਦਾ ਅਭਿਆਸ ਕਰੀਏ। ਇਸ ਹਫ਼ਤੇ ਦੀ ਕੋਈ ਚੰਗੀ ਗੱਲ ਦੱਸੋ।','ਤੁਸੀਂ ਇਸ ਸਾਲ ਕੀ ਸਿੱਖਣਾ ਚਾਹੁੰਦੇ ਹੋ ਅਤੇ ਕਿਉਂ?','ਉਸ ਥਾਂ ਬਾਰੇ ਦੱਸੋ ਜਿੱਥੇ ਤੁਸੀਂ ਜਾਣਾ ਚਾਹੁੰਦੇ ਹੋ।']
  };
  const levels = {
    Basic: {
      subtitle: 'start with the essentials',
      lessons: [
        {id:'basic-sentence-shape',title:'Build a clear sentence',type:'FOUNDATION',time:'8 min',desc:'Put a simple idea into a natural English word order.',notes:['A clear basic pattern is subject + verb + object.','Example: “I read a book.” Add a time or place: “I read a book at home every evening.”','Keep one main idea in each short sentence while you are learning.'],practice:'Say three sentences about things you do every day.'},
        {id:'basic-be-verbs',title:'Use am, is and are',type:'GRAMMAR',time:'10 min',desc:'Introduce yourself and describe people, places and feelings.',notes:['Use am with I: “I am ready.”','Use is with he, she, it or one thing: “She is kind.”','Use are with you, we, they or more than one: “They are at work.”'],practice:'Describe yourself, one person you know and the place you are in.'},
        {id:'basic-present-simple',title:'Talk about your routine',type:'GRAMMAR',time:'12 min',desc:'Use the present simple for routines, habits and facts.',notes:['Use the base verb with I, you, we and they: “I work.”','Add -s or -es with he, she and it: “He works.”','For a negative, use do not / does not + base verb: “She does not drive.”'],practice:'Tell your coach what you usually do in the morning.'},
        {id:'basic-questions',title:'Ask everyday questions',type:'SPEAKING',time:'9 min',desc:'Start and keep a friendly conversation moving.',notes:['Use “do” for I / you / we / they: “Where do you live?”','Use “does” for he / she / it: “What does she like?”','Helpful follow-up: “How about you?” or “Can you tell me more?”'],practice:'Ask and answer three questions about meeting someone new.'},
        {id:'basic-past',title:'Share what you did',type:'GRAMMAR',time:'12 min',desc:'Use common past forms to talk about finished events.',notes:['Many verbs add -ed: “I visited my friend.”','Some common verbs change: go → went, meet → met, have → had.','Add a time marker: yesterday, last weekend, or two days ago.'],practice:'Tell a short story about yesterday using three past-tense verbs.'},
        {id:'basic-pronunciation',title:'Speak clearly: word stress',type:'PRONUNCIATION',time:'7 min',desc:'Hear and practise the strong syllable in common words.',notes:['English words often have one stronger syllable.','Try saying TAble, aBOUT, and imPORtant slowly, then at a natural pace.','A transcript cannot reliably judge pronunciation; listen to a model and repeat it.'],practice:'Say “I have an important meeting today” slowly, then naturally.'},
      ]
    },
    Intermediate: {
      subtitle: 'make your English more flexible',
      lessons: [
        {id:'intermediate-storytelling',title:'Tell a story with a clear arc',type:'SPEAKING',time:'12 min',desc:'Connect what happened, what changed and how it ended.',notes:['Set the scene: “Last month, I was working on…”','Show the change: “Then something unexpected happened…”','Wrap it up: “In the end…” or “What I learned was…”'],practice:'Tell a one-minute story about a challenge you handled.'},
        {id:'intermediate-tenses',title:'Connect past and present',type:'GRAMMAR',time:'14 min',desc:'Choose verb forms that make the timeline easy to follow.',notes:['Use past simple for a finished time: “I moved here in 2022.”','Use present perfect for experience or a result now: “I have worked in design for three years.”','Use “since” for a starting point and “for” for a duration.'],practice:'Talk about one thing you have learned and when you learned it.'},
        {id:'intermediate-opinions',title:'Express and support an opinion',type:'COMMUNICATION',time:'10 min',desc:'Give your view and add a reason or example.',notes:['Open clearly: “From my perspective…”','Support it: “The main reason is…”','Invite another view: “How do you see it?”'],practice:'Give an opinion about working from home and support it with one example.'},
        {id:'intermediate-linkers',title:'Link ideas naturally',type:'GRAMMAR',time:'12 min',desc:'Use connectors to show contrast, cause and result.',notes:['Contrast: although, however, on the other hand.','Cause: because, since, due to. Result: so, therefore, as a result.','Do not overuse connectors; a short pause can connect ideas too.'],practice:'Compare two ways to learn a new skill using three connectors.'},
        {id:'intermediate-phrasal-verbs',title:'Use common phrasal verbs',type:'VOCABULARY',time:'12 min',desc:'Understand useful verb + particle combinations in context.',notes:['“Find out” means discover: “I found out about the role yesterday.”','“Carry on” means continue: “Please carry on with your explanation.”','Learn phrasal verbs inside a complete example, not as isolated translations.'],practice:'Use “find out”, “work on” and “carry on” in a short story.'},
        {id:'intermediate-meetings',title:'Join a work discussion',type:'WORKPLACE',time:'15 min',desc:'Enter a discussion, clarify a point and respond with tact.',notes:['Join: “Could I add something here?”','Clarify: “Just to make sure I understand…”','Disagree gently: “I see your point. Another option might be…”'],practice:'Suggest a different plan while acknowledging a teammate’s idea.'},
      ]
    },
    Advanced: {
      subtitle: 'sound precise, natural and persuasive',
      lessons: [
        {id:'advanced-hedging',title:'Sound diplomatic without being vague',type:'NUANCE',time:'12 min',desc:'Adjust certainty and tone for sensitive conversations.',notes:['Soften a proposal: “We might want to consider…”','Signal evidence: “Based on what we know so far…”','Stay clear about decisions: “We will proceed with…”'],practice:'Give a cautious recommendation, then state the next step clearly.'},
        {id:'advanced-debate',title:'Build a persuasive argument',type:'SPEAKING',time:'15 min',desc:'Make a claim, weigh evidence and address a counterargument.',notes:['State the claim: “The strongest case for this is…”','Weigh evidence: “This matters because…”','Address a counterpoint fairly before explaining your conclusion.'],practice:'Argue for or against a four-day work week in 90 seconds.'},
        {id:'advanced-natural-flow',title:'Vary sentence rhythm',type:'FLUENCY',time:'10 min',desc:'Combine short emphasis with longer, connected ideas.',notes:['Use a short sentence when you want emphasis.','Use a longer sentence to explain how ideas relate.','A deliberate pause can sound confident; speed is not the same as fluency.'],practice:'Explain a complex idea first in one sentence, then in three.'},
        {id:'advanced-register',title:'Choose the right register',type:'COMMUNICATION',time:'13 min',desc:'Adapt vocabulary and directness to the audience and situation.',notes:['Consider audience, relationship and purpose before choosing wording.','Replace casual phrasing when a formal setting needs more precision.','Keep your meaning direct even when your tone is warm.'],practice:'Make one request sound friendly to a teammate and formal to a client.'},
        {id:'advanced-client',title:'Handle a difficult client question',type:'SIMULATION',time:'16 min',desc:'Acknowledge concern, explain facts and agree on a next action.',notes:['Acknowledge: “I understand why the delay is concerning.”','Explain without blaming: give the reason and current status.','Close with ownership: name the next action and when you will update them.'],practice:'Respond to a client who says a project is two weeks late.'},
        {id:'advanced-present',title:'Deliver a concise presentation',type:'PRESENTATION',time:'14 min',desc:'Lead with the point, show support and finish with a clear ask.',notes:['Open with the headline, not a long background.','Support with two or three points and one useful example.','End with the decision or action you need from the audience.'],practice:'Give a 60-second update with a headline, one risk and one request.'},
      ]
    }
  };
  const skills = [
    {id:'active-listening',icon:'◉',title:'Active listening',tag:'COMMUNICATION',desc:'Show you understood, ask a useful follow-up and leave room for the other person.',framework:['Pause before responding.','Reflect the main point in your own words.','Ask one open question to learn more.'],prompt:'A teammate says they feel left out of a project decision. How would you respond?'},
    {id:'confidence',icon:'✳',title:'Speak with confidence',tag:'SELF-ASSURANCE',desc:'Share an idea clearly without rushing, shrinking your point or over-apologising.',framework:['Lead with your main idea.','Give one reason or example.','Finish with a clear question or next step.'],prompt:'Share one idea you would like your team to consider.'},
    {id:'interviews',icon:'↗',title:'Job interviews',tag:'CAREER',desc:'Answer with a clear example and connect your experience to the role.',framework:['Set the situation briefly.','Explain your action and the result.','Connect what you learned to the role.'],prompt:'Tell me about a time you solved a difficult problem.'},
    {id:'teamwork',icon:'◎',title:'Teamwork & collaboration',tag:'WORKING TOGETHER',desc:'Contribute ideas, handle differences and move a group toward shared next steps.',framework:['Name the shared goal.','Offer your view and invite another.','Agree on who will do what next.'],prompt:'Your team has two different plans and a short deadline. What do you say?'},
    {id:'feedback',icon:'↗',title:'Giving & receiving feedback',tag:'GROWTH',desc:'Keep feedback specific, respectful and focused on an action someone can take.',framework:['Describe the observable moment.','Explain the impact without labelling the person.','Agree on one helpful next step.'],prompt:'Give a colleague constructive feedback about missed updates.'},
    {id:'presentations',icon:'▤',title:'Presentations',tag:'PUBLIC SPEAKING',desc:'Structure a message so your audience knows the point and what to do with it.',framework:['Open with the takeaway.','Support it with a few clear points.','Close with a decision or action.'],prompt:'Pitch a small improvement to your team in 30 seconds.'},
    {id:'conflict',icon:'◇',title:'Difficult conversations',tag:'EMOTIONAL INTELLIGENCE',desc:'Stay curious, describe the issue and look for a workable next step.',framework:['Separate facts from assumptions.','Name the impact and ask for their view.','Agree on an action you can both follow.'],prompt:'A project hand-off was missed. Start a calm conversation about it.'},
    {id:'time-management',icon:'◷',title:'Prioritisation',tag:'PERSONAL EFFECTIVENESS',desc:'Explain trade-offs and agree what matters most when everything feels urgent.',framework:['List deadlines and impact.','Make the trade-off visible.','Confirm the priority and communicate what moves.'],prompt:'Two urgent tasks compete for your time. Ask your manager to prioritise.'},
    {id:'problem-solving',icon:'⌘',title:'Practical problem solving',tag:'THINKING',desc:'Define a problem clearly, explore causes and test a workable next step.',framework:['Describe the observable problem and its impact.','Separate likely causes from assumptions.','Choose a small test, owner and review point.'],prompt:'A weekly report keeps arriving late. Ask questions and propose a small process test.'},
    {id:'emotional-regulation',icon:'◌',title:'Emotional regulation',tag:'SELF-AWARENESS',desc:'Pause under pressure so your response stays useful and respectful.',framework:['Notice the feeling and the trigger.','Take a short pause and identify what you need.','Respond to the issue with one clear request or next step.'],prompt:'A colleague criticises your work in a meeting. Respond calmly and ask for a specific example.'},
    {id:'adaptability',icon:'↻',title:'Adaptability',tag:'RESILIENCE',desc:'Adjust a plan when conditions change while keeping the goal visible.',framework:['Clarify what changed and what still matters.','Name the options and their trade-offs.','Agree on the revised plan and communicate it.'],prompt:'A key requirement changes one day before delivery. Explain how you would reset expectations.'},
    {id:'decision-making',icon:'◇',title:'Decision making',tag:'JUDGEMENT',desc:'Make a reasoned choice when time or information is limited.',framework:['Define the decision and deadline.','Compare options against two or three relevant criteria.','State the choice, uncertainty and trigger for revisiting it.'],prompt:'Choose between a quick temporary fix and a slower durable fix. Explain your reasoning.'},
    {id:'negotiation',icon:'⇄',title:'Negotiation',tag:'INFLUENCE',desc:'Find a fair agreement by understanding needs and making options explicit.',framework:['Ask what matters most to each side.','Offer options linked to those interests.','Summarise the agreement, owner and follow-up date.'],prompt:'You need more time for a task but your teammate needs an early hand-off. Explore a workable agreement.'},
    {id:'written-communication',icon:'✎',title:'Clear written communication',tag:'WORKPLACE',desc:'Write messages that state the purpose, needed context and next action.',framework:['Lead with the purpose or decision needed.','Give only the context the reader needs.','Name the action, owner and deadline.'],prompt:'Write a short message asking a teammate for a status update before a deadline.'},
    {id:'customer-service',icon:'◎',title:'Customer conversations',tag:'SERVICE',desc:'Acknowledge a concern, clarify the need and agree on a responsible next step.',framework:['Listen without interrupting and reflect the concern.','Ask a focused question and explain what you can confirm.','Agree on the next action and when you will follow up.'],prompt:'A customer is upset because an order is late. Acknowledge the concern and set a clear next step.'},
    {id:'delegation',icon:'⇢',title:'Delegation',tag:'LEADERSHIP',desc:'Hand work over with a clear outcome, decision boundaries and support.',framework:['Explain the outcome and why it matters.','Agree on ownership, deadline and decision limits.','Set a check-in and offer support without taking the task back.'],prompt:'Delegate a first draft of a team update to a colleague who has not done it before.'},
  ];
  const $ = (selector, parent=document) => parent.querySelector(selector);
  const $$ = (selector, parent=document) => [...parent.querySelectorAll(selector)];
  const safeText = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let level = levels[app.dataset.level] ? app.dataset.level : 'Basic';
  let language = app.dataset.language || 'English';
  let languageCode = languages.find(item=>item[0].toLowerCase()===language.toLowerCase())?.[1] || '';
  let languageLocale = languages.find(item=>item[0].toLowerCase()===language.toLowerCase())?.[2] || 'en-US';
  let goal = app.dataset.goal || 'Everyday conversation';
  let currentMode = app.dataset.mode || 'guided';
  let activeLesson = null;
  let activeSkill = null;
  let completed = new Map();
  let currentPromptIndex = 0;
  let timerId = null;
  let sessionSeconds = 0;
  let recognition = null;
  let sessionActive = false;
  let speechStartedAt = 0;
  const prompts = {
    free: ['Hi! Let’s practise English today. Tell me one small thing that made you smile recently.','What is something you are looking forward to this week?','Tell me about a place you would like to visit and why.'],
    guided: ['Hi! Let’s practise English today. Tell me about your day.','What is one thing you learned recently? How did you learn it?','What would you like to feel more confident doing next week?'],
    challenge: ['Quick challenge: you have five seconds to begin. What is one skill you are proud of?','Quick challenge: describe your ideal day in one clear sentence.','Quick challenge: share one opinion and a reason for it.']
  };
  const goalPrompts = {
    'Job interview':'Let’s practise for an interview. Tell me about a strength you would bring to a team.',
    'Work meetings':'Let’s practise a work meeting. What is one idea you would like your team to consider?',
    'Study abroad':'Let’s practise meeting a classmate. What are you hoping to learn this year?',
    'Travel':'Let’s practise a travel conversation. What would you ask when checking into a hotel?',
    'Giving a presentation':'Let’s practise a presentation opening. What is the main point you want your audience to remember?',
    'Everyday conversation':'Hi! Let’s practise English today. Tell me about your day.',
    'Speak with confidence':'Let’s build confidence. Tell me about something you know well.',
    'Other':'What would you like to practise today? Start wherever feels comfortable.'
  };
  function getCourse(targetLevel=level) {
    if (language.toLowerCase() === 'english') return levels[targetLevel];
    const commonNotes = [
      [`Start with a complete phrase in ${language}, then repeat it at a comfortable pace.`,`Notice which part of the phrase carries the main meaning.`,`Practise the phrase in a real situation instead of memorising it alone.`],
      [`Connect two ideas with a natural pause or a linking phrase in ${language}.`,`Give a short answer first, then add one reason or example.`,`Listen to a native-speaker example and repeat the whole phrase.`],
      [`Choose wording in ${language} that fits your audience and situation.`,`State your point, support it, and make your next step clear.`,`Record a short response and review clarity, structure and word choice.`]
    ];
    const curriculum = {
      Basic:[['First greetings','Say hello, introduce yourself and close a short exchange.','SPEAKING'],['Sounds and alphabet','Get familiar with the sounds and writing system used in this language.','PRONUNCIATION'],['Useful everyday words','Build a small vocabulary for people, places, time and needs.','VOCABULARY'],['Make a simple sentence','Practise a short sentence about yourself or your surroundings.','FOUNDATION'],['Ask and answer','Use a simple question to keep a conversation moving.','SPEAKING'],['Listen, repeat, remember','Listen to a short model phrase and practise saying it clearly.','LISTENING']],
      Intermediate:[['Describe routines and experiences','Talk about everyday habits and something that happened recently.','SPEAKING'],['Connect your ideas','Make a longer answer using examples, reasons and contrast.','FLUENCY'],['Share an opinion','State what you think and explain why.','COMMUNICATION'],['Tell a short story','Organise a story with a beginning, a change and an ending.','SPEAKING'],['Understand natural speech','Practise listening for the main idea and useful expressions.','LISTENING'],['Handle a real situation','Rehearse a travel, study or workplace conversation.','SIMULATION']],
      Advanced:[['Choose formal or informal language','Adapt your wording to a friend, colleague or professional audience.','REGISTER'],['Make a clear argument','Present a view, support it and respond to another perspective.','SPEAKING'],['Be concise and precise','Explain a complex point in a shorter, clearer way.','CLARITY'],['Present with confidence','Lead with your main point and finish with a useful next step.','PRESENTATION'],['Discuss abstract topics','Explore a complex issue while making your reasoning easy to follow.','DISCUSSION'],['Review your speaking','Reflect on clarity, structure, word choice and natural pacing.','FLUENCY']]
    };
    const phrases = localizedPrompts[languageCode];
    return {subtitle:`build ${targetLevel.toLowerCase()} ${language} skills`,lessons:curriculum[targetLevel].map((item,index)=>({id:`${language.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${targetLevel.toLowerCase()}-${index+1}`,title:item[0],desc:item[1],type:item[2],time:`${8+index%3*2} min`,notes:commonNotes[targetLevel==='Basic'?0:targetLevel==='Intermediate'?1:2],practice:phrases?.[index%phrases.length] || `Practise this in ${language}: ${item[1]}`}))};
  }
  function currentLessons() { return getCourse(level).lessons; }
  async function applyLanguageSelection() {
    const selected = $('#languageSelect').value;
    const custom = selected === '__other__';
    $('#customLanguage').hidden = !custom;
    if (custom) { $('#customLanguage').focus(); return; }
    language = selected;
    languageCode = languages.find(item=>item[0]===selected)?.[1] || '';
    languageLocale = languages.find(item=>item[0]===selected)?.[2] || 'en-US';
    refreshLanguage();
    await saveProfile();
  }
  function refreshLanguage() {
    $('#languageFeatureTitle').textContent=language;
    $$('.target-language-inline').forEach(node=>node.textContent=language);
    $('#videoLanguageLabel').textContent=language;
    const query=(subject)=>encodeURIComponent(`${language} ${level} language learning ${subject}`);
    $('#videoYouTube').href=`https://www.youtube.com/results?search_query=${query('speaking vocabulary pronunciation')}`;
    $('#videoGoogle').href=`https://www.google.com/search?tbm=vid&q=${query('language course lessons')}`;
    $('#videoTed').href=`https://www.bing.com/videos/search?q=${query('talks listening practice')}`;
    $('#allVideoResults').href=`https://www.youtube.com/results?search_query=${query('language learning lessons')}`;
    renderLessons();
  }
  const languageSelect=$('#languageSelect');
  languageSelect.innerHTML=languages.map(([name])=>name==='Other language'?'<option value="__other__">Other language…</option>':`<option>${safeText(name)}</option>`).join('');
  if (languages.some(item=>item[0].toLowerCase()===language.toLowerCase())) languageSelect.value=languages.find(item=>item[0].toLowerCase()===language.toLowerCase())[0];
  else { languageSelect.value='__other__'; $('#customLanguage').value=language; $('#customLanguage').hidden=false; }
  languageSelect.addEventListener('change',applyLanguageSelection);
  $('#customLanguage').addEventListener('change',async event=>{const value=event.target.value.trim();if(!value)return;language=value;const match=languages.find(item=>item[0].toLowerCase()===value.toLowerCase());languageCode=match?.[1]||'';languageLocale=match?.[2]||'en-US';refreshLanguage();await saveProfile();});

  function showToast(message) {
    const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealTargets = '.catalog-hero, .catalog-stats > article, .catalog-grid > *, .academy-band > *, .catalog-promos > *, .feature-card, .lesson-row, .soft-skill-card, .topic-card, .progress-summary > article, .practice-banner, .resource-card';
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  }, {threshold: 0.08});
  function revealWithin(scope = document, replay = false) {
    scope.querySelectorAll(revealTargets).forEach((item, index) => {
      if (item.classList.contains('scroll-reveal')) {
        if (!replay) return;
        revealObserver.unobserve(item);
        item.classList.remove('is-visible');
      }
      item.classList.add('scroll-reveal');
      item.style.transitionDelay = `${(index % 5) * 65}ms`;
      revealObserver.observe(item);
    });
  }
  function animateCounters(scope = document) {
    scope.querySelectorAll('[data-count-up]').forEach(item => {
      if (item.dataset.counted === 'true') return;
      const finalValue = Number(item.dataset.countUp);
      if (!Number.isFinite(finalValue) || item.dataset.countUp === '') return;
      item.dataset.counted = 'true';
      const start = performance.now();
      const initial = 0;
      if (motionQuery.matches) { item.textContent = String(finalValue); return; }
      const frame = now => {
        const progress = Math.min(1, (now - start) / 850);
        const eased = 1 - Math.pow(1 - progress, 3);
        item.textContent = String(Math.round(initial + (finalValue - initial) * eased));
        if (progress < 1) requestAnimationFrame(frame);
      };
      item.textContent = '0';
      requestAnimationFrame(frame);
    });
  }
  function animateProgressFill() {
    const fill = $('#practiceScoreFill');
    if (!fill) return;
    const progress = Math.max(0, Math.min(100, Number(fill.dataset.progressFill) || 0));
    requestAnimationFrame(() => { fill.style.width = `${progress}%`; });
  }
  revealWithin();
  animateCounters();
  animateProgressFill();
  const revealMutationObserver = new MutationObserver(() => revealWithin());
  revealMutationObserver.observe(app, {childList: true, subtree: true});
  const sidebarToggle = $('#sidebarToggle');
  const mobileLayout = window.matchMedia('(max-width: 760px)');
  function setSidebarCollapsed(collapsed) {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    sidebarToggle?.setAttribute('aria-expanded', String(!collapsed));
    sidebarToggle?.setAttribute('aria-label', collapsed ? 'Show sidebar' : 'Hide sidebar');
  }
  setSidebarCollapsed(mobileLayout.matches);
  sidebarToggle?.addEventListener('click', () => setSidebarCollapsed(!document.body.classList.contains('sidebar-collapsed')));
  mobileLayout.addEventListener?.('change', event => setSidebarCollapsed(event.matches));
  const carousel = $('#dashboardCarousel');
  if (carousel) {
    const slides = $$('.dashboard-slide', carousel);
    const dots = $$('.dashboard-dots button', carousel);
    let currentSlide = 0;
    let carouselTimer;
    const showSlide = next => {
      currentSlide = (next + slides.length) % slides.length;
      slides.forEach((slide, index) => slide.classList.toggle('active', index === currentSlide));
      dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
      const indexLabel = $('#heroIndexCurrent');
      if (indexLabel) indexLabel.textContent = String(currentSlide + 1).padStart(2, '0');
    };
    const restartCarousel = () => {
      window.clearInterval(carouselTimer);
      if (!motionQuery.matches) carouselTimer = window.setInterval(() => showSlide(currentSlide + 1), 6000);
    };
    $('#heroPrev')?.addEventListener('click', () => { showSlide(currentSlide - 1); restartCarousel(); });
    $('#heroNext')?.addEventListener('click', () => { showSlide(currentSlide + 1); restartCarousel(); });
    dots.forEach((dot, index) => dot.addEventListener('click', () => { showSlide(index); restartCarousel(); }));
    carousel.addEventListener('mouseenter', () => window.clearInterval(carouselTimer));
    carousel.addEventListener('mouseleave', restartCarousel);
    restartCarousel();
  }
  function switchSection(section) {
    const allowed = ['home','language','soft','aptitude','progress'].includes(section) ? section : 'home';
    $$('.view-panel').forEach(view => view.classList.remove('active'));
    const viewId = allowed === 'home' ? 'homeView' : allowed === 'language' ? 'languageView' : allowed === 'soft' ? 'softView' : allowed === 'aptitude' ? 'aptitudeView' : 'progressView';
    const target = $(`#${viewId}`); if (target) {
      target.classList.add('active');
      target.classList.remove('section-entering');
      void target.offsetWidth;
      target.classList.add('section-entering');
      window.setTimeout(() => target.classList.remove('section-entering'), 700);
      revealWithin(target, true);
      animateCounters(target);
    }
    $$('.side-link').forEach(link => link.classList.toggle('active', link.dataset.section === allowed));
    $('#breadcrumbCurrent').textContent = allowed === 'language' ? `${language} speaking` : allowed === 'soft' ? 'Soft skills' : allowed === 'aptitude' ? 'Aptitude & cognitive skills' : allowed === 'progress' ? 'My progress' : 'Dashboard';
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $$('.side-link,[data-section]').forEach(button => button.addEventListener('click', () => switchSection(button.dataset.section)));
  $$('.text-action[data-scroll]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.scroll).scrollIntoView({behavior:'smooth',block:'start'})));
  const date = new Intl.DateTimeFormat('en',{weekday:'short',month:'short',day:'numeric'}).format(new Date());
  $('#todayLabel').textContent = date;
  $('#levelSelect').value = level;
  $('#goalSelect').value = goal;

  function renderLessons() {
    const course = getCourse(level);
    $('#roadmapTitle').textContent = `${level} · ${course.subtitle}`;
    $('#languageScopeNote').textContent = language.toLowerCase() === 'english' ? 'English has topic-specific starter lessons. Writing drafts save only in this browser; speech recognition is a transcript, not pronunciation scoring.' : `${language} currently uses a general speaking roadmap. Grammar guidance and prompts have not been reviewed for every language; writing drafts save only in this browser.`;
    $('#lessonList').innerHTML = course.lessons.map((lesson,index) => {
      const done = completed.has(lesson.id);
      return `<button class="lesson-row ${done?'is-complete':''}" data-lesson="${lesson.id}"><span class="lesson-index">${done?'✓':String(index+1).padStart(2,'0')}</span><span class="lesson-details"><span class="lesson-type">${lesson.type}</span><strong>${lesson.title}</strong><small>${lesson.desc}</small></span><span class="lesson-duration">${lesson.time}</span><span class="lesson-open">${done?'✓':'↗'}</span></button>`;
    }).join('');
    $$('.lesson-row').forEach(row => row.addEventListener('click', () => openLesson(row.dataset.lesson)));
    $('#progressLevel').textContent = level;
    $('#progressGoal').textContent = goal;
  }
  async function saveProfile(quiet=false) {
    try {
      const response = await fetch('/api/learning/profile', {method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({language,level,goal,practice_mode:currentMode})});
      if (!response.ok) throw new Error('save failed');
      if (!quiet) showToast('Your learning plan is saved.');
      $('#progressLevel').textContent = level; $('#progressGoal').textContent = goal;
    } catch (_) { showToast('Could not save your plan. Please try again.'); }
  }
  $('#levelSelect').addEventListener('change', async event => { level = event.target.value; refreshLanguage(); await saveProfile(); });
  $('#goalSelect').addEventListener('change', async event => { goal = event.target.value; await saveProfile(); });
  $('#changeLevel').addEventListener('click', () => { $('#levelSelect').focus(); $('#levelSelect').scrollIntoView({behavior:'smooth',block:'center'}); });
  async function loadProgress() {
    try {
      const response = await fetch('/api/learning/progress'); if (!response.ok) return;
      const rows = await response.json(); completed = new Map(rows.map(row => [row.lesson_id, row.score]));
      renderLessons(); $('#progressLessons').textContent = rows.length;
      if (rows.length) $('#streakValue').textContent = `${rows.length} lesson${rows.length === 1 ? '' : 's'} completed`;
      const scored = rows.filter(row => row.score !== null);
      const average = scored.length ? Math.round(scored.reduce((sum,row)=>sum+Number(row.score),0)/scored.length) : null;
      $('#progressScore').innerHTML = average === null ? '—' : `${average}<small> / 100</small>`;
      const scoreFill = $('#practiceScoreFill');
      if (scoreFill) { scoreFill.dataset.progressFill = String(average || 0); scoreFill.style.width = `${average || 0}%`; }
    } catch (_) { /* the dashboard remains usable if progress is temporarily unavailable */ }
  }
  refreshLanguage(); loadProgress();

  function writingPracticeMarkup(key, prompt) {
    let saved = '';
    try { saved = localStorage.getItem(key) || ''; } catch (_) { /* storage may be disabled */ }
    return `<div class="writing-practice-card"><label for="writingPractice">WRITE YOUR RESPONSE</label><p>${safeText(prompt)}</p><textarea id="writingPractice" rows="4" placeholder="Write your own response here…">${safeText(saved)}</textarea><small>Saved only in this browser on this device.</small></div>`;
  }

  function bindWritingPractice(key) {
    const field = $('#writingPractice');
    if (!field) return;
    field.addEventListener('input', () => { try { localStorage.setItem(key, field.value); } catch (_) { /* keep typing available if storage is disabled */ } });
  }

  function openLesson(id) {
    const lesson = currentLessons().find(item=>item.id===id);
    if (!lesson) return;
    activeLesson = lesson; activeSkill = null; $('#completeLesson').innerHTML='Mark lesson complete <span>✓</span>';
    $('#lessonKicker').textContent = `${level.toUpperCase()} · ${lesson.type} · ${lesson.time.toUpperCase()}`;
    $('#lessonTitle').textContent = lesson.title;
    $('#lessonSummary').textContent = lesson.desc;
    const writingKey = `northstar-writing:${language}:${level}:${lesson.id}`;
    $('#lessonBody').innerHTML = `<div class="lesson-note-card"><strong>QUICK NOTES</strong><ul>${lesson.notes.map(note=>`<li>${safeText(note)}</li>`).join('')}</ul></div><div class="lesson-practice-card"><span>TRY IT OUT</span><p>${safeText(lesson.practice)}</p><button class="inline-practice" id="lessonSpeak">Practise this aloud <span>🎙</span></button></div>${writingPracticeMarkup(writingKey, `Write your answer in ${language}.`)}`;
    bindWritingPractice(writingKey);
    $('#lessonModal').hidden = false; document.body.classList.add('modal-open');
    $('#lessonSpeak').addEventListener('click', () => { closeModal('lessonModal'); $('#practiceGoal').dataset.customPrompt=lesson.practice; openPractice(lesson.practice); });
  }
  function closeModal(id) { const modal=$(`#${id}`); if(modal) modal.hidden=true; if (!$$('.modal-backdrop:not([hidden])').length) document.body.classList.remove('modal-open'); }
  $$('[data-close]').forEach(button=>button.addEventListener('click',()=>button.dataset.close==='practiceModal'?stopSession():closeModal(button.dataset.close)));
  $$('.modal-backdrop').forEach(backdrop=>backdrop.addEventListener('click',event=>{if(event.target===backdrop){if(backdrop.id==='practiceModal')stopSession();else closeModal(backdrop.id);}}));
  document.addEventListener('keydown',event=>{if(event.key==='Escape')$$('.modal-backdrop:not([hidden])').forEach(modal=>modal.id==='practiceModal'?stopSession():closeModal(modal.id));});
  $('#completeLesson').addEventListener('click', async () => {
    const itemId = activeSkill ? `soft-${activeSkill.id}` : activeLesson?.id;
    if (!itemId) return;
    try {
      const response=await fetch(`/api/learning/progress/${encodeURIComponent(itemId)}`,{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({})});
      if (!response.ok) throw new Error();
      completed.set(itemId,null); renderLessons(); closeModal('lessonModal'); activeLesson=null; activeSkill=null;
      $('#progressLessons').textContent=completed.size;
      $('#streakValue').textContent=`${completed.size} item${completed.size===1?'':'s'} completed`; showToast('Added to your learning progress.');
    } catch (_) { showToast('Could not save progress. Check your connection.'); }
  });

  function renderSkills() {
    $('#softSkillGrid').innerHTML = skills.map((skill,index)=>`<button class="soft-skill-card" data-skill="${skill.id}"><span class="skill-card-top"><span class="skill-card-icon icon-${index%4}">${skill.icon}</span><span class="skill-card-tag">${skill.tag}</span></span><strong>${skill.title}</strong><small>${skill.desc}</small><span class="skill-card-link">Learn & practise <b>↗</b></span></button>`).join('');
    $$('.soft-skill-card').forEach(card=>card.addEventListener('click',()=>openSkill(card.dataset.skill)));
  }
  function openSkill(id) {
    activeSkill=skills.find(skill=>skill.id===id); if(!activeSkill)return; activeLesson=null; $('#completeLesson').textContent='Mark this skill practised ✓';
    $('#lessonKicker').textContent=`SOFT SKILLS · ${activeSkill.tag}`;
    $('#lessonTitle').textContent=activeSkill.title;
    $('#lessonSummary').textContent=activeSkill.desc;
    const writingKey=`northstar-soft-writing:${activeSkill.id}`;
    $('#lessonBody').innerHTML=`<div class="lesson-note-card"><strong>A SIMPLE FRAMEWORK</strong><ol>${activeSkill.framework.map(item=>`<li>${safeText(item)}</li>`).join('')}</ol></div><div class="lesson-practice-card"><span>SCENARIO PRACTICE</span><p>${safeText(activeSkill.prompt)}</p><button class="inline-practice" id="skillSpeak">Rehearse this scenario <span>🎙</span></button></div>${writingPracticeMarkup(writingKey, 'Write a brief response to this scenario, then compare it with the framework above.')}`;
    bindWritingPractice(writingKey);
    $('#lessonModal').hidden=false;document.body.classList.add('modal-open');
    $('#skillSpeak').addEventListener('click',()=>{closeModal('lessonModal');$('#practiceGoal').value=activeSkill.title;currentMode='guided';openPractice(activeSkill.prompt);});
  }
  renderSkills();

  function openPractice(prompt) {
    $('#practiceModal').hidden=false; document.body.classList.add('modal-open');
    $('#sessionSetup').hidden=false; $('#liveSession').hidden=true; $('#practiceTitle').textContent='Let’s find your focus.';
    if (prompt) { $('#practiceGoal').value='Other'; $('#practiceGoal').dataset.customPrompt=prompt; }
    else delete $('#practiceGoal').dataset.customPrompt;
    $$('.mode-choice').forEach(button=>button.classList.toggle('selected',button.dataset.mode===currentMode));
  }
  $('#openPractice').addEventListener('click',()=>openPractice());
  $('#softStart').addEventListener('click',()=>{switchSection('soft');openPractice('Tell me one situation where you would like to feel more confident.');});
  $('#softScenario').addEventListener('click',()=>{switchSection('soft');openPractice('A teammate disagrees with your idea. How would you respond while keeping the conversation constructive?');});
  $$('.mode-choice').forEach(button=>button.addEventListener('click',()=>{$$('.mode-choice').forEach(item=>item.classList.remove('selected'));button.classList.add('selected');currentMode=button.dataset.mode;}));
  $('#beginSession').addEventListener('click',async()=>{
    goal=$('#practiceGoal').value; await saveProfile(true);
    $('#sessionSetup').hidden=true;$('#liveSession').hidden=false;
    $('#practiceTitle').textContent='Take your time. I’m listening.';
    $('#liveModeLabel').textContent=`${currentMode.toUpperCase()} PRACTICE · ${language.toUpperCase()}`;
    const spokenPrompts=localizedPrompts[languageCode] || prompts[currentMode];
    $('#coachPrompt').textContent=$('#practiceGoal').dataset.customPrompt || (languageCode && languageCode!=='en' ? spokenPrompts[0] : (goalPrompts[goal] || prompts[currentMode][0]));
    $('#conversationFeed').innerHTML=`<div class="coach-bubble"><span class="coach-avatar">✳</span><p id="coachPrompt">${safeText($('#coachPrompt').textContent)}</p></div>`;
    $('#transcriptBox').textContent='Your words will appear here after you finish speaking.';$('#coachFeedback').hidden=true;
    currentPromptIndex=0;$('#sessionTimer').textContent='00:00';$('#micHint').textContent='Tap the microphone when you\'re ready to speak.';
    sessionActive=true;sessionSeconds=0;clearInterval(timerId);timerId=setInterval(()=>{sessionSeconds++;$('#sessionTimer').textContent=`${String(Math.floor(sessionSeconds/60)).padStart(2,'0')}:${String(sessionSeconds%60).padStart(2,'0')}`},1000);
    speakPrompt($('#coachPrompt').textContent);
  });
  function speakPrompt(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=languageLocale;utterance.rate=.94;window.speechSynthesis.speak(utterance);
  }
  $('#listenPrompt').addEventListener('click',()=>speakPrompt($('#coachPrompt').textContent));
  function coachOnTranscript(text) {
    const clean=text.trim();
    $('#transcriptBox').textContent=clean || 'I did not catch that clearly. Try again when you are ready.';
    const words=clean.match(/[\p{L}']+/gu)||[];
    const fillers=languageCode==='en'?(clean.match(/\b(um|uh|erm|like|you know)\b/gi)||[]).length:null;
    let response='Good start—I understood your main idea. Keep going and add one more detail or example.';
    let retry=false;
    const pastCue=/\b(yesterday|last (?:night|week|month)|ago)\b/i.test(clean);
    if(languageCode==='en' && pastCue && /\bi go\b/i.test(clean)) { response='I understood you. Since you mentioned a finished time, try “I went” instead of “I go”. Say the sentence once more when you are ready.'; retry=true; }
    else if(words.length<7) response='Nice start. Can you add one more sentence explaining why or what happened next?';
    else if(languageCode==='en' && fillers>=3) response='Your idea came through. Try a short pause instead of a filler word, then continue with your next point.';
    $('#coachFeedback').innerHTML=`<span>COACHING NOTE · PRACTICE PREVIEW</span><p>${safeText(response)}</p><small>${words.length} recognized word units · ${fillers===null?'filler-word review unavailable for this language':`${fillers} English filler words`} · transcript only</small>`;
    $('#coachFeedback').hidden=false;
    $('#micHint').textContent='You can try again, or hear the next prompt.';
    speakPrompt(response);
    if (!retry && sessionActive) {
      currentPromptIndex++;
      const activePrompts=localizedPrompts[languageCode] || prompts[currentMode] || prompts.guided;
      const next = activePrompts[currentPromptIndex % activePrompts.length];
      setTimeout(() => {
        if (!sessionActive) return;
        $('#coachPrompt').textContent = next;
        const bubble=document.createElement('div'); bubble.className='coach-bubble next-coach-bubble';
        bubble.innerHTML=`<span class="coach-avatar">✳</span><p>${safeText(next)}</p>`; $('#conversationFeed').appendChild(bubble);
        speakPrompt(next); $('#micHint').textContent='Tap the microphone when you are ready to answer.';
      }, 1800);
    }
  }
  function startRecognition() {
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){$('#micHint').textContent='Speech recognition is not available here. Try the latest Chrome or Edge, or practise out loud without a transcript.';showToast('This browser does not support speech recognition.');return;}
    if(recognition){try{recognition.abort()}catch(_){}recognition=null;}
    recognition=new SpeechRecognition();recognition.lang=languageLocale;recognition.continuous=false;recognition.interimResults=true;recognition.maxAlternatives=1;
    let finalText='';
    recognition.onstart=()=>{$('#micButton').classList.add('recording');$('#micHint').textContent='Listening… Finish speaking whenever you are ready.';$('#transcriptBox').textContent='Listening to your answer…';speechStartedAt=Date.now();};
    recognition.onresult=event=>{let interim='';for(let i=event.resultIndex;i<event.results.length;i++){const text=event.results[i][0].transcript;if(event.results[i].isFinal)finalText+=text+' ';else interim+=text;}$('#transcriptBox').textContent=(finalText+interim).trim()||'Listening…';};
    recognition.onerror=event=>{$('#micHint').textContent=event.error==='not-allowed'?'Allow microphone access in your browser to practise with voice.':'I could not hear that clearly. Check your microphone and try again.';};
    recognition.onend=()=>{$('#micButton').classList.remove('recording');if(finalText.trim())coachOnTranscript(finalText);else if(sessionActive&&$('#transcriptBox').textContent==='Listening to your answer…')$('#transcriptBox').textContent='No transcript received. Try again when you are ready.';};
    try{recognition.start()}catch(_){$('#micHint').textContent='The microphone could not start. Wait a moment and try again.';}
  }
  $('#micButton').addEventListener('click',startRecognition);
  function stopSession() {
    sessionActive=false;clearInterval(timerId);if(recognition){try{recognition.abort()}catch(_){}recognition=null;}if('speechSynthesis'in window)window.speechSynthesis.cancel();closeModal('practiceModal');$('#sessionSetup').hidden=false;$('#liveSession').hidden=true;
  }
  $('#endSession').addEventListener('click',stopSession);
})();
