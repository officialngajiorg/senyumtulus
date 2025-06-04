import type { User, Thread, Post, Volunteer } from './types';

export const mockUsers: User[] = [
  { id: 'user1', name: 'Budi Santoso', avatarUrl: 'https://placehold.co/100x100.png?text=BS' },
  { id: 'user2', name: 'Citra Lestari', avatarUrl: 'https://placehold.co/100x100.png?text=CL' },
  { id: 'user3', name: 'Admin SenyumTulus' },
];

export const mockPosts: Post[] = [
  {
    id: 'post1',
    author: mockUsers[0],
    content: 'Halo semua, anak saya baru saja didiagnosis CBL. Ada saran untuk langkah awal?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    likes: 15,
    reports: 0,
    attachments: [{ type: 'image', url: 'https://placehold.co/600x400.png', name: 'Foto USG.jpg', hint: 'medical ultrasound' }],
  },
  {
    id: 'post2',
    author: mockUsers[1],
    content: 'Pak Budi, tetap tenang ya. Langkah pertama biasanya konsultasi dengan tim dokter spesialis. Di kota mana Pak Budi tinggal?',
    timestamp: new Date(Date.now() - 1000 * 60 * 50), // 50 mins ago
    likes: 8,
    reports: 0,
  },
  {
    id: 'post3',
    author: mockUsers[0],
    content: 'Terima kasih Bu Citra. Saya di Jakarta. Apakah ada rekomendasi dokter?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    likes: 3,
    reports: 0,
  },
  {
    id: 'post4',
    author: mockUsers[1],
    content: 'Tentu, saya akan kirimkan beberapa kontak via PM ya. Semangat!',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 mins ago
    likes: 5,
    reports: 0,
  },
  {
    id: 'post5',
    author: mockUsers[1],
    content: 'Pengalaman saya dengan operasi tahap pertama cukup menantang tapi hasilnya luar biasa. Penting untuk mengikuti semua anjuran dokter pasca operasi.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    likes: 22,
    reports: 0,
    attachments: [{ type: 'document', url: '#', name: 'Jadwal Terapi.pdf', hint: 'document schedule' }],
  },
];

export const mockThreads: Thread[] = [
  {
    id: 'thread1',
    title: 'Baru Didiagnosis CBL - Mohon Pencerahan',
    author: mockUsers[0],
    originalPostContent: mockPosts[0].content,
    createdAt: mockPosts[0].timestamp,
    lastActivity: mockPosts[3].timestamp,
    replyCount: 3,
    viewCount: 120,
    posts: [mockPosts[0], mockPosts[1], mockPosts[2], mockPosts[3]],
  },
  {
    id: 'thread2',
    title: 'Sharing Pengalaman Operasi Tahap Pertama',
    author: mockUsers[1],
    originalPostContent: mockPosts[4].content,
    createdAt: mockPosts[4].timestamp,
    lastActivity: mockPosts[4].timestamp,
    replyCount: 0,
    viewCount: 75,
    posts: [mockPosts[4]],
  },
  {
    id: 'thread3',
    title: 'Tips Terapi Wicara untuk Anak CBL',
    author: mockUsers[0],
    originalPostContent: 'Apakah ada orang tua yang punya tips efektif untuk terapi wicara di rumah?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    replyCount: 5,
    viewCount: 250,
    posts: [
      { id: 'post6', author: mockUsers[0], content: 'Apakah ada orang tua yang punya tips efektif untuk terapi wicara di rumah?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), likes: 10, reports: 0 },
      { id: 'post7', author: mockUsers[1], content: 'Mainkan permainan meniup lilin atau sedotan, Bu. Itu membantu menguatkan otot mulut.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), likes: 12, reports: 0 },
    ],
  },
];

export const mockVolunteers: Volunteer[] = [
  {
    id: 'volunteer1',
    name: 'Dr. Rina Wijaya',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    contact: { email: 'rina.wijaya@example.com', whatsapp: '081234567890' },
    experience: 'Dokter anak spesialis bedah plastik rekonstruksi, 10 tahun pengalaman menangani kasus CBL.',
    specialization: ['Bedah Plastik', 'Konseling Pra-Operasi'],
    availability: 'Senin-Jumat, jam kerja',
    avatarUrl: 'https://placehold.co/100x100.png?text=RW',
    bio: 'Berdedikasi untuk membantu anak-anak CBL mendapatkan senyum terbaik mereka. Aktif dalam kegiatan sosial dan penelitian terkait CBL.',
    socialMedia: { linkedin: '#' }
  },
  {
    id: 'volunteer2',
    name: 'Andi Pratama',
    province: 'Jawa Barat',
    city: 'Bandung',
    contact: { email: 'andi.pratama@example.com' },
    experience: 'Ayah dari anak dengan CBL usia 5 tahun. Aktif berbagi pengalaman dan dukungan moral.',
    specialization: ['Dukungan Emosional', 'Parenting CBL'],
    availability: 'Fleksibel,utamakan akhir pekan',
    avatarUrl: 'https://placehold.co/100x100.png?text=AP',
    bio: 'Saya percaya berbagi pengalaman adalah kekuatan. Siap mendengarkan dan memberikan dukungan untuk sesama pejuang senyum.',
    socialMedia: { facebook: '#', instagram: '#' }
  },
  {
    id: 'volunteer3',
    name: 'Siti Aminah',
    province: 'Jawa Timur',
    city: 'Surabaya',
    contact: { whatsapp: '087654321098' },
    experience: 'Terapis wicara dengan fokus pada anak-anak berkebutuhan khusus, termasuk CBL, selama 7 tahun.',
    specialization: ['Terapi Wicara', 'Terapi Oral Motor'],
    availability: 'Sesuai perjanjian',
    bio: 'Membantu anak-anak berkomunikasi dengan lebih baik adalah passion saya. Menyediakan sesi konsultasi dan terapi.',
    socialMedia: {}
  },
  {
    id: 'volunteer4',
    name: 'Eko Kurniawan',
    province: 'DI Yogyakarta',
    city: 'Yogyakarta',
    contact: { email: 'eko.k@example.com', whatsapp: '081122334455' },
    experience: 'Penderita CBL dewasa, berhasil melewati berbagai tahapan operasi dan terapi. Aktif sebagai motivator.',
    specialization: ['Motivasi', 'Pengalaman Penderita'],
    availability: 'Sore hari & Akhir Pekan',
    avatarUrl: 'https://placehold.co/100x100.png?text=EK',
    bio: 'Jangan pernah menyerah! Saya di sini untuk berbagi cerita dan membuktikan bahwa CBL bukan halangan untuk meraih mimpi.',
    socialMedia: { twitter: '#', instagram: '#' }
  },
];
