import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  question: {
    id: number;
    text: string;
  };
  onAnswer: (answer: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const Questionnaire: React.FC<Props> = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  const { t } = useTranslation();
  const progress = (questionNumber / totalQuestions) * 100;
  
  const options = [
    { value: 1, label: t('response_options.strongly_disagree'), color: 'from-red-500 to-red-600' },
    { value: 2, label: t('response_options.disagree'), color: 'from-orange-500 to-red-500' },
    { value: 3, label: t('response_options.neutral'), color: 'from-gray-500 to-gray-600' },
    { value: 4, label: t('response_options.agree'), color: 'from-blue-500 to-cyan-500' },
    { value: 5, label: t('response_options.strongly_agree'), color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="min-h-screen text-warm-white">
      {/* Header */}
      <div className="sticky top-0 bg-deep-purple/90 backdrop-blur-sm border-b border-white/10 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-bright-cyan hover:text-neon-purple transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-4 text-sm text-warm-white/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>~{Math.max(0, totalQuestions - questionNumber)} min left</span>
              </div>
              <span className="text-bright-cyan font-semibold">
                {questionNumber}/{totalQuestions}
              </span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-neon-purple to-bright-cyan h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-6 py-12">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mx-auto text-center"
        >
          {/* Question Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 card px-4 py-2 text-sm text-warm-white/80 mb-6">
              <Brain className="w-4 h-4 text-neon-purple" />
              <span>{t('question_of', { current: questionNumber, total: totalQuestions })}</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-medium text-warm-white mb-6 leading-relaxed max-w-2xl mx-auto">
              {question.text}
            </h1>
            
            <p className="text-warm-white/60 max-w-xl mx-auto">
              Rate how well this statement describes you personally
            </p>
          </motion.div>

          {/* Answer Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 mb-8"
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 8px 32px rgba(168, 85, 247, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAnswer(option.value)}
                className="group w-full card hover:border-white/30 p-6 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {option.value}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-lg font-medium text-warm-white group-hover:text-white transition-colors">
                      {option.label}
                    </p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-white/30 group-hover:border-neon-purple transition-colors">
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-neon-purple to-bright-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card p-4 max-w-md mx-auto"
          >
            <p className="text-sm text-warm-white/70 leading-relaxed">
              💡 <strong>Tip:</strong> Answer based on how you typically are, not how you want to be. 
              There are no right or wrong answers.
            </p>
          </motion.div>
        </motion.div>

        {/* Question Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex gap-2 mt-8 flex-wrap justify-center max-w-md"
        >
          {Array.from({ length: totalQuestions }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index < questionNumber - 1
                  ? "bg-bright-cyan"
                  : index === questionNumber - 1
                  ? "bg-neon-purple"
                  : "bg-white/20"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Questionnaire;