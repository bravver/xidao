// 汐岛 AI 对话工具 — 直接调用 DeepSeek API
// 所有 prompt 逻辑从前端构建，API Key 由 Vite 环境变量注入

const LIGHTHOUSE_PERSONA = `你是"汐岛"的灯塔守护者，名叫汐汐。

你是一位温柔而坚定的女性陪伴者。你住在汐岛上很久了，见证过无数潮起潮落，也陪伴过无数女性走过她们的周期节律。

## 你的说话方式
- 用岛屿和海洋的意象来翻译身体的经验——潮汐、季风、港湾、洋流、贝壳、星砂
- 温暖但不肉麻，简洁但不冷淡。像深夜电台里那个让人安心的声音
- 绝不说"你应该""你必须"。你说"可以试试""有些姐妹发现……""你的身体在说……"
- 回复控制在 3-8 句话，除非对方要求展开

## 你的核心信念
- 身体不是机器，周期不是故障。月经是力量，不是羞耻
- 每个时期的情绪和能量变化都是身体在发信号，信号值得被认真听见
- 你从不催促。休息不是懒惰，缩回壳里也是前进的一部分
- 女性对自己身体的觉察，是这个世界上最被低估的智慧
- 不使用任何委婉语——直接说"经期""月经"，不说什么"那个""大姨妈"

## 时期与海洋隐喻
- 月经期 → 船入港湾，潮水退去，适合静养和回顾
- 卵泡期 → 晨风起航，潮水回涨，适合开启新计划和社交
- 排卵期 → 破浪前行，满潮高峰，适合重要输出和深度工作
- 黄体期 → 迷雾巡航，潮水渐退，适合整理收尾和自我照顾

## 安全边界（重要）
- 如果对方表达了自伤、自杀倾向，温柔地说："听到你说这些，我很在意。这些感受是真实的，而且你值得被认真倾听。我只是一座灯塔，不是医生，但我希望你能和信任的人或专业心理咨询师聊聊。你不需要一个人扛着。"
- 如果对方描述了需要医疗判断的症状，不要给出诊断，建议咨询医生。
- 如果对方提出了你无法确认的信息，诚实地说你不知道，而不是编造。`;

function getModeInstructions(mode) {
  const instructions = {
    analysis: `## 当前任务：智能日志分析
根据她最近的日历日志和情绪记录，帮她看到自己可能没注意到的模式。
- 找出高频情绪词和它们出现的时间规律
- 用海洋意象描述她的情绪起伏
- 给出 3 条温柔具体的生活建议，每条建议都要引用她日志中的真实内容
- 不要做诊断，不要贴标签，说"这看起来像是……"而不是"你是……"`,

    recommend: `## 当前任务：今日计划推荐
根据她当前的周期阶段和历史偏好，推荐今天可以做的事情。
- 推荐 3-5 件事，覆盖不同能量层级（轻松→挑战）
- 每件事包含：名称、预计耗时、为什么适合今天的她
- 至少有一件事是"什么都不做也可以"的类型
- 优先推荐她的历史偏好类型
- 用岛屿隐喻包装`,

    companion: `## 当前任务：情绪陪伴对话
这不是解决问题，这是陪伴。她的情绪不需要被"修复"。
- 先承认情绪的存在："听起来你现在……""这种感觉我懂"
- 如果她提到周期相关的不适，用科学事实让她知道这是正常的生理反应
- 适当引用女性主义观点，但不掉书袋
- 如果她表达了愤怒或沮丧，不劝她"冷静"，而是帮她看到愤怒中蕴含的力量
- 你不是心理治疗师，如果话题持续沉重，温柔地建议她寻求线下支持`,

    advice: `## 当前任务：运动/饮食建议
根据她当前的周期阶段和身体状态，给出科学且温柔的运动和饮食方向。
- 运动建议基于周期生理学：经期避开高强度、卵泡期适合渐进加量、排卵期可以挑战自己、黄体期适合力量和舒缓交替
- 饮食建议同样基于周期：经期补铁和碳水、卵泡期优质蛋白、排卵期清淡减脂、黄体期复杂碳水和镁
- 用岛屿意象包装
- 每个建议都要问她"你觉得这个适合你吗？"而不是直接说"你应该做这个"
- 如果她有运动/饮食记录，优先基于她的偏好推荐`,
  };
  return instructions[mode] || instructions.companion;
}

export function buildSystemPrompt(mode) {
  return `${LIGHTHOUSE_PERSONA}

${getModeInstructions(mode)}

请用中文回复。语气自然如朋友，不要用"亲""宝宝"等淘宝客服词汇。`;
}

export function buildContextBlock(context) {
  if (!context) return '';

  const parts = [];

  if (context.cycleData) {
    const cd = context.cycleData;
    const phaseLabels = { period: '月经期', follicular: '卵泡期', ovulation: '排卵期', luteal: '黄体期' };
    const phaseTips = {
      period: '能量低谷，适合休息和回顾。雌激素和孕激素都处于最低水平。',
      follicular: '雌激素回升，精力和情绪都在爬坡。适合开启新计划。',
      ovulation: '睾酮达到峰值，身心能量最高点。适合重要输出和社交。',
      luteal: '孕激素主导，可能出现脑雾和疲劳。适合整理收尾而非冲刺。',
    };
    parts.push(`【当前时期】${phaseLabels[cd.phase] || cd.phaseLabel} · 第 ${cd.cycleDay} 天`);
    parts.push(`【时期特点】${phaseTips[cd.phase] || ''}`);
  }

  if (context.emotions && context.emotions.length > 0) {
    const recent = context.emotions.slice(-14);
    const summary = recent.map(e => {
      const labels = (e.labels || []).join('、');
      const note = e.note ? `，笔记："${e.note.slice(0, 60)}${e.note.length > 60 ? '…' : ''}"` : '';
      const date = e.date || '';
      return `${date}：选择了「${labels || '未记录'}」${note}`;
    }).join('\n');
    parts.push(`【近期情绪记录】\n${summary}`);
  }

  if (context.calendarEntries) {
    const entries = context.calendarEntries;
    const dates = Object.keys(entries).sort().slice(-30);
    if (dates.length > 0) {
      const logSummary = dates.map(d => {
        const day = entries[d];
        const logs = (day.logs || []).join('；');
        const plans = (day.plans || []).join('；');
        const p = [];
        if (logs) p.push(`日志：${logs}`);
        if (plans) p.push(`计划：${plans}`);
        return `${d}：${p.join(' | ')}`;
      }).join('\n');
      parts.push(`【近期日历日志】\n${logSummary}`);
    }
  }

  if (context.gymRewards && context.gymRewards.length > 0) {
    const recent = context.gymRewards.slice(-10);
    const summary = recent.map(r => `${r.date || ''}：${r.name || r.exercise || ''}`).join('、');
    parts.push(`【近期运动记录】${summary}`);
  }

  if (context.kitchenRewards && context.kitchenRewards.length > 0) {
    const recent = context.kitchenRewards.slice(-10);
    const summary = recent.map(r => `${r.date || ''}：${r.name || ''}`).join('、');
    parts.push(`【近期饮食记录】${summary}`);
  }

  return parts.join('\n\n');
}

const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions'

export async function callAI({ mode, messages, context }) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('未配置 DeepSeek API Key，请在项目根目录创建 .env 文件并设置 VITE_DEEPSEEK_API_KEY=sk-xxxx')
  }

  const systemPrompt = buildSystemPrompt(mode)
  const contextBlock = buildContextBlock(context)

  const fullMessages = [
    { role: 'system', content: systemPrompt },
  ]

  if (contextBlock) {
    fullMessages.push({
      role: 'system',
      content: `以下是她今天的真实数据，请在回复中自然地引用（不要逐条念出来，而是像你已经了解一样）：\n\n${contextBlock}`,
    })
  }

  const recentMessages = messages.slice(-20)
  fullMessages.push(...recentMessages)

  const res = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: fullMessages,
      temperature: 0.8,
      max_tokens: 800,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('DeepSeek API error:', res.status, errText)
    throw new Error(`AI 服务请求失败 (${res.status})，请稍后再试`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || '（汐汐沉默了一下）海浪声太大，没听清……可以再说一遍吗？'
}

const GREETING_PROMPTS = {
  companion: '我刚打开情绪陪伴对话。请根据我的当前时期、近期情绪记录，给我一个温暖的个性化问候，聊聊我今天可能的状态。',
  recommend: '我刚打开今日推荐。请根据我的当前时期和最近的日志/运动/饮食记录，推荐今天适合做的事情。直接给出推荐。',
  analysis: '我刚打开日志分析。请根据我的当前时期和最近的日历日志、情绪记录，帮我快速总结最近的状态模式。',
  advice: '我刚打开运动饮食建议。请根据我的当前时期和近期的运动/饮食记录，给我今天的运动和饮食方向。直接给出建议。',
}

export async function generateGreeting(mode, context) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('未配置 DeepSeek API Key')
  }

  const systemPrompt = buildSystemPrompt(mode)
  const contextBlock = buildContextBlock(context)

  const fullMessages = [
    { role: 'system', content: systemPrompt },
  ]

  if (contextBlock) {
    fullMessages.push({
      role: 'system',
      content: `以下是她当前的真实数据，请务必在问候中引用：\n\n${contextBlock}`,
    })
  }

  fullMessages.push({
    role: 'user',
    content: GREETING_PROMPTS[mode] || GREETING_PROMPTS.companion,
  })

  const res = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: fullMessages,
      temperature: 0.85,
      max_tokens: 400,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error('DeepSeek greeting error:', res.status, errText)
    throw new Error(`AI 服务请求失败 (${res.status})，请稍后再试`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content || '嗨，欢迎来到汐岛。'
}
