import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

const quotes = [
  {
    quote: "Do good by stealth, and blush to find it fame.",
    author: "Alexander Pope"
  },
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    quote: "Stay hungry, stay foolish.",
    author: "Stewart Brand"
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  }
];

const Quote: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  useEffect(() => {
    // Function to get a random quote
    const getRandomQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    };

    // Initial random quote
    setCurrentQuote(getRandomQuote());

    // Set up interval to change quote every 10 seconds
    const interval = setInterval(() => {
      setCurrentQuote(getRandomQuote());
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="quote-container">
      <p className="quote-text">"{currentQuote.quote}"</p>
      <div className="quote-author">
        - {currentQuote.author}
      </div>
    </div>
  );
};

export default Quote; 