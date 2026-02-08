import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, ArrowRight, Star, Zap, Eye, Target, ExternalLink } from 'lucide-react';
import Questionnaire from './components/Questionnaire';
import Results from './components/Results';
import Paywall from './components/Paywall';
import { hexacoQuestions } from './questions';
import { useTranslation } from 'react-i18next';

// Test Bypass Component
function TestBypass() {
  const [bypassId, setBypassId] = useState("");
  const [showBypass, setShowBypass] = useState(false);

  const handleBypass = () => {
    if (bypassId === "HEXACO2026") {
      // Trigger bypass mode - could set a state or localStorage
      localStorage.setItem('hexacoBypass', 'true');
      window.location.reload();
    }
  };

  if (!showBypass) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowBypass(true)}
          className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 bg-gray-800/50 rounded"
        >
          Dev
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 p-4 rounded-lg border border-gray-700">
      <input
        type="text"
        value={bypassId}
        onChange={(e) => setBypassId(e.target.value)}
        placeholder="Bypass ID"
        className="bg-gray-800 text-white px-2 py-1 rounded text-sm mb-2 w-full"
      />
      <div className="flex gap-2">
        <button
          onClick={handleBypass}
          className="bg-bright-cyan text-white px-2 py-1 rounded text-xs hover:bg-bright-cyan/80"
        >
          Test
        </button>
        <button
          onClick={() => setShowBypass(false)}
          className="bg-gray-700 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function App() {
  const { t, i18n } = useTranslation();
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // Landing page refs
  const heroRef = useRef(null);
  const painRef = useRef(null);
  const solutionRef = useRef(null);
  const proofRef = useRef(null);
  const ctaRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const painInView = useInView(painRef, { once: true, margin: "-100px" });
  const solutionInView = useInView(solutionRef, { once: true, margin: "-100px" });
  const proofInView = useInView(proofRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAnswer = (answer: number) => {
    setAnswers([...answers, answer]);
    if (currentQuestion < hexacoQuestions.items.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const restartTest = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
    setTestStarted(false);
    setShowPaywall(false);
    setShowLanding(true);
  };

  const startTest = () => {
    setTestStarted(true);
    setShowLanding(false);
  }

  const handleShowPaywall = () => {
    setShowPaywall(true);
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (showPaywall) {
    return <Paywall />;
  }

  if (showResults) {
    return <Results answers={answers} restartTest={restartTest} showPaywall={handleShowPaywall} />;
  }

  if (testStarted) {
    return (
      <Questionnaire
        question={hexacoQuestions.items[currentQuestion]}
        onAnswer={handleAnswer}
        questionNumber={currentQuestion + 1}
        totalQuestions={hexacoQuestions.items.length}
      />
    );
  }

  // Landing Page
  if (showLanding) {
    return (
      <>
        <div className="min-h-screen text-warm-white font-sans overflow-x-hidden">
          {/* Language Toggle */}
          <div className="absolute top-4 right-4 z-50 flex gap-2">
            <button 
              onClick={() => changeLanguage('en')}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm transition-colors"
            >
              EN
            </button>
            <button 
              onClick={() => changeLanguage('ms')}
              className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm transition-colors"
            >
              MS
            </button>
          </div>

          {/* Hero Section */}
          <motion.section
            ref={heroRef}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 1 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-deep-purple via-electric-blue to-neon-purple opacity-50" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-purple/20 rounded-full blur-xl"
              />
              <motion.div
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 180, 0]
                }}
                transition={{ 
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-bright-cyan/20 rounded-full blur-xl"
              />
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={heroInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 max-w-4xl"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-6"
              >
                <Brain className="w-24 h-24 text-neon-purple mx-auto" />
              </motion.div>
              
              <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 text-gradient leading-tight">
                Unlock Your
                <br />
                <span className="text-5xl md:text-6xl">Hidden Psychology</span>
              </h1>
              
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl md:text-2xl text-warm-white/80 mb-8 leading-relaxed"
              >
                The HEXACO assessment reveals personality traits that most people never discover about themselves.
                <br />
                <span className="text-bright-cyan font-semibold">What you don't know about yourself could be holding you back.</span>
              </motion.p>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              >
                <button
                  onClick={() => scrollToSection(painRef)}
                  className="btn-primary"
                >
                  <span className="flex items-center gap-2">
                    Discover Hidden Traits
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                
                <button className="group flex items-center gap-2 text-bright-cyan hover:text-neon-purple transition-colors">
                  <Eye className="w-6 h-6" />
                  <span className="font-semibold">Scientific Personality Test</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={heroInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center justify-center gap-8 text-sm text-warm-white/60"
              >
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-neon-purple" />
                  <span>5,600+ Assessments Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-bright-cyan" />
                  <span>15-min Deep Analysis</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Pain Point Section */}
          <motion.section
            ref={painRef}
            initial={{ opacity: 0, y: 100 }}
            animate={painInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="py-20 px-6 bg-gradient-to-b from-deep-purple/50 to-electric-blue/30"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={painInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-serif font-bold mb-8 text-neon-purple"
              >
                The Psychology You've Never Explored
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={painInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid md:grid-cols-3 gap-8 mb-12"
              >
                <div className="card p-6">
                  <h3 className="text-xl font-bold text-red-400 mb-3">Hidden Patterns</h3>
                  <p className="text-warm-white/80">
                    Traditional personality tests miss crucial traits like Honesty-Humility that predict behavior better than the Big Five.
                  </p>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-xl font-bold text-red-400 mb-3">Blind Spots</h3>
                  <p className="text-warm-white/80">
                    Your unconscious emotional patterns, cognitive biases, and hidden motivations remain unexplored.
                  </p>
                </div>
                
                <div className="card p-6">
                  <h3 className="text-xl font-bold text-red-400 mb-3">Missed Potential</h3>
                  <p className="text-warm-white/80">
                    Without deep self-awareness, you're making decisions based on incomplete information about yourself.
                  </p>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={painInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-warm-white/90 leading-relaxed"
              >
                Most people think they know themselves. Research shows they don't.
                <span className="block text-2xl font-bold text-bright-cyan mt-4">
                  What don't you know about yourself?
                </span>
              </motion.p>
            </div>
          </motion.section>

          {/* Solution Section */}
          <motion.section
            ref={solutionRef}
            initial={{ opacity: 0, y: 100 }}
            animate={solutionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="py-20 px-6 bg-gradient-to-b from-electric-blue/30 to-deep-purple/50"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={solutionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-serif font-bold mb-8 text-neon-purple"
              >
                The HEXACO Advantage
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={solutionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-warm-white/90 mb-12 leading-relaxed"
              >
                The most advanced personality framework available to the public. 
                Used by researchers worldwide, now packaged for personal insight and growth.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={solutionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="grid md:grid-cols-2 gap-8"
              >
                <div className="card p-8 bg-gradient-to-br from-neon-purple/20 to-bright-cyan/20 border-neon-purple/30">
                  <Brain className="w-12 h-12 text-neon-purple mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold mb-4">Six Core Dimensions</h3>
                  <p className="text-warm-white/80">
                    Honesty-Humility, Emotionality, eXtraversion, Agreeableness, 
                    Conscientiousness, and Openness - revealing patterns invisible to other tests.
                  </p>
                </div>

                <div className="card p-8 bg-gradient-to-br from-bright-cyan/20 to-electric-blue/20 border-bright-cyan/30">
                  <Target className="w-12 h-12 text-bright-cyan mb-4 mx-auto" />
                  <h3 className="text-2xl font-bold mb-4">Actionable Insights</h3>
                  <p className="text-warm-white/80">
                    Detailed analysis of your cognitive patterns, emotional responses, 
                    and behavioral tendencies with specific recommendations for growth.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Social Proof */}
          <motion.section
            ref={proofRef}
            initial={{ opacity: 0, y: 100 }}
            animate={proofInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="py-20 px-6 bg-deep-purple/50"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={proofInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl md:text-4xl font-serif font-bold mb-12 text-neon-purple"
              >
                Trusted by Psychology Researchers Worldwide
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={proofInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid md:grid-cols-3 gap-8"
              >
                <div className="card p-6">
                  <div className="flex text-neon-purple mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-warm-white/80 mb-4">
                    "Revealed personality patterns I never knew existed. The Honesty-Humility dimension was eye-opening."
                  </p>
                  <p className="text-bright-cyan font-semibold">- Dr. Sarah Chen, Psychologist</p>
                </div>

                <div className="card p-6">
                  <div className="flex text-neon-purple mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-warm-white/80 mb-4">
                    "More accurate than any personality test I've taken. Changed how I understand my decision-making."
                  </p>
                  <p className="text-bright-cyan font-semibold">- Marcus Rodriguez, CEO</p>
                </div>

                <div className="card p-6">
                  <div className="flex text-neon-purple mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-warm-white/80 mb-4">
                    "The insights into my emotional patterns were incredibly detailed and accurate."
                  </p>
                  <p className="text-bright-cyan font-semibold">- Prof. Elena Vasquez</p>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            ref={ctaRef}
            initial={{ opacity: 0, y: 100 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="py-20 px-6 bg-gradient-to-r from-neon-purple to-bright-cyan"
          >
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white"
              >
                Ready to Discover Your Hidden Psychology?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-white/90 mb-8 leading-relaxed"
              >
                Take the most comprehensive personality assessment available
                <br />
                <span className="font-bold">Get insights that will change how you see yourself</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <button
                  onClick={startTest}
                  className="group bg-white text-deep-purple font-bold py-6 px-12 rounded-lg text-xl hover:scale-105 transition-all duration-300 shadow-2xl"
                >
                  <span className="flex items-center gap-3">
                    Start HEXACO Assessment
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-white/80 mt-6 text-sm"
              >
                ⚡ 15-minute assessment • 🧠 Research-based • 💎 Detailed insights: $19
                <br />
                <span className="text-xs">
                  <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" className="underline hover:text-white flex items-center gap-1 justify-center mt-2">
                    Also check out our Artist Archetype Test
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </span>
              </motion.p>
            </div>
          </motion.section>
        </div>
        
        <TestBypass />
      </>
    );
  }

  // Fallback (shouldn't reach here)
  return (
    <div className="container mx-auto p-6">
      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={() => changeLanguage('en')}
          className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm transition-colors"
        >
          EN
        </button>
        <button 
          onClick={() => changeLanguage('ms')}
          className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-sm transition-colors"
        >
          MS
        </button>
      </div>
      <h1 className="text-4xl font-bold text-center mb-6">{t('hexaco_title')}</h1>
      <p className="text-center mb-8">{t('instructions')}</p>
      <div className="text-center">
        <button onClick={startTest} className="btn-primary">
          {t('start_test')}
        </button>
      </div>
    </div>
  )
}

export default App;