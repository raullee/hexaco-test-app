import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Share2, ExternalLink, Lock, Briefcase, Heart, Activity, Compass, TrendingUp, Users } from 'lucide-react';
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
  testDuration: number;
}

// Two-sentence summaries per domain at different levels
const domainSummaries: Record<string, Record<string, string>> = {
  'Honesty-Humility': {
    high: 'You are genuinely sincere and fair-minded — you avoid manipulation and treat others with straightforward honesty. Your natural modesty and disinterest in status-seeking make you someone people instinctively trust.',
    mid: 'You balance pragmatism with integrity — you\'re honest in most situations but can be strategic when stakes are high. You appreciate fairness but don\'t shy away from leveraging social dynamics when needed.',
    low: 'You\'re comfortable bending social conventions to get ahead and see charm and persuasion as practical tools. You have a strong drive for status and material success, and you\'re willing to play the game to achieve it.',
  },
  'Emotionality': {
    high: 'You feel things deeply — anxiety, empathy, and emotional bonds are powerful forces in your life. You seek close connections and aren\'t afraid to lean on others when you need support.',
    mid: 'You have a balanced emotional life — you feel things genuinely but don\'t get overwhelmed easily. You can be both empathetic and composed, depending on the situation.',
    low: 'You\'re emotionally resilient and self-reliant, rarely rattled by stress or uncertainty. Others may see you as stoic or tough-minded, and you tend to process challenges through logic rather than emotion.',
  },
  'Extraversion': {
    high: 'You\'re energized by social interaction — confident, lively, and naturally the center of attention. You have high social self-esteem and genuinely enjoy meeting new people and leading conversations.',
    mid: 'You can be social and outgoing when the situation calls for it, but you also value your alone time. You\'re comfortable in groups but don\'t need constant social stimulation to feel fulfilled.',
    low: 'You prefer depth over breadth in your social life — small gatherings and one-on-one conversations over large parties. You may appear reserved, but your inner world is rich and reflective.',
  },
  'Agreeableness (versus Anger)': {
    high: 'You\'re remarkably patient and forgiving — slow to anger and quick to give people the benefit of the doubt. Your gentle, flexible nature makes you a natural peacemaker in conflicts.',
    mid: 'You can be cooperative and accommodating, but you also know when to push back and stand your ground. You forgive, but you don\'t forget — and repeated offenses test your patience.',
    low: 'You\'re direct, critical, and unafraid of confrontation when you believe you\'re right. You hold people to high standards and can be stubborn, but your bluntness often cuts through social noise effectively.',
  },
  'Conscientiousness': {
    high: 'You\'re highly organized, disciplined, and driven to do things right the first time. You plan ahead, follow through on commitments, and hold yourself to exacting standards.',
    mid: 'You can be organized and focused when it matters, but you also leave room for spontaneity and flexibility. You get things done, though you may occasionally procrastinate on lower-priority tasks.',
    low: 'You\'re spontaneous and adaptable, preferring to go with the flow rather than stick to rigid plans. You may struggle with organization, but your flexibility often helps you pivot quickly when circumstances change.',
  },
  'Openness to Experience': {
    high: 'You\'re deeply curious and creative — drawn to new ideas, artistic expression, and unconventional thinking. You actively seek out novel experiences and get bored quickly with routine.',
    mid: 'You appreciate both novelty and tradition — open to new ideas but also comfortable with familiar approaches. You enjoy creative thinking without being impractical about it.',
    low: 'You prefer the tried-and-true over the experimental — practical, conventional, and grounded in what works. You value stability and predictability, and you\'re skeptical of ideas that seem too abstract or radical.',
  },
};

const getLevel = (score: number) => score >= 3.7 ? 'high' : score >= 2.3 ? 'mid' : 'low';

// Locked premium sections with tantalizing previews
const lockedSections = [
  { icon: Briefcase, title: 'Career Analysis', preview: 'Based on your high Conscientiousness and moderate Openness, you would thrive in roles that combine...' },
  { icon: Heart, title: 'Relationship Insights', preview: 'Your unique combination of Emotionality and Agreeableness suggests that in close relationships you tend to...' },
  { icon: Activity, title: 'Stress Profile', preview: 'Your emotional processing style indicates that under pressure, you\'re most likely to experience stress when...' },
  { icon: TrendingUp, title: 'Growth Roadmap', preview: 'The gap between your strongest and weakest dimensions reveals a specific developmental path that could...' },
  { icon: Compass, title: 'Decision-Making Style', preview: 'You approach decisions with a characteristic blend of intuition and analysis — specifically, your tendency to...' },
  { icon: Users, title: 'Leadership Profile', preview: 'Your HEXACO profile maps to a leadership archetype that excels at building trust but may struggle with...' },
];

// Social proof names
const socialProofData = [
  { name: 'David', city: 'Singapore' },
  { name: 'Sarah', city: 'London' },
  { name: 'Marco', city: 'Milan' },
  { name: 'Yuki', city: 'Tokyo' },
  { name: 'Priya', city: 'Mumbai' },
  { name: 'Alex', city: 'New York' },
  { name: 'Emma', city: 'Sydney' },
  { name: 'Chen', city: 'Shanghai' },
  { name: 'Fatima', city: 'Dubai' },
  { name: 'Jonas', city: 'Berlin' },
  { name: 'Maria', city: 'São Paulo' },
  { name: 'Aiden', city: 'Toronto' },
];

const Results: React.FC<Props> = ({ answers, restartTest, showPaywall, testDuration }) => {
  const [socialProofIdx, setSocialProofIdx] = useState(0);
  const [showProof, setShowProof] = useState(false);

  // Rotating social proof ticker
  useEffect(() => {
    const showInterval = setInterval(() => {
      setSocialProofIdx(i => (i + 1) % socialProofData.length);
      setShowProof(true);
      setTimeout(() => setShowProof(false), 4000);
    }, 17000);
    // Show first one after 5s
    const initialTimeout = setTimeout(() => {
      setShowProof(true);
      setTimeout(() => setShowProof(false), 4000);
    }, 5000);
    return () => { clearInterval(showInterval); clearTimeout(initialTimeout); };
  }, []);

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
        beginAtZero: true, max: 5, min: 1,
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
  const dn = (d: string) => d === 'Agreeableness (versus Anger)' ? 'Agreeableness' : d;

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec.toString().padStart(2, '0')}s`;
  };

  const proof = socialProofData[socialProofIdx];

  return (
    <div className="min-h-screen bg-surface text-text-primary font-sans relative">
      {/* Social proof ticker */}
      <AnimatePresence>
        {showProof && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="fixed top-4 right-4 z-50 glass-card px-4 py-3 text-xs text-text-muted max-w-xs"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            <span className="font-medium text-text-primary">{proof.name}</span> from {proof.city} just unlocked their full HEXACO profile
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Your HEXACO Profile</h1>
          <p className="text-text-muted">Your unique personality dimensions — a complete free overview</p>
        </motion.div>

        {/* Commitment escalation */}
        {testDuration > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mb-10">
            <p className="text-xs text-text-muted">
              You answered 60 questions in <span className="text-accent-cyan font-semibold">{formatDuration(testDuration)}</span> — here's what your answers reveal.
            </p>
          </motion.div>
        )}

        {/* ═══ FREE SECTION 1: Radar Chart ═══ */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-8">
            <h2 className="text-sm font-semibold text-accent-cyan mb-4 uppercase tracking-wider">Your Personality Radar</h2>
            <div className="h-80"><Radar data={radarData} options={radarOptions} /></div>
          </motion.div>

          {/* ═══ FREE SECTION 2: Score bars ═══ */}
          <div className="space-y-3">
            {domains.map((domain, i) => {
              const score = scores[domain].score;
              const pct = ((score - 1) / 4) * 100;
              const label = dn(domain);
              return (
                <motion.div key={domain} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="glass-card p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{label}</span>
                    <span className="text-accent-cyan font-bold text-sm">{score.toFixed(1)}/5</span>
                  </div>
                  <div className="w-full bg-white/[0.06] rounded-full h-1.5">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.15 * i }} className="h-1.5 rounded-full bg-gradient-to-r from-accent-indigo to-accent-cyan" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ═══ FREE SECTION 3: Two-sentence summaries per domain ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Your Dimension Breakdown</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {domains.map((domain, i) => {
              const score = scores[domain].score;
              const level = getLevel(score);
              const summary = domainSummaries[domain]?.[level] || '';
              return (
                <motion.div key={domain} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.08 }} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{dn(domain)}</h3>
                    <span className="text-xs text-accent-indigo font-medium">
                      {score >= 3.7 ? 'High' : score >= 2.3 ? 'Moderate' : 'Low'}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{summary}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ═══ FREE SECTION 4: Highest & Lowest with interpretation ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Key Insights</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card p-6 border-accent-indigo/20">
              <span className="text-xs text-accent-indigo font-semibold uppercase tracking-wider">Your Defining Strength</span>
              <h3 className="text-lg font-bold mt-2 mb-2">{dn(highest)} — {scores[highest].score.toFixed(1)}/5</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                This is the dimension that most defines your personality. It shapes how others perceive you and influences your default approach to challenges, relationships, and daily decisions. People high in {dn(highest).toLowerCase()} tend to be recognized for this quality by those around them.
              </p>
            </div>
            <div className="glass-card p-6 border-accent-cyan/20">
              <span className="text-xs text-accent-cyan font-semibold uppercase tracking-wider">Your Growth Edge</span>
              <h3 className="text-lg font-bold mt-2 mb-2">{dn(lowest)} — {scores[lowest].score.toFixed(1)}/5</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                This is where your biggest developmental opportunity lies. Lower scores aren't weaknesses — they're areas where intentional effort can yield disproportionate personal growth. Small improvements in {dn(lowest).toLowerCase()} often lead to breakthroughs in other areas of life.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ═══ DIVIDER: Free content ends ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center mb-6">
          <div className="border-t border-white/[0.06] pt-8">
            <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Premium Analysis</p>
            <p className="text-sm text-text-muted">Unlock the full picture with AI-powered deep insights</p>
          </div>
        </motion.div>

        {/* ═══ LOCKED SECTIONS with curiosity gap ═══ */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {lockedSections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.08 }}
              className="glass-card p-5 relative overflow-hidden cursor-pointer group"
              onClick={showPaywall}
            >
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-4 h-4 text-accent-indigo" />
                <h3 className="font-semibold text-sm">{section.title}</h3>
                <Lock className="w-3 h-3 text-text-subtle ml-auto" />
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                <span className="relative">
                  {section.preview.slice(0, 60)}
                  <span className="blur-[6px] select-none">{section.preview.slice(60)}</span>
                </span>
              </p>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface-card to-transparent" />
            </motion.div>
          ))}
        </div>

        {/* ═══ LOSS AVERSION + COMMITMENT ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="glass-card p-5 mb-6 text-center border-amber-500/10">
          <p className="text-sm text-text-muted">
            ⏳ Your 60-question analysis is stored for <span className="text-amber-400 font-semibold">24 hours</span>. After that, you'd need to retake all 60 questions.
          </p>
        </motion.div>

        {/* ═══ 3-TIER PRICING ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mb-12">
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Basic */}
            <div className="glass-card p-6 text-center">
              <h3 className="font-semibold mb-1">Basic</h3>
              <p className="text-2xl font-bold mb-3">$9.99</p>
              <ul className="text-xs text-text-muted space-y-1.5 mb-4 text-left">
                <li>✓ Facet-level breakdown</li>
                <li>✓ Extended domain analysis</li>
                <li>✓ Personality type label</li>
              </ul>
              <button onClick={showPaywall} className="btn-secondary w-full text-sm py-2">Choose Basic</button>
            </div>
            {/* Premium — highlighted */}
            <div className="glass-card p-6 text-center border-accent-indigo/30 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-accent-indigo text-white text-xs font-semibold px-3 py-1 rounded-full">Best Value</span></div>
              <h3 className="font-semibold mb-1">Premium</h3>
              <div className="flex items-baseline justify-center gap-2 mb-1">
                <span className="text-2xl font-bold">$19.99</span>
                <span className="text-xs text-text-muted line-through">$200</span>
              </div>
              <p className="text-[10px] text-text-muted mb-3">vs. career counseling session</p>
              <ul className="text-xs text-text-muted space-y-1.5 mb-4 text-left">
                <li>✓ Everything in Basic</li>
                <li>✓ AI-powered deep analysis</li>
                <li>✓ Career & relationship insights</li>
                <li>✓ Stress & leadership profile</li>
                <li>✓ Downloadable PDF report</li>
              </ul>
              <button onClick={showPaywall} className="btn-primary w-full text-sm py-2.5">Unlock Premium</button>
            </div>
            {/* Dual Bundle */}
            <div className="glass-card p-6 text-center border-accent-cyan/20">
              <h3 className="font-semibold mb-1">Dual Profile</h3>
              <div className="flex items-baseline justify-center gap-2 mb-1">
                <span className="text-2xl font-bold">$34.99</span>
                <span className="text-xs text-text-muted line-through">$49.98</span>
              </div>
              <p className="text-[10px] text-text-muted mb-3">HEXACO + Archetype Protocol</p>
              <ul className="text-xs text-text-muted space-y-1.5 mb-4 text-left">
                <li>✓ Everything in Premium</li>
                <li>✓ Jungian Archetype analysis</li>
                <li>✓ Cross-framework insights</li>
                <li>✓ Combined PDF report</li>
              </ul>
              <button onClick={showPaywall} className="btn-secondary w-full text-sm py-2">Choose Dual</button>
            </div>
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
