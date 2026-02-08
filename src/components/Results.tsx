import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { hexacoQuestions } from '../questions';
import ResultsChart from './ResultsChart';
import PersonalityHook from './PersonalityHook';

interface Props {
  answers: number[];
  restartTest: () => void;
  showPaywall: () => void;
}

const Results: React.FC<Props> = ({ answers, restartTest, showPaywall }) => {
  const { t } = useTranslation();
  
  const calculateScores = () => {
    const scores: {
      [domain: string]: {
        score: number;
        facets: { [facet: string]: number };
      };
    } = {};

    hexacoQuestions.scales.forEach((scale) => {
      let domainTotal = 0;
      const facetScores: { [facet: string]: number } = {};

      scale.facets.forEach((facet) => {
        let facetTotal = 0;
        facet.items.forEach((itemId) => {
          const item = hexacoQuestions.items.find((i) => i.id === itemId);
          if (item) {
            let answer = answers[item.id - 1];
            if (item.reverse_scored) {
              answer = 6 - answer;
            }
            facetTotal += answer;
          }
        });
        const facetScore = facetTotal / facet.items.length;
        facetScores[facet.name] = facetScore;
        domainTotal += facetScore;
      });

      scores[scale.domain] = {
        score: domainTotal / scale.facets.length,
        facets: facetScores,
      };
    });

    return scores;
  };

  const scores = calculateScores();

  return (
    <div className="min-h-screen">
      <ResultsChart scores={scores} />
      <PersonalityHook scores={scores} showPaywall={showPaywall} />
      
      {/* Restart Test Button */}
      <div className="bg-deep-purple/50 py-12">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={restartTest}
            className="flex items-center gap-3 mx-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-warm-white hover:text-white transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="font-semibold">{t('restart_test') || 'Take Test Again'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Results;
