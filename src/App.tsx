import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Menu } from './routes/Menu'
import { Learn } from './routes/Learn'
import { Test } from './routes/Test'
import { AllLearned } from './routes/AllLearned'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/test" element={<Test />} />
            <Route path="/learned" element={<AllLearned />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  )
}

export default App
