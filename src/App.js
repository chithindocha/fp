import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [operationCode, setOperationCode] = useState(null);

  useEffect(() => {
    // Fetch operation code when component mounts
    fetchOperationCode();
  }, []);

  const fetchOperationCode = async () => {
    try {
      const res = await axios.get('https://backend-92xz.onrender.com/bfhl');
      setOperationCode(res.data.operation_code);
    } catch (err) {
      console.error('Error fetching operation code:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    try {
      const parsedInput = JSON.parse(input);
      const res = await axios.post('https://backend-92xz.onrender.com/bfhl', parsedInput);
      setResponse(res.data);
    } catch (err) {
      setError('Invalid JSON input or API error');
      console.error(err);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const renderResponse = () => {
    if (!response) return null;

    return (
      <div>
        {selectedOptions.includes('Alphabets') && (
          <p>Alphabets: {response.alphabets.join(', ')}</p>
        )}
        {selectedOptions.includes('Numbers') && (
          <p>Numbers: {response.numbers.join(', ')}</p>
        )}
        {selectedOptions.includes('Highest alphabet') && (
          <p>Highest alphabet: {response.highest_alphabet.join(', ')}</p>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>BFHL Challenge</h1>
      {operationCode !== null && (
        <p>Operation Code: {operationCode}</p>
      )}
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON (e.g., {"data": ["A","1","B","2","C","3"]})'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {response && (
        <div>
          <h2>Filter Response:</h2>
          <div>
            <label>
              <input
                type="checkbox"
                checked={selectedOptions.includes('Alphabets')}
                onChange={() => handleOptionChange('Alphabets')}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedOptions.includes('Numbers')}
                onChange={() => handleOptionChange('Numbers')}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                checked={selectedOptions.includes('Highest alphabet')}
                onChange={() => handleOptionChange('Highest alphabet')}
              />
              Highest alphabet
            </label>
          </div>
          {renderResponse()}
        </div>
      )}
    </div>
  );
}

export default App;