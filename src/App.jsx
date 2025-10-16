import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TinyNetCards from './views/home'
import CardView from './components/ cardView';

function App() {

  return (
   <Router>
      <Routes>
        <Route path="/" element={<TinyNetCards />} />
        <Route path="/:cardId" element={<CardView />} />
        <Route path="/:cardId/:code" element={<CardView />} />
      </Routes>
    </Router>
  )
}

export default App
