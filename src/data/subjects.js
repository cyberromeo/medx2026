// Subject and video data for MedX 2026

export const subjects = [
  {
    id: 'pathology',
    name: 'Pathology',
    module: '04',
    description: 'Study of the causes and effects of disease or injury.',
    units: 24,
    hours: '48H',
    variant: 'featured',
    icon: 'biotech',
  },
  {
    id: 'locked',
    name: 'More Subjects',
    module: null,
    description: 'Yet to upload',
    variant: 'locked',
    icon: 'lock',
  },
];

export const videosBySubject = {
  pathology: {
    title: 'PATHOLOGY',
    modules: 12,
    duration: '24H',
    videos: [
      {
        id: 'path-01',
        chapter: 'CLASS 1 — 26 MAR',
        title: 'Hematology — Class 1',
        duration: 'LIVE',
        chapterColor: 'tertiary',
        thumbnail: 'https://img.youtube.com/vi/y77AjIaD5yQ/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/y77AjIaD5yQ?controls=1&rel=0&autoplay=1&mute=0',
        variant: 'default',
      },
      {
        id: 'path-02',
        chapter: 'CLASS 2 — 26 MAR',
        title: 'Hematology — Class 2',
        duration: 'LIVE',
        chapterColor: 'secondary',
        thumbnail: 'https://img.youtube.com/vi/ctLpygJcoW8/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/ctLpygJcoW8?controls=1&rel=0&autoplay=1&mute=0',
        variant: 'default',
      },
      {
        id: 'path-03',
        chapter: 'CLASS 3 — 26 MAR',
        title: 'Platelets & Coagulation — Class 3',
        duration: 'LIVE',
        chapterColor: 'primary-container',
        thumbnail: 'https://img.youtube.com/vi/Z3fYjTrzdqk/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/Z3fYjTrzdqk?controls=1&rel=0&autoplay=1&mute=0',
        variant: 'dark',
      },
      {
        id: 'path-04',
        chapter: 'CLASS 1 — 27 MAR',
        title: 'Platelets & Coagulation — Class 1',
        duration: 'LIVE',
        chapterColor: 'tertiary',
        thumbnail: 'https://img.youtube.com/vi/j2QsOdX23ns/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/j2QsOdX23ns?controls=1&rel=0&autoplay=1&mute=0',
        variant: 'default',
      },
      {
        id: 'path-05',
        chapter: 'CLASS 2 — 27 MAR',
        title: 'WBC Disorder — Class 2',
        duration: 'LIVE',
        chapterColor: 'secondary',
        thumbnail: 'https://img.youtube.com/vi/quuNC_FcWF4/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/quuNC_FcWF4?controls=1&rel=0&autoplay=1&mute=0',
        variant: 'default',
      },
      {
        id: 'path-06',
        chapter: 'CLASS 3 — 27 MAR',
        title: 'WBC Disorder — Class 3',
        duration: 'LIVE',
        chapterColor: 'primary',
        thumbnail: 'https://img.youtube.com/vi/eL1Z6meCQCQ/hqdefault.jpg',
        videoUrl: 'https://www.youtube.com/embed/eL1Z6meCQCQ?controls=1&rel=0&autoplay=1&mute=0',
        variant: 'muted',
      },
    ],
  },

};
