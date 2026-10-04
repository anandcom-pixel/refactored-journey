/**
 * AI App Discovery & Research Service
 * Integrates with Google Gemini API to dynamically discover, evaluate,
 * and curate top real-world AI applications based on custom user requirements.
 * Includes a rich real-world catalog fallback so it works instantly even without an API key.
 */

// Curated high-impact real-world AI applications catalog
export const CURATED_AI_APPS = [
  // Coding & Developer Tools
  {
    id: 'ai-cursor',
    name: 'Cursor',
    url: 'https://www.cursor.com',
    category: 'Coding',
    tagline: 'The AI-first Code Editor built on VS Code',
    overview: 'An advanced code editor fork of VS Code with deeply integrated AI models (Claude 3.7 Sonnet, GPT-4o). Features Composer for multi-file generation, codebase indexing, and terminal execution.',
    keyFeatures: ['Multi-file editing via Composer', 'Full codebase context understanding', 'Terminal command generation', 'Predictive line completions'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free tier with 2,000 completions; Pro at $20/month with unlimited fast requests',
    whyItFits: 'Best-in-class developer editor for writing, refactoring, and orchestrating full codebase changes with instant context.',
    badge: 'Industry Standard',
    bestFor: 'Fullstack developers & software engineers',
    tags: ['coding', 'ide', 'developer', 'claude', 'composer', 'refactor']
  },
  {
    id: 'ai-v0',
    name: 'v0 by Vercel',
    url: 'https://v0.dev',
    category: 'Coding',
    tagline: 'Generative UI and React component builder',
    overview: 'A generative UI tool by Vercel that turns natural language prompts into production-ready React, Tailwind CSS, and shadcn/ui code ready to copy-paste or install via CLI.',
    keyFeatures: ['Tailwind CSS & shadcn/ui native', 'Interactive code sandbox preview', 'One-click copy or npx installation', 'Figma-to-code iteration'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free tier with monthly generation credits; Premium from $20/month',
    whyItFits: 'Ideal for rapidly scaffolding beautiful web interfaces, dashboards, and landing pages with clean frontend code.',
    badge: 'Top Pick',
    bestFor: 'Frontend developers & UI designers',
    tags: ['coding', 'frontend', 'react', 'tailwind', 'ui', 'components']
  },
  {
    id: 'ai-bolt',
    name: 'Bolt.new',
    url: 'https://bolt.new',
    category: 'Coding',
    tagline: 'Fullstack web application builder in the browser',
    overview: 'An AI-powered development sandbox running WebContainers in your browser. Generates, runs, and deploys fullstack Node.js, React, Next.js, and Vite apps from simple prompts.',
    keyFeatures: ['Runs entire Node environment in browser', 'Live dev server with instant HMR', 'One-click Netlify/Vercel deploy', 'Fullstack backend & frontend generation'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free tier with daily tokens; Pro from $20/month with higher token allowances',
    whyItFits: 'Perfect for prototyping complete, working fullstack applications in minutes without local environment setup.',
    badge: 'Trending',
    bestFor: 'Rapid prototyping & indie hackers',
    tags: ['coding', 'fullstack', 'webcontainers', 'node', 'deploy', 'prototype']
  },
  {
    id: 'ai-lovable',
    name: 'Lovable.dev',
    url: 'https://lovable.dev',
    category: 'Coding',
    tagline: 'AI engineer that builds software from idea to production',
    overview: 'An autonomous software engineering platform that creates production-grade web applications, manages GitHub repositories, installs packages, and connects Supabase backends.',
    keyFeatures: ['Direct GitHub integration & commits', 'Automatic Supabase database wiring', 'Visual live app editor', 'Custom domain publishing'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free trial tier; Starter from $20/month for active development',
    whyItFits: 'Great for entrepreneurs and product teams wanting to turn PRDs or specs into deployed fullstack apps.',
    badge: 'Top Pick',
    bestFor: 'Product managers & founders',
    tags: ['coding', 'autonomous', 'github', 'supabase', 'indie', 'saas']
  },

  // Image Generation
  {
    id: 'ai-midjourney',
    name: 'Midjourney',
    url: 'https://www.midjourney.com',
    category: 'Image Generation',
    tagline: 'Highest fidelity photorealistic and artistic AI imagery',
    overview: 'The industry-leading AI text-to-image generator known for cinematic lighting, photorealism, artistic textures, and intricate compositions. Available via web interface and Discord.',
    keyFeatures: ['Unrivaled photorealism & lighting', 'Web creation interface with inpainting', 'Style reference & character consistency', 'High-resolution upscaling'],
    pricingTier: 'Paid',
    pricingDetails: 'Plans start at $10/month (Basic) to $30/month (Standard with unlimited relaxed)',
    whyItFits: 'Unbeatable when visual aesthetics, artistic mastery, or lifelike lighting and photorealism are paramount.',
    badge: 'Industry Standard',
    bestFor: 'Creative directors, artists & marketing teams',
    tags: ['image', 'art', 'photorealism', 'rendering', 'creative', 'graphics']
  },
  {
    id: 'ai-flux',
    name: 'FLUX.1 by Black Forest Labs',
    url: 'https://blackforestlabs.ai',
    category: 'Image Generation',
    tagline: 'State-of-the-art open weights image synthesis model',
    overview: 'Created by the original team behind Stable Diffusion. Offers top-tier text rendering within images, anatomy adherence, and prompt accuracy. Available via open weights (Schnell/Dev) and API (Pro).',
    keyFeatures: ['Crisp, readable text in images', 'Accurate human anatomy and hands', 'Open weights for local running', 'Lightning-fast inference speeds'],
    pricingTier: 'Freemium',
    pricingDetails: 'Open-source weights are free; Cloud API from ~$0.03/image',
    whyItFits: 'Best choice for posters, signage, logos, or packaging designs where accurate embedded typography is required.',
    badge: 'Open Source',
    bestFor: 'Designers requiring legible typography & local generation',
    tags: ['image', 'text-rendering', 'open-weights', 'flux', 'graphics', 'posters']
  },
  {
    id: 'ai-ideogram',
    name: 'Ideogram 2.0',
    url: 'https://ideogram.ai',
    category: 'Image Generation',
    tagline: 'AI design and typography generator for graphic designers',
    overview: 'Specialized image generator renowned for flawless typographic integration, graphic design layouts, stickers, t-shirt prints, and clean vector-style illustrations.',
    keyFeatures: ['Precise typography rendering', 'Color palette control', 'Aspect ratio flexibility', 'Graphic design & illustration styles'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free tier with 10 slow credits/day; Basic plan from $8/month; Plus from $20/month',
    whyItFits: 'Ideal for branding, logo ideas, merchandise prints, and social graphics needing crisp text placement.',
    badge: 'Top Pick',
    bestFor: 'Graphic designers & merchandise creators',
    tags: ['image', 'typography', 'logo', 'design', 'stickers', 'branding']
  },
  {
    id: 'ai-recraft',
    name: 'Recraft.ai',
    url: 'https://www.recraft.ai',
    category: 'Image Generation',
    tagline: 'Infinite canvas vector graphics and 3D illustration generator',
    overview: 'A design-centric AI tool that generates true vector graphics (SVG), 3D isometric icons, brand style sets, and clean UI illustrations directly on an infinite canvas.',
    keyFeatures: ['True SVG vector exports', 'Brand style consistency palettes', 'Infinite canvas workflow', 'Vector background remover & inpainting'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free plan with daily credits; Pro plan at $20/month for commercial privacy & speed',
    whyItFits: 'Essential for digital designers needing scalable vector art, app icons, and cohesive brand design systems.',
    badge: 'Best for Vector',
    bestFor: 'UI/UX designers & brand illustrators',
    tags: ['image', 'vector', 'svg', 'icons', 'design-system', 'canvas']
  },

  // Video Creation
  {
    id: 'ai-runway',
    name: 'Runway Gen-3 Alpha',
    url: 'https://runwayml.com',
    category: 'Video Creation',
    tagline: 'Cinematic AI video generation and camera motion control',
    overview: 'Leading generative video platform for filmmakers and animators. Produces high-definition video clips from text or reference images with precise camera motion and temporal consistency.',
    keyFeatures: ['Text-to-video & image-to-video', 'Director mode with camera controls', 'Motion brush for targeted animation', 'Lip sync and audio integration'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free tier with 125 credits; Standard plan at $15/month; Pro at $35/month',
    whyItFits: 'The gold standard for cinematic B-roll, commercial video concepts, and dramatic camera pans.',
    badge: 'Industry Standard',
    bestFor: 'Video editors, filmmakers & creative agencies',
    tags: ['video', 'cinematic', 'animation', 'camera-control', 'film', 'b-roll']
  },
  {
    id: 'ai-luma',
    name: 'Luma Dream Machine',
    url: 'https://lumalabs.ai/dream-machine',
    category: 'Video Creation',
    tagline: 'High-speed realistic video generation with dynamic physics',
    overview: 'A fast, high-quality video model capable of creating smooth, 5-second realistic video clips with believable real-world physics, camera tracking, and character movement.',
    keyFeatures: ['Rapid rendering speed', 'Smooth real-world physics simulation', 'Keyframing and clip extension', 'High visual fidelity'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free tier with 30 generations/month; Standard at $29.99/month',
    whyItFits: 'Great for rapid video conceptualization, physics-based simulations, and quick social media video loops.',
    badge: 'Trending',
    bestFor: 'Social media creators & motion designers',
    tags: ['video', 'physics', 'fast', 'realistic', 'loop', 'social-media']
  },
  {
    id: 'ai-heygen',
    name: 'HeyGen',
    url: 'https://www.heygen.com',
    category: 'Video Creation',
    tagline: 'AI video generation with realistic digital avatars and translation',
    overview: 'Enterprise AI video platform that converts text scripts into talking-head videos using lifelike digital avatars, natural voice clones, and video translation with matching lip sync.',
    keyFeatures: ['Studio-grade avatar creation', 'Video translation with automatic lip sync', 'Screen recorder integration', 'Brand kit customization'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free 1-credit trial; Creator plan from $29/month; Team plans available',
    whyItFits: 'Best tool for training videos, sales pitches, multilingual customer onboarding, and scalable spokesperson content.',
    badge: 'Top Pick',
    bestFor: 'Sales teams, educators & corporate training',
    tags: ['video', 'avatar', 'spokesperson', 'translation', 'lip-sync', 'training']
  },

  // Productivity & Workflow
  {
    id: 'ai-notion',
    name: 'Notion AI',
    url: 'https://www.notion.so',
    category: 'Productivity',
    tagline: 'Connected workspace AI for docs, wikis, and project management',
    overview: 'Embedded workspace intelligence that searches across your entire company wiki, drafts documents, extracts action items from meeting notes, and automates database workflows.',
    keyFeatures: ['Q&A across workspace docs & databases', 'Auto-fill database properties with AI', 'Instant meeting summary generation', 'Document translation and tone editing'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free Notion plan; Notion AI add-on is $8-$10/user/month',
    whyItFits: 'Transforms disorganized notes and docs into an interactive knowledge base with automated synthesis.',
    badge: 'Industry Standard',
    bestFor: 'Knowledge workers, startups & remote teams',
    tags: ['productivity', 'workspace', 'wiki', 'notes', 'knowledge-base', 'tasks']
  },
  {
    id: 'ai-granola',
    name: 'Granola.ai',
    url: 'https://www.granola.so',
    category: 'Productivity',
    tagline: 'AI meeting notepad that enhances your own human notes',
    overview: 'An elegant Mac notepad for meetings that transcribes conversations in the background without intrusive bots, automatically enriching your handwritten bullet points with exact spoken details.',
    keyFeatures: ['No awkward bot joining your call', 'Enriches your own personal notes', 'Extracts exact action items and decisions', 'Shareable meeting summaries'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free plan with up to 25 meetings; Pro plan at $10/month for unlimited recordings',
    whyItFits: 'The most discreet and user-centric meeting assistant for founders, investors, and busy professionals.',
    badge: 'Trending',
    bestFor: 'Founders, consultants & executives',
    tags: ['productivity', 'meetings', 'transcription', 'notes', 'summaries', 'audio']
  },
  {
    id: 'ai-taskade',
    name: 'Taskade AI',
    url: 'https://www.taskade.com',
    category: 'Productivity',
    tagline: 'AI agents, mind maps, and project automation platform',
    overview: 'A collaborative productivity suite combining task lists, mind maps, and autonomous AI agents that can execute workflows, research topics, and summarize tasks.',
    keyFeatures: ['Autonomous multi-agent teams', 'Mind mapping & Kanban boards', 'Workflow automation triggers', 'Real-time team collaboration'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free tier with core features; Pro from $8/user/month',
    whyItFits: 'Great for planning complex project roadmaps, visual mind mapping, and delegating repetitive research to agents.',
    badge: 'Best for Teams',
    bestFor: 'Agile teams & visual project planners',
    tags: ['productivity', 'agents', 'mind-map', 'tasks', 'workflow', 'automation']
  },

  // Research & Data Analysis
  {
    id: 'ai-perplexity',
    name: 'Perplexity AI',
    url: 'https://www.perplexity.ai',
    category: 'Research',
    tagline: 'Conversational AI answer engine with verified web citations',
    overview: 'A modern AI-powered research engine that synthesizes live web information, provides direct inline citations for every fact, and searches academic papers, YouTube, and news.',
    keyFeatures: ['Real-time web search with inline citations', 'Focus modes (Academic, Writing, Math, YouTube)', 'Pro Search multi-step reasoning', 'Collections for organizing research'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free unlimited quick search; Pro plan at $20/month with Claude 3.7 & GPT-4o access',
    whyItFits: 'The ultimate alternative to traditional search engines for rapid fact-finding and comprehensive research with trustworthy sources.',
    badge: 'Top Pick',
    bestFor: 'Researchers, journalists & analysts',
    tags: ['research', 'search', 'citations', 'academic', 'web', 'facts']
  },
  {
    id: 'ai-notebooklm',
    name: 'NotebookLM by Google',
    url: 'https://notebooklm.google.com',
    category: 'Research',
    tagline: 'Personalized AI research assistant grounded in your own sources',
    overview: 'Powered by Gemini 1.5 Pro with a 1-million-token context window. Upload PDFs, Google Docs, slides, and websites to ask questions strictly grounded in your materials, plus generate viral Audio Overview podcasts.',
    keyFeatures: ['Grounded strictly in uploaded sources', 'Audio Overview 2-host podcast generator', '1M token context capacity', 'Inline citations to original documents'],
    pricingTier: 'Free',
    pricingDetails: '100% Free with a Google Account',
    whyItFits: 'Unrivaled for studying massive textbooks, reading 100-page contracts, or listening to source documents as audio podcasts.',
    badge: '100% Free',
    bestFor: 'Students, researchers, legal & financial analysts',
    tags: ['research', 'gemini', 'pdf', 'audio-overview', 'citations', 'google']
  },
  {
    id: 'ai-consensus',
    name: 'Consensus.app',
    url: 'https://consensus.app',
    category: 'Research',
    tagline: 'AI search engine for peer-reviewed scientific research',
    overview: 'An academic search engine that extracts insights directly from over 200 million peer-reviewed research papers, providing evidence consensus meters and study summaries.',
    keyFeatures: ['Consensus Meter showing scientific agreement', 'Direct citations to PubMed & Semantic Scholar', 'Study quality and sample size badges', 'Synthesized literature reviews'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free tier with basic search; Premium at $8.99/month for unlimited synthesis',
    whyItFits: 'Essential for medical, scientific, and evidence-based research where peer-reviewed validity is mandatory.',
    badge: 'Scientific',
    bestFor: 'Scientists, healthcare professionals & academics',
    tags: ['research', 'scientific', 'papers', 'academic', 'evidence', 'studies']
  },

  // Audio & Voice Synthesis
  {
    id: 'ai-elevenlabs',
    name: 'ElevenLabs',
    url: 'https://elevenlabs.io',
    category: 'Audio',
    tagline: 'Ultra-realistic AI voice cloning and speech synthesis',
    overview: 'The gold standard in generative audio and speech. Offers emotionally nuanced text-to-speech, instant voice cloning from a 1-minute audio clip, voice isolator, and multilingual dubbing.',
    keyFeatures: ['Natural human inflections & emotion', 'Instant and professional voice cloning', 'AI sound effects generator', 'Automated video dubbing in 29+ languages'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free tier with 10,000 characters/month; Starter plan at $5/month; Creator at $22/month',
    whyItFits: 'The #1 choice for audiobooks, video voiceovers, character voices, and localized multilingual content.',
    badge: 'Industry Standard',
    bestFor: 'Podcasters, game developers & video creators',
    tags: ['audio', 'voice', 'tts', 'cloning', 'dubbing', 'sound-effects']
  },
  {
    id: 'ai-suno',
    name: 'Suno AI',
    url: 'https://suno.com',
    category: 'Audio',
    tagline: 'Complete radio-quality song creation from text prompts',
    overview: 'Produces complete musical tracks with vocals, instrumentation, and full song structure (intro, verse, chorus, outro) across virtually any musical genre from a text prompt.',
    keyFeatures: ['Full songs with vocals and instruments', 'Genre mixing (Jazz, Rock, Electronic, Classical)', 'Audio input continuation & cover generation', 'Commercial rights on paid tiers'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free plan with 50 daily credits (10 songs); Pro plan at $10/month; Premier at $30/month',
    whyItFits: 'Groundbreaking for creating custom background tracks, theme jingles, or musical prototypes in minutes.',
    badge: 'Trending',
    bestFor: 'Musicians, game devs & content creators',
    tags: ['audio', 'music', 'songwriting', 'vocals', 'jingles', 'soundtrack']
  },

  // Automation & AI Agents
  {
    id: 'ai-make',
    name: 'Make.com',
    url: 'https://www.make.com',
    category: 'Automation',
    tagline: 'Visual automation platform with integrated AI modules',
    overview: 'A visual automation canvas that connects 1,800+ apps with OpenAI, Anthropic, and Google AI modules to build complex autonomous pipelines with conditional logic and error handling.',
    keyFeatures: ['Visual drag-and-drop workflow canvas', 'Built-in Gemini & OpenAI connectors', 'Handles complex data transformations', 'Real-time webhook execution'],
    pricingTier: 'Freemium',
    pricingDetails: 'Free plan with 1,000 operations/month; Core plan starts at $9/month',
    whyItFits: 'The most flexible platform for building end-to-end automated business workflows powered by AI.',
    badge: 'Top Pick',
    bestFor: 'Operations teams, automators & developers',
    tags: ['automation', 'workflows', 'no-code', 'integrations', 'webhooks', 'agents']
  },
  {
    id: 'ai-n8n',
    name: 'n8n',
    url: 'https://n8n.io',
    category: 'Automation',
    tagline: 'Fair-code workflow automation with LangChain AI agent integration',
    overview: 'An extensible workflow automation tool with native support for autonomous AI agents, LangChain nodes, vector store connections, and self-hosted privacy.',
    keyFeatures: ['Self-hostable or cloud hosted', 'Native AI Agent and memory nodes', 'Vector store integrations (Pinecone, Qdrant)', '400+ pre-built application nodes'],
    pricingTier: 'Freemium',
    pricingDetails: 'Community self-hosted edition is free; Cloud plans start at €20/month',
    whyItFits: 'Best for engineering teams requiring full data privacy, self-hosting, and advanced multi-step AI agent orchestration.',
    badge: 'Open Source',
    bestFor: 'Engineers, privacy-conscious firms & DevOps',
    tags: ['automation', 'agents', 'langchain', 'self-hosted', 'privacy', 'open-source']
  }
];

export const AI_CATEGORIES = [
  { value: 'All', label: '🌟 All Categories' },
  { value: 'Coding', label: '💻 Coding & Dev Tools' },
  { value: 'Image Generation', label: '🎨 Image Generation' },
  { value: 'Video Creation', label: '🎬 Video Creation' },
  { value: 'Productivity', label: '⚡ Productivity & Workflow' },
  { value: 'Research', label: '🔬 Research & Data Analysis' },
  { value: 'Audio', label: '🎙️ Audio & Voice Synthesis' },
  { value: 'Automation', label: '🤖 Automation & AI Agents' },
  { value: 'custom', label: '✏️ Custom Category...' }
];

export const PROMPT_IDEAS = [
  { category: 'Coding', prompt: 'Build and deploy fullstack web apps from natural language with live database and auth' },
  { category: 'Image Generation', prompt: 'Create clean vector logo graphics with readable typography and SVG export' },
  { category: 'Video Creation', prompt: 'Produce photorealistic B-roll clips with dramatic camera motion for a product commercial' },
  { category: 'Research', prompt: 'Analyze 100-page PDF financial reports and synthesize peer-reviewed academic citations' },
  { category: 'Audio', prompt: 'Realistic emotional voice cloning and multilingual dubbing for an educational video series' },
  { category: 'Productivity', prompt: 'Silent background meeting note-taking with automatic action items and JIRA sync' }
];

/**
 * Searches and analyzes AI apps using Google Gemini API.
 * Falls back to intelligent semantic filtering on the curated catalog if no key is set or call fails.
 */
export async function searchAiApps({ category, specificNeed, apiKey }) {
  const cleanCategory = (category || 'All').trim();
  const cleanNeed = (specificNeed || '').trim();

  // 1. If user provided a Gemini API Key (or env var), call Gemini API directly
  const effectiveKey = apiKey || (typeof import.meta !== 'undefined' ? import.meta.env?.VITE_GEMINI_API_KEY : '');

  if (effectiveKey && effectiveKey.trim()) {
    try {
      const geminiResults = await callGeminiApi(effectiveKey.trim(), cleanCategory, cleanNeed);
      if (Array.isArray(geminiResults) && geminiResults.length > 0) {
        return {
          source: 'Gemini 2.0 Live Analysis',
          isLiveGemini: true,
          apps: geminiResults
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to curated knowledge engine:', err);
    }
  }

  // 2. Curated Knowledge Engine Fallback (Intelligent scoring & tailored rationale generation)
  const filteredApps = scoreAndFilterCuratedApps(cleanCategory, cleanNeed);

  return {
    source: effectiveKey ? 'Curated Catalog (Gemini Fallback)' : 'Curated Expert Catalog',
    isLiveGemini: false,
    apps: filteredApps
  };
}

/**
 * Calls Google Generative Language API (Gemini 2.0 / 1.5 Flash) with strict JSON output schema.
 */
async function callGeminiApi(apiKey, category, specificNeed) {
  const systemInstruction = `You are a world-class AI Software Architect and Tech Industry Evaluator. 
Your task is to recommend real-world, currently active, production-grade AI applications and tools matching the user's category and specific requirements.
Always provide authentic direct URLs (e.g. https://www.cursor.com).
Return valid JSON adhering strictly to the requested schema.`;

  const userPrompt = `Category: ${category}
User's Specific Requirement / Use Case: ${specificNeed || 'Top essential tools in this category'}

Please recommend 4 to 8 top authentic AI websites/tools that specifically solve this need.
For each tool, provide:
1. name: Official tool name
2. url: Direct authentic HTTPS website link (e.g. "https://...")
3. category: Main category (e.g. "Coding", "Image Generation", "Video Creation", "Productivity", "Research", "Audio", "Automation")
4. tagline: Short catchy summary
5. overview: Detailed note explaining what it does
6. keyFeatures: Array of 3 to 4 specific key capabilities
7. pricingTier: "Free" | "Freemium" | "Paid" | "Open Source"
8. pricingDetails: Specific pricing note (e.g. "Free tier with 50 credits/mo, Pro from $15/mo")
9. whyItFits: Tailored 1-2 sentence explanation of why this tool specifically fits the user's requirement: "${specificNeed || category}"
10. badge: Tag like "Top Pick", "Industry Standard", "Open Source", "Trending", or "Best Value"
11. bestFor: Short phrase identifying the target user (e.g. "Founders & developers")

Respond strictly with a valid JSON array of objects. Do not include markdown code block syntax if possible, just the raw JSON.`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: `${systemInstruction}\n\n${userPrompt}` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json'
    }
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    // If gemini-2.0-flash is unavailable, try gemini-1.5-flash
    if (res.status === 404 || res.status === 400) {
      const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const fallbackRes = await fetch(fallbackEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json();
        return parseGeminiResponse(fallbackData);
      }
    }
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return parseGeminiResponse(data);
}

function parseGeminiResponse(data) {
  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;
  if (!text) return [];

  // Strip potential markdown ```json wrapping
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) return [];

  return parsed.map((item, idx) => ({
    id: `gemini-${Date.now()}-${idx}`,
    name: item.name || 'AI Tool',
    url: item.url?.startsWith('http') ? item.url : `https://${item.url || 'google.com'}`,
    category: item.category || 'AI Software',
    tagline: item.tagline || item.overview?.slice(0, 60) || 'AI Application',
    overview: item.overview || 'Powerful AI application for modern workflows.',
    keyFeatures: Array.isArray(item.keyFeatures) ? item.keyFeatures : ['AI Automation', 'Cloud processing', 'Modern web interface'],
    pricingTier: item.pricingTier || 'Freemium',
    pricingDetails: item.pricingDetails || 'Freemium / Free tier available',
    whyItFits: item.whyItFits || 'Highly tailored to your specified workflow needs.',
    badge: item.badge || 'AI Recommended',
    bestFor: item.bestFor || 'Creators and professionals',
    tags: Array.isArray(item.tags) ? item.tags : ['ai', 'tool']
  }));
}

/**
 * Filters and scores the curated catalog based on category and specific prompt keywords.
 */
function scoreAndFilterCuratedApps(category, specificNeed) {
  const normCat = category.toLowerCase().trim();
  const queryTokens = specificNeed.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);

  let candidates = [...CURATED_AI_APPS];

  // Category filter
  if (normCat !== 'all' && normCat !== 'custom') {
    candidates = candidates.filter(app => {
      const appCat = app.category.toLowerCase();
      return appCat.includes(normCat) || normCat.includes(appCat);
    });
    // If category filtered out too much, fall back to full catalog for keyword matching
    if (candidates.length === 0) {
      candidates = [...CURATED_AI_APPS];
    }
  }

  // Score based on tokens
  const scored = candidates.map(app => {
    let score = 0;
    const searchable = `${app.name} ${app.tagline} ${app.overview} ${app.keyFeatures.join(' ')} ${app.tags?.join(' ') || ''}`.toLowerCase();

    for (const token of queryTokens) {
      if (token.length <= 2) continue;
      if (searchable.includes(token)) {
        score += 5;
      }
    }

    // Category match bonus
    if (normCat !== 'all' && app.category.toLowerCase().includes(normCat)) {
      score += 10;
    }

    return { app, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const finalApps = scored.slice(0, 8).map(({ app }) => {
    // Tailor the 'whyItFits' note if user provided a specific prompt
    let customizedWhy = app.whyItFits;
    if (specificNeed && specificNeed.trim().length > 5) {
      customizedWhy = `Directly matches "${specificNeed.slice(0, 80)}${specificNeed.length > 80 ? '...' : ''}": ${app.whyItFits}`;
    }

    return {
      ...app,
      whyItFits: customizedWhy
    };
  });

  return finalApps;
}

/**
 * Exports AI app research notes to CSV file with UTF-8 BOM
 */
export function exportAiAppsToCsv(apps, category, specificNeed) {
  if (!apps || apps.length === 0) return;

  const headers = [
    'AI Tool Name',
    'Category',
    'Official Direct URL',
    'Pricing Tier',
    'Pricing Details',
    'Overview',
    'Key Features',
    'Why It Fits Need',
    'Best For',
    'Badge'
  ];

  const rows = apps.map((app) => [
    `"${(app.name || '').replace(/"/g, '""')}"`,
    `"${(app.category || '').replace(/"/g, '""')}"`,
    `"${(app.url || '').replace(/"/g, '""')}"`,
    `"${(app.pricingTier || 'Freemium').replace(/"/g, '""')}"`,
    `"${(app.pricingDetails || '').replace(/"/g, '""')}"`,
    `"${(app.overview || '').replace(/"/g, '""')}"`,
    `"${(Array.isArray(app.keyFeatures) ? app.keyFeatures.join('; ') : '').replace(/"/g, '""')}"`,
    `"${(app.whyItFits || '').replace(/"/g, '""')}"`,
    `"${(app.bestFor || '').replace(/"/g, '""')}"`,
    `"${(app.badge || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const cleanCat = (category || 'ai-apps').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanNeed = (specificNeed || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24);
  const dateStr = new Date().toISOString().split('T')[0];

  const fileName = cleanNeed ? `ai-research-${cleanCat}-${cleanNeed}-${dateStr}.csv` : `ai-research-${cleanCat}-${dateStr}.csv`;
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/**
 * Formats a clean research summary text for copying or sharing
 */
export function generateShareSummary(apps, category, specificNeed) {
  if (!apps || apps.length === 0) return '';

  const header = `🤖 *AI App Discovery & Research Report*
📂 Category: ${category || 'General'}
🎯 Focus / Need: ${specificNeed || 'Curated Top Tools'}
📅 Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  const body = apps.map((app, idx) => {
    return `*${idx + 1}. ${app.name}* (${app.pricingTier})
🌐 Link: ${app.url}
📝 Overview: ${app.overview}
🎯 Why it fits: ${app.whyItFits}
💡 Key Features: ${Array.isArray(app.keyFeatures) ? app.keyFeatures.slice(0, 3).join(' • ') : ''}
💰 Pricing: ${app.pricingDetails}
`;
  }).join('\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');

  return (header + body).trim();
}
