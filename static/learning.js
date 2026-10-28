(() => {
  const app = document.querySelector('.learn-app');
  if (!app) return;
  const themeToggle = document.querySelector('#themeToggle');
  const savedTheme = localStorage.getItem('northstar-violet-theme');
  const applyTheme = theme => {
    const isLight = theme === 'light';
    app.classList.toggle('content-light', isLight);
    document.body.dataset.theme = isLight ? 'light' : 'dark';
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = isLight ? '#f2f4f7' : '#0b1220';
    if (!themeToggle) return;
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    themeToggle.querySelector('.theme-toggle-icon').innerHTML = `<svg aria-hidden="true"><use href="/static/icons.svg?v=northstar-icons-20261028-2#icon-${isLight ? 'moon' : 'sun'}"></use></svg>`;
    themeToggle.querySelector('.theme-toggle-label').textContent = isLight ? 'Dark mode' : 'Light mode';
  };
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');
  themeToggle?.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('northstar-violet-theme', nextTheme);
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
  let situationRecognition = null;
  let activePracticeSituation = '';
  let sessionActive = false;
  let speechStartedAt = 0;
  const placementQuiz = [
    ['She ___ to work by bus every day.',['go','goes','going','is go'],1,'With he, she or it in the present simple, add -s to the verb.'],
    ['We ___ dinner when the lights went out.',['have','are having','were having','has'],2,'The past continuous describes an action in progress when another past event happened.'],
    ['I have lived here ___ 2022.',['for','since','during','from'],1,'Use since with a starting point in time; use for with a duration.'],
    ['Choose the correct question.',['Where you live?','Where do you live?','Where does you live?','Where are live you?'],1,'Use do + subject + base verb for a present simple question with you.'],
    ['If I ___ more time, I would learn another language.',['have','had','will have','am having'],1,'The second conditional uses if + past simple, then would + base verb.'],
    ['The report ___ by the team yesterday.',['finished','was finished','has finish','is finishing'],1,'Use was + past participle for a past passive sentence.'],
    ['She is interested ___ learning Japanese.',['on','at','in','for'],2,'The usual phrase is interested in + noun or gerund.'],
    ['I look forward to ___ from you.',['hear','hearing','heard','be hear'],1,'In look forward to, to is a preposition, so it takes a gerund.'],
    ['Choose the closest meaning of “reliable”.',['Easy to forget','Can be trusted','Very expensive','Recently made'],1,'Reliable means dependable or able to be trusted.'],
    ['We need to ___ a decision before Friday.',['do','make','take up','put'],1,'The natural collocation is make a decision.'],
    ['By next June, they ___ the course.',['complete','will have completed','completed','are complete'],1,'Future perfect describes something finished before a future time.'],
    ['There are ___ people in the room than before.',['less','few','fewer','little'],2,'Use fewer with countable plural nouns such as people.'],
    ['Despite ___ tired, he finished the presentation.',['be','being','was','to be'],1,'A preposition such as despite is followed by a noun or gerund.'],
    ['Choose the natural sentence.',['I am agree with you.','I agree with you.','I agreeing with you.','I do agreed with you.'],1,'Agree is a verb; it does not take am in this sentence.'],
    ['The meeting was ___ because the manager was ill.',['called off','called up','called in','called out'],0,'Call off means cancel.'],
    ['She asked me where ___.',['was the station','the station was','is the station','the station is it'],1,'In an indirect question, use statement word order: subject before verb.'],
    ['You ___ wear a seat belt; it is the law.',['might','must','would','could'],1,'Must expresses a strong obligation.'],
    ['I wish I ___ speak French fluently.',['can','will','could','am able'],2,'Use wish + past form to describe a present ability you do not have.'],
    ['The new policy will ___ everyone in the department.',['effect','affect','effective','affection'],1,'Affect is the verb meaning to influence.'],
    ['Not only ___ late, but he also forgot the documents.',['he arrived','did he arrive','he did arrive','arrived he'],1,'After fronted not only, use auxiliary + subject inversion.']
  ].map(([q, options, answer, why]) => ({q, options, answer, why}));
  const placementSentences = [
    ['Which sentence describes a regular routine?',['I usually walk to work.','I usually walks to work.','Usually I am walk to work.','I walk usually yesterday to work.'],0,'Use the base verb with I for a present simple routine.'],
    ['Which sentence describes an action happening now?',['She talks on the phone now.','She is talking on the phone now.','She talking on the phone now.','She are talking on the phone now.'],1,'Use am/is/are + verb-ing for an action happening now.'],
    ['Which sentence correctly describes yesterday?',['We visit the museum yesterday.','We visited the museum yesterday.','We have visit the museum yesterday.','We were visit the museum yesterday.'],1,'Use the past simple with a finished time such as yesterday.'],
    ['Which sentence uses a starting point in time?',['I have worked here since 2022.','I have worked here for 2022.','I work here since 2022.','I am working here since 2022.'],0,'Use since before a starting point.'],
    ['Which is a correctly formed question?',['Where you bought that book?','Where did you buy that book?','Where did you bought that book?','Where bought you that book?'],1,'Use did + subject + base verb in a past simple question.'],
    ['Which sentence has a correct negative form?',['He does not likes coffee.','He do not like coffee.','He does not like coffee.','He not like coffee.'],2,'After does not, use the base verb.'],
    ['Which sentence gives polite advice?',['You should to rest today.','You should rest today.','You should resting today.','You should rested today.'],1,'A modal such as should is followed by the base verb.'],
    ['Which sentence uses the passive correctly?',['The bridge built in 1990.','The bridge was built in 1990.','The bridge was build in 1990.','The bridge is builded in 1990.'],1,'The past passive uses was/were + past participle.'],
    ['Which sentence expresses an unreal possibility?',['If I had more time, I would travel.','If I have more time, I would travelled.','If I will have time, I travel.','If I had more time, I will travelled.'],0,'Use if + past simple, then would + base verb for this second conditional.'],
    ['Which sentence is correct after “I look forward to”?',['I look forward to meet you.','I look forward meeting you.','I look forward to meeting you.','I look forward to met you.'],2,'Here, to is a preposition, so use a gerund.'],
    ['Which is a correct indirect question?',['Could you tell me where is the station?','Could you tell me where the station is?','Could you tell me where does the station be?','Could you tell where the station?'],1,'Indirect questions use statement word order.'],
    ['Which sentence correctly compares two groups of people?',['There are less students today.','There are fewer students today.','There is fewer students today.','There are fewest students than today.'],1,'Use fewer with countable plural nouns.'],
    ['Which sentence uses a relative pronoun correctly?',['The woman which called is my manager.','The woman who called is my manager.','The woman whose called is my manager.','The woman who she called is my manager.'],1,'Use who for a person performing the action.'],
    ['Which sentence uses an article naturally?',['She is an university student.','She is a university student.','She is university student.','She is the university student by profession.'],1,'University begins with a “you” consonant sound, so use a.'],
    ['Which sentence places the adverb naturally?',['He carefully checked the figures.','He checked carefully the figures.','Carefully he the figures checked.','He the figures checked carefully them.'],0,'The adverb naturally comes before the main verb here.'],
    ['Which sentence uses contrast correctly?',['Although it was raining, we went for a walk.','Although it was raining, but we went for a walk.','Despite it was raining, we went for a walk.','Although raining, we went for a walk it.'],0,'Although introduces a clause; do not add but to the same clause.'],
    ['Which sentence correctly uses “already”?',['I have already sent the email.','I already have send the email.','I have send already the email.','I am already sent the email.'],0,'Use have + past participle, with already before the participle phrase.'],
    ['Which sentence reports a past statement correctly?',['She said that she was tired.','She said that she is tired yesterday.','She said me that tired.','She told that she was tired to me.'],0,'Say + that-clause reports the statement; backshift is common in past reporting.'],
    ['Which sentence uses the future perfect?',['By June, I will finish the course.','By June, I will have finished the course.','By June, I have finished the course.','By June, I will be finish the course.'],1,'Use will have + past participle for an action completed before a future time.'],
    ['Which sentence correctly uses “not only”?',['Not only she arrived late, but she forgot her notes.','Not only did she arrive late, but she also forgot her notes.','Not only did she arrived late, but forgot notes.','Not only she did arrive late but also forgot notes.'],1,'Fronted not only takes auxiliary-subject inversion.']
  ].map(([q, options, answer, why]) => ({q, options, answer, why}));
  const placementConversation = [
    ['You meet a new colleague. How do you introduce yourself?',['What are you doing here?','Hi, I’m Sam. I’ve just joined the design team.','You must know my name.','I am called by Sam yesterday.'],1,'A friendly greeting and a short introduction fit a first meeting.'],
    ['A friend says, “Would you like some tea?” You want some.',['Yes, I would, please.','I like tea yesterday.','You must tea.','No, I am.'],0,'“Yes, I would, please” is a polite response to an offer.'],
    ['You did not hear a name. What is a polite reply?',['Speak again now.','Could you say your name again, please?','What name you said?','I don’t listen.'],1,'Ask politely with could you and a clear request.'],
    ['You arrive 10 minutes late. What should you say?',['You waited too long.','Sorry I’m late; thank you for waiting.','I late because traffic.','Forget the time.'],1,'Apologise briefly and acknowledge the other person’s time.'],
    ['A shop assistant asks if you need help. You are browsing.',['No, thank you. I’m just looking.','I look you.','Help is not.','I am seeing.'],0,'This is the natural polite way to say you do not need help yet.'],
    ['You want directions to the station.',['Station where going?','Excuse me, could you tell me how to get to the station?','You tell station now.','I want station yesterday.'],1,'A polite opening plus could you tell me makes a clear request.'],
    ['Your classmate explains an idea. You want clarification.',['What do you mean by that? Could you give an example?','That is bad.','Stop talking.','I not know it.'],0,'A focused clarification request keeps the conversation constructive.'],
    ['You disagree in a meeting.',['That makes no sense.','I see your point. Could we also consider another option?','You are wrong always.','No, because.'],1,'Acknowledge the view, then offer another perspective respectfully.'],
    ['A colleague helped you finish a task.',['You had to do that.','Thanks for your help; it made a real difference.','I finished because you.','Good, leave.'],1,'A specific thank-you clearly recognises the help.'],
    ['You need more time for a deadline.',['I cannot do it.','Could we move the deadline to Thursday? I need one more day to check the figures.','Deadline is wrong.','Maybe later.'],1,'Make a clear request and give a short reason.'],
    ['Someone asks, “How was your weekend?”',['It was relaxing, thanks. I visited my cousins.','Weekend is two days.','I am weekend.','You ask me yesterday.'],0,'Answer the question and add one relevant detail.'],
    ['You want to join a conversation.',['Can I add something to that point?','You stop now.','I speaking after.','Listen for me.'],0,'This phrase politely signals that you would like to contribute.'],
    ['You made a mistake in a shared document.',['I didn’t do anything.','I spotted an error in my section and have corrected it.','Someone has to fix that.','It is not important.'],1,'Take responsibility and state what you did to fix it.'],
    ['A customer is upset about a delay.',['That is not my problem.','I understand the delay is frustrating. I’ll check the status and update you by 3 p.m.','Calm down first.','Wait here.'],1,'Recognise the concern and give a specific next step and time.'],
    ['You need to end a conversation politely.',['I have to go now. It was lovely speaking with you.','Leave me.','This is finished.','I go.'],0,'A brief reason and a warm closing make a polite ending.'],
    ['You are unsure about an instruction.',['I’ll start, but could you clarify which file to use?','I don’t do unclear tasks.','You explain badly.','I guess any file.'],0,'Ask a specific question before acting on an unclear instruction.'],
    ['A friend shares good news.',['That sounds wonderful—congratulations!','Why tell me?','It is normal.','I heard something.'],0,'A positive acknowledgement and congratulations suit good news.'],
    ['You want to suggest a meeting time.',['Are you free to meet on Tuesday afternoon?','We meet Tuesday now.','You have Tuesday.','Meeting is Tuesday, yes?'],0,'A direct but polite question checks the other person’s availability.'],
    ['You did not understand a joke.',['I don’t get it—what does that mean?','That is not funny.','Explain all now.','I am not understanding yesterday.'],0,'An honest, neutral clarification keeps the interaction comfortable.'],
    ['You finish speaking and want the other person’s view.',['That is my view. What do you think?','I finished, go.','You agree with me.','No more questions.'],0,'Invite the other person to respond with an open question.']
  ].map(([q, options, answer, why]) => ({q, options, answer, why}));
  let placement = null;
  const vocabularyWords = [
    ['People','colleague','a person you work with','My colleague helped me prepare for the meeting.'],['People','neighbour','a person living near you','Our neighbour speaks three languages.'],['People','customer','a person who buys a product or service','The customer asked for more information.'],['People','audience','the people watching or listening','The audience asked thoughtful questions.'],['People','relative','a person in your family','A relative is visiting us this weekend.'],
    ['Everyday','appointment','an arranged time to meet someone','I have a dentist appointment at noon.'],['Everyday','nearby','not far away','There is a pharmacy nearby.'],['Everyday','borrow','to use something and return it later','May I borrow your umbrella?'],['Everyday','enough','as much or as many as needed','We have enough time to review this.'],['Everyday','usually','most of the time','I usually walk to the station.'],
    ['Travel','platform','the area beside a railway track where passengers wait','Our train leaves from platform four.'],['Travel','reservation','an arrangement to keep a seat or room','I made a reservation for two nights.'],['Travel','luggage','bags and cases used while travelling','Please keep your luggage with you.'],['Travel','destination','the place someone is travelling to','Kyoto is our final destination.'],['Travel','boarding','getting onto a plane, ship or train','Boarding begins in twenty minutes.'],
    ['Work','deadline','the latest time something must be finished','The deadline for the draft is Friday.'],['Work','feedback','comments that help someone improve','Her feedback helped me make the report clearer.'],['Work','prioritise','to decide what is most important first','Let’s prioritise the urgent customer requests.'],['Work','schedule','a plan showing when things will happen','I’ll check my schedule and confirm.'],['Work','collaborate','to work together with other people','The teams collaborate on product research.'],
    ['Study','review','to study something again','I review new words before the lesson.'],['Study','evidence','information that helps show whether something is true','The essay uses evidence from two studies.'],['Study','summarise','to give the main points briefly','Can you summarise the chapter in a few lines?'],['Study','assignment','a piece of work given to a student','Our assignment is due next Monday.'],['Study','accurate','correct and free from mistakes','Check that the dates are accurate.'],
    ['Feelings','confident','feeling sure about your ability','I feel more confident after practising.'],['Feelings','relieved','feeling less worried after difficulty','She was relieved when the exam ended.'],['Feelings','curious','wanting to learn or know more','The children were curious about the map.'],['Feelings','frustrated','annoyed because something is difficult','I felt frustrated but tried another method.'],['Feelings','grateful','feeling thankful','I’m grateful for your patient explanation.']
  ].map(([category, word, meaning, example]) => ({category, word, meaning, example}));
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
    if (language.toLowerCase() === 'english') return window.NORTHSTAR_ENGLISH_GRAMMAR?.[targetLevel] || levels[targetLevel];
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
    const englishCourse = language.toLowerCase() === 'english';
    const previousLevel = level;
    $('#levelSelect').disabled = !englishCourse;
    if (!englishCourse) { level = 'Basic'; $('#levelSelect').value = 'Basic'; }
    else $('#levelSelect').value = level;
    if (!englishCourse && previousLevel !== 'Basic') saveProfile(true);
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
  const languageFlags={'Arabic':'🇸🇦','Bengali':'🇧🇩','Chinese (Mandarin)':'🇨🇳','Dutch':'🇳🇱','English':'🇬🇧','French':'🇫🇷','German':'🇩🇪','Greek':'🇬🇷','Gujarati':'🇮🇳','Hebrew':'🇮🇱','Hindi':'🇮🇳','Indonesian':'🇮🇩','Italian':'🇮🇹','Japanese':'🇯🇵','Kannada':'🇮🇳','Korean':'🇰🇷','Malayalam':'🇮🇳','Marathi':'🇮🇳','Nepali':'🇳🇵','Persian':'🇮🇷','Polish':'🇵🇱','Portuguese':'🇵🇹','Punjabi':'🇮🇳','Russian':'🇷🇺','Spanish':'🇪🇸','Swahili':'🇰🇪','Tamil':'🇮🇳','Telugu':'🇮🇳','Thai':'🇹🇭','Turkish':'🇹🇷','Ukrainian':'🇺🇦','Urdu':'🇵🇰','Vietnamese':'🇻🇳'};
  const languageHints={'English':'Build clear, natural English','Spanish':'Hola, ¿cómo estás?','French':'Bonjour !','German':'Hallo!','Japanese':'こんにちは','Chinese (Mandarin)':'你好','Hindi':'नमस्ते','Other language':'Add your own language'};
  const languagePicker=$('#languagePicker'), languageMenu=$('#languagePickerMenu'), languageTrigger=$('#languagePickerTrigger'), languageOptions=$('#languagePickerOptions'), languageSearch=$('#languagePickerSearch'), languageMore=$('#languagePickerMore');
  let showAllLanguages=false;
  function renderLanguagePicker(filter='') {
    const current=languageSelect.value==='__other__'?(language==='Other language'?'Other language':language):languageSelect.value;
    const normalized=filter.trim().toLocaleLowerCase();
    const featuredLanguages=['English','Spanish','French','German','Japanese','Chinese (Mandarin)'];
    const entries=languages.filter(([name])=>name!=='Other language'||showAllLanguages||normalized).filter(([name])=>!normalized||name.toLocaleLowerCase().includes(normalized)).sort((a,b)=>{const ai=featuredLanguages.indexOf(a[0]),bi=featuredLanguages.indexOf(b[0]);return (ai<0?99:ai)-(bi<0?99:bi)||a[0].localeCompare(b[0]);});
    const visible=normalized||showAllLanguages?entries:entries.slice(0,6);
    languageOptions.innerHTML=visible.map(([name])=>{const flag=languageFlags[name]||'🌐';const hint=languageHints[name]||`Start learning ${name}`;const selected=name===current;return `<button class="language-option${selected?' is-selected':''}" type="button" role="option" aria-selected="${selected}" data-language-option="${safeText(name)}"><span class="language-option-flag">${flag}</span><span class="language-option-copy"><strong>${safeText(name)}</strong><small>${safeText(hint)}</small></span><span class="language-option-arrow">›</span></button>`;}).join('')||'<p class="language-picker-empty">No languages found. Try another search.</p>';
    languageMore.hidden=!!normalized||languages.length<=6||showAllLanguages;
  }
  function syncLanguagePicker() {
    const selected=languageSelect.value==='__other__'?(language==='Other language'?'Other language':language):languageSelect.value;
    $('#languageCurrentFlag').textContent=languageFlags[selected]||'🌐';
    $('#languageCurrentName').textContent=selected;
    $('#languageCurrentHint').textContent=languageHints[selected]||`Start learning ${selected}`;
    renderLanguagePicker(languageSearch.value);
  }
  renderLanguagePicker(); syncLanguagePicker();
  const languageScene=$('#languageScene');
  if(languageScene){
    const imageUrl=$('.language-scene-image',languageScene).getAttribute('src');
    const layerBase=imageUrl.slice(0,imageUrl.lastIndexOf('/')+1)+'layers/';
    const motionParts=[
      {name:'robot',box:[57.3,14.5,12.2,74],duration:5.8,delay:-1,x:'2px',y:'-5px',tilt:'-.45deg'},
      {name:'great-job-bubble',box:[69.8,11.5,8.7,25],duration:4.4,delay:-2,x:'-2px',y:'-5px',tilt:'-.7deg'},
      {name:'checklist',box:[71,42,9.5,45],duration:5.2,delay:-4,x:'2px',y:'-3px',tilt:'.25deg'},
      {name:'hello-left-bubble',box:[43,9,6.5,16],duration:4.8,delay:-1.5,x:'-2px',y:'-5px',tilt:'.7deg'},
      {name:'namaste-bubble',box:[48.3,31,6.5,16],duration:5,delay:-.8,x:'2px',y:'-5px',tilt:'.6deg'},
      {name:'hola-bubble',box:[43.2,53.5,6.2,15.5],duration:4.6,delay:-2.6,x:'-2px',y:'-5px',tilt:'-.6deg'},
      {name:'bonjour-bubble',box:[47.2,75,8.6,17.5],duration:4.7,delay:-1.2,x:'-2px',y:'-5px',tilt:'-.6deg'},
      {name:'hello-right-bubble',box:[88.2,10,7,16.5],duration:4.2,delay:-2.3,x:'-2px',y:'-5px',tilt:'-.6deg'},
      {name:'japanese-bubble',box:[87,38,10.5,19],duration:5.6,delay:-4,x:'2px',y:'-5px',tilt:'.6deg'},
      {name:'chinese-bubble',box:[87.8,68,6.7,17],duration:4.5,delay:-2.7,x:'-2px',y:'-5px',tilt:'-.7deg'},
      {name:'left-sparkle',box:[41.8,89,1.2,5],duration:3.9,delay:-.5,x:'1px',y:'-4px',tilt:'0deg'},
      {name:'mid-sparkle',box:[55.7,11,1.5,5],duration:4.3,delay:-2,x:'-1px',y:'-3px',tilt:'0deg'},
      {name:'right-sparkle',box:[85,82,1.5,5],duration:4.1,delay:-1.6,x:'1px',y:'-4px',tilt:'0deg'}
    ];
    const layers=$('.language-motion-parts',languageScene);
    motionParts.forEach(part=>{const layer=document.createElement('div');layer.className=`language-motion-part motion-${part.name}`;layer.style.left=`${part.box[0]}%`;layer.style.top=`${part.box[1]}%`;layer.style.width=`${part.box[2]}%`;layer.style.height=`${part.box[3]}%`;layer.style.backgroundImage=`url("${layerBase}${part.name}.png?v=20261027-v4")`;layer.style.animationDuration=`${part.duration}s`;layer.style.animationDelay=`${part.delay}s`;layer.style.setProperty('--part-x',part.x);layer.style.setProperty('--part-y',part.y);layer.style.setProperty('--part-tilt',part.tilt);layers.append(layer);});
  }
  languageTrigger.addEventListener('click',()=>{const open=languageTrigger.getAttribute('aria-expanded')==='true';languageMenu.hidden=open;languageTrigger.setAttribute('aria-expanded',String(!open));if(!open){renderLanguagePicker(languageSearch.value);languageSearch.focus();}});
  languageOptions.addEventListener('click',event=>{const option=event.target.closest('[data-language-option]');if(!option)return;const name=option.dataset.languageOption;languageSelect.value=name==='Other language'?'__other__':name;languageMenu.hidden=true;languageTrigger.setAttribute('aria-expanded','false');languageSearch.value='';showAllLanguages=false;syncLanguagePicker();languageSelect.dispatchEvent(new Event('change',{bubbles:true}));});
  languageSearch.addEventListener('input',()=>renderLanguagePicker(languageSearch.value));
  languageMore.addEventListener('click',()=>{showAllLanguages=true;renderLanguagePicker();languageOptions.scrollTop=0;languageSearch.focus();});
  languageSelect.addEventListener('change',()=>{syncLanguagePicker();applyLanguageSelection();});
  document.addEventListener('click',event=>{if(!languagePicker.contains(event.target)){languageMenu.hidden=true;languageTrigger.setAttribute('aria-expanded','false');}});
  languagePicker.addEventListener('keydown',event=>{if(event.key==='Escape'){languageMenu.hidden=true;languageTrigger.setAttribute('aria-expanded','false');languageTrigger.focus();}});
  $('#customLanguage').addEventListener('change',async event=>{const value=event.target.value.trim();if(!value)return;language=value;const match=languages.find(item=>item[0].toLowerCase()===value.toLowerCase());languageCode=match?.[1]||'';languageLocale=match?.[2]||'en-US';syncLanguagePicker();refreshLanguage();await saveProfile();});

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
  setSidebarCollapsed(false);
  sidebarToggle?.addEventListener('click', () => setSidebarCollapsed(!document.body.classList.contains('sidebar-collapsed')));
  mobileLayout.addEventListener?.('change', event => { if (!event.matches) setSidebarCollapsed(false); });
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

  function renderPlacementQuestion() {
    if (!placement) return;
    const item = placement.items[placement.index];
    $('#placementModeLabel').textContent = `${placement.label} · ENGLISH`;
    $('#placementQuestionTitle').textContent = `Question ${placement.index + 1} of ${placement.items.length}`;
    $('#placementProgressFill').style.width = `${((placement.index + 1) / placement.items.length) * 100}%`;
    $('#placementStem').textContent = item.q;
    $('#placementOptions').innerHTML = item.options.map((option, index) => `<button class="placement-option${placement.answers[placement.index] === index ? ' selected' : ''}" type="button" data-placement-option="${index}"><span>${String.fromCharCode(65 + index)}</span>${safeText(option)}</button>`).join('');
    $('#placementOptions').querySelectorAll('[data-placement-option]').forEach(button => button.addEventListener('click', () => {
      placement.answers[placement.index] = Number(button.dataset.placementOption);
      $('#placementOptions').querySelectorAll('.placement-option').forEach(option => option.classList.toggle('selected', option === button));
      $('#placementNext').disabled = false;
      $('#placementStatus').textContent = 'Answer saved for this question.';
    }));
    $('#placementNext').textContent = placement.index === placement.items.length - 1 ? 'Submit test →' : 'Next question →';
    $('#placementNext').disabled = placement.answers[placement.index] === null;
    $('#placementStatus').textContent = placement.answers[placement.index] === null ? 'Choose an answer to continue.' : 'Answer saved for this question.';
  }
  function finishPlacement() {
    const score = placement.items.reduce((sum, item, index) => sum + (placement.answers[index] === item.answer ? 1 : 0), 0);
    const suggested = score >= 16 ? 'Advanced' : score >= 9 ? 'Intermediate' : 'Basic';
    const review = placement.items.map((item, index) => {
      const chosen = placement.answers[index];
      const correct = chosen === item.answer;
      return `<article class="placement-review-item ${correct ? 'is-correct' : 'is-incorrect'}"><strong>${index + 1}. ${safeText(placement.kind === 'sentences' ? item.q : item.q)}</strong><p>Your answer: ${chosen === null ? 'Not answered' : safeText(item.options[chosen])}</p>${!correct ? `<p>Correct answer: ${safeText(item.options[item.answer])}</p>` : ''}<small>${safeText(item.why)}</small></article>`;
    }).join('');
    $('#placementResults').innerHTML = `<div class="placement-result-summary"><strong>${score} / 20</strong><span>Suggested starting level: <b>${suggested}</b></span><button type="button" class="quiet-button" id="applySuggestedLevel">Use ${suggested} level</button></div><p>Review every answer below. This is a short English placement estimate, not a formal proficiency certificate.</p><div class="placement-review-list">${review}</div>`;
    $('#placementResults').hidden = false;
    $('#placementNext').hidden = true;
    $('#placementOptions').hidden = true;
    $('#placementStem').hidden = true;
    $('#placementStatus').textContent = `Test complete · ${score} correct out of 20.`;
    $('#applySuggestedLevel').addEventListener('click', async () => {
      level = suggested; $('#levelSelect').value = level; refreshLanguage(); await saveProfile();
      showToast(`Your learning level is now ${level}.`);
    });
  }
  $$('.placement-type').forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.placement;
    const englishOnly = languageCode === 'en';
    if (!englishOnly) { showToast('Reviewed placement tests are currently available for English only.'); return; }
    const items = kind === 'conversation' ? placementConversation : kind === 'sentences' ? placementSentences : placementQuiz;
    placement = {kind, label:kind === 'quiz' ? 'Grammar & vocabulary' : kind === 'sentences' ? 'Sentence building' : 'Conversation choices', items, index:0, answers:Array(items.length).fill(null)};
    $('#placementSession').hidden = false; $('#placementResults').hidden = true; $('#placementNext').hidden = false;
    $('#placementOptions').hidden = false; $('#placementStem').hidden = false;
    $('#placementSession').scrollIntoView({behavior:'smooth', block:'start'}); renderPlacementQuestion();
  }));
  $('#placementNext').addEventListener('click', () => {
    if (!placement || placement.answers[placement.index] === null) return;
    if (placement.index === placement.items.length - 1) finishPlacement();
    else { placement.index++; renderPlacementQuestion(); }
  });
  $('#placementExit').addEventListener('click', () => { placement = null; $('#placementSession').hidden = true; });

  const translationChoices=languages.filter(([,code])=>code).map(([name,code])=>`<option value="${safeText(code)}">${safeText(name)}</option>`).join('');
  $('#translateFrom').innerHTML=translationChoices;
  $('#translateTo').innerHTML=translationChoices;
  $('#translateFrom').value='en';$('#translateTo').value='hi';
  $('#translateSwap').addEventListener('click', () => { const from=$('#translateFrom'),to=$('#translateTo'); const old=from.value;from.value=to.value;to.value=old; });
  $('#translateLearningLanguage').addEventListener('click', () => {
    const targetCode = languageCode || 'en';
    if ([...$('#translateTo').options].some(option => option.value === targetCode)) $('#translateTo').value = targetCode;
    else $('#translateOutput').textContent = `${language} is not in the translator's current language list.`;
  });
  $('#translateButton').addEventListener('click', async () => {
    const text=$('#translateInput').value.trim(); if(!text){$('#translateOutput').textContent='Enter a word or sentence first.';return;}
    if(new TextEncoder().encode(text).length>500){$('#translateOutput').textContent='This translation service accepts up to 500 bytes at a time. Shorten the text and try again.';return;}
    const from=$('#translateFrom').value, to=$('#translateTo').value;
    if(from===to){$('#translateOutput').textContent='Choose two different languages.';return;}
    $('#translateButton').disabled=true;$('#translateOutput').textContent='Translating…';
    try {
      const pair=`${from}|${to}`;
      const response=await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`);
      if(!response.ok) throw new Error('translation unavailable');
      const data=await response.json();
      const translated=data?.responseData?.translatedText;
      if(!translated || data.responseStatus !== 200) throw new Error('translation unavailable');
      $('#translateOutput').textContent=translated;
    } catch (_) { $('#translateOutput').textContent='Translation could not be reached. Check your connection and try again.'; }
    finally { $('#translateButton').disabled=false; }
  });
  $('#translateInput').addEventListener('keydown', event => {if((event.ctrlKey||event.metaKey)&&event.key==='Enter')$('#translateButton').click();});

  const vocabularyKey='northstar-vocabulary-progress';
  const loadVocabularyProgress=()=>{try{return JSON.parse(localStorage.getItem(vocabularyKey)||'{}')}catch(_){return {}}};
  let vocabularyProgress=loadVocabularyProgress();
  $('#vocabularyGoal').value=String(vocabularyProgress.goal||10);
  function renderVocabulary() {
    const category=$('#vocabularyCategory').value, query=$('#vocabularySearch').value.trim().toLowerCase();
    const today=new Date().toISOString().slice(0,10), dayWords=Object.keys(vocabularyProgress.learned||{}).filter(word=>vocabularyProgress.learned[word]===today).length;
    const target=Number($('#vocabularyGoal').value||10);
    $('#vocabularyDaily').textContent=`Today: ${dayWords} of ${target} words marked learned · Goal: ${target} words`;
    $('#vocabularyProgressFill').style.width=`${Math.min(100,Math.round(dayWords/target*100))}%`;
    const rows=vocabularyWords.filter(item=>(category==='all'||item.category===category)&&(!query||`${item.word} ${item.meaning} ${item.category}`.toLowerCase().includes(query)));
    $('#vocabularyList').innerHTML=rows.map(item=>`<article class="vocabulary-word"><div><span class="vocabulary-category">${safeText(item.category)}</span><strong>${safeText(item.word)}</strong><p>${safeText(item.meaning)}</p><small>${safeText(item.example)}</small></div><button type="button" class="vocabulary-learned${vocabularyProgress.learned?.[item.word]===today?' is-learned':''}" data-vocabulary-learn="${safeText(item.word)}">${vocabularyProgress.learned?.[item.word]===today?'Learned ✓':'Mark learned'}</button></article>`).join('') || '<p class="vocabulary-empty">No starter words match. Press Enter to look this word up in the online English dictionary.</p>';
    $$('.vocabulary-learned').forEach(button=>button.addEventListener('click',()=>{vocabularyProgress.learned ||= {};const word=button.dataset.vocabularyLearn;if(vocabularyProgress.learned[word]===today)delete vocabularyProgress.learned[word];else vocabularyProgress.learned[word]=today;vocabularyProgress.goal=target;localStorage.setItem(vocabularyKey,JSON.stringify(vocabularyProgress));renderVocabulary();}));
  }
  async function lookupVocabulary() {
    const query=$('#vocabularySearch').value.trim(); if(!query)return;
    const matches=vocabularyWords.some(item=>`${item.word} ${item.meaning}`.toLowerCase().includes(query.toLowerCase())); if(matches){renderVocabulary();return;}
    $('#vocabularyList').innerHTML='<p class="vocabulary-empty">Looking up this English word…</p>';
    try {
      const response=await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query)}`); if(!response.ok)throw new Error();
      const data=await response.json(); const entry=data[0], meanings=(entry.meanings||[]).slice(0,5);
      $('#vocabularyList').innerHTML=`<article class="vocabulary-word dictionary-result"><div><span class="vocabulary-category">ONLINE DICTIONARY · ${safeText(entry.word||query)}</span>${meanings.map(meaning=>`<strong>${safeText(meaning.partOfSpeech||'Meaning')}</strong>${(meaning.definitions||[]).slice(0,3).map(def=>`<p>${safeText(def.definition||'')}${def.example?`<small class="dictionary-example">Example: ${safeText(def.example)}</small>`:''}</p>`).join('')}`).join('')}</div></article>`;
    } catch (_) { $('#vocabularyList').innerHTML='<p class="vocabulary-empty">No entry found or the online dictionary is unavailable. Try another spelling or search the starter list.</p>'; }
  }
  $('#vocabularyCategory').addEventListener('change',renderVocabulary);
  $('#vocabularyGoal').addEventListener('change',()=>{vocabularyProgress.goal=Number($('#vocabularyGoal').value);localStorage.setItem(vocabularyKey,JSON.stringify(vocabularyProgress));renderVocabulary();});
  $('#vocabularySearch').addEventListener('input',renderVocabulary);
  $('#vocabularySearch').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();lookupVocabulary();}});
  $('#vocabularyLookup').addEventListener('click',lookupVocabulary);
  renderVocabulary();
  const writingDraftKey=`northstar-writing-studio:${language}`;
  $('#writingStudioInput').value=localStorage.getItem(writingDraftKey)||'';
  $('#writingStudioInput').addEventListener('input',()=>{try{localStorage.setItem(writingDraftKey,$('#writingStudioInput').value)}catch(_){}});
  $('#writingPromptSelect').addEventListener('change',()=>{const prompts={routine:'Describe your daily routine.',person:'Describe someone you admire and explain why.',travel:'Write about a place you want to visit.',work:'Explain a goal you have at work or school.',opinion:'Share an opinion and give one reason.'};$('#writingStudioFeedback').hidden=true;$('#writingStudioInput').setAttribute('aria-label',prompts[$('#writingPromptSelect').value]);});
  $('#reviewWriting').addEventListener('click',()=>{
    if(languageCode!=='en'){showToast('Writing review checks are currently available for English only.');return;}
    const text=$('#writingStudioInput').value.trim(), sentences=text.split(/[.!?]+/).map(item=>item.trim()).filter(Boolean), words=text.match(/[\p{L}'’-]+/gu)||[], notes=[];
    if(!text){$('#writingStudioFeedback').innerHTML='<strong>Write a few sentences first.</strong><p>Choose a prompt above and start with your own words.</p>';$('#writingStudioFeedback').hidden=false;return;}
    if(/^[a-z]/.test(text))notes.push('Start your first sentence with a capital letter.');
    if(!/[.!?]["')\]]?\s*$/.test(text))notes.push('Add a full stop, question mark or exclamation mark at the end.');
    if(sentences.length<Number($('#writingSentenceGoal').value))notes.push(`You wrote ${sentences.length} sentence${sentences.length===1?'':'s'}; your goal is ${$('#writingSentenceGoal').value}. Add another detail or example.`);
    if(/\bi am agree\b/i.test(text))notes.push('Try “I agree” (without “am”).');
    if(/\bshe go\b/i.test(text))notes.push('For she/he/it in the present simple, write “she goes”.');
    if(/\byesterday\b/i.test(text)&&/\bi go\b/i.test(text))notes.push('For a finished event, use “I went” instead of “I go”.');
    if(!notes.length)notes.push('Good draft structure. Read it aloud once and check that each sentence supports your prompt.');
    const promptText=$('#writingPromptSelect').selectedOptions[0].textContent;
    $('#writingStudioFeedback').innerHTML=`<strong>Writing review · ${safeText(promptText)}</strong><p>${words.length} words · ${sentences.length} sentence${sentences.length===1?'':'s'}</p><ul>${notes.map(note=>`<li>${safeText(note)}</li>`).join('')}</ul><small>These are simple English checks, not a full grammar or fluency assessment.</small>`;
    $('#writingStudioFeedback').hidden=false;
  });
  const date = new Intl.DateTimeFormat('en',{weekday:'short',month:'short',day:'numeric'}).format(new Date());
  $('#todayLabel').textContent = date;
  $('#levelSelect').value = level;
  $('#goalSelect').value = goal;

  function renderLessons() {
    const course = getCourse(level);
    $('#roadmapTitle').textContent = `${level} · ${course.subtitle}`;
    $('#languageScopeNote').textContent = language.toLowerCase() === 'english' ? 'English grammar and speaking topics are explained in Hindi and English, with a practice quiz and topic video search in each lesson. The roadmap follows beginner, intermediate and advanced stages; use the linked references for further detail.' : `${language} uses a basic starter roadmap only. Detailed grammar explanations, reviewed quizzes and topic video searches are currently provided for English. Writing drafts save only in this browser.`;
    const lessonIcons={SPEAKING:'chat',COMMUNICATION:'chat',SIMULATION:'chat',PRESENTATION:'video',PRONUNCIATION:'audio',VOCABULARY:'book',GRAMMAR:'book-open',FOUNDATION:'layers',LISTENING:'headphones',WRITING:'pencil',READING:'book-open',FLUENCY:'chat'};
    $('#lessonList').innerHTML = course.lessons.map((lesson,index) => {
      const done = completed.has(lesson.id);
      const icon=lessonIcons[lesson.type]||'book-open';
      return `<button class="lesson-row ${done?'is-complete':''}" data-lesson="${lesson.id}"><span class="lesson-index"><svg aria-hidden="true"><use href="/static/icons.svg?v=northstar-icons-20261028-2#icon-${icon}"></use></svg><i>${String(index+1).padStart(2,'0')}</i></span><span class="lesson-details"><span class="lesson-type">${lesson.type}</span><strong>${lesson.title}</strong><small>${lesson.desc}</small></span><span class="lesson-duration">${lesson.time}</span><span class="lesson-open"><svg aria-hidden="true"><use href="/static/icons.svg#icon-arrow-right"></use></svg></span></button>`;
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

  function topicPracticeMarkup(lesson) {
    const hash=[...lesson.id].reduce((sum,char)=>sum+char.charCodeAt(0),0);
    const conversational=/SPEAKING|COMMUNICATION|FLUENCY|PRESENTATION|DISCUSSION|SIMULATION/.test(lesson.type);
    const pool=conversational?placementConversation:placementQuiz;
    const items=Array.from({length:5},(_,index)=>pool[(hash+index*3)%pool.length]);
    return `<section class="topic-practice" data-topic-practice><div class="topic-practice-heading"><div><span class="feature-tag">PRACTISE THIS TOPIC</span><h3>Quick check · 5 questions</h3><p>Answer a short English practice set and review the reasoning for each answer.</p></div><button type="button" class="primary-button" data-topic-start>Start practice →</button></div><div class="topic-practice-session" data-topic-session hidden data-items="${safeText(JSON.stringify(items))}"><p data-topic-count></p><strong data-topic-stem></strong><div class="topic-practice-options" data-topic-options></div><div class="topic-practice-feedback" data-topic-feedback hidden></div><button type="button" class="quiet-button" data-topic-next disabled>Check answer</button></div></section>`;
  }
  function bindTopicPractice() {
    const root=$('[data-topic-practice]'); if(!root)return;
    const session=$('[data-topic-session]',root), items=JSON.parse(session.dataset.items);let index=0,chosen=null,score=0,reviewed=false;
    $('[data-topic-start]',root).addEventListener('click',()=>{
      if(languageCode!=='en'){showToast('Topic quizzes currently have reviewed English questions only.');return;}
      session.hidden=false;index=0;chosen=null;score=0;reviewed=false;$('[data-topic-next]',session).hidden=false;showTopicQuestion();
    });
    function showTopicQuestion(){
      const item=items[index];reviewed=false;$('[data-topic-count]',session).textContent=`Question ${index+1} of ${items.length}`;$('[data-topic-stem]',session).textContent=item.q;
      $('[data-topic-feedback]',session).hidden=true;$('[data-topic-next]',session).disabled=true;$('[data-topic-next]',session).textContent='Check answer';chosen=null;
      $('[data-topic-options]',session).innerHTML=item.options.map((option,i)=>`<button type="button" class="placement-option" data-topic-option="${i}"><span>${String.fromCharCode(65+i)}</span>${safeText(option)}</button>`).join('');
      $$('[data-topic-option]',session).forEach(button=>button.addEventListener('click',()=>{chosen=Number(button.dataset.topicOption);$$('[data-topic-option]',session).forEach(node=>node.classList.toggle('selected',node===button));$('[data-topic-next]',session).disabled=false;}));
    }
    $('[data-topic-next]',session).addEventListener('click',()=>{
      if(!reviewed){if(chosen===null)return;const item=items[index],correct=chosen===item.answer;if(correct)score++;
        $('[data-topic-feedback]',session).innerHTML=`<strong>${correct?'Correct.':'Not quite.'} ${correct?'':'Correct answer: '+safeText(item.options[item.answer])+'. '}</strong>${safeText(item.why)}`;$('[data-topic-feedback]',session).hidden=false;reviewed=true;
        $('[data-topic-next]',session).textContent=index===items.length-1?'See results':'Next question';$('[data-topic-next]',session).disabled=false;return;}
      if(index===items.length-1){$('[data-topic-stem]',session).textContent=`Practice complete · ${score} of ${items.length} correct.`;$('[data-topic-options]',session).innerHTML='';$('[data-topic-feedback]',session).innerHTML='Review the explanations above and revisit the lesson notes where useful.';$('[data-topic-next]',session).hidden=true;return;}
      index++;showTopicQuestion();
    });
  }

  function openLesson(id) {
    const lesson = currentLessons().find(item=>item.id===id);
    if (!lesson) return;
    activeLesson = lesson; activeSkill = null; $('#completeLesson').innerHTML='Mark lesson complete <span>✓</span>';
    $('#lessonKicker').textContent = `${level.toUpperCase()} · ${lesson.type} · ${lesson.time.toUpperCase()}`;
    $('#lessonTitle').textContent = lesson.title;
    $('#lessonSummary').textContent = lesson.desc;
    const writingKey = `northstar-writing:${language}:${level}:${lesson.id}`;
    const explanations = lesson.notes.map(note => typeof note === 'string'
      ? `<li>${safeText(note)}</li>`
      : `<li class="grammar-explanation"><div><strong>English</strong><p>${safeText(note.en)}</p></div><div lang="hi"><strong>हिन्दी</strong><p>${safeText(note.hi)}</p></div></li>`).join('');
    const isEnglishGrammar = lesson.id.startsWith('g-');
    const referenceLinks = isEnglishGrammar ? '<div class="grammar-reference-links"><a href="https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference" target="_blank" rel="noopener noreferrer">British Council grammar reference ↗</a><a href="https://dictionary.cambridge.org/grammar/british-grammar" target="_blank" rel="noopener noreferrer">Cambridge Grammar ↗</a></div>' : '';
    const videoQuery = encodeURIComponent(`${lesson.title} English grammar ${level} Hindi explanation`);
    const videoUrl = `https://www.youtube.com/results?search_query=${videoQuery}`;
    const videoResource = isEnglishGrammar ? `<div class="lesson-video-resource"><span>KEEP LEARNING</span><a href="${videoUrl}" target="_blank" rel="noopener noreferrer">Find an English video for “${safeText(lesson.title)}” ↗</a><small>Opens a topic-specific YouTube search so you can choose a video at your level.</small></div>` : '';
    const topicPractice = languageCode === 'en' ? topicPracticeMarkup(lesson) : '';
    $('#lessonBody').innerHTML = `<div class="lesson-note-card grammar-notes"><strong>${isEnglishGrammar?'GRAMMAR EXPLANATION · ENGLISH + हिन्दी':'QUICK NOTES'}</strong><ul>${explanations}</ul>${referenceLinks}</div><div class="lesson-practice-card"><span>TRY IT OUT</span><p>${safeText(lesson.practice)}</p><button class="inline-practice" id="lessonSpeak">Practise this aloud <span><svg aria-hidden="true"><use href="/static/icons.svg?v=northstar-icons-20261028-2#icon-mic"></use></svg></span></button></div>${topicPractice}${writingPracticeMarkup(writingKey, `Write your answer in ${language}.`)}${videoResource}`;
    bindWritingPractice(writingKey);
    bindTopicPractice();
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
    const skillIcons={'active-listening':'headphones',confidence:'sparkles',interviews:'briefcase',teamwork:'chat',communication:'chat','problem-solving':'brain','leadership':'target'};
    $('#softSkillGrid').innerHTML = skills.map((skill,index)=>`<button class="soft-skill-card" data-skill="${skill.id}"><span class="skill-card-top"><span class="skill-card-icon icon-${index%4}"><svg aria-hidden="true"><use href="/static/icons.svg#icon-${skillIcons[skill.id]||'sparkles'}"></use></svg></span><span class="skill-card-tag">${skill.tag}</span></span><strong>${skill.title}</strong><small>${skill.desc}</small><span class="skill-card-link">Learn & practise <b><svg aria-hidden="true"><use href="/static/icons.svg#icon-arrow-right"></use></svg></b></span></button>`).join('');
    $$('.soft-skill-card').forEach(card=>card.addEventListener('click',()=>openSkill(card.dataset.skill)));
  }
  function openSkill(id) {
    activeSkill=skills.find(skill=>skill.id===id); if(!activeSkill)return; activeLesson=null; $('#completeLesson').textContent='Mark this skill practised ✓';
    $('#lessonKicker').textContent=`SOFT SKILLS · ${activeSkill.tag}`;
    $('#lessonTitle').textContent=activeSkill.title;
    $('#lessonSummary').textContent=activeSkill.desc;
    const writingKey=`northstar-soft-writing:${activeSkill.id}`;
    $('#lessonBody').innerHTML=`<div class="lesson-note-card"><strong>A SIMPLE FRAMEWORK</strong><ol>${activeSkill.framework.map(item=>`<li>${safeText(item)}</li>`).join('')}</ol></div><div class="lesson-practice-card"><span>SCENARIO PRACTICE</span><p>${safeText(activeSkill.prompt)}</p><button class="inline-practice" id="skillSpeak">Rehearse this scenario <span><svg aria-hidden="true"><use href="/static/icons.svg?v=northstar-icons-20261028-2#icon-mic"></use></svg></span></button></div>${writingPracticeMarkup(writingKey, 'Write a brief response to this scenario, then compare it with the framework above.')}`;
    bindWritingPractice(writingKey);
    $('#lessonModal').hidden=false;document.body.classList.add('modal-open');
    $('#skillSpeak').addEventListener('click',()=>{closeModal('lessonModal');$('#practiceGoal').value=activeSkill.title;currentMode='guided';openPractice(activeSkill.prompt);});
  }
  renderSkills();

  function openPractice(prompt) {
    $('#practiceModal').hidden=false; document.body.classList.add('modal-open');
    $('#sessionSetup').hidden=false; $('#liveSession').hidden=true; $('#practiceTitle').textContent='Let’s find your focus.';
    $('#practiceSituation').value=prompt||'';
    $('#situationVoiceStatus').textContent='Type a situation or dictate it with your microphone.';
    if (prompt) { $('#practiceGoal').value='Other'; $('#practiceGoal').dataset.customPrompt=prompt; }
    else delete $('#practiceGoal').dataset.customPrompt;
    $$('.mode-choice').forEach(button=>button.classList.toggle('selected',button.dataset.mode===currentMode));
  }
  $('#openPractice').addEventListener('click',()=>openPractice());
  $('#recordSituation').addEventListener('click',()=>{
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){$('#situationVoiceStatus').textContent='Voice input is not supported in this browser. Type your situation instead.';return;}
    if(situationRecognition){try{situationRecognition.abort()}catch(_){}situationRecognition=null;}
    situationRecognition=new SpeechRecognition();situationRecognition.lang=languageLocale;situationRecognition.continuous=false;situationRecognition.interimResults=true;situationRecognition.maxAlternatives=1;
    $('#situationVoiceStatus').textContent=`Listening in ${language}…`;
    situationRecognition.onresult=event=>{let text='';for(let i=event.resultIndex;i<event.results.length;i++)text+=event.results[i][0].transcript;$('#practiceSituation').value=text.trim();};
    situationRecognition.onerror=event=>{$('#situationVoiceStatus').textContent=event.error==='not-allowed'?'Allow microphone access or type your situation.':'I could not hear that clearly. Try again or type it.';};
    situationRecognition.onend=()=>{if($('#practiceSituation').value.trim())$('#situationVoiceStatus').textContent='Situation captured. You can edit it before starting.';situationRecognition=null;};
    try{situationRecognition.start()}catch(_){$('#situationVoiceStatus').textContent='The microphone could not start. Type your situation instead.';}
  });
  $('#softStart').addEventListener('click',()=>{switchSection('soft');openPractice('Tell me one situation where you would like to feel more confident.');});
  $('#softScenario').addEventListener('click',()=>{switchSection('soft');openPractice('A teammate disagrees with your idea. How would you respond while keeping the conversation constructive?');});
  $$('.mode-choice').forEach(button=>button.addEventListener('click',()=>{$$('.mode-choice').forEach(item=>item.classList.remove('selected'));button.classList.add('selected');currentMode=button.dataset.mode;}));
  $('#beginSession').addEventListener('click',async()=>{
    if(languageCode!=='en'&&!localizedPrompts[languageCode]){showToast(`Conversation prompts for ${language} are not available in this preview.`);return;}
    if(situationRecognition){try{situationRecognition.abort()}catch(_){}situationRecognition=null;}
    activePracticeSituation=$('#practiceSituation').value.trim();
    goal=$('#practiceGoal').value; await saveProfile(true);
    $('#sessionSetup').hidden=true;$('#liveSession').hidden=false;
    $('#practiceTitle').textContent='Take your time. I’m listening.';
    $('#liveModeLabel').textContent=`${currentMode.toUpperCase()} PRACTICE · ${language.toUpperCase()}`;
    const spokenPrompts=localizedPrompts[languageCode] || prompts[currentMode];
    $('#coachPrompt').textContent=activePracticeSituation || $('#practiceGoal').dataset.customPrompt || (languageCode && languageCode!=='en' ? spokenPrompts[0] : (goalPrompts[goal] || prompts[currentMode][0]));
    $('#conversationFeed').innerHTML=`<div class="coach-bubble"><span class="coach-avatar"><svg aria-hidden="true"><use href="/static/icons.svg?v=northstar-icons-20261028-2#icon-northstar"></use></svg></span><p id="coachPrompt">${safeText($('#coachPrompt').textContent)}</p></div>`;
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
    let response=languageCode==='en'?'Good start—I understood your main idea. Keep going and add one more detail or example.':`Transcript captured. Automated grammar feedback is available for English only; ask a fluent speaker to review your ${language} response.`;
    let retry=false;
    const pastCue=/\b(yesterday|last (?:night|week|month)|ago)\b/i.test(clean);
    if(languageCode==='en' && pastCue && /\bi go\b/i.test(clean)) { response='I understood you. Since you mentioned a finished time, try “I went” instead of “I go”. Say the sentence once more when you are ready.'; retry=true; }
    else if(languageCode==='en' && words.length<7) response='Nice start. Can you add one more sentence explaining why or what happened next?';
    else if(languageCode==='en' && fillers>=3) response='Your idea came through. Try a short pause instead of a filler word, then continue with your next point.';
    $('#coachFeedback').innerHTML=`<span>BASIC PRACTICE FEEDBACK · TRANSCRIPT ONLY</span><p>${safeText(response)}</p><small>${words.length} recognized word units · ${fillers===null?'filler-word review unavailable for this language':`${fillers} English filler words`} · no pronunciation score</small>`;
    $('#coachFeedback').hidden=false;
    $('#micHint').textContent='You can try again, or hear the next prompt.';
    if(languageCode==='en')speakPrompt(response);
    if (!retry && sessionActive) {
      currentPromptIndex++;
      const activePrompts=activePracticeSituation
        ? ['In this situation, what would you say first?','How might the other person respond, and what would you say next?','What outcome do you want, and how could you ask for it clearly?']
        : (localizedPrompts[languageCode] || (languageCode==='en' ? (prompts[currentMode] || prompts.guided) : []));
      if(!activePrompts.length){$('#micHint').textContent=`Prompts for ${language} are not reviewed in this practice preview.`;return;}
      const next = activePrompts[currentPromptIndex % activePrompts.length];
      setTimeout(() => {
        if (!sessionActive) return;
        $('#coachPrompt').textContent = next;
        const bubble=document.createElement('div'); bubble.className='coach-bubble next-coach-bubble';
        bubble.innerHTML=`<span class="coach-avatar"><svg aria-hidden="true"><use href="/static/icons.svg?v=northstar-icons-20261028-2#icon-northstar"></use></svg></span><p>${safeText(next)}</p>`; $('#conversationFeed').appendChild(bubble);
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
