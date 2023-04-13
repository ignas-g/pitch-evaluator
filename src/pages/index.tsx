import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const Evaluate: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [happyEnding, setHappyEnding] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const pitch = `Most people have this problem: ${problem}\nWe have this solution: ${solution}\nSo that we have a happy ending: ${happyEnding}`;
    const response = await axios.post('/api/evaluate', { pitch });
    setEvaluation(response.data.evaluation);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Pitch Evaluator. Enter your pitch in 3 parts.
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="problem"
          placeholder="Most people have this problem..."
          value={problem}
          onChange={handleChange(setProblem)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
        ></textarea>
        <textarea
          name="solution"
          placeholder="We have this solution..."
          value={solution}
          onChange={handleChange(setSolution)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
        ></textarea>
        <textarea
          name="happyEnding"
          placeholder="So that we have a happy ending..."
          value={happyEnding}
          onChange={handleChange(setHappyEnding)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
        ></textarea>
        {loading && (
          <div className="h-2 w-full bg-blue-200 mb-4">
            <div className="h-full w-1/2 bg-blue-500 animate-ping"></div>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-4 text-white ${
            loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
          } rounded-lg focus:outline-none focus:shadow-outline`}
        >
          Evaluate
        </button>
      </form>
      {evaluation && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Evaluation:</h2>
          <p className="text-gray-700">{evaluation}</p>
        </div>
      )}
    </div>
  );
};

export default Evaluate;
