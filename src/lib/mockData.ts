export interface StylePreset {
  id: string;
  label: string;
  description: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  style: string;
  length: string;
  intensity: string;
  createdAt: string;
  excerpt: string;
}

export const stylePresets: StylePreset[] = [
  { id: 'slow-burn', label: 'Slow burn', description: 'Gradual tension, emotional depth' },
  { id: 'dark-romance', label: 'Dark romance', description: 'Intense, complex dynamics' },
  { id: 'playful', label: 'Playful', description: 'Light-hearted, teasing tone' },
  { id: 'poetic', label: 'Poetic', description: 'Lyrical, atmospheric prose' },
];

const mockTitles = [
  'Midnight Conversations',
  'The Art of Patience',
  'Between Shadows',
  'Velvet Hours',
  'Unspoken',
  'The Distance Between Us',
  'Stolen Moments',
  'After Hours',
  'In the Margins',
  'Quiet Reckoning',
];

const mockOpeners = [
  'The room was quiet except for the soft rustle of pages turning. She sat across from him, her attention seemingly focused on the book in her hands, but he noticed the way her eyes had stopped moving minutes ago.',
  'He found her in the studio long after midnight, surrounded by half-finished canvases and the scent of turpentine. She looked up when he entered, a streak of paint across her cheekbone, and for a moment neither of them spoke.',
  'The rain against the windows provided a rhythm to the silence between them. She poured the wine slowly, deliberately, and when she handed him the glass, their fingers touched for just a fraction longer than necessary.',
  'They had been dancing around it for weeks—the unspoken thing that hung in the air whenever they found themselves alone. Tonight, in the dim light of the hotel bar, he decided it was time to stop pretending.',
  'She appeared at his door at two in the morning, still in her evening dress, mascara slightly smudged. "I couldn\'t sleep," she said simply, as if that explained everything.',
];

const mockMiddles = [
  '\n\n"You know what you\'re doing," he said quietly, not as a question.\n\nShe set down her glass with deliberate care. "I\'ve known for a while."\n\nThe admission hung between them, charged and dangerous. He took a step closer, close enough to see the slight rise and fall of her chest, the way her pupils dilated in the low light.\n\n"And what are you going to do about it?" she asked, her voice barely above a whisper.\n\nHe reached out, his fingers grazing her jawline with a touch so light it might have been imagined. "That depends entirely on you."\n\n',
  '\n\nThey didn\'t speak as he crossed the threshold, closing the door behind him with a soft click. The space between them felt like a living thing, electric and impossible to ignore.\n\n"This is a terrible idea," she said, but she didn\'t move away.\n\n"Probably the worst," he agreed, his hand coming to rest on the small of her back.\n\nShe looked up at him, searching his face for something—hesitation, perhaps, or doubt. She found neither.\n\n',
  '\n\nHis hand found hers in the darkness, fingers intertwining with a familiarity that shouldn\'t have existed yet. She let out a breath she hadn\'t realized she\'d been holding.\n\n"We should talk about this," he said, though his thumb was tracing circles on her palm in a way that suggested talking was the last thing on his mind.\n\n"Later," she replied, and turned to face him fully.\n\nThe city lights cast shadows across his features, making him look like something from a dream—dangerous and beautiful and entirely too tempting.\n\n',
];

const mockEndings = [
  'When they finally pulled apart, breathless and slightly disheveled, she realized that nothing would be the same after tonight. And strangely, she was perfectly fine with that.\n\nHe pressed his forehead against hers, a small smile playing at his lips. "So," he murmured, "same time tomorrow?"\n\nShe laughed, the sound low and intimate in the quiet room. "Don\'t push your luck."\n\nBut they both knew he would. And she would let him.',
  'The first light of dawn was filtering through the curtains when she finally allowed herself to relax against him, her head on his chest, listening to the steady rhythm of his heartbeat.\n\n"No regrets?" he asked softly, his hand trailing up and down her spine.\n\nShe tilted her head to look at him, taking in the concern in his eyes, the vulnerability he rarely showed. "Not a single one."\n\nIt was, she realized, the truest thing she\'d said in a long time.',
  'Hours later, tangled in sheets and each other, she traced patterns on his shoulder and wondered how something so reckless could feel so right.\n\n"What are you thinking?" he asked, his voice rough with exhaustion.\n\n"That this complicates everything," she admitted.\n\nHe caught her hand, brought it to his lips. "Good. I\'m tired of simple."\n\nShe smiled against his skin, already knowing that whatever came next, they would face it together. The fear and uncertainty could wait until morning.\n\nFor now, this was enough.',
];

export const generateMockStory = (
  _style: string,
  length: string,
  _intensity: string
): { title: string; content: string } => {
  const title = mockTitles[Math.floor(Math.random() * mockTitles.length)];
  const opener = mockOpeners[Math.floor(Math.random() * mockOpeners.length)];
  const middle = mockMiddles[Math.floor(Math.random() * mockMiddles.length)];
  const ending = mockEndings[Math.floor(Math.random() * mockEndings.length)];

  let content = opener;

  if (length === 'medium' || length === 'chapter') {
    content += middle;
  }

  if (length === 'chapter') {
    content += '\n\nThe night stretched on, filled with whispered confessions and touches that spoke louder than words. They explored the boundaries they\'d been so careful to maintain, finding pleasure in the breaking of their own rules.\n\n';
  }

  content += ending;

  return { title, content };
};

export const initialStories: Story[] = [
  {
    id: '1',
    title: 'The Library Encounter',
    content: 'The reference section was always deserted after nine...',
    style: 'Slow burn',
    length: 'Medium',
    intensity: 'Tasteful',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    excerpt: 'The reference section was always deserted after nine, which was precisely why she chose it for her late-night study sessions...',
  },
  {
    id: '2',
    title: 'Rainy Afternoon',
    content: 'The storm had trapped them together...',
    style: 'Playful',
    length: 'Short',
    intensity: 'Spicy',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    excerpt: 'The storm had trapped them together in the countryside cabin, and the electricity had been out for hours...',
  },
];
