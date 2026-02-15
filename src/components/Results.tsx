import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Share2, ExternalLink } from 'lucide-react';
import { hexacoQuestions } from '../questions';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const ARCHETYPE_URL = 'https://archetype-protocol.vercel.app';

interface Props {
  answers: number[];
  restartTest: () => void;
  showPaywall: () => void;
}

const domainDescriptions: Record<string, Record<string, string>> = {
  'Honesty-Humility': {
    high: 'You are sincere, fair-minded, and modest — unlikely to manipulate others for personal gain.',
    low: 'You may be more willing to bend rules or use charm strategically to achieve your goals.',
  },
  'Emotionality': {
    high: 'You experience emotions deeply, seek close bonds, and are sensitive to stress.',
    low: 'You are emotionally resilient, self-reliant, and calm under pressure.',
  },
  'Extraversion': {
    high: 'You are socially confident, energetic, and thrive in group settings.',
    low: 'You prefer solitude or small groups and tend to be more reserved.',
  },
  'Agreeableness (versus Anger)': {
    high: 'You are patient, forgiving, and gentle — rarely holding grudges.',
    low: 'You can be critical and quick-tempered, standing firm on your positions.',
  },
  'Conscientiousness': {
    high: 'You are organized, disciplined, and methodical in pursuing your goals.',
    low: 'You are spontaneous and flexible, preferring to go with the flow.',
  },
  'Openness to Experience': {
    high: 'You are intellectually curious, creative, and drawn to novelty.',
    low: 'You prefer familiar routines and practical, conventional approaches.',
  },
};

const Results: React.FC<Props> = ({ answers, restartTest, showPaywall }) => {
  const calculateScores = () => {
    const scores: Record<string, { score: number; facets: Record<string, number> }> = {};
    hexacoQuestions.scales.forEach((scale) => {
      let domainTotal = 0;
      const facetScores: Record<string, number> = {};
      scale.facets.forEach((facet) => {
        let facetTotal = 0;
        facet.items.forEach((itemId) => {
          const item = hexacoQuestions.items.find((i) => i.id === itemId);
          if (item) {
            let answer = answers[item.id - 1];
            if (item.reverse_scored) answer = 6 - answer;
            facetTotal += answer;
          }
        });
        const facetScore = facetTotal / facet.items.length;
        facetScores[facet.name] = facetScore;
        domainTotal += facetScore;
      });
      scores[scale.domain] = { score: domainTotal / scale.facets.length, facets: facetScores };
    });
    return scores;
  };

  const scores = calculateScores();
  const domains = Object.keys(scores);
  const domainLabels = domains.map(d => d === 'Agreeableness (versus Anger)' ? 'Agreeableness' : d);

  const radarData = {
    labels: domainLabels,
    datasets: [{
      label: 'Your Profile',
      data: domains.map(d => scores[d].score),
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      borderColor: 'rgba(99, 102, 241, 0.7)',
      borderWidth: 2,
      pointBackgroundColor: '#22D3EE',
      pointBorderColor: '#22D3EE',
      pointRadius: 5,
    }],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        min: 1,
        ticks: { stepSize: 1, color: '#71717A', font: { size: 10 } },
        grid: { color: 'rgba(255,255,255,0.06)' },
        angleLines: { color: 'rgba(255,255,255,0.06)' },
        pointLabels: { color: '#F5F5F7', font: { size: 12, weight: 'bold' as const } },
      },
    },
    plugins: { legend: { display: false } },
  };

  const handleShare = () => {
    const text = `My HEXACO personality profile:\n${domains.map(d => `${d}: ${scores[d].score.toFixed(1)}/5`).join('\n')}`;
    if (navigator.share) {
      navigator.share({ title: 'My HEXACO Profile', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      alert('Profile copied to clipboard!');
    }
  };

  const sortedDomains = [...domains].sort((a, b) => scores[b].score - scores[a].score);
  const highest = sortedDomains[0];
  const lowest = sortedDomains[sortedDomains.length - 1];

  return (
    <div className="min-h-screen bg-surface text-text-primary font-sans">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Your HEXACO Profile</h1>
          <p className="text-text-muted">Your unique personality dimensions revealed</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Radar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-8">
            <div className="h-80"><Radar data={radarData} options={radarOptions} /></div>
          </motion.div>

          {/* Scores */}
          <div className="space-y-3">
            {domains.map((domain, i) => {
              const score = scores[domain].score;
              const pct = ((score - 1) / 4) * 100;
              const label = domain === 'Agreeableness (versus Anger)' ? 'Agreeableness' : domain;
              const desc = score >= 3 ? domainDescriptions[domain]?.high : domainDescriptions[domain]?.low;
              return (
                <motion.div
                  key={domain}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="glass-card p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{label}</span>
                    <span className="text-accent-cyan font-bold text-sm">{score.toFixed(1)}/5</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.15 * i }}
                      className="h-1.5 rounded-full bg-gradient-to-r from-accent-indigo to-accent-cyan"
                    />
                  </div>
                  <p className="text-xs text-text-muted">{desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Insight */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-8 mb-8 text-center">
          <h2 className="text-xl font-semibold mb-3">Quick Insight</h2>
          <p className="text-text-muted">
            Your strongest dimension is <span className="text-accent-indigo font-medium">{highest === 'Agreeableness (versus Anger)' ? 'Agreeableness' : highest}</span> ({scores[highest].score.toFixed(1)}/5) and your biggest growth area is <span className="text-accent-cyan font-medium">{lowest === 'Agreeableness (versus Anger)' ? 'Agreeableness' : lowest}</span> ({scores[lowest].score.toFixed(1)}/5).
          </p>
        </motion.div>

        {/* Blurred Premium Preview + CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card p-8 mb-8 relative overflow-hidden">
          <div className="blur-sm select-none pointer-events-none mb-6">
            <h3 className="text-lg font-semibold mb-2">Deep Personality Analysis</h3>
            <p className="text-text-muted text-sm">Your unique combination of high {highest} and lower {lowest} creates a fascinating pattern that influences how you navigate relationships, career decisions, and personal growth. In particular, your approach to trust and vulnerability is shaped by...</p>
          </div>
          <div className="text-center relative z-10">
            <button onClick={showPaywall} className="btn-primary text-base py-3 px-8">
              Unlock Full AI Analysis — $19.99
            </button>
            <p className="text-xs text-text-muted mt-3">12-page AI report • Career alignment • Relationship insights • PDF</p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button onClick={handleShare} className="btn-secondary flex items-center gap-2 text-sm">
            <Share2 className="w-4 h-4" /> Share your HEXACO profile
          </button>
          <button onClick={restartTest} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4" /> Take Test Again
          </button>
        </div>

        {/* Cross-link */}
        <div className="text-center">
          <a href={ARCHETYPE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-cyan hover:text-accent-indigo transition-colors text-sm font-medium">
            Discover your Jungian Archetype too <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Results;
