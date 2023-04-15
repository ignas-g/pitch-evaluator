import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Head from 'next/head';

const Evaluate: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [happyEnding, setHappyEnding] = useState('');
  const [evaluation, setEvaluation] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => (e: ChangeEvent<HTMLTextAreaElement>) => {
    setter(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!problem || !solution || !happyEnding) {
      setError('Please fill in all the fields.');
      return;
    }
    setLoading(true);
    setEvaluation([]);
    try {
      const pitch = `Most people have this problem: ${problem}\nWe have this solution: ${solution}\nSo that we have a happy ending: ${happyEnding}`;

      const apiGatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL as string;
      const response = await axios.post(apiGatewayUrl, {pitch});
      const data = JSON.parse(response.data.body);
      const array = data.evaluation.split('\n');
      setEvaluation(array);
    } catch (err) {
      console.error(err);
      setError((err as any)?.response?.data?.message || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-8 sm:py-24 sm:px-12 lg:px-16">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Pitch Evaluator. Enter your pitch in 3 parts.
      </h1>
      <Head>
        <title>Pitch Evaluator</title>
      </Head>

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
          <div className="flex items-center justify-center mb-4">
            <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        )}
        {!loading && (
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 text-white ${
              loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
            } rounded-lg focus:outline-none focus:shadow-outline`}
          >
            Evaluate
          </button>
        )}
      </form>
      {error && (
        <div className="mt-4 text-red-500 font-semibold">{error}</div>
      )}
      {evaluation && (
        <div className="mt-6">
          {evaluation?.map((i)=> <p>{i}</p>)}
        </div>
      )}
    </div>
  );
};

export default Evaluate;
