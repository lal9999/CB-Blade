/**
 * 破魔刀挑战模式主应用
 * 实现完整的简答题挑战流程
 */
class ChallengeApp {
  constructor() {
    this.currentScenario = null;
    this.challengeHistory = [];
    this.currentRound = 0;
    this.maxRounds = CONFIG.APP_SETTINGS.maxRounds;
    this.isLoading = false;
    
    // 绑定方法上下文
    this.init = this.init.bind(this);
    this.showNotification = this.showNotification.bind(this);
  }

  /**
   * 初始化应用
   */
  async init() {
    try {
      // 显示加载动画
      await this.showLoadingAnimation();
      
      // 初始化AI服务
      aiService = new AIService();
      
      // 渲染挑战选择界面
      this.renderChallengeSelection();
      
      // 绑定事件监听器
      this.bindEventListeners();
      
      // 隐藏加载屏幕，显示主应用
      this.hideLoadingScreen();
      
      this.showNotification('破魔刀已准备就绪！', 'success');
    } catch (error) {
      console.error('应用初始化失败:', error);
      this.showNotification('初始化失败，请刷新页面重试', 'error');
    }
  }

  /**
   * 显示加载动画
   */
  async showLoadingAnimation() {
    const loadingText = document.getElementById('loading-text');
    const messages = CONFIG.APP_SETTINGS.loadingMessages;
    
    for (let i = 0; i < messages.length; i++) {
      if (loadingText) {
        loadingText.textContent = messages[i];
      }
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }

  /**
   * 隐藏加载屏幕
   */
  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainApp = document.getElementById('main-app');
    
    if (loadingScreen && mainApp) {
      loadingScreen.style.opacity = '0';
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        mainApp.style.display = 'flex';
        // 更新AI状态
        aiService.updateUIStatus();
      }, 500);
    }
  }

  /**
   * 绑定事件监听器
   */
  bindEventListeners() {
    // 字数统计
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      answerInput.addEventListener('input', this.updateWordCount.bind(this));
    }

    // AI配置相关
    const aiProvider = document.getElementById('ai-provider');
    if (aiProvider) {
      aiProvider.addEventListener('change', this.handleProviderChange.bind(this));
    }
  }

  /**
   * 渲染挑战选择界面
   */
  renderChallengeSelection() {
    const scenariosGrid = document.getElementById('scenarios-grid');
    if (!scenariosGrid) return;

    const scenarios = CONFIG.CHALLENGE_SCENARIOS;
    
    scenariosGrid.innerHTML = scenarios.map(scenario => `
      <div class="scenario-card" onclick="app.startChallenge('${scenario.id}')">
        <div class="scenario-industry">${scenario.industry}</div>
        <h3 class="scenario-title">${scenario.title}</h3>
        <p class="scenario-description">${scenario.description}</p>
        
        <div class="consensus-preview">
          <h4>主流共识预览：</h4>
          <ul>
            ${scenario.mainstream_consensus.slice(0, 3).map(item => 
              `<li>${item}</li>`
            ).join('')}
            ${scenario.mainstream_consensus.length > 3 ? '<li>...</li>' : ''}
          </ul>
        </div>
        
        <div class="challenge-action">
          <span class="challenge-btn">接受挑战 →</span>
        </div>
      </div>
    `).join('');

    // 显示选择界面，隐藏其他界面
    this.showSection('challenge-selection');
  }

  /**
   * 开始挑战
   */
  startChallenge(scenarioId) {
    const scenario = CONFIG.CHALLENGE_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      this.showNotification('挑战场景不存在', 'error');
      return;
    }

    this.currentScenario = scenario;
    this.challengeHistory = [];
    this.currentRound = 0;
    
    this.renderChallengeInterface();
    this.showSection('challenge-interface');
    
    this.showNotification(`开始挑战：${scenario.title}`, 'info');
  }

  /**
   * 渲染挑战界面
   */
  renderChallengeInterface() {
    if (!this.currentScenario) return;

    const scenario = this.currentScenario;
    
    // 更新场景信息
    this.updateScenarioInfo(scenario);
    
    // 更新进度信息
    this.updateProgressInfo();
    
    // 清空输入框
    const answerInput = document.getElementById('answer-input');
    if (answerInput) {
      answerInput.value = '';
      this.updateWordCount();
    }
    
    // 重置对话区域
    this.resetConversationArea();
  }

  /**
   * 更新场景信息
   */
  updateScenarioInfo(scenario) {
    // 更新标题和标签
    const scenarioTitle = document.getElementById('scenario-title');
    const currentIndustry = document.getElementById('current-industry');
    
    if (scenarioTitle) scenarioTitle.textContent = scenario.title;
    if (currentIndustry) currentIndustry.textContent = scenario.industry;
    
    // 更新背景描述
    const scenarioBackground = document.getElementById('scenario-background');
    if (scenarioBackground) scenarioBackground.textContent = scenario.background;
    
    // 更新主流共识
    const consensusList = document.getElementById('consensus-list');
    if (consensusList) {
      consensusList.innerHTML = scenario.mainstream_consensus
        .map(item => `<li>${item}</li>`)
        .join('');
    }
    
    // 更新挑战问题
    const challengeQuestion = document.getElementById('challenge-question');
    if (challengeQuestion) challengeQuestion.textContent = scenario.challenge_question;
    
    // 更新提示
    const hintsList = document.getElementById('hints-list');
    if (hintsList) {
      hintsList.innerHTML = scenario.hints
        .map(hint => `<li>${hint}</li>`)
        .join('');
    }
  }

  /**
   * 更新进度信息
   */
  updateProgressInfo() {
    const roundInfo = document.getElementById('round-info');
    if (roundInfo) {
      roundInfo.textContent = `第 ${this.currentRound + 1} 轮交流`;
    }
  }

  /**
   * 重置对话区域
   */
  resetConversationArea() {
    const conversationArea = document.getElementById('conversation-area');
    if (!conversationArea) return;
    
    conversationArea.innerHTML = `
      <div class="teacher-welcome">
        <div class="avatar teacher-avatar">🗡️</div>
        <div class="message-bubble teacher-message">
          <div class="message-header">
            <strong>破魔刀</strong>
            <span class="timestamp">刚刚</span>
          </div>
          <div class="message-content">
            欢迎来到创新思维的探索之旅！我是破魔刀，你的思维伙伴，会陪伴你一起发现那些被忽视的可能性。让我们一起跳出常规思维，用全新的视角重新审视这个世界。准备好开始这场有趣的思维冒险了吗？
          </div>
        </div>
      </div>
    `;
  }

  /**
   * 提交答案
   */
  async submitAnswer() {
    const answerInput = document.getElementById('answer-input');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!answerInput || !submitBtn) return;
    
    const answer = answerInput.value.trim();
    
    // 验证答案
    if (!answer) {
      this.showNotification('请输入你的答案', 'warning');
      return;
    }
    
    if (answer.length < CONFIG.APP_SETTINGS.minAnswerLength) {
      this.showNotification(`答案太简短了，破魔刀导师期待更深入的思考（至少${CONFIG.APP_SETTINGS.minAnswerLength}字）`, 'warning');
      return;
    }

    // 防止重复提交
    if (this.isLoading) return;
    this.isLoading = true;
    
    // 更新按钮状态
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 破魔刀正在评判...';
    submitBtn.disabled = true;

    try {
      // 添加学生回答到对话
      this.addStudentMessage(answer);
      
      // 获取AI评价
      const evaluation = await this.evaluateAnswer(answer);
      
      // 添加导师反馈到对话
      this.addTeacherResponse(evaluation);
      
      // 保存到历史记录
      this.challengeHistory.push({
        round: this.currentRound + 1,
        userAnswer: answer,
        evaluation: evaluation,
        timestamp: Date.now()
      });
      
      this.currentRound++;
      
      // 清空输入框
      answerInput.value = '';
      this.updateWordCount();
      
      // 更新进度
      this.updateProgressInfo();
      
      // 检查是否完成挑战
      if (this.shouldCompleteChallenge(evaluation)) {
        setTimeout(() => this.completeChallenge(), 2000);
      }
      
    } catch (error) {
      console.error('提交答案失败:', error);
      this.showNotification('评价过程中出现错误，请重试', 'error');
    } finally {
      // 恢复按钮状态
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      this.isLoading = false;
    }
  }

  /**
   * 评价答案
   */
  async evaluateAnswer(answer) {
    const scenario = this.currentScenario;
    const round = this.currentRound + 1;
    
    const prompt = `你是破魔刀，一位友好而富有洞察力的创新思维伙伴。你擅长发现别人思考中的亮点，同时温和地指出可以改进的地方。

挑战场景：${scenario.title}
行业背景：${scenario.background}
挑战问题：${scenario.challenge_question}

学生的思考（第${round}轮）：
${answer}

评价维度：
${scenario.evaluation_dimensions.map(dim => 
    `${dim.name}（权重${dim.weight}%）：${dim.criteria.join('、')}`
).join('\n')}

请按以下JSON格式返回评价结果：
{
    "scores": [
        {"dimension": "反共识程度", "score": 75, "comment": "具体评价"},
        {"dimension": "创新性", "score": 80, "comment": "具体评价"},
        {"dimension": "可行性", "score": 70, "comment": "具体评价"},
        {"dimension": "逻辑性", "score": 85, "comment": "具体评价"}
    ],
    "overallScore": 77,
    "strengths": "亮点分析，要具体指出学生思考的闪光点，语言要鼓励和温暖",
    "improvements": "改进建议，要给出具体的提升方向，语言要友好和建设性",
    "followUpQuestion": "基于答案内容的深入追问（可选）",
    "isComplete": false
}

评价要求：
1. 友好鼓励，先肯定亮点再提出建议
2. 分数要客观，一般在60-90分之间
3. 如果答案质量很高且思考深入，可以设置isComplete为true
4. 追问要温和而有启发性，像朋友间的深度对话`;

    try {
      const response = await aiService.generateResponse(prompt);
      return JSON.parse(response);
    } catch (error) {
      console.error('AI评价失败:', error);
      // 返回默认评价
      return this.getDefaultEvaluation();
    }
  }

  /**
   * 获取默认评价
   */
  getDefaultEvaluation() {
    return {
      scores: [
        { dimension: "反共识程度", score: 70, comment: "有一定的反思" },
        { dimension: "创新性", score: 65, comment: "思路较为新颖" },
        { dimension: "可行性", score: 60, comment: "需要更多细节" },
        { dimension: "逻辑性", score: 75, comment: "逻辑基本清晰" }
      ],
      overallScore: 67,
      strengths: "你展现了独立思考的能力，敢于质疑现状。",
      improvements: "建议进一步深入分析，提供更多具体的实施细节。",
      followUpQuestion: "你能进一步解释这个方案的核心创新点吗？",
      isComplete: false
    };
  }

  /**
   * 添加学生消息
   */
  addStudentMessage(answer) {
    const conversationArea = document.getElementById('conversation-area');
    if (!conversationArea) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = 'conversation-exchange';
    messageElement.innerHTML = `
      <div class="student-turn">
        <div class="avatar student-avatar">🎓</div>
        <div class="message-bubble student-message">
          <div class="message-header">
            <strong>你的回答</strong>
            <span class="timestamp">${this.formatTime(new Date())}</span>
          </div>
          <div class="message-content">${answer}</div>
        </div>
      </div>
    `;
    
    conversationArea.appendChild(messageElement);
    this.scrollToBottom(conversationArea);
  }

  /**
   * 添加导师回应
   */
  addTeacherResponse(evaluation) {
    const conversationArea = document.getElementById('conversation-area');
    if (!conversationArea) return;
    
    const lastExchange = conversationArea.lastElementChild;
    if (!lastExchange) return;
    
    const teacherResponse = document.createElement('div');
    teacherResponse.className = 'teacher-turn';
    teacherResponse.innerHTML = `
      <div class="avatar teacher-avatar">🗡️</div>
      <div class="message-bubble teacher-message">
        <div class="message-header">
          <strong>破魔刀的反馈</strong>
          <span class="timestamp">${this.formatTime(new Date())}</span>
        </div>
        <div class="message-content">
          <div class="evaluation-scores">
            ${evaluation.scores.map(score => `
              <div class="score-item">
                <span class="score-name">${score.dimension}</span>
                <div class="score-bar">
                  <div class="score-fill" style="width: ${score.score}%"></div>
                </div>
                <span class="score-value">${score.score}/100</span>
              </div>
            `).join('')}
          </div>
          
          <div class="feedback-section">
            <h5>💪 亮点分析</h5>
            <p>${evaluation.strengths}</p>
          </div>
          
          <div class="feedback-section">
            <h5>🎯 改进建议</h5>
            <p>${evaluation.improvements}</p>
          </div>
          
          ${evaluation.followUpQuestion ? `
            <div class="feedback-section">
              <h5>🤔 深入思考</h5>
              <p class="follow-up-question">${evaluation.followUpQuestion}</p>
            </div>
          ` : ''}
        </div>
      </div>
    `;
    
    lastExchange.appendChild(teacherResponse);
    this.scrollToBottom(conversationArea);
  }

  /**
   * 请求提示
   */
  async requestHint() {
    if (this.isLoading) return;
    
    const hintBtn = document.querySelector('.hint-btn');
    if (!hintBtn) return;
    
    this.isLoading = true;
    const originalText = hintBtn.innerHTML;
    hintBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 生成提示中...';
    hintBtn.disabled = true;
    
    try {
      const scenario = this.currentScenario;
      const prompt = `作为破魔刀，为你的思维伙伴提供一个友好的思考提示。

挑战场景：${scenario.title}
挑战问题：${scenario.challenge_question}
当前轮次：第${this.currentRound + 1}轮

请提供一个启发性的提示，帮助学生从新的角度思考问题，但不要直接给出答案。提示应该：
1. 温和地引导质疑基础假设
2. 提供有趣的新思考角度
3. 鼓励跨领域的创意思维
4. 保持神秘感，激发好奇心

请用破魔刀友好伙伴的语气，简洁而有启发性地给出提示。`;

      const hint = await aiService.generateResponse(prompt);
      
      // 在对话区域显示提示
      this.addHintMessage(hint);
      
    } catch (error) {
      console.error('生成提示失败:', error);
      this.showNotification('生成提示失败，请重试', 'error');
    } finally {
      hintBtn.innerHTML = originalText;
      hintBtn.disabled = false;
      this.isLoading = false;
    }
  }

  /**
   * 添加提示消息
   */
  addHintMessage(hint) {
    const conversationArea = document.getElementById('conversation-area');
    if (!conversationArea) return;
    
    const hintElement = document.createElement('div');
    hintElement.className = 'teacher-hint';
    hintElement.innerHTML = `
      <div class="avatar teacher-avatar">💡</div>
      <div class="message-bubble teacher-message">
        <div class="message-header">
          <strong>破魔刀的提示</strong>
          <span class="timestamp">${this.formatTime(new Date())}</span>
        </div>
        <div class="message-content">${hint}</div>
      </div>
    `;
    
    conversationArea.appendChild(hintElement);
    this.scrollToBottom(conversationArea);
  }

  /**
   * 判断是否应该完成挑战
   */
  shouldCompleteChallenge(evaluation) {
    return evaluation.isComplete || 
           evaluation.overallScore >= 85 || 
           this.currentRound >= this.maxRounds;
  }

  /**
   * 完成挑战
   */
  async completeChallenge() {
    // 计算总体表现
    const avgScore = this.challengeHistory.reduce((sum, h) => sum + h.evaluation.overallScore, 0) / this.challengeHistory.length;
    const level = this.getChallengeLevel(avgScore);
    
    // 生成完整案例复盘
    const caseStudy = await this.generateCaseStudy();
    
    // 渲染完成界面
    this.renderCompletionInterface(level, avgScore, caseStudy);
    this.showSection('challenge-completion');
    
    this.showNotification('挑战完成！', 'success');
  }

  /**
   * 优化案例内容
   */
  async optimizeCaseStudy() {
    if (!CONFIG.APP_SETTINGS.enableCaseOptimization) {
      this.showNotification('案例优化功能未启用', 'warning');
      return;
    }

    const optimizeBtn = document.querySelector('.optimize-case-btn');
    if (!optimizeBtn) return;

    // 更新按钮状态
    const originalText = optimizeBtn.innerHTML;
    optimizeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 破魔刀正在优化案例...';
    optimizeBtn.disabled = true;

    try {
      const scenario = this.currentScenario;
      const history = this.challengeHistory;
      const originalCaseStudy = document.querySelector('.case-study-content').textContent;

      const prompt = `作为破魔刀导师，请基于学生的思考过程，创造一个更完整、更优秀的反共识创新案例。

原始挑战场景：${scenario.title}
行业：${scenario.industry}
挑战问题：${scenario.challenge_question}

学生的思考历程：
${history.map((h, i) => `
第${i+1}轮思考：${h.userAnswer}
我的评价：${h.evaluation.strengths}
改进建议：${h.evaluation.improvements}
`).join('\n')}

学生生成的初版案例：
${originalCaseStudy}

请你作为经验丰富的创新导师，结合学生的思考亮点，创造一个更加完善的案例。要求：

1. **保留学生的核心创新洞察**，但要进一步深化和完善
2. **补充实施细节**，让方案更具可操作性
3. **增加商业价值分析**，说明创新的商业潜力
4. **考虑潜在挑战**，并提供应对策略
5. **语言要生动有趣**，让人愿意阅读和分享
6. **结构要清晰**，便于理解和传播

请生成一个结构化的优化案例，包括：
- 案例标题（要有吸引力）
- 创新背景
- 核心洞察
- 解决方案
- 实施路径
- 商业价值
- 风险应对
- 关键启示

这个优化后的案例将成为知识库中的精品内容，供其他学习者参考。`;

      const optimizedCase = await aiService.generateResponse(prompt);
      
      // 显示优化结果
      this.showOptimizedCase(optimizedCase);
      
      this.showNotification('案例优化完成！破魔刀为你创造了一个更棒的版本', 'success');
      
    } catch (error) {
      console.error('案例优化失败:', error);
      this.showNotification('案例优化过程中遇到问题，请稍后重试', 'error');
    } finally {
      // 恢复按钮状态
      optimizeBtn.innerHTML = originalText;
      optimizeBtn.disabled = false;
    }
  }

  /**
   * 显示优化后的案例
   */
  showOptimizedCase(optimizedCase) {
    const completionSection = document.getElementById('challenge-completion');
    if (!completionSection) return;

    // 创建优化案例展示区域
    const optimizedSection = document.createElement('div');
    optimizedSection.className = 'optimized-case-section';
    optimizedSection.innerHTML = `
      <div class="optimized-header">
        <h3>✨ 破魔刀优化版案例</h3>
        <p class="optimized-subtitle">基于你的创新思考，破魔刀为你创造了一个更完整的版本</p>
      </div>
      
      <div class="case-comparison">
        <div class="comparison-tabs">
          <button class="tab-btn active" onclick="app.switchCaseTab('original')">
            📝 你的原创版本
          </button>
          <button class="tab-btn" onclick="app.switchCaseTab('optimized')">
            ✨ 破魔刀优化版
          </button>
        </div>
        
        <div class="tab-content">
          <div id="original-case" class="case-content active">
            ${document.querySelector('.case-study-content').innerHTML}
          </div>
          <div id="optimized-case" class="case-content">
            ${optimizedCase}
          </div>
        </div>
      </div>
      
      <div class="case-actions">
        <button class="primary-btn" onclick="app.saveOptimizedCase()">
          <i class="fas fa-star"></i> 保存优化版到知识库
        </button>
        <button class="secondary-btn" onclick="app.shareOptimizedCase()">
          <i class="fas fa-share-alt"></i> 分享优化版案例
        </button>
        <button class="secondary-btn" onclick="app.downloadCaseStudy()">
          <i class="fas fa-download"></i> 下载完整案例
        </button>
      </div>
    `;

    // 插入到完成界面中
    const caseStudySection = completionSection.querySelector('.case-study-section');
    if (caseStudySection) {
      caseStudySection.parentNode.insertBefore(optimizedSection, caseStudySection.nextSibling);
    }

    // 隐藏原来的优化按钮
    const optimizeBtn = completionSection.querySelector('.optimize-case-btn');
    if (optimizeBtn) {
      optimizeBtn.style.display = 'none';
    }
  }

  /**
   * 切换案例标签页
   */
  switchCaseTab(tabType) {
    // 更新标签按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[onclick="app.switchCaseTab('${tabType}')"]`).classList.add('active');

    // 更新内容显示
    document.querySelectorAll('.case-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabType}-case`).classList.add('active');
  }

  /**
   * 保存优化版案例
   */
  saveOptimizedCase() {
    const optimizedContent = document.getElementById('optimized-case').textContent;
    const originalContent = document.querySelector('.case-study-content').textContent;
    
    const caseData = {
      scenario: this.currentScenario,
      history: this.challengeHistory,
      originalCase: originalContent,
      optimizedCase: optimizedContent,
      timestamp: Date.now(),
      isOptimized: true,
      level: this.getChallengeLevel(
        this.challengeHistory.reduce((sum, h) => sum + h.evaluation.overallScore, 0) / this.challengeHistory.length
      )
    };
    
    try {
      const savedCases = JSON.parse(localStorage.getItem('saved_cases') || '[]');
      savedCases.push(caseData);
      localStorage.setItem('saved_cases', JSON.stringify(savedCases));
      
      // 同时保存到精品案例库
      const premiumCases = JSON.parse(localStorage.getItem('premium_cases') || '[]');
      premiumCases.push({
        id: `premium_${Date.now()}`,
        title: this.currentScenario.title,
        industry: this.currentScenario.industry,
        content: optimizedContent,
        originalThinking: this.challengeHistory,
        createdAt: Date.now(),
        tags: ['破魔刀优化', '反共识思维', this.currentScenario.industry]
      });
      localStorage.setItem('premium_cases', JSON.stringify(premiumCases));
      
      this.showNotification('优化版案例已保存到知识库和精品案例库！', 'success');
    } catch (error) {
      console.error('保存优化案例失败:', error);
      this.showNotification('保存失败，请重试', 'error');
    }
  }

  /**
   * 分享优化版案例
   */
  shareOptimizedCase() {
    const scenario = this.currentScenario;
    const avgScore = this.challengeHistory.reduce((sum, h) => sum + h.evaluation.overallScore, 0) / this.challengeHistory.length;
    const level = this.getChallengeLevel(avgScore);
    
    const shareText = `🗡️ 破魔刀创新案例分享

🎯 挑战领域：${scenario.industry}
💡 创新主题：${scenario.title}
🏆 思维等级：${level.title}
📊 创新得分：${Math.round(avgScore)}分

经过与破魔刀的深度思考对话，我们共同创造了一个颠覆性的创新方案！这个案例展示了反共识思维在实际创新中的强大力量。

破魔刀不仅帮我发现了思维盲点，还协助我完善了整个创新方案，让想法变得更加可行和有价值。

想要体验反共识思维训练吗？来试试破魔刀挑战模式吧！

#破魔刀 #反共识思维 #创新案例 #思维突破`;

    if (navigator.share) {
      navigator.share({
        title: '破魔刀创新案例',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        this.showNotification('案例分享内容已复制到剪贴板！', 'success');
      });
    }
  }

  /**
   * 下载案例研究
   */
  downloadCaseStudy() {
    const scenario = this.currentScenario;
    const originalCase = document.querySelector('.case-study-content').textContent;
    const optimizedCase = document.getElementById('optimized-case')?.textContent || '';
    
    const downloadContent = `# 破魔刀创新案例研究

## 基本信息
- **挑战领域**: ${scenario.industry}
- **案例标题**: ${scenario.title}
- **创建时间**: ${new Date().toLocaleString('zh-CN')}
- **思维等级**: ${this.getChallengeLevel(
      this.challengeHistory.reduce((sum, h) => sum + h.evaluation.overallScore, 0) / this.challengeHistory.length
    ).title}

## 挑战背景
${scenario.background}

## 核心问题
${scenario.challenge_question}

## 思考历程
${this.challengeHistory.map((h, i) => `
### 第${i+1}轮思考
**我的回答**: ${h.userAnswer}

**破魔刀评价**: ${h.evaluation.strengths}

**改进建议**: ${h.evaluation.improvements}

**得分**: ${h.evaluation.overallScore}/100
`).join('\n')}

## 原创案例版本
${originalCase}

${optimizedCase ? `
## 破魔刀优化版本
${optimizedCase}
` : ''}

---
*本案例由破魔刀反共识思维训练系统生成*`;

    // 创建下载
    const blob = new Blob([downloadContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `破魔刀案例_${scenario.industry}_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    this.showNotification('案例文件下载完成！', 'success');
  }

  /**
   * 渲染完成界面
   */
  renderCompletionInterface(level, avgScore, caseStudy) {
    const completionSection = document.getElementById('challenge-completion');
    if (!completionSection) return;
    
    const scenario = this.currentScenario;
    
    completionSection.innerHTML = `
      <div class="completion-header">
        <div class="completion-icon">${level.icon}</div>
        <h2>挑战完成！</h2>
        <div class="completion-level" style="background: ${level.color}20; color: ${level.color};">
          ${level.title}
        </div>
      </div>
      
      <div class="completion-stats">
        <div class="stat-item">
          <div class="stat-value">${this.currentRound}</div>
          <div class="stat-label">交流轮次</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${Math.round(avgScore)}</div>
          <div class="stat-label">平均得分</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${scenario.industry}</div>
          <div class="stat-label">挑战领域</div>
        </div>
      </div>
      
      <div class="case-study-section">
        <h3>📋 你的创新案例</h3>
        <div class="case-study-content">${caseStudy}</div>
        
        ${CONFIG.APP_SETTINGS.enableCaseOptimization ? `
          <div class="case-optimization">
            <div class="optimization-prompt">
              <p>🗡️ <strong>破魔刀想说</strong>：你的思考很棒！我可以帮你把这个案例打磨得更完美，让它成为知识库中的精品内容。</p>
            </div>
            <button class="optimize-case-btn" onclick="app.optimizeCaseStudy()">
              <i class="fas fa-magic"></i> 让破魔刀优化这个案例
            </button>
          </div>
        ` : ''}
      </div>
      
      <div class="completion-actions">
        <button class="primary-btn" onclick="app.saveCaseStudy()">
          <i class="fas fa-save"></i> 保存案例到知识库
        </button>
        <button class="secondary-btn" onclick="app.showChallengeSelection()">
          <i class="fas fa-redo"></i> 开始新挑战
        </button>
        <button class="secondary-btn" onclick="app.shareChallenge()">
          <i class="fas fa-share"></i> 分享成果
        </button>
      </div>
    `;
  }

  /**
   * 获取挑战等级
   */
  getChallengeLevel(score) {
    const levels = CONFIG.LEVELS;
    for (const [key, level] of Object.entries(levels)) {
      if (score >= level.min) {
        return level;
      }
    }
    return levels.explorer;
  }

  /**
   * 生成案例复盘
   */
  async generateCaseStudy() {
    const scenario = this.currentScenario;
    const history = this.challengeHistory;
    
    const prompt = `基于以下挑战过程，生成一个完整的反共识案例复盘：

挑战场景：${scenario.title}
行业：${scenario.industry}
原始问题：${scenario.challenge_question}

学生思考过程：
${history.map((h, i) => `
第${i+1}轮回答：${h.userAnswer}
导师评价：${h.evaluation.strengths} ${h.evaluation.improvements}
`).join('\n')}

请生成一个结构化的案例复盘，包括：
1. 案例标题
2. 行业背景
3. 传统共识
4. 反共识洞察
5. 创新方案
6. 实施路径
7. 关键启示

格式要清晰，内容要深入，可以作为教学案例使用。`;

    try {
      return await aiService.generateResponse(prompt);
    } catch (error) {
      console.error('生成案例复盘失败:', error);
      return '案例复盘生成中遇到问题，请稍后重试。';
    }
  }

  /**
   * 保存案例到知识库
   */
  saveCaseStudy() {
    // 这里可以实现保存到本地存储或发送到服务器
    const caseData = {
      scenario: this.currentScenario,
      history: this.challengeHistory,
      timestamp: Date.now()
    };
    
    try {
      const savedCases = JSON.parse(localStorage.getItem('saved_cases') || '[]');
      savedCases.push(caseData);
      localStorage.setItem('saved_cases', JSON.stringify(savedCases));
      
      this.showNotification('案例已保存到本地知识库！', 'success');
    } catch (error) {
      console.error('保存案例失败:', error);
      this.showNotification('保存失败，请重试', 'error');
    }
  }

  /**
   * 分享挑战成果
   */
  shareChallenge() {
    const scenario = this.currentScenario;
    const avgScore = this.challengeHistory.reduce((sum, h) => sum + h.evaluation.overallScore, 0) / this.challengeHistory.length;
    const level = this.getChallengeLevel(avgScore);
    
    const shareText = `我刚刚完成了破魔刀的反共识挑战！

🎯 挑战领域：${scenario.industry}
🏆 获得等级：${level.title}
📊 平均得分：${Math.round(avgScore)}分
💪 交流轮次：${this.currentRound}轮

在破魔刀导师的严格指导下，我学会了用反共识思维重新审视${scenario.industry}行业，发现了全新的创新机会！

#破魔刀 #反共识思维 #创新训练`;

    if (navigator.share) {
      navigator.share({
        title: '破魔刀挑战成果',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        this.showNotification('分享内容已复制到剪贴板！', 'success');
      });
    }
  }

  /**
   * 显示挑战选择界面
   */
  showChallengeSelection() {
    this.renderChallengeSelection();
  }

  /**
   * 显示指定区域
   */
  showSection(sectionId) {
    const sections = ['challenge-selection', 'challenge-interface', 'challenge-completion'];
    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        section.style.display = id === sectionId ? 'block' : 'none';
      }
    });
  }

  /**
   * 更新字数统计
   */
  updateWordCount() {
    const answerInput = document.getElementById('answer-input');
    const wordCount = document.getElementById('word-count');
    
    if (answerInput && wordCount) {
      const count = answerInput.value.length;
      wordCount.textContent = count;
      
      // 根据字数改变颜色
      if (count >= CONFIG.APP_SETTINGS.minAnswerLength) {
        wordCount.style.color = '#4caf50';
      } else {
        wordCount.style.color = '#ff9800';
      }
    }
  }

  /**
   * 处理AI提供商变更
   */
  handleProviderChange() {
    const aiProvider = document.getElementById('ai-provider');
    const apiKeySection = document.getElementById('api-key-section');
    
    if (!aiProvider || !apiKeySection) return;
    
    const selectedProvider = aiProvider.value;
    const provider = CONFIG.AI_PROVIDERS[selectedProvider];
    
    if (provider.requiresApiKey) {
      apiKeySection.style.display = 'flex';
    } else {
      apiKeySection.style.display = 'none';
    }
  }

  /**
   * 滚动到底部
   */
  scrollToBottom(element) {
    setTimeout(() => {
      element.scrollTop = element.scrollHeight;
    }, 100);
  }

  /**
   * 格式化时间
   */
  formatTime(date) {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  /**
   * 显示通知
   */
  showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <i class="fas fa-${this.getNotificationIcon(type)}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    // 自动移除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  /**
   * 获取通知图标
   */
  getNotificationIcon(type) {
    const icons = {
      success: 'check-circle',
      error: 'exclamation-circle',
      warning: 'exclamation-triangle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }
}

// 全局函数
function showChallengeSelection() {
  app.showChallengeSelection();
}

function submitAnswer() {
  app.submitAnswer();
}

function requestHint() {
  app.requestHint();
}

function toggleAIConfig() {
  const panel = document.getElementById('ai-config-panel');
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }
}

function switchAIProvider() {
  const select = document.getElementById('ai-provider');
  if (select && aiService) {
    aiService.switchProvider(select.value);
    app.handleProviderChange();
  }
}

function saveAPIKey() {
  const input = document.getElementById('api-key-input');
  if (input && aiService) {
    aiService.setApiKey(input.value);
    app.showNotification('API密钥已保存', 'success');
    toggleAIConfig();
  }
}

// 全局应用实例
let app;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  app = new ChallengeApp();
  app.init();
}); 