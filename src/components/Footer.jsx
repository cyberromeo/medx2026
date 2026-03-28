export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div>
            <div className="footer__brand">MEDX 2026</div>
            <p className="footer__tagline" style={{ marginTop: '0.75rem' }}>
              Premium medical video streaming platform. Master clinical excellence through structured video lectures.
            </p>
          </div>
          <div className="footer__links">
            <a href="#" className="footer__link">Subjects</a>
            <a href="#" className="footer__link">Gallery</a>
            <a href="#" className="footer__link">About</a>
            <a href="#" className="footer__link">Contact</a>
          </div>
        </div>

        <hr className="footer__divider" />

        <div className="footer__bottom">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span className="footer__credit">
              Designed by <span className="footer__credit-name">SRIHARI</span>
            </span>
            <div className="footer__bauhaus-dots">
              <div className="footer__dot footer__dot--red"></div>
              <div className="footer__dot footer__dot--yellow"></div>
              <div className="footer__dot footer__dot--blue"></div>
            </div>
          </div>
          <span className="footer__copyright">
            © {new Date().getFullYear()} MedX 2026. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
