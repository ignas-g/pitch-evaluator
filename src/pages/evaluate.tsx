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
    <div>
      <h1>Pitch Evaluator. Enter your pitch in 3 parts.</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          name="problem"
          placeholder="Most people have this problem..."
          value={problem}
          onChange={handleChange(setProblem)}
        ></textarea>
        <textarea
          name="solution"
          placeholder="We have this solution..."
          value={solution}
          onChange={handleChange(setSolution)}
        ></textarea>
        <textarea
          name="happyEnding"
          placeholder="So that we have a happy ending..."
          value={happyEnding}
          onChange={handleChange(setHappyEnding)}
        ></textarea>
        <button type="submit">Evaluate</button>
      </form>
      {evaluation && (
        <div>
          <h2>Evaluation:</h2>
          <p>{evaluation}</p>
        </div>
      )}
    </div>
  );
};

export default Evaluate;
