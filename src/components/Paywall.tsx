import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Shield, Zap, FileText, Check, Clock } from 'lucide-react';
import PremiumResults from './PremiumResults';
import { hexacoQuestions } from '../questions';

const ARCHETYPE_URL = 'https://archetype-protocol.vercel.app';

const socialProofData = [
  { name: 'Sarah', city: 'London', mins: 2 },
  { name: 'David', city: 'Singapore', mins: 5 },
  { name: 'Yuki', city: 'Tokyo', mins: 8 },
  { name: 'Marco', city: 'Milan', mins: 3 },
  { name: 'Priya', city: 'Mumbai', mins: 11 },
  { name: 'Chen', city: 'Shanghai', mins: 6 },
  { name: 'Emma', city: 'Sydney', mins: 1 },
  { name: 'Jonas', city: 'Berlin', mins: 14 },
];

interface Props {
  answers: number[];
  testDuration: number;
}

const Paywall: React.FC<Props> = ({ answers, testDuration }) => {
  const [countdown, setCountdown] = useState(24 * 60 * 60);
  const [isProcessing, setIsProcessing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unlocked, _setUnlocked] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('paid') === 'true';
  });
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium' | 'dual'>('premium');
  const [socialIdx, setSocialIdx] = useState(0);
  const [showProof, setShowProof] = useState(false);

  // Calculate scores for passing to PremiumResults
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
            let answer = answers[item.id - 1] || 3;
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

  useEffect(() => {
    const timer = setInterval(() => setCountdown(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Social proof ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setSocialIdx(i => (i + 1) % socialProofData.length);
      setShowProof(true);
      setTimeout(() => setShowProof(false), 4000);
    }, 15000);
    const initial = setTimeout(() => { setShowProof(true); setTimeout(() => setShowProof(false), 4000); }, 3000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  const formatCountdown = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec.toString().padStart(2, '0')}s`;
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec.toString().padStart(2, '0')}s`;
  };

  const tierPrices = { basic: '$9.99', premium: '$19.99', dual: '$34.99' };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: selectedTier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (unlocked) {
    return <PremiumResults scores={calculateScores()} />;
  }

  const proof = socialProofData[socialIdx];

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
            <span className="font-medium text-text-primary">{proof.name}</span> from {proof.city} unlocked their full profile <span className="text-text-subtle">{proof.mins}m ago</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Unlock Your Complete Profile</h1>
          <p className="text-text-muted">AI-powered deep analysis tailored to your unique HEXACO scores</p>
        </motion.div>

        {/* Commitment escalation */}
        {testDuration > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-center mb-6">
            <p className="text-xs text-text-muted">
              You invested <span className="text-accent-cyan font-semibold">{formatDuration(testDuration)}</span> answering 60 questions — don't let those insights go to waste.
            </p>
          </motion.div>
        )}

        {/* Loss aversion timer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="glass-card p-4 mb-8 text-center border-amber-500/10">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-text-muted">Results expire in <span className="text-amber-400 font-semibold">{formatCountdown(countdown)}</span></span>
          </div>
          <p className="text-[10px] text-text-subtle mt-1">After expiry, you'd need to retake all 60 questions.</p>
        </motion.div>

        {/* Social proof stat */}
        <p className="text-center text-xs text-text-muted mb-10">
          <span className="text-accent-cyan font-medium">2,847</span> people unlocked their full profile this month
        </p>

        {/* Blurred preview sections — curiosity gap */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid sm:grid-cols-2 gap-4 mb-10">
          {[
            { title: 'Career Analysis', preview: 'Your combination of traits suggests you would excel in environments that reward both analytical thinking and...' },
            { title: 'Relationship Insights', preview: 'In romantic relationships, your Emotionality and Agreeableness scores indicate a pattern where you tend to...' },
            { title: 'Stress Profile', preview: 'Under high pressure, your personality type is most likely to experience stress manifesting as...' },
            { title: 'Leadership Profile', preview: 'You lead through influence rather than authority — your natural approach to team dynamics involves...' },
          ].map((s) => (
            <div key={s.title} className="glass-card p-5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-3.5 h-3.5 text-accent-indigo" />
                <h3 className="font-semibold text-sm">{s.title}</h3>
              </div>
              <p className="text-sm text-text-muted">
                {s.preview.slice(0, 50)}
                <span className="blur-[6px] select-none">{s.preview.slice(50)}</span>
              </p>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#141416] to-transparent" />
            </div>
          ))}
        </motion.div>

        {/* ═══ 3-TIER PRICING ═══ */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-semibold text-center mb-6">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {/* Basic */}
            <div
              onClick={() => setSelectedTier('basic')}
              className={`glass-card p-6 cursor-pointer transition-all duration-200 ${selectedTier === 'basic' ? 'border-white/20 ring-1 ring-white/10' : 'hover:border-white/10'}`}
            >
              <h3 className="font-semibold mb-1">Basic</h3>
              <p className="text-2xl font-bold mb-1">$9.99</p>
              <p className="text-[10px] text-text-muted mb-4">Scores + extended summary</p>
              <ul className="text-xs text-text-muted space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-text-subtle mt-0.5 shrink-0" />Facet-level breakdown (24 facets)</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-text-subtle mt-0.5 shrink-0" />Extended domain analysis</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-text-subtle mt-0.5 shrink-0" />Personality type label</li>
              </ul>
            </div>

            {/* Premium — default selected */}
            <div
              onClick={() => setSelectedTier('premium')}
              className={`glass-card p-6 cursor-pointer transition-all duration-200 relative ${selectedTier === 'premium' ? 'border-accent-indigo/40 ring-1 ring-accent-indigo/20' : 'border-accent-indigo/20 hover:border-accent-indigo/30'}`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-accent-indigo text-white text-xs font-semibold px-3 py-1 rounded-full">Best Value</span></div>
              <h3 className="font-semibold mb-1">Premium</h3>
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-2xl font-bold">$19.99</span>
                <span className="text-xs text-text-muted line-through">$200</span>
              </div>
              <p className="text-[10px] text-text-muted mb-4">vs. career counseling session</p>
              <ul className="text-xs text-text-muted space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-accent-indigo mt-0.5 shrink-0" />Everything in Basic</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-accent-indigo mt-0.5 shrink-0" />AI-powered deep analysis</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-accent-indigo mt-0.5 shrink-0" />Career & relationship insights</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-accent-indigo mt-0.5 shrink-0" />Stress & leadership profile</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-accent-indigo mt-0.5 shrink-0" />12-page downloadable PDF</li>
              </ul>
            </div>

            {/* Dual Bundle */}
            <div
              onClick={() => setSelectedTier('dual')}
              className={`glass-card p-6 cursor-pointer transition-all duration-200 ${selectedTier === 'dual' ? 'border-accent-cyan/30 ring-1 ring-accent-cyan/15' : 'border-accent-cyan/10 hover:border-accent-cyan/20'}`}
            >
              <h3 className="font-semibold mb-1">Dual Profile</h3>
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-2xl font-bold">$34.99</span>
                <span className="text-xs text-text-muted line-through">$49.98</span>
              </div>
              <p className="text-[10px] text-text-muted mb-4">HEXACO + Archetype Protocol</p>
              <ul className="text-xs text-text-muted space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-accent-cyan mt-0.5 shrink-0" />Everything in Premium</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-accent-cyan mt-0.5 shrink-0" />Jungian Archetype analysis</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-accent-cyan mt-0.5 shrink-0" />Cross-framework insights</li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-accent-cyan mt-0.5 shrink-0" />Combined PDF report</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="text-center mb-8">
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="bg-gradient-to-r from-accent-indigo to-accent-indigo/80 text-white font-semibold py-4 px-10 rounded-xl text-lg hover:shadow-lg hover:shadow-accent-indigo/25 transition-all duration-300 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              `Unlock My Full Analysis — ${tierPrices[selectedTier]}`
            )}
          </button>
        </motion.div>

        {/* Includes */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-text-muted mb-10">
          {['12-page AI report', 'Career alignment', 'Relationship insights', 'Downloadable PDF'].map(i => (
            <span key={i} className="flex items-center gap-1"><Check className="w-3 h-3 text-accent-indigo" />{i}</span>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-8 text-xs text-text-muted mb-10">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" />256-bit encrypted</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" />One-time payment</span>
          <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />Instant access</span>
        </div>

        {/* Dual bundle cross-link */}
        {selectedTier === 'dual' && (
          <div className="text-center text-xs text-text-muted">
            Includes full access to <a href={ARCHETYPE_URL} target="_blank" rel="noopener noreferrer" className="text-accent-cyan hover:underline">Archetype Protocol</a> premium analysis
          </div>
        )}
      </div>
    </div>
  );
};

export default Paywall;
