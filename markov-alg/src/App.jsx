import { useState } from 'react'

import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [rules, setRules] = useState('')
  const [output, setOutput] = useState('')

  const handleInputChange = (e) => {
    // Set string length limit
    if (e.target.value.length > 50) {
      return
    }
    setInput(e.target.value)
  }

  const handleRulesChange = (e) => {
    setRules(e.target.value)
  }

  const handleRun = () => {
    const [parsedRules, err] = parseRules(rules)
    if (err) {
      console.log(err)
      return
    }
    console.table(parsedRules)
    const output = runAlgo(input, parsedRules)
    setOutput(output)
  }

  return (
    <>
      <div className="header">
        <h1>Markov Algorithm</h1>
      </div>
      <div className="algo">
        <input className="input-text" onChange={handleInputChange} value={input}  type="text" placeholder='Input String' spellCheck='false'/>
        <div className="rule">
          <div className="rule-line-number">
            {rules.split('\n').map((line, i) => (
              <p className="rule-line-number-element" key={i}>{i + 1}</p>
            ))}
          </div>
          <textarea className="rule-text" onChange={handleRulesChange} value={rules} placeholder="Rules" spellCheck='false'/>
        </div>
        <button className="run-btn" onClick={handleRun}>Run</button>
      </div>
      <div className="output">
        <h2>Output</h2>
        <p className="output-text">{output}</p>
      </div>
        

    </>
  )
}

function parseRules(rules) {
  //console.log(rules)
  let parsedRules= rules.split('\n').map((rule) => {
    rule = rule.trim()

    // Ignore empty lines
    if (rule.length === 0) {
      return null
    }

    // Ignore comments
    if (!rule.includes('=')) {
      return null
    }

    // Terminating rule
    if (rule.includes("==")) {
      const [from, to] = rule.split('==')
      return {
        from: from.trim(),
        to: to.trim(),
        terminating: true,
      }
    }

    // ordinary rule
    const [from, to] = rule.split('=')
    return {
      from: from.trim(),
      to: to.trim(),
      terminating: false,
    }
  })

  // Remove null values
  parsedRules = parsedRules.filter((rule) => rule !== null)
  return [parsedRules, null]
}

// Run the algorithm
function runAlgo(input, rules) {
  const MAX_ITERATIONS = 1_000 // Prevent infinite loops
  let output = input
  let i = 0

  while (i < MAX_ITERATIONS) {
    for (const rule of rules) {
      if (output.includes(rule.from)) {
        output = output.replace(rule.from, rule.to)
        if (rule.terminating) {
          return output
        }
      }
    }
    i++
    console.log(i, output)
  }
  return output
}

export default App
