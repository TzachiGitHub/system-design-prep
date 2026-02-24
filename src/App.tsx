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
import ReactQueryOverview from './pages/react-query'
import RQIntro from './pages/react-query/01-Intro'
import RQUseQuery from './pages/react-query/02-UseQuery'
import RQStates from './pages/react-query/03-QueryStates'
import RQCaching from './pages/react-query/04-Caching'
import RQMutations from './pages/react-query/05-Mutations'
import RQInvalidation from './pages/react-query/06-Invalidation'
import RQPagination from './pages/react-query/07-Pagination'
import RQInfinite from './pages/react-query/08-InfiniteScroll'
import RQDependent from './pages/react-query/09-DependentQueries'
import RQOptimistic from './pages/react-query/10-OptimisticUpdates'

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
        <Route path="/tech/react-query" element={<ReactQueryOverview />} />
        <Route path="/tech/react-query/intro" element={<RQIntro />} />
        <Route path="/tech/react-query/use-query" element={<RQUseQuery />} />
        <Route path="/tech/react-query/states" element={<RQStates />} />
        <Route path="/tech/react-query/caching" element={<RQCaching />} />
        <Route path="/tech/react-query/mutations" element={<RQMutations />} />
        <Route path="/tech/react-query/invalidation" element={<RQInvalidation />} />
        <Route path="/tech/react-query/pagination" element={<RQPagination />} />
        <Route path="/tech/react-query/infinite" element={<RQInfinite />} />
        <Route path="/tech/react-query/dependent" element={<RQDependent />} />
        <Route path="/tech/react-query/optimistic" element={<RQOptimistic />} />
      </Routes>
    </Layout>
  )
}
