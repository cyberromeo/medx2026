import { useParams, useNavigate, Link } from 'react-router-dom';
import { videosBySubject } from '../data/subjects';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

function VideoCard({ video, index, subjectId }) {
  const isDark = video.variant === 'dark';
  const isMuted = video.variant === 'muted';

  const chapterColorMap = {
    'tertiary': 'var(--tertiary)',
    'secondary': 'var(--secondary)',
    'primary-container': 'var(--primary-container)',
    'primary': 'var(--primary)',
  };

  return (
    <article
      className={`video-card ${isDark ? 'video-card--dark' : ''} ${isMuted ? 'video-card--muted' : ''} animate-slide-up stagger-${Math.min(index + 1, 6)}`}
      id={`video-${video.id}`}
    >
      <Link to={`/subjects/${subjectId}/watch/${video.id}`} className="video-card__thumbnail">
        <img src={video.thumbnail} alt={video.title} loading="lazy" />
        <div className="video-card__overlay">
          <span className="material-symbols-outlined filled video-card__play-icon">
            play_circle
          </span>
        </div>
        <span className="video-card__duration">{video.duration}</span>
      </Link>

      <div className="video-card__body">
        <div>
          <p
            className="video-card__chapter"
            style={{ color: chapterColorMap[video.chapterColor] || 'var(--tertiary)' }}
          >
            {video.chapter}
          </p>
          <h3 className="video-card__title">{video.title}</h3>
        </div>
        <Link
          to={`/subjects/${subjectId}/watch/${video.id}`}
          className="video-card__watch-btn"
        >
          WATCH
        </Link>
      </div>
    </article>
  );
}

export default function VideosPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const subjectData = videosBySubject[subjectId];

  if (!subjectData) {
    return (
      <>
        <Navbar showBack />
        <main className="videos-page container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '3rem', marginBottom: '1rem' }}>
            COMING SOON
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', color: 'var(--on-surface-variant)' }}>
            This subject's video lectures are being prepared.
          </p>
          <button
            className="btn btn-primary neo-shadow"
            onClick={() => navigate('/subjects')}
            style={{ marginTop: '2rem' }}
          >
            BACK TO SUBJECTS
          </button>
        </main>
        <BottomNav activePage="gallery" />
      </>
    );
  }

  return (
    <>
      <Navbar showBack />
      <main className="videos-page container" id="videos-page">
        {/* Header */}
        <section className="videos-page__header animate-slide-up">
          <div className="videos-page__header-content">
            <div>
              <span className="tag tag-tertiary videos-page__subject-tag">LECTURE SERIES</span>
              <h1 className="videos-page__title" style={{ marginTop: '1rem' }}>
                {subjectData.title}
              </h1>
            </div>
            <div className="videos-page__stats">
              <div className="videos-page__stat-box">
                <p className="videos-page__stat-label">MODULES</p>
                <p className="videos-page__stat-value">{subjectData.videos?.length || 0}</p>
              </div>
              <div className="videos-page__stat-box" style={{ backgroundColor: 'var(--primary-container)' }}>
                <p className="videos-page__stat-label">DURATION</p>
                <p className="videos-page__stat-value">{`${(subjectData.videos?.length || 0) * 2}H`}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Grid */}
        <div className="videos-grid">
          {subjectData.videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              subjectId={subjectId}
            />
          ))}
        </div>
      </main>
      <Footer />
      <BottomNav activePage="gallery" />
    </>
  );
}
