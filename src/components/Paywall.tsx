import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, Lock, Shield, Zap, FileText, Check } from 'lucide-react';
import PremiumResults from './PremiumResults';

const stripePromise = loadStripe(
  (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_PLACEHOLDER'
);

const Paywall: React.FC = () => {
  const [countdown, setCountdown] = useState(24 * 60 * 60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCountdown(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec.toString().padStart(2, '0')}s`;
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');
      // Demo mode — simulate payment
      await new Promise(r => setTimeout(r, 2000));
      setUnlocked(true);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (unlocked) {
    // Show premium results with stored scores
    return <PremiumResults scores={{}} />;
  }

  return (
    <div className="min-h-screen bg-surface text-text-primary font-sans">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button onClick={() => window.history.back()} className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Results
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Heading */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Unlock Your Complete Profile</h1>
          <p className="text-text-muted">AI-powered deep analysis tailored to your unique HEXACO scores</p>
        </motion.div>

        {/* Urgency */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-4 mb-8 text-center border-amber-500/20">
          <p className="text-sm text-text-muted">
            Your results are stored for <span className="text-amber-400 font-semibold">{formatCountdown(countdown)}</span>
          </p>
        </motion.div>

        {/* Social proof */}
        <p className="text-center text-xs text-text-muted mb-10">
          <span className="text-accent-cyan font-medium">2,847</span> people unlocked their full profile this month
        </p>

        {/* Blurred preview */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="w-8 h-8 text-accent-indigo mx-auto mb-2" />
              <p className="text-sm font-medium">Premium Content</p>
            </div>
          </div>
          <div className="blur-md select-none">
            <p className="text-sm text-text-muted leading-relaxed">Your personality profile reveals a unique interplay between high conscientiousness and moderate openness that shapes how you approach both routine tasks and novel challenges. In relationships, you tend to value reliability and consistency, while your emotional processing style suggests you internalize stress before expressing it. Career-wise, you would excel in structured environments that still allow creative problem-solving...</p>
          </div>
        </motion.div>

        {/* Anchor pricing */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mb-8">
          <p className="text-xs text-text-muted mb-2">Career counseling session: <span className="line-through">$500</span></p>
          <p className="text-4xl font-bold">
            $19.99
          </p>
          <p className="text-xs text-text-muted mt-1">One-time payment · Instant access</p>
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
              'Unlock My Full Analysis — $19.99'
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
        <div className="flex justify-center gap-8 text-xs text-text-muted">
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" />256-bit encrypted</span>
          <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" />One-time payment</span>
          <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />Instant access</span>
        </div>
      </div>
    </div>
  );
};

export default Paywall;
