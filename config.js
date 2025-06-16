/**
 * 破魔刀挑战模式配置文件
 * 包含挑战场景、AI配置等核心数据
 */

const CONFIG = {
  // 挑战场景配置
  CHALLENGE_SCENARIOS: [
    {
      id: 'education_disruption',
      industry: '在线教育',
      title: '颠覆传统在线教育模式',
      description: '当前在线教育行业普遍采用"录播课程+作业+考试"的模式，强调知识传授的效率和规模化。',
      background: '在线教育行业经过十多年的发展，已经形成了相对固化的商业模式和教学方式。大多数平台都在追求内容的标准化、教学的规模化，以及通过技术手段提高学习效率。然而，这种模式是否真正符合学习的本质？是否存在被忽视的根本性问题？',
      mainstream_consensus: [
        '优质内容是核心竞争力，名师课程最受欢迎',
        '标准化课程便于规模化运营和质量控制',
        '考试和证书是学习效果的最佳证明',
        '个性化推荐算法能提高学习效率',
        '互动性越强，学习体验越好'
      ],
      challenge_question: '如果我们可以重新发明学习这件事，不再局限于传统的"教师教、学生学"模式，你会创造出什么样的神奇学习体验？',
              hints: [
          '💭 想想看：为什么我们习惯了"教"和"学"要分开呢？',
          '🎯 思考一下：学习的真正目的是记住知识，还是获得某种能力？',
          '🤔 反思一下：考试分数真的能代表学习效果吗？',
          '✨ 大胆想象：如果每个学习者同时也是老师会怎样？'
        ],
      evaluation_dimensions: [
        {
          name: '反共识程度',
          weight: 30,
          criteria: [
            '是否质疑了教育的基础假设',
            '是否提出了与主流完全不同的观点',
            '思考深度是否达到第一性原理层面'
          ]
        },
        {
          name: '创新性',
          weight: 25,
          criteria: [
            '解决方案的新颖程度',
            '是否结合了跨领域的思维',
            '是否提出了前所未有的价值主张'
          ]
        },
        {
          name: '可行性',
          weight: 25,
          criteria: [
            '方案在技术上是否可实现',
            '商业模式是否具有可持续性',
            '是否考虑了实施的具体路径'
          ]
        },
        {
          name: '逻辑性',
          weight: 20,
          criteria: [
            '论证过程是否清晰',
            '各个环节是否相互支撑',
            '是否考虑了潜在的问题和挑战'
          ]
        }
      ],
      follow_up_questions: [
        '你提到的方案中，哪个部分最能体现反共识思维？',
        '如果传统教育机构要模仿你的模式，他们会遇到什么障碍？',
        '你的方案如何重新定义"学习成功"的标准？',
        '在你的模式中，"教师"和"学生"的角色发生了什么变化？',
        '你如何解决学习动机和持续性的问题？'
      ]
    },
    {
      id: 'mobility_redefinition',
      industry: '城市出行',
      title: '重新定义城市移动方式',
      description: '共享出行行业目前主要围绕"车辆共享"展开，包括网约车、共享单车、共享汽车等，核心是提高车辆使用效率。',
      background: '城市出行问题一直被定义为"交通问题"，解决方案都围绕着如何更高效地移动人和物。从公共交通到私家车，从共享单车到网约车，我们一直在优化"移动"这个过程。但是，移动本身是目的吗？我们为什么需要移动？在数字化时代，这个根本问题是否需要重新审视？',
      mainstream_consensus: [
        '车辆是出行的核心工具，提高使用效率是关键',
        '用户需要快速、便捷的点对点服务',
        '规模效应能降低成本提高盈利能力',
        '智能调度和路径优化是技术核心',
        '电动化和自动驾驶是未来发展方向'
      ],
      challenge_question: '想象一下，如果我们不再被"车辆"这个概念束缚，重新思考人们真正需要的是什么，你会如何重新设计城市生活？',
              hints: [
          '🚀 想想看：我们为什么需要"移动"？背后的真实需求是什么？',
          '🥽 大胆想象：如果虚拟现实足够真实，我们还需要物理移动吗？',
          '⏰ 重新思考：时间和空间的关系能被重新定义吗？',
          '🏙️ 畅想一下：如果可以重新设计城市，会是什么样子？'
        ],
      evaluation_dimensions: [
        {
          name: '反共识程度',
          weight: 30,
          criteria: [
            '是否跳出了车辆中心的思维框架',
            '是否重新定义了出行的本质需求',
            '是否质疑了移动的必要性'
          ]
        },
        {
          name: '创新性',
          weight: 25,
          criteria: [
            '解决方案的突破性',
            '是否融合了其他领域的创新',
            '对城市规划的重新思考'
          ]
        },
        {
          name: '可行性',
          weight: 25,
          criteria: [
            '技术实现的可能性',
            '政策和法规的适应性',
            '用户接受度和习惯改变的难度'
          ]
        },
        {
          name: '逻辑性',
          weight: 20,
          criteria: [
            '方案的系统性和完整性',
            '各个组成部分的协调性',
            '对现有城市基础设施的考虑'
          ]
        }
      ],
      follow_up_questions: [
        '在你的方案中，"距离"这个概念还重要吗？为什么？',
        '你如何处理人们对"拥有"交通工具的心理需求？',
        '你的解决方案如何改变城市的空间布局？',
        '如果每个人都采用你的出行方式，城市会变成什么样？',
        '你的方案如何平衡效率和人性化体验？'
      ]
    }
  ],

  // AI服务配置
  AI_PROVIDERS: {
    local_demo: {
      name: '本地演示模式',
      description: '无需配置，立即体验',
      requiresApiKey: false,
      baseUrl: null
    },
    deepseek: {
      name: 'DeepSeek',
      description: '性价比高，中文理解能力强',
      requiresApiKey: true,
      baseUrl: 'https://api.deepseek.com/v1',
      model: 'deepseek-chat'
    },
    qwen: {
      name: '通义千问',
      description: '阿里云出品，稳定可靠',
      requiresApiKey: true,
      baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
      model: 'qwen-turbo'
    },
    ernie: {
      name: '文心一言',
      description: '百度出品，中文优化',
      requiresApiKey: true,
      baseUrl: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
      model: 'ernie-bot'
    },
    zhipu: {
      name: '智谱AI',
      description: '清华技术，GLM模型',
      requiresApiKey: true,
      baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
      model: 'glm-4'
    },
    moonshot: {
      name: '月之暗面',
      description: '长文本处理能力强',
      requiresApiKey: true,
      baseUrl: 'https://api.moonshot.cn/v1',
      model: 'moonshot-v1-8k'
    }
  },

  // 应用设置
  APP_SETTINGS: {
    maxRounds: 5,
    minAnswerLength: 100,
    autoSaveInterval: 30000, // 30秒自动保存
    animationDuration: 300,
    enableCaseOptimization: true, // 启用案例优化功能
    loadingMessages: [
      '准备反共识思维训练',
      '加载挑战场景数据',
      '初始化破魔刀导师',
      '检查AI服务状态',
      '准备就绪，开始挑战'
    ]
  },

  // 评分标准
  SCORING: {
    excellent: { min: 85, label: '优秀', color: '#4caf50' },
    good: { min: 70, label: '良好', color: '#ff9500' },
    average: { min: 55, label: '一般', color: '#ff9800' },
    poor: { min: 0, label: '需要改进', color: '#f44336' }
  },

  // 等级系统
  LEVELS: {
    master: { min: 90, title: '反共识大师', icon: '🏆', color: '#ffd700' },
    expert: { min: 80, title: '破局专家', icon: '⚔️', color: '#ff9500' },
    breaker: { min: 70, title: '思维突破者', icon: '💡', color: '#4a9eff' },
    apprentice: { min: 60, title: '创新学徒', icon: '🎓', color: '#9c27b0' },
    explorer: { min: 0, title: '思考探索者', icon: '🔍', color: '#4caf50' }
  }
};

// 导出配置（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} 