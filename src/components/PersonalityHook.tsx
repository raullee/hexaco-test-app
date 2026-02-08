import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Zap, Star, ArrowRight, Brain, Eye } from 'lucide-react';

interface Props {
  scores: {
    [domain: string]: {
      score: number;
      facets: { [facet: string]: number };
    };
  };
  showPaywall: () => void;
}

const PersonalityHook: React.FC<Props> = ({ scores, showPaywall }) => {
  
  const generateInsight = () => {
    const sortedScores = Object.entries(scores).sort((a, b) => b[1].score - a[1].score);
    const highestDomain = sortedScores[0];
    const lowestDomain = sortedScores[sortedScores.length - 1];
    
    const getPersonalityType = () => {
      const high = highestDomain[0];
      const low = lowestDomain[0];
      
      if (high === 'Openness to Experience' && low === 'Conscientiousness') {
        return "The Creative Visionary";
      } else if (high === 'Conscientiousness' && low === 'Openness to Experience') {
        return "The Methodical Achiever";
      } else if (high === 'Extraversion' && scores['Agreeableness (versus Anger)'].score > 3.5) {
        return "The Social Harmonizer";
      } else if (high === 'Honesty-Humility') {
        return "The Authentic Leader";
      } else if (high === 'Emotionality') {
        return "The Empathetic Connector";
      } else {
        return "The Balanced Individual";
      }
    };

    return {
      personalityType: getPersonalityType(),
      dominantTrait: highestDomain[0] === 'Agreeableness (versus Anger)' ? 'Agreeableness' : highestDomain[0],
      dominantScore: highestDomain[1].score,
      growthArea: lowestDomain[0] === 'Agreeableness (versus Anger)' ? 'Agreeableness' : lowestDomain[0],
      growthScore: lowestDomain[1].score
    };
  };

  const insight = generateInsight();

  return (
    <div className="bg-gradient-to-b from-deep-purple/80 to-electric-blue/50 py-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Free Insights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 card px-4 py-2 mb-6 text-sm">
            <Eye className="w-4 h-4 text-bright-cyan" />
            <span className="text-bright-cyan font-semibold">Free Personality Insight</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-gradient">
            You are "{insight.personalityType}"
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card p-6 bg-gradient-to-br from-neon-purple/20 to-bright-cyan/20 border-neon-purple/30">
              <h3 className="text-xl font-bold text-bright-cyan mb-3">Dominant Strength</h3>
              <p className="text-warm-white/90">
                Your highest trait is <span className="text-neon-purple font-bold">{insight.dominantTrait}</span> 
                &nbsp;({insight.dominantScore.toFixed(1)}/5), which shapes how you interact with the world.
              </p>
            </div>
            
            <div className="card p-6 bg-gradient-to-br from-electric-blue/20 to-neon-purple/20 border-bright-cyan/30">
              <h3 className="text-xl font-bold text-neon-purple mb-3">Growth Opportunity</h3>
              <p className="text-warm-white/90">
                Your <span className="text-bright-cyan font-bold">{insight.growthArea}</span> 
                &nbsp;({insight.growthScore.toFixed(1)}/5) presents the biggest opportunity for personal development.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Paywall Hook */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          {/* Blurred preview */}
          <div className="card p-8 mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-deep-purple/90 to-electric-blue/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <Lock className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                <p className="text-warm-white font-semibold mb-2">Unlock Your Complete Analysis</p>
                <p className="text-warm-white/80 text-sm">Personalized insights powered by AI</p>
              </div>
            </div>
            
            <div className="blur-sm select-none">
              <h3 className="text-2xl font-bold text-neon-purple mb-4">Deep Personality Analysis</h3>
              <div className="space-y-4 text-warm-white/80">
                <p>Your unique combination of traits creates a fascinating personality profile. Based on your HEXACO scores, you demonstrate characteristics that are both complex and nuanced...</p>
                <p>In relationships, you likely approach others with a blend of [TRAIT ANALYSIS] which means you tend to [BEHAVIORAL PATTERN]. This can be both a strength and something to be mindful of...</p>
                <p>Career-wise, your personality type suggests you would thrive in environments that [CAREER INSIGHTS]. Your natural tendencies toward [STRENGTHS] make you well-suited for...</p>
                <p>For personal growth, focusing on [DEVELOPMENT AREAS] could unlock new potential. Specific strategies that align with your personality include...</p>
              </div>
            </div>
          </div>

          {/* Value propositions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card p-6 text-center"
            >
              <Brain className="w-8 h-8 text-neon-purple mx-auto mb-3" />
              <h4 className="font-bold text-warm-white mb-2">AI-Powered Analysis</h4>
              <p className="text-warm-white/80 text-sm">Personalized insights generated by advanced AI based on your unique scores</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="card p-6 text-center"
            >
              <Zap className="w-8 h-8 text-bright-cyan mx-auto mb-3" />
              <h4 className="font-bold text-warm-white mb-2">Actionable Insights</h4>
              <p className="text-warm-white/80 text-sm">Specific strategies for relationships, career, and personal development</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="card p-6 text-center"
            >
              <Star className="w-8 h-8 text-neon-purple mx-auto mb-3" />
              <h4 className="font-bold text-warm-white mb-2">Research-Based</h4>
              <p className="text-warm-white/80 text-sm">Backed by decades of psychological research and validated frameworks</p>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <button
              onClick={showPaywall}
              className="group btn-primary text-lg px-8 py-4"
            >
              <span className="flex items-center gap-3">
                Unlock Full Analysis - $4.99
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <p className="text-warm-white/60 mt-4 text-sm">
              💡 Instant access • 📱 Works on all devices • 🔒 Secure payment
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalityHook;
