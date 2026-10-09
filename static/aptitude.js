(() => {
  const app = document.querySelector('.learn-app');
  if (!app || !window.APTITUDE_TOPICS) return;
  const $ = s => document.querySelector(s);
  const topics = window.APTITUDE_TOPICS;
  const levels = ['Basic', 'Intermediate', 'Advanced'];
  let selectedTopic = null, selectedLevel = 'Basic', selectedAnswer = null, submitted = false;
  let questionIndex = 0, correctCount = 0, quizFinished = false;
  let filter = 'all', progress = {};
  const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function renderCatalog() {
    const needle = ($('#topicSearch').value || '').trim().toLowerCase();
    const matching = topics.filter(t => (filter === 'all' || t.filter === filter) &&
      `${t.name} ${t.description} ${t.tags.join(' ')} ${t.group}`.toLowerCase().includes(needle));
    $('#topicCount').textContent = `${matching.length} ${matching.length === 1 ? 'TOPIC' : 'TOPICS'}`;
    const groups = [...new Set(matching.map(t => t.group))];
    $('#aptitudeGroups').innerHTML = groups.length ? groups.map(group => `
      <section class="aptitude-group"><div class="aptitude-group-heading"><h3>${escapeHTML(group)}</h3><span>${matching.filter(t => t.group === group).length} topics</span></div>
      <div class="topic-card-grid">${matching.filter(t => t.group === group).map(t => `<button class="topic-card" data-topic="${escapeHTML(t.id)}"><span class="topic-card-top"><span class="topic-card-icon">${escapeHTML(t.icon)}</span><span class="topic-card-arrow">↗</span></span><strong>${escapeHTML(t.name)}</strong><span class="topic-card-desc">${escapeHTML(t.description)}</span><span class="topic-card-tags">${t.tags.slice(0,3).map(x=>`<i>${escapeHTML(x)}</i>`).join('')}</span><span class="topic-card-meta">3 levels <b>·</b> lesson + quiz</span></button>`).join('')}</div>
    </section>`).join('') : '<div class="topic-empty">No topics match that search. Try a different keyword or filter.</div>';
    document.querySelectorAll('[data-topic]').forEach(card => card.addEventListener('click', () => openTopic(card.dataset.topic)));
  }

  function currentQuiz() { return selectedTopic.quiz[questionIndex]; }
  function renderLesson() {
    const lesson = selectedTopic.lessons[selectedLevel];
    $('#topicLessonTitle').textContent = `${selectedLevel} · learn the key ideas`;
    const worked = selectedTopic.quiz[levels.indexOf(selectedLevel)];
    $('#topicLessonContent').innerHTML = `<p class="lesson-level-intro">${selectedLevel === 'Basic' ? 'Start with the core idea and build accuracy.' : selectedLevel === 'Intermediate' ? 'Connect methods and handle more than one step.' : 'Apply the ideas carefully to less familiar cases.'}</p><ol>${lesson.map(x => `<li>${escapeHTML(x)}</li>`).join('')}</ol><div class="aptitude-worked-example"><strong>WORKED EXAMPLE</strong><p>${escapeHTML(worked.q)}</p><p>${escapeHTML(worked.why)}</p><details><summary>Common mistakes to avoid</summary><ul>${worked.wrong.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul></details></div>`;
    $('#topicSources').innerHTML = `<span>Learning references</span><small>${escapeHTML(selectedTopic.source)}</small>`;
    $('#quizLevelTitle').textContent = `${selectedLevel} question bank`;
    questionIndex = 0; correctCount = 0; quizFinished = false;
    renderQuizQuestion();
    document.querySelectorAll('#topicLevelTabs button').forEach(b => b.classList.toggle('active', b.dataset.level === selectedLevel));
    renderProgress();
  }

  function renderQuizQuestion() {
    const q = currentQuiz();
    $('#quizStem').textContent = q.q;
    $('#quizQuestionCount').textContent = `QUESTION ${questionIndex + 1} / ${selectedTopic.quiz.length}`;
    $('#quizOptions').innerHTML = q.o.map((option, i) => `<button class="quiz-option" type="button" data-answer="${i}" aria-pressed="false"><span class="quiz-option-key">${String.fromCharCode(65+i)}</span><span>${escapeHTML(option)}</span></button>`).join('');
    $('#quizOptions').querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
      if (submitted) return;
      selectedAnswer = Number(button.dataset.answer);
      $('#quizOptions').querySelectorAll('.quiz-option').forEach(x => {x.classList.toggle('selected', x === button); x.setAttribute('aria-pressed', x === button ? 'true' : 'false');});
    }));
    $('#quizFeedback').hidden = true;
    $('#quizFeedback').innerHTML = '';
    $('#quizStatus').textContent = questionIndex ? `${correctCount} correct so far` : (progress[selectedTopic.id]?.[selectedLevel] != null ? `Best saved: ${progress[selectedTopic.id][selectedLevel]}%` : 'Not attempted');
    $('#submitQuiz').disabled = false;
    $('#submitQuiz').innerHTML = 'Check answer <span>↗</span>';
    selectedAnswer = null; submitted = false;
  }

  function renderProgress() {
    const scores = progress[selectedTopic.id] || {};
    const done = levels.filter(level => scores[level] != null).length;
    const values = Object.values(scores);
    $('#topicBestScore').textContent = values.length ? `${Math.max(...values)}%` : '—';
    $('#topicProgressText').textContent = done ? `${done} of 3 level quizzes completed` : 'Complete a level quiz to save progress.';
    $('#topicLevelProgress').innerHTML = levels.map(level => `<span class="${scores[level] != null ? 'complete' : ''}" title="${level}: ${scores[level] == null ? 'not attempted' : `${scores[level]}%`}"><i>${scores[level] == null ? '○' : '✓'}</i>${level}</span>`).join('');
  }

  function openTopic(id) {
    selectedTopic = topics.find(t => t.id === id);
    if (!selectedTopic) return;
    selectedLevel = 'Basic';
    $('#aptitudeCatalog').hidden = true;
    $('#aptitudeDetail').hidden = false;
    $('#topicGroupLabel').textContent = selectedTopic.group.toUpperCase();
    $('#topicTitle').textContent = selectedTopic.name;
    $('#topicDescription').textContent = selectedTopic.description;
    $('#topicDetailIcon').textContent = selectedTopic.icon;
    $('#topicOverlap').innerHTML = `<strong>How this relates:</strong> ${escapeHTML(selectedTopic.overlap)}`;
    renderLesson();
    $('#aptitudeDetail').scrollIntoView({behavior:'smooth', block:'start'});
  }

  async function saveScore(score) {
    const csrf = app.dataset.csrf;
    try {
      const response = await fetch(`/api/aptitude/progress/${encodeURIComponent(selectedTopic.id)}/${encodeURIComponent(selectedLevel)}`, {
        method:'POST', headers:{'Content-Type':'application/json','X-CSRF-Token':csrf},
        body:JSON.stringify({score,total_questions:selectedTopic.quiz.length})
      });
      if (!response.ok) throw new Error('Could not save progress');
      progress[selectedTopic.id] ||= {};
      progress[selectedTopic.id][selectedLevel] = Math.max(progress[selectedTopic.id][selectedLevel] ?? 0, score);
      renderProgress();
      $('#quizStatus').textContent = `Result saved: ${score}%`;
    } catch (_) {
      $('#quizStatus').textContent = 'Answer checked · progress could not be saved';
    }
  }

  $('#topicSearch').addEventListener('input', renderCatalog);
  $('#topicFilters').querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    $('#topicFilters').querySelectorAll('[data-filter]').forEach(x => x.classList.toggle('active', x === button));
    renderCatalog();
  }));
  $('#backToTopics').addEventListener('click', () => {$('#aptitudeDetail').hidden = true; $('#aptitudeCatalog').hidden = false; renderCatalog();});
  $('#topicLevelTabs').querySelectorAll('[data-level]').forEach(button => button.addEventListener('click', () => {selectedLevel=button.dataset.level; renderLesson();}));
  $('#submitQuiz').addEventListener('click', () => {
    if (!selectedTopic || quizFinished) return;
    if (submitted) {
      if (questionIndex < selectedTopic.quiz.length - 1) {
        questionIndex += 1;
        selectedAnswer = null;
        renderQuizQuestion();
        return;
      }
      quizFinished = true;
      const score = Math.round(correctCount / selectedTopic.quiz.length * 100);
      $('#quizStatus').textContent = `Question bank complete · ${correctCount}/${selectedTopic.quiz.length} correct · ${score}%`;
      $('#submitQuiz').disabled = true;
      $('#submitQuiz').textContent = 'Question bank complete';
      saveScore(score);
      return;
    }
    if (selectedAnswer == null) { $('#quizStatus').textContent = 'Choose an answer to continue.'; return; }
    submitted = true;
    const q = currentQuiz(), correct = selectedAnswer === q.a;
    if (correct) correctCount += 1;
    const feedback = $('#quizFeedback');
    feedback.hidden = false;
    feedback.classList.toggle('is-correct', correct);
    feedback.classList.toggle('is-incorrect', !correct);
    const explain = correct ? `<p><strong>Correct. Here’s why:</strong> ${escapeHTML(q.why)}</p>` : `<p><strong>Not quite.</strong> You chose “${escapeHTML(q.o[selectedAnswer])}”. ${escapeHTML(q.wrong[selectedAnswer])}</p><p><strong>Correct answer: ${escapeHTML(q.o[q.a])}.</strong> ${escapeHTML(q.why)}</p>`;
    const distractors = q.o.map((o,i) => i === q.a ? '' : `<li><strong>${escapeHTML(o)}:</strong> ${escapeHTML(q.wrong[i])}</li>`).filter(Boolean).join('');
    feedback.innerHTML = `${explain}<details><summary>Review each option</summary><ul>${distractors}</ul></details>`;
    $('#quizOptions').querySelectorAll('.quiz-option').forEach((button, i) => {button.disabled=true; if(i===q.a)button.classList.add('answer-correct'); else if(i===selectedAnswer)button.classList.add('answer-incorrect');});
    $('#quizStatus').textContent = `${correctCount}/${questionIndex + 1} correct so far`;
    $('#submitQuiz').textContent = questionIndex < selectedTopic.quiz.length - 1 ? 'Next question ↗' : 'Finish question bank';
  });

  async function loadProgress() {
    try {
      const response = await fetch('/api/aptitude/progress');
      if (!response.ok) return;
      const rows = await response.json();
      rows.forEach(row => { progress[row.topic_id] ||= {}; progress[row.topic_id][row.level] = Number(row.score); });
      renderCatalog();
      if (selectedTopic) renderProgress();
    } catch (_) { /* lessons and quizzes remain usable offline */ }
  }
  renderCatalog();
  loadProgress();
})();
