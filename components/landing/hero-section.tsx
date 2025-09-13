'use client';

import styles from '@/styles/landing.module.css';

export function HeroSection() {
  return (
    <section className={styles['heroSection']}>
      <div className={styles['heroContainer']}>
        <div className={styles['heroContent']}>
          <h1 className={styles['heroTitle']}>
            AI-Powered Interview
            <span className={styles['heroTitleAccent']}> Assessment Platform</span>
          </h1>
          <p className={styles['heroDescription']}>
            Revolutionize your hiring process with intelligent CV analysis, automated interview scheduling, 
            and real-time coding assessment. Find the best talent faster and more accurately.
          </p>
          <div className={styles['heroButtons']}>
            <button className={styles['heroButtonPrimary']}>
              Start Free Trial
            </button>
            <button className={styles['heroButtonSecondary']}>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Animated Demo Area */}
        <div className={styles['demoArea']}>
          <div className={styles['demoInterface']}>
            {/* Demo Interface Mockup */}
            <div className={styles['demoHeader']}>
              <div className={styles['demoControls']}>
                <div className={`${styles['demoControlDot']} ${styles['demoControlDotRed']}`}></div>
                <div className={`${styles['demoControlDot']} ${styles['demoControlDotYellow']}`}></div>
                <div className={`${styles['demoControlDot']} ${styles['demoControlDotGreen']}`}></div>
                <div className={styles['demoTitle']}>
                  <span className={styles['demoTitleText']}>AI Interview Platform - Live Demo</span>
                </div>
              </div>
              
              {/* Mock Dashboard Interface */}
              <div className={styles['dashboardMock']}>
                <div className={styles['dashboardHeader']}>
                  <h2 className={styles['dashboardTitle']}>
                    <span className={styles['dashboardTitleText']}>Interview Dashboard</span>
                  </h2>
                  <div className={styles['dashboardActions']}>
                    <div className={styles['dashboardActionButton']}>
                      <svg className={styles['dashboardActionIcon']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6V1H4v4zM15 1h5l-5 5V1z" />
                      </svg>
                    </div>
                    <div className={styles['dashboardActionPlaceholder']}></div>
                  </div>
                </div>

                {/* Animated Stats Cards */}
                <div className={styles['statsGrid']}>
                  <div className={`${styles['statCard']} ${styles['statCardBlue']}`}>
                    <div className={styles['statCardContent']}>
                      <div className={styles['statCardInfo']}>
                        <p className={`${styles['statCardLabel']} ${styles['statCardLabelBlue']}`}>CVs Analyzed</p>
                        <p className={styles['statCardValue']}>
                          <span className={styles['statCardValueText']}>1,247</span>
                          <span className={styles['statCardTrend']}>↗</span>
                        </p>
                      </div>
                      <div className={`${styles['statCardIcon']} ${styles['statCardIconBlue']}`}>
                        <svg className={`${styles['statCardIconSvg']} ${styles['statCardIconSvgBlue']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles['statCard']} ${styles['statCardGreen']}`}>
                    <div className={styles['statCardContent']}>
                      <div className={styles['statCardInfo']}>
                        <p className={`${styles['statCardLabel']} ${styles['statCardLabelGreen']}`}>Interviews Scheduled</p>
                        <p className={styles['statCardValue']}>
                          <span className={styles['statCardValueText']}>89</span>
                          <span className={styles['statCardTrend']}>↗</span>
                        </p>
                      </div>
                      <div className={`${styles['statCardIcon']} ${styles['statCardIconGreen']}`}>
                        <svg className={`${styles['statCardIconSvg']} ${styles['statCardIconSvgGreen']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles['statCard']} ${styles['statCardPurple']}`}>
                    <div className={styles['statCardContent']}>
                      <div className={styles['statCardInfo']}>
                        <p className={`${styles['statCardLabel']} ${styles['statCardLabelPurple']}`}>Live Sessions</p>
                        <p className={styles['statCardValue']}>
                          <span className={styles['statCardValueText']}>12</span>
                          <span className={styles['statCardTrend']}>↗</span>
                        </p>
                      </div>
                      <div className={`${styles['statCardIcon']} ${styles['statCardIconPurple']}`}>
                        <svg className={`${styles['statCardIconSvg']} ${styles['statCardIconSvgPurple']}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Animated Progress Bars */}
                <div className={styles['progressSection']}>
                  <h3 className={styles['progressTitle']}>AI Processing Status</h3>
                  <div className={styles['progressBars']}>
                    <div className={styles['progressBarContainer']}>
                      <div className={`${styles['progressBar']} ${styles['progressBarBlue']}`}></div>
                    </div>
                    <div className={styles['progressLabels']}>
                      <span>CV Analysis Progress</span>
                      <span className={styles['progressLabelText']}>85%</span>
                    </div>
                    
                    <div className={styles['progressBarContainer']}>
                      <div className={`${styles['progressBar']} ${styles['progressBarGreen']}`}></div>
                    </div>
                    <div className={styles['progressLabels']}>
                      <span>Interview Matching</span>
                      <span className={styles['progressLabelText']}>92%</span>
                    </div>
                  </div>
                </div>

                {/* Animated Live Coding Session */}
                <div className={styles['liveCodingSection']}>
                  <div className={styles['liveCodingHeader']}>
                    <h3 className={styles['liveCodingTitle']}>Live Coding Session</h3>
                    <div className={styles['liveCodingStatus']}>
                      <div className={styles['liveCodingIndicator']}></div>
                      <span className={styles['liveCodingStatusText']}>Live</span>
                    </div>
                  </div>
                  
                  <div className={styles['liveCodingCode']}>
                    <div className={`${styles['codeLine']} ${styles['codeLineComment']}`}>// Candidate: John Smith - Senior Developer</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineKeyword']}`} style={{animationDelay: '0.5s'}}>function findMaxNumber(arr) {'{'}</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineCode']} ${styles['codeLineIndent1']}`} style={{animationDelay: '1s'}}>let max = arr[0];</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineCode']} ${styles['codeLineIndent1']}`} style={{animationDelay: '1.5s'}}>for (let i = 1; i {'<'} arr.length; i++) {'{'}</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineCode']} ${styles['codeLineIndent2']}`} style={{animationDelay: '2s'}}>if (arr[i] {'>'} max) {'{'}</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineCode']} ${styles['codeLineIndent3']}`} style={{animationDelay: '2.5s'}}>max = arr[i];</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineCode']} ${styles['codeLineIndent2']}`} style={{animationDelay: '3s'}}>{'}'}</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineCode']} ${styles['codeLineIndent1']}`} style={{animationDelay: '3.5s'}}>{'}'}</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineCode']} ${styles['codeLineIndent1']}`} style={{animationDelay: '4s'}}>return max;</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineKeyword']}`} style={{animationDelay: '4.5s'}}>{'}'}</div>
                    <div className={`${styles['codeLine']} ${styles['codeLineAnalysis']}`} style={{animationDelay: '5s'}}>// AI Analysis: Code quality 95% ✅</div>
                  </div>
                </div>

                {/* Animated AI Insights */}
                <div className={styles['aiInsightsSection']}>
                  <div className={styles['aiInsightsContent']}>
                    <div className={styles['aiInsightsIcon']}>
                      <svg className={styles['aiInsightsIconSvg']} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className={styles['aiInsightsText']}>
                      <p className={styles['aiInsightsTitle']}>AI is analyzing candidate performance...</p>
                      <p className={styles['aiInsightsSubtitle']}>Real-time insights and recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated Play Button Overlay */}
            <div className={styles['playButtonOverlay']}>
              <div className={styles['playButton']}>
                <svg className={styles['playButtonIcon']} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Animated Demo Description */}
          <div className={styles['demoDescription']}>
            <p className={styles['demoDescriptionText']}>
              See how our AI analyzes CVs, schedules interviews, and provides real-time coding assessment
            </p>
            <button className={styles['demoDescriptionButton']}>
              Watch Full Demo →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}