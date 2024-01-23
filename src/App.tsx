import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import First from './pages/First';
import Second from './pages/Second';
import Third from './pages/Third';
import Fourth from './pages/Fourth';
import Fifth from './pages/Fifth';
import StripeContainer from './components/StripeContainer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<First />} />
        <Route path="/second" element={<Second />} />
        <Route path="/third" element={<Third />} />
        <Route path="/fourth" element={<Fourth />} />
        <Route path="/fifth" element={<Fifth />} />
        <Route path="/payment" element={<StripeContainer />} />
      </Routes>
    </Router>
  );
}

export default App;
