const quotes = [
  { text: '一个人能使自己成为自己，比什么都重要。', author: '弗吉尼亚·伍尔夫' },
  { text: '我们不仅仅是生育的工具，我们是完整的人。', author: '西蒙娜·德·波伏娃' },
  { text: '女性是她们自己的太阳，不需要借助别人的光芒。', author: '张桂梅' },
  { text: '我生来就是高山而非溪流，我欲于群峰之巅俯视平庸的沟壑。', author: '张桂梅' },
  { text: '你不必成为别人，你只需要成为最好的自己。', author: '上野千鹤子' },
  { text: '女权主义不是让女性变得更强，而是让女性的力量被看见。', author: '上野千鹤子' },
  { text: '没有天生的女人，女人是被塑造的。但我们也可以重塑自己。', author: '西蒙娜·德·波伏娃' },
  { text: '我们需要夺回关于我们自己身体的话语权。', author: '格洛丽亚·斯泰纳姆' },
  { text: '一个女人的故事，就是全人类的故事。', author: '格洛丽亚·斯泰纳姆' },
  { text: '我就是我的作品中那个行走的、活着的、呼吸着的女性。', author: '弗里达·卡罗' },
  { text: '不要温顺地走入那个良夜。愤怒，愤怒于光明的消逝。', author: '狄兰·托马斯' },
  { text: '你的身体是你自己的，你的选择是你自己的。', author: '玛格丽特·阿特伍德' },
  { text: '自由不是为了逃避什么，而是为了选择什么。', author: '托妮·莫里森' },
  { text: '如果妳想飞，就要丢掉那些阻碍妳的一切。', author: '托妮·莫里森' },
  { text: '我们都是不同的，但这正是我们的力量所在。', author: '奥德雷·洛德' },
  { text: '自我关怀不是放纵，而是一种生存策略。', author: '奥德雷·洛德' },
  { text: '妳不必为自己的愤怒道歉。愤怒是边界被侵犯的信号。', author: '丽贝卡·特雷斯特' },
  { text: '每个月的那几天，不是弱点，是妳与生命节律的连接。', author: '佚名' },
  { text: '照顾好自己的身体，它是妳灵魂的居所。', author: '佚名' },
  { text: '妳不是情绪化的，妳是敏锐的。妳不是脆弱的，妳是柔软的。', author: '佚名' },
  { text: '我们无法都成为伟人，但我们可以成为有力量的自己。', author: '鲁迅' },
  { text: '女性的天空是低的，羽翼是稀薄的，但我们要飞。', author: '萧红' },
  { text: '我终于感到，我们之间的全部通信，只是一个大大的幻影。我们每个人只是在给自己写信。', author: '张爱玲' },
  { text: '一个人应该活得是自己并且干净。', author: '顾城' },
  { text: '世界以痛吻我，要我报之以歌。', author: '泰戈尔' },
  { text: '风可以吹起一大张白纸，却无法吹走一只蝴蝶，因为生命的力量在于不顺从。', author: '冯骥才' },
  { text: '好的木材并不在顺境中生长，风越强，树越壮。', author: '威拉·凯瑟' },
  { text: '每个女人都是自己故事的主角，而不是别人故事中的配角。', author: '佚名' },
  { text: '你的价值不在于你的生产力，你本身就有价值。', author: '佚名' },
  { text: '我们站着，我们呼吸，我们存在。这就已经足够了。', author: '佚名' },
  { text: '不完整的自己，也值得被完整地爱着。', author: '佚名' },
]

let lastIndex = -1

export function getRandomQuote() {
  let index
  do {
    index = Math.floor(Math.random() * quotes.length)
  } while (index === lastIndex && quotes.length > 1)
  lastIndex = index
  return quotes[index]
}

export function getTodayQuote() {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  return quotes[dayOfYear % quotes.length]
}

export default quotes
