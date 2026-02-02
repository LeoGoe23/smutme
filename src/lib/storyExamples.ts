// Story examples for prompt engineering - localStorage-based system
// Examples.tsx manages snippets, Generator reads from localStorage

export interface StorySnippet {
  text: string; // 300-500 word example showing writing style
}

export const STORAGE_KEY = 'smut-tag-examples';

// Initial examples (only used to seed localStorage on first load)
const TAG_EXAMPLES: Record<string, StorySnippet[]> = {
  anal: [
    {
      text: `He pressed closer, his hands sliding down to grip her hips. "Are you sure?" he murmured against her ear. She nodded, her breath catching. "I want this. I want you."
      
He reached for the bottle on the nightstand, slicking his fingers. The first touch made her tense, then relax as he worked her slowly, carefully, his other hand stroking her hip. "That's it," he whispered. "Just breathe."

When he finally pressed inside, the burn gave way to fullness, a pressure that made her gasp. He moved slowly, letting her adjust, his cock stretching her inch by inch. "Fuck," he groaned. "You're so tight."

She clutched the sheets, her body trembling as he found a rhythm. Each thrust sent sparks through her, the sensation overwhelming, intense, unlike anything she'd felt before.`,
    },
  ],
  
  oral: [
    {
      text: `She dropped to her knees, her eyes locked on his as she reached for his belt. The metal buckle clicked open, and his cock sprang free, hard and already glistening at the tip. She licked her lips.

"You don't have to—" he started, but she cut him off, wrapping her hand around his shaft.

"I want to," she said, and took him into her mouth.

He groaned, his hand tangling in her hair as she worked him with her tongue, circling the head before taking him deeper. She hollowed her cheeks, sucking hard, and he bucked against her. "Fuck, just like that."

She picked up the pace, her hand pumping what her mouth couldn't reach, her tongue tracing the thick vein on the underside of his cock. His breathing grew ragged, his thighs tensing beneath her hands.`,
    },
  ],
  
  rough: [
    {
      text: `He slammed her against the wall, his mouth crushing hers in a bruising kiss. His hands were everywhere—yanking her shirt up, gripping her ass, digging into her hips hard enough to leave marks.

"You've been teasing me all night," he growled, spinning her around and pressing her cheek against the cold surface. His hand tangled in her hair, pulling her head back. "Now you're going to take it."

He shoved her skirt up, tearing her panties aside with a sharp rip. There was no gentleness, no slow buildup—just the thick head of his cock pressing against her entrance before he thrust in hard and deep.

She cried out, her nails scraping against the wall as he set a brutal pace. Each slam of his hips drove her forward, the sound of skin slapping against skin filling the room.`,
    },
  ],
  
  dominant: [
    {
      text: `"On your knees," he ordered, his voice low and commanding. She obeyed without hesitation, sinking down before him, her eyes lifted to meet his.

"Good girl," he murmured, his hand cupping her chin. "Now open your mouth."

She parted her lips, and he slid his thumb past them, pressing down on her tongue. "You're going to do exactly what I tell you. Understand?"

She nodded, her pulse racing. He withdrew his thumb, replacing it with his cock. "Hands behind your back."

She clasped her hands together, letting him control the pace. He gripped her hair, guiding her movements, watching her with dark, hungry eyes. "That's it. Take it all."`,
    },
  ],
  
  submissive: [
    {
      text: `"Please," she whispered, her voice breaking. "I need you."

He traced a finger down her spine, watching her shiver. "Need me to what?"

"Touch me. Fuck me. Anything." Her hands were tied above her head, her body laid bare before him, completely at his mercy.

He leaned down, his lips brushing her ear. "You'll get what I give you. When I decide you've earned it."

She whimpered, arching toward him, desperate for contact. He trailed kisses down her body, taking his time, making her wait. When he finally touched her where she needed him most, she gasped, her body jerking against the restraints.

"Good girl," he murmured. "Now beg for it."`,
    },
  ],
  
  voyeur: [
    {
      text: `He shouldn't be watching. But he couldn't look away.

Through the crack in the door, he could see them—her bent over the desk, her skirt bunched around her waist, his hands gripping her hips. The sound of their moans, the rhythmic slap of skin on skin, made his cock throb.

She turned her head, and for one heart-stopping moment, her eyes met his through the gap. She didn't look surprised. She looked thrilled.

She bit her lip, her gaze holding his as the man behind her thrust harder. "Someone's watching," she gasped, and the man growled, his pace quickening.

He should leave. He should walk away. But his hand was already on his belt, his breath coming faster as he watched them fuck.`,
    },
  ],
  
  exhibitionist: [
    {
      text: `"Right here?" she asked, glancing at the darkened windows of the building across the street. "Someone could see."

He pressed her against the floor-to-ceiling glass, his hands sliding up her thighs. "That's the point."

She shivered, arousal and adrenaline flooding her veins. The city sprawled below them, lights twinkling, and somewhere out there, someone might be looking up.

He hiked her dress up, his fingers finding her already wet. "You like this," he murmured. "The idea of being seen."

She moaned, pressing back against him as he freed his cock. The cold glass against her palms contrasted with the heat of his body behind her. When he pushed inside, she gasped, her breath fogging the window.

"Wave at them," he commanded, thrusting deep.`,
    },
  ],
  
  bondage: [
    {
      text: `The ropes bit into her wrists, holding her arms above her head. She pulled against them experimentally, feeling the restraint, the helplessness, and her pulse quickened.

"Too tight?" he asked, his fingers trailing over the knots.

"No," she breathed. "Perfect."

He smiled, stepping back to admire his work. Her body was on display, tied and vulnerable, completely under his control. He picked up a silk scarf, folding it over her eyes.

Darkness enveloped her, and every sensation magnified. She heard him move around her, felt the whisper of his breath, the brush of his fingertips. Then nothing.

She waited, trembling with anticipation. When his mouth finally closed over her nipple, she cried out, arching into the touch.`,
    },
  ],
  
  spanking: [
    {
      text: `"You've been a bad girl," he said, settling onto the edge of the bed. "Come here."

She approached slowly, her heart racing. He guided her over his lap, his hand rubbing circles on her ass over her thin panties.

"Count them," he ordered. "And say thank you."

The first smack came hard and fast, the sharp sting spreading heat across her skin. "One. Thank you."

Another, on the other cheek. "Two. Thank you."

By the fifth, she was squirming, the pain bleeding into pleasure. By the tenth, she was moaning, her hips grinding against his thigh. He slipped his hand between her legs, finding her dripping wet.

"You love this, don't you?" He delivered another hard slap, making her gasp.`,
    },
  ],
  
  threesome: [
    {
      text: `She was caught between them—his chest against her back, his cock pressing inside her from behind, while she faced the other man, taking him into her mouth. The sensation was overwhelming, being filled at both ends, pleasured from every angle.

Hands were everywhere—gripping her hips, tangling in her hair, cupping her breasts. She couldn't tell whose touch was whose anymore, and she didn't care. She was drowning in sensation, lost in the heat and pressure and rhythm.

"Fuck, she feels incredible," one groaned. The other pulled her hair gently, guiding her movements. "Look at you, taking us both so perfectly."

She moaned around the cock in her mouth, her body trembling as they found their rhythm together, moving in sync.`,
    },
  ],
  
  blowjob: [
    {
      text: `She knelt before him, her hands sliding up his thighs as she looked up through her lashes. "I've been wanting to do this all night," she whispered, her fingers working his belt.

His cock sprang free, hard and thick, and she wrapped her hand around the base. She licked a slow stripe up the underside, feeling him shudder. Then she took him into her mouth, her lips stretching around his girth.

"Fuck," he groaned, his hand tangling in her hair. She sucked hard, her tongue swirling around the head before taking him deeper. She relaxed her throat, letting him slide in until her nose pressed against his pelvis.

She pulled back, gasping for air, then dove back down, setting a steady rhythm. Her hand pumped what her mouth couldn't reach, and she could feel him getting closer, his thighs tensing beneath her palms.`,
    },
  ],
  
  rimming: [
    {
      text: `"Turn over," she commanded, her voice husky. He obeyed, settling onto his stomach, and she ran her hands over his back, down to his ass.

She spread him open gently, and he tensed. "Relax," she murmured. "Trust me."

The first touch of her tongue made him gasp. She licked a slow circle, teasing, before pressing in with the tip of her tongue. He moaned into the pillow, his fists clenching the sheets.

She worked him with her mouth, her tongue delving deeper, her hands gripping his cheeks. The sensation was intense, taboo, and utterly intoxicating. His cock was rock hard beneath him, and when she reached around to stroke him, he nearly came on the spot.`,
    },
  ],
  
  lesbian: [
    {
      text: `Their lips met in a heated kiss, soft and demanding all at once. Her hands cupped the other woman's face, pulling her closer, deepening the kiss. They stumbled toward the bed, clothes falling away in a trail behind them.

She pushed her lover onto the mattress, crawling over her, their bare skin pressing together. "You're so beautiful," she whispered, trailing kisses down her neck, her collarbone, between her breasts.

She took a nipple into her mouth, sucking hard, and the woman beneath her arched, moaning. Her hand slid down, fingers finding slick heat. She circled her clit, feeling her lover's hips buck against her hand.

"Please," the woman gasped. She slid two fingers inside, curling them just right, and captured her lover's mouth in another kiss as she worked her toward climax.`,
    },
  ],
  
  pegging: [
    {
      text: `She secured the harness around her hips, adjusting the dildo. He watched from the bed, nervous and aroused in equal measure. "You ready?" she asked, her voice gentle.

He nodded, turning onto his hands and knees. She poured lube generously, slicking the toy, then pressed a finger inside him first, working him open. He groaned, pushing back against her hand.

When she finally pressed the head of the toy against his entrance, he took a deep breath. She pushed in slowly, inch by inch, watching his reactions. "That's it," she encouraged. "You're doing so good."

Once she was fully seated, she started to move, finding a rhythm. His cock was hard and leaking beneath him, and when she reached around to stroke him, he moaned her name, lost in the overwhelming sensation.`,
    },
  ],
  
  toys: [
    {
      text: `She pulled the vibrator from the drawer, turning it on. The low hum filled the room. "Let me show you something," she said, her eyes dark with desire.

She pressed it against her clit, gasping at the immediate pleasure. He watched, transfixed, as she worked herself with the toy, her hips rolling, her free hand cupping her breast.

"Come here," she breathed. He moved closer, and she guided his hand to the vibrator. "Use it on me."

He took control, varying the pressure and speed, watching her reactions. When he slid it inside her while his thumb worked her clit, she cried out, her body arching off the bed. He added his mouth to her nipple, and she shattered, coming hard around the toy.`,
    },
  ],
  
  creampie: [
    {
      text: `"I want to feel you," she whispered, wrapping her legs around his waist. "All of you. No barriers."

He groaned, his cock throbbing at her words. "Are you sure?"

"Yes. I want you to come inside me."

He pushed into her bare, and the sensation was overwhelming—wet heat, nothing between them. He set a steady pace, building toward his release. She clenched around him, urging him on.

"That's it," she gasped. "Fill me up."

With a final thrust, he came, spilling inside her. She could feel the warmth spreading, the pulse of his cock as he emptied himself. He collapsed against her, both of them breathing hard, their bodies still connected.`,
    },
  ],
  
  "group-sex": [
    {
      text: `There were hands everywhere—so many she couldn't count. Someone's mouth on her breast, another between her legs, fingers inside her, a cock pressing against her lips.

She was the center of attention, surrounded by bodies, each one eager to pleasure her. She took one man into her mouth while another slid into her from behind. A woman kissed her neck, her hand replacing the mouth at her breast.

The sensations overwhelmed her—pleasure from every angle, every touch building on the last. She was lost in it, drowning in the heat and friction and rhythm of multiple bodies moving together.

Someone groaned that they were close. Then another. The sounds of pleasure surrounded her, echoing her own moans, creating a symphony of desire.`,
    },
  ],
};

/**
 * Get snippets from localStorage (falls back to hardcoded TAG_EXAMPLES if empty)
 */
function getStoredExamples(): Record<string, StorySnippet[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load examples from localStorage:', e);
  }
  return TAG_EXAMPLES; // Fallback to hardcoded
}

/**
 * Initialize localStorage with hardcoded examples (only if empty)
 */
export function initializeExamples(): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(TAG_EXAMPLES));
    console.log('✅ Initialized localStorage with default examples');
  }
}

/**
 * Get a random example snippet for a specific tag (reads from localStorage)
 */
export function getRandomExampleForTag(tag: string): string | null {
  const allExamples = getStoredExamples();
  const examples = allExamples[tag.toLowerCase()];
  if (!examples || examples.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * examples.length);
  return examples[randomIndex].text;
}

/**
 * Get example based on extracted tags (prioritize sexual acts over dynamics)
 * Reads from localStorage
 */
export function getExampleForTags(tags: string[]): { tag: string; text: string } | null {
  if (tags.length === 0) return null;
  
  // Priority order: sexual acts first, then dynamics
  const priorityTags = ['anal', 'blowjob', 'rimming', 'pegging', 'oral', 'bondage', 'spanking', 'threesome', 'group-sex', 'lesbian', 'creampie'];
  
  // Check priority tags first
  for (const tag of tags) {
    if (priorityTags.includes(tag.toLowerCase())) {
      const example = getRandomExampleForTag(tag);
      if (example) {
        console.log(`✅ Using example for priority tag: ${tag}`);
        return { tag, text: example };
      }
    }
  }
  
  // Fall back to any matching tag
  for (const tag of tags) {
    const example = getRandomExampleForTag(tag);
    if (example) {
      console.log(`✅ Using example for tag: ${tag}`);
      return { tag, text: example };
    }
  }
  
  console.log('⚠️ No examples available for tags:', tags);
  return null;
}
