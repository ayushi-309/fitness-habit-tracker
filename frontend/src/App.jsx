
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [started, setStarted] = useState(false)

  // Daily Habits
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem('fittrack-habits')

      return saved
        ? JSON.parse(saved)
        : [
          { id: 1, name: 'Drink water', completed: false },
          { id: 2, name: 'Exercise', completed: false },
          { id: 3, name: 'Read for 20 minutes', completed: false },
        ]
    } catch {
      return []
    }
  })

  const [newHabit, setNewHabit] = useState('')

  // Current Date
  const now = new Date()

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  const displayDate = now.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Streak
  const [lastCompletedDate, setLastCompletedDate] = useState(
    () => localStorage.getItem('fittrack-last-date') || ''
  )

  const [streak, setStreak] = useState(() => {
    return Number(localStorage.getItem('fittrack-streak')) || 0
  })

  // Fitness Tracker
  const [workouts, setWorkouts] = useState(() => {
    try {
      const saved = localStorage.getItem('fittrack-workouts')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [workoutName, setWorkoutName] = useState('')
  const [workoutDuration, setWorkoutDuration] = useState('')

  // AI Trainer
  const [fitnessGoal, setFitnessGoal] = useState('general')

  // Save data in localStorage
  useEffect(() => {
    localStorage.setItem('fittrack-habits', JSON.stringify(habits))
  }, [habits])

  useEffect(() => {
    localStorage.setItem('fittrack-last-date', lastCompletedDate)
  }, [lastCompletedDate])

  useEffect(() => {
    localStorage.setItem('fittrack-streak', String(streak))
  }, [streak])

  useEffect(() => {
    localStorage.setItem('fittrack-workouts', JSON.stringify(workouts))
  }, [workouts])

  // Habit Progress
  const completedCount = habits.filter(
    (habit) => habit.completed
  ).length

  const totalHabits = habits.length

  const progressPercentage =
    totalHabits === 0
      ? 0
      : Math.round((completedCount / totalHabits) * 100)

  // Add Habit
  const addHabit = () => {
    if (!newHabit.trim()) return

    const habit = {
      id: Date.now(),
      name: newHabit.trim(),
      completed: false,
    }

    setHabits((previousHabits) => [
      ...previousHabits,
      habit,
    ])

    setNewHabit('')
  }

  // Delete Habit
  const deleteHabit = (id) => {
    setHabits((previousHabits) =>
      previousHabits.filter((habit) => habit.id !== id)
    )
  }

  // Toggle Habit
  const toggleHabit = (habit) => {
    const willComplete = !habit.completed

    setHabits((previousHabits) =>
      previousHabits.map((item) =>
        item.id === habit.id
          ? { ...item, completed: willComplete }
          : item
      )
    )

    if (willComplete && lastCompletedDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const yesterdayString = [
        yesterday.getFullYear(),
        String(yesterday.getMonth() + 1).padStart(2, '0'),
        String(yesterday.getDate()).padStart(2, '0'),
      ].join('-')

      if (lastCompletedDate === yesterdayString) {
        setStreak((previousStreak) => previousStreak + 1)
      } else {
        setStreak(1)
      }

      setLastCompletedDate(today)
    }
  }

  // Add Workout
  const addWorkout = () => {
    if (
      !workoutName.trim() ||
      workoutDuration === '' ||
      !Number.isFinite(Number(workoutDuration)) ||
      Number(workoutDuration) <= 0
    ) {
      return
    }

    const newWorkout = {
      id: Date.now(),
      name: workoutName.trim(),
      duration: Number(workoutDuration),
      date: today,
    }

    setWorkouts((previousWorkouts) => [
      ...previousWorkouts,
      newWorkout,
    ])

    setWorkoutName('')
    setWorkoutDuration('')
  }

  // Delete Workout
  const deleteWorkout = (id) => {
    setWorkouts((previousWorkouts) =>
      previousWorkouts.filter((workout) => workout.id !== id)
    )
  }

  // Total Workout Duration
  const totalWorkoutMinutes = workouts.reduce(
    (total, workout) => total + workout.duration,
    0
  )


  // Weekly Workout Activity
  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))

    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0'),
    ].join('-')

    const minutes = workouts
      .filter((workout) => workout.date === dateString)
      .reduce((total, workout) => total + workout.duration, 0)

    return {
      day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
      minutes,
    }
  })

  const maxWeeklyMinutes = Math.max(
    ...weeklyActivity.map((day) => day.minutes),
    30
  )


  return (
    <div className="app">

      {/* Navbar */}
      <header className="navbar">
        <h2>FitTrack</h2>
        <span>Fitness & Habit Tracker</span>
      </header>

      <main className="dashboard">

        {/* Welcome Section */}
        {!started ? (
          <section className="welcome">
            <p className="eyebrow">
              YOUR PERSONAL FITNESS SPACE
            </p>

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

        {/* Feature Cards */}
        <section className="features">

          {/* Daily Habits */}
          <div className="feature-card">
            <h3>Daily Habits</h3>

            <p className="current-date">
              📅 Today: {displayDate}
            </p>

            <p>🔥 Current Streak: {streak} days</p>

            <input
              type="text"
              placeholder="Enter a new habit..."
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addHabit()
              }}
            />

            <button onClick={addHabit}>
              Add Habit
            </button>

            <p>
              Completed: {completedCount} / {totalHabits}
              {' '}({progressPercentage}%)
            </p>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {habits.map((habit) => (
              <div className="habit-item" key={habit.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={habit.completed}
                    onChange={() => toggleHabit(habit)}
                  />
                  {' '}
                  {habit.name}
                </label>

                <button
                  className="delete-button"
                  onClick={() => deleteHabit(habit.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Fitness Tracker */}
          <div className="feature-card">
            <h3>Fitness Tracker</h3>

            <p>Keep track of your workouts and progress.</p>

            <input
              type="text"
              placeholder="Workout name..."
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Duration (minutes)"
              min="1"
              value={workoutDuration}
              onChange={(e) =>
                setWorkoutDuration(e.target.value)
              }
            />

            <button onClick={addWorkout}>
              Add Workout
            </button>

            <h4>Workout History</h4>

            <p>
              Total Workouts: {workouts.length}
            </p>

            <p>
              Total Duration: {totalWorkoutMinutes} minutes
            </p>

            {workouts.length === 0 ? (
              <p>No workouts added yet.</p>
            ) : (
              workouts.map((workout) => (
                <div className="workout-item" key={workout.id}>
                  <p>
                    <strong>{workout.name}</strong>
                    {' '}— {workout.duration} minutes
                  </p>

                  <small>{workout.date}</small>

                  <button
                    className="delete-button"
                    onClick={() => deleteWorkout(workout.id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>

          {/* AI Trainer */}
          <div className="feature-card">
            <h3>🤖 AI Fitness Trainer</h3>

            <p>Select your fitness goal to get guidance.</p>

            <select
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
            >
              <option value="general">General Fitness</option>
              <option value="strength">Build Strength</option>
              <option value="flexibility">Improve Flexibility</option>
              <option value="energy">Improve Energy</option>
            </select>

            <div className="trainer-result">

              {fitnessGoal === 'general' && (
                <>
                  <h4>General Fitness Plan</h4>
                  <p>
                    Try comfortable walking, gentle movement,
                    and regular breaks.
                  </p>
                </>
              )}

              {fitnessGoal === 'strength' && (
                <>
                  <h4>Strength Guidance</h4>
                  <p>
                    Try beginner-friendly bodyweight movements
                    with proper rest.
                  </p>
                </>
              )}

              {fitnessGoal === 'flexibility' && (
                <>
                  <h4>Flexibility Guidance</h4>
                  <p>
                    Try gentle stretching and simple mobility
                    exercises. Never force a stretch.
                  </p>
                </>
              )}

              {fitnessGoal === 'energy' && (
                <>
                  <h4>Energy Guidance</h4>
                  <p>
                    Maintain a regular sleep schedule, stay
                    hydrated, and include enjoyable daily movement.
                  </p>
                </>
              )}

            </div>
          </div>


          {/* Weekly Activity */}
          <div className="feature-card weekly-card">
            <h3>📊 Weekly Activity</h3>
            <p>Your workout activity over the last 7 days.</p>

            <div className="weekly-chart">
              {weeklyActivity.map((day, index) => (
                <div className="chart-column" key={index}>
                  <span className="chart-value">
                    {day.minutes}m
                  </span>

                  <div className="chart-bar-container">
                    <div
                      className="chart-bar"
                      style={{
                        height: `${(day.minutes / maxWeeklyMinutes) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="chart-day">{day.day}</span>
                </div>
              ))}
            </div>

            <h4>
              This week's workout time: {weeklyActivity.reduce(
                (total, day) => total + day.minutes, 0
              )} minutes
            </h4>
          </div>


        </section>
      </main>
    </div>
  )
}

export default App
