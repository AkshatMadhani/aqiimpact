import Groq from 'groq-sdk';
import config from '../config/env.js';

const groq = config.groqApiKey ? new Groq({ apiKey: config.groqApiKey }) : null;

export const getPersonalizedSuggestions = async (userProfile, aqiData, exposureData) => {

  if (!groq) {
    console.error('GROQ_API_KEY is not set in .env');
    return ['AI recommendations unavailable. Please set GROQ_API_KEY in your backend .env file.'];
  }

  try {
    const preExistingDiseases = userProfile.preExistingDiseases || [];
    const healthConditions = userProfile.healthConditions || [];
    const allConditions = [...new Set([...healthConditions, ...preExistingDiseases])]
      .filter(c => c !== 'none');

    const prompt = `
You are Dr. AirHealth — a strict AI medical advisor specializing in air pollution health.

YOUR TASK:
Generate exactly 5 personalized, actionable health recommendations.

PATIENT PROFILE:
Age: ${userProfile.age || 'Not specified'} (${userProfile.ageGroup})
Conditions: ${allConditions.length > 0 ? allConditions.join(', ') : 'None'}
City: ${userProfile.city}

CURRENT EXPOSURE:
Activity: ${exposureData.activity}
Duration: ${exposureData.duration || 'Not specified'} minutes
Exposure Score: ${exposureData.exposureScore}
Risk Level: ${exposureData.riskLevel}

AIR QUALITY:
AQI: ${aqiData.aqi}
Category: ${aqiData.category}
Dominant Pollutant: ${aqiData.dominantPollutant}
Pollutants: ${JSON.stringify(aqiData.pollutants)}

STRICT RULES (DO NOT BREAK THESE):
1. Return ONLY a valid JSON array with EXACTLY 5 strings.
2. No explanations, no markdown, no headings, no extra text.
3. Each item must be a full sentence recommendation.
4. Advice must be specific to THIS patient (mention age, activity, or conditions).
5. Consider the dominant pollutant: ${aqiData.dominantPollutant}.
6. Recommendations must be proportional to risk level: ${exposureData.riskLevel}.

OUTPUT FORMAT:
["rec 1", "rec 2", "rec 3", "rec 4", "rec 5"]
`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `
You are Dr. AirHealth.
You ONLY output a JSON array of 5 strings.
No explanations, no markdown, no preamble.
If unsure, still return 5 safe recommendations.
`
        },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 800
    });

    const raw = completion.choices[0]?.message?.content || '';
    console.log('🤖 Groq raw response:', raw);
    let parsed = null;

    try {
      parsed = JSON.parse(raw.trim());
    } catch {
      try {
        const match = raw.match(/\[[\s\S]*\]/);
        if (match) parsed = JSON.parse(match[0]);
      } catch {}
    }

    if (Array.isArray(parsed) && parsed.length >= 5) {
      return parsed.slice(0, 5);
    }

    console.warn('⚠️ AI output invalid — using fallback');
    return getEnhancedFallback(userProfile, aqiData, exposureData);

  } catch (err) {
    console.error('❌ Groq error:', err.message);
    return getEnhancedFallback(userProfile, aqiData, exposureData);
  }
};
