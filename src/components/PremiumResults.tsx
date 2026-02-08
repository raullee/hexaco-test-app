import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Download, Share, Star, Target } from 'lucide-react';

interface Props {
  scores: {
    [domain: string]: {
      score: number;
      facets: { [facet: string]: number };
    };
  };
}

const PremiumResults: React.FC<Props> = ({ scores }) => {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateAIAnalysis();
  }, [scores]);

  const generateAIAnalysis = async () => {
    setIsLoading(true);
    
    try {
      // Prepare the scores for Gemini API
      const scoresText = Object.entries(scores)
        .map(([domain, data]) => `${domain}: ${data.score.toFixed(2)}/5`)
        .join(', ');

      const prompt = `Based on these HEXACO personality test scores: ${scoresText}

Please provide a comprehensive personality analysis that includes:

1. **Personality Overview** (2-3 paragraphs about their core personality)
2. **Relationship Insights** (how they interact with others, love languages, potential challenges)
3. **Career Recommendations** (ideal work environments, leadership style, team dynamics)
4. **Personal Growth Areas** (specific development opportunities with actionable advice)
5. **Decision-Making Style** (how they approach choices and problem-solving)
6. **Stress Management** (what causes stress and how to handle it based on their profile)

Make it personal, insightful, and actionable. Write as if speaking directly to the person. Be specific about how their unique combination of traits creates their personality pattern.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDqRsRuIjwMODJRuB-MYfEaTBhBgiU3tiE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate analysis');
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Analysis could not be generated.';
      setAnalysis(generatedText);
      
    } catch (error) {
      console.error('Error generating analysis:', error);
      setAnalysis(getFallbackAnalysis());
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackAnalysis = () => {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1].score - a[1].score);
    const highest = sortedScores[0];
    const lowest = sortedScores[sortedScores.length - 1];

    return `## Your Personality Profile

Your HEXACO results reveal a unique personality pattern centered around your strongest trait: **${highest[0]}** (${highest[1].score.toFixed(1)}/5). This dominant characteristic significantly influences how you approach relationships, work, and personal growth.

### Relationship Insights

Your personality suggests you approach relationships with a blend of emotional intelligence and practical consideration. Your ${highest[0]} trait means you likely value authentic connections and bring stability to your relationships. You may find that you're naturally drawn to people who appreciate your ${highest[0].toLowerCase()} nature.

### Career Recommendations  

Based on your profile, you would thrive in environments that leverage your natural ${highest[0].toLowerCase()}. Consider roles that allow you to utilize this strength while providing opportunities to develop your ${lowest[0].toLowerCase()} (${lowest[1].score.toFixed(1)}/5), which represents your biggest growth area.

### Personal Development

Focus on developing your ${lowest[0]} skills through deliberate practice and mindful attention. This balanced approach will help you become more well-rounded while maintaining your natural strengths in ${highest[0].toLowerCase()}.

*Note: This is a simplified analysis. For the full AI-powered insights, please ensure your internet connection is stable and try again.*`;
  };

  const handleDownload = () => {
    // In a real app, this would generate a proper PDF
    const element = document.createElement('a');
    const file = new Blob([analysis], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'hexaco-personality-analysis.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My HEXACO Personality Analysis',
        text: 'I just discovered fascinating insights about my personality!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-purple via-electric-blue to-neon-purple text-warm-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 card px-6 py-3 mb-6">
            <Brain className="w-6 h-6 text-neon-purple" />
            <span className="text-bright-cyan font-semibold">Premium AI Analysis</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gradient">
            Your Complete
            <br />
            Personality Profile
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </motion.div>

        {/* Analysis Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card p-8 mb-8"
        >
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-semibold">Generating your personalized analysis...</span>
              </div>
              <p className="text-warm-white/80">Our AI is analyzing your unique personality pattern</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <div 
                className="text-warm-white/90 leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ 
                  __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong class="text-neon-purple">$1</strong>')
                    .replace(/## (.*?)\n/g, '<h2 class="text-2xl font-bold text-bright-cyan mb-4 mt-8">$1</h2>')
                    .replace(/### (.*?)\n/g, '<h3 class="text-xl font-semibold text-neon-purple mb-3 mt-6">$1</h3>')
                    .replace(/\n\n/g, '<br><br>')
                }}
              />
            </div>
          )}
        </motion.div>

        {/* Action Items */}
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-bright-cyan" />
                <h3 className="text-xl font-bold">Next Steps</h3>
              </div>
              <ul className="space-y-2 text-warm-white/80">
                <li>• Reflect on the insights that resonated most</li>
                <li>• Share relevant findings with trusted friends</li>
                <li>• Set 1-2 specific development goals</li>
                <li>• Revisit this analysis in 6 months</li>
              </ul>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="w-6 h-6 text-neon-purple" />
                <h3 className="text-xl font-bold">Remember</h3>
              </div>
              <p className="text-warm-white/80">
                Personality is a guide, not a limitation. Use these insights to understand yourself better, 
                but remember that you have the power to grow and change in any direction you choose.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PremiumResults;