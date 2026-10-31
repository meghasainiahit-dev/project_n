/* Detailed authored chapter for the first Northstar grammar lesson. */
(() => {
  const ex=(s,v,r,...parts)=>parts.length===3?{s,v,r:`${r} ${parts[0]}`,hi:parts[1],why:parts[2]}:{s,v,r,hi:parts[0],why:parts[1]};
  const sentenceExamples=[
    ex('Birds','sing.','', 'पक्षी गाते हैं।','Subject + verb; no object is needed.'),
    ex('The baby','slept.','', 'बच्चा सोया।','The verb “slept” does not need an object.'),
    ex('My sister','reads','every evening.','मेरी बहन हर शाम पढ़ती है।','The time phrase adds detail; there is no direct object here.'),
    ex('The children','laughed','at the joke.','बच्चे चुटकुले पर हँसे।','The prepositional phrase tells what caused the laughter.'),
    ex('Maya','reads','novels.','माया उपन्यास पढ़ती है।','Maya acts; reads is the action; novels receives it.'),
    ex('Our teacher','explained','the rule.','हमारे शिक्षक ने नियम समझाया।','“The rule” is the direct object.'),
    ex('I','drink','water after lunch.','मैं दोपहर के भोजन के बाद पानी पीता/पीती हूँ।','“Water” receives the action; the rest tells when.'),
    ex('Ravi','opened','the window.','रवि ने खिड़की खोली।','The sentence follows subject + verb + object.'),
    ex('The room','is','quiet.','कमरा शांत है।','“Quiet” describes the subject; it is a complement, not an object.'),
    ex('Her idea','sounds','useful.','उसका विचार उपयोगी लगता है।','“Useful” completes the meaning of the linking verb.'),
    ex('We','are','ready.','हम तैयार हैं।','“Ready” describes “we” after the linking verb “are”.'),
    ex('The soup','tastes','salty.','सूप नमकीन लगता है।','“Salty” describes the soup; it does not receive an action.'),
    ex('The guide','gave','the visitors','a map.','गाइड ने आगंतुकों को एक नक्शा दिया।','Visitors are the indirect object; a map is the direct object.'),
    ex('My aunt','sent','me','a message.','मेरी मौसी ने मुझे एक संदेश भेजा।','“Me” receives the message; “a message” is what was sent.'),
    ex('The coach','taught','the team','a new drill.','कोच ने टीम को एक नया अभ्यास सिखाया।','The team receives the teaching; the drill is the direct object.'),
    ex('They','named','the puppy','Milo.','उन्होंने पिल्ले का नाम मिलो रखा।','“Milo” renames the object “the puppy”.'),
    ex('The news','made','everyone','happy.','इस खबर ने सभी को खुश कर दिया।','“Happy” describes the object “everyone”.'),
    ex('She','left','the door','open.','उसने दरवाज़ा खुला छोड़ा।','“Open” describes the object after the verb.'),
    ex('My friends','walked','to the station after work.','मेरे दोस्त काम के बाद स्टेशन तक पैदल गए।','Place and time details follow the main idea.'),
    ex('The nurse','checked','the patient carefully this morning.','नर्स ने आज सुबह मरीज़ की सावधानी से जाँच की।','The object follows the verb; manner and time add information.')
  ];
  const quizItems=[
    ['Multiple choice','In “The dog chased the ball”, what is the subject?',['The dog','chased','the ball','the dog chased'],0,'The subject tells us who performs the action: the dog.'],
    ['Multiple choice','In “Mina opened the box”, which word is the verb?',['Mina','opened','the box','box'],1,'“Opened” names the action.'],
    ['Fill in the blank','Choose the correct order: “My brother ___ football.”',['plays','football plays','plays my brother','my brother football'],0,'A statement usually places the subject before its verb: My brother plays football.'],
    ['Sentence order','Choose the natural sentence.',['At home my mother cooks dinner.','Cooks my mother dinner at home.','Dinner my mother at home cooks.','My mother dinner cooks at home.'],0,'The usual order is subject + verb + object, followed by place or time details.'],
    ['Identify the object','In “We watched a film”, what did we watch?',['We','watched','a film','no object'],2,'“A film” receives the action of watching.'],
    ['Concept check','In “The sky is blue”, what is “blue”?',['Subject','Action verb','Object','Subject complement'],3,'“Blue” describes the subject after the linking verb “is”.'],
    ['Fill in the blank','Complete the sentence: “The children ___.”',['laughed','laughed the joke','the children laughed them','the children the joke'],0,'“Laughed” can be complete without a direct object.'],
    ['Find the error','Choose the corrected sentence: “My friend the answer knows.”',['My friend knows the answer.','My friend the answer know.','Knows my friend the answer.','My friend knowing the answer.'],0,'Put the subject first, then the verb, then its object.'],
    ['Multiple choice','Which sentence has a subject complement?',['Nina bought a coat.','Nina seems tired.','Nina opened the door.','Nina called her friend.'],1,'“Tired” describes Nina after the linking verb “seems”.'],
    ['Sentence order','Arrange the idea “gave / a book / Ali / Sara” naturally.',['Ali gave Sara a book.','A book gave Ali Sara.','Sara a book gave Ali.','Gave Ali a book Sara.'],0,'With two objects, the receiver can come before the thing given.'],
    ['Multiple choice','Which part is the indirect object in “Dad sent me a photo”?',['Dad','sent','me','a photo'],2,'“Me” is the receiver of the photo.'],
    ['Find the error','Choose the natural sentence.',['It is raining.','Is raining.','Raining it is.','It raining is.'],0,'English normally needs an explicit subject; use “it” for weather.'],
    ['Concept check','Does every sentence need a direct object?',['Yes, every time.','No. “The baby slept” is complete.','Only questions do.','Only long sentences do.'],1,'Intransitive verbs such as “sleep” do not need a direct object.'],
    ['Multiple choice','In “The soup tastes delicious”, “delicious” is…',['a direct object','a subject complement','the subject','an action verb'],1,'The adjective describes the soup after the linking verb “tastes”.'],
    ['Fill in the blank','Choose the correct verb: “The students ___ ready.”',['is','are','am','be'],1,'“Students” is plural, so use “are”.'],
    ['Sentence order','Choose a clear place and time order.',['We met at the café yesterday.','Yesterday at the café met we.','We yesterday met café at.','At yesterday café we met.'],0,'A common neutral order is the main idea, then place, then time.'],
    ['Match the function','In “Leena painted the wall red”, what does “red” do?',['Names the subject','Describes the object','Shows the action','Names the direct object'],1,'“Red” describes the object “the wall”; it is an object complement.'],
    ['Find the error','Choose the correct sentence.',['The flowers smell sweet.','The flowers smell sweetly.','The flowers sweet smell.','Smell the flowers sweet.'],0,'“Smell” is linking here, so use the adjective “sweet”.'],
    ['Multiple choice','Which sentence follows subject + verb + object?',['Birds fly.','Maya reads novels.','The room is quiet.','They seem happy.'],1,'Maya is the subject, reads is the verb, and novels is the object.'],
    ['Apply the rule','Choose the sentence that gives the receiver first.',['I sent a note to Ravi.','I sent Ravi a note.','A note Ravi sent me.','Sent I Ravi a note.'],1,'“I sent Ravi a note” uses indirect object + direct object.']
  ].map(([type,q,options,answer,why])=>({type,q,options,answer,why}));
  const assessmentItems=[
    ['In “A cat slept”, what is the subject?',['A cat','slept','no subject','a cat slept'],0,'The subject is who or what the sentence is about.'],
    ['Choose the correct sentence.',['My sister likes music.','My sister music likes.','Likes my sister music.','My sister like music.'],0,'The usual statement order is subject + verb + object.'],
    ['In “They built a bridge”, what is the direct object?',['They','built','a bridge','no object'],2,'The bridge receives the action of building.'],
    ['In “The tea feels warm”, “warm” is…',['a direct object','a subject complement','the verb','the subject'],1,'“Warm” describes the subject after the linking verb “feels”.'],
    ['Which verb does not need an object?',['carry','sleep','open','make'],1,'“Sleep” is commonly intransitive: “The child slept.”'],
    ['Choose the correct agreement.',['The keys is here.','The keys are here.','The keys am here.','The keys be here.'],1,'A plural subject takes “are” in the present tense.'],
    ['Choose the sentence with an indirect object.',['We arrived early.','She gave Tom a ticket.','The room became quiet.','Birds fly south.'],1,'Tom receives the ticket, so Tom is the indirect object.'],
    ['In “The joke made us laugh”, what is “laugh”?',['The subject','The main verb','An object complement','A time phrase'],2,'“Laugh” completes the meaning by showing what “us” did/become.'],
    ['Choose a natural sentence.',['We finished our work after lunch.','Finished we after lunch our work.','Our work after lunch finished we.','After lunch our work we finished it.'],0,'Keep the subject and verb together, then add the object and time detail.'],
    ['Which statement is true?',['Every verb needs an object.','A sentence can be complete without an object.','A complement is always a direct object.','English statements usually put the verb first.'],1,'“Birds sing” is complete; not every verb takes a direct object.']
  ].map(([q,options,answer,why])=>({type:'Final assessment',q,options,answer,why}));
  window.NORTHSTAR_LESSON_CHAPTERS={
    'g-basic-word-order':{
      duration:'20–25 min',
      summary:{en:'English statements usually put the subject before the verb. The verb may take an object, or it may link the subject to a description. Not every sentence needs an object.',hi:'अंग्रेज़ी के सामान्य वाक्य में subject पहले और verb बाद में आता है। Verb के बाद object या subject का वर्णन हो सकता है। हर वाक्य में object ज़रूरी नहीं होता।'},
      objectives:['Find the subject and verb in a simple sentence.','Tell a direct object from a complement.','Build five common English sentence patterns.','Place common place and time details naturally.','Correct frequent word-order mistakes.','Use the patterns in speaking and writing.'],
      objectivesHindi:['सरल वाक्य में subject और verb पहचानें।','Direct object और complement में अंतर समझें।','अंग्रेज़ी के पाँच सामान्य sentence patterns बनाएँ।','जगह और समय की जानकारी सही जगह रखें।','शब्द-क्रम की आम गलतियाँ सुधारें।','इन patterns का उपयोग बोलने और लिखने में करें।'],
      intro:{en:'A sentence is a group of words that gives a complete idea. In English statements, the subject usually comes before the verb. The verb may be followed by an object or by words that describe the subject. Clear word order helps people understand who did what, and it makes everyday speaking and writing easier.',hi:'वाक्य शब्दों का ऐसा समूह है जो पूरी बात बताता है। अंग्रेज़ी के सामान्य कथन में subject अक्सर verb से पहले आता है। Verb के बाद object या subject का वर्णन करने वाले शब्द आ सकते हैं। सही क्रम से यह समझना आसान होता है कि किसने क्या किया।'},
      concepts:[
        {title:'Subject · who or what the sentence is about',definition:'The subject names the person, thing or idea that does the action, or that the sentence describes.',identify:'Ask “Who?” or “What?” before the verb. A subject can be one word or a longer group of words.',hi:'Subject बताता है कि कौन काम करता है या किसके बारे में बात हो रही है। Verb से पहले “कौन?” या “क्या?” पूछें।',examples:[['The little bird sings.','छोटी चिड़िया गाती है।','The whole subject is “The little bird”.'],['My older brother works here.','मेरा बड़ा भाई यहाँ काम करता है।','“My older brother” is the subject.'],['Reading every day helps me.','रोज़ पढ़ना मेरी मदद करता है।','An activity can be the subject.'],['The keys on the table are mine.','मेज़ पर रखी चाबियाँ मेरी हैं।','The subject is “The keys on the table”.'],['She and her friend study together.','वह और उसकी दोस्त साथ पढ़ती हैं।','Two people form a plural subject.']]},
        {title:'Verb · action or state',definition:'A verb tells an action, event or state. A sentence needs a verb to say what happens or what something is like.',identify:'Find what the subject does (runs, reads) or the linking/helping verb that connects or supports the idea.',hi:'Verb काम, घटना या स्थिति बताता है। यह बताता है कि subject क्या करता है या कैसा है।',examples:[['Rina walks to work.','रीना पैदल काम पर जाती है।','“Walks” is an action verb.'],['They are ready.','वे तैयार हैं।','“Are” links the subject to a description.'],['He has finished lunch.','उसने दोपहर का खाना खत्म कर लिया है।','“Has” helps form the verb phrase.'],['The door opened slowly.','दरवाज़ा धीरे से खुला।','“Opened” tells what happened.'],['I feel better now.','अब मैं बेहतर महसूस करता/करती हूँ।','“Feel” links “I” to the description “better”.']]},
        {title:'Object · who or what receives an action',definition:'A direct object receives the action of a transitive verb. Some verbs also use an indirect object: the person who receives the direct object.',identify:'Ask “verb + what?” or “verb + whom?” A direct object answers that question.',hi:'Direct object पर verb का काम होता है। Indirect object बताता है कि चीज़ किसे मिली। Verb के बाद “क्या?” या “किसे?” पूछें।',examples:[['We planted a tree.','हमने एक पेड़ लगाया।','“A tree” is the direct object.'],['I called my cousin.','मैंने अपने चचेरे भाई/बहन को फ़ोन किया।','“My cousin” receives the call.'],['Sam gave me a pen.','सैम ने मुझे एक पेन दिया।','“A pen” is direct; “me” is indirect.'],['The chef made us dinner.','रसोइए ने हमारे लिए खाना बनाया।','“Dinner” is direct; “us” is indirect.'],['She sent the team an update.','उसने टीम को एक अपडेट भेजा।','“The team” receives “an update”.']]},
        {title:'Complement · information that completes a description',definition:'A subject complement follows a linking verb and describes or renames the subject. An object complement describes or renames the object.',identify:'After a linking verb, ask whether the next word describes the subject. That word is a complement, not an object.',hi:'Complement subject या object के बारे में ज़रूरी जानकारी देता है। Linking verb के बाद subject का वर्णन हो तो वह subject complement है।',examples:[['The room is clean.','कमरा साफ़ है।','“Clean” describes the subject.'],['Her voice sounds calm.','उसकी आवाज़ शांत लगती है।','“Calm” is a subject complement.'],['They chose Maya captain.','उन्होंने माया को कप्तान चुना।','“Captain” renames the object Maya.'],['The news made him happy.','इस खबर ने उसे खुश कर दिया।','“Happy” describes the object “him”.'],['My father became a teacher.','मेरे पिता शिक्षक बने।','“A teacher” renames the subject.']]}
      ],
      rules:[
        ['Statements usually begin with the subject','Subject + Verb (+ Object)','Put the person or thing first, then say what they do.','अंग्रेज़ी के सामान्य कथन में subject पहले, फिर verb आता है।','The listener quickly knows who the sentence is about.','Questions may use a different order: “Are you ready?”'],
        ['Match the verb to the subject','Singular subject + singular verb','In the present simple, he/she/it usually takes -s: “She works.” I/you/we/they use the base form.','Present simple में he/she/it के साथ आम तौर पर verb में -s लगता है।','Agreement makes the sentence sound complete and natural.','The verb “be” has its own forms: I am; she is; they are.'],
        ['A direct object follows its verb','Subject + Verb + Direct Object','Use this pattern when an action passes to a person or thing: “We need help.”','जब action किसी चीज़ पर हो, object को verb के बाद रखें।','It tells the reader what the action affects.','Some verbs do not take an object: “The baby slept.”'],
        ['Do not add an object to every verb','Subject + Intransitive Verb','A complete idea can end after an intransitive verb: “The train arrived.”','हर verb को object की ज़रूरत नहीं होती। “The train arrived” पूरा वाक्य है।','This prevents extra or incorrect words.','A verb can be transitive in one use and intransitive in another.'],
        ['Use a complement after a linking verb','Subject + Linking Verb + Complement','Be, seem, become, feel, look and sound can connect a subject to a description: “The soup tastes salty.”','Linking verb के बाद subject का वर्णन आ सकता है।','It describes the subject instead of receiving an action.','“She looked at me” uses look as an action; “She looked tired” describes her.'],
        ['Two objects can follow some verbs','Subject + Verb + Indirect Object + Direct Object','The receiver can come before the thing: “He sent Ana a photo.”','कुछ verbs में पहले पाने वाला, फिर दी गई चीज़ आती है।','It makes the receiver and item clear.','You can also say “He sent a photo to Ana.”'],
        ['Place and time often come after the main idea','Subject + Verb + Object + Place + Time','A common neutral order is “We met our friends at the café yesterday.”','जगह और समय अक्सर मुख्य बात के बाद आते हैं।','The central idea stays easy to follow.','Other orders are possible when you want to emphasise time or place.'],
        ['Questions and negatives use helpers','Do/Does/Did + Subject + Base Verb?','Use do/does/did for many simple-tense questions and negatives: “Does she work?” “She does not work.”','कई simple tense प्रश्नों और नकार में do/does/did का उपयोग करें।','The helper carries the tense; keep the main verb in base form.','With “be”, invert the verb: “Is she ready?”']
      ],
      patterns:[
        ['Subject + Verb','A complete action can have no object.',['Leaves fall.','My uncle smiles.','The train arrived.','We waited.'].map((en,i)=>[en,['पत्ते गिरते हैं।','मेरे चाचा मुस्कुराते हैं।','ट्रेन आ गई।','हमने इंतज़ार किया।'][i]])],
        ['Subject + Verb + Object','The object receives the action.',['I need a pencil.','They built a bridge.','We watched a film.','Arun fixed the chair.'].map((en,i)=>[en,['मुझे एक पेंसिल चाहिए।','उन्होंने एक पुल बनाया।','हमने एक फ़िल्म देखी।','अरुण ने कुर्सी ठीक की।'][i]])],
        ['Subject + Linking Verb + Complement','The complement describes or renames the subject.',['The hall is bright.','You look tired.','The soup tastes good.','He became a doctor.'].map((en,i)=>[en,['हॉल रोशन है।','तुम थके हुए लगते हो।','सूप अच्छा लगता है।','वह डॉक्टर बना।'][i]])],
        ['Subject + Verb + Indirect Object + Direct Object','Put the receiver before the thing given.',['I sent Ravi a note.','She taught us a song.','Dad bought me a coat.','We showed them the photo.'].map((en,i)=>[en,['मैंने रवि को एक नोट भेजा।','उसने हमें एक गीत सिखाया।','पिताजी ने मेरे लिए एक कोट खरीदा।','हमने उन्हें तस्वीर दिखाई।'][i]])],
        ['Subject + Verb + Object + Object Complement','The last part describes or renames the object.',['They named the puppy Milo.','The news made us happy.','We painted the wall blue.','They elected her chairperson.'].map((en,i)=>[en,['उन्होंने पिल्ले का नाम मिलो रखा।','इस खबर ने हमें खुश कर दिया।','हमने दीवार को नीला रंगा।','उन्होंने उसे अध्यक्ष चुना।'][i]])]
      ],
      examples:sentenceExamples,
      mistakes:[
        ['Maya novels reads.','Maya reads novels.','Put the subject before the verb and the object after it.'],
        ['Is raining today.','It is raining today.','English normally needs a subject, even for weather.'],
        ['She walk to work.','She walks to work.','Use -s with a third-person singular subject in the present simple.'],
        ['They is ready.','They are ready.','Use “are” with “they”.'],
        ['The soup tastes deliciously.','The soup tastes delicious.','“Tastes” links the soup to an adjective; use “delicious”.'],
        ['I explained her the rule.','I explained the rule to her.','“Explain” normally takes the thing first, then “to” + receiver.'],
        ['He gave to me a key.','He gave me a key.','The receiver can come directly before the thing given.'],
        ['The baby slept a bed.','The baby slept in a bed.','“Sleep” does not take “a bed” as a direct object; use a place phrase.'],
        ['We met yesterday our teacher.','We met our teacher yesterday.','Keep the object close to its verb; put the time phrase after it.'],
        ['She made the room quietly.','She made the room quiet.','When “make” describes the object’s new state, use an adjective.']
      ],
      scenarios:[
        ['Introduce yourself','Say your name, role and one thing you enjoy.',['I','work','study','enjoy'],['My name is Asha.','I work in a shop.','I enjoy music.'],'अपना नाम, काम और पसंद बताइए।'],
        ['Describe your routine','Tell someone three things you do each day.',['usually','after breakfast','in the evening'],['I walk to work.','I eat lunch at one.','I call my family in the evening.'],'रोज़ के तीन काम बताइए।'],
        ['Talk about your family','Name a family member and describe one action or quality.',['kind','helps','cooks'],['My sister helps me.','My father cooks dinner.','My family is kind.'],'परिवार के किसी सदस्य के बारे में बताइए।'],
        ['Share a hobby','Say what you do and when you do it.',['read','play','on weekends'],['I read novels.','My friends play cricket.','We practise on weekends.'],'अपना शौक और उसका समय बताइए।'],
        ['Describe your workplace','Name the place and one thing that happens there.',['team','meeting','quiet'],['Our team works here.','We have a meeting at ten.','The office is quiet.'],'अपने काम की जगह का वर्णन कीजिए।'],
        ['Talk about a favourite activity','Explain what you enjoy and why.',['because','with','together'],['I enjoy walking.','I walk with my friend.','It makes me feel relaxed.'],'अपनी पसंदीदा गतिविधि और उसका कारण बताइए।']
      ],
      quiz:quizItems,
      assessment:assessmentItems,
      revision:['A sentence needs a subject and a verb.','A statement usually follows Subject + Verb.','A direct object receives the action.','Not every verb needs an object.','A complement describes or renames a subject or object.','Linking verbs connect a subject with its description.','Some verbs take an indirect and a direct object.','Place and time details often follow the main idea.','Use subject–verb agreement.','Questions and negatives may use helper verbs.'],
      recap:[['Who or what does the action?','The subject.'],['What does the verb tell us?','An action, event or state.'],['What receives the action?','The direct object.'],['What describes a subject after “is”?','A subject complement.'],['Does “Birds fly” need an object?','No. The sentence is complete.']]
    }
  };
})();
