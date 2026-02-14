import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Patterns from './pages/Patterns'
import BuildingBlocks from './pages/BuildingBlocks'
import Problems from './pages/Problems'
import Concepts from './pages/Concepts'
import Framework from './pages/Framework'
import CheatSheet from './pages/CheatSheet'
import Quiz from './pages/Quiz'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patterns" element={<Patterns />} />
        <Route path="/blocks" element={<BuildingBlocks />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/concepts" element={<Concepts />} />
        <Route path="/framework" element={<Framework />} />
        <Route path="/cheat-sheet" element={<CheatSheet />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Layout>
  )
}
