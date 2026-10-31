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
    document.querySelectorAll('[data-reader-theme-toggle]').forEach(button=>{button.textContent=isLight?'Dark mode':'Light mode';button.setAttribute('aria-label',`Switch to ${isLight?'dark':'light'} mode`);button.setAttribute('aria-pressed',String(isLight));});
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
  document.querySelectorAll('[data-reader-theme-toggle]').forEach(button=>button.addEventListener('click',()=>{const nextTheme=document.body.dataset.theme==='light'?'dark':'light';localStorage.setItem('northstar-violet-theme',nextTheme);applyTheme(nextTheme);}));
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
  const lessonTranslationKey='northstar-lesson-translation-language';
  let lessonTranslationCode=localStorage.getItem(lessonTranslationKey)||'hi';
  if(!languages.some(([,code])=>code===lessonTranslationCode)) lessonTranslationCode='hi';
  function lessonLanguageTabsMarkup(){
    const choices=languages.filter(([,code])=>code&&code!=='en').map(([name,code])=>`<option value="${safeText(code)}">${safeText(name)}</option>`).join('');
    return `<div class="lesson-language-tabs" role="group" aria-label="Explanation language"><button type="button" aria-pressed="false" data-lesson-language="en">English</button><label class="lesson-translation-select-label" id="lessonTranslationLanguageLabel"><span class="sr-only">Translation language</span><select id="lessonTranslationLanguage" aria-label="Choose translation language">${choices}</select></label><button type="button" aria-pressed="true" class="active" data-lesson-language="both">Both</button></div>`;
  }
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
  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('#openPractice,.voice-mode-tile');
    if(!trigger)return;
    event.preventDefault();
    if(trigger.dataset.voiceMode)currentMode=trigger.dataset.voiceMode;
    try { openPractice(); }
    catch(error) {
      console.error('Could not open voice practice:',error);
      const modal=$('#practiceModal');
      if(modal){modal.hidden=false;$('#sessionSetup').hidden=false;$('#liveSession').hidden=true;document.body.classList.add('modal-open');}
    }
  });
  let activeLesson = null;
  let activeSkill = null;
  let activeLessonScore = null;
  let lastDetailTrigger = null;
  let readerScrollBeforeOpen = 0;
  const readerFontKey = 'northstar-reader-font-size';
  const readerLanguageKey = 'northstar-reader-language';
  function setReaderBodyLock(locked) {
    if (locked) { if (!document.body.classList.contains('modal-open')) readerScrollBeforeOpen = window.scrollY; document.body.classList.add('modal-open'); }
    else { document.body.classList.remove('modal-open'); window.scrollTo(0, readerScrollBeforeOpen); }
  }
  function openReadingModal(id, hash) {
    const backdrop = $(`#${id}`), dialog = backdrop?.querySelector('[role="dialog"]');
    if (!backdrop || !dialog) return;
    if (backdrop.hidden) {
      if (!document.activeElement.closest?.('.detail-modal')) lastDetailTrigger = document.activeElement;
      setReaderBodyLock(true);
      history.pushState({...history.state, northstarReadingModal:id}, '', `${location.pathname}${location.search}#${hash}`);
    } else history.replaceState({...history.state, northstarReadingModal:id}, '', `${location.pathname}${location.search}#${hash}`);
    backdrop.hidden = false;
    dialog.scrollTop = 0;
    dialog.focus();
    refreshReaderProgress(dialog);
    if(id==='lessonModal'&&$('#lessonBody').querySelector('.chapter-concept'))queueChapterTranslations($('#lessonBody').dataset.translationTarget||lessonTranslationCode,$('#lessonBody'));
  }
  function installReaderContent(body, title, summary = '') {
    body.querySelector('.detail-page-heading')?.remove();
    const heading = document.createElement('div');
    heading.className = 'detail-page-heading';
    const h1 = document.createElement('h1'); h1.textContent = title;
    h1.id = body.classList.contains('placement-modal-body') ? 'placementPageTitle' : body.id === 'lessonBody' ? 'lessonTitle' : 'vocabularyModalTitle';
    heading.append(h1);
    if (summary) { const p = document.createElement('p'); p.textContent = summary; heading.append(p); }
    body.prepend(heading);
    const languageTabs = body.querySelector('.lesson-language-tabs');
    if (body.id === 'lessonBody' && languageTabs) body.insertBefore(languageTabs, heading);
    let sidebar = body.id === 'lessonBody' ? body.querySelector('.detail-reading-sidebar') : null;
    if (body.id === 'lessonBody' && !sidebar) { sidebar = document.createElement('aside'); sidebar.className = 'detail-reading-sidebar'; sidebar.setAttribute('aria-label', 'Lesson navigation and suggestions'); body.append(sidebar); }
    let toc = body.querySelector('.detail-reading-toc');
    if (!toc) { toc = document.createElement('aside'); toc.className = 'detail-reading-toc'; toc.setAttribute('aria-label', 'On this page'); (sidebar || body).append(toc); }
    const candidates = $$('h2,h3,h4,.placement-type strong', body).filter(node => !node.closest('.detail-page-heading') && !node.closest('.detail-reading-toc') && !node.hidden);
    toc.innerHTML = candidates.length ? `<strong>On this page</strong><nav>${candidates.map((node,index) => {
      const label = node.textContent.trim();
      if (!label) return '';
      if (!node.id) node.id = `reader-section-${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`;
      return `<a href="#${node.id}" aria-label="${safeText(label)}"><span>${label}</span><i aria-hidden="true">○</i></a>`;
    }).join('')}</nav>` : '';
    if(body.id==='lessonBody'&&toc.querySelector('nav')){
      sidebar.querySelector('.detail-reading-video')?.remove();
      const suggestions=document.createElement('section');suggestions.className='detail-reading-video';
      const videoTitle=activeSkill?.title||activeLesson?.title||title;
      const headingText=document.createElement('strong');headingText.textContent='Suggested videos';suggestions.append(headingText);
      const suggestionsList=document.createElement('div');suggestionsList.className='detail-reading-video-links';
      [[`${videoTitle} ${language} lesson explained`,`${language} lesson: ${videoTitle}`],[`${videoTitle} ${language} explanation`,`${language} explanation`],[`${videoTitle} examples and practice`,`${videoTitle}: examples & practice`]].forEach(([query,label])=>{
        const link=document.createElement('a');link.href=`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;link.target='_blank';link.rel='noopener noreferrer';link.textContent=label;link.setAttribute('aria-label',`${label} videos about ${videoTitle}`);suggestionsList.append(link);
      });
      suggestions.append(suggestionsList);sidebar.append(suggestions);
      heading.after(sidebar);
    }
    toc.hidden = !candidates.length;
  }
  function refreshReaderProgress(dialog) {
    const bar = dialog.querySelector('.detail-reading-progress i');
    if (!bar) return;
    const max = dialog.scrollHeight - dialog.clientHeight;
    bar.style.width = `${max > 0 ? Math.min(100, dialog.scrollTop / max * 100) : 0}%`;
  }
  document.addEventListener('scroll', event => {
    const dialog = event.target.closest?.('.detail-modal');
    if (dialog) {
      refreshReaderProgress(dialog);
      const toc = dialog.querySelector('.detail-reading-toc nav');
      if (toc) {
        const links = [...toc.querySelectorAll('a')];
        const current = links.map(link=>({link,node:document.getElementById(decodeURIComponent(link.hash.slice(1)))})).filter(item=>item.node).filter(item=>item.node.getBoundingClientRect().top<=150).at(-1) || links.map(link=>({link,node:document.getElementById(decodeURIComponent(link.hash.slice(1)))})).find(item=>item.node);
        if (current) links.forEach(link=>link.classList.toggle('active',link===current.link));
        links.forEach(link=>{const target=document.getElementById(decodeURIComponent(link.hash.slice(1)));if(target&&target.getBoundingClientRect().top<150){link.classList.add('visited');link.setAttribute('aria-label',`${link.querySelector('span')?.textContent||link.textContent}, visited`);}});
      }
      const chapter=dialog.querySelector('#lessonBody');if(chapter?.querySelector('.chapter-concept'))queueChapterTranslations(chapter.dataset.translationTarget||lessonTranslationCode,chapter);
    }
  }, true);
  document.addEventListener('click', event => {
    const jump=event.target.closest?.('[data-reader-jump]');
    if(jump){event.preventDefault();document.getElementById(jump.dataset.readerJump)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return;}
    const link = event.target.closest?.('.detail-reading-toc a[href^="#reader-section-"]');
    if (!link) return;
    event.preventDefault();
    const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
    target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    link.closest('nav')?.querySelectorAll('a').forEach(item=>item.classList.toggle('active',item===link));
  });
  window.addEventListener('popstate', () => {
    const open = $$('.detail-backdrop:not([hidden])').at(-1);
    if (open && history.state?.northstarReadingModal !== open.id) {
      if (open.id === 'practiceModal') { stopSession(false);return; }
      closeModal(open.id, true);
    }
  });
  let completed = new Map();
  let currentPromptIndex = 0;
  let timerId = null;
  let sessionSeconds = 0;
  let recognition = null;
  let situationRecognition = null;
  let activePracticeSituation = '';
  let sessionActive = false;
  let speechStartedAt = 0;
  let selectedPracticeDuration = 10;
  let backendVoiceSessionId = null;
  let voicePromptCount = 0;
  const voicePrompts = {
    free:['Your friend is visiting your city. What would you suggest they see?','Tell me about something you enjoyed doing recently.','What is one goal you are working toward?','Describe a place where you like to relax.','What would make your day a little better?'],
    guided:['How do you usually spend your weekends?','What is one thing you would like to learn this year?','Describe a place you would like to visit.','Tell me about a meal you enjoy.','What helps you feel confident in a conversation?'],
    challenge:['Introduce yourself in three clear sentences.','Make a polite request for help.','Describe your morning in 20 seconds.','Share one idea and give a reason.','Ask a thoughtful follow-up question.']
  };
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
  const placementResultKey = 'northstar-level-check-result';
  function updatePlacementCardResult(result) {
    const node = $('#placementCardResult');
    if (!node) return;
    node.textContent = result ? `Last result: ${result.score}/20 · Suggested level: ${result.level}` : 'Choose a test to find your starting level.';
  }
  try { updatePlacementCardResult(JSON.parse(localStorage.getItem(placementResultKey) || 'null')); }
  catch (_) { updatePlacementCardResult(null); }
  $('#openPlacement')?.addEventListener('click', () => {
    openReadingModal('placementModal', 'level-check');
  });
  const vocabularyWords = [
    {category:'People',word:'colleague',part:'noun',hindi:'सहकर्मी',meaning:'A person you work with.',examples:[['My colleague helped me prepare for the meeting.','मेरे सहकर्मी ने मीटिंग की तैयारी में मेरी मदद की।'],['She is a colleague from the sales team.','वह सेल्स टीम की मेरी सहकर्मी है।'],['I had lunch with a colleague today.','आज मैंने एक सहकर्मी के साथ दोपहर का खाना खाया।']],similar:['coworker','teammate']},
    {category:'People',word:'neighbour',part:'noun',hindi:'पड़ोसी',meaning:'A person who lives near you.',examples:[['Our neighbour speaks three languages.','हमारे पड़ोसी तीन भाषाएँ बोलते हैं।'],['I spoke to my neighbour yesterday.','मैंने कल अपने पड़ोसी से बात की।'],['The neighbours are very kind.','पड़ोसी बहुत दयालु हैं।']],similar:['local','resident']},
    {category:'People',word:'customer',part:'noun',hindi:'ग्राहक',meaning:'A person who buys something or uses a service.',examples:[['The customer asked for more information.','ग्राहक ने और जानकारी माँगी।'],['A customer paid by card.','एक ग्राहक ने कार्ड से भुगतान किया।'],['We listen to every customer.','हम हर ग्राहक की बात सुनते हैं।']],similar:['buyer','client']},
    {category:'People',word:'audience',part:'noun',hindi:'दर्शक · श्रोता',meaning:'The people watching or listening.',examples:[['The audience asked thoughtful questions.','दर्शकों ने सोच-समझकर सवाल पूछे।'],['She spoke to a large audience.','उन्होंने बड़े दर्शक समूह से बात की।'],['The audience enjoyed the talk.','दर्शकों ने बातचीत का आनंद लिया।']],similar:['listeners','viewers']},
    {category:'Work',word:'task',part:'noun',hindi:'काम · कार्य',meaning:'A piece of work that you need to do.',examples:[['I finished my first task.','मैंने अपना पहला काम पूरा किया।'],['This task is easy.','यह काम आसान है।'],['We can do the task together.','हम यह काम साथ कर सकते हैं।']],similar:['job','activity']},
    {category:'Work',word:'meeting',part:'noun',hindi:'बैठक',meaning:'A time when people come together to talk or work.',examples:[['The meeting starts at ten.','बैठक दस बजे शुरू होती है।'],['We have a team meeting today.','आज हमारी टीम की बैठक है।'],['Please join the meeting on time.','कृपया बैठक में समय पर आएँ।']],similar:['discussion','session']},
    {category:'Work',word:'team',part:'noun',hindi:'दल · टीम',meaning:'A group of people who work together.',examples:[['Our team works well together.','हमारी टीम साथ मिलकर अच्छा काम करती है।'],['She is new to the team.','वह टीम में नई है।'],['The team finished the project.','टीम ने परियोजना पूरी की।']],similar:['group','crew']},
    {category:'Work',word:'plan',part:'noun · verb',hindi:'योजना · योजना बनाना',meaning:'An idea about what you will do, or to decide this in advance.',examples:[['We have a plan for tomorrow.','कल के लिए हमारी एक योजना है।'],['I plan to study after dinner.','मैं रात के खाने के बाद पढ़ने की योजना बना रहा/रही हूँ।'],['Let’s plan the trip together.','आइए यात्रा की योजना साथ बनाएँ।']],similar:['idea','schedule']},
    {category:'Travel',word:'ticket',part:'noun',hindi:'टिकट',meaning:'A paper or digital pass that lets you travel or enter a place.',examples:[['I bought a train ticket.','मैंने ट्रेन का टिकट खरीदा।'],['Keep your ticket with you.','अपना टिकट अपने पास रखें।'],['How much is a bus ticket?','बस का टिकट कितने का है?']],similar:['pass','fare ticket']},
    {category:'Travel',word:'station',part:'noun',hindi:'स्टेशन · स्थानक',meaning:'A place where trains or buses stop for people.',examples:[['The station is near the hotel.','स्टेशन होटल के पास है।'],['We met at the bus station.','हम बस स्टेशन पर मिले।'],['The train leaves from this station.','ट्रेन इस स्टेशन से रवाना होती है।']],similar:['terminal','stop']},
    {category:'Travel',word:'hotel',part:'noun',hindi:'होटल',meaning:'A place where you pay to sleep when you are away from home.',examples:[['Our hotel has a small garden.','हमारे होटल में एक छोटा बगीचा है।'],['I booked a room at the hotel.','मैंने होटल में एक कमरा बुक किया।'],['The hotel is close to the airport.','होटल हवाई अड्डे के पास है।']],similar:['inn','guesthouse']},
    {category:'Travel',word:'luggage',part:'noun',hindi:'सामान · यात्रा का सामान',meaning:'The bags and cases you take when you travel.',examples:[['My luggage is in the car.','मेरा सामान कार में है।'],['Please keep your luggage close.','कृपया अपना सामान पास रखें।'],['She has one small piece of luggage.','उसके पास सामान का एक छोटा बैग है।']],similar:['baggage','bags']}
  ];
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
    return {subtitle:`build ${targetLevel.toLowerCase()} ${language} skills`,lessons:curriculum[targetLevel].map((item,index)=>({id:`${language.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${targetLevel.toLowerCase()}-${index+1}`,title:item[0],desc:item[1],type:item[2],time:`${8+index%3*2} min`,notes:commonNotes[targetLevel==='Basic'?0:targetLevel==='Intermediate'?1:2],practice:`Talk about ${item[0]}. ${item[1]}`}))};
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
    $('#levelSelect').disabled = false;
    $('#levelSelect').value = level;
    $('#languageFeatureTitle').textContent=language;
    $$('.target-language-inline').forEach(node=>node.textContent=language);
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
  $$('.text-action[data-scroll],.writing-launch-card[data-scroll]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.scroll).scrollIntoView({behavior:'smooth',block:'start'})));
  const mainTrackCard=$('[data-main-track]');
  function startMainTrack(){switchSection('language');window.setTimeout(()=>$('#curriculum').scrollIntoView({behavior:'smooth',block:'start'}),160);}
  mainTrackCard.addEventListener('click',startMainTrack);
  mainTrackCard.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();startMainTrack();}});

  function renderPlacementQuestion() {
    if (!placement) return;
    const item = placement.items[placement.index];
    $('#placementModeLabel').textContent = `${placement.label} · ENGLISH`;
    $('#placementQuestionTitle').textContent = `Question ${placement.index + 1} of ${placement.items.length}`;
    $('#placementProgressFill').innerHTML = placement.items.map((_, index) => `<i class="${index < placement.index ? 'is-done' : index === placement.index ? 'is-current' : ''}"></i>`).join('');
    $('#placementStem').textContent = item.q;
    $('#placementOptions').innerHTML = item.options.map((option, index) => `<button class="placement-option${placement.answers[placement.index] === index ? ' selected' : ''}" type="button" data-placement-option="${index}"><span class="placement-radio" aria-hidden="true"></span><span class="placement-option-copy">${safeText(option)}</span><kbd>${index + 1}</kbd></button>`).join('');
    $('#placementFeedback')?.remove();
    $('#placementOptions').querySelectorAll('[data-placement-option]').forEach(button => button.addEventListener('click', () => {
      if (placement.answerRevealed) return;
      placement.answers[placement.index] = Number(button.dataset.placementOption);
      $('#placementOptions').querySelectorAll('.placement-option').forEach(option => option.classList.toggle('selected', option === button));
      $('#placementNext').disabled = false;
      $('#placementStatus').textContent = 'Press “Check answer” when you’re ready.';
    }));
    $('#placementNext').textContent = placement.answerRevealed ? (placement.index === placement.items.length - 1 ? 'See results →' : 'Next question →') : 'Check answer →';
    $('#placementNext').disabled = placement.answers[placement.index] === null;
    $('#placementStatus').textContent = placement.answers[placement.index] === null ? 'Choose an answer to continue.' : placement.answerRevealed ? 'Press Enter to continue.' : 'Press “Check answer” when you’re ready.';
    $('#placementQuestionCount').textContent = `${placement.answers.filter(answer => answer !== null).length} answered`;
    if (placement.answerRevealed) showPlacementFeedback();
  }
  function showPlacementFeedback() {
    const item = placement.items[placement.index], chosen = placement.answers[placement.index];
    $('#placementOptions').querySelectorAll('.placement-option').forEach((option, index) => {
      option.classList.toggle('is-correct', index === item.answer);
      option.classList.toggle('is-incorrect', index === chosen && chosen !== item.answer);
      option.disabled = true;
    });
    const feedback = document.createElement('section');
    feedback.id = 'placementFeedback'; feedback.className = `placement-feedback ${chosen === item.answer ? 'is-correct' : 'is-incorrect'}`;
    feedback.innerHTML = `<strong>${chosen === item.answer ? 'That’s right' : 'A good one to learn'}</strong><p>${safeText(item.why)}</p>`;
    $('#placementOptions').after(feedback);
  }
  function finishPlacement() {
    const score = placement.items.reduce((sum, item, index) => sum + (placement.answers[index] === item.answer ? 1 : 0), 0);
    const suggested = score >= 16 ? 'Advanced' : score >= 9 ? 'Intermediate' : 'Basic';
    const review = placement.items.map((item, index) => {
      const chosen = placement.answers[index];
      const correct = chosen === item.answer;
      return `<article class="placement-review-item ${correct ? 'is-correct' : 'is-incorrect'}"><strong>${index + 1}. ${safeText(placement.kind === 'sentences' ? item.q : item.q)}</strong><p>Your answer: ${chosen === null ? 'Not answered' : safeText(item.options[chosen])}</p>${!correct ? `<p>Correct answer: ${safeText(item.options[item.answer])}</p>` : ''}<small>${safeText(item.why)}</small></article>`;
    }).join('');
    const result = {score, level:suggested, test:placement.label, completedAt:new Date().toISOString()};
    try { localStorage.setItem(placementResultKey, JSON.stringify(result)); } catch (_) {}
    updatePlacementCardResult(result);
    const cefr = score >= 18 ? 'C1' : score >= 16 ? 'B2' : score >= 12 ? 'B1' : score >= 8 ? 'A2' : 'A1';
    $('#placementResults').innerHTML = `<div class="placement-result-hero"><div class="placement-level-badge"><strong>${cefr}</strong><span>LEVEL</span></div><div><span class="placement-result-kicker">${safeText(suggested)} starting point</span><h2>${cefr === 'A1' ? 'A fresh start.' : cefr === 'A2' ? 'You’re building confidence.' : cefr === 'B1' ? 'Intermediate. Good start!' : 'Strong work. Keep going!'}</h2><p>Your score gives you a practical place to continue learning.</p><strong class="placement-score">${score} / 20 <small>correct answers</small></strong></div></div><div class="placement-result-columns"><article><h3><i>✓</i> Strong areas</h3><p>Everyday communication</p><p>Understanding common English</p><p>${score >= 12 ? 'Clear sentence choices' : 'Building useful vocabulary'}</p></article><article><h3><i>!</i> Practise next</h3><p>Complete sentences</p><p>Polite requests and responses</p><p>Grammar and word choice</p></article></div><div class="placement-result-actions"><button type="button" class="primary-button" id="placementTryAnother">Try another test</button><button type="button" class="quiet-button" id="placementRetry">Retry this test</button><button type="button" class="placement-review-link" id="placementReviewToggle">Review my answers</button><button type="button" class="quiet-button" id="applySuggestedLevel">Use ${suggested} level</button></div><p class="placement-result-note">This is a short English placement estimate, not a formal proficiency certificate.</p><div class="placement-review-list" hidden>${review}</div>`;
    $('#placementResults').hidden = false;
    $('#placementNext').hidden = true;
    $('#placementOptions').hidden = true;
    $('#placementStem').hidden = true;
    $('#placementStatus').textContent = `Test complete · ${score} correct out of 20.`;
    $('#applySuggestedLevel').addEventListener('click', async () => {
      level = suggested; $('#levelSelect').value = level; refreshLanguage(); await saveProfile();
      showToast(`Your learning level is now ${level}.`);
    });
    $('#placementReviewToggle').addEventListener('click', () => { const list=$('#placementResults .placement-review-list'); list.hidden=!list.hidden; $('#placementReviewToggle').textContent=list.hidden?'Review my answers':'Hide answer review'; });
    $('#placementRetry').addEventListener('click', () => startPlacement(placement.kind));
    $('#placementTryAnother').addEventListener('click', () => { $('#placementResults').hidden=true; $('#placementSession').hidden=true; $('#placementTypes').hidden=false; placement=null; });
  }
  function startPlacement(kind) {
    const items = kind === 'conversation' ? placementConversation : kind === 'sentences' ? placementSentences : placementQuiz;
    placement = {kind, label:kind === 'quiz' ? 'Grammar & vocabulary' : kind === 'sentences' ? 'Sentence building' : 'Conversation choices', items, index:0, answers:Array(items.length).fill(null), answerRevealed:false};
    $('#placementTypes').hidden = true; $('#placementSession').hidden = false; $('#placementResults').hidden = true; $('#placementNext').hidden = false;
    $('#placementOptions').hidden = false; $('#placementStem').hidden = false;
    renderPlacementQuestion(); $('#placementModal .detail-modal').scrollTop = 0;
  }
  $$('.placement-type').forEach(button => button.addEventListener('click', () => {
    const englishOnly = languageCode === 'en';
    if (!englishOnly) { showToast('Reviewed placement tests are currently available for English only.'); return; }
    startPlacement(button.dataset.placement);
  }));
  $('#placementNext').addEventListener('click', () => {
    if (!placement || placement.answers[placement.index] === null) return;
    if (!placement.answerRevealed) { placement.answerRevealed=true; showPlacementFeedback(); $('#placementNext').textContent=placement.index === placement.items.length - 1 ? 'See results →' : 'Next question →'; $('#placementStatus').textContent='Press Enter to continue.'; return; }
    if (placement.index === placement.items.length - 1) finishPlacement();
    else { placement.index++; placement.answerRevealed=false; renderPlacementQuestion(); }
  });
  $('#placementExit').addEventListener('click', () => { placement = null; $('#placementSession').hidden = true; $('#placementTypes').hidden = false; $('#placementModal .detail-modal').scrollTop = 0; });
  document.addEventListener('keydown', event => {
    if ($('#placementModal').hidden || !placement || $('#placementSession').hidden) return;
    if (/^[1-4]$/.test(event.key) && !placement.answerRevealed) { const option=$(`#placementOptions [data-placement-option="${Number(event.key)-1}"]`); option?.click(); }
    if (event.key === 'Enter' && !$('#placementNext').disabled) { event.preventDefault(); $('#placementNext').click(); }
  });

  const translationChoices=languages.filter(([,code])=>code).map(([name,code])=>`<option value="${safeText(code)}">${safeText(name)}</option>`).join('');
  $('#translateFrom').innerHTML=translationChoices;
  $('#translateTo').innerHTML=translationChoices;
  $('#translateFrom').value='en';$('#translateTo').value='hi';
  const keyboardLanguage=$('#translatorKeyboardLanguage');keyboardLanguage.innerHTML=translationChoices;keyboardLanguage.value='en';
  const romanKeyboardLanguages=new Set(['ar','bn','fa','gu','hi','ja','mr','ne','pa','ru','ta','te','ur','zh']);
  const latinKeyboardLanguages=new Set(['en','es','fr','de','it','pt','nl','id','pl','sw','tr','vi']);
  const nativePreview=$('#translatorNativePreview'),nativePreviewText=$('#translatorNativeText');
  function resetTranslatorNativePreview(){nativePreview.hidden=true;nativePreview.dataset.original='';nativePreview.dataset.language='';nativePreviewText.value='';}
  const keyboardRows={
    hi:['ौैाीूाभगद','ोे्िुपयरत','ंमजनवलसहक'],ne:['ौैाीूाभगद','ोे्िुपयरत','ंमजनवलसहक'],bn:['ৌৈাীূভগদ','োে্িুপযরত','ংমজনবলসহক'],
    gu:['ૌૈાીૂભઘદ','ોે્િુપયરત','ંમજનવલસહક'],pa:['ੌੈਾੀੂਭਘਦ','ੋੇ੍ਿੁਪਯਰਤ','ੰਮਜਨਵਲਸਹਕ'],
    mr:['ौैाीूाभगद','ोे्िुपयरत','ंमजनवलसहक'],ne:['ौैाीूाभगद','ोे्िुपयरत','ंमजनवलसहक'],
    ta:['ௌைாீூபகத','ோே்ிுமயரல','னவளசடணழ'],te:['ౌైాీూభగద','ోే్ిుపయరత','ంమనవలసహక'],
    ar:['ضصثقفغعهخحجد','شسيبلاتنمكط','ئءؤرلاىةوزظ'],ur:['ٹثقفغعهخحجد','شسیبلاتنمکط','ئءؤرلاےوزظ'],he:['קראטוןםפשד','שךץגכעיחלך','זסבהנמצת'],
    fa:['ضصثقفغعهخحجد','شسیبلاتنمکط','ئءؤرلاےوزظ'],ru:['йцукенгшщзх','фывапролджэ','ячсмитьбю'],uk:['йцукенгшщзх','фівапролджє','ячсмитьбю'],
    ml:['ൗൈാീൂകഗദ','ോേ്ിുപയരത','ംമനവലസഹ'],kn:['ೌೈಾೀೂಕಗದ','ೋೇ್ಿುಪಯರತ','ಂಮನವಲಸಹ'],
    el:[';ςερτυθιοπ','ασδφγηξκλ','ζχψωβνμ'],ja:['あいうえおかきくけこ','さしすせそたちつてと','なにぬねのはひへほ','まみむめもやゆよわん'],
    zh:['你好我是你他我们','的了在不有这中大为','人上个国到说们和子'],ko:['ㅂㅈㄷㄱㅅㅛㅕㅑㅐㅔ','ㅁㄴㅇㄹㅎㅗㅓㅏㅣ','ㅋㅌㅊㅍㅠㅜㅡ'],th:['ๆไำพะัีรนยบ','ฟหกดเ้่าสวง','ผปแอิืทมใฝ']
  };
  const latinExtras={es:'áéíóúüñ¿¡',fr:'àâçéèêëîïôùûüÿœ',de:'äöüß',it:'àèéìíîòóù',pt:'áâãàçéêíóôõú',tr:'çğıöşü',vi:'ăâđêôơưáàảãạ',pl:'ąćęłńóśźż',nl:'ëïÿ'};
  function syncTranslatorLabels(){const from=$('#translateFrom'),to=$('#translateTo');const fromName=from.selectedOptions[0]?.text||'English',toName=to.selectedOptions[0]?.text||'Hindi';$('#translatorFromLabel').textContent=fromName.toUpperCase();$('#translatorToLabel').textContent=to.value==='hi'?'हिन्दी':toName;$('#translateInput').lang=from.value;$('#translateInput').dir=['ar','fa','he','ur'].includes(from.value)?'rtl':'ltr';$('#translateOutput').lang=to.value;$('#translateOutput').dir=['ar','fa','he','ur'].includes(to.value)?'rtl':'ltr';if(keyboardLanguage.value!==from.value)keyboardLanguage.value=from.value;renderTranslatorKeyboard();}
  syncTranslatorLabels();$('#translateFrom').addEventListener('change',()=>{resetTranslatorNativePreview();$('#translateOutput').textContent='';syncTranslatorLabels();});$('#translateTo').addEventListener('change',()=>{$('#translateOutput').textContent='';syncTranslatorLabels();});
  function renderTranslatorKeyboard(){
    const code=keyboardLanguage.value||$('#translateFrom').value,mode=$('#translatorInputMethod').value,keys=$('#translatorVirtualKeys'),hint=$('#translatorKeyboardHint');
    const name=languages.find(([,languageCode])=>languageCode===code)?.[0]||'this language';
    hint.textContent=mode==='roman'?(romanKeyboardLanguages.has(code)?`Type ${name} with English letters. It will be converted before translation.`:latinKeyboardLanguages.has(code)?`Type ${name} normally with English letters. Use on-screen keys for accents.`:`Roman typing is not supported for ${name}; choose on-screen keys or use your device keyboard.`):`Choose ${name} characters below, or use your device’s ${name} keyboard.`;
    if(mode==='roman'){keys.hidden=true;keys.innerHTML='';return;}
    keys.hidden=false;
    let rows=keyboardRows[code];
    if(!rows){const extras=latinExtras[code]||'';rows=[...(extras?[extras]:[]),'qwertyuiop','asdfghjkl','zxcvbnm'];}
    keys.innerHTML=rows.map(row=>`<div class="translator-key-row">${Array.from(row).map(char=>`<button type="button" data-key-value="${safeText(char)}">${safeText(char)}</button>`).join('')}</div>`).join('')+`<div class="translator-key-row translator-key-row-actions"><button type="button" data-key-value=" ">Space</button><button type="button" data-key-value="BACKSPACE">⌫</button></div>`;
    $$('[data-key-value]',keys).forEach(button=>button.addEventListener('click',()=>{
      const input=$('#translateInput'),value=button.dataset.keyValue,start=input.selectionStart,end=input.selectionEnd;
      if(value==='BACKSPACE')input.setRangeText('',start===end?Math.max(0,start-1):start,end,'end');
      else input.setRangeText(value,start,end,'end');
      input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();
    }));
  }
  keyboardLanguage.addEventListener('change',()=>{$('#translateFrom').value=keyboardLanguage.value;syncTranslatorLabels();});
  $('#translatorInputMethod').addEventListener('change',renderTranslatorKeyboard);
  $('#translatorKeyboardToggle').addEventListener('click',()=>{const panel=$('#translatorKeyboardPanel'),open=panel.hidden;panel.hidden=!open;$('#translatorKeyboardToggle').setAttribute('aria-expanded',String(open));if(open)renderTranslatorKeyboard();});
  $('#translateSwap').addEventListener('click', () => { const from=$('#translateFrom'),to=$('#translateTo'); const old=from.value;from.value=to.value;to.value=old;resetTranslatorNativePreview();$('#translateOutput').textContent='';syncTranslatorLabels(); });
  function speakTranslation(text,code) { if(!text.trim())return; if(!('speechSynthesis' in window)){showToast('Speech playback is not available in this browser.');return;} window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=languages.find(([,languageCode])=>languageCode===code)?.[2]||code;window.speechSynthesis.speak(utterance); }
  $('#translatorClear').addEventListener('click',()=>{$('#translateInput').value='';$('#translateOutput').textContent='';resetTranslatorNativePreview();$('#translateInput').focus();});
  $('#translatorHear').addEventListener('click',()=>speakTranslation($('#translateOutput').textContent,$('#translateTo').value));
  $('#translatorCopy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#translateOutput').textContent);showToast('Translation copied.');}catch(_){showToast('Copy is not available here.');}});
  $('#translatorSpeak').addEventListener('click',()=>{const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SpeechRecognition){showToast('Voice input is not available in this browser.');return;}const recognition=new SpeechRecognition();const code=$('#translateFrom').value;recognition.lang=languages.find(([,languageCode])=>languageCode===code)?.[2]||code;recognition.continuous=false;recognition.interimResults=false;recognition.onresult=event=>{$('#translateInput').value=event.results[0][0].transcript;};recognition.onerror=()=>showToast('I could not hear that. Please try again.');try{recognition.start();}catch(_){showToast('The microphone could not start.');}});
  $('#translateLearningLanguage').addEventListener('click', () => {
    const targetCode = languageCode || 'en';
    if ([...$('#translateTo').options].some(option => option.value === targetCode)) {$('#translateTo').value = targetCode;syncTranslatorLabels();}
    else $('#translateOutput').textContent = `${language} is not in the translator's current language list.`;
  });
  $('#translateButton').addEventListener('click', async () => {
    const text=$('#translateInput').value.trim(); if(!text){$('#translateOutput').textContent='Enter a word or sentence first.';return;}
    if(new TextEncoder().encode(text).length>500){$('#translateOutput').textContent='This translation service accepts up to 500 bytes at a time. Shorten the text and try again.';return;}
    const from=$('#translateFrom').value, to=$('#translateTo').value;
    if(from===to){$('#translateOutput').textContent='Choose two different languages.';return;}
    $('#translateButton').disabled=true;$('#translateOutput').textContent='Translating…';
    try {
      let sourceText=text;
      const hasReviewedNativeText=!nativePreview.hidden&&nativePreview.dataset.original===text&&nativePreview.dataset.language===from&&nativePreviewText.value.trim();
      if(hasReviewedNativeText)sourceText=nativePreviewText.value.trim();
      else if($('#translatorInputMethod').value==='roman'&&romanKeyboardLanguages.has(from)&&/[A-Za-z]/.test(text)&&!(/[^\x00-\x7f]/.test(text))){
        const response=await fetch('/api/learning/transliterate',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({text,language:from})});
        if(!response.ok){const failure=await response.json().catch(()=>({}));throw new Error(failure.detail||'Roman typing is not available for this language.');}
        const data=await response.json();sourceText=data.text;nativePreviewText.value=sourceText;nativePreviewText.lang=from;nativePreviewText.dir=['ar','fa','he','ur'].includes(from)?'rtl':'ltr';nativePreview.dataset.original=text;nativePreview.dataset.language=from;nativePreview.hidden=false;
        const fromName=$('#translateFrom').selectedOptions[0]?.text||'selected language';$('#translatorNativePreviewLabel').textContent=`Recognized ${fromName} · edit if needed`;
      }
      const translated=await translateWithGoogle(sourceText,from,to);
      $('#translateOutput').textContent=translated;
    } catch (error) { $('#translateOutput').textContent=error.message||'Translation could not be reached. Check your connection and try again.'; }
    finally { $('#translateButton').disabled=false; }
  });
  $('#translateInput').addEventListener('input',()=>{if(nativePreview.dataset.original&&nativePreview.dataset.original!==$('#translateInput').value.trim())resetTranslatorNativePreview();$('#translateOutput').textContent='';});
  nativePreviewText.addEventListener('input',()=>{$('#translateOutput').textContent='';});
  $('#translateInput').addEventListener('keydown', event => {if((event.ctrlKey||event.metaKey)&&event.key==='Enter')$('#translateButton').click();});

  const vocabularyKey='northstar-vocabulary-progress';
  const loadVocabularyProgress=()=>{try{return JSON.parse(localStorage.getItem(vocabularyKey)||'{}')}catch(_){return {}}};
  let vocabularyProgress=loadVocabularyProgress();
  let activeVocabularyWord=null;
  $('#vocabularyGoal').value=String(vocabularyProgress.goal||10);
  function updateVocabularyDashboard(){const stats=$('#vocabularyDashboardStats'),fill=$('#vocabularyDashboardProgress');if(!stats||!fill)return;const today=new Date().toISOString().slice(0,10),learned=Object.keys(vocabularyProgress.learned||{}).filter(word=>vocabularyProgress.learned[word]===today).length,target=Number($('#vocabularyGoal').value||10);stats.textContent=`${learned} / ${target} today`;fill.style.width=`${Math.min(100,Math.round(learned/target*100))}%`;}
  function renderVocabulary() {
    activeVocabularyWord=null;$('#vocabularyModal .vocabulary-detail-modal').classList.remove('word-detail-open');$('#vocabularyKicker').textContent='YOUR PERSONAL WORD BANK';if($('#vocabularyModalTitle'))$('#vocabularyModalTitle').hidden=false;const textSizeControl=$('#vocabularyModal').querySelector('.text-size-control');if(textSizeControl)textSizeControl.hidden=false;
    $('#vocabularyBack').hidden=true;$('#vocabularyNext').hidden=true;$('#vocabularyFooterLearn').hidden=true;$('#vocabularyFooterHint').hidden=false;$('#vocabularyListClose').hidden=false;
    const category=$('#vocabularyCategory').value, query=$('#vocabularySearch').value.trim().toLowerCase();
    const today=new Date().toISOString().slice(0,10), dayWords=Object.keys(vocabularyProgress.learned||{}).filter(word=>vocabularyProgress.learned[word]===today).length;
    const target=Number($('#vocabularyGoal').value||10);
    $('#vocabularyDaily').textContent=`Today: ${dayWords} of ${target} words marked learned`;
    $('#vocabularyProgressFill').style.width=`${Math.min(100,Math.round(dayWords/target*100))}%`;
    updateVocabularyDashboard();
    const rows=vocabularyWords.filter(item=>(category==='all'||item.category===category)&&(!query||`${item.word} ${item.meaning} ${item.hindi} ${item.category}`.toLowerCase().includes(query)));
    $('#vocabularyList').innerHTML=rows.map(item=>`<article class="vocab-word-card"><button class="vocab-word-open" type="button" data-word-open="${safeText(item.word)}"><span class="vocab-word-heading"><strong>${safeText(item.word)}</strong><em>${safeText(item.part)}</em></span><span class="vocab-hindi" lang="hi">${safeText(item.hindi)}</span><span class="vocab-english-meaning">${safeText(item.meaning)}</span><span class="vocab-example">${safeText(item.examples[0][0])}</span></button><div class="vocab-word-actions"><button type="button" class="vocabulary-learned${vocabularyProgress.learned?.[item.word]===today?' is-learned':''}" data-vocabulary-learn="${safeText(item.word)}">${vocabularyProgress.learned?.[item.word]===today?'✓ Learned':'Mark learned'}</button><button type="button" class="vocab-open-link" data-word-open="${safeText(item.word)}">Open →</button></div></article>`).join('') || '<p class="vocabulary-empty">No words match this search. Try another word or use Look up word.</p>';
    if (!$('#vocabularyModal').hidden) installReaderContent($('#vocabularyModalBody'), 'Vocabulary', 'Learn useful words for everyday life, study, travel and work.');
  }
  function toggleVocabularyLearned(word) {
    const today=new Date().toISOString().slice(0,10); vocabularyProgress.learned ||= {};
    if(vocabularyProgress.learned[word]===today) delete vocabularyProgress.learned[word]; else vocabularyProgress.learned[word]=today;
    vocabularyProgress.goal=Number($('#vocabularyGoal').value||10); localStorage.setItem(vocabularyKey,JSON.stringify(vocabularyProgress));
  }
  function pronounceWord(word) { if(!('speechSynthesis' in window)) { showToast('Speech playback is not available in this browser.'); return; } window.speechSynthesis.cancel(); const utterance=new SpeechSynthesisUtterance(word); utterance.lang='en-US'; window.speechSynthesis.speak(utterance); }
  function renderVocabularyWord(word) {
    const item=vocabularyWords.find(entry=>entry.word===word); if(!item)return;
    const today=new Date().toISOString().slice(0,10), learned=vocabularyProgress.learned?.[word]===today;
    activeVocabularyWord=word;const categoryWords=vocabularyWords.filter(entry=>entry.category===item.category),wordIndex=categoryWords.findIndex(entry=>entry.word===word)+1;
    const ipa={colleague:'/ˈkɒliːɡ/',neighbour:'/ˈneɪbə/',customer:'/ˈkʌstəmə/',audience:'/ˈɔːdiəns/'}[word]||'';
    const similarHindi={coworker:'सहकर्मी',teammate:'टीम का साथी',associate:'सहयोगी',local:'स्थानीय व्यक्ति',resident:'निवासी',buyer:'खरीदार',client:'ग्राहक',buddy:'दोस्त',companion:'साथी'};
    const similarWords=(item.similar||[]).map((similar,index)=>[similar,similarHindi[similar]||'']).concat(word==='colleague'?[['associate','सहयोगी']]:[]);
    $('#vocabularyKicker').textContent=`VOCABULARY · ${item.category.toUpperCase()} · WORD ${wordIndex} OF ${categoryWords.length}`;const textSizeControl=$('#vocabularyModal').querySelector('.text-size-control');if(textSizeControl)textSizeControl.hidden=true;$('#vocabularyModal .vocabulary-detail-modal').classList.add('word-detail-open');
    $('#vocabularyList').innerHTML=`<article class="vocab-word-detail"><div class="vocab-detail-title"><div><h3>${safeText(item.word)}</h3><span>${safeText(item.part)}${ipa?` · ${safeText(ipa)}`:''}</span></div><button type="button" class="vocab-speaker vocab-speaker-large" data-pronounce="${safeText(item.word)}" aria-label="Hear ${safeText(item.word)}">◖ Hear it</button></div><div class="vocab-meaning-pair"><section><h4>ENGLISH</h4><p>${safeText(item.meaning)}</p></section><section><h4>हिन्दी</h4><p lang="hi">${safeText(item.hindi)}</p></section></div><section class="vocab-detail-examples"><h4>Use it in a sentence</h4>${item.examples.map(([en,hi])=>`<article><p>${safeText(en)}</p><p lang="hi">${safeText(hi)}</p></article>`).join('')}</section><section class="vocab-similar-words"><h4>Similar words</h4><div>${similarWords.map(([similar,hindi])=>`<span>${safeText(similar)}${hindi?` · <b lang="hi">${safeText(hindi)}</b>`:''}</span>`).join('')}</div></section></article>`;
    $('#vocabularyList').innerHTML=`<article class="vocab-word-detail"><div class="vocab-detail-title"><div><h3>${safeText(item.word)}</h3><span>${safeText(item.part)}${ipa?` · ${safeText(ipa)}`:''}</span></div><button type="button" class="vocab-speaker vocab-speaker-large" data-pronounce="${safeText(item.word)}" aria-label="Hear ${safeText(item.word)}">◖ Hear it</button></div><div class="vocab-meaning-pair"><section><h4>ENGLISH</h4><p>${safeText(item.meaning)}</p></section><section><h4>हिन्दी</h4><p lang="hi">${safeText(item.hindi)}</p></section></div><section class="vocab-detail-examples"><h4>Use it in a sentence</h4>${item.examples.map(([en,hi])=>`<article><p>${safeText(en)}</p><p lang="hi">${safeText(hi)}</p></article>`).join('')}</section><section class="vocab-similar-words"><h4>Similar words</h4><div>${similarWords.map(([similar,hindi])=>`<span>${safeText(similar)}${hindi?` · <b lang="hi">${safeText(hindi)}</b>`:''}</span>`).join('')}</div></section></article>`;
    installReaderContent($('#vocabularyModalBody'), 'Vocabulary', '');
    $('#vocabularyBack').hidden=false;$('#vocabularyNext').hidden=false;$('#vocabularyFooterLearn').hidden=false;$('#vocabularyFooterLearn').textContent=learned?'Learned ✓':'Mark as learned';$('#vocabularyFooterHint').hidden=true;$('#vocabularyListClose').hidden=true;
    $('#vocabularyBack').disabled=wordIndex<=1;$('#vocabularyNext').disabled=wordIndex>=categoryWords.length;
    $('#vocabularyModalBody').scrollTop=0;
  }
  function moveVocabularyWord(delta){if(!activeVocabularyWord)return;const current=vocabularyWords.find(entry=>entry.word===activeVocabularyWord);const category=vocabularyWords.filter(entry=>entry.category===current.category),index=category.findIndex(entry=>entry.word===activeVocabularyWord),next=category[index+delta];if(next)renderVocabularyWord(next.word);}
  $('#vocabularyBack').addEventListener('click',()=>moveVocabularyWord(-1));$('#vocabularyNext').addEventListener('click',()=>moveVocabularyWord(1));
  $('#vocabularyFooterLearn').addEventListener('click',()=>{if(!activeVocabularyWord)return;const word=activeVocabularyWord;toggleVocabularyLearned(word);renderVocabularyWord(word);updateVocabularyDashboard();const today=new Date().toISOString().slice(0,10),count=Object.keys(vocabularyProgress.learned||{}).filter(item=>vocabularyProgress.learned[item]===today).length,target=Number($('#vocabularyGoal').value||10);$('#vocabularyDaily').textContent=`Today: ${count} of ${target} words marked learned`;$('#vocabularyProgressFill').style.width=`${Math.min(100,Math.round(count/target*100))}%`;});
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
  $$('.vocabulary-category-tabs [data-vocabulary-category]').forEach(button=>button.addEventListener('click',()=>{$('#vocabularyCategory').value=button.dataset.vocabularyCategory;$$('.vocabulary-category-tabs [data-vocabulary-category]').forEach(tab=>{const selected=tab===button;tab.classList.toggle('active',selected);tab.setAttribute('aria-selected',String(selected));});renderVocabulary();}));
  $('#vocabularyGoal').addEventListener('change',()=>{vocabularyProgress.goal=Number($('#vocabularyGoal').value);localStorage.setItem(vocabularyKey,JSON.stringify(vocabularyProgress));renderVocabulary();});
  $('#vocabularySearch').addEventListener('input',renderVocabulary);
  $('#vocabularySearch').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();lookupVocabulary();}});
  $('#vocabularyLookup').addEventListener('click',lookupVocabulary);
  $('#vocabularyList').addEventListener('click',event=>{
    const learned=event.target.closest('[data-vocabulary-learn]'); if(learned){toggleVocabularyLearned(learned.dataset.vocabularyLearn);if(learned.closest('.vocab-word-detail'))renderVocabularyWord(learned.dataset.vocabularyLearn);else renderVocabulary();return;}
    const speaker=event.target.closest('[data-pronounce]'); if(speaker){pronounceWord(speaker.dataset.pronounce);return;}
    const open=event.target.closest('[data-word-open]'); if(open)renderVocabularyWord(open.dataset.wordOpen);
  });
  renderVocabulary();
  function openVocabulary() {
    const body=$('#vocabularyModalBody');
    installReaderContent(body, 'Vocabulary', 'Learn useful words for everyday life, study, travel and work. Hindi meanings sit beside each word.');
    const card=$('#vocabularyCard'); card.hidden=false; body.append(card);
    $('#vocabularyBack').hidden=true; renderVocabulary();
    openReadingModal('vocabularyModal', 'vocabulary');
    installReaderContent(body, 'Vocabulary', 'Learn useful words for everyday life, study, travel and work.');
    $('#vocabularySearch').focus({preventScroll:true});
  }
  $('#openVocabularyCard').addEventListener('click', openVocabulary);
  const date = new Intl.DateTimeFormat('en',{weekday:'short',month:'short',day:'numeric'}).format(new Date());
  $('#todayLabel').textContent = date;
  $('#levelSelect').value = level;
  $('#goalSelect').value = goal;

  function renderLessons() {
    const course = getCourse(level);
    $('#roadmapTitle').textContent = `${level} · ${course.subtitle}`;
    $('#languageScopeNote').textContent = language.toLowerCase() === 'english' ? 'English grammar and speaking topics are explained in Hindi and English, with a practice quiz and related video suggestions inside each lesson. The roadmap follows beginner, intermediate and advanced stages; use the linked references for further detail.' : `${language} follows the level you choose, with speaking and writing practice matched to each topic. Related video suggestions appear inside each lesson.`;
    const lessonIcons={SPEAKING:'chat',COMMUNICATION:'chat',SIMULATION:'chat',PRESENTATION:'video',PRONUNCIATION:'audio',VOCABULARY:'book',GRAMMAR:'book-open',FOUNDATION:'layers',LISTENING:'headphones',WRITING:'pencil',READING:'book-open',FLUENCY:'chat'};
    const vocabularyLauncher = $('#openVocabularyCard');
    vocabularyLauncher?.remove();
    $('#lessonList').innerHTML = course.lessons.map((lesson,index) => {
      const done = completed.has(lesson.id);
      const icon=lessonIcons[lesson.type]||'book-open';
      return `<button class="lesson-row ${lesson.type==='VOCABULARY'?'lesson-vocabulary':''} ${done?'is-complete':''}" data-lesson="${lesson.id}"><span class="lesson-index"><svg aria-hidden="true"><use href="/static/icons.svg?v=northstar-icons-20261028-2#icon-${icon}"></use></svg><i>Step ${index+1}</i></span><span class="lesson-details"><span class="lesson-type">${lesson.type}</span><strong>${lesson.title}</strong><small>${lesson.desc}</small></span><span class="lesson-duration">${lesson.time}</span><span class="lesson-open"><svg aria-hidden="true"><use href="/static/icons.svg#icon-arrow-right"></use></svg></span></button>`;
    }).join('');
    if (vocabularyLauncher) $('#lessonList').append(vocabularyLauncher);
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

  const topicActivityLabels={
    en:{speak:'Speaking practice',write:'Sentence writing',speakButton:'Start speaking',writeButton:'Check my sentences',writeLabel:'Write your response',saved:'Your draft is saved in this browser.'},
    hi:{speak:'बोलने का अभ्यास',write:'वाक्य लेखन',speakButton:'बोलना शुरू करें',writeButton:'वाक्य जाँचें',writeLabel:'अपना जवाब लिखें',saved:'आपका जवाब इसी ब्राउज़र में सेव होता है।'},
    es:{speak:'Práctica oral',write:'Escritura de oraciones',speakButton:'Empezar a hablar',writeButton:'Revisar mis oraciones',writeLabel:'Escribe tu respuesta',saved:'Tu borrador se guarda en este navegador.'},
    fr:{speak:'Pratique orale',write:'Écriture de phrases',speakButton:'Commencer à parler',writeButton:'Vérifier mes phrases',writeLabel:'Écrivez votre réponse',saved:'Votre brouillon est enregistré dans ce navigateur.'},
    de:{speak:'Sprechübung',write:'Sätze schreiben',speakButton:'Sprechen starten',writeButton:'Sätze prüfen',writeLabel:'Schreibe deine Antwort',saved:'Dein Entwurf wird in diesem Browser gespeichert.'},
    it:{speak:'Esercizio di conversazione',write:'Scrittura di frasi',speakButton:'Inizia a parlare',writeButton:'Controlla le frasi',writeLabel:'Scrivi la tua risposta',saved:'La bozza è salvata in questo browser.'},
    pt:{speak:'Prática de conversação',write:'Escrita de frases',speakButton:'Começar a falar',writeButton:'Revisar minhas frases',writeLabel:'Escreva sua resposta',saved:'Seu rascunho fica salvo neste navegador.'},
    ja:{speak:'スピーキング練習',write:'文章を書く',speakButton:'話す練習を始める',writeButton:'文章を確認する',writeLabel:'答えを書いてください',saved:'下書きはこのブラウザーに保存されます。'},
    zh:{speak:'口语练习',write:'句子写作',speakButton:'开始口语练习',writeButton:'检查句子',writeLabel:'写下你的回答',saved:'草稿保存在此浏览器中。'},
    ar:{speak:'تدريب على التحدث',write:'كتابة الجمل',speakButton:'ابدأ التحدث',writeButton:'راجع جُملي',writeLabel:'اكتب إجابتك',saved:'يُحفظ المسودّة في هذا المتصفح.'},
    ur:{speak:'بولنے کی مشق',write:'جملے لکھنے کی مشق',speakButton:'بولنا شروع کریں',writeButton:'میرے جملے دیکھیں',writeLabel:'اپنا جواب لکھیں',saved:'آپ کا مسودہ اسی براؤزر میں محفوظ ہے۔'}
  };
  function topicEndPracticeMarkup(title,practice,key,id) {
    let saved='';try{saved=localStorage.getItem(key)||'';}catch(_){}
    const goalNames={hi:'वाक्य',es:'Oraciones',fr:'Phrases',de:'Sätze',it:'Frasi',pt:'Frases',ja:'文',zh:'句子',ar:'جمل',ur:'جملے'};
    const labels={...(topicActivityLabels[languageCode]||{speak:`Speaking practice · ${language}`,write:`Sentence writing · ${language}`,speakButton:'Start speaking',writeButton:'Check my sentences',writeLabel:'Write your response',saved:'Your draft is saved in this browser.'}),goal:goalNames[languageCode]||'Sentences'};
    const speaking=practice||`Talk about ${title}.`;
    const writing=`Write three short sentences about ${title}. Use one idea from this lesson.`;
    return `<section class="lesson-section topic-end-practice" data-topic-activity="${safeText(id)}" data-topic-title="${safeText(title)}"><div class="topic-speaking-activity" id="speaking-practice"><span class="feature-tag">${safeText(language.toUpperCase())}</span><h3 data-activity-label="speak">${safeText(labels.speak)}</h3><p class="topic-speaking-prompt" data-practice-source="${safeText(speaking)}">${safeText(speaking)}</p><div class="topic-speaking-actions"><button type="button" class="primary-button" id="lessonSpeak" data-topic-record data-practice-prompt="${safeText(speaking)}">${safeText(labels.speakButton)} <span>●</span></button><button type="button" class="quiet-button" data-topic-hear>Hear prompt</button></div><div class="topic-speaking-result" data-speaking-result aria-live="polite" hidden><strong data-speaking-status></strong><p data-speaking-transcript></p></div></div><div class="topic-writing-activity" id="writing-practice"><span class="feature-tag">${safeText(language.toUpperCase())}</span><h3 data-activity-label="write">${safeText(labels.write)}</h3><label class="topic-sentence-goal" for="topicSentenceGoal"><span data-activity-label="goal">${safeText(labels.goal||'Sentences')}</span><select id="topicSentenceGoal"><option value="3">3</option><option value="5">5</option><option value="8">8</option></select></label><p class="topic-writing-prompt" data-writing-source="${safeText(writing)}">${safeText(writing)}</p><label for="writingPractice" data-activity-label="writeLabel">${safeText(labels.writeLabel)}</label><textarea id="writingPractice" rows="4" lang="${safeText(languageCode||'en')}" placeholder="Write in ${safeText(language)}…">${safeText(saved)}</textarea><div class="topic-writing-actions"><small data-activity-label="saved">${safeText(labels.saved)}</small><button type="button" class="quiet-button" data-topic-writing-check>${safeText(labels.writeButton)}</button></div><p class="topic-writing-feedback" data-topic-writing-feedback aria-live="polite" hidden></p></div></section>`;
  }
  function bindTopicEndPractice(key,activityId) {
    const section=$('[data-topic-activity]',$('#lessonBody')),field=$('#writingPractice');if(!section||!field)return;
    field.addEventListener('input',()=>{try{localStorage.setItem(key,field.value)}catch(_){}});
    $('#topicSentenceGoal').addEventListener('change',()=>{const source=`Write ${$('#topicSentenceGoal').value} short sentences about ${section.dataset.topicTitle}. Use one idea from this lesson.`;const prompt=$('[data-writing-source]',section);prompt.dataset.writingSource=source;prompt.textContent=source;if(languageCode&&languageCode!=='en')localizeTopicEndPractice(section,activityId);});
    $('[data-topic-writing-check]',section).addEventListener('click',async()=>{
      const text=field.value.trim(),feedback=$('[data-topic-writing-feedback]',section),sentences=text.split(/[.!?。！？।]+/).map(value=>value.trim()).filter(Boolean),goal=Number($('#topicSentenceGoal').value||3);
      if(!text){let empty=languageCode==='en'?'Write a few sentences about this lesson first.':'Write a few sentences about this lesson first.';if(languageCode!=='en')empty=await translateActivityText(empty,languageCode);feedback.textContent=empty;feedback.hidden=false;return;}
      let message=`You wrote ${sentences.length} of ${goal} sentences. Read your answer aloud and check that it matches the topic.`;
      if(sentences.length<goal)message+=` Add ${goal-sentences.length} more sentence${goal-sentences.length===1?'':'s'}.`;
      if(languageCode==='en'&&!/[.!?]["')\]]?\s*$/.test(text))message+=' Add a full stop or question mark at the end.';
      else if(languageCode!=='en')message=await translateActivityText(message,languageCode)||message;
      if(!section.isConnected||section.dataset.topicActivity!==activityId)return;
      feedback.textContent=message;feedback.hidden=false;
    });
    const speak=$('#lessonSpeak'),record=$('[data-topic-record]',section),result=$('[data-speaking-result]',section),recordButton=record;
    $('[data-topic-hear]',section).addEventListener('click',()=>speakTranslation(speak.dataset.practicePrompt||$('[data-practice-source]',section).textContent,languageCode||'en'));
    recordButton.addEventListener('click',()=>openPractice(speak.dataset.practicePrompt||$('[data-practice-source]',section).textContent));
    if(languageCode&&languageCode!=='en')localizeTopicEndPractice(section,activityId);
  }
  async function translateWithGoogle(text,from,to){
    const params=new URLSearchParams({client:'gtx',sl:from,tl:to,dt:'t',q:text});
    const response=await fetch(`https://translate.googleapis.com/translate_a/single?${params}`,{headers:{Accept:'application/json'}});
    if(!response.ok)throw new Error('Translation service unavailable');
    const data=await response.json();
    const translated=(Array.isArray(data?.[0])?data[0]:[]).filter(part=>Array.isArray(part)&&typeof part[0]==='string').map(part=>part[0]).join('').trim();
    if(!translated)throw new Error('No translation returned');
    return translated;
  }
  async function translateActivityText(text,code){
    if(!text||!code||code==='en')return text;
    try{return await translateWithGoogle(text,'en',code);}catch(_){return text;}
  }
  async function localizeTopicEndPractice(section,activityId){
    const speakSource=$('[data-practice-source]',section).dataset.practiceSource,writeSource=$('[data-writing-source]',section).dataset.writingSource,code=languageCode;
    const [speaking,writing]=await Promise.all([translateActivityText(speakSource,code),translateActivityText(writeSource,code)]);
    if(!section.isConnected||section.dataset.topicActivity!==activityId||code!==languageCode)return;
    $('[data-practice-source]',section).textContent=speaking;$('#lessonSpeak').dataset.practicePrompt=speaking;$('[data-writing-source]',section).textContent=writing;
    if(!topicActivityLabels[code]){
      const items=[['speak','Speaking practice'],['write','Sentence writing'],['speakButton','Start speaking'],['writeLabel','Write your response'],['saved','Your draft is saved in this browser.'],['writeButton','Check my sentences'],['goal','Sentences']];
      const translated=await Promise.all(items.map(([,source])=>translateActivityText(source,code)));
      if(!section.isConnected||section.dataset.topicActivity!==activityId||code!==languageCode)return;
      items.forEach(([key],index)=>{const node=$(`[data-activity-label="${key}"]`,section);if(node)node.textContent=translated[index];else if(key==='speakButton')$('#lessonSpeak').textContent=translated[index];else if(key==='writeButton')$('[data-topic-writing-check]',section).textContent=translated[index];});
      $('#lessonSpeak').textContent=translated[2];$('[data-topic-writing-check]',section).textContent=translated[5];
    }
  }

  function topicQuizItems(lesson) {
    const noteText=(item)=>Array.isArray(item.notes)?item.notes.map(note=>typeof note==='string'?note:note?.en||'').join(' '):'';
    const points=teachingSentences(noteText(lesson)).filter(point=>point.length>=28&&point.length<=210);
    const keyPoints=(points.length?points:[lesson.desc,lesson.practice].filter(Boolean)).slice(0,3);
    while(keyPoints.length<3)keyPoints.push(keyPoints[keyPoints.length-1]||lesson.desc||lesson.title);
    const distractors=currentLessons().filter(item=>item.id!==lesson.id).flatMap(item=>teachingSentences(noteText(item)).filter(point=>point.length>=28&&point.length<=210));
    const seed=[...lesson.id].reduce((sum,char)=>sum+char.charCodeAt(0),0);
    return keyPoints.map((point,index)=>{
      const choices=[point];
      for(let offset=0;choices.length<4&&offset<distractors.length;offset++){
        const candidate=distractors[(seed+index*11+offset*7)%distractors.length];
        if(candidate&&!choices.includes(candidate))choices.push(candidate);
      }
      while(choices.length<4)choices.push(`This point is not part of ${lesson.title}.`);
      const answer=(seed+index)%choices.length;
      [choices[0],choices[answer]]=[choices[answer],choices[0]];
      return {q:`Which idea is taught in “${lesson.title}”?`,options:choices,answer,why:'This point comes from the explanation for this topic.'};
    });
  }
  function topicPracticeMarkup(lesson) {
    const items=topicQuizItems(lesson);
    return `<section class="topic-practice lesson-section" id="interactive-practice" data-topic-practice><div class="topic-practice-heading"><div><span class="feature-tag">PRACTISE THIS TOPIC</span><h3>Topic quiz · 3 questions</h3><p>Check the key ideas from this lesson. Each answer includes a short explanation.</p></div><button type="button" class="primary-button" data-topic-start>Start quiz →</button></div><div class="topic-practice-session" data-topic-session hidden data-items="${safeText(JSON.stringify(items))}"><p data-topic-count></p><strong data-topic-stem></strong><div class="topic-practice-options" data-topic-options></div><div class="topic-practice-feedback" data-topic-feedback hidden></div><button type="button" class="quiet-button" data-topic-next disabled>Next question</button></div></section>`;
  }
  function bindTopicPractice() {
    const root=$('[data-topic-practice]'); if(!root)return;
    const session=$('[data-topic-session]',root), items=JSON.parse(session.dataset.items);let index=0,chosen=null,score=0,reviewed=false;
    $('[data-topic-start]',root).addEventListener('click',()=>{
      session.hidden=false;index=0;chosen=null;score=0;reviewed=false;$('[data-topic-next]',session).hidden=false;showTopicQuestion();
    });
    async function showTopicQuestion(){
      const questionIndex=index,item=items[questionIndex];reviewed=false;$('[data-topic-count]',session).textContent=`Question ${questionIndex+1} of ${items.length}`;
      $('[data-topic-feedback]',session).hidden=true;$('[data-topic-next]',session).disabled=true;$('[data-topic-next]',session).textContent='Check answer';chosen=null;
      $('[data-topic-stem]',session).textContent='Preparing your topic question…';
      const [question,...options]=await Promise.all([item.q,...item.options].map(text=>languageCode&&languageCode!=='en'?translateActivityText(text,languageCode):text));
      if(!session.isConnected||questionIndex!==index)return;
      $('[data-topic-stem]',session).textContent=question;
      $('[data-topic-options]',session).innerHTML=options.map((option,i)=>`<button type="button" class="placement-option" data-topic-option="${i}"><span>${String.fromCharCode(65+i)}</span>${safeText(option)}</button>`).join('');
      $$('[data-topic-option]',session).forEach(button=>button.addEventListener('click',async()=>{if(reviewed)return;reviewed=true;chosen=Number(button.dataset.topicOption);const correct=chosen===item.answer;if(correct)score++;$$('[data-topic-option]',session).forEach((node,i)=>{node.classList.toggle('selected',node===button);node.classList.toggle('is-correct',i===item.answer);node.classList.toggle('is-wrong',node===button&&!correct);node.disabled=true;});const message=languageCode&&languageCode!=='en'?await translateActivityText(item.why,languageCode):item.why;if(!session.isConnected||questionIndex!==index)return;$('[data-topic-feedback]',session).innerHTML=`<strong>${correct?'Correct!':'Not quite.'}</strong> ${safeText(message)}`;$('[data-topic-feedback]',session).hidden=false;$('[data-topic-next]',session).textContent=index===items.length-1?'Finish practice':'Next question';$('[data-topic-next]',session).disabled=false;}));
    }
    $('[data-topic-next]',session).addEventListener('click',()=>{
      if(!reviewed){if(chosen===null)return;const item=items[index],correct=chosen===item.answer;if(correct)score++;
        $('[data-topic-feedback]',session).innerHTML=`<strong>${correct?'Correct.':'Not quite.'} ${correct?'':'Correct answer: '+safeText(item.options[item.answer])+'. '}</strong>${safeText(item.why)}`;$('[data-topic-feedback]',session).hidden=false;reviewed=true;
        $('[data-topic-next]',session).textContent=index===items.length-1?'See results':'Next question';$('[data-topic-next]',session).disabled=false;return;}
      if(index===items.length-1){$('[data-topic-stem]',session).textContent=`Practice complete · ${score} of ${items.length} correct.`;$('[data-topic-options]',session).innerHTML='';$('[data-topic-feedback]',session).textContent='Review the explanations above and revisit the lesson notes where useful.';$('[data-topic-next]',session).hidden=true;return;}
      index++;showTopicQuestion();
    });
  }

  function teachingSentences(value) { return String(value||'').match(/[^.!?।]+[.!?।]?/g)?.map(part=>part.trim()).filter(Boolean)||[]; }
  function lessonLanguageCard(en,hi) { return `<div class="lesson-language-pair"><article class="lesson-language-card lang-en" data-language="en"><strong>English</strong><p>${safeText(en||'')}</p></article><article class="lesson-language-card lang-hi" data-language="hi" lang="hi"><strong>हिन्दी</strong><p>${safeText(hi||'')}</p></article></div>`; }
  function extractLessonExamples(enText,hiText) {
    const quotes=[...String(enText||'').matchAll(/[“"]([^”"]{5,})[”"]/g)].map(match=>match[1]).filter(text=>text.includes(' '));
    const unique=[...new Set(quotes)].slice(0,3);
    return unique.map(sentence=>{const index=String(hiText||'').indexOf(sentence);let hindi='';if(index>=0){const after=String(hiText).slice(index+sentence.length).replace(/^[”"]\s*/,'');hindi=after.match(/^\(([^)]+)\)/)?.[1]||'';}return {sentence,hindi};});
  }
  function grammarMistakes(id) {
    const byLesson={
      'g-basic-word-order':[['Maya novels reads.','Maya reads novels.'],['Is raining today.','It is raining today.'],['I every day English practise.','I practise English every day.']],
      'g-basic-present-simple':[['She go to work.','She goes to work.'],['Does he likes tea?','Does he like tea?'],['I walks to school.','I walk to school.']],
      'g-basic-articles':[['I saw dog.','I saw a dog.'],['Sun is bright.','The sun is bright.'],['She likes the music. (general)','She likes music.']],
      'g-basic-past-simple':[['We did not went.','We did not go.'],['Did you saw it?','Did you see it?'],['She goed home.','She went home.']]
    };
    return byLesson[id]||[['She go to work.','She goes to work.'],['I am agree.','I agree.'],['He doesn’t likes tea.','He doesn’t like tea.']];
  }
  function quickLessonPanels(lesson){
    const detailed=`<section class="lesson-section lesson-detailed-heading" id="detailed-lesson"><h3>Detailed lesson</h3><p>Read the explanation, rules and examples below.</p></section>`;
    return detailed;
  }
  function lessonPracticeCards(){return `<section class="lesson-section lesson-practice-shortcuts" id="topic-practice"><h3>Practise this topic</h3><p>Choose a quick activity. Each one uses the lesson you just studied.</p><div class="lesson-practice-card-grid"><button type="button" data-reader-jump="interactive-practice"><span class="practice-card-index">01</span><strong>Quiz practice</strong><small>Check what you remember</small><b>Start quiz →</b></button><button type="button" data-reader-jump="speaking-practice"><span class="practice-card-index">02</span><strong>Speaking practice</strong><small>Say your own examples aloud</small><b>Start speaking →</b></button><button type="button" data-reader-jump="writing-practice"><span class="practice-card-index">03</span><strong>Writing practice</strong><small>Write sentences using this topic</small><b>Start writing →</b></button></div></section>`;}
  function renderDetailedChapter(lesson,chapter) {
    const pair=(english,hindi)=>lessonLanguageCard(english,hindi);
    const autoText=text=>`<div class="chapter-language-pair"><p data-language="en">${safeText(text)}</p><p class="chapter-auto-translation" data-language="translated" data-source-text="${safeText(text)}" hidden></p></div>`;
    const objectiveCards=chapter.objectives.map((item,index)=>`<article class="chapter-objective"><span>${String(index+1).padStart(2,'0')}</span>${pair(item,chapter.objectivesHindi[index]||'इस लक्ष्य को इस पाठ के उदाहरणों के साथ समझें।')}</article>`).join('');
    const concepts=chapter.concepts.map((concept,index)=>`<article class="chapter-concept"><div class="chapter-concept-head"><span>CONCEPT ${String(index+1).padStart(2,'0')}</span><h4>${safeText(concept.title)}</h4></div>${pair(concept.definition,concept.hi)}<div class="chapter-identify"><strong>How to identify it</strong>${autoText(concept.identify)}</div><div class="chapter-concept-examples"><strong>Examples</strong>${concept.examples.map(([en,hi,why])=>`<article>${pair(en,hi)}${autoText(why)}</article>`).join('')}</div><details class="chapter-knowledge-check"><summary>Quick knowledge check</summary>${autoText(`In one sentence, explain ${concept.title.split(' · ')[0]}.`)}${autoText(concept.definition)}</details></article>`).join('');
    const rules=chapter.rules.map(([title,formula,en,hi,why,exception],index)=>`<article class="chapter-rule"><span class="chapter-rule-number">${String(index+1).padStart(2,'0')}</span><div><h4>${safeText(title)}</h4><p class="chapter-formula">${safeText(formula)}</p>${pair(en,hi)}${autoText(`Why it matters: ${why}`)}${autoText(`Remember: ${exception}`)}</div></article>`).join('');
    const patterns=chapter.patterns.map(([formula,explanation,examples])=>`<article class="chapter-pattern"><span class="chapter-formula">${safeText(formula)}</span>${autoText(explanation)}<div class="chapter-pattern-examples">${examples.map(([sentence,hindi])=>pair(sentence,hindi)).join('')}</div><details><summary>Try this pattern</summary>${autoText(`Write one new sentence using ${formula}.`)}</details></article>`).join('');
    const categories=['Basic','Intermediate','Daily life','Speaking','Writing'];
    const examples=chapter.examples.map((item,index)=>`<article class="chapter-example"><span class="chapter-example-tag">${categories[Math.min(4,Math.floor(index/4))]} · ${String(index+1).padStart(2,'0')}</span><div class="chapter-sentence-parts"><span><small>SUBJECT</small><b>${safeText(item.s)}</b></span><span><small>VERB</small><b>${safeText(item.v)}</b></span><span><small>OBJECT / DETAIL</small><b>${safeText(item.r||'—')}</b></span></div>${pair(`${item.s} ${item.v}${item.r?' '+item.r:''}`,item.hi)}${autoText(item.why)}</article>`).join('');
    const mistakes=chapter.mistakes.map(([wrong,right,why],index)=>`<article class="chapter-mistake"><span>MISTAKE ${String(index+1).padStart(2,'0')}</span><div class="wrong-sentence">${autoText(`Incorrect: ${wrong}`)}</div><div class="right-sentence">${autoText(`Correct: ${right}`)}</div>${autoText(why)}</article>`).join('');
    const scenarios=chapter.scenarios.map(([title,task,vocab,samples,hi],index)=>`<article class="chapter-scenario"><span>SCENARIO ${String(index+1).padStart(2,'0')}</span><h4>${safeText(title)}</h4>${pair(task,hi)}<div class="chapter-vocabulary">${vocab.map(word=>`<span>${safeText(word)}</span>`).join('')}</div><div class="chapter-sample-sentences">${samples.map(sample=>autoText(sample)).join('')}</div><details><summary>Your turn</summary>${autoText('Write or say three sentences for this situation. Use a clear subject and verb in each sentence.')}</details></article>`).join('');
    const quiz=(items,label)=>`<section class="lesson-section chapter-quiz" id="${label==='assessment'?'final-assessment':'interactive-practice'}" data-chapter-quiz="${label}" data-items="${safeText(JSON.stringify(items))}"><div class="chapter-quiz-heading"><span class="chapter-kicker">${label==='assessment'?'FINAL ASSESSMENT':'PRACTICE · 20 QUESTIONS'}</span><h3>${label==='assessment'?'Check what you have learned':'Practise the sentence patterns'}</h3><p>${label==='assessment'?'Answer 10 mixed questions. Review each explanation before you finish.':'Questions use multiple choice, fill-in, sentence order, error correction and matching-style choices.'}</p><button class="primary-button" type="button" data-chapter-start>${label==='assessment'?'Start assessment':'Start practice'} →</button></div><div class="chapter-quiz-session" data-chapter-session hidden><p data-chapter-count></p><strong data-chapter-question></strong><div class="chapter-quiz-options" data-chapter-options></div><div class="chapter-quiz-feedback" data-chapter-feedback hidden></div><div class="chapter-quiz-actions"><span data-chapter-score></span><button class="primary-button" type="button" data-chapter-next disabled>Check answer</button></div></div></section>`;
    const intro=`<section class="lesson-section chapter-introduction" id="introduction"><h3>Introduction</h3><h4>Let’s understand sentence structure</h4>${pair(chapter.intro.en,chapter.intro.hi)}<div class="chapter-callout"><strong>Why word order matters</strong><p>Listeners use word order to understand who acts and what happens. Changing the order can change the meaning or make a sentence hard to follow.</p></div></section>`;
    const objectiveSection=`<section class="lesson-section" id="learning-objectives"><h3>What you’ll learn</h3><p class="chapter-section-lead">By the end of this lesson, you will be able to:</p><div class="chapter-objectives">${objectiveCards}</div></section>`;
    const practiceShortcuts='';
    const detailedHeading=`<section class="lesson-section lesson-detailed-heading" id="detailed-lesson"><h3>Detailed lesson</h3><p>Work through the concepts, rules and examples below at your own pace.</p></section>`;
    const conceptsSection=`<section class="lesson-section" id="basic-concepts"><h3>Understand the basic concepts</h3><p class="chapter-section-lead">Learn the job each part does, then use the question prompts to check your understanding.</p><div class="chapter-concepts">${concepts}</div></section>`;
    const visual=`<section class="lesson-section" id="visual-explanation"><h3>See the sentence structure</h3><div class="chapter-diagram"><p>Maya reads novels.</p><div><span><small>SUBJECT</small><b>Maya</b><em>Who?</em></span><i>+</i><span><small>VERB</small><b>reads</b><em>What happens?</em></span><i>+</i><span><small>OBJECT</small><b>novels</b><em>Reads what?</em></span></div><p lang="hi">माया उपन्यास पढ़ती है। · माया = कौन? · पढ़ती है = क्या करती है? · उपन्यास = क्या पढ़ती है?</p></div><div class="chapter-patterns">${chapter.patterns.map(([formula,explanation])=>`<article><b>${safeText(formula)}</b><p>${safeText(explanation)}</p></article>`).join('')}</div><p class="chapter-section-lead">A sentence can be complete without an object: “Birds sing.”</p></section>`;
    const ruleSection=`<section class="lesson-section" id="grammar-rules"><h3>Important sentence structure rules</h3><div class="chapter-rules">${rules}</div></section>`;
    const patternSection=`<section class="lesson-section" id="sentence-patterns"><h3>Sentence patterns</h3><div class="chapter-pattern-list">${patterns}</div></section>`;
    const exampleSection=`<section class="lesson-section" id="detailed-examples"><h3>Detailed examples</h3><p class="chapter-section-lead">The subject, verb and rest of the sentence are labelled so you can see each part at a glance.</p><div class="chapter-example-grid">${examples}</div></section>`;
    const mistakeSection=`<section class="lesson-section" id="common-mistakes"><h3>Common mistakes</h3><div class="chapter-mistake-grid">${mistakes}</div></section>`;
    const realLife=`<section class="lesson-section" id="real-life-applications"><h3>Use it in real life</h3><div class="chapter-scenario-grid">${scenarios}</div></section>`;
    const speaking=`<section class="lesson-section chapter-speaking" id="speaking-practice" data-chapter-speaking><h3>Speaking practice</h3><p class="chapter-section-lead">Choose one prompt, listen to it, then speak for 30–60 seconds using complete sentences.</p><label>Choose an activity<select data-speaking-choice>${chapter.scenarios.slice(0,3).map(([title,task])=>`<option value="${safeText(`${title}: ${task}`)}">${safeText(title)}</option>`).join('')}</select></label><div class="chapter-speaking-prompt" data-speaking-prompt>${safeText(`${chapter.scenarios[0][0]}: ${chapter.scenarios[0][1]}`)}</div><div class="chapter-speaking-controls"><button class="primary-button" type="button" data-chapter-record>● Start speaking</button><button class="quiet-button" type="button" data-chapter-hear>Hear prompt</button></div><div class="chapter-transcript" data-chapter-transcript aria-live="polite">Your speech transcript will appear here.</div><p class="chapter-feedback-note">Speech recognition provides a transcript when your browser supports it. It does not score pronunciation or grammar.</p></section>`;
    const writeKey=`northstar-writing:${language}:${level}:${lesson.id}`;let draft='';try{draft=localStorage.getItem(writeKey)||'';}catch(_){}
    const writing=`<section class="lesson-section chapter-writing" id="writing-practice" data-chapter-writing data-writing-key="${safeText(writeKey)}"><h3>Writing practice</h3><p class="chapter-section-lead">Write 3–5 sentences introducing yourself and describing one daily activity. Use a subject and verb in every sentence.</p><details class="chapter-model-answer"><summary>Read a sample answer</summary><p>My name is Asha. I work in a bookshop. I help customers every day. I enjoy my work because I meet many people.</p><p lang="hi">मेरा नाम आशा है। मैं किताबों की दुकान में काम करती हूँ। मैं हर दिन ग्राहकों की मदद करती हूँ। मुझे अपना काम पसंद है क्योंकि मैं कई लोगों से मिलती हूँ।</p></details><div class="chapter-vocabulary"><span>work</span><span>study</span><span>enjoy</span><span>help</span><span>every day</span><span>because</span></div><label for="chapterWritingEditor">Your response</label><textarea id="chapterWritingEditor" data-writing-editor rows="8" placeholder="Write 3–5 complete sentences…">${safeText(draft)}</textarea><div class="chapter-writing-meta"><span data-writing-count>0 words · 0 sentences</span><button class="primary-button" type="button" data-writing-check>Check my writing</button></div><div class="chapter-writing-feedback" data-writing-feedback hidden></div></section>`;
    const revision=`<section class="lesson-section" id="quick-revision"><h3>Quick revision</h3><div class="chapter-revision-grid">${chapter.revision.map((point,index)=>`<article><span>${String(index+1).padStart(2,'0')}</span>${autoText(point)}</article>`).join('')}</div><div class="chapter-recap"><h4>Five quick recall questions</h4>${chapter.recap.map(([question,answer],index)=>`<details><summary>${String(index+1)}. ${safeText(question)}</summary>${autoText(answer)}</details>`).join('')}</div></section>`;
    const completion=`<section class="lesson-section chapter-completion" id="lesson-completion"><span class="chapter-kicker">LESSON PROGRESS</span><h3>Your learning summary</h3><div class="chapter-completion-grid"><article><span>Time in this lesson</span><strong data-lesson-time>0 min</strong></article><article><span>Practice score</span><strong data-practice-result>Not started</strong></article><article><span>Assessment score</span><strong data-assessment-result>Not started</strong></article></div><p>Finish the practice and assessment, then mark the lesson complete using the button below.</p></section>`;
    return `${lessonLanguageTabsMarkup()}${practiceShortcuts}${detailedHeading}${objectiveSection}${intro}${conceptsSection}${visual}${ruleSection}${patternSection}${exampleSection}${mistakeSection}${realLife}${quiz(chapter.quiz,'practice')}${speaking}${writing}${revision}${quiz(chapter.assessment,'assessment')}${completion}${lessonPracticeCards()}`;
  }
  function bindChapterActivities(chapter,lesson) {
    const body=$('#lessonBody'),started=Date.now(),draftKey=`northstar-chapter-writing:${language}:${lesson.id}`;
    const timeNode=$('[data-lesson-time]',body);let timer=setInterval(()=>{if(!timeNode?.isConnected||$('#lessonModal').hidden){clearInterval(timer);return;}timeNode.textContent=`${Math.max(1,Math.floor((Date.now()-started)/60000))} min`;},15000);
    $$('[data-chapter-quiz]',body).forEach(root=>{
      const kind=root.dataset.chapterQuiz,items=JSON.parse(root.dataset.items),session=$('[data-chapter-session]',root);
      let index=0,score=0,selected=null,reviewed=false,answers=[];
      const start=$('[data-chapter-start]',root),next=$('[data-chapter-next]',session);
      const showQuestion=async()=>{
        const questionIndex=index,item=items[questionIndex];selected=null;reviewed=false;
        $('[data-chapter-count]',session).textContent=`Question ${questionIndex+1} of ${items.length} · ${item.type||'Mixed review'}`;
        $('[data-chapter-question]',session).textContent='Preparing question…';$('[data-chapter-feedback]',session).hidden=true;next.disabled=true;next.textContent='Check answer';
        const translated=await Promise.all([item.q,...item.options].map(text=>languageCode&&languageCode!=='en'?translateActivityText(text,languageCode):text));
        if(!session.isConnected||index!==questionIndex)return;
        $('[data-chapter-question]',session).textContent=translated[0];
        $('[data-chapter-options]',session).innerHTML=translated.slice(1).map((option,optionIndex)=>`<button type="button" data-chapter-option="${optionIndex}"><span>${String.fromCharCode(65+optionIndex)}</span>${safeText(option)}</button>`).join('');
        $$('[data-chapter-option]',session).forEach(button=>button.addEventListener('click',()=>{
          if(reviewed)return;selected=Number(button.dataset.chapterOption);reviewed=true;
          const correct=selected===item.answer;if(correct)score++;
          $('[data-chapter-score]',session).textContent=`Score: ${score} / ${items.length}`;
          $$('[data-chapter-option]',session).forEach((option,optionIndex)=>{option.disabled=true;option.setAttribute('aria-pressed',String(option===button));option.classList.toggle('is-correct',optionIndex===item.answer);option.classList.toggle('is-wrong',option===button&&!correct);});
          answers.push({question:item.q,correctAnswer:item.options[item.answer],selected:item.options[selected],correct,why:item.why});
          (async()=>{const explanation=languageCode&&languageCode!=='en'?await translateActivityText(item.why,languageCode):item.why;const prefix=correct?'Correct!':'Not quite.';const translatedPrefix=languageCode&&languageCode!=='en'?await translateActivityText(prefix,languageCode):prefix;if(!session.isConnected||index!==questionIndex)return;$('[data-chapter-feedback]',session).innerHTML=`<strong>${safeText(translatedPrefix)}</strong> ${safeText(explanation)}${correct?'':`<br><b>Correct answer:</b> ${safeText(translated[1+item.answer])}`}`;$('[data-chapter-feedback]',session).hidden=false;next.disabled=false;next.textContent=questionIndex===items.length-1?(kind==='assessment'?'See results':'Finish practice'):'Next question';})();
        }));
      };
      start.addEventListener('click',()=>{session.hidden=false;start.hidden=true;next.hidden=false;index=0;score=0;answers=[];showQuestion();});
      next.addEventListener('click',()=>{
        if(!reviewed||selected===null)return;
        if(index<items.length-1){index++;showQuestion();return;}
        const percent=Math.round(score/items.length*100),destination=kind==='assessment'?'[data-assessment-result]':'[data-practice-result]';
        if(kind==='assessment'){activeLessonScore=percent;const missed=answers.filter(answer=>!answer.correct).map(answer=>answer.question);$('[data-chapter-feedback]',session).innerHTML=`<strong>${percent>=80?'Topic mastered':'More revision recommended'} · ${percent}%</strong><p>${missed.length?`Review these questions: ${missed.map(safeText).join(' · ')}`:'You answered every question correctly.'}</p><p>Use the revision cards above, then reopen the assessment to practise again.</p>`;$('[data-chapter-feedback]',session).hidden=false;}
        $(destination,body).textContent=`${score} / ${items.length} · ${percent}%`;
        $('[data-chapter-count]',session).textContent=`Completed · ${score} of ${items.length} correct`;
        $('[data-chapter-question]',session).textContent=kind==='assessment'?(percent>=80?'Great work. You have a strong grasp of this topic.':'Review the topics below, then try again.'):'Practice complete. Read each explanation and revisit any missed idea.';
        $('[data-chapter-options]',session).innerHTML=answers.map((answer,answerIndex)=>`<article class="chapter-answer-review"><strong>${answer.correct?'✓':'↻'} ${answerIndex+1}. ${safeText(answer.question)}</strong><p>Your answer: ${safeText(answer.selected)}</p>${answer.correct?'':`<p>Correct answer: ${safeText(answer.correctAnswer)}</p>`}<p>${safeText(answer.why)}</p></article>`).join('');
        $('[data-chapter-feedback]',session).hidden=kind!=='assessment';next.hidden=true;start.hidden=false;start.textContent='Try again →';
      });
    });
    const editor=$('[data-writing-editor]',body),writingFeedback=$('[data-writing-feedback]',body),writingCount=$('[data-writing-count]',body);
    const updateWritingCount=()=>{const words=editor.value.trim().match(/\S+/g)||[],sentences=editor.value.split(/[.!?।]+/).map(value=>value.trim()).filter(Boolean);writingCount.textContent=`${words.length} words · ${sentences.length} sentences`;};
    try{editor.value=localStorage.getItem(draftKey)||editor.value;}catch(_){}
    updateWritingCount();editor.addEventListener('input',()=>{updateWritingCount();try{localStorage.setItem(draftKey,editor.value);}catch(_){}});
    $('[data-writing-check]',body).addEventListener('click',async()=>{
      const value=editor.value.trim(),sentences=value.split(/[.!?।]+/).map(part=>part.trim()).filter(Boolean),words=value.match(/\S+/g)||[];
      if(!value){writingFeedback.textContent='Write at least three sentences first. Your draft is saved in this browser.';writingFeedback.hidden=false;return;}
      const knownFixes=chapter.mistakes.filter(([wrong])=>new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(value));
      const checks=[];
      checks.push(sentences.length>=3?'✓ You reached the minimum of three sentences.':`Add ${3-sentences.length} more sentence${3-sentences.length===1?'':'s'} to reach the minimum.`);
      checks.push(words.length>=20?'✓ You wrote enough detail to review.':'Add a little more detail; aim for at least 20 words.');
      checks.push(sentences.every(sentence=>/^[A-Z“"'“]/.test(sentence))?'✓ Each sentence begins with a capital letter.':'Check that each sentence starts with a capital letter.');
      checks.push(/[.!?]$/.test(value)?'✓ Your response ends with punctuation.':'Add a full stop or question mark at the end.');
      let output=`<strong>Writing check</strong><ul>${checks.map(check=>`<li>${safeText(check)}</li>`).join('')}</ul>`;
      if(knownFixes.length){const corrected=knownFixes.reduce((text,[wrong,right])=>text.replace(new RegExp(wrong.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'ig'),right),value);output+=`<p><b>Suggested correction:</b> ${safeText(corrected)}</p>`;}
      else output+='<p>No sentence from the lesson’s common-mistake list was found. Read your draft aloud and check that every sentence has a subject and a verb.</p>';
      writingFeedback.innerHTML=output;writingFeedback.hidden=false;
    });
    const speechRoot=$('[data-chapter-speaking]',body),choice=$('[data-speaking-choice]',speechRoot),prompt=$('[data-speaking-prompt]',speechRoot),record=$('[data-chapter-record]',speechRoot),transcript=$('[data-chapter-transcript]',speechRoot);
    choice.addEventListener('change',()=>{prompt.textContent=choice.value;});
    $('[data-chapter-hear]',speechRoot).addEventListener('click',()=>speakTranslation(prompt.textContent,languageCode||'en'));
    record.addEventListener('click',()=>openPractice(prompt.textContent));
  }
  function buildLessonBody(lesson) {
    const chapter=window.NORTHSTAR_LESSON_CHAPTERS?.[lesson.id];
    if(chapter)return renderDetailedChapter(lesson,chapter);
    if(lesson.id==='g-basic-articles') {
      const tabs=lessonLanguageTabsMarkup();
      const simple=`<section class="lesson-section"><h3>In simple words</h3><div class="lesson-language-pair"><article class="lesson-language-card lang-en" data-language="en"><strong>English</strong><p>Use <b>a</b> or <b>an</b> for one new thing. Use <b>the</b> when you and the listener both know which thing. Use no article for general plural or uncountable nouns.</p></article><article class="lesson-language-card lang-hi" data-language="hi" lang="hi"><strong>हिन्दी</strong><p>किसी नई चीज़ के लिए <b>a</b> या <b>an</b> लगाएँ। जब आपको और सुनने वाले को पता हो कि कौन-सी चीज़ है, तब <b>the</b> लगाएँ। आम बहुवचन या गिनी न जा सकने वाली संज्ञा के साथ कुछ न लगाएँ।</p></article></div></section>`;
      const rules=[
        ['a / an: one new thing','Use a before a consonant sound and an before a vowel sound: a dog, an hour, a university.','व्यंजन की आवाज़ से पहले a और स्वर की आवाज़ से पहले an लगाएँ: a dog, an hour, a university.'],
        ['the: a thing both people know','Use the when the thing was already mentioned or is unique: I saw a dog. The dog was wet. The sun is hot.','जब चीज़ पहले आ चुकी हो या सिर्फ़ एक ही हो, तब the लगाएँ: I saw a dog. The dog was wet. The sun is hot.'],
        ['No article: general ideas','Use no article with general plural or uncountable nouns: Dogs need exercise. Music helps me focus.','सामान्य बहुवचन या uncountable noun के साथ article न लगाएँ: Dogs need exercise. Music helps me focus.']
      ].map(([title,en,hi],index)=>`<article class="lesson-rule-card"><span>${index+1}</span><div class="article-rule-copy"><strong>${title}</strong>${lessonLanguageCard(en,hi)}</div></article>`).join('');
      const examples=[['She waited for an hour.','उसने एक घंटे तक इंतज़ार किया।'],['I saw a dog. The dog was wet.','मैंने एक कुत्ता देखा। वह कुत्ता गीला था।'],['Dogs need exercise.','कुत्तों को कसरत की ज़रूरत होती है।']].map(([en,hi])=>`<article class="lesson-example-row"><div><span class="example-correct" aria-label="Correct">✓</span><p>${safeText(en)}</p></div><p class="example-hindi" lang="hi">${safeText(hi)}</p></article>`).join('');
      const mistakes=[['She is teacher.','She is a teacher.'],['I saw dog.','I saw a dog.'],['She likes the music. (general)','She likes music.']].map(([wrong,right])=>`<article class="lesson-mistake-row"><p><span aria-label="Incorrect">×</span>${safeText(wrong)}</p><p><span aria-label="Correct">✓</span>${safeText(right)}</p></article>`).join('');
      const references='<section class="lesson-section lesson-read-more"><h3>Read more</h3><a href="https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference" target="_blank" rel="noopener noreferrer">British Council Grammar ↗</a><a href="https://dictionary.cambridge.org/grammar/british-grammar" target="_blank" rel="noopener noreferrer">Cambridge Grammar ↗</a></section>';
      const writingKey=`northstar-writing:${language}:${level}:${lesson.id}`;
    return `${tabs}${quickLessonPanels(lesson)}${simple}<section class="lesson-section"><h3>The three rules</h3><div class="lesson-rule-list">${rules}</div></section><section class="lesson-section"><h3>Right and wrong</h3><div class="lesson-examples">${examples}</div><div class="lesson-mistakes">${mistakes}</div></section>${references}${topicPracticeMarkup(lesson)}${topicEndPracticeMarkup(lesson.title,lesson.practice,writingKey,lesson.id)}${lessonPracticeCards()}`;
    }
    const note=lesson.notes?.find(item=>typeof item==='object')||{};
    const en=note.en||lesson.notes?.find(item=>typeof item==='string')||lesson.desc;
    const hi=note.hi||'इस नियम को छोटे वाक्यों में पढ़ें और फिर बोलकर अभ्यास करें।';
    const enParts=teachingSentences(en), hiParts=teachingSentences(hi);
    const simple=`<section class="lesson-section"><h3>In simple words</h3>${lessonLanguageCard(enParts.slice(0,2).join(' '),hiParts.slice(0,2).join(' '))}</section>`;
    const ruleEn=enParts.slice(2), ruleHi=hiParts.slice(2), ruleCount=Math.min(8,Math.max(ruleEn.length,ruleHi.length));
    const rules=`<section class="lesson-section"><h3>The rules</h3><div class="lesson-rule-list">${Array.from({length:ruleCount},(_,i)=>`<article class="lesson-rule-card"><span>${String(i+1).padStart(2,'0')}</span>${lessonLanguageCard(ruleEn[i]||'',ruleHi[i]||'')}</article>`).join('')||`<article class="lesson-rule-card"><span>01</span>${lessonLanguageCard(en,hi)}</article>`}</div></section>`;
    const examples=extractLessonExamples(en,hi);
    const exampleRows=(examples.length?examples:[{sentence:lesson.practice,hindi:'इस वाक्य को दिए गए नियम के साथ बोलकर देखें।'}]).map(item=>`<article class="lesson-example-row"><div><span class="example-correct" aria-label="Correct">✓</span><p>${safeText(item.sentence)}</p></div><p class="example-hindi" lang="hi">${safeText(item.hindi||'वाक्य का अर्थ संदर्भ पर निर्भर करता है।')}</p></article>`).join('');
    const exampleSection=`<section class="lesson-section"><h3>Examples</h3><div class="lesson-examples">${exampleRows}</div></section>`;
    const mistakes=grammarMistakes(lesson.id).map(([wrong,right])=>`<article class="lesson-mistake-row"><p><span aria-label="Incorrect">×</span>${safeText(wrong)}</p><p><span aria-label="Correct">✓</span>${safeText(right)}</p></article>`).join('');
    const mistakeSection=`<section class="lesson-section"><h3>Common mistakes</h3><div class="lesson-mistakes">${mistakes}</div></section>`;
    const referenceLinks=lesson.id.startsWith('g-')?'<section class="lesson-section lesson-read-more"><h3>Read more</h3><a href="https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference" target="_blank" rel="noopener noreferrer">British Council Grammar ↗</a><a href="https://dictionary.cambridge.org/grammar/british-grammar" target="_blank" rel="noopener noreferrer">Cambridge Grammar ↗</a></section>':'';
    const writingKey=`northstar-writing:${language}:${level}:${lesson.id}`;
    const tabs=lessonLanguageTabsMarkup();
    return `${tabs}${quickLessonPanels(lesson)}${simple}${rules}${exampleSection}${mistakeSection}${referenceLinks}${topicPracticeMarkup(lesson)}${topicEndPracticeMarkup(lesson.title,lesson.practice,writingKey,lesson.id)}${lessonPracticeCards()}`;
  }
  function openLesson(id) {
    $('#lessonSpeak')?._recognition?.stop();$('#lessonBody [data-chapter-record]')?._recognition?.stop();
    const lessons=currentLessons(), lesson=lessons.find(item=>item.id===id); if(!lesson)return;
    activeLesson=lesson; activeSkill=null;activeLessonScore=null;
    $('#lessonKicker').textContent=`${level.toUpperCase()} · ${lesson.type} · ${lesson.time.toUpperCase()}`;
    $('#lessonBody').innerHTML=buildLessonBody(lesson); $('#lessonBody').dataset.language='both';
    installReaderContent($('#lessonBody'), lesson.title, lesson.desc);
    const chapter=window.NORTHSTAR_LESSON_CHAPTERS?.[lesson.id];
    if(chapter){
      const heading=$('#lessonBody .detail-page-heading'),summary=$('p',heading);
      if(summary){const text=summary.textContent;summary.dataset.language='en';summary.insertAdjacentHTML('afterend',`<p class="chapter-auto-translation" data-language="translated" data-source-text="${safeText(text)}" hidden></p>`);}
      const bookmarkKey=`northstar-bookmark:${lesson.id}`,bookmarked=localStorage.getItem(bookmarkKey)==='true';
      const meta=document.createElement('div');meta.className='chapter-header-meta';meta.innerHTML=`<span>Basic grammar</span><i>·</i><span>Lesson 01</span><i>·</i><span>Beginner</span><i>·</i><span>${safeText(chapter.duration)}</span><button type="button" data-lesson-bookmark aria-pressed="${bookmarked}">${bookmarked?'★ Saved':'☆ Save lesson'}</button>`;
      heading.append(meta);$('[data-lesson-bookmark]',meta).addEventListener('click',event=>{const button=event.currentTarget,saved=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(saved));button.textContent=saved?'★ Saved':'☆ Save lesson';localStorage.setItem(bookmarkKey,String(saved));});
    }
    $('#completeLesson').innerHTML='Mark as complete <span>✓</span>';
    const index=lessons.findIndex(item=>item.id===id);$('#previousLesson').disabled=index<=0;$('#nextLesson').disabled=index>=lessons.length-1;
    if(chapter)bindChapterActivities(chapter,lesson);else{bindTopicEndPractice(`northstar-writing:${language}:${level}:${lesson.id}`,lesson.id);bindTopicPractice();}
    $('#lessonBody').querySelectorAll('[data-lesson-language]').forEach(button=>button.addEventListener('click',()=>setLessonLanguage(button.dataset.lessonLanguage)));
    const languageSelect=$('#lessonTranslationLanguage');if(languageSelect){languageSelect.value=lessonTranslationCode;languageSelect.addEventListener('change',()=>{lessonTranslationCode=languageSelect.value;localStorage.setItem(lessonTranslationKey,lessonTranslationCode);setLessonLanguage('translated');});}
    const savedLanguage=localStorage.getItem(readerLanguageKey)||'both'; setLessonLanguage(savedLanguage==='hi'?'translated':savedLanguage);
    openReadingModal('lessonModal', `lesson-${lesson.id}`);
  }
  let lessonTranslationRequest=0;
  const lessonTranslationCache=new Map();
  async function queueChapterTranslations(code,body=$('#lessonBody')){
    if(!body?.isConnected||code==='en'||body.dataset.language==='en')return;
    const candidates=[...$$('.lesson-language-card.lang-hi p',body),...$$('.lesson-example-row .example-hindi',body),...$$('.chapter-auto-translation',body)];
    const visible=candidates.filter(target=>!target.dataset.translating&&target.dataset.translationCode!==code).filter(target=>{const box=(target.closest('.lesson-language-card')||target.closest('.chapter-language-pair')||target).getBoundingClientRect();return box.bottom>0&&box.top<window.innerHeight;}).slice(0,8);
    if(!visible.length)return;
    const request=++lessonTranslationRequest;let failed=false;
    await Promise.all(visible.map(async target=>{
      target.dataset.translating='true';
      const card=target.closest('.lesson-language-card'),auto=target.classList.contains('chapter-auto-translation');
      if(!target.dataset.originalHtml)target.dataset.originalHtml=target.innerHTML;
      if(!target.dataset.sourceText){const clone=target.cloneNode(true);clone.querySelectorAll('span').forEach(node=>node.remove());target.dataset.sourceText=clone.textContent.trim();}
      if(auto){target.textContent='Translating…';target.hidden=false;}
      if(code==='hi'&&card){target.innerHTML=target.dataset.originalHtml;target.lang='hi';card.dataset.language='hi';card.lang='hi';const label=card.querySelector('strong');if(label)label.textContent='हिन्दी';target.dataset.translationCode=code;target.hidden=false;delete target.dataset.translating;return;}
      let source=card?.parentElement?.querySelector('.lesson-language-card.lang-en p');
      if(!source)source=target.closest('.lesson-example-row')?.querySelector(':scope > div p');
      const text=(auto||target.closest('.chapter-mistake'))?target.dataset.sourceText:(source?.textContent?.trim()||target.dataset.sourceText);
      const cacheKey=`${code}:${text}`;
      try{
        const translated=lessonTranslationCache.get(cacheKey)||await translateWithGoogle(text,'en',code);lessonTranslationCache.set(cacheKey,translated);
        if(request!==lessonTranslationRequest&&body.dataset.translationTarget!==code){delete target.dataset.translating;queueChapterTranslations(body.dataset.translationTarget,body);return;}
        target.innerHTML=safeText(translated);target.lang=code;target.dataset.translationCode=code;target.hidden=false;
        if(card){card.dataset.language='translated';card.lang=code;const label=card.querySelector('strong');if(label)label.textContent=languages.find(([,languageCode])=>languageCode===code)?.[0]||'Translation';}
      }catch(_){if(body.dataset.translationTarget!==code){delete target.dataset.translating;queueChapterTranslations(body.dataset.translationTarget,body);return;}failed=true;target.innerHTML=card?target.dataset.originalHtml:safeText(text);target.lang='en';target.dataset.translationCode=code;target.hidden=false;if(card){card.dataset.language='translated';card.lang='en';}}
      delete target.dataset.translating;
    }));
    if(failed&&request===lessonTranslationRequest)showToast('Some explanations could not be translated. The English text is still available.');
  }
  async function updateLessonTranslation(code){
    const request=++lessonTranslationRequest,body=$('#lessonBody');
    if(body.querySelector('.chapter-concept')){body.dataset.translationTarget=code;if(code==='hi'){ $$('.lesson-language-card.lang-hi',body).forEach(card=>{const paragraph=$('p',card);if(paragraph?.dataset.originalHtml)paragraph.innerHTML=paragraph.dataset.originalHtml;card.dataset.language='hi';card.lang='hi';const label=$('strong',card);if(label)label.textContent='हिन्दी';});}queueChapterTranslations(code,body);return;}
    const targets=[...$$('.lesson-language-card.lang-hi p',body),...$$('.lesson-example-row .example-hindi',body)];
    const tasks=targets.map(target=>({target,kind:'paired'}));
    $$('.chapter-auto-translation',body).forEach(target=>tasks.push({target,kind:'auto'}));
    $$('.lesson-mistake-row p:not(.translated-copy)',body).forEach(target=>tasks.push({target,kind:'mistake'}));
    const results=await Promise.all(tasks.map(async ({target,kind})=>{
      if(!target.dataset.originalHtml)target.dataset.originalHtml=target.innerHTML;
      if(!target.dataset.sourceText){const clone=target.cloneNode(true);clone.querySelectorAll('span').forEach(node=>node.remove());target.dataset.sourceText=clone.textContent.trim();}
      if(code==='hi'&&kind==='paired')return {target,kind,html:target.dataset.originalHtml,failed:false};
      let source=target.closest('.lesson-language-card')?.parentElement?.querySelector('.lesson-language-card.lang-en p');
      if(!source)source=target.closest('.lesson-example-row')?.querySelector(':scope > div p');
      const text=kind==='mistake'||kind==='auto'?target.dataset.sourceText:(source?.textContent?.trim()||'');
      try{return {target,kind,html:safeText(await translateWithGoogle(text,'en',code)),failed:false};}
      catch(_){return {target,kind,html:kind==='paired'?target.dataset.originalHtml:safeText(text),failed:true};}
    }));
    if(request!==lessonTranslationRequest)return;
    let failed=false;
    results.forEach(({target,kind,html,failed:didFail})=>{
      if(kind==='auto'){
        target.innerHTML=html;target.lang=didFail?'en':code;target.hidden=false;
      } else if(kind==='mistake'){
        let copy=target.nextElementSibling?.classList.contains('translated-copy')?target.nextElementSibling:null;
        if(!copy){copy=document.createElement('p');copy.className='translated-copy';copy.dataset.language='translated';target.after(copy);}
        const badge=target.querySelector('span')?.outerHTML||'';copy.innerHTML=badge+html;copy.lang=didFail?'hi':code;
      } else {
        target.innerHTML=html;
        const card=target.closest('.lesson-language-card');
        if(card){
          const languageName=languages.find(([,languageCode])=>languageCode===(didFail?'hi':code))?.[0]||'Hindi';
          target.lang=didFail?'hi':code;
          card.dataset.language=didFail?'hi':'translated';
          card.lang=didFail?'hi':code;
          const label=card.querySelector('strong');if(label)label.textContent=languageName==='Hindi'?'हिन्दी':languageName;
        } else target.lang=didFail?'hi':code;
      }
      failed ||= didFail;
    });
    if(failed)showToast('Some translations could not load. Try again or choose Hindi.');
  }
  function setLessonLanguage(value) {
    const body=$('#lessonBody'),mode=value==='hi'?'translated':value;
    body.dataset.language=mode;
    try{localStorage.setItem(readerLanguageKey,mode);}catch(_){}
    $$('[data-lesson-language]',body).forEach(button=>{const selected=button.dataset.lessonLanguage===mode;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-selected',String(selected));});
    $('#lessonTranslationLanguageLabel')?.classList.toggle('active',mode==='translated');
    updateLessonTranslation(lessonTranslationCode);
  }
  function openVocabularyWordRoute(word) { renderVocabularyWord(word);installReaderContent($('#vocabularyModalBody'), 'Vocabulary', '');$('#vocabularyModal .detail-modal').scrollTop=0; }
  function restoreVocabularyCard() { const card=$('#vocabularyCard');if(card&&$('#vocabularyPlaceholder')){$('#vocabularyPlaceholder').after(card);card.hidden=true;} }
  function closeModal(id, fromHistory = false, transitionToAnother = false) {
    const modal=$(`#${id}`);if(!modal)return;modal.hidden=true;
    if(id==='lessonModal'){ $('#lessonSpeak')?._recognition?.stop();$('#lessonBody [data-chapter-record]')?._recognition?.stop(); }
    if(id==='vocabularyModal'){restoreVocabularyCard();$('#vocabularyBack').hidden=true;}
    if(!$$('.modal-backdrop:not([hidden])').length){
      if (transitionToAnother) history.replaceState({...history.state,northstarReadingModal:null}, '', `${location.pathname}${location.search}`);
      else { setReaderBodyLock(false);if(!fromHistory&&history.state?.northstarReadingModal===id)history.back();else if(!fromHistory&&location.hash)history.replaceState(history.state, '', `${location.pathname}${location.search}`);if(lastDetailTrigger?.isConnected)lastDetailTrigger.focus(); }
    }
  }
  function moveLesson(delta) { const lessons=currentLessons(),index=lessons.findIndex(item=>item.id===activeLesson?.id),next=lessons[index+delta];if(next)openLesson(next.id); }
  $('#previousLesson').addEventListener('click',()=>moveLesson(-1));$('#nextLesson').addEventListener('click',()=>moveLesson(1));
  const detailTextKey='northstar-detail-font-step';
  let detailTextStep=Math.max(0,Math.min(2,Number(localStorage.getItem(detailTextKey) ?? localStorage.getItem(readerFontKey) ?? 1)));
  function applyDetailTextSize(){ $$('.detail-modal').forEach(modal=>modal.dataset.textSize=String(detailTextStep)); try{localStorage.setItem(detailTextKey,String(detailTextStep));localStorage.setItem(readerFontKey,String(detailTextStep));}catch(_){} }
  applyDetailTextSize();
  $('#detailTextLarger')?.addEventListener('click',()=>{detailTextStep=Math.min(2,detailTextStep+1);applyDetailTextSize();});
  $$('[data-text-decrease]').forEach(button=>button.addEventListener('click',()=>{detailTextStep=Math.max(0,detailTextStep-1);applyDetailTextSize();}));
  $$('[data-text-increase]').forEach(button=>button.addEventListener('click',()=>{detailTextStep=Math.min(2,detailTextStep+1);applyDetailTextSize();}));
  $$('[data-close]').forEach(button=>button.addEventListener('click',()=>{if(button.classList.contains('placement-close'))return;button.dataset.close==='practiceModal'?stopSession():closeModal(button.dataset.close);}));
  $('#placementModal .placement-close')?.addEventListener('click',event=>{
    event.preventDefault();
    const placementDialog=$('#placementModal');
    placementDialog.hidden=true;
    closeModal('placementModal');
  });
  $$('.modal-backdrop').forEach(backdrop=>backdrop.addEventListener('click',event=>{if(event.target===backdrop){if(backdrop.id==='practiceModal')stopSession();else closeModal(backdrop.id);}}));
  document.addEventListener('keydown',event=>{
    const modal=$$('.modal-backdrop:not([hidden])').at(-1); if(!modal)return;
    if(event.key==='Escape'){event.preventDefault();modal.id==='practiceModal'?stopSession():closeModal(modal.id);return;}
    if(event.key==='Tab'){
      const dialog=modal.querySelector('[role="dialog"]'),focusable=$$('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',dialog).filter(item=>!item.hidden&&item.getAttribute('aria-hidden')!=='true');
      if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  $('#completeLesson').addEventListener('click', async () => {
    const itemId = activeSkill ? `soft-${activeSkill.id}` : activeLesson?.id;
    if (!itemId) return;
    try {
      const response=await fetch(`/api/learning/progress/${encodeURIComponent(itemId)}`,{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({score:activeLesson?activeLessonScore:null})});
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
    activeSkill=skills.find(skill=>skill.id===id); if(!activeSkill)return; activeLesson=null;activeLessonScore=null; $('#completeLesson').textContent='Mark this skill practised ✓';
    $('#lessonKicker').textContent=`SOFT SKILLS · ${activeSkill.tag}`;
    const writingKey=`northstar-soft-writing:${activeSkill.id}`;
    $('#lessonBody').innerHTML=`${quickLessonPanels(activeSkill)}<section class="lesson-section"><h3>Key steps</h3><div class="lesson-note-card"><ol>${activeSkill.framework.map(item=>`<li>${safeText(item)}</li>`).join('')}</ol></div></section><section class="lesson-section"><h3>Try the scenario</h3><div class="lesson-practice-card"><p>${safeText(activeSkill.prompt)}</p></div></section>${topicPracticeMarkup({...activeSkill,notes:activeSkill.framework})}${topicEndPracticeMarkup(activeSkill.title,activeSkill.prompt,writingKey,activeSkill.id)}${lessonPracticeCards()}`;
    installReaderContent($('#lessonBody'), activeSkill.title, activeSkill.desc);
    bindTopicPractice();
    bindTopicEndPractice(writingKey,activeSkill.id);
    openReadingModal('lessonModal', `skill-${activeSkill.id}`);
  }
  renderSkills();

  function openPractice(prompt) {
    $('#sessionSetup').hidden=false; $('#liveSession').hidden=true;
    $('#practiceTitle').textContent='Set up your session';
    $('#practiceSituation').value=prompt||'';
    openReadingModal('practiceModal','practice');
    $('#situationVoiceStatus').textContent='Type a situation or dictate it with your microphone.';
    if(prompt){$('#practiceGoal').value='Other';$('#practiceGoal').dataset.customPrompt=prompt;}
    else delete $('#practiceGoal').dataset.customPrompt;
    $$('.mode-choice').forEach(button=>button.classList.toggle('selected',button.dataset.mode===currentMode));
    $$('.voice-purpose-options [data-practice-goal]').forEach(button=>button.classList.toggle('selected',button.dataset.practiceGoal===$('#practiceGoal').value));
  }
  $('#recordSituation').addEventListener('click',()=>{
    const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SpeechRecognition){$('#situationVoiceStatus').textContent='Voice input is not supported here. Type your situation instead.';return;}
    if(situationRecognition){try{situationRecognition.abort()}catch(_){}situationRecognition=null;}
    situationRecognition=new SpeechRecognition();situationRecognition.lang=languageLocale;situationRecognition.continuous=false;situationRecognition.interimResults=true;situationRecognition.maxAlternatives=1;
    $('#situationVoiceStatus').textContent=`Listening in ${language}…`;
    situationRecognition.onresult=event=>{let text='';for(let i=event.resultIndex;i<event.results.length;i++)text+=event.results[i][0].transcript;$('#practiceSituation').value=text.trim();};
    situationRecognition.onerror=event=>{$('#situationVoiceStatus').textContent=event.error==='not-allowed'?'Allow microphone access or type your situation.':'I could not hear that clearly. Try again or type it.';};
    situationRecognition.onend=()=>{if($('#practiceSituation').value.trim())$('#situationVoiceStatus').textContent='Situation captured. You can edit it before starting.';situationRecognition=null;};
    try{situationRecognition.start()}catch(_){$('#situationVoiceStatus').textContent='The microphone could not start. Type your situation instead.';}
  });
  $$('.voice-purpose-options [data-practice-goal]').forEach(button=>button.addEventListener('click',()=>{
    $$('.voice-purpose-options [data-practice-goal]').forEach(item=>item.classList.toggle('selected',item===button));
    $('#practiceGoal').value=button.dataset.practiceGoal;delete $('#practiceGoal').dataset.customPrompt;
  }));
  $$('.voice-duration-options [data-duration]').forEach(button=>button.addEventListener('click',()=>{
    selectedPracticeDuration=Number(button.dataset.duration);
    $$('.voice-duration-options [data-duration]').forEach(item=>item.classList.toggle('selected',item===button));
  }));
  $('#softStart').addEventListener('click',()=>{switchSection('soft');openPractice('Tell me one situation where you would like to feel more confident.');});
  $('#softScenario').addEventListener('click',()=>{switchSection('soft');openPractice('A teammate disagrees with your idea. How would you respond while keeping the conversation constructive?');});
  $$('.mode-choice').forEach(button=>button.addEventListener('click',()=>{$$('.mode-choice').forEach(item=>item.classList.toggle('selected',item===button));currentMode=button.dataset.mode;}));
  function updateVoiceProgress(){
    const prompts=voicePrompts[currentMode]||voicePrompts.guided;
    $('#voicePromptCount').textContent=`PROMPT ${currentPromptIndex+1} OF ${prompts.length}`;
    $('#voiceProgress').innerHTML=prompts.map((_,index)=>`<i class="${index<currentPromptIndex?'done':''} ${index===currentPromptIndex?'current':''}"></i>`).join('');
  }
  async function loadVoiceSummary(){
    try{const response=await fetch('/api/learning/voice-sessions/summary');if(!response.ok)return;const data=await response.json();
      const status=$('#voicePracticeStatus');if(!status)return;
      status.textContent=data.sessions?`${data.sessions} completed session${data.sessions===1?'':'s'} · ${data.minutes} minutes practised${data.latest?.goal?` · Last: ${data.latest.goal}`:''}`:'Your practice history will appear here.';
    }catch(_){/* Practice remains available when history cannot load. */}
  }
  loadVoiceSummary();
  $('#beginSession').addEventListener('click',async()=>{
    if(situationRecognition){try{situationRecognition.abort()}catch(_){}situationRecognition=null;}
    activePracticeSituation=$('#practiceSituation').value.trim();goal=$('#practiceGoal').value;await saveProfile(true);
    backendVoiceSessionId=null;
    try{const response=await fetch('/api/learning/voice-sessions',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({practice_mode:currentMode,goal,language,planned_minutes:selectedPracticeDuration})});if(response.ok){const data=await response.json();backendVoiceSessionId=data.session_id;}else showToast('Practice started, but your session could not be saved.');}
    catch(_){showToast('Practice started offline. Session history could not be saved.');}
    $('#sessionSetup').hidden=true;$('#liveSession').hidden=false;$('#practiceTitle').textContent='';
    $('#liveModeLabel').textContent=goal.toUpperCase();
    currentPromptIndex=0;voicePromptCount=0;sessionSeconds=0;
    const promptList=voicePrompts[currentMode]||voicePrompts.guided;
    const firstPrompt=activePracticeSituation||$('#practiceGoal').dataset.customPrompt||goalPrompts[goal]||promptList[0];
    $('#coachPrompt').textContent=firstPrompt;$('#transcriptBox').textContent='Your words will appear here after you finish speaking.';$('#coachFeedback').hidden=true;
    $('#micHint').textContent=currentMode==='guided'?'Listen to the prompt, then speak when you are ready.':'Listening… speak naturally';
    $('#sessionTimer').textContent=`${String(selectedPracticeDuration).padStart(2,'0')}:00 left`;updateVoiceProgress();
    sessionActive=true;clearInterval(timerId);timerId=setInterval(()=>{
      sessionSeconds++;const remaining=Math.max(0,selectedPracticeDuration*60-sessionSeconds);
      $('#sessionTimer').textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')} left`;
      if(remaining===0)stopSession(true);
    },1000);
    if(currentMode==='guided')speakPrompt(firstPrompt);
  });
  function speakPrompt(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=languageLocale;utterance.rate=.94;window.speechSynthesis.speak(utterance);
  }
  $('#listenPrompt').addEventListener('click',()=>speakPrompt($('#coachPrompt').textContent));
  function coachOnTranscript(text) {
    const clean=text.trim();$('#transcriptBox').textContent=clean||'I did not catch that clearly. Try again when you are ready.';
    const words=clean.match(/[\p{L}']+/gu)||[];const fillers=languageCode==='en'?(clean.match(/\b(um|uh|erm|like|you know)\b/gi)||[]).length:null;
    let response=languageCode==='en'?'Good start—I understood your main idea. Add one more detail or example to make your answer clearer.':`Transcript captured. Automated grammar feedback is available for English only; ask a fluent speaker to review your ${language} response.`;
    if(languageCode==='en'&&words.length<7)response='Nice start. Can you add one more sentence explaining why or what happened next?';
    else if(languageCode==='en'&&fillers>=3)response='Your idea came through. Try a short pause instead of a filler word, then continue.';
    $('#coachFeedback').innerHTML=`<span>QUICK FEEDBACK · TRANSCRIPT ONLY</span><p>${safeText(response)}</p><small>${words.length} recognized word units · no pronunciation score</small>`;$('#coachFeedback').hidden=false;
    voicePromptCount++;$('#micHint').textContent='Ready when you are. Continue or move to the next prompt.';
    if(languageCode==='en')speakPrompt(response);
  }
  async function advanceVoicePrompt(skipped=false){
    if(!sessionActive)return;
    if(skipped||$('#transcriptBox').textContent==='Your words will appear here after you finish speaking.')voicePromptCount++;
    currentPromptIndex=(currentPromptIndex+1)%(voicePrompts[currentMode]||voicePrompts.guided).length;
    const list=voicePrompts[currentMode]||voicePrompts.guided;let next=list[currentPromptIndex];
    if(activePracticeSituation){const contextual=['What would you say first in this situation?','How might the other person respond, and what would you say next?','What outcome do you want, and how could you ask for it clearly?'];next=contextual[currentPromptIndex%contextual.length];}
    if(languageCode&&languageCode!=='en')next=await translateActivityText(next,languageCode);
    if(!sessionActive)return;$('#coachPrompt').textContent=next;$('#transcriptBox').textContent='Your words will appear here after you finish speaking.';$('#coachFeedback').hidden=true;updateVoiceProgress();$('#micHint').textContent='Listening… speak naturally';speakPrompt(next);
  }
  $('#nextPrompt').addEventListener('click',()=>advanceVoicePrompt(false));$('#skipPrompt').addEventListener('click',()=>advanceVoicePrompt(true));
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
  async function stopSession(completed=false) {
    const sessionId=backendVoiceSessionId;backendVoiceSessionId=null;
    sessionActive=false;clearInterval(timerId);if(recognition){try{recognition.abort()}catch(_){}recognition=null;}if('speechSynthesis'in window)window.speechSynthesis.cancel();
    closeModal('practiceModal');$('#sessionSetup').hidden=false;$('#liveSession').hidden=true;
    if(sessionId){try{const response=await fetch(`/api/learning/voice-sessions/${sessionId}`,{method:'PATCH',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify({status:completed?'completed':'abandoned',elapsed_seconds:sessionSeconds,prompt_count:voicePromptCount})});if(!response.ok)showToast('Practice ended, but session history could not be saved.');}catch(_){showToast('Practice ended, but session history could not be saved.');}}
    if(completed)loadVoiceSummary();
  }
  $('#endSession').addEventListener('click',()=>stopSession(true));
})();
