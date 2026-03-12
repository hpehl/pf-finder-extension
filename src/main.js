import { Finder } from './finder.js';

const sampleData = [
  {
    id: 'applications',
    name: 'Applications',
    description: 'Installed applications',
    icon: 'fas fa-grid-2',
    actions: true,
    meta: { Kind: 'Folder', Created: '2024-01-15' },
    children: [
      {
        id: 'browser',
        name: 'Web Browser',
        description: 'Browse the internet',
        icon: 'fas fa-globe',
        actions: true,
        meta: { Kind: 'Application', Version: '120.0', Size: '245 MB' },
      },
      {
        id: 'editor',
        name: 'Code Editor',
        description: 'Write and edit code',
        icon: 'fas fa-code',
        actions: true,
        meta: { Kind: 'Application', Version: '1.85.0', Size: '380 MB' },
      },
      {
        id: 'terminal',
        name: 'Terminal',
        icon: 'fas fa-terminal',
        actions: true,
        meta: { Kind: 'Application', Version: '2.12', Size: '12 MB' },
      },
      {
        id: 'utilities',
        name: 'Utilities',
        icon: 'fas fa-wrench',
        actions: true,
        meta: { Kind: 'Folder', Created: '2024-02-10' },
        children: [
          {
            id: 'calculator',
            name: 'Calculator',
            icon: 'fas fa-calculator',
            meta: { Kind: 'Application', Size: '5 MB' },
          },
          {
            id: 'screenshot',
            name: 'Screenshot',
            icon: 'fas fa-camera',
            meta: { Kind: 'Application', Size: '8 MB' },
          },
          {
            id: 'disk-utility',
            name: 'Disk Utility',
            icon: 'fas fa-hard-drive',
            meta: { Kind: 'Application', Size: '22 MB' },
          },
        ],
      },
    ],
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Personal documents and projects',
    icon: 'fas fa-folder',
    actions: true,
    meta: { Kind: 'Folder', Created: '2023-06-20' },
    children: [
      {
        id: 'projects',
        name: 'Projects',
        icon: 'fas fa-folder',
        actions: true,
        meta: { Kind: 'Folder', Created: '2023-09-01' },
        children: [
          {
            id: 'webapp',
            name: 'Web App',
            icon: 'fas fa-folder',
            actions: true,
            meta: { Kind: 'Folder', Files: '42' },
            children: [
              {
                id: 'index-html',
                name: 'index.html',
                icon: 'fas fa-file-code',
                meta: { Kind: 'HTML Document', Size: '4.2 KB', Modified: '2024-03-01' },
              },
              {
                id: 'styles-css',
                name: 'styles.css',
                icon: 'fas fa-file-code',
                meta: { Kind: 'CSS Stylesheet', Size: '12.8 KB', Modified: '2024-03-01' },
              },
              {
                id: 'app-js',
                name: 'app.js',
                icon: 'fas fa-file-code',
                meta: { Kind: 'JavaScript', Size: '28.5 KB', Modified: '2024-02-28' },
              },
              {
                id: 'src',
                name: 'src',
                icon: 'fas fa-folder',
                actions: true,
                meta: { Kind: 'Folder', Files: '12' },
                children: [
                  {
                    id: 'components',
                    name: 'components',
                    icon: 'fas fa-folder',
                    actions: true,
                    meta: { Kind: 'Folder', Files: '8' },
                    children: [
                      {
                        id: 'header-jsx',
                        name: 'Header.jsx',
                        icon: 'fas fa-file-code',
                        meta: { Kind: 'JSX Component', Size: '3.1 KB', Modified: '2024-02-25' },
                      },
                      {
                        id: 'footer-jsx',
                        name: 'Footer.jsx',
                        icon: 'fas fa-file-code',
                        meta: { Kind: 'JSX Component', Size: '1.8 KB', Modified: '2024-02-20' },
                      },
                      {
                        id: 'sidebar-jsx',
                        name: 'Sidebar.jsx',
                        icon: 'fas fa-file-code',
                        meta: { Kind: 'JSX Component', Size: '4.5 KB', Modified: '2024-03-01' },
                      },
                    ],
                  },
                  {
                    id: 'utils-js',
                    name: 'utils.js',
                    icon: 'fas fa-file-code',
                    meta: { Kind: 'JavaScript', Size: '2.4 KB', Modified: '2024-01-15' },
                  },
                ],
              },
            ],
          },
          {
            id: 'mobile-app',
            name: 'Mobile App',
            icon: 'fas fa-folder',
            actions: true,
            meta: { Kind: 'Folder', Files: '18' },
            children: [
              {
                id: 'main-dart',
                name: 'main.dart',
                icon: 'fas fa-file-code',
                meta: { Kind: 'Dart Source', Size: '6.1 KB' },
              },
            ],
          },
        ],
      },
      {
        id: 'notes-txt',
        name: 'notes.txt',
        icon: 'fas fa-file-lines',
        meta: { Kind: 'Plain Text', Size: '2.1 KB', Modified: '2024-02-15' },
      },
      {
        id: 'report-pdf',
        name: 'report.pdf',
        icon: 'fas fa-file-pdf',
        meta: { Kind: 'PDF Document', Size: '1.4 MB', Modified: '2024-01-20' },
      },
    ],
  },
  {
    id: 'downloads',
    name: 'Downloads',
    description: 'Downloaded files',
    icon: 'fas fa-download',
    actions: true,
    meta: { Kind: 'Folder', Created: '2023-06-20' },
    children: [
      {
        id: 'archive-zip',
        name: 'archive.zip',
        icon: 'fas fa-file-zipper',
        meta: { Kind: 'ZIP Archive', Size: '45.2 MB', Modified: '2024-03-05' },
      },
      {
        id: 'photo-jpg',
        name: 'vacation-photo.jpg',
        icon: 'fas fa-file-image',
        meta: { Kind: 'JPEG Image', Size: '3.8 MB', Dimensions: '4032 x 3024' },
      },
      {
        id: 'presentation',
        name: 'presentation.pptx',
        icon: 'fas fa-file-powerpoint',
        meta: { Kind: 'PowerPoint', Size: '12.5 MB', Modified: '2024-02-20' },
      },
    ],
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Audio files and playlists',
    icon: 'fas fa-music',
    meta: { Kind: 'Folder', Created: '2023-08-15' },
    children: [
      {
        id: 'playlist-1',
        name: 'Favorites',
        icon: 'fas fa-folder',
        meta: { Kind: 'Folder', Tracks: '24' },
        children: [
          {
            id: 'song-1',
            name: 'Summer Breeze.mp3',
            icon: 'fas fa-file-audio',
            meta: { Kind: 'MP3 Audio', Size: '8.2 MB', Duration: '3:42' },
          },
          {
            id: 'song-2',
            name: 'Night Drive.mp3',
            icon: 'fas fa-file-audio',
            meta: { Kind: 'MP3 Audio', Size: '9.1 MB', Duration: '4:15' },
          },
        ],
      },
    ],
  },
  {
    id: 'pictures',
    name: 'Pictures',
    description: 'Photos and images',
    icon: 'fas fa-images',
    meta: { Kind: 'Folder', Created: '2023-07-01' },
    children: [
      {
        id: 'wallpapers',
        name: 'Wallpapers',
        icon: 'fas fa-folder',
        meta: { Kind: 'Folder', Items: '15' },
        children: [
          {
            id: 'mountain-jpg',
            name: 'mountain.jpg',
            icon: 'fas fa-file-image',
            meta: { Kind: 'JPEG Image', Size: '5.2 MB', Dimensions: '5120 x 2880' },
          },
          {
            id: 'ocean-jpg',
            name: 'ocean.jpg',
            icon: 'fas fa-file-image',
            meta: { Kind: 'JPEG Image', Size: '4.8 MB', Dimensions: '5120 x 2880' },
          },
        ],
      },
      {
        id: 'screenshots',
        name: 'Screenshots',
        icon: 'fas fa-folder',
        meta: { Kind: 'Folder', Items: '42' },
        children: [
          {
            id: 'screenshot-1',
            name: 'Screen Shot 2024-03-01.png',
            icon: 'fas fa-file-image',
            meta: { Kind: 'PNG Image', Size: '1.2 MB' },
          },
        ],
      },
    ],
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('finder-demo');
  if (!mount) return;

  const finder = new Finder(mount, {
    data: sampleData,
    showSearch: true,
    keyboardMode: 'outline',
    onSelect: (item) => {
      console.log('Selected:', item.name);
    },
  });

  // Keyboard mode switch
  const controls = document.getElementById('finder-controls');
  if (controls) {
    const select = document.createElement('select');
    select.classList.add('pf-v6-c-form-control');
    select.innerHTML = `
      <option value="outline">Outline</option>
      <option value="navigate">Navigate</option>
    `;
    select.addEventListener('change', () => {
      finder.setKeyboardMode(select.value);
    });

    const label = document.createElement('label');
    label.style.cssText = 'display: inline-flex; align-items: center; gap: var(--pf-t--global--spacer--200);';
    label.textContent = 'Keyboard mode: ';
    label.appendChild(select);
    controls.appendChild(label);
  }
});
