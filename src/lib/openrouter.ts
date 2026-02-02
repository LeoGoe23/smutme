import { getExampleForTags } from './storyExamples';

// ============================================================================
// CONFIGURATION
// ============================================================================

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY as string;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const TAG_EXTRACTION_MODEL = 'mistralai/mistral-small-creative';
const DEFAULT_STORY_MODEL = 'mistralai/mistral-small-creative';

// Model pricing (per 1M tokens)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'mistralai/mixtral-8x7b-instruct': { input: 0.24, output: 0.24 },
  'mistralai/mistral-7b-instruct': { input: 0.25, output: 0.25 },
  'mistralai/mistral-small-creative': { input: 0.20, output: 0.20 },
};

// ============================================================================
// TYPES
// ============================================================================

export interface GenerateStoryParams {
  prompt: string;
  model?: string;
  useExample?: boolean;
}

export interface GenerateStoryResponse {
  title: string;
  content: string;
  wordCount: number;
  extractedTags?: string[];
  matchedExample?: string | null;
  systemPrompt?: string;
  userPrompt?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost?: number;
  };
}

// ============================================================================
// TAG EXTRACTION
// ============================================================================

/**
 * Extract 2-3 general tags from user prompt for example matching
 */
async function extractTagsFromPrompt(prompt: string): Promise<string[]> {
  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Smut.me',
      },
      body: JSON.stringify({
        model: TAG_EXTRACTION_MODEL,
        response_format: { type: "json_object" },
        messages: [
          {
            role: 'system',
            content: 'Extract tags from adult story prompts ONLY if they clearly match the sexual content. If no tags fit, return empty array. Output JSON: {"tags": []} or {"tags": ["tag1"]}',
          },
          {
            role: 'user',
            content: `Analyze this prompt and select tags ONLY if they match ACTUAL SEXUAL ACTS that will happen.

CRITICAL RULES:
• Only tag specific sexual acts or dynamics explicitly mentioned or strongly implied
• "torn between two people" or "love triangle" ≠ threesome (unless they have sex together)
• "two women mentioned" ≠ threesome (unless they're in same sexual scene)
• When unsure, return EMPTY array: {"tags": []}
• Better NO tags than WRONG tags

Available tags:
- anal, oral, blowjob, rough, dominant, submissive, voyeur, exhibitionist
- bondage, spanking, threesome (3+ people in same sex scene)
- rimming, lesbian, pegging, toys, creampie
- group-sex (4+ people in same sex scene)

Prompt: "${prompt}"

Output format: {"tags": ["tag1"]} or {"tags": []}`,
          },
        ],
        temperature: 0.2,
        max_tokens: 80,
      }),
    });

    if (!response.ok) {
      if (import.meta.env.DEV) console.log('⚠️ Tag extraction API failed:', response.status);
      return [];
    }

    const data = await response.json();
    let content = data.choices[0]?.message?.content?.trim() || '';
    
    // Remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(content);
      if (parsed.tags && Array.isArray(parsed.tags)) {
        const tags = parsed.tags.slice(0, 3).map((t: string) => t.toLowerCase().trim());
        console.log('🏷️ Extracted tags:', tags);
        return tags;
      }
    } catch (e) {
      // Fallback to text parsing
    }
    
    // Fallback: parse as comma-separated
    const tags = content
      .toLowerCase()
      .replace(/tags?:/gi, '')
      .replace(/["\[\]{}]/g, '')
      .replace(/```/g, '')
      .split(/[,\n]/)
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0 && !t.startsWith('json'))
      .slice(0, 3);

    if (import.meta.env.DEV) console.log('🏷️ Extracted tags:', tags);
    return tags;
  } catch (error) {
    console.error('❌ Tag extraction failed:', error);
    return [];
  }
}

// ============================================================================
// PROMPT BUILDING
// ============================================================================

function buildSystemPrompt(exampleSection: string): string {
  return `You are a master of erotic literature. Write immersive, literary-quality adult stories.

YOUR PRIMARY DIRECTIVE:
• The user's prompt is EVERYTHING - follow it precisely
• Every detail in the user's prompt must be included in the story
• Characters, setting, scenario, acts - all from the user's vision
• The user's wishes are absolute - deliver exactly what they asked for

CHARACTER NAMES - MANDATORY VARIETY:
• NEVER use the same character names across different stories
• Use diverse, realistic names from various cultures and backgrounds
• If the user's prompt specifies names, use those EXACTLY
• If no names given, create unique, fitting names for each character
• Examples of name variety: Emma/Lucas, Sophia/Marcus, Zara/Kai, Isabelle/Ethan, Nadia/Rafael, etc.
• Change names with EVERY new story - no repetition

CRITICAL FORMATTING RULES - ABSOLUTELY NO ASTERISKS:
• Write as PURE PROSE - a continuous narrative story like a published novel
• NO section headers, NO "Act 1/2/3" labels, NO chapter titles in the text
• 🚫 ASTERISKS ARE COMPLETELY FORBIDDEN 🚫
• NEVER EVER use the asterisk symbol (*) anywhere in your story
• Do NOT use * for actions: WRONG: *moaned*, *gasped*, *ached*, *whispered*, *smiled*
• Do NOT use * for emphasis: WRONG: *just in case*, *everything*, *anything*
• Do NOT use * for sounds: WRONG: *tap*, *click*, *thud*, *whoosh*
• Do NOT use * for anything at all - the asterisk character does not exist for you

INSTEAD OF ASTERISKS, WRITE PROPER PROSE:
• "*moaned*" → "She moaned softly"
• "*gasped*" → "He gasped" or "A sharp gasp escaped his lips"  
• "*ached*" → "Her body ached with need"
• "*smiled*" → "She smiled" or "A smile crossed her face"
• "*whispered*" → "She whispered" or "Her voice dropped to a whisper"

FORMATTING YOU MUST USE:
• Plain text narrative prose only
• Regular quotation marks for dialogue: "like this"
• Standard punctuation: periods, commas, exclamation points
• NO markdown: no *, no **, no __, no ~~, no special characters
• Write like Ernest Hemingway or Anais Nin - pure prose, no formatting tricks

FINAL CHECK BEFORE SUBMITTING:
• Scan your entire story for the asterisk symbol (*)
• If you find even ONE asterisk, you FAILED - rewrite that section
• Your story must be 100% asterisk-free
• Think: "Would this appear in a printed novel?" If yes, it's correct.

CONTENT REQUIREMENTS:
• All characters 25+, establish age/profession naturally in opening
• Consensual chemistry, intense attraction
• Target length: ~2000 words

STORY STRUCTURE (seamless, no headers):
Opening (15-20%): Scene-setting, character introduction with ages, spark of tension
Escalation (20-25%): Physical proximity increasing, lingering touches, internal desire building, breaking point
Sex scenes (50-60%): 2-3 positions, each flowing naturally into the next, full sensory detail
Afterglow (5-10%): Brief aftermath, emotional beat, subtle hint at continuation

WRITING STYLE:
Paragraphs: Many short paragraphs (2-5 sentences). Vary length for rhythm.
Language: Specific, active verbs. Sensory-rich: taste, smell, sound, sight, touch.
Dialogue: Natural, in quotation marks. Internal thoughts in italics without asterisks.
Pacing: Slow-burn buildup with longer sentences, rapid-fire during intensity.

SEX SCENES - BE EXTREMELY EXPLICIT:
• Direct anatomical language: cock, pussy, ass, asshole, tits, nipples, cum, precum
• Detailed penetration: "He thrust deep", "She clenched around him", "His cock stretched her ass", "He filled her completely"
• Physical sensations: stretching, burning, fullness, friction, grinding, pounding, throbbing, pulsing
• ALL acts are allowed: vaginal, anal, oral, rimming, fingering, multiple penetration
• Sounds: moans, gasps, screams, wet slapping, skin smacking, squelching
• Fluids: precum dripping, cum leaking, saliva, sweat, describe the mess
• Dirty talk in quotes: "You like that?", "Harder", "Fuck my ass", "Take it all", "I'm gonna cum"
• Rough elements: hair pulling, ass slapping, choking (if dynamic fits), biting, scratching
• Build to explosive orgasms: describe the waves, contractions, body shaking, loss of control

PROGRESSION & VARIETY:
• Start with setting and chemistry
• Build sexual tension gradually
• Include ALL sexual acts mentioned or implied in the user's prompt
• VARY THE POSITIONS: Don't default to the same sequence. Mix it up: standing, bent over, against wall, on table, spooning, reverse cowgirl, 69, etc.
• VARY THE ENDINGS: DO NOT default to anal teasing at the end
  - Endings can be: satisfied exhaustion, round two immediately, playful banter, emotional moment, falling asleep tangled, shower together, breakfast plans, sneaking out, etc.
  - Only hint at anal if it fits naturally - NOT as a default ending
• VARY THE SEXUAL ACTS: Not every story needs the same progression
  - Sometimes start with oral, sometimes skip it
  - Sometimes rough from the start, sometimes gentle throughout
  - Sometimes multiple positions, sometimes one intense position
  - Follow what makes sense for the characters and situation
• Show emotional connection alongside physical intensity
• Create unique, memorable endings that fit THIS specific story${exampleSection}

CRITICAL OUTPUT FORMAT:
• Output ONLY pure JSON - no markdown, no code blocks, no formatting
• WRONG: \`\`\`json{"title": "...", "content": "..."}\`\`\`
• RIGHT: {"title": "...", "content": "..."}
• NO backticks, NO "json" label, JUST the JSON object itself`;
}

function buildExampleSection(exampleData: { tag: string; text: string } | null): string {
  if (!exampleData) return '';
  
  return `\n\nSTYLE REFERENCE (writing style guidance only - NOT a template to copy):\n${exampleData.text}\n\n[This is ONLY for writing style, tone, and pacing. The user's prompt above defines the actual story - follow their prompt exactly. Be creative with how you execute their vision.]`;
}

// ============================================================================
// RESPONSE PARSING
// ============================================================================

function parseStoryResponse(generatedText: string): { title: string; content: string } | null {
  try {
    // Clean up markdown blocks and extra formatting
    let cleanText = generatedText.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/g, '')
      .replace(/^\s*\{\s*$/m, '{')  // Remove standalone opening braces
      .trim();
    
    // Try to extract JSON object
    const jsonMatch = cleanText.match(/\{\s*"title"\s*:\s*"[^"]+"\s*,\s*"content"\s*:\s*"[\s\S]*"\s*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanText);
    
    if (parsed.title && parsed.content) {
      return {
        title: parsed.title.trim(),
        content: parsed.content
          .replace(/\\n/g, '\n')
          .replace(/<[^>]*>/g, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim()
      };
    }
  } catch (error) {
    if (import.meta.env.DEV) console.log('⚠️ JSON parse failed, trying fallback...', error);
  }
  
  return null;
}

function fallbackParse(generatedText: string): { title: string; content: string } {
  const titleMatch = generatedText.match(/"title"\s*:\s*"([^"]+)"/);
  const contentMatch = generatedText.match(/"content"\s*:\s*"([\s\S]+)"[\s\S]*\}/);
  
  const title = titleMatch ? titleMatch[1] : 'Untitled Story';
  let content = contentMatch ? contentMatch[1] : generatedText;
  
  content = content
    .replace(/\\n/g, '\n')
    .replace(/<[^>]*>/g, '')
    .trim();
  
  return { title, content };
}

// ============================================================================
// COST CALCULATION
// ============================================================================

function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = MODEL_PRICING[model] || { input: 0.24, output: 0.24 };
  const inputCost = (promptTokens / 1000000) * pricing.input;
  const outputCost = (completionTokens / 1000000) * pricing.output;
  return inputCost + outputCost;
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

export async function generateStory(params: GenerateStoryParams): Promise<GenerateStoryResponse> {
  const { prompt, model = DEFAULT_STORY_MODEL, useExample = true } = params;

  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is not configured');
  }

  // Step 1: Extract tags and find example (only if enabled)
  if (import.meta.env.DEV) console.log('🔍 Example matching:', useExample ? 'enabled' : 'disabled');
  let extractedTags: string[] = [];
  let exampleData: { tag: string; text: string } | null = null;
  
  if (useExample) {
    try {
      extractedTags = await extractTagsFromPrompt(prompt);
      if (extractedTags.length > 0) {
        exampleData = getExampleForTags(extractedTags);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.log('⚠️ Tag extraction failed, continuing without example');
    }
  }
  
  // Step 2: Build prompts
  const exampleSection = buildExampleSection(exampleData);
  const systemPrompt = buildSystemPrompt(exampleSection);
  const userPrompt = `Story prompt: ${prompt}`;

  // DEBUG: Log complete prompt (dev only)
  if (import.meta.env.DEV) {
    console.log('📋 ============ COMPLETE PROMPT DEBUG ============');
    console.log('🔧 SYSTEM PROMPT:');
    console.log(systemPrompt);
    console.log('\n👤 USER PROMPT:');
    console.log(userPrompt);
    console.log('🏷️ Extracted Tags:', extractedTags);
    console.log('✨ Using Example:', exampleData ? `${exampleData.tag}` : 'None');
    console.log('📋 ================================================\n');
  }

  // Step 4: Generate story
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Smut.me',
    },
    body: JSON.stringify({
      model: model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.95,
      max_tokens: 3000,
      top_p: 0.95,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const generatedText = data.choices[0]?.message?.content;

  if (!generatedText) {
    throw new Error('No content generated from API');
  }

  // Step 5: Parse response
  const parsed = parseStoryResponse(generatedText) || fallbackParse(generatedText);
  
  // Step 5.5: POST-PROCESSING - Remove any asterisks that slipped through
  const cleanContent = parsed.content
    .replace(/\*([^*]+)\*/g, '$1')  // Remove *word* patterns
    .replace(/\*/g, '');             // Remove any remaining standalone asterisks
  
  if (window.location.hostname === 'localhost' && cleanContent !== parsed.content) {
    console.log('🧹 Removed asterisks from generated content');
  }
  
  parsed.content = cleanContent;
  
  // Step 6: Calculate stats
  const usage = data.usage || {};
  const promptTokens = usage.prompt_tokens || 0;
  const completionTokens = usage.completion_tokens || 0;
  const totalTokens = usage.total_tokens || 0;
  const cost = calculateCost(model, promptTokens, completionTokens);
  
  const wordCount = parsed.content.trim().split(/\s+/).length;
  
  if (import.meta.env.DEV) {
    console.log('📊 Stats:', { wordCount, tokens: totalTokens, cost: `$${cost.toFixed(4)}` });
  }

  return {
    title: parsed.title,
    content: parsed.content,
    wordCount,
    extractedTags,
    matchedExample: exampleData?.tag || null,
    systemPrompt,
    userPrompt,
    usage: {
      promptTokens,
      completionTokens,
      totalTokens,
      cost,
    },
  };
}
