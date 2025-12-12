import { useState } from 'react';
import './Onboarding.css';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Onboarding() {
  const [mode, setMode] = useState<'friends' | 'ranked'>('friends');

  const handleChallengeFriend = () => {
    console.log('Challenge a friend');
  };

  const handleFindOpponent = () => {
    console.log('Find random opponent');
  };

  const handleCreateLobby = () => {
    console.log('Create friend lobby');
  };

  const handleStartPractice = () => {
    console.log('Start practice duel');
  };

  return (
    <div className="onboarding">
      {/* Feature Cards Section */}
      <section className="features-section">
        <div className="features-grid">
          <FeatureCard
            icon="⚡"
            title="Real-time 1v1 matches"
            description="Low-latency rooms with live typing indicators, opponent's progress bar, test results, and complexity score updates in real-time."
          />
          <FeatureCard
            icon="🏆"
            title="ELO ranking system"
            description="Skill-based progress. Gain ELO by winning, face tougher opponents, and feel the high stakes of losses."
          />
          <FeatureCard
            icon="👥"
            title="Friends vs Random matchmaking"
            description="Pick your rivals. Find opponents, spin up private lobbies with friends, or queue into ranked matchmaking."
          />
          <FeatureCard
            icon="⏱️"
            title="Time-limited rounds"
            description="Timed duels that matter. Bonus points for optimal complexity. Practice under pressure."
          />
        </div>
      </section>

      {/* Hero Section with Live Duel Preview */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="star">⭐</span> New • 1v1 Leetcode Duels
            </div>
            <h1 className="hero-title">
              Stop grinding alone.
              <br />
              <span className="gradient-text">Start dueling.</span>
            </h1>
            <p className="hero-description">
              Battle real opponents on timed Leetcode-style problems. Earn ELO, climb the ladder, and turn lonely grind sessions into high-intensity duels.
            </p>
            <div className="cta-container">
              <button 
                className="cta-primary cta-friend"
                onClick={handleChallengeFriend}
              >
                <span className="icon">⚔️</span>
                Challenge a Friend
              </button>
              <button 
                className="cta-primary cta-opponent"
                onClick={handleFindOpponent}
              >
                <span className="icon">⚡</span>
                Find Random Opponent
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-inline">
                <span className="stat-dot"></span>
                120 players dueling right now
              </div>
              <div className="stat-inline">10,000+ duels completed</div>
              <div className="stat-inline">Average match: 15 minutes</div>
            </div>
          </div>

          <div className="hero-right">
            <div className="live-duel-preview">
              <div className="duel-header">
                <div className="duel-status">
                  <span className="status-dot"></span>
                  Live Duel • 02:13 left
                </div>
                <div className="duel-elo">
                  <span className="trophy">🏆</span>
                  +24 ELO on win
                </div>
              </div>
              <div className="duel-editors">
                <div className="duel-player duel-player-left">
                  <div className="player-header">
                    <div className="player-info">
                      <span className="player-label">you</span>
                      <span className="player-elo">1540</span>
                    </div>
                    <div className="player-status typing">Typing...</div>
                  </div>
                  <div className="code-editor">
                    <div className="editor-tabs">
                      <div className="editor-tab active">two-sum.js</div>
                    </div>
                    <div className="editor-code">
                      <pre><code>{`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`}</code></pre>
                    </div>
                    <div className="editor-complexity">O(n)</div>
                  </div>
                </div>
                <div className="duel-player duel-player-right">
                  <div className="player-header">
                    <div className="player-info">
                      <span className="player-label">opponent</span>
                      <span className="player-elo">1588</span>
                    </div>
                    <div className="player-status reviewing">Reviewing tests</div>
                  </div>
                  <div className="code-editor">
                    <div className="editor-tabs">
                      <div className="editor-tab active">two-sum.js</div>
                    </div>
                    <div className="editor-code">
                      <pre><code>{`function twoSum(nums, target) {
  nums.sort((a, b) => a - b);
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
}`}</code></pre>
                    </div>
                    <div className="editor-complexity">O(n log n)</div>
                  </div>
                </div>
              </div>
              <div className="duel-modifiers">
                <div className="modifier">
                  <span className="modifier-icon">⏱️</span>
                  Time-limited round • Hard difficulty
                </div>
                <div className="modifier">
                  <span className="modifier-icon">📊</span>
                  Complexity scoring enabled
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mode Selection Section */}
      <section className="mode-section">
        <div className="mode-container">
          <div className="mode-left">
            <h2 className="mode-title">Choose how you want to duel.</h2>
            <p className="mode-description">
              Warm up with friends or jump straight into ranked matchmaking. Swap modes anytime—your rating only moves in ranked.
            </p>
            <div className="mode-tabs">
              <button
                className={`mode-tab ${mode === 'friends' ? 'active' : ''}`}
                onClick={() => setMode('friends')}
              >
                Play with Friends
              </button>
              <button
                className={`mode-tab ${mode === 'ranked' ? 'active' : ''}`}
                onClick={() => setMode('ranked')}
              >
                Ranked Matchmaking
              </button>
            </div>
            {mode === 'friends' && (
              <div className="mode-content-panel">
                <h3>Play with Friends</h3>
                <p>Drop a link in your group chat and spin up a duel in seconds. Perfect for mock interviews and study sessions.</p>
                <div className="mode-features-list">
                  <div className="mode-feature-item">
                    Custom problem difficulty, language, and time limit.
                  </div>
                  <div className="mode-feature-item">
                    Private lobby link with spectator mode for mentors.
                  </div>
                  <div className="mode-feature-item">
                    Shared test cases so you both debug the same edge cases.
                  </div>
                  <div className="mode-feature-item">
                    Voice chat friendly—just keep us in a browser tab.
                  </div>
                </div>
                <button className="mode-cta" onClick={handleCreateLobby}>
                  Create friend lobby
                  <span className="arrow">→</span>
                </button>
              </div>
            )}
            {mode === 'ranked' && (
              <div className="mode-content-panel">
                <h3>Ranked Matchmaking</h3>
                <p>Match with players of similar skill level. Win duels to gain ELO, lose to learn. Every match counts toward your ranking.</p>
                <div className="mode-features-list">
                  <div className="mode-feature-item">
                    ELO-based matchmaking for fair competition.
                  </div>
                  <div className="mode-feature-item">
                    Seasonal leaderboards and competitive rewards.
                  </div>
                  <div className="mode-feature-item">
                    Track your progress with detailed statistics.
                  </div>
                  <div className="mode-feature-item">
                    Climb the ranks and prove your algorithmic skills.
                  </div>
                </div>
                <button className="mode-cta" onClick={handleFindOpponent}>
                  Queue for ranked
                  <span className="arrow">→</span>
                </button>
              </div>
            )}
          </div>
          <div className="mode-right">
            <div className="elo-progression-card">
              <div className="card-header">
                <h3>ELO progression</h3>
                <span className="elo-change positive">+140 this month</span>
              </div>
              <div className="elo-chart">
                <div className="chart-bars">
                  {[65, 68, 72, 70, 75, 78, 82, 85].map((height, i) => (
                    <div key={i} className="chart-bar" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
              </div>
              <div className="chart-footer">
                <span>Last 20 ranked matches</span>
                <span className="win-rate">Win rate: 63%</span>
              </div>
            </div>
            <div className="leaderboard-card">
              <h3>Leaderboard preview</h3>
              <div className="leaderboard-list">
                <div className="leaderboard-item">
                  <span className="rank">#1</span>
                  <span className="name">binary_beast</span>
                  <span className="elo">2140 ELO</span>
                </div>
                <div className="leaderboard-item">
                  <span className="rank">#2</span>
                  <span className="name">heap_hacker</span>
                  <span className="elo">2075 ELO</span>
                </div>
                <div className="leaderboard-item">
                  <span className="rank">#3</span>
                  <span className="name">queue_master</span>
                  <span className="elo">2012 ELO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Duel Preview Section */}
      <section className="duel-preview-section">
        <div className="preview-container">
          <div className="preview-header">
            <div>
              <h2>See what a duel looks like.</h2>
              <p>A clean, split-screen editor with built-in tests, complexity hints, and real-time status for both players.</p>
            </div>
            <div className="preview-note">Interactive preview • No account required</div>
          </div>
          <div className="duel-demo">
            <div className="demo-problem-info">
              <span className="problem-dot"></span>
              Practice duel • Medium • Arrays & Hashing
            </div>
            <div className="demo-split-screen">
              <div className="demo-editor-panel">
                <div className="demo-editor-header">
                  <div className="demo-file-tab">
                    <span className="file-icon">&lt;/&gt;</span>
                    two-sum.ts
                  </div>
                  <div className="demo-language">TypeScript</div>
                </div>
                <div className="demo-editor-content">
                  <pre><code>{`export function twoSum(
  nums: number[],
  target: number
): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`}</code></pre>
                </div>
                <div className="demo-performance">
                  <div className="performance-badge success">All tests passing</div>
                  <div className="performance-badge">O(n) • 32ms</div>
                </div>
              </div>
              <div className="demo-stats-panel">
                <div className="demo-timer">12:48 remaining</div>
                <div className="complexity-section">
                  <div className="complexity-header">
                    <span>Complexity score</span>
                    <span className="complexity-points">+32 pts</span>
                  </div>
                  <div className="complexity-bar">
                    <div className="complexity-fill" style={{ width: '85%' }}></div>
                  </div>
                  <div className="complexity-info">
                    Better than 78% of recent submissions
                  </div>
                  <div className="complexity-details">O(n) • 32ms • 18MB</div>
                </div>
                <div className="duel-outcome">
                  <div className="outcome-header">Duel outcome: <span className="outcome-win">You won</span></div>
                  <div className="outcome-stats">
                    <div className="outcome-stat">
                      <span className="outcome-label">ELO change:</span>
                      <span className="outcome-value positive">+24</span>
                    </div>
                    <div className="outcome-stat">
                      <span className="outcome-label">Time to solve:</span>
                      <span className="outcome-value">06:42</span>
                    </div>
                    <div className="outcome-stat">
                      <span className="outcome-label">Mistakes caught by tests:</span>
                      <span className="outcome-value">3</span>
                    </div>
                  </div>
                </div>
                <div className="demo-cta-section">
                  <p className="demo-cta-text">Ready to feel the pressure?</p>
                  <button className="demo-cta-button" onClick={handleStartPractice}>
                    Start a practice duel
                    <span className="arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Section */}
      <section className="trusted-section">
        <div className="trusted-container">
          <h2>Trusted by serious grinders.</h2>
          <p>Whether you're prepping for Big Tech interviews or just love the rush of competition, duel with people who take it as seriously as you do.</p>
          <div className="trusted-stats">
            <div className="trusted-stat-card">
              <div className="trusted-stat-number">10,000+</div>
              <div className="trusted-stat-label">duels completed</div>
              <div className="trusted-stat-description">
                From quick warmups to late-night grind sessions, people are turning solo practice into real competition.
              </div>
            </div>
            <div className="trusted-stat-card">
              <div className="trusted-stat-number">15 min</div>
              <div className="trusted-stat-label">average match length</div>
              <div className="trusted-stat-description">
                Short, focused duels that fit between meetings, classes, or during your daily practice block.
              </div>
            </div>
            <div className="trusted-stat-card">
              <div className="trusted-stat-number">4.9 / 5</div>
              <div className="trusted-stat-label">avg duel rating</div>
              <div className="trusted-stat-description">
                Players love the mix of real competition, clean UI, and structured feedback after every match.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="showcase-section">
        <div className="showcase-container">
          <div className="showcase-header">
            <h2>Built for high-intensity competitive coding.</h2>
            <p>Real-time duels, ELO rankings, and time pressure—everything you love about ranked games, applied to algorithms.</p>
            <div className="anti-cheat-badge">
              <span className="shield-icon">🛡️</span>
              Anti-cheat & copy-paste detection enabled
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
