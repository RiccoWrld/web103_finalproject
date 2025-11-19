import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get recent reflections (last 14 days)
    const { data: reflections, error: reflectionsError } = await supabaseClient
      .from('reflections')
      .select('*')
      .eq('user_id', user.id)
      .order('reflection_date', { ascending: false })
      .limit(14);

    if (reflectionsError) {
      console.error('Error fetching reflections:', reflectionsError);
      throw reflectionsError;
    }

    // Get user's habits with streaks
    const { data: habits, error: habitsError } = await supabaseClient
      .from('habits')
      .select('name, current_streak, best_streak, category')
      .eq('user_id', user.id);

    if (habitsError) {
      console.error('Error fetching habits:', habitsError);
      throw habitsError;
    }

    if (!reflections || reflections.length === 0) {
      return new Response(JSON.stringify({ 
        insights: "Start journaling daily to unlock personalized insights about your mood patterns and habit performance!" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Prepare data for AI analysis
    const reflectionSummary = reflections.map(r => ({
      date: r.reflection_date,
      feeling: r.feeling,
      challenges: r.challenges,
      wins: r.wins
    }));

    const habitSummary = habits?.map(h => ({
      name: h.name,
      category: h.category,
      currentStreak: h.current_streak,
      bestStreak: h.best_streak
    })) || [];

    const prompt = `You are a supportive life coach analyzing mood and habit data. Provide encouraging insights in 3-4 sentences.

Recent reflections (${reflections.length} entries):
${JSON.stringify(reflectionSummary, null, 2)}

Current habits and streaks:
${JSON.stringify(habitSummary, null, 2)}

Analyze:
1. Mood patterns and trends
2. Correlations between mood and habit performance
3. Encouraging observations about progress
4. One actionable suggestion

Keep it warm, non-medical, and empowering. Focus on patterns, not diagnoses.`;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a warm, supportive life coach providing non-medical mental wellness insights.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);
      throw new Error(`Lovable AI error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const insights = aiData.choices[0].message.content;

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-mood-trends:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
