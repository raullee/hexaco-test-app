import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';

interface Props {
  question: { id: number; text: string; domain: string };
  onAnswer: (answer: number) => void;
  onBack: () => void;
  questionNumber: number;
  totalQuestions: number;
  canGoBack: boolean;
}

const domainColors: Record<string, string> = {
  'Honesty-Humility': '#6366F1',
  'Emotionality': '#8B5CF6',
  'Extraversion': '#22D3EE',
  'Agreeableness (versus Anger)': '#10B981',
  'Conscientiousness': '#F59E0B',
  'Openness to Experience': '#EC4899',
};

const domainLetters: Record<string, string> = {
  'Honesty-Humility': 'H',
  'Emotionality': 'E',
  'Extraversion': 'X',
  'Agreeableness (versus Anger)': 'A',
  'Conscientiousness': 'C',
  'Openness to Experience': 'O',
};

const allDomains = ['Honesty-Humility', 'Emotionality', 'Extraversion', 'Agreeableness (versus Anger)', 'Conscientiousness', 'Openness to Experience'];

const options = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

const Questionnaire: React.FC<Props> = ({ question, onAnswer, onBack, questionNumber, totalQuestions, canGoBack }) => {
  const progress = (questionNumber / totalQuestions) * 100;
  const currentDomain = question.domain;
  const color = domainColors[currentDomain] || '#6366F1';
  const minutesLeft = Math.max(1, Math.ceil((totalQuestions - questionNumber) * 0.25));

  return (
    <div className="min-h-screen bg-surface text-text-primary font-sans flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBack}
              disabled={!canGoBack}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                ~{minutesLeft} min left
              </span>
              <span className="font-medium text-text-primary">{questionNumber}/{totalQuestions}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-white/[0.06] rounded-full h-1.5">
            <motion.div
              className="h-1.5 rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Domain indicators */}
          <div className="flex items-center gap-2 mt-3">
            {allDomains.map((d) => {
              const letter = domainLetters[d];
              const isActive = d === currentDomain;
              const dc = domainColors[d];
              return (
                <span
                  key={d}
                  className="text-xs font-semibold px-2 py-0.5 rounded transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? dc + '22' : 'transparent',
                    color: isActive ? dc : '#71717A',
                    border: isActive ? `1px solid ${dc}44` : '1px solid transparent',
                  }}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="text-center"
            >
              <h1 className="text-2xl sm:text-3xl font-medium leading-relaxed mb-12">
                {question.text}
              </h1>

              <div className="flex flex-wrap justify-center gap-3">
                {options.map((opt) => (
                  <motion.button
                    key={opt.value}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onAnswer(opt.value)}
                    className="glass-card px-5 py-3 text-sm font-medium hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
                  >
                    {opt.label}
                  </motion.button>
                ))}
              </div>

              <p className="text-xs text-text-muted mt-10">
                Answer based on how you typically are, not how you want to be.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
