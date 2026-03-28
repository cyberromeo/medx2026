import { Link } from 'react-router-dom';
import { subjects, videosBySubject } from '../data/subjects';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

function SubjectCard({ subject, index }) {
  const isLocked = subject.variant === 'locked';

  const cardContent = () => {
    switch (subject.variant) {
      case 'featured':
        return (
          <div className="subject-card__inner subject-card__inner--featured">
            <div className="subject-card__top">
              <span className="tag tag-primary">MODULE {subject.module}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>
                {subject.icon}
              </span>
            </div>
            <h2 className="subject-card__title" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              {subject.name.toUpperCase()}
            </h2>
            <div className="subject-card__meta">
              <div style={{ maxWidth: '28rem' }}>
                <p className="subject-card__description">{subject.description}</p>
                <div className="subject-card__stats" style={{ marginTop: '1rem' }}>
                  <div className="subject-card__stat">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                      play_circle
                    </span>
                    {videosBySubject[subject.id]?.videos?.length || 0} VIDEOS
                  </div>
                </div>
              </div>
              <button className="subject-card__cta">
                START
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        );

      case 'blue':
        return (
          <div className="subject-card__inner subject-card__inner--blue">
            <div className="subject-card__top">
              <span className="tag" style={{ backgroundColor: 'white', color: 'var(--tertiary)' }}>
                MODULE {subject.module}
              </span>
              <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
                {subject.icon}
              </span>
            </div>
            <h3 className="subject-card__title" style={{ fontSize: '2.5rem' }}>
              {subject.name.toUpperCase()}
            </h3>
            <div className="subject-card--blue" style={{ marginTop: 'auto' }}>
              <div className="subject-card__detail" style={{
                background: 'white',
                color: 'var(--tertiary)',
                padding: '1rem',
                border: '2px solid var(--outline)',
                marginTop: '1rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}>
                  {subject.description}
                </p>
              </div>
            </div>
          </div>
        );

      case 'red':
        return (
          <div className="subject-card__inner subject-card__inner--red">
            <div className="subject-card__top">
              <span className="tag tag-primary">MODULE {subject.module}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
                {subject.icon}
              </span>
            </div>
            <h3 className="subject-card__title" style={{ fontSize: '2.5rem' }}>
              {subject.name.toUpperCase()}
            </h3>
            <div style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontSize: '3.5rem',
              opacity: 0.2,
              marginTop: '1.5rem',
            }}>
              {subject.module}
            </div>
          </div>
        );

      case 'neutral':
        return (
          <div className="subject-card__inner subject-card__inner--neutral">
            <div className="subject-card__top">
              <span className="tag tag-primary">MODULE {subject.module}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '1.75rem' }}>
                {subject.icon}
              </span>
            </div>
            <h3 className="subject-card__title" style={{ fontSize: '2.5rem' }}>
              {subject.name.toUpperCase()}
            </h3>
            <div style={{
              borderTop: '4px solid var(--primary)',
              paddingTop: '1rem',
              marginTop: '1.5rem',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                {subject.description}
              </p>
            </div>
          </div>
        );

      case 'locked':
        return (
          <div className="subject-card__inner subject-card__inner--locked">
            <span className="material-symbols-outlined" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              lock
            </span>
            <h3 style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontSize: '1.25rem',
              textTransform: 'uppercase',
            }}>
              MORE SUBJECTS
            </h3>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              marginTop: '0.5rem',
            }}>
              {subject.description}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const gridClass = subject.variant === 'featured'
    ? 'subjects-grid__featured'
    : 'subjects-grid__side subjects-grid__third';

  if (isLocked) {
    return (
      <div
        className={`subject-card subject-card--locked ${gridClass} animate-slide-up stagger-${index + 1}`}
        id={`subject-${subject.id}`}
      >
        {cardContent()}
      </div>
    );
  }

  return (
    <Link
      to={`/subjects/${subject.id}`}
      className={`subject-card ${gridClass} animate-slide-up stagger-${index + 1}`}
      id={`subject-${subject.id}`}
    >
      {cardContent()}
    </Link>
  );
}

export default function SubjectsPage() {
  return (
    <>
      <Navbar />
      <main className="subjects-page container" id="subjects-page">
        {/* Header */}
        <header className="subjects-page__header animate-slide-up">
          <h1 className="subjects-page__title">
            CHOOSE<br />DOMAIN
          </h1>
          <p className="subjects-page__subtitle">
            Master the foundations of clinical excellence through our geometric curriculum.
          </p>
        </header>

        {/* Bento Grid */}
        <div className="subjects-grid">
          {subjects.map((subject, index) => (
            <SubjectCard key={subject.id} subject={subject} index={index} />
          ))}
        </div>

      </main>
      <Footer />
      <BottomNav activePage="subjects" />
    </>
  );
}
