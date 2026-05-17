import { useState } from 'react';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Footer from '../components/Footer';

function DownloadButton({ url, filename }) {
  const handleDownload = async () => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="pdf-download-btn neo-shadow-sm"
    >
      <span className="material-symbols-outlined">download</span>
      DOWNLOAD
    </button>
  );
}

function PDFItem({ item }) {
  return (
    <div className="pdf-item">
      <div className="pdf-item__left">
        <span className="material-symbols-outlined pdf-item__icon">
          description
        </span>
        <div>
          <h4 className="pdf-item__title">{item.title}</h4>
          <div className="pdf-item__tags">
            {item.tags.map((tag) => (
              <span
                key={tag.label}
                className={`pdf-tag pdf-tag--${tag.type}`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
      <DownloadButton url={item.url} filename={item.filename} />
    </div>
  );
}

function PDFFolder({ folder, isExpanded, onToggle }) {
  return (
    <div className={`pdf-folder ${isExpanded ? 'pdf-folder--expanded' : ''}`}>
      <button
        onClick={onToggle}
        className="pdf-folder__header neo-shadow"
      >
        <div className="pdf-folder__header-left">
          <span className="material-symbols-outlined pdf-folder__icon">
            {isExpanded ? 'folder_open' : 'folder'}
          </span>
          <div>
            <h3 className="pdf-folder__name">{folder.name}</h3>
            <span className="pdf-folder__count">
              {folder.items.length} PDF{folder.items.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <span
          className="material-symbols-outlined pdf-folder__arrow"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          expand_more
        </span>
      </button>

      <div
        className="pdf-folder__content"
        style={{
          maxHeight: isExpanded ? '20000px' : '0',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="pdf-folder__items">
          {folder.items.map((item) => (
            <PDFItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

const pdfFolders = [
  {
    id: 'fmt',
    name: 'FMT',
    items: [
      {
        id: 'fmt-workbook',
        title: 'FMT workbook',
        url: 'pdfs/fmt-wb.pdf',
        filename: 'FMT-Workbook.pdf',
        tags: [{ label: 'written', type: 'written' }],
      },
    ],
  },
];

export default function PDFsPage() {
  const [expandedFolder, setExpandedFolder] = useState(null);

  const toggleFolder = (folderId) => {
    if (expandedFolder === folderId) {
      setExpandedFolder(null);
    } else {
      setExpandedFolder(folderId);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pdfs-page container" id="pdfs-page">
        {/* Header */}
        <header className="pdfs-page__header animate-slide-up">
          <span className="tag tag-tertiary">RESOURCES</span>
          <h1 className="pdfs-page__title">
            Workbook PDF<br />folders
          </h1>
          <p className="pdfs-page__subtitle">
            Download subject workbooks and notes. Red tag means written, blue tag means unwritten.
          </p>
        </header>

        {/* Folders */}
        <section className="pdfs-page__folders animate-slide-up stagger-1">
          {pdfFolders.map((folder) => (
            <PDFFolder
              key={folder.id}
              folder={folder}
              isExpanded={expandedFolder === folder.id}
              onToggle={() => toggleFolder(folder.id)}
            />
          ))}
        </section>
      </main>
      <Footer />
      <BottomNav activePage="pdfs" />
    </>
  );
}
