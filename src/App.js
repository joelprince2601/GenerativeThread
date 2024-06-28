import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isFetching, setIsFetching] = useState(false);
  const [queue, setQueue] = useState([]);
  const textRef = useRef('');
  const [text, setText] = useState('');
  const [currentThread, setCurrentThread] = useState('');

  useEffect(() => {
    if (isFetching) {
      const eventSource = new EventSource('http://localhost:8080/stream-text');

      eventSource.onmessage = function (event) {
        setQueue(prevQueue => [...prevQueue, event.data]);
      };

      eventSource.onerror = function (err) {
        console.error('EventSource failed:', err);
        eventSource.close();
        setIsFetching(false);
      };

      return () => {
        eventSource.close();
      };
    }
  }, [isFetching]);

  useEffect(() => {
    if (queue.length > 0 && currentThread === '') {
      setCurrentThread(queue[0]);
      setQueue(queue.slice(1));
    }
  }, [queue, currentThread]);

  useEffect(() => {
    if (currentThread !== '') {
      let index = 0;

      const intervalId = setInterval(() => {
        if (index < currentThread.length) {
          textRef.current += currentThread[index];
          setText(textRef.current);
          index++;
        } else {
          textRef.current += ' ';
          setText(textRef.current);
          setCurrentThread('');
          clearInterval(intervalId);
        }
      }, 100); // Interval to control letter-by-letter animation speed
    }
  }, [currentThread]);

  const handleClick = () => {
    textRef.current = '';
    setText('');
    setQueue([]);
    setIsFetching(true);
  };

  return (
    <div className="App">
      <textarea value={text} readOnly />
      <button onClick={handleClick} disabled={isFetching}>
        Fetch Text
      </button>
    </div>
  );
}

export default App;
