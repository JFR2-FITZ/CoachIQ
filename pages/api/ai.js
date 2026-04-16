// pages/api/ai.js
// Replace your existing pages/api/ai.js with this file

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  
  const { prompt, useWebSearch } = req.body
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' })

  try {
    const body = {
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }

    // Enable web search for news-related prompts
    if (useWebSearch || prompt.includes('VERY RECENT') || prompt.includes('last 7') || prompt.includes('last 30 days')) {
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