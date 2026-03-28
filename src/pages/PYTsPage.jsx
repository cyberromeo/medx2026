import { useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';
import { pytsData } from '../data/pyts';

export default function PYTsPage() {
  const [expandedSubject, setExpandedSubject] = useState(null);

  const toggleSubject = (subjectId) => {
    if (expandedSubject === subjectId) {
      setExpandedSubject(null);
    } else {
      setExpandedSubject(subjectId);
    }
  };

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '8rem', paddingBottom: '6rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="animate-slide-up">
          <span className="tag tag-primary" style={{ marginBottom: '1rem', display: 'inline-block' }}>REVISION</span>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', lineHeight: 1 }}>
            PAST YEAR<br />TOPICS
          </h1>
          <p style={{ marginTop: '1rem', color: 'var(--on-surface-variant)', maxWidth: '600px' }}>
            A comprehensive collection of highly-tested topics from previous years. Topics marked with 
            <span className="material-symbols-outlined" style={{ color: '#FF5722', fontSize: '1rem', verticalAlign: 'middle', margin: '0 4px' }}>local_fire_department</span>
            have a history of frequent repetition.
          </p>
        </header>

        <section style={{ flex: 1, marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem' }} className="animate-slide-up stagger-1">
          {pytsData.map((subject) => {
            const isExpanded = expandedSubject === subject.subjectId;

            return (
              <div 
                key={subject.subjectId} 
                style={{
                  background: 'var(--surface-container)',
                  border: '2px solid var(--outline)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Subject Header (Clickable) */}
                <button 
                  onClick={() => toggleSubject(subject.subjectId)}
                  style={{
                    width: '100%',
                    padding: '1.5rem 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isExpanded ? 'var(--primary)' : 'transparent',
                    color: isExpanded ? 'var(--on-primary)' : 'var(--on-surface)',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span 
                      className="material-symbols-outlined" 
                      style={{ fontSize: '2rem' }}
                    >
                      {isExpanded ? 'folder_open' : 'folder'}
                    </span>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-headline)', margin: 0, fontSize: '1.5rem', textTransform: 'uppercase' }}>
                        {subject.subjectName}
                      </h2>
                      <span style={{ fontSize: '0.9rem', opacity: 0.8, fontFamily: 'var(--font-body)' }}>
                        {subject.topics.length} Topics
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined" style={{ 
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease' 
                  }}>
                    expand_more
                  </span>
                </button>

                {/* Topics List (Collapsible) */}
                <div 
                  style={{ 
                    maxHeight: isExpanded ? '20000px' : '0', 
                    opacity: isExpanded ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.4s ease-in-out'
                  }}
                >
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {subject.topics.map((topic, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem 1.25rem',
                        background: topic.priority > 0 ? 'var(--secondary-container)' : 'var(--surface)',
                        border: '1px solid var(--outline)',
                        borderRadius: '8px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ 
                            fontFamily: 'var(--font-headline)', 
                            color: 'var(--on-surface-variant)',
                            opacity: 0.5,
                            width: '30px'
                          }}>
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <h4 style={{ 
                            margin: 0, 
                            fontSize: '1.05rem', 
                            fontFamily: 'var(--font-body)',
                            fontWeight: topic.priority > 0 ? 600 : 400
                          }}>
                            {topic.title}
                          </h4>
                        </div>
                        
                        {topic.priority > 0 && (
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {Array.from({ length: topic.priority }).map((_, i) => (
                              <span 
                                key={i} 
                                className="material-symbols-outlined" 
                                style={{ 
                                  color: '#FF5722', 
                                  fontSize: '1.25rem',
                                  filter: 'drop-shadow(0px 1px 2px rgba(255, 87, 34, 0.4))'
                                }}
                              >
                                local_fire_department
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
      <Footer />
      <BottomNav activePage="pyts" />
    </>
  );
}
