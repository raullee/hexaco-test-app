import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Shield, Sparkles, Heart, Briefcase, Activity, Compass, TrendingUp, Users, Check, ExternalLink } from 'lucide-react';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import Paywall from './components/Paywall';
import { hexacoQuestions } from './questions';

const ARCHETYPE_URL = 'https://archetype-protocol.vercel.app';

const domainCards = [
  { letter: 'H', name: 'Honesty-Humility', facets: ['Sincerity', 'Fairness', 'Greed Avoidance', 'Modesty'], color: '#6366F1' },
  { letter: 'E', name: 'Emotionality', facets: ['Fearfulness', 'Anxiety', 'Dependence', 'Sentimentality'], color: '#8B5CF6' },
  { letter: 'X', name: 'Extraversion', facets: ['Social Self-Esteem', 'Social Boldness', 'Sociability', 'Liveliness'], color: '#22D3EE' },
  { letter: 'A', name: 'Agreeableness', facets: ['Forgivingness', 'Gentleness', 'Flexibility', 'Patience'], color: '#10B981' },
  { letter: 'C', name: 'Conscientiousness', facets: ['Organization', 'Diligence', 'Perfectionism', 'Prudence'], color: '#F59E0B' },
  { letter: 'O', name: 'Openness to Experience', facets: ['Aesthetic Appreciation', 'Inquisitiveness', 'Creativity', 'Unconventionality'], color: '#EC4899' },
];

const discoverItems = [
  { icon: Heart, title: 'Relationship Insights', desc: 'Understand how your traits shape your closest bonds.' },
  { icon: Briefcase, title: 'Career Alignment', desc: 'Find work environments where you naturally thrive.' },
  { icon: Activity, title: 'Stress Profile', desc: 'Learn what triggers you and how to manage it.' },
  { icon: Compass, title: 'Decision-Making Style', desc: 'See how you approach choices under pressure.' },
  { icon: TrendingUp, title: 'Growth Areas', desc: 'Identify your biggest opportunities for development.' },
  { icon: Users, title: 'Leadership Style', desc: 'Discover how you influence and inspire others.' },
];

function App() {
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const [testDuration, setTestDuration] = useState<number>(0);

  const heroRef = useRef(null);
  const trustRef = useRef(null);
  const dimensionsRef = useRef(null);
  const whyRef = useRef(null);
  const discoverRef = useRef(null);
  const pricingRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-50px' });
  const trustInView = useInView(trustRef, { once: true, margin: '-50px' });
  const dimensionsInView = useInView(dimensionsRef, { once: true, margin: '-50px' });
  const whyInView = useInView(whyRef, { once: true, margin: '-50px' });
  const discoverInView = useInView(discoverRef, { once: true, margin: '-50px' });
  const pricingInView = useInView(pricingRef, { once: true, margin: '-50px' });

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQuestion < hexacoQuestions.items.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setTestDuration(Math.round((Date.now() - testStartTime) / 1000));
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const restartTest = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setTestStarted(false);
    setShowPaywall(false);
    setShowLanding(true);
    setTestDuration(0);
  };

  const startTest = () => {
    setTestStarted(true);
    setShowLanding(false);
    setTestStartTime(Date.now());
  };

  if (showPaywall) return <Paywall answers={answers} testDuration={testDuration} />;
  if (showResults) return <Results answers={answers} restartTest={restartTest} showPaywall={() => setShowPaywall(true)} testDuration={testDuration} />;
  if (testStarted) {
    return (
      <Questionnaire
        question={hexacoQuestions.items[currentQuestion]}
        onAnswer={handleAnswer}
        onBack={handleBack}
        questionNumber={currentQuestion + 1}
        totalQuestions={hexacoQuestions.items.length}
        canGoBack={currentQuestion > 0}
      />
    );
  }

  if (!showLanding) return null;

  return (
    <div className="min-h-screen bg-surface text-text-primary font-sans overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.06] bg-surface/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">HEXACO Protocol</span>
          <div className="flex items-center gap-4">
            <a href={ARCHETYPE_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1 text-sm text-text-muted hover:text-accent-cyan transition-colors">
              Quick Archetype Quiz <ArrowRight className="w-3 h-3" />
            </a>
            <button onClick={startTest} className="btn-primary text-sm py-2 px-5">Begin Assessment</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <motion.section ref={heroRef} initial={{ opacity: 0 }} animate={heroInView ? { opacity: 1 } : {}} transition={{ duration: 0.8 }} className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="inline-flex items-center gap-2 glass-card px-4 py-2 text-xs text-text-muted mb-8">
            <Shield className="w-3.5 h-3.5 text-accent-indigo" />
            Based on peer-reviewed HEXACO-PI-R model
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            The Deepest Personality<br />
            <span className="bg-gradient-to-r from-accent-indigo to-accent-cyan bg-clip-text text-transparent">Analysis Available Online</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="text-lg text-text-muted max-w-2xl mx-auto mb-10">
            60 research-backed questions. 6 core dimensions. One comprehensive profile. Powered by AI.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }}>
            <button onClick={startTest} className="group btn-primary text-base py-4 px-8">
              <span className="flex items-center gap-2">Start Your Assessment <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Trust Strip */}
      <motion.section ref={trustRef} initial={{ opacity: 0 }} animate={trustInView ? { opacity: 1 } : {}} transition={{ duration: 0.6 }} className="border-y border-white/[0.06] py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-text-muted">
          {['Developed by Ashton & Lee (2004)', '60 validated questions', 'AI-enhanced analysis', 'Used in 50+ countries'].map((item) => (
            <span key={item} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-accent-indigo" />{item}</span>
          ))}
        </div>
      </motion.section>

      {/* The 6 Dimensions */}
      <motion.section ref={dimensionsRef} initial={{ opacity: 0, y: 40 }} animate={dimensionsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">The 6 Dimensions</h2>
            <p className="text-text-muted max-w-xl mx-auto">A comprehensive framework mapping the fundamental structure of human personality.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domainCards.map((d, i) => (
              <motion.div key={d.letter} initial={{ opacity: 0, y: 20 }} animate={dimensionsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="glass-card p-6 group hover:border-white/[0.12] transition-all duration-300">
                <div className="text-3xl font-bold mb-1" style={{ color: d.color }}>{d.letter}</div>
                <h3 className="text-lg font-semibold mb-3">{d.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {d.facets.map((f) => (<span key={f} className="text-xs text-text-muted bg-white/[0.04] px-2.5 py-1 rounded-full">{f}</span>))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why HEXACO */}
      <motion.section ref={whyRef} initial={{ opacity: 0, y: 40 }} animate={whyInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why HEXACO over Big Five?</h2>
          <p className="text-text-muted text-lg leading-relaxed mb-8">
            While the Big Five has been the gold standard for decades, HEXACO adds a critical sixth dimension — <span className="text-accent-indigo font-medium">Honesty-Humility</span> — that predicts ethical behavior, workplace integrity, and relationship trustworthiness.
          </p>
          <div className="glass-card p-6 inline-flex items-start gap-4 text-left">
            <Sparkles className="w-5 h-5 text-accent-cyan mt-0.5 shrink-0" />
            <p className="text-sm text-text-muted">Research shows Honesty-Humility is the single best personality predictor of workplace counterproductivity, delinquent behavior, and relationship satisfaction — dimensions invisible to Big Five assessments.</p>
          </div>
        </div>
      </motion.section>

      {/* What You'll Discover */}
      <motion.section ref={discoverRef} initial={{ opacity: 0, y: 40 }} animate={discoverInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">What You'll Discover</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoverItems.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={discoverInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }} className="glass-card p-6">
                <item.icon className="w-5 h-5 text-accent-cyan mb-3" />
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing — 3 tiers */}
      <motion.section ref={pricingRef} initial={{ opacity: 0, y: 40 }} animate={pricingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="py-24 px-6 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Choose Your Analysis</h2>
          <p className="text-text-muted text-center mb-12">Everyone gets their core scores free. Go deeper with AI.</p>
          <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {/* Free */}
            <div className="glass-card p-7">
              <h3 className="text-lg font-semibold mb-1">Free</h3>
              <p className="text-3xl font-bold mb-5">$0</p>
              <ul className="space-y-2.5 text-sm text-text-muted">
                {['Scores across 6 domains', 'Interactive radar chart', '2-sentence per-domain summary', 'Highest & lowest dimension insight'].map(f => (
                  <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-text-subtle mt-0.5 shrink-0" />{f}</li>
                ))}
              </ul>
            </div>
            {/* Basic */}
            <div className="glass-card p-7">
              <h3 className="text-lg font-semibold mb-1">Basic</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold">$9.99</span>
              </div>
              <p className="text-xs text-text-muted mb-5">Detailed scores + summary</p>
              <ul className="space-y-2.5 text-sm text-text-muted">
                {['Everything in Free', 'Facet-level breakdown', 'Extended domain analysis', 'Personality type label'].map(f => (
                  <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-text-subtle mt-0.5 shrink-0" />{f}</li>
                ))}
              </ul>
            </div>
            {/* Premium */}
            <div className="glass-card p-7 border-accent-indigo/30 relative">
              <div className="absolute -top-3 left-6"><span className="bg-accent-indigo text-white text-xs font-semibold px-3 py-1 rounded-full">Best Value</span></div>
              <h3 className="text-lg font-semibold mb-1">Premium</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-sm text-text-muted line-through">$200</span>
              </div>
              <p className="text-xs text-text-muted mb-5">Full AI analysis + PDF</p>
              <ul className="space-y-2.5 text-sm">
                {['Everything in Basic', 'AI-powered deep analysis', 'Career & relationship insights', 'Stress management guide', 'Downloadable PDF report'].map(f => (
                  <li key={f} className="flex items-start gap-2"><Check className="w-4 h-4 text-accent-indigo mt-0.5 shrink-0" />{f}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* Bundle */}
          <div className="mt-6 max-w-4xl mx-auto">
            <div className="glass-card p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-accent-cyan/20">
              <div>
                <span className="text-xs text-accent-cyan font-semibold">BUNDLE</span>
                <h4 className="font-semibold">Dual Profile: HEXACO + Archetype Protocol</h4>
                <p className="text-sm text-text-muted">Complete personality mapping across both frameworks</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-bold">$34.99</span>
                <span className="text-sm text-text-muted ml-2 line-through">$49.98</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Cross-link CTA */}
      <section className="py-20 px-6 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-text-muted mb-4">Not ready for the deep dive?</p>
          <a href={ARCHETYPE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent-cyan hover:text-accent-indigo transition-colors font-medium">
            Try our 90-second Archetype Quiz first <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <span>© 2025 HEXACO Protocol. Based on Ashton & Lee (2004).</span>
          <div className="flex items-center gap-6">
            <a href={ARCHETYPE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">Archetype Quiz</a>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
