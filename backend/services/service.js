import Groq from 'groq-sdk';
import config from '../config/env.js';

const groq = config.groqApiKey ? new Groq({ apiKey: config.groqApiKey }) : null;

export const getPersonalizedSuggestions = async (userProfile, aqiData, exposureData) => {
  console.log('🎯 AI Agent: Analyzing patient data...');
   const patientData = {
    personal: {
      name: userProfile.name || 'Patient',
      age: userProfile.age || 'not provided',
      ageGroup: userProfile.ageGroup || 'adult',
      registeredCity: userProfile.city || 'unknown',
    },
    medical: {
      conditions: [...new Set([...(userProfile.healthConditions || []), ...(userProfile.preExistingDiseases || [])])].filter(c => c && c !== 'none'),
    },
    exposure: {
      score: exposureData.exposureScore || 0,
      riskLevel: exposureData.riskLevel || 'MODERATE',
      activity: exposureData.activity || 'walking',
      durationMinutes: exposureData.duration || exposureData.timeMinutes || 30,
      location: exposureData.location || userProfile.requestedCity || userProfile.city || 'unknown',
    },
    airQuality: {
      aqi: aqiData.aqi || 0,
      category: aqiData.category || 'Unknown',
      dominantPollutant: aqiData.dominantPollutant || 'PM2.5',
      pollutants: aqiData.pollutants || {},
      city: aqiData.city || exposureData.location || 'unknown',
    }
  };
  
  // Check if Groq API is available
  if (!groq || !config.groqApiKey) {
    console.error('❌ GROQ_API_KEY not found in environment variables');
    return [{
      error: true,
      message: 'Groq API key not configured. Please add GROQ_API_KEY to your backend/.env file'
    }];
  }

  try {
    const systemPrompt = `You are Dr. AirHealth, a senior physician specializing in environmental medicine.

CRITICAL: The patient is checking air quality at: ${patientData.exposure.location}
You MUST use THIS location in your response. Do NOT invent or guess a different location.

Your voice: Authoritative, clinical, precise. Speak like a doctor giving direct advice.

For each recommendation:
- Address their SPECIFIC condition by name
- Give NUMBERS (minutes, AQI levels)
- Tell them WARNING SIGNS to watch for
- Tell them EXACTLY what to do
- MENTION the location: ${patientData.exposure.location}

Return ONLY a JSON array of 5 strings. No explanations. No markdown.`;
const userPrompt = `Patient: ${patientData.personal.age} years old, ${patientData.medical.conditions.length > 0 ? patientData.medical.conditions.join(', ') : 'no known conditions'}.
Location they are checking: ${patientData.exposure.location}
Current AQI at this location: ${patientData.airQuality.aqi} (${patientData.airQuality.category})
Activity: ${patientData.exposure.activity} for ${patientData.exposure.durationMinutes} minutes
Exposure score: ${patientData.exposure.score}

Give 5 specific medical recommendations for THIS location as JSON array.`;
    console.log('🤖 Sending request to Groq AI...');
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiResponse = completion.choices[0]?.message?.content || '';
    console.log('📝 AI Response received');
    
    let suggestions = [];
    try {
      suggestions = JSON.parse(aiResponse);
    } catch (e) {
      const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        try {
          suggestions = JSON.parse(jsonMatch[0]);
        } catch (e2) {
          console.error('Failed to parse AI response:', e2.message);
        }
      }
    }
    
    if (Array.isArray(suggestions) && suggestions.length === 5) {
      console.log('✅ AI generated 5 personalized recommendations');
      return suggestions;
    }
    
    console.warn('⚠️ AI response invalid format, retrying...');
    
    // Retry with simpler prompt
    const retryCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a doctor. Output only JSON array of 5 recommendations. No other text.' },
        { role: 'user', content: `Patient: Age ${patientData.personal.age}, Conditions: ${patientData.medical.conditions.join(', ') || 'none'}, AQI: ${patientData.airQuality.aqi}, Exposure Score: ${patientData.exposure.score}, Activity: ${patientData.exposure.activity}. Give 5 recommendations as JSON array.` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 800
    });
    
    const retryResponse = retryCompletion.choices[0]?.message?.content || '';
    const retryMatch = retryResponse.match(/\[[\s\S]*?\]/);
    if (retryMatch) {
      try {
        const retrySuggestions = JSON.parse(retryMatch[0]);
        if (Array.isArray(retrySuggestions) && retrySuggestions.length >= 5) {
          return retrySuggestions.slice(0, 5);
        }
      } catch (e) {}
    }
    
    // If all fails, return error message
    return ["AI service temporarily unavailable. Please try again in a moment.", "Check your Groq API key configuration.", "Ensure backend/.env has GROQ_API_KEY set", "Restart backend after adding API key", "Contact support if issue persists"];
    
  } catch (error) {
    console.error('❌ Groq API Error:', error.message);
    return ["Unable to generate recommendations at this time.", "Please check your Groq API key configuration.", "Make sure GROQ_API_KEY is set in backend/.env", "Restart the backend server after adding the key", "If problem persists, verify your Groq account has credits"];
  }
};

export default getPersonalizedSuggestions;