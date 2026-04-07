import { useState } from 'react';
import { FileText, Check, X, AlertCircle, Info } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  help?: string;
}

const QUESTIONS: Question[] = [
  { id: 'days', text: 'Have you been physically present in the UAE for 183+ days in the last 12 months?', help: 'This is the primary test for tax residency under the new rules effective March 2023.' },
  { id: 'home', text: 'Do you have a permanent home in the UAE?', help: 'Property ownership, rental agreement, or employer-provided accommodation.' },
  { id: 'visa', text: 'Do you hold a valid UAE residence visa?', help: 'Employment visa, investor visa, golden visa, or family visa.' },
  { id: 'income', text: 'Is your primary source of income from the UAE?', help: 'Employment income, business income, or investment income earned in the UAE.' },
  { id: 'family', text: 'Is your immediate family based in the UAE?', help: 'Spouse and/or dependent children living with you in the UAE.' },
];

export default function TaxResidencyChecker() {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (id: string, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const answeredCount = Object.values(answers).filter((v) => v !== null && v !== undefined).length;
  const yesCount = Object.values(answers).filter((v) => v === true).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  const getResult = () => {
    if (answers.days && answers.visa) return 'likely_resident';
    if (yesCount >= 3) return 'likely_resident';
    if (yesCount >= 2) return 'possible_resident';
    return 'unlikely_resident';
  };

  const result = getResult();

  return (
    <div className="bg-white rounded-card border border-gray-200 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-primary to-primary-600 flex items-center gap-2 text-white">
        <FileText size={16} />
        <h3 className="text-sm font-bold">UAE Tax Residency Checker</h3>
      </div>

      <div className="p-5">
        <p className="text-xs text-gray-500 mb-4">
          Answer these questions to get an indication of your UAE tax residency status under the new rules (effective March 2023).
        </p>

        <div className="space-y-3 mb-5">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700 font-medium mb-2">{q.text}</p>
              {q.help && (
                <p className="text-label text-gray-400 mb-2 flex items-start gap-1">
                  <Info size={11} className="shrink-0 mt-0.5" />
                  {q.help}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAnswer(q.id, true)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-button text-xs font-medium border transition-colors ${
                    answers[q.id] === true
                      ? 'border-primary bg-primary-50 text-primary'
                      : 'border-gray-200 text-gray-500 hover:border-primary/30'
                  }`}
                >
                  <Check size={12} /> Yes
                </button>
                <button
                  onClick={() => handleAnswer(q.id, false)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-button text-xs font-medium border transition-colors ${
                    answers[q.id] === false
                      ? 'border-error bg-error-light text-error'
                      : 'border-gray-200 text-gray-500 hover:border-error/30'
                  }`}
                >
                  <X size={12} /> No
                </button>
              </div>
            </div>
          ))}
        </div>

        {allAnswered && (
          <div className={`rounded-xl p-4 border animate-fade-in ${
            result === 'likely_resident'
              ? 'bg-primary-50 border-primary-100'
              : result === 'possible_resident'
              ? 'bg-warning-light border-yellow-200'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <h4 className={`text-sm font-bold mb-1 ${
              result === 'likely_resident' ? 'text-primary' :
              result === 'possible_resident' ? 'text-warning-dark' : 'text-gray-700'
            }`}>
              {result === 'likely_resident' && '✓ Likely a UAE Tax Resident'}
              {result === 'possible_resident' && '⚠ Possibly a UAE Tax Resident'}
              {result === 'unlikely_resident' && 'Unlikely to be a UAE Tax Resident'}
            </h4>
            <p className="text-xs text-gray-600 mb-2">
              {result === 'likely_resident' && 'Based on your answers, you likely qualify as a UAE tax resident. You may be eligible for a Tax Residency Certificate (TRC) from the Federal Tax Authority.'}
              {result === 'possible_resident' && 'Your situation may qualify you as a UAE tax resident, but additional factors need consideration. We recommend consulting a tax advisor.'}
              {result === 'unlikely_resident' && 'Based on your answers, you may not currently qualify as a UAE tax resident. Consider spending more time in the UAE or obtaining proper documentation.'}
            </p>
            <div className="flex items-start gap-2 text-label text-gray-400">
              <AlertCircle size={11} className="shrink-0 mt-0.5" />
              This is for guidance only. Tax residency determination requires professional assessment.
            </div>
          </div>
        )}

        {!allAnswered && (
          <p className="text-label text-gray-400 text-center">
            Answer all {QUESTIONS.length} questions to see your result ({answeredCount}/{QUESTIONS.length} answered)
          </p>
        )}
      </div>
    </div>
  );
}
