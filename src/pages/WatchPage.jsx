import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { videosBySubject } from '../data/subjects';
import CustomPlayer from '../components/CustomPlayer';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

export default function WatchPage() {
  const { subjectId, videoId } = useParams();
  const navigate = useNavigate();
  const [initialTime, setInitialTime] = useState(0);

  const subjectData = videosBySubject[subjectId];
  const video = subjectData?.videos.find((v) => v.id === videoId);

  // Get video index for prev/next navigation
  const videoIndex = subjectData?.videos.findIndex((v) => v.id === videoId) ?? -1;
  const prevVideo = videoIndex > 0 ? subjectData.videos[videoIndex - 1] : null;
  const nextVideo = videoIndex < (subjectData?.videos.length ?? 0) - 1 ? subjectData.videos[videoIndex + 1] : null;

  // Check for saved progress
  useEffect(() => {
    try {
      const saved = localStorage.getItem('medx2026_last');
      if (saved) {
        const parsed = JSON.parse(saved);
        const ytId = video?.videoUrl?.match(/embed\/([^?]+)/)?.[1];
        if (ytId && parsed.videoId === ytId) {
          setInitialTime(parsed.timestamp);
          return;
        }
      }
    } catch (_) {}
    setInitialTime(0);
  }, [video]);

  if (!video || !subjectData) {
    return (
      <>
        <Navbar showBack />
        <main className="watch-page container watch-page--not-found">
          <h1 className="watch-page__not-found-title">
            VIDEO NOT FOUND
          </h1>
          <button className="btn btn-primary neo-shadow" onClick={() => navigate('/subjects')}>
            BACK TO SUBJECTS
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar showBack />
      <main className="watch-page container" id="watch-page">
        {/* Back link */}
        <Link to={`/subjects/${subjectId}`} className="watch-page__back animate-slide-up">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to {subjectData.title}
        </Link>

        <div className="watch-page__layout animate-slide-up stagger-1">
          {/* Player column */}
          <div className="watch-page__player-col">
            <div className="watch-page__player-wrap">
              <CustomPlayer
                videoUrl={video.videoUrl}
                thumbnail={video.thumbnail}
                title={video.title}
                initialTime={initialTime}
              />
            </div>

            {/* Info bar */}
            <div className="watch-page__info-bar">
              <span className="tag tag-tertiary">{video.chapter}</span>
              <span className="watch-page__duration-badge">
                <span className="material-symbols-outlined">schedule</span>
                {video.duration}
              </span>
            </div>

            {/* Title */}
            <h1 className="watch-page__title">{video.title}</h1>

            {/* Navigation buttons */}
            <div className="watch-page__nav-row">
              {prevVideo ? (
                <Link
                  to={`/subjects/${subjectId}/watch/${prevVideo.id}`}
                  className="watch-page__nav-btn"
                >
                  <span className="material-symbols-outlined">skip_previous</span>
                  PREV
                </Link>
              ) : <div />}

              {nextVideo ? (
                <Link
                  to={`/subjects/${subjectId}/watch/${nextVideo.id}`}
                  className="watch-page__nav-btn watch-page__nav-btn--next"
                >
                  NEXT
                  <span className="material-symbols-outlined">skip_next</span>
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Sidebar — playlist */}
          <aside className="watch-page__sidebar">
            <h3 className="watch-page__sidebar-title">
              <span className="material-symbols-outlined">playlist_play</span>
              PLAYLIST
            </h3>
            <div className="watch-page__playlist">
              {subjectData.videos.map((v, i) => {
                const isCurrent = v.id === videoId;
                return (
                  <Link
                    key={v.id}
                    to={`/subjects/${subjectId}/watch/${v.id}`}
                    className={`watch-page__playlist-item ${isCurrent ? 'watch-page__playlist-item--active' : ''}`}
                  >
                    <div className="watch-page__playlist-thumb">
                      <img src={v.thumbnail} alt={v.title} loading="lazy" />
                      {isCurrent && (
                        <div className="watch-page__playlist-now">
                          <span className="material-symbols-outlined filled">
                            play_arrow
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="watch-page__playlist-info">
                      <span className="watch-page__playlist-chapter">{v.chapter}</span>
                      <span className="watch-page__playlist-name">{v.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
      <BottomNav activePage="gallery" />
    </>
  );
}
