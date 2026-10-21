import { useState } from 'react'
import './App.css'

function App() {
  const [started, setStarted] = useState(false)
  const [habits, setHabits] = useState([
    { id: 1, name: 'Drink water', completed: false },
    { id: 2, name: 'Exercise', completed: false },
    { id: 3, name: 'Read for 20 minutes', completed: false },
  ])
  const completedCount = habits.filter(
    (habit) => habit.completed
  ).length

  const totalHabits = habits.length
  const progress =
    totalHabits === 0 ? 0 : (completedCount / totalHabits) * 100

  const progressPercentage = Math.round(progress)

  return (
    <div className="app">
      <header className="navbar">
        <h2>FitTrack</h2>
        <span>Fitness & Habit Tracker</span>
      </header>

      <main className="dashboard">

        {!started ? (
          <section className="welcome">
            <p className="eyebrow">YOUR PERSONAL FITNESS SPACE</p>
            <h1>Build Better Habits.</h1>
            <h1>Become Stronger.</h1>
            <p>
              Track your daily habits, stay consistent, and
              work toward your fitness goals.
            </p>
            <button onClick={() => setStarted(true)}>
              Get Started
            </button>
          </section>
        ) : (
          <section className="welcome">
            <p className="eyebrow">YOUR DASHBOARD</p>
            <h1>Welcome to FitTrack!</h1>
            <p>Your fitness journey starts here.</p>
          </section>
        )}



        <section className="features">
          <div className="feature-card">
            <h3>Daily Habits</h3>
            <p>
              Completed: {completedCount} / {totalHabits}
              {' '}({progressPercentage}%)
            </p>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>


            {habits.map((habit) => (
              <div key={habit.id}>
                <label>

                  <input
                    type="checkbox"
                    checked={habit.completed}
                    onChange={() => {
                      setHabits((previousHabits) =>
                        previousHabits.map((item) =>
                          item.id === habit.id
                            ? { ...item, completed: !item.completed }
                            : item
                        )
                      )
                    }}
                  />
                  {' '}
                  {habit.name}
                </label>
              </div>
            ))}
          </div>

          <div className="feature-card">
            <h3>Fitness Tracker</h3>
            <p>Keep track of your workouts and progress.</p>
          </div>

          <div className="feature-card">
            <h3>AI Trainer</h3>
            <p>Get personalized fitness guidance.</p>
          </div>
        </section>

      </main>
    </div>
  )
}

export default App
