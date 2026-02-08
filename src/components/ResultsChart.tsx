import React from 'react';
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
import { motion } from 'framer-motion';
import { Brain, TrendingUp } from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Scores {
  [domain: string]: {
    score: number;
    facets: { [facet: string]: number };
  };
}

interface Props {
  scores: Scores;
}

const ResultsChart: React.FC<Props> = ({ scores }) => {
  
  // Extract only the 6 main domain scores for radar chart
  const domains = Object.keys(scores);
  const domainScores = domains.map(domain => scores[domain].score);
  
  const radarData = {
    labels: domains.map(domain => 
      domain === 'Agreeableness (versus Anger)' ? 'Agreeableness' : domain
    ),
    datasets: [
      {
        label: 'Your Personality Profile',
        data: domainScores,
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
        borderColor: 'rgba(168, 85, 247, 0.8)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(34, 197, 194, 1)',
        pointBorderColor: 'rgba(34, 197, 194, 1)',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        min: 1,
        ticks: {
          stepSize: 1,
          color: '#94a3b8',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.3)',
        },
        angleLines: {
          color: 'rgba(148, 163, 184, 0.3)',
        },
        pointLabels: {
          color: '#f1f5f9',
          font: {
            size: 14,
            weight: 'bold' as const
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        borderColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed.r.toFixed(2)}/5`;
          }
        }
      }
    }
  };

  const getDomainDescription = (domain: string, score: number): string => {
    const level = score >= 4.5 ? 'Very High' : score >= 3.5 ? 'High' : score >= 2.5 ? 'Moderate' : score >= 1.5 ? 'Low' : 'Very Low';
    
    const descriptions: {[key: string]: {[level: string]: string}} = {
      'Honesty-Humility': {
        'Very High': 'You are exceptionally sincere, fair, and modest in your dealings with others.',
        'High': 'You tend to be honest, humble, and avoid taking advantage of others.',
        'Moderate': 'You balance sincerity with pragmatism in social situations.',
        'Low': 'You may be more willing to bend rules or use flattery to achieve your goals.',
        'Very Low': 'You tend to be more manipulative and self-serving in your approach.'
      },
      'Emotionality': {
        'Very High': 'You experience emotions deeply and are very sensitive to stress and anxiety.',
        'High': 'You tend to be emotionally reactive and seek emotional support from others.',
        'Moderate': 'You have a balanced emotional response to life\'s challenges.',
        'Low': 'You tend to be emotionally resilient and less affected by stress.',
        'Very Low': 'You are exceptionally calm and rarely experience strong emotional reactions.'
      },
      'Extraversion': {
        'Very High': 'You are extremely outgoing, confident, and energetic in social situations.',
        'High': 'You enjoy socializing, feel comfortable in groups, and tend to be optimistic.',
        'Moderate': 'You balance social engagement with some preference for quiet time.',
        'Low': 'You tend to be more introverted and prefer smaller social circles.',
        'Very Low': 'You strongly prefer solitude and find social situations draining.'
      },
      'Agreeableness (versus Anger)': {
        'Very High': 'You are extremely patient, forgiving, and gentle in your interactions.',
        'High': 'You tend to be cooperative, trusting, and quick to forgive others.',
        'Moderate': 'You balance being agreeable with standing up for yourself.',
        'Low': 'You may be more critical and less willing to accommodate others.',
        'Very Low': 'You tend to be quite argumentative and quick to anger.'
      },
      'Conscientiousness': {
        'Very High': 'You are extremely organized, disciplined, and perfectionist in your approach.',
        'High': 'You tend to be well-organized, hardworking, and reliable.',
        'Moderate': 'You balance structure with flexibility in your daily life.',
        'Low': 'You may be more spontaneous and less concerned with organization.',
        'Very Low': 'You tend to be quite disorganized and impulsive in your decisions.'
      },
      'Openness to Experience': {
        'Very High': 'You are extremely curious, creative, and open to new ideas and experiences.',
        'High': 'You enjoy intellectual pursuits, creativity, and novel experiences.',
        'Moderate': 'You balance openness to new things with appreciation for tradition.',
        'Low': 'You tend to prefer familiar experiences and conventional approaches.',
        'Very Low': 'You strongly prefer routine and are resistant to change.'
      }
    };
    
    return descriptions[domain]?.[level] || 'No description available.';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-purple via-electric-blue to-neon-purple text-warm-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 card px-6 py-3 mb-6">
            <Brain className="w-6 h-6 text-neon-purple" />
            <span className="text-bright-cyan font-semibold">Your HEXACO Results</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gradient">
            Personality Profile
          </h1>
          <p className="text-xl text-warm-white/80 max-w-2xl mx-auto">
            Your unique combination of personality traits revealed through scientific analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card p-8"
          >
            <h2 className="text-2xl font-bold text-center mb-6 text-neon-purple">
              Personality Radar
            </h2>
            <div className="h-96 w-full">
              <Radar data={radarData} options={radarOptions} />
            </div>
            <p className="text-center text-warm-white/70 mt-4 text-sm">
              Each axis represents one of the six HEXACO personality dimensions
            </p>
          </motion.div>

          {/* Score Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold mb-6 text-neon-purple flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Your Scores
            </h2>
            {domains.map((domain, index) => {
              const score = scores[domain].score;
              const percentage = (score / 5) * 100;
              const displayName = domain === 'Agreeableness (versus Anger)' ? 'Agreeableness' : domain;
              
              return (
                <motion.div
                  key={domain}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg text-warm-white">
                      {displayName}
                    </h3>
                    <span className="text-bright-cyan font-bold text-xl">
                      {score.toFixed(1)}/5
                    </span>
                  </div>
                  
                  <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.2 * index }}
                      className="bg-gradient-to-r from-neon-purple to-bright-cyan h-3 rounded-full"
                    />
                  </div>
                  
                  <p className="text-warm-white/80 text-sm leading-relaxed">
                    {getDomainDescription(domain, score)}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResultsChart;
