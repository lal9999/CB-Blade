/**
 * AI服务类 - 支持多个AI提供商
 * 包含本地演示模式，无需配置即可体验
 */
class AIService {
  constructor() {
    this.currentProvider = 'local_demo';
    this.apiKey = null;
    this.requestCount = 0;
    this.cache = new Map();
    this.rateLimitDelay = 1000; // 1秒延迟
    this.lastRequestTime = 0;
    
    // 从本地存储加载配置
    this.loadConfig();
  }

  /**
   * 加载配置
   */
  loadConfig() {
    try {
      const savedProvider = localStorage.getItem('ai_provider');
      const savedApiKey = localStorage.getItem('api_key');
      
      if (savedProvider && CONFIG.AI_PROVIDERS[savedProvider]) {
        this.currentProvider = savedProvider;
      }
      
      if (savedApiKey) {
        this.apiKey = savedApiKey;
      }
    } catch (error) {
      console.warn('加载AI配置失败:', error);
    }
  }

  /**
   * 保存配置
   */
  saveConfig() {
    try {
      localStorage.setItem('ai_provider', this.currentProvider);
      if (this.apiKey) {
        localStorage.setItem('api_key', this.apiKey);
      }
    } catch (error) {
      console.warn('保存AI配置失败:', error);
    }
  }

  /**
   * 切换AI提供商
   */
  switchProvider(providerId) {
    if (!CONFIG.AI_PROVIDERS[providerId]) {
      throw new Error(`不支持的AI提供商: ${providerId}`);
    }
    
    this.currentProvider = providerId;
    this.saveConfig();
    
    // 更新UI状态
    this.updateUIStatus();
  }

  /**
   * 设置API密钥
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.saveConfig();
    this.updateUIStatus();
  }

  /**
   * 获取当前提供商信息
   */
  getCurrentProvider() {
    return CONFIG.AI_PROVIDERS[this.currentProvider];
  }

  /**
   * 检查API密钥是否有效
   */
  isApiKeyValid() {
    const provider = this.getCurrentProvider();
    if (!provider.requiresApiKey) {
      return true;
    }
    return this.apiKey && this.apiKey.length > 10;
  }

  /**
   * 更新UI状态
   */
  updateUIStatus() {
    const statusElement = document.getElementById('ai-status');
    const statusText = document.querySelector('.status-text');
    const statusIndicator = document.querySelector('.status-indicator');
    
    if (statusText && statusIndicator) {
      const provider = this.getCurrentProvider();
      statusText.textContent = provider.name;
      
      if (this.isApiKeyValid()) {
        statusIndicator.style.background = '#4caf50';
        statusIndicator.classList.add('success');
      } else if (this.currentProvider === 'local_demo') {
        statusIndicator.style.background = '#4caf50';
        statusIndicator.classList.add('success');
      } else {
        statusIndicator.style.background = '#f44336';
        statusIndicator.classList.remove('success');
      }
    }
  }

  /**
   * 生成AI响应
   */
  async generateResponse(prompt, options = {}) {
    // 检查缓存
    const cacheKey = this.getCacheKey(prompt, options);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 频率限制
    await this.enforceRateLimit();

    let response;
    
    if (this.currentProvider === 'local_demo') {
      response = await this.generateDemoResponse(prompt, options);
    } else {
      response = await this.generateRealResponse(prompt, options);
    }

    // 缓存响应
    this.cache.set(cacheKey, response);
    this.requestCount++;

    return response;
  }

  /**
   * 生成演示响应
   */
  async generateDemoResponse(prompt, options = {}) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // 根据prompt类型生成不同的演示响应
    if (prompt.includes('评价学生的答案')) {
      return this.generateDemoEvaluation();
    } else if (prompt.includes('提供一个思考提示')) {
      return this.generateDemoHint();
    } else if (prompt.includes('生成一个完整的反共识案例复盘')) {
      return this.generateDemoCaseStudy();
    } else {
      return this.generateDemoGeneral();
    }
  }

  /**
   * 生成演示评价
   */
  generateDemoEvaluation() {
    const evaluations = [
      {
        scores: [
          { dimension: "反共识程度", score: 78, comment: "展现了对传统模式的质疑" },
          { dimension: "创新性", score: 82, comment: "提出了新颖的解决思路" },
          { dimension: "可行性", score: 71, comment: "方案具有一定的实现可能性" },
          { dimension: "逻辑性", score: 85, comment: "论证过程清晰有条理" }
        ],
        overallScore: 79,
        strengths: "你展现了独立思考的能力，敢于质疑现状，并提出了具有创新性的解决方案。特别是对传统假设的质疑很有深度。",
        improvements: "建议进一步深入分析实施细节，考虑更多的实际约束条件。同时可以从用户心理和行为习惯的角度来完善方案。",
        followUpQuestion: "你提到的核心创新点如何应对传统利益集团的阻力？",
        isComplete: false
      },
      {
        scores: [
          { dimension: "反共识程度", score: 85, comment: "深度质疑了行业基础假设" },
          { dimension: "创新性", score: 88, comment: "跨领域思维运用出色" },
          { dimension: "可行性", score: 76, comment: "技术路径相对清晰" },
          { dimension: "逻辑性", score: 83, comment: "各环节逻辑紧密" }
        ],
        overallScore: 83,
        strengths: "你的思考已经触及了问题的本质，能够从第一性原理出发重新审视整个行业。跨领域的思维融合很有启发性。",
        improvements: "可以进一步考虑方案的渐进式实施路径，以及如何处理转型期的各种挑战。",
        followUpQuestion: "如果要在现有体系中试点你的方案，你会选择什么样的切入点？",
        isComplete: false
      }
    ];
    
    const randomEvaluation = evaluations[Math.floor(Math.random() * evaluations.length)];
    return JSON.stringify(randomEvaluation);
  }

  /**
   * 生成演示提示
   */
  generateDemoHint() {
    const hints = [
      "🗡️ 破魔刀小贴士：试着想象一下，如果这个行业从未存在过，你会如何从零开始创造？",
      "💡 换个视角看看：用户内心真正渴望的是什么？现有方案是否错过了什么重要的东西？",
      "🔍 深入探索：这个行业的哪些'理所当然'其实只是历史的巧合？",
      "⚡ 自由畅想：如果没有任何限制，你最想创造什么样的体验？",
      "🎯 逆向思维：如果要让这个行业变得很糟糕，会怎么做？然后我们反着来！"
    ];
    
    return hints[Math.floor(Math.random() * hints.length)];
  }

  /**
   * 生成演示案例复盘
   */
  generateDemoCaseStudy() {
    return `# 反共识思维案例复盘

## 案例标题
重新定义行业本质的创新实践

## 行业背景
传统行业模式已经运行多年，形成了固化的思维模式和利益格局。

## 传统共识
- 现有的商业模式是最优解
- 用户需求已经被充分理解
- 技术发展路径相对确定

## 反共识洞察
通过深度质疑行业基础假设，发现了被忽视的用户真实需求和全新的价值创造可能性。

## 创新方案
提出了颠覆性的解决方案，重新定义了价值链和用户体验。

## 实施路径
1. 小规模试点验证
2. 逐步扩大影响范围
3. 建立新的生态系统

## 关键启示
- 质疑一切看似理所当然的事情
- 从第一性原理出发思考问题
- 关注被忽视的用户需求
- 勇于挑战既有利益格局

这个案例展示了反共识思维在实际创新中的强大力量。`;
  }

  /**
   * 生成通用演示响应
   */
  generateDemoGeneral() {
    return "这是一个演示响应。在实际使用中，这里会是AI生成的智能回复。请配置真实的AI服务以获得完整体验。";
  }

  /**
   * 生成真实AI响应
   */
  async generateRealResponse(prompt, options = {}) {
    if (!this.isApiKeyValid()) {
      throw new Error('请先配置有效的API密钥');
    }

    const provider = this.getCurrentProvider();
    
    try {
      const response = await fetch(provider.baseUrl + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 2000
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI请求失败:', error);
      throw new Error(`AI服务暂时不可用: ${error.message}`);
    }
  }

  /**
   * 频率限制
   */
  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * 生成缓存键
   */
  getCacheKey(prompt, options) {
    return btoa(prompt + JSON.stringify(options)).substring(0, 32);
  }

  /**
   * 清理缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 获取服务状态
   */
  getStatus() {
    return {
      provider: this.currentProvider,
      providerName: this.getCurrentProvider().name,
      apiKeyValid: this.isApiKeyValid(),
      requestCount: this.requestCount,
      cacheSize: this.cache.size
    };
  }

  /**
   * 测试连接
   */
  async testConnection() {
    try {
      const response = await this.generateResponse('测试连接');
      return response.length > 0;
    } catch (error) {
      console.error('连接测试失败:', error);
      return false;
    }
  }
}

// 全局AI服务实例
let aiService; 