import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, ExternalLink } from 'lucide-react';

const ARCHETYPE_URL = 'https://archetype-protocol.vercel.app';

interface Props {
  scores: {
    [domain: string]: {
      score: number;
      facets: { [facet: string]: number };
    };
  };
}

const PremiumResults: React.FC<Props> = ({ scores }) => {
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [_displayedText, setDisplayedText] = useState('');
  const [sections, setSections] = useState<{ title: string; content: string }[]>([]);
  const [revealedSections, setRevealedSections] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    generateAIAnalysis();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!analysis) return;
    let idx = 0;
    intervalRef.current = setInterval(() => {
      idx += 3;
      if (idx >= analysis.length) {
        setDisplayedText(analysis);
        if (intervalRef.current) clearInterval(intervalRef.current);
      } else {
        setDisplayedText(analysis.slice(0, idx));
      }
    }, 10);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [analysis]);

  // Section reveal
  useEffect(() => {
    if (sections.length === 0) return;
    const timer = setInterval(() => {
      setRevealedSections(p => {
        if (p >= sections.length) { clearInterval(timer); return p; }
        return p + 1;
      });
    }, 600);
    return () => clearInterval(timer);
  }, [sections]);

  const generateAIAnalysis = async () => {
    setIsLoading(true);
    try {
      const scoresText = Object.entries(scores).length > 0
        ? Object.entries(scores).map(([d, data]) => `${d}: ${data.score.toFixed(2)}/5`).join(', ')
        : 'Honesty-Humility: 3.5/5, Emotionality: 3.0/5, Extraversion: 3.8/5, Agreeableness: 3.2/5, Conscientiousness: 4.0/5, Openness: 3.7/5';

      const prompt = `Based on these HEXACO personality test scores: ${scoresText}

Provide a comprehensive personality analysis with these sections (use ## for each heading):

## Personality Overview
2-3 paragraphs about their core personality

## Relationship Insights
How they interact with others, love languages, potential challenges

## Career Recommendations
Ideal work environments, leadership style, team dynamics

## Personal Growth Areas
Specific development opportunities with actionable advice

## Decision-Making Style
How they approach choices and problem-solving

## Stress Management
What causes stress and how to handle it based on their profile

Make it personal, insightful, and actionable. Write as if speaking directly to the person.`;

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDqRsRuIjwMODJRuB-MYfEaTBhBgiU3tiE', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });

      if (!response.ok) throw new Error('Failed to generate');
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || getFallback();
      setAnalysis(text);
      parseSections(text);
    } catch {
      const fb = getFallback();
      setAnalysis(fb);
      parseSections(fb);
    } finally {
      setIsLoading(false);
    }
  };

  const parseSections = (text: string) => {
    const parts = text.split(/^## /m).filter(Boolean);
    const parsed = parts.map(p => {
      const lines = p.split('\n');
      return { title: lines[0]?.trim() || '', content: lines.slice(1).join('\n').trim() };
    });
    setSections(parsed);
    setRevealedSections(0);
  };

  const getFallback = () => `## Personality Overview\nYour HEXACO profile reveals a balanced and nuanced personality...\n\n## Relationship Insights\nYou approach relationships with thoughtfulness...\n\n## Career Recommendations\nYou thrive in structured yet creative environments...\n\n## Personal Growth Areas\nFocus on developing emotional resilience...\n\n## Decision-Making Style\nYou balance logic with intuition...\n\n## Stress Management\nYour profile suggests mindfulness practices would be particularly effective...`;

  const handleDownload = () => {
    const blob = new Blob([analysis], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'hexaco-personality-analysis.txt';
    a.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'My HEXACO Analysis', text: 'Check out my HEXACO personality analysis!', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied!');
    }
  };

  const formatContent = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-accent-indigo">$1</strong>')
      .replace(/### (.*?)\n/g, '<h4 class="text-base font-semibold text-accent-cyan mt-4 mb-2">$1</h4>')
      .replace(/\n\n/g, '<br><br>');
  };

  return (
    <div className="min-h-screen bg-surface text-text-primary font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Your Complete Profile</h1>
          <p className="text-text-muted mb-6">AI-powered personality analysis</p>
          <div className="flex justify-center gap-3">
            <button onClick={handleDownload} className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button onClick={handleShare} className="btn-secondary flex items-center gap-2 text-sm py-2 px-4">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-muted">Generating your personalized analysis...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={i < revealedSections ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="glass-card p-6"
              >
                <h2 className="text-lg font-semibold text-accent-cyan mb-3">{section.title}</h2>
                <div
                  className="text-sm text-text-muted leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatContent(section.content) }}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Cross-link */}
        {!isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center mt-12">
            <a href={ARCHETYPE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-cyan hover:text-accent-indigo transition-colors text-sm font-medium">
              Complete your profile with the Archetype Quiz <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PremiumResults;
