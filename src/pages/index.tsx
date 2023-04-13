import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const Evaluate: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [happyEnding, setHappyEnding] = useState('');
  const [evaluation, setEvaluation] = useState('');

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    setter(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const pitch = `Most people have this problem: ${problem}\nWe have this solution: ${solution}\nSo that we have a happy ending: ${happyEnding}`;
    const response = await axios.post('/api/evaluate', { pitch });
    setEvaluation(response.data.evaluation);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Pitch Evaluator. Enter your pitch in 3 parts.
      </h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="problem"
          placeholder="Most people have this problem..."
          value={problem}
          onChange={handleChange(setProblem)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline mb-4"
        ></textarea>
        <textarea
          name="solution"
          placeholder="We have this solution..."
          value={solution}
          onChange={handleChange(setSolution)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline mb-4"
        ></textarea>
        <textarea
          name="happyEnding"
          placeholder="So that we have a happy ending..."
          value={happyEnding}
          onChange={handleChange(setHappyEnding)}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline mb-4"
        ></textarea>
        <button
          type="submit"
          className="w-full py-3 px-4 text-white bg-blue-500 rounded-lg focus:outline-none focus:shadow-outline hover:bg-blue-600"
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
