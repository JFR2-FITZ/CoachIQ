// pages/api/ai.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt, image, fast } = req.body
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' })

  try {
    // fast=true uses Haiku — 5-10x faster, ideal for structured JSON (schemes, defense, situational)
    // fast=false (default) uses Sonnet — for complex reasoning (film analysis, post-game, scout)
    const model = fast ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-5'

    const userContent = image
      ? [
          { type: 'image', source: { type: 'base64', media_type: image.type || 'image/jpeg', data: image.data } },
          { type: 'text', text: prompt },
        ]
      : prompt

    const body = {
      model,
      max_tokens: fast ? 1500 : 2000,
      messages: [{ role: 'user', content: userContent }],
    }

    // Enable web search for news/recent content — only on Sonnet (Haiku doesn't need it for schemes)
    if (!fast && (prompt.includes('VERY RECENT') || prompt.includes('last 7') || prompt.includes('last 30 days'))) {
      body.tools = [{ type: 'web_search_20250305', name: 'web_search' }]
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'web-search-2025-03-05',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const err = await response.text()
      return res.status(response.status).json({ error: err })
    }

    const data = await response.json()

    // Extract text from all content blocks (handles tool use + text responses)
    const text = (data.content || [])
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')

    return res.status(200).json({ result: text })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}