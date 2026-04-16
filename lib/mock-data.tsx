// ============================================
// KabarKini — Rich Sample Data
// Simulates Supabase database responses
// ============================================

import type { Article, Category, Tag, TrendingTopic, WorkflowRun, Source, AdminStats } from '@/types'

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Politik', slug: 'politik', color: '#1D4ED8', articleCount: 47 },
  { id: 'cat-2', name: 'Hukum', slug: 'hukum', color: '#7C3AED', articleCount: 31 },
  { id: 'cat-3', name: 'Ekonomi', slug: 'ekonomi', color: '#065F46', articleCount: 38 },
  { id: 'cat-4', name: 'Teknologi', slug: 'teknologi', color: '#0369A1', articleCount: 29 },
  { id: 'cat-5', name: 'Sosial', slug: 'sosial', color: '#D97706', articleCount: 22 },
  { id: 'cat-6', name: 'Olahraga', slug: 'olahraga', color: '#DC2626', articleCount: 18 },
  { id: 'cat-7', name: 'Internasional', slug: 'internasional', color: '#374151', articleCount: 25 },
  { id: 'cat-8', name: 'Viral', slug: 'viral', color: '#DB2777', articleCount: 14 },
]

export const TAGS: Tag[] = [
  { id: 'tag-1', name: 'DPR', slug: 'dpr', articleCount: 23 },
  { id: 'tag-2', name: 'Jokowi', slug: 'jokowi', articleCount: 19 },
  { id: 'tag-3', name: 'Prabowo', slug: 'prabowo', articleCount: 31 },
  { id: 'tag-4', name: 'APBN', slug: 'apbn', articleCount: 14 },
  { id: 'tag-5', name: 'KPK', slug: 'kpk', articleCount: 28 },
  { id: 'tag-6', name: 'Korupsi', slug: 'korupsi', articleCount: 22 },
  { id: 'tag-7', name: 'Inflasi', slug: 'inflasi', articleCount: 11 },
  { id: 'tag-8', name: 'AI', slug: 'ai', articleCount: 17 },
  { id: 'tag-9', name: 'Pemilu', slug: 'pemilu', articleCount: 36 },
  { id: 'tag-10', name: 'Mahkamah Agung', slug: 'mahkamah-agung', articleCount: 9 },
]

export const ARTICLES: Article[] = [
  // ─── ARTIKEL 1 ──────────────────────────────────────────
  {
    id: 'art-001',
    title: 'DPR Sahkan RUU Perampasan Aset, Koruptor Wajib Kembalikan Harta Negara',
    alternativeTitles: [
      'RUU Perampasan Aset Resmi Jadi Undang-Undang, Ini Dampaknya',
      'Babak Baru Pemberantasan Korupsi: Aset Koruptor Bisa Dirampas Tanpa Tuntutan Pidana',
    ],
    slug: 'dpr-sahkan-ruu-perampasan-aset-koruptor',
    excerpt:
      'DPR RI secara resmi mengesahkan Rancangan Undang-Undang Perampasan Aset dalam sidang paripurna. Regulasi baru ini memungkinkan negara menyita harta hasil korupsi bahkan tanpa proses pidana terlebih dahulu.',
    metaTitle: 'DPR Sahkan RUU Perampasan Aset: Koruptor Wajib Kembalikan Harta | KabarKini',
    metaDescription:
      'DPR RI resmi mengesahkan UU Perampasan Aset. Negara kini bisa menyita aset koruptor tanpa menunggu putusan pidana. Simak penjelasan lengkapnya.',
    focusKeyword: 'RUU Perampasan Aset',
    relatedKeywords: ['UU Perampasan Aset', 'korupsi DPR', 'aset koruptor', 'hukum pidana Indonesia'],
    category: CATEGORIES[1],
    tags: [TAGS[0], TAGS[4], TAGS[5]],
    coverImageUrl: 'https://placehold.co/1200x630?text=Sidang+Paripurna+DPR+Pengesahan+RUU+Perampasan+Aset',
    coverImagePrompt: 'Suasana sidang paripurna DPR RI, gedung DPR Senayan Jakarta, anggota dewan berjas, ruangan besar formal',
    coverImageAlt: 'Suasana sidang paripurna DPR RI saat pengesahan RUU Perampasan Aset di gedung Senayan',
    articleText: `DPR RI resmi mengesahkan Rancangan Undang-Undang (RUU) Perampasan Aset Tindak Pidana dalam Rapat Paripurna yang berlangsung di Gedung Nusantara II, kompleks parlemen Senayan, Jakarta.

Pengesahan ini menjadi tonggak penting dalam sejarah pemberantasan korupsi di Indonesia. Dengan regulasi baru ini, negara kini memiliki kewenangan untuk merampas aset hasil kejahatan, termasuk korupsi, meskipun pelakunya belum atau tidak bisa dituntut secara pidana.

Mekanisme Non-Conviction Based (NCB) Asset Forfeiture yang diadopsi dalam undang-undang ini memungkinkan jaksa mengajukan gugatan perdata untuk merampas aset yang diduga merupakan hasil kejahatan, tanpa harus membuktikan kesalahan pidana pemiliknya terlebih dahulu.

Ketua DPR Puan Maharani menyebut pengesahan ini sebagai langkah strategis bangsa menuju sistem hukum yang lebih adil. "Undang-undang ini bukan sekadar tentang aset, ini tentang keadilan bagi seluruh rakyat Indonesia yang selama ini menanggung kerugian akibat korupsi," ujarnya usai sidang.

Komisi Pemberantasan Korupsi (KPK) menyambut positif langkah legislatif ini. Ketua KPK menyatakan bahwa undang-undang ini akan memperkuat posisi lembaganya dalam memulihkan kerugian negara yang nilainya mencapai triliunan rupiah setiap tahun.

Para akademisi hukum menilai UU ini merupakan evolusi penting sistem hukum Indonesia. Namun beberapa pihak juga mengingatkan pentingnya mekanisme pengawasan yang ketat agar regulasi ini tidak disalahgunakan.`,
    articleHtml: `<p>DPR RI resmi mengesahkan Rancangan Undang-Undang (RUU) Perampasan Aset Tindak Pidana dalam Rapat Paripurna yang berlangsung di Gedung Nusantara II, kompleks parlemen Senayan, Jakarta.</p>
<p>Pengesahan ini menjadi tonggak penting dalam sejarah pemberantasan korupsi di Indonesia. Dengan regulasi baru ini, negara kini memiliki kewenangan untuk merampas aset hasil kejahatan, termasuk korupsi, meskipun pelakunya belum atau tidak bisa dituntut secara pidana.</p>
<h2>Mekanisme Non-Conviction Based</h2>
<p>Mekanisme Non-Conviction Based (NCB) Asset Forfeiture yang diadopsi dalam undang-undang ini memungkinkan jaksa mengajukan gugatan perdata untuk merampas aset yang diduga merupakan hasil kejahatan, tanpa harus membuktikan kesalahan pidana pemiliknya terlebih dahulu.</p>
<blockquote>"Undang-undang ini bukan sekadar tentang aset, ini tentang keadilan bagi seluruh rakyat Indonesia yang selama ini menanggung kerugian akibat korupsi." — Ketua DPR</blockquote>
<p>Komisi Pemberantasan Korupsi (KPK) menyambut positif langkah legislatif ini. Ketua KPK menyatakan bahwa undang-undang ini akan memperkuat posisi lembaganya dalam memulihkan kerugian negara yang nilainya mencapai triliunan rupiah setiap tahun.</p>`,
    bulletPoints: [
      'DPR resmi sahkan RUU Perampasan Aset dalam sidang paripurna',
      'Negara bisa rampas aset koruptor tanpa putusan pidana (non-conviction based)',
      'KPK menyambut positif, sebut ini terobosan hukum terbesar dalam 20 tahun',
      'Regulasi baru ini berlaku juga untuk TPPU dan tindak pidana narkoba',
      'Presiden diharapkan segera menandatangani untuk diundangkan',
    ],
    whyItMatters:
      'Undang-undang ini merupakan terobosan besar dalam sistem hukum Indonesia karena memungkinkan negara memulihkan kerugian keuangan negara secara lebih efektif, bahkan ketika pelaku korupsi lolos dari hukuman pidana karena berbagai alasan prosedural.',
    nextToWatch:
      'Proses penandatanganan oleh Presiden, pembentukan aturan pelaksana (PP/Perpres), serta respons dari lembaga penegak hukum dan komunitas hukum internasional.',
    sources: [
      { id: 's1', name: 'Antara', url: 'https://antaranews.com', type: 'media', trustScore: 95, publishedAt: '2026-04-15' },
      { id: 's2', name: 'Kompas.com', url: 'https://kompas.com', type: 'media', trustScore: 92, publishedAt: '2026-04-15' },
      { id: 's3', name: 'DPR RI', url: 'https://dpr.go.id', type: 'official', trustScore: 99, publishedAt: '2026-04-15' },
    ],
    verificationStatus: 'verified',
    originalityScore: 94,
    readabilityScore: 88,
    seoScore: 91,
    factualConsistencyScore: 97,
    duplicationRiskScore: 8,
    publishReadinessScore: 93,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    editorName: 'Redaktur Senior',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    sourceCount: 3,
    wordCount: 742,
    readingTime: 4,
    canonicalUrl: 'https://kabarkini.id/dpr-sahkan-ruu-perampasan-aset-koruptor',
    publishedAt: '2026-04-15T06:45:00Z',
    createdAt: '2026-04-15T05:30:00Z',
    updatedAt: '2026-04-15T06:44:00Z',
    viewCount: 24300,
  },
  // ─── ARTIKEL 2 ──────────────────────────────────────────
  {
    id: 'art-002',
    title: 'BI Naikkan Suku Bunga Acuan 25 Basis Poin, Rupiah Menguat ke Level Terbaik 3 Bulan',
    alternativeTitles: [
      'Bank Indonesia Kerek BI Rate, Rupiah Langsung Merespons Positif',
      'Kebijakan Moneter BI: Suku Bunga Naik, Inflasi Jadi Target Utama',
    ],
    slug: 'bi-naikkan-suku-bunga-acuan-rupiah-menguat',
    excerpt:
      'Bank Indonesia memutuskan menaikkan suku bunga acuan BI Rate sebesar 25 basis poin menjadi 6,25 persen dalam Rapat Dewan Gubernur. Nilai tukar rupiah langsung menguat ke level Rp15.620 per dolar AS.',
    metaTitle: 'BI Naikan BI Rate 25 Bps, Rupiah Menguat | KabarKini',
    metaDescription:
      'Bank Indonesia naikkan suku bunga acuan 25 basis poin jadi 6,25%. Rupiah menguat ke Rp15.620 per dolar. Baca analisis lengkap dampaknya.',
    focusKeyword: 'BI naikkan suku bunga',
    relatedKeywords: ['BI Rate', 'rupiah menguat', 'kebijakan moneter', 'Bank Indonesia'],
    category: CATEGORIES[2],
    tags: [TAGS[6], TAGS[3]],
    coverImageUrl: 'https://placehold.co/1200x630?text=Bank+Indonesia+Gedung+Thamrin+Jakarta+Kebijakan+Moneter',
    coverImagePrompt: 'Gedung Bank Indonesia di Jalan Thamrin Jakarta, logo BI, suasana kota modern',
    coverImageAlt: 'Gedung Bank Indonesia di kawasan Thamrin Jakarta sebagai simbol kebijakan moneter nasional',
    articleText: `Bank Indonesia (BI) memutuskan untuk menaikkan suku bunga acuan atau BI Rate sebesar 25 basis poin (bps) menjadi 6,25 persen per tahun. Keputusan ini diambil dalam Rapat Dewan Gubernur (RDG) Bank Indonesia yang berlangsung selama dua hari.

Gubernur Bank Indonesia Perry Warjiyo menjelaskan bahwa kenaikan ini merupakan langkah antisipatif untuk menjaga stabilitas nilai tukar rupiah di tengah ketidakpastian global dan tekanan inflasi yang masih membutuhkan perhatian.

Pasar keuangan merespons positif keputusan ini. Nilai tukar rupiah langsung menguat ke level Rp15.620 per dolar AS, menjadi yang terkuat dalam tiga bulan terakhir. Indeks Harga Saham Gabungan (IHSG) juga menutup perdagangan dengan kenaikan 0,8 persen.

Ekonom senior dari Universitas Indonesia menilai langkah BI sudah tepat mengingat tren penguatan dolar global yang terus berlanjut. Namun ia mengingatkan bahwa kenaikan suku bunga berpotensi memperlambat pertumbuhan kredit perbankan dan investasi.

Suku bunga Deposit Facility ditetapkan pada 5,50 persen dan Lending Facility pada 7,00 persen, masing-masing naik 25 bps dari posisi sebelumnya.`,
    articleHtml: `<p>Bank Indonesia (BI) memutuskan untuk menaikkan suku bunga acuan atau BI Rate sebesar 25 basis poin (bps) menjadi 6,25 persen per tahun.</p>
<p>Gubernur Bank Indonesia Perry Warjiyo menjelaskan bahwa kenaikan ini merupakan langkah antisipatif untuk menjaga stabilitas nilai tukar rupiah di tengah ketidakpastian global.</p>
<h2>Respons Pasar Keuangan</h2>
<p>Pasar keuangan merespons positif keputusan ini. Nilai tukar rupiah langsung menguat ke level <strong>Rp15.620 per dolar AS</strong>, menjadi yang terkuat dalam tiga bulan terakhir.</p>`,
    bulletPoints: [
      'BI Rate naik 25 bps menjadi 6,25% per tahun',
      'Rupiah menguat ke Rp15.620 per dolar AS — terkuat 3 bulan terakhir',
      'IHSG naik 0,8% merespons keputusan RDG BI',
      'Deposit Facility: 5,50%, Lending Facility: 7,00%',
      'Langkah ini dinilai antisipatif terhadap gejolak global',
    ],
    whyItMatters:
      'Kenaikan suku bunga BI Rate berdampak langsung pada biaya kredit, investasi, dan daya beli masyarakat. Keputusan ini mencerminkan respons kebijakan moneter terhadap tekanan eksternal yang bisa memengaruhi stabilitas ekonomi nasional.',
    nextToWatch:
      'Pergerakan inflasi bulan berikutnya, respons sektor perbankan terhadap kenaikan bunga, dan sinyal kebijakan BI dalam RDG mendatang.',
    sources: [
      { id: 's4', name: 'Bank Indonesia', url: 'https://bi.go.id', type: 'official', trustScore: 100, publishedAt: '2026-04-15' },
      { id: 's5', name: 'Tempo.co', url: 'https://tempo.co', type: 'media', trustScore: 90, publishedAt: '2026-04-15' },
    ],
    verificationStatus: 'verified',
    originalityScore: 91,
    readabilityScore: 86,
    seoScore: 89,
    factualConsistencyScore: 95,
    duplicationRiskScore: 12,
    publishReadinessScore: 90,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    editorName: 'Redaktur Ekonomi',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    sourceCount: 2,
    wordCount: 618,
    readingTime: 3,
    canonicalUrl: 'https://kabarkini.id/bi-naikkan-suku-bunga-acuan-rupiah-menguat',
    publishedAt: '2026-04-15T08:00:00Z',
    createdAt: '2026-04-15T07:00:00Z',
    updatedAt: '2026-04-15T07:55:00Z',
    viewCount: 18750,
  },
  // ─── ARTIKEL 3 ──────────────────────────────────────────
  {
    id: 'art-003',
    title: 'Gempa M6,4 Guncang Sulawesi Tengah, BMKG Pastikan Tidak Berpotensi Tsunami',
    alternativeTitles: [
      'BMKG: Gempa Kuat di Sulteng Tidak Picu Tsunami, Warga Diminta Tenang',
      'Sulawesi Tengah Diguncang Gempa 6,4 SR, Beberapa Bangunan Dilaporkan Retak',
    ],
    slug: 'gempa-m64-sulawesi-tengah-bmkg-tidak-tsunami',
    excerpt:
      'Gempa berkekuatan magnitudo 6,4 mengguncang wilayah Sulawesi Tengah pada pukul 14.22 WIB. BMKG menyatakan gempa tidak berpotensi tsunami namun meminta masyarakat tetap waspada terhadap gempa susulan.',
    metaTitle: 'Gempa M6,4 Sulawesi Tengah: BMKG Tidak Berpotensi Tsunami | KabarKini',
    metaDescription:
      'Gempa magnitudo 6,4 guncang Sulawesi Tengah siang ini. BMKG pastikan tidak berpotensi tsunami. Cek info terkini dan imbauan keselamatan.',
    focusKeyword: 'gempa Sulawesi Tengah',
    relatedKeywords: ['BMKG gempa hari ini', 'gempa Palu', 'gempa terkini Indonesia', 'tsunami Indonesia'],
    category: CATEGORIES[4],
    tags: [],
    coverImageUrl: 'https://placehold.co/1200x630?text=Gempa+Bumi+Sulawesi+Tengah+BMKG+Peta+Gempa+Indonesia',
    coverImagePrompt: 'Peta gempa Indonesia dari BMKG, seismograf, suasana Sulawesi Tengah, pusat kota Palu',
    coverImageAlt: 'Ilustrasi peta gempa bumi di wilayah Sulawesi Tengah berdasarkan data BMKG',
    articleText: `Gempa bumi berkekuatan magnitudo 6,4 mengguncang wilayah Sulawesi Tengah pada Selasa siang, tepatnya pukul 14.22 WIB. Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) segera merilis informasi resmi bahwa gempa tersebut tidak berpotensi menimbulkan tsunami.

Pusat gempa berada di koordinat 0,78 Lintang Selatan dan 119,95 Bujur Timur, dengan kedalaman 15 kilometer. Episentrum gempa berjarak sekitar 47 kilometer arah barat daya dari Kota Palu.

Kepala BMKG Dwikorita Karnawati meminta masyarakat tetap tenang namun waspada terhadap kemungkinan gempa susulan. "Kami memantau terus dan akan segera menginformasikan jika ada perkembangan signifikan," ujarnya dalam konferensi pers.

Getaran gempa dirasakan cukup kuat di beberapa wilayah termasuk Palu, Sigi, dan Donggala. Sejumlah warga sempat berhamburan keluar dari gedung dan permukiman. Beberapa laporan awal menyebut adanya retakan pada bangunan tua, namun belum ada laporan korban jiwa.

Tim Badan Nasional Penanggulangan Bencana (BNPB) segera dikerahkan untuk melakukan pemantauan dan asesmen dampak gempa di lapangan.`,
    articleHtml: `<p>Gempa bumi berkekuatan magnitudo 6,4 mengguncang wilayah Sulawesi Tengah pada Selasa siang, tepatnya pukul 14.22 WIB.</p>
<p>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) segera merilis informasi resmi bahwa gempa tersebut <strong>tidak berpotensi menimbulkan tsunami</strong>.</p>
<h2>Lokasi dan Kedalaman</h2>
<p>Pusat gempa berada di koordinat 0,78 Lintang Selatan dan 119,95 Bujur Timur, dengan kedalaman 15 kilometer, sekitar 47 km barat daya Kota Palu.</p>
<blockquote>"Kami memantau terus dan akan segera menginformasikan jika ada perkembangan signifikan." — Kepala BMKG</blockquote>`,
    bulletPoints: [
      'Gempa M6,4 guncang Sulawesi Tengah pukul 14.22 WIB',
      'BMKG: tidak berpotensi tsunami',
      'Kedalaman 15 km, episentrum 47 km barat daya Palu',
      'Getaran terasa di Palu, Sigi, dan Donggala',
      'BNPB segera turunkan tim asesmen lapangan',
    ],
    whyItMatters:
      'Sulawesi Tengah adalah kawasan rawan gempa dengan sejarah panjang bencana seismik. Respons cepat dan informasi akurat dari BMKG sangat krusial untuk mencegah kepanikan dan memastikan keselamatan masyarakat.',
    nextToWatch:
      'Laporan korban dan kerusakan dari BNPB, perkembangan gempa susulan dalam 24 jam ke depan, dan status pemukiman warga di zona rawan.',
    sources: [
      { id: 's6', name: 'BMKG', url: 'https://bmkg.go.id', type: 'official', trustScore: 100, publishedAt: '2026-04-15' },
      { id: 's7', name: 'BNPB', url: 'https://bnpb.go.id', type: 'official', trustScore: 98, publishedAt: '2026-04-15' },
      { id: 's8', name: 'Liputan6', url: 'https://liputan6.com', type: 'media', trustScore: 85, publishedAt: '2026-04-15' },
    ],
    verificationStatus: 'verified',
    originalityScore: 89,
    readabilityScore: 92,
    seoScore: 87,
    factualConsistencyScore: 99,
    duplicationRiskScore: 15,
    publishReadinessScore: 91,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: true,
    isFeatured: false,
    isTrending: true,
    sourceCount: 3,
    wordCount: 521,
    readingTime: 3,
    canonicalUrl: 'https://kabarkini.id/gempa-m64-sulawesi-tengah-bmkg-tidak-tsunami',
    publishedAt: '2026-04-15T14:35:00Z',
    createdAt: '2026-04-15T14:28:00Z',
    updatedAt: '2026-04-15T14:34:00Z',
    viewCount: 31200,
  },
  // ─── ARTIKEL 4 ──────────────────────────────────────────
  {
    id: 'art-004',
    title: 'Pemerintah Luncurkan Program 3 Juta Rumah, Target Rampung Sebelum 2029',
    alternativeTitles: [
      'Prabowo Umumkan Mega Proyek Perumahan Rakyat 3 Juta Unit hingga 2029',
      'Program 3 Juta Rumah Resmi Dimulai: Mana Saja Lokasinya?',
    ],
    slug: 'pemerintah-luncurkan-program-3-juta-rumah-2029',
    excerpt:
      'Presiden Prabowo Subianto secara resmi meluncurkan Program 3 Juta Rumah untuk rakyat berpenghasilan rendah. Program ini ditargetkan menyediakan 3 juta unit hunian layak huni sebelum tahun 2029.',
    metaTitle: 'Program 3 Juta Rumah Diluncurkan, Target Selesai 2029 | KabarKini',
    metaDescription:
      'Presiden Prabowo luncurkan Program 3 Juta Rumah untuk MBR. Simak target, lokasi, dan skema pembiayaan program perumahan rakyat terbesar ini.',
    focusKeyword: 'program 3 juta rumah',
    relatedKeywords: ['rumah subsidi', 'perumahan rakyat', 'KPR subsidi', 'backlog perumahan'],
    category: CATEGORIES[0],
    tags: [TAGS[2]],
    coverImageUrl: 'https://placehold.co/1200x630?text=Program+3+Juta+Rumah+Perumahan+Rakyat+Indonesia',
    coverImagePrompt: 'Kompleks perumahan rakyat baru Indonesia, rumah sederhana rapi, suasana pagi, bendera merah putih',
    coverImageAlt: 'Kompleks perumahan rakyat dalam Program 3 Juta Rumah yang diluncurkan pemerintah',
    articleText: `Presiden Prabowo Subianto secara resmi meluncurkan Program 3 Juta Rumah dalam sebuah seremoni besar di kawasan Bekasi, Jawa Barat. Program ambisius ini menargetkan penyediaan 3 juta unit hunian layak huni bagi masyarakat berpenghasilan rendah (MBR) sebelum akhir periode pemerintahan.

Program ini akan berjalan paralel antara pembangunan di perkotaan dan pedesaan, dengan alokasi 1 juta unit untuk wilayah perkotaan dan 2 juta unit untuk desa. Pemerintah menyiapkan anggaran Rp150 triliun yang bersumber dari APBN, dana BUMN, dan kemitraan dengan swasta.

Menteri Perumahan Rakyat menjelaskan bahwa program ini hadir untuk menjawab backlog perumahan nasional yang saat ini mencapai 9,9 juta unit. "Ini bukan sekadar program, ini adalah janji negara kepada rakyat yang selama ini tidak terjangkau oleh program perumahan konvensional," ujarnya.

Skema pembiayaan yang disiapkan mencakup KPR FLPP dengan bunga 5 persen per tahun, subsidi uang muka bagi PNS dan TNI/Polri berpenghasilan rendah, serta skema sewa beli bagi yang belum mampu membeli.

Para pengamat menilai program ini sangat ambisius namun dapat terwujud jika didukung regulasi pertanahan yang kuat, ketersediaan lahan, dan birokrasi yang efisien.`,
    articleHtml: `<p>Presiden Prabowo Subianto secara resmi meluncurkan Program 3 Juta Rumah dalam sebuah seremoni besar di kawasan Bekasi, Jawa Barat.</p>
<p>Program ambisius ini menargetkan penyediaan <strong>3 juta unit hunian layak huni</strong> bagi masyarakat berpenghasilan rendah (MBR) sebelum akhir periode pemerintahan.</p>
<h2>Alokasi dan Anggaran</h2>
<p>Program ini akan berjalan paralel antara pembangunan di perkotaan (1 juta unit) dan pedesaan (2 juta unit), dengan anggaran <strong>Rp150 triliun</strong> dari berbagai sumber pembiayaan.</p>`,
    bulletPoints: [
      'Target 3 juta unit — 1 juta kota, 2 juta desa — sebelum 2029',
      'Anggaran Rp150 triliun dari APBN, BUMN, dan swasta',
      'Menjawab backlog perumahan nasional 9,9 juta unit',
      'KPR FLPP bunga 5% untuk MBR, plus subsidi uang muka',
      'Skema sewa beli tersedia untuk yang belum mampu beli',
    ],
    whyItMatters:
      'Backlog perumahan yang hampir 10 juta unit adalah krisis hunian yang nyata. Program ini berpotensi mengubah kehidupan jutaan keluarga Indonesia, sekaligus menggerakkan industri konstruksi dan material bangunan nasional secara signifikan.',
    nextToWatch:
      'Proses pengadaan lahan, realisasi anggaran per kuartal, progres konstruksi di lapangan, serta keterbukaan daftar penerima manfaat.',
    sources: [
      { id: 's9', name: 'Sekretariat Negara', url: 'https://setneg.go.id', type: 'official', trustScore: 100, publishedAt: '2026-04-14' },
      { id: 's10', name: 'Kompas.com', url: 'https://kompas.com', type: 'media', trustScore: 92, publishedAt: '2026-04-14' },
    ],
    verificationStatus: 'verified',
    originalityScore: 88,
    readabilityScore: 90,
    seoScore: 85,
    factualConsistencyScore: 91,
    duplicationRiskScore: 18,
    publishReadinessScore: 87,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: false,
    isFeatured: true,
    isTrending: false,
    sourceCount: 2,
    wordCount: 680,
    readingTime: 4,
    canonicalUrl: 'https://kabarkini.id/pemerintah-luncurkan-program-3-juta-rumah-2029',
    publishedAt: '2026-04-14T09:00:00Z',
    createdAt: '2026-04-14T07:30:00Z',
    updatedAt: '2026-04-14T08:58:00Z',
    viewCount: 14500,
  },
  // ─── ARTIKEL 5 ──────────────────────────────────────────
  {
    id: 'art-005',
    title: 'Indonesia Masuk 10 Besar Negara dengan Pertumbuhan Startup AI Tertinggi di Asia',
    alternativeTitles: [
      'Ekosistem AI Indonesia Meledak: 10 Besar Asia dalam Pertumbuhan Startup',
      'Laporan Global: Indonesia Jadi Magnet Investasi AI di Asia Tenggara',
    ],
    slug: 'indonesia-masuk-10-besar-startup-ai-asia',
    excerpt:
      'Laporan terbaru dari firma riset teknologi global menempatkan Indonesia dalam 10 besar negara dengan pertumbuhan startup kecerdasan buatan tertinggi di Asia. Total investasi AI Indonesia melampaui USD 2,3 miliar sepanjang 2025.',
    metaTitle: 'Indonesia 10 Besar Startup AI Asia, Investasi Capai USD 2,3 Miliar | KabarKini',
    metaDescription:
      'Indonesia masuk 10 besar negara pertumbuhan startup AI di Asia. Investasi tembus USD 2,3 miliar. Baca laporan lengkap ekosistem AI Indonesia.',
    focusKeyword: 'startup AI Indonesia',
    relatedKeywords: ['investasi AI Indonesia', 'ekosistem teknologi Indonesia', 'kecerdasan buatan', 'startup unicorn'],
    category: CATEGORIES[3],
    tags: [TAGS[7]],
    coverImageUrl: 'https://placehold.co/1200x630?text=Startup+AI+Indonesia+Ekosistem+Teknologi+Asia+Tenggara',
    coverImagePrompt: 'Kantor startup teknologi modern di Jakarta, suasana co-working space, tampilan layar dengan visualisasi AI',
    coverImageAlt: 'Ekosistem startup AI Indonesia yang berkembang pesat di kawasan Asia Tenggara',
    articleText: `Indonesia berhasil menempati posisi tujuh dalam daftar 10 negara dengan pertumbuhan startup kecerdasan buatan (AI) tertinggi di Asia, berdasarkan laporan tahunan dari firma riset teknologi global, TechInsight Asia 2026.

Laporan tersebut mencatat bahwa total investasi di sektor AI Indonesia sepanjang tahun 2025 mencapai USD 2,3 miliar, melonjak 78 persen dibandingkan tahun sebelumnya. Angka ini menempatkan Indonesia di atas Vietnam, Malaysia, dan Thailand dalam kategori nilai investasi AI.

Menteri Komunikasi dan Informatika menyambut gembira pencapaian ini. Ia menyebut regulasi yang kondusif, sumber daya manusia berbakat, dan dukungan ekosistem startup telah menjadi fondasi kuat pertumbuhan ini.

Beberapa startup AI lokal yang disebut dalam laporan antara lain perusahaan-perusahaan di bidang healthtech, agritech, fintech berbasis AI, hingga platform pengolahan bahasa alami untuk Bahasa Indonesia.

Para investor menyebut Indonesia menarik karena memiliki basis pengguna digital terbesar keempat di dunia dan masalah nyata yang bisa dipecahkan oleh AI — mulai dari pertanian, kesehatan, pendidikan, hingga layanan keuangan.`,
    articleHtml: `<p>Indonesia berhasil menempati posisi tujuh dalam daftar 10 negara dengan pertumbuhan startup kecerdasan buatan (AI) tertinggi di Asia.</p>
<p>Total investasi di sektor AI Indonesia sepanjang tahun 2025 mencapai <strong>USD 2,3 miliar</strong>, melonjak 78 persen dibandingkan tahun sebelumnya.</p>
<h2>Faktor Pendorong Pertumbuhan</h2>
<p>Regulasi yang kondusif, sumber daya manusia berbakat, dan dukungan ekosistem startup telah menjadi fondasi kuat pertumbuhan sektor AI Indonesia.</p>`,
    bulletPoints: [
      'Indonesia ranking 7 dari 10 negara pertumbuhan startup AI tertinggi di Asia',
      'Total investasi AI Indonesia 2025 capai USD 2,3 miliar (+78% YoY)',
      'Ungguli Vietnam, Malaysia, dan Thailand dalam nilai investasi',
      'Sektor unggulan: healthtech, agritech, fintech, dan NLP Bahasa Indonesia',
      'Basis pengguna digital ke-4 terbesar dunia jadi daya tarik investor',
    ],
    whyItMatters:
      'Pertumbuhan ekosistem AI Indonesia bukan hanya soal angka investasi, melainkan tentang bagaimana teknologi ini akan mengubah cara jutaan orang Indonesia bekerja, bercocok tanam, mengakses layanan kesehatan, dan berpartisipasi dalam ekonomi digital.',
    nextToWatch:
      'Regulasi AI nasional yang sedang disusun pemerintah, perkembangan startup AI lokal, dan apakah ekosistem ini bisa menghasilkan unicorn AI pertama Indonesia.',
    sources: [
      { id: 's11', name: 'Kominfo', url: 'https://kominfo.go.id', type: 'official', trustScore: 97, publishedAt: '2026-04-13' },
      { id: 's12', name: 'Tempo.co', url: 'https://tempo.co', type: 'media', trustScore: 90, publishedAt: '2026-04-13' },
    ],
    verificationStatus: 'verified',
    originalityScore: 92,
    readabilityScore: 87,
    seoScore: 90,
    factualConsistencyScore: 89,
    duplicationRiskScore: 10,
    publishReadinessScore: 91,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: false,
    isFeatured: true,
    isTrending: false,
    sourceCount: 2,
    wordCount: 598,
    readingTime: 3,
    canonicalUrl: 'https://kabarkini.id/indonesia-masuk-10-besar-startup-ai-asia',
    publishedAt: '2026-04-13T10:30:00Z',
    createdAt: '2026-04-13T09:00:00Z',
    updatedAt: '2026-04-13T10:25:00Z',
    viewCount: 12100,
  },
  // ─── ARTIKEL 6 ──────────────────────────────────────────
  {
    id: 'art-006',
    title: 'Timnas Indonesia Lolos Kualifikasi Piala Dunia 2026, Sejarah Baru Sepak Bola Nasional',
    alternativeTitles: [
      'Garuda Merah Putih Tembus Piala Dunia 2026 untuk Pertama Kali dalam Sejarah',
      'Indonesia Resmi ke Piala Dunia 2026: Ini Perjalanan Panjang yang Membuahkan Hasil',
    ],
    slug: 'timnas-indonesia-lolos-kualifikasi-piala-dunia-2026',
    excerpt:
      'Timnas Indonesia resmi lolos ke putaran final Piala Dunia FIFA 2026 setelah mengalahkan Arab Saudi 2-1 dalam laga penentuan. Ini adalah pertama kali dalam sejarah Indonesia tampil di Piala Dunia.',
    metaTitle: 'Timnas Indonesia Lolos Piala Dunia 2026, Sejarah Pertama | KabarKini',
    metaDescription:
      'Indonesia lolos Piala Dunia 2026 pertama kali dalam sejarah! Kalahkan Arab Saudi 2-1. Baca cerita lengkap perjalanan bersejarah Garuda.',
    focusKeyword: 'Indonesia lolos Piala Dunia 2026',
    relatedKeywords: ['timnas Indonesia', 'kualifikasi Piala Dunia', 'Shin Tae-yong', 'sepak bola Indonesia'],
    category: CATEGORIES[5],
    tags: [],
    coverImageUrl: 'https://placehold.co/1200x630?text=Timnas+Indonesia+Piala+Dunia+2026+Pemain+Merayakan+Gol',
    coverImagePrompt: 'Pemain timnas Indonesia merayakan gol, jersey merah putih, stadion penuh penonton, konfeti',
    coverImageAlt: 'Para pemain Timnas Indonesia merayakan keberhasilan lolos ke Piala Dunia 2026',
    articleText: `Indonesia mencetak sejarah paling berkilau dalam dunia sepak bola nasional. Tim Garuda Merah Putih resmi lolos ke putaran final Piala Dunia FIFA 2026 setelah mengalahkan Arab Saudi dengan skor 2-1 dalam pertandingan penentuan di Stadion Utama Gelora Bung Karno, Jakarta.

Ini adalah pertama kali dalam sejarah 90 tahun lebih sepak bola Indonesia bersama FIFA bahwa Merah Putih akan tampil di panggung Piala Dunia. Jeritan kegembiraan jutaan pendukung pecah bersamaan saat wasit meniup peluit panjang.

Dua gol Indonesia dicetak oleh Marselino Ferdinan pada menit ke-23 lewat tendangan bebas yang melengkung, dan Ragnar Oratmangoen pada menit ke-71 lewat sundulan kepala yang presisi. Arab Saudi sempat memperkecil ketertinggalan melalui penalti pada menit ke-85.

Pelatih kepala Shin Tae-yong tak mampu menyembunyikan haru. "Ini adalah pencapaian luar biasa bagi sepak bola Indonesia. Saya bangga dengan para pemain yang berjuang tanpa kenal lelah," ujarnya dalam konferensi pers pasca pertandingan.

Presiden Prabowo Subianto menyampaikan selamat dan menyebut capaian ini sebagai hadiah terbesar rakyat Indonesia. Ia mengumumkan bahwa para pemain dan staf pelatih akan mendapat penghargaan khusus dari negara.`,
    articleHtml: `<p>Indonesia mencetak sejarah paling berkilau dalam dunia sepak bola nasional. Tim Garuda Merah Putih resmi lolos ke putaran final <strong>Piala Dunia FIFA 2026</strong> setelah mengalahkan Arab Saudi 2-1.</p>
<h2>Dua Gol Bersejarah</h2>
<p>Marselino Ferdinan (menit 23) dan Ragnar Oratmangoen (menit 71) menjadi nama yang akan dikenang selamanya dalam sejarah sepak bola Indonesia.</p>
<blockquote>"Ini adalah pencapaian luar biasa. Saya bangga dengan para pemain yang berjuang tanpa kenal lelah." — Shin Tae-yong</blockquote>`,
    bulletPoints: [
      'Indonesia lolos Piala Dunia 2026 — pertama dalam sejarah',
      'Kalahkan Arab Saudi 2-1 di SUGBK Jakarta',
      'Gol dari Marselino Ferdinan (23\') dan Ragnar Oratmangoen (71\')',
      'Pelatih Shin Tae-yong: "Pencapaian luar biasa bagi bangsa"',
      'Presiden umumkan penghargaan khusus untuk skuad Garuda',
    ],
    whyItMatters:
      'Lolosnya Indonesia ke Piala Dunia bukan hanya pencapaian olahraga, tetapi momen persatuan nasional yang langka. Ini membuktikan bahwa dengan kerja keras, sistem pembinaan yang tepat, dan konsistensi, Indonesia bisa bersaing di level tertinggi dunia.',
    nextToWatch:
      'Pengundian grup Piala Dunia 2026, persiapan skuad Garuda, penentuan venue pertandingan Indonesia, dan dampak terhadap perkembangan sepak bola usia muda Indonesia.',
    sources: [
      { id: 's13', name: 'PSSI', url: 'https://pssi.org', type: 'official', trustScore: 98, publishedAt: '2026-04-15' },
      { id: 's14', name: 'Antara', url: 'https://antaranews.com', type: 'media', trustScore: 95, publishedAt: '2026-04-15' },
      { id: 's15', name: 'MetroTVNews', url: 'https://metrotvnews.com', type: 'media', trustScore: 88, publishedAt: '2026-04-15' },
    ],
    verificationStatus: 'verified',
    originalityScore: 95,
    readabilityScore: 93,
    seoScore: 94,
    factualConsistencyScore: 98,
    duplicationRiskScore: 5,
    publishReadinessScore: 96,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    editorName: 'Redaktur Olahraga',
    isBreaking: true,
    isFeatured: true,
    isTrending: true,
    sourceCount: 3,
    wordCount: 712,
    readingTime: 4,
    canonicalUrl: 'https://kabarkini.id/timnas-indonesia-lolos-kualifikasi-piala-dunia-2026',
    publishedAt: '2026-04-15T22:10:00Z',
    createdAt: '2026-04-15T22:00:00Z',
    updatedAt: '2026-04-15T22:09:00Z',
    viewCount: 87600,
  },
  // ─── ARTIKEL 7 ──────────────────────────────────────────
  {
    id: 'art-007',
    title: 'Sidang Perdana Kasus Korupsi Dana CSR BI Segera Digelar, 3 Tersangka Siap Hadiri',
    alternativeTitles: [
      'KPK Bawa 3 Tersangka Korupsi Dana CSR Bank Indonesia ke Persidangan',
      'Kasus Suap Dana CSR BI Mulai Bergulir di Pengadilan Tipikor',
    ],
    slug: 'sidang-perdana-korupsi-dana-csr-bi',
    excerpt:
      'Pengadilan Tindak Pidana Korupsi (Tipikor) Jakarta akan menggelar sidang perdana kasus dugaan korupsi dan penyalahgunaan dana CSR Bank Indonesia senilai Rp 4,2 triliun. Tiga tersangka siap mengikuti sidang.',
    metaTitle: 'Sidang Perdana Korupsi Dana CSR BI Rp4,2 Triliun Segera Digelar | KabarKini',
    metaDescription:
      'Tiga tersangka kasus korupsi dana CSR Bank Indonesia senilai Rp4,2 triliun siap jalani sidang perdana di Pengadilan Tipikor Jakarta.',
    focusKeyword: 'korupsi dana CSR Bank Indonesia',
    relatedKeywords: ['KPK sidang', 'Tipikor Jakarta', 'korupsi BI', 'dana CSR'],
    category: CATEGORIES[1],
    tags: [TAGS[4], TAGS[5]],
    coverImageUrl: 'https://placehold.co/1200x630?text=Pengadilan+Tipikor+Jakarta+Sidang+Korupsi+Dana+CSR',
    coverImagePrompt: 'Gedung Pengadilan Tipikor Jakarta, suasana persidangan, logo KPK, ruang sidang formal',
    coverImageAlt: 'Gedung Pengadilan Tindak Pidana Korupsi Jakarta tempat sidang kasus CSR Bank Indonesia',
    articleText: `Pengadilan Tindak Pidana Korupsi (Tipikor) Jakarta akan menggelar sidang perdana kasus dugaan korupsi dan penyalahgunaan dana Corporate Social Responsibility (CSR) Bank Indonesia. Tiga terdakwa yang sebelumnya ditetapkan sebagai tersangka oleh Komisi Pemberantasan Korupsi (KPK) dijadwalkan hadir dalam sidang pembacaan dakwaan.

Jaksa penuntut umum KPK mendakwa para terdakwa dengan pasal 2 ayat (1) dan pasal 3 Undang-Undang Pemberantasan Tindak Pidana Korupsi juncto pasal 55 ayat (1) ke-1 KUHP. Dugaan kerugian negara dalam kasus ini mencapai Rp 4,2 triliun.

Kasus ini berawal dari temuan PPATK yang mencurigai adanya aliran dana CSR BI yang tidak sesuai peruntukannya. KPK kemudian melakukan penyelidikan mendalam sebelum menetapkan tersangka.

Kuasa hukum salah satu terdakwa menyatakan kliennya tidak bersalah dan siap membuktikan dakwaan tidak berdasar dalam proses persidangan. Sidang dijadwalkan terbuka untuk umum dan dapat disaksikan secara langsung.`,
    articleHtml: `<p>Pengadilan Tindak Pidana Korupsi (Tipikor) Jakarta akan menggelar sidang perdana kasus dugaan korupsi dana CSR Bank Indonesia. Tiga terdakwa dijadwalkan hadir dalam sidang pembacaan dakwaan.</p>
<p>Dugaan kerugian negara dalam kasus ini mencapai <strong>Rp 4,2 triliun</strong>.</p>`,
    bulletPoints: [
      'Sidang perdana korupsi dana CSR BI di Pengadilan Tipikor Jakarta',
      'Tiga terdakwa hadiri pembacaan dakwaan',
      'Dugaan kerugian negara Rp4,2 triliun',
      'Berawal dari temuan mencurigakan PPATK',
      'Sidang terbuka untuk umum',
    ],
    whyItMatters:
      'Kasus ini menyangkut kepercayaan publik terhadap lembaga keuangan negara. Proses persidangan yang transparan dan adil akan menjadi sinyal penting bagi komitmen Indonesia dalam memberantas korupsi di institusi strategis.',
    nextToWatch:
      'Isi dakwaan lengkap dari jaksa KPK, respons terdakwa dan tim kuasa hukum, jadwal sidang berikutnya, dan perkembangan proses pembuktian.',
    sources: [
      { id: 's16', name: 'KPK', url: 'https://kpk.go.id', type: 'official', trustScore: 99, publishedAt: '2026-04-14' },
      { id: 's17', name: 'Kompas.com', url: 'https://kompas.com', type: 'media', trustScore: 92, publishedAt: '2026-04-14' },
    ],
    verificationStatus: 'verified',
    originalityScore: 87,
    readabilityScore: 85,
    seoScore: 83,
    factualConsistencyScore: 93,
    duplicationRiskScore: 20,
    publishReadinessScore: 86,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    sourceCount: 2,
    wordCount: 480,
    readingTime: 3,
    canonicalUrl: 'https://kabarkini.id/sidang-perdana-korupsi-dana-csr-bi',
    publishedAt: '2026-04-14T11:00:00Z',
    createdAt: '2026-04-14T10:00:00Z',
    updatedAt: '2026-04-14T10:55:00Z',
    viewCount: 9800,
  },
  // ─── ARTIKEL 8 ──────────────────────────────────────────
  {
    id: 'art-008',
    title: 'Inflasi April 2026 Capai 3,8 Persen, BPS Sebut Harga Pangan Jadi Pemicu Utama',
    alternativeTitles: [
      'BPS: Inflasi Nasional April 2026 Tercatat 3,8 Persen, Pangan Dominan',
      'Tekanan Harga Pangan Dorong Inflasi April ke 3,8 Persen',
    ],
    slug: 'inflasi-april-2026-capai-38-persen-bps',
    excerpt:
      'Badan Pusat Statistik (BPS) mencatat inflasi nasional pada April 2026 mencapai 3,8 persen secara year-on-year. Kenaikan harga kelompok makanan, minuman, dan tembakau menjadi faktor dominan pendorong inflasi bulan ini.',
    metaTitle: 'Inflasi April 2026: 3,8 Persen, Harga Pangan Jadi Pendorong Utama | KabarKini',
    metaDescription:
      'BPS catat inflasi April 2026 sebesar 3,8% YoY. Harga pangan jadi pemicu utama. Baca analisis lengkap dan dampaknya bagi masyarakat.',
    focusKeyword: 'inflasi April 2026',
    relatedKeywords: ['inflasi Indonesia', 'BPS inflasi', 'harga pangan naik', 'daya beli masyarakat'],
    category: CATEGORIES[2],
    tags: [TAGS[6], TAGS[3]],
    coverImageUrl: 'https://placehold.co/1200x630?text=BPS+Inflasi+Nasional+April+2026+Harga+Pangan+Pasar',
    coverImagePrompt: 'Suasana pasar tradisional Indonesia, ibu rumah tangga berbelanja, harga kebutuhan pokok, logo BPS',
    coverImageAlt: 'Aktivitas jual beli di pasar tradisional Indonesia mencerminkan tekanan inflasi pada harga pangan',
    articleText: `Badan Pusat Statistik (BPS) merilis data inflasi nasional untuk bulan April 2026 sebesar 3,8 persen secara year-on-year (YoY). Angka ini naik dibandingkan bulan Maret yang tercatat 3,2 persen, dan sedikit melampaui ekspektasi pasar yang memperkirakan 3,5 persen.

Kepala BPS Amalia Adininggar Widyasanti menjelaskan bahwa kelompok makanan, minuman, dan tembakau memberikan andil terbesar dalam pembentukan inflasi bulan ini, yakni sebesar 1,78 poin. Kenaikan harga beras, cabai merah, bawang merah, dan daging ayam menjadi penyumbang utama.

Secara bulanan (month-to-month), inflasi tercatat sebesar 0,44 persen. Kota dengan inflasi tertinggi adalah Merauke (Papua) sebesar 2,1 persen, sementara deflasi terjadi di Timika dan beberapa kota lainnya di Papua.

BPS juga mencatat bahwa inflasi inti (core inflation) relatif terjaga di angka 2,1 persen, menunjukkan bahwa tekanan inflasi lebih bersifat sementara dan dipicu oleh faktor musiman serta gangguan sisi pasokan.

Bank Indonesia menyatakan inflasi masih berada dalam koridor target 1,5–3,5 persen untuk inflasi inti, meski tekanan jangka pendek dari pangan perlu diantisipasi melalui operasi pasar dan penguatan rantai pasok.`,
    articleHtml: `<p>Badan Pusat Statistik (BPS) merilis data inflasi nasional untuk bulan April 2026 sebesar <strong>3,8 persen YoY</strong>, naik dari 3,2 persen bulan sebelumnya.</p>
<h2>Penyumbang Utama Inflasi</h2>
<p>Kelompok makanan, minuman, dan tembakau memberikan andil 1,78 poin. Harga beras, cabai merah, bawang merah, dan daging ayam menjadi pemicu utama.</p>`,
    bulletPoints: [
      'Inflasi April 2026: 3,8% YoY (naik dari 3,2% Maret)',
      'Kelompok pangan beri andil 1,78 poin inflasi',
      'Pemicu: beras, cabai merah, bawang merah, daging ayam',
      'Inflasi inti terjaga 2,1% — sinyal positif stabilitas',
      'BI: masih dalam sasaran inflasi jangka panjang',
    ],
    whyItMatters:
      'Inflasi yang meningkat langsung mengurangi daya beli masyarakat, terutama kelompok berpenghasilan rendah yang mengalokasikan sebagian besar pengeluaran untuk makanan. Angka ini juga memengaruhi keputusan kebijakan moneter BI ke depan.',
    nextToWatch:
      'Data inflasi Mei 2026, respons kebijakan BI dan Kemendag dalam operasi pasar, serta perkembangan harga pangan di tingkat produsen.',
    sources: [
      { id: 's18', name: 'BPS', url: 'https://bps.go.id', type: 'official', trustScore: 100, publishedAt: '2026-04-15' },
      { id: 's19', name: 'Bank Indonesia', url: 'https://bi.go.id', type: 'official', trustScore: 100, publishedAt: '2026-04-15' },
    ],
    verificationStatus: 'verified',
    originalityScore: 90,
    readabilityScore: 88,
    seoScore: 87,
    factualConsistencyScore: 96,
    duplicationRiskScore: 14,
    publishReadinessScore: 89,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    sourceCount: 2,
    wordCount: 594,
    readingTime: 3,
    canonicalUrl: 'https://kabarkini.id/inflasi-april-2026-capai-38-persen-bps',
    publishedAt: '2026-04-15T10:00:00Z',
    createdAt: '2026-04-15T09:00:00Z',
    updatedAt: '2026-04-15T09:55:00Z',
    viewCount: 8200,
  },
  // ─── ARTIKEL 9 — DRAFT (untuk admin demo) ──────────────
  {
    id: 'art-009',
    title: 'RUU Perlindungan Data Pribadi Tahap Finalisasi, Publik Diminta Beri Masukan',
    alternativeTitles: [
      'Indonesia Hampir Punya UU Perlindungan Data Pribadi yang Komprehensif',
    ],
    slug: 'ruu-perlindungan-data-pribadi-finalisasi',
    excerpt:
      'Pemerintah dan DPR tengah menyelesaikan proses finalisasi RUU Perlindungan Data Pribadi yang diharapkan disahkan pada semester II 2026. Masyarakat dibuka kesempatan untuk memberikan masukan publik.',
    metaTitle: 'RUU Perlindungan Data Pribadi Tahap Finalisasi | KabarKini',
    metaDescription:
      'RUU Perlindungan Data Pribadi Indonesia masuki tahap finalisasi. Publik diminta beri masukan sebelum disahkan semester II 2026.',
    focusKeyword: 'RUU Perlindungan Data Pribadi',
    relatedKeywords: ['data pribadi Indonesia', 'privasi digital', 'regulasi data', 'GDPR Indonesia'],
    category: CATEGORIES[3],
    tags: [TAGS[0], TAGS[7]],
    coverImageUrl: 'https://placehold.co/1200x630?text=RUU+Perlindungan+Data+Pribadi+Privasi+Digital+Indonesia',
    coverImagePrompt: 'Konsep perlindungan data digital, ilustrasi kunci digital, bendera Indonesia, gedung DPR',
    coverImageAlt: 'Ilustrasi konsep perlindungan data pribadi dalam era digital Indonesia',
    articleText: `Pemerintah dan DPR RI tengah memasuki tahap akhir pembahasan Rancangan Undang-Undang Perlindungan Data Pribadi (RUU PDP). Setelah melalui proses panjang selama lebih dari empat tahun, regulasi ini diharapkan dapat disahkan pada semester II 2026, menjadikan Indonesia salah satu negara di Asia Tenggara dengan regulasi perlindungan data yang komprehensif.

Direktur Jenderal Aplikasi Informatika Kementerian Kominfo menyampaikan bahwa saat ini pemerintah membuka ruang konsultasi publik untuk mendapatkan masukan dari masyarakat, akademisi, pelaku industri, dan organisasi masyarakat sipil. "Kami ingin regulasi ini benar-benar mewakili kepentingan seluruh pemangku kepentingan, bukan hanya pemerintah atau industri," ujarnya.

Beberapa poin krusial yang masih dalam pembahasan antara lain definisi data sensitif, kewajiban notifikasi kebocoran data dalam 72 jam, besaran sanksi denda, dan pembentukan otoritas perlindungan data independen yang akan bertugas mengawasi implementasi undang-undang.

Para pakar privasi digital menyambut positif perkembangan ini. Mereka menilai Indonesia sudah terlambat dibandingkan Uni Eropa yang memiliki GDPR sejak 2018, namun lebih baik terlambat daripada tidak sama sekali.

Asosiasi Pengusaha Teknologi Informasi dan Komunikasi Nasional (APTIKNAS) menyatakan siap mendukung penerapan regulasi ini, dengan catatan masa transisi yang cukup bagi pelaku usaha untuk menyesuaikan sistem pengelolaan datanya.`,
    articleHtml: `<p>Pemerintah dan DPR RI tengah memasuki tahap akhir pembahasan <strong>RUU Perlindungan Data Pribadi (RUU PDP)</strong> yang diharapkan disahkan semester II 2026.</p>
<h2>Konsultasi Publik Dibuka</h2>
<p>Kementerian Kominfo membuka ruang konsultasi publik untuk mendapatkan masukan dari masyarakat, akademisi, pelaku industri, dan organisasi masyarakat sipil sebelum regulasi ini disahkan.</p>
<h2>Poin-Poin Krusial yang Masih Dibahas</h2>
<ul>
<li>Definisi data sensitif dan kategori perlindungannya</li>
<li>Kewajiban notifikasi kebocoran data dalam 72 jam</li>
<li>Besaran sanksi denda bagi pelanggar</li>
<li>Pembentukan otoritas perlindungan data independen</li>
</ul>
<p>Para pakar privasi digital menilai Indonesia sudah terlambat dibandingkan Uni Eropa yang memiliki GDPR sejak 2018, namun regulasi ini tetap merupakan langkah maju yang sangat penting bagi kedaulatan data nasional.</p>`,
    bulletPoints: [
      'RUU PDP masuki tahap finalisasi, target disahkan semester II 2026',
      'Kominfo buka konsultasi publik untuk semua pemangku kepentingan',
      '4 poin krusial masih dibahas: definisi data sensitif, notifikasi 72 jam, denda, dan otoritas independen',
      'Indonesia akan jadi salah satu negara ASEAN pertama dengan regulasi PDP komprehensif',
      'Pelaku industri minta masa transisi cukup untuk adaptasi sistem',
    ],
    whyItMatters: 'Di era di mana data adalah "minyak baru", Indonesia membutuhkan payung hukum yang kuat untuk melindungi warga dari penyalahgunaan data oleh perusahaan maupun aktor negara asing. RUU ini juga penting untuk mendorong kepercayaan dalam ekosistem ekonomi digital nasional.',
    nextToWatch: 'Jadwal sidang DPR untuk pembahasan final, mekanisme konsultasi publik, dan komposisi otoritas perlindungan data independen yang akan dibentuk.',
    sources: [
      { id: 's20', name: 'Kominfo', url: 'https://kominfo.go.id', type: 'official', trustScore: 97, publishedAt: '2026-04-12' },
    ],
    verificationStatus: 'partial',
    originalityScore: 76,
    readabilityScore: 70,
    seoScore: 72,
    factualConsistencyScore: 80,
    duplicationRiskScore: 25,
    publishReadinessScore: 74,
    status: 'review',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    sourceCount: 1,
    wordCount: 0,
    readingTime: 0,
    canonicalUrl: 'https://kabarkini.id/ruu-perlindungan-data-pribadi-finalisasi',
    createdAt: '2026-04-15T04:00:00Z',
    updatedAt: '2026-04-15T04:00:00Z',
    viewCount: 0,
  },
  // ─── ARTIKEL 10 — DRAFT ──────────────────────────────────
  {
    id: 'art-010',
    title: 'Kekeringan Ekstrem Melanda 12 Kabupaten di NTT, Ribuan Warga Krisis Air Bersih',
    alternativeTitles: [
      'Krisis Air Bersih di NTT Makin Parah, BNPB Kerahkan Bantuan Darurat',
    ],
    slug: 'kekeringan-ekstrem-12-kabupaten-ntt',
    excerpt:
      'Badan Penanggulangan Bencana Daerah (BPBD) NTT melaporkan kekeringan ekstrem melanda 12 kabupaten, menyebabkan ribuan warga kesulitan mendapatkan akses air bersih untuk kebutuhan sehari-hari.',
    metaTitle: 'Kekeringan Ekstrem di 12 Kabupaten NTT, Ribuan Warga Krisis Air | KabarKini',
    metaDescription:
      'Kekeringan parah terjang 12 kabupaten NTT. Ribuan warga krisis air bersih. BNPB siapkan bantuan darurat. Baca laporan terkini.',
    focusKeyword: 'kekeringan NTT',
    relatedKeywords: ['krisis air bersih', 'BPBD NTT', 'kekeringan Indonesia', 'bencana NTT'],
    category: CATEGORIES[4],
    tags: [],
    coverImageUrl: 'https://placehold.co/1200x630?text=Kekeringan+NTT+Krisis+Air+Bersih+Warga+Kekeringan',
    coverImagePrompt: 'Lahan kering tandus di Nusa Tenggara Timur, warga antri air, suasana terik matahari',
    coverImageAlt: 'Dampak kekeringan ekstrem di Nusa Tenggara Timur yang menyebabkan krisis air bersih bagi warga',
    articleText: `Badan Penanggulangan Bencana Daerah (BPBD) Provinsi Nusa Tenggara Timur (NTT) melaporkan bahwa kekeringan ekstrem kini melanda sedikitnya 12 kabupaten di wilayah tersebut. Lebih dari 87.000 jiwa dari 340 desa terdampak mengalami kesulitan mendapatkan akses air bersih untuk kebutuhan minum, memasak, dan sanitasi sehari-hari.

Kepala BPBD NTT menyebut kondisi ini sebagai yang terparah dalam lima tahun terakhir. Musim kemarau yang lebih panjang dari biasanya akibat fenomena El Nino menjadi faktor utama memperburuk situasi. Debit air di sejumlah sumber mata air tradisional turun drastis hingga 70 persen dari kondisi normal.

Badan Nasional Penanggulangan Bencana (BNPB) telah menetapkan status darurat kekeringan untuk tiga kabupaten dengan kondisi paling kritis: Kupang, Timor Tengah Selatan, dan Sumba Timur. Helikopter water bombing dan truk tangki air dikerahkan untuk distribusi darurat.

Pemerintah Pusat melalui Kementerian Sosial menyiapkan bantuan senilai Rp 45 miliar untuk penanganan krisis air, termasuk pengadaan tangki penampung, pompa air, dan perbaikan jaringan perpipaan yang rusak.

Para peneliti lingkungan mengingatkan bahwa krisis ini bukan sekadar bencana alam biasa, melainkan cerminan dari lemahnya infrastruktur air dan minimnya investasi dalam pengelolaan sumber daya air di NTT selama puluhan tahun.`,
    articleHtml: `<p>BPBD NTT melaporkan kekeringan ekstrem melanda <strong>12 kabupaten</strong>, berdampak pada lebih dari 87.000 jiwa di 340 desa yang kesulitan mendapatkan air bersih.</p>
<h2>Kondisi Terparah dalam Lima Tahun</h2>
<p>Kepala BPBD NTT menyebut kondisi ini sebagai yang terparah dalam lima tahun terakhir. Fenomena El Nino memperpanjang musim kemarau dan menurunkan debit sumber mata air hingga 70 persen.</p>
<h2>Respons Pemerintah</h2>
<p>BNPB menetapkan status darurat kekeringan untuk tiga kabupaten paling kritis. Helikopter dan truk tangki dikerahkan untuk distribusi air darurat, sementara Kemensos siapkan bantuan Rp 45 miliar.</p>
<blockquote>"Ini bukan sekadar bencana alam — ini mencerminkan lemahnya investasi infrastruktur air di NTT selama puluhan tahun." — Peneliti Lingkungan LIPI</blockquote>`,
    bulletPoints: [
      '87.000 jiwa di 340 desa terdampak kekeringan ekstrem di 12 kabupaten NTT',
      'Debit mata air turun 70% — kondisi terparah dalam 5 tahun terakhir',
      'El Nino perpanjang musim kemarau jadi faktor utama',
      'BNPB tetapkan status darurat untuk Kupang, TTS, dan Sumba Timur',
      'Kemensos siapkan Rp 45 miliar untuk penanganan krisis air',
    ],
    whyItMatters: 'Krisis air bersih di NTT adalah masalah kemanusiaan yang mendesak sekaligus cerminan ketimpangan pembangunan infrastruktur antara Indonesia bagian barat dan timur. Tanpa investasi jangka panjang pada infrastruktur air, krisis serupa akan terus berulang setiap musim kemarau.',
    nextToWatch: 'Progres distribusi bantuan air darurat oleh BNPB, rencana pembangunan infrastruktur air jangka panjang dari Kementerian PUPR, dan dampak kekeringan terhadap ketahanan pangan lokal NTT.',
    sources: [
      { id: 's21', name: 'BNPB', url: 'https://bnpb.go.id', type: 'official', trustScore: 98, publishedAt: '2026-04-13' },
    ],
    verificationStatus: 'partial',
    originalityScore: 68,
    readabilityScore: 65,
    seoScore: 70,
    factualConsistencyScore: 78,
    duplicationRiskScore: 30,
    publishReadinessScore: 68,
    status: 'draft',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: false,
    isFeatured: false,
    isTrending: false,
    sourceCount: 1,
    wordCount: 0,
    readingTime: 0,
    canonicalUrl: 'https://kabarkini.id/kekeringan-ekstrem-12-kabupaten-ntt',
    createdAt: '2026-04-15T03:00:00Z',
    updatedAt: '2026-04-15T03:00:00Z',
    viewCount: 0,
  },
]

  // ─── ARTIKEL 11 — INTERNASIONAL ────────────────────────────────
  {
    id: 'art-011',
    title: 'Perang Dagang AS-Tiongkok Babak Baru: Tarif 145% Bikin Rantai Pasok Global Goyang',
    alternativeTitles: [
      'AS Tetapkan Tarif 145% untuk Produk Tiongkok, Ekonomi Global Terancam',
      'Eskalasi Perang Dagang: Tarif AS-China Capai Level Tertinggi Sejak 1930-an',
    ],
    slug: 'perang-dagang-as-tiongkok-tarif-145-persen',
    excerpt:
      'Amerika Serikat secara resmi memberlakukan tarif impor sebesar 145 persen untuk hampir seluruh produk asal Tiongkok. Langkah ini memicu respons keras dari Beijing dan membuat pasar saham global bergejolak dalam dua hari perdagangan berturut-turut.',
    metaTitle: 'Perang Dagang AS-Tiongkok: Tarif 145%, Rantai Pasok Global Terganggu | KabarKini',
    metaDescription:
      'AS berlakukan tarif 145% untuk produk China. Beijing balas dengan tarif serupa. Pasar global bergejolak. Dampaknya bagi Indonesia?',
    focusKeyword: 'perang dagang AS Tiongkok tarif 145 persen',
    relatedKeywords: ['tarif impor AS China', 'perang dagang global', 'ekonomi global', 'dampak Indonesia'],
    category: CATEGORIES[6],
    tags: [],
    coverImageUrl: 'https://placehold.co/1200x630?text=Perang+Dagang+AS+Tiongkok+Tarif+Kontainer+Pelabuhan+Ekspor',
    coverImagePrompt: 'Pelabuhan kontainer internasional dengan bendera AS dan Tiongkok, grafis tarif perdagangan, pasar saham menurun',
    coverImageAlt: 'Ilustrasi perang dagang AS-Tiongkok dengan kontainer di pelabuhan dan grafis tarif meningkat',
    articleText: `Amerika Serikat secara resmi memberlakukan tarif impor sebesar 145 persen untuk hampir seluruh kategori produk asal Tiongkok, mulai dari elektronik, tekstil, baja, hingga produk pertanian. Kebijakan ini mulai berlaku efektif dan langsung memicu reaksi keras dari pemerintah Beijing yang mengumumkan balasan tarif setara untuk produk-produk AS.

Indeks saham utama di Wall Street merespons negatif dengan penurunan tajam pada hari pertama pengumuman. Dow Jones turun 2,8 persen, Nasdaq terkoreksi 3,4 persen, dan S&P 500 melemah 2,9 persen dalam satu sesi perdagangan. Bursa saham Asia, termasuk Nikkei dan Hang Seng, ikut terseret turun.

Presiden AS mempertahankan keputusannya dengan argumen bahwa Tiongkok selama ini melakukan praktik perdagangan tidak adil, subsidi masif terhadap industri domestik, dan pencurian kekayaan intelektual. "Sudah waktunya Amerika melindungi pekerja dan industri dalam negerinya," kata juru bicara Gedung Putih.

Pemerintah Tiongkok langsung merespons dengan memberlakukan tarif 125 persen untuk produk-produk AS, termasuk kedelai, daging sapi, pesawat terbang, dan semikonduktor. Beijing juga membatasi ekspor mineral tanah jarang yang sangat dibutuhkan industri teknologi AS.

Bagi Indonesia, eskalasi ini membawa peluang sekaligus tantangan. Di satu sisi, beberapa sektor manufaktur Indonesia berpotensi menerima pengalihan investasi dari perusahaan yang ingin keluar dari Tiongkok. Di sisi lain, gangguan pada rantai pasok global dapat mempermahal bahan baku impor yang dibutuhkan industri domestik.`,
    articleHtml: `<p>Amerika Serikat memberlakukan tarif impor <strong>145 persen</strong> untuk hampir seluruh produk Tiongkok, memicu balasan tarif serupa dari Beijing dan gejolak pasar global.</p>
<h2>Pasar Global Bergejolak</h2>
<p>Dow Jones turun 2,8%, Nasdaq terkoreksi 3,4%, dan S&P 500 melemah 2,9% dalam satu sesi. Bursa Asia termasuk Nikkei dan Hang Seng ikut terseret turun.</p>
<h2>Balasan Beijing</h2>
<p>Tiongkok langsung memberlakukan tarif 125% untuk produk AS termasuk kedelai, daging sapi, dan semikonduktor, serta membatasi ekspor mineral tanah jarang yang vital bagi industri teknologi AS.</p>
<h2>Dampak bagi Indonesia</h2>
<p>Indonesia berpotensi menerima pengalihan investasi dari perusahaan yang bergeser dari Tiongkok, namun juga menghadapi risiko kenaikan harga bahan baku impor akibat gangguan rantai pasok global.</p>`,
    bulletPoints: [
      'AS berlakukan tarif 145% untuk produk China — tertinggi sejak era 1930-an',
      'Beijing balas dengan tarif 125% untuk produk AS termasuk kedelai dan semikonduktor',
      'Bursa Wall Street jatuh: Dow -2,8%, Nasdaq -3,4%, S&P 500 -2,9%',
      'China batasi ekspor mineral tanah jarang — tekan industri teknologi AS',
      'Indonesia berpotensi dapat pengalihan investasi, tapi hadapi risiko kenaikan bahan baku',
    ],
    whyItMatters:
      'Perang dagang AS-Tiongkok adalah salah satu faktor risiko ekonomi global terbesar saat ini. Bagi Indonesia, posisi sebagai negara berkembang di antara dua kekuatan ekonomi terbesar dunia menciptakan risiko sekaligus peluang yang perlu dikelola dengan kebijakan perdagangan yang cermat.',
    nextToWatch:
      'Putaran negosiasi dagang berikutnya, dampak konkret terhadap ekspor Indonesia ke AS dan Tiongkok, serta posisi pemerintah Indonesia dalam menyikapi tekanan dari kedua pihak.',
    sources: [
      { id: 's22', name: 'Antara', url: 'https://antaranews.com', type: 'media', trustScore: 95, publishedAt: '2026-04-15' },
      { id: 's23', name: 'Tempo.co', url: 'https://tempo.co', type: 'media', trustScore: 90, publishedAt: '2026-04-15' },
      { id: 's24', name: 'Kementerian Perdagangan RI', url: 'https://kemendag.go.id', type: 'official', trustScore: 98, publishedAt: '2026-04-15' },
    ],
    verificationStatus: 'verified',
    originalityScore: 91,
    readabilityScore: 89,
    seoScore: 88,
    factualConsistencyScore: 94,
    duplicationRiskScore: 11,
    publishReadinessScore: 90,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    sourceCount: 3,
    wordCount: 621,
    readingTime: 4,
    canonicalUrl: 'https://kabarkini.id/perang-dagang-as-tiongkok-tarif-145-persen',
    publishedAt: '2026-04-15T08:00:00Z',
    createdAt: '2026-04-15T07:00:00Z',
    updatedAt: '2026-04-15T07:55:00Z',
    viewCount: 18400,
  },
  // ─── ARTIKEL 12 — VIRAL ──────────────────────────────────────────
  {
    id: 'art-012',
    title: 'Video Guru SD di Pelosok NTB Ajar Matematika Pakai Batu Kerikil Viral, Dapat Donasi Rp900 Juta',
    alternativeTitles: [
      'Viral: Guru Terpencil NTB Kreatif Ajar Matematika Tanpa Buku, Dapat Donasi Miliaran',
      'Kisah Pak Guru di NTB Viral: Modal Kerikil, Murid Faham Matematika',
    ],
    slug: 'guru-sd-ntb-ajar-matematika-batu-kerikil-viral-donasi',
    excerpt:
      'Video seorang guru SD di desa terpencil Kabupaten Sumbawa Barat, NTB yang mengajar matematika menggunakan batu kerikil dan ranting kayu karena keterbatasan fasilitas mendadak viral di media sosial. Dalam 48 jam, donasi yang terkumpul melampaui Rp 900 juta.',
    metaTitle: 'Guru SD NTB Ajar Matematika Pakai Kerikil Viral, Donasi Tembus Rp900 Juta | KabarKini',
    metaDescription:
      'Video guru SD di pelosok NTB viral setelah ajar matematika pakai batu kerikil. Donasi 48 jam tembus Rp900 juta. Kisah mengharukan dari pelosok negeri.',
    focusKeyword: 'guru SD NTB viral donasi',
    relatedKeywords: ['guru viral', 'pendidikan pelosok', 'donasi viral', 'pendidikan Indonesia'],
    category: CATEGORIES[7],
    tags: [],
    coverImageUrl: 'https://placehold.co/1200x630?text=Guru+SD+NTB+Mengajar+Matematika+Kerikil+Kelas+Darurat+Viral',
    coverImagePrompt: 'Seorang guru mengajar di kelas sederhana dengan murid-murid di pedesaan NTB, suasana hangat dan bersemangat',
    coverImageAlt: 'Pak Guru mengajar matematika menggunakan batu kerikil di sekolah dasar terpencil NTB yang viral',
    articleText: `Sebuah video pendek yang diunggah oleh warga setempat mendadak menjadi perbincangan hangat di seluruh Indonesia. Video itu menampilkan seorang guru SD bernama Pak Mahmud (47 tahun) di Desa Labuan Jambu, Kecamatan Taliwang, Kabupaten Sumbawa Barat, NTB yang mengajar matematika kepada murid-muridnya menggunakan batu kerikil, ranting kayu, dan gambar di tanah karena sekolahnya tidak memiliki buku pelajaran maupun alat peraga.

Dalam video berdurasi 3 menit itu, terlihat Pak Mahmud dengan penuh semangat mengajarkan konsep penjumlahan dan pengurangan kepada siswa kelas 3 SD menggunakan cara yang kreatif dan membuat murid-muridnya terlibat aktif. Murid-muridnya tertawa dan menjawab pertanyaan dengan antusias meski belajar di ruang kelas dengan dinding bambu dan atap seng yang bocor.

Video itu ditonton lebih dari 12 juta kali dalam 48 jam pertama, dibagikan ulang oleh ratusan akun media sosial termasuk sejumlah figur publik dan artis nasional. Tagar #PakMahmudPahlawan dan #SekolahPelosok langsung masuk ke trending nasional Twitter/X dan TikTok.

Respons donasi dari masyarakat tidak kalah luar biasa. Sebuah platform penggalangan dana melaporkan bahwa dalam 48 jam, total donasi yang masuk untuk membantu sekolah Pak Mahmud telah melampaui Rp 900 juta. Dana tersebut rencananya akan digunakan untuk membangun ruang kelas baru, membeli buku dan peralatan, serta meningkatkan fasilitas sanitasi.

Kementerian Pendidikan menyatakan akan meninjau langsung kondisi sekolah tersebut. Menteri Pendidikan menyebut kisah Pak Mahmud sebagai "cermin nyata dari dedikasi guru-guru di garis terdepan yang selama ini kurang mendapat perhatian."`,
    articleHtml: `<p>Video Pak Mahmud (47 tahun), guru SD di Desa Labuan Jambu, Sumbawa Barat NTB yang mengajar matematika menggunakan batu kerikil dan ranting kayu viral ditonton <strong>12 juta kali</strong> dalam 48 jam.</p>
<h2>Keterbatasan yang Jadi Inspirasi</h2>
<p>Sekolah Pak Mahmud tidak memiliki buku pelajaran maupun alat peraga. Dengan kreativitasnya, ia menggunakan benda-benda alam di sekitar untuk membuat muridnya memahami konsep matematika secara konkret dan menyenangkan.</p>
<h2>Donasi Meledak</h2>
<p>Dalam 48 jam, donasi masyarakat melampaui <strong>Rp 900 juta</strong>. Dana akan digunakan untuk ruang kelas baru, buku, peralatan, dan fasilitas sanitasi.</p>
<blockquote>"Kisah Pak Mahmud adalah cermin nyata dedikasi guru-guru di garis terdepan yang selama ini kurang mendapat perhatian." — Menteri Pendidikan</blockquote>`,
    bulletPoints: [
      'Video Pak Mahmud mengajar matematika pakai kerikil viral 12 juta tayangan dalam 48 jam',
      'Sekolah SDN Labuan Jambu, Sumbawa Barat NTB tanpa buku pelajaran dan alat peraga',
      'Donasi publik tembus Rp900 juta dalam 48 jam via platform penggalangan dana',
      'Tagar #PakMahmudPahlawan masuk trending nasional di Twitter/X dan TikTok',
      'Kemendikbud akan tinjau langsung dan tangani kondisi sekolah',
    ],
    whyItMatters:
      'Di balik viralitas yang mengharukan ini tersimpan persoalan serius: masih banyak sekolah di Indonesia timur yang kekurangan fasilitas dasar. Fenomena ini seharusnya mendorong evaluasi serius kebijakan distribusi anggaran pendidikan dan rekrutmen guru ke daerah terpencil.',
    nextToWatch:
      'Tindak lanjut Kemendikbud di lapangan, penggunaan dana donasi secara transparan, dan apakah kasus ini akan memicu kebijakan percepatan pemerataan fasilitas sekolah di daerah 3T (terdepan, terluar, tertinggal).',
    sources: [
      { id: 's25', name: 'Antara', url: 'https://antaranews.com', type: 'media', trustScore: 95, publishedAt: '2026-04-15' },
      { id: 's26', name: 'Kompas.com', url: 'https://kompas.com', type: 'media', trustScore: 92, publishedAt: '2026-04-15' },
      { id: 's27', name: 'Kemendikbud', url: 'https://kemdikbud.go.id', type: 'official', trustScore: 98, publishedAt: '2026-04-15' },
    ],
    verificationStatus: 'partial',
    originalityScore: 93,
    readabilityScore: 95,
    seoScore: 90,
    factualConsistencyScore: 90,
    duplicationRiskScore: 7,
    publishReadinessScore: 92,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: false,
    isFeatured: true,
    isTrending: true,
    sourceCount: 3,
    wordCount: 658,
    readingTime: 4,
    canonicalUrl: 'https://kabarkini.id/guru-sd-ntb-ajar-matematika-batu-kerikil-viral-donasi',
    publishedAt: '2026-04-15T16:00:00Z',
    createdAt: '2026-04-15T15:00:00Z',
    updatedAt: '2026-04-15T15:55:00Z',
    viewCount: 52300,
  },
  // ─── ARTIKEL 13 — SOSIAL / OLAHRAGA ───────────────────────────────
  {
    id: 'art-013',
    title: 'Mahasiswa Indonesia Raih Medali Emas Olimpiade Fisika Internasional, Kalahkan 90 Negara',
    alternativeTitles: [
      'Indonesia Juara IPhO 2026: Pelajar SMA Ini Kalahkan Wakil 90 Negara',
      'Emas di Olimpiade Fisika Dunia: Bukti Indonesia Punya Generasi Emas Sains',
    ],
    slug: 'mahasiswa-indonesia-emas-olimpiade-fisika-internasional-2026',
    excerpt:
      'Tiga pelajar Indonesia berhasil meraih medali emas dalam International Physics Olympiad (IPhO) 2026 yang diselenggarakan di Zurich, Swiss. Indonesia menempati peringkat ke-4 dari 91 negara peserta, pencapaian terbaik sepanjang sejarah keikutsertaan Indonesia.',
    metaTitle: 'Indonesia Raih 3 Emas di Olimpiade Fisika Internasional IPhO 2026 | KabarKini',
    metaDescription:
      'Tiga pelajar Indonesia raih medali emas IPhO 2026 di Swiss. Indonesia ranking ke-4 dari 91 negara — terbaik sepanjang sejarah. Kisah lengkap.',
    focusKeyword: 'Indonesia emas olimpiade fisika internasional 2026',
    relatedKeywords: ['IPhO 2026', 'olimpiade sains Indonesia', 'pelajar berprestasi', 'pendidikan Indonesia'],
    category: CATEGORIES[4],
    tags: [],
    coverImageUrl: 'https://placehold.co/1200x630?text=Pelajar+Indonesia+Medali+Emas+Olimpiade+Fisika+Internasional+Swiss',
    coverImagePrompt: 'Pelajar Indonesia tersenyum bangga memakai medali emas di podium kompetisi internasional, latar belakang bendera merah putih',
    coverImageAlt: 'Tiga pelajar Indonesia meraih medali emas di International Physics Olympiad 2026 di Zurich Swiss',
    articleText: `Indonesia mencatat prestasi gemilang di panggung sains internasional. Tiga pelajar yang mewakili Merah Putih berhasil menyabet medali emas dalam International Physics Olympiad (IPhO) 2026 yang berlangsung di Zurich, Swiss, mengalahkan peserta dari 90 negara lainnya.

Ketiga pelajar peraih emas tersebut adalah Rafi Ardian Kusuma dari SMAN 8 Bandung, Calista Noviandri dari SMA Taruna Nusantara Magelang, dan Evan Santoso dari SMAN 78 Jakarta. Selain tiga medali emas, tim Indonesia juga membawa pulang dua medali perak dan satu perunggu, menjadikan total perolehan enam medali dalam satu ajang.

Pencapaian ini menempatkan Indonesia di peringkat ke-4 dari 91 negara peserta, melampaui posisi tradisional kekuatan sains dunia seperti Rusia, Jepang, dan Prancis. Ini adalah pencapaian terbaik Indonesia sejak pertama kali mengikuti IPhO pada 1993.

Kepala Balai Pengembangan Talenta Indonesia (BPTI) Kementerian Pendidikan menyebut hasil ini sebagai buah dari program intensif pembinaan olimpiade yang dijalankan secara konsisten dalam tiga tahun terakhir. "Kami memang berinvestasi serius pada program pembinaan sains kompetitif, dan hasilnya mulai terlihat," ujarnya.

Presiden Prabowo menyampaikan selamat langsung melalui unggahan di media sosialnya dan menjanjikan beasiswa penuh kepada seluruh anggota tim untuk melanjutkan pendidikan di universitas pilihan mereka, baik di dalam maupun luar negeri.`,
    articleHtml: `<p>Tiga pelajar Indonesia meraih <strong>medali emas</strong> di International Physics Olympiad (IPhO) 2026 di Zurich, Swiss, menempatkan Indonesia di <strong>peringkat ke-4 dari 91 negara</strong> — terbaik sepanjang sejarah.</p>
<h2>Para Pejuang Merah Putih</h2>
<ul>
<li><strong>Rafi Ardian Kusuma</strong> — SMAN 8 Bandung</li>
<li><strong>Calista Noviandri</strong> — SMA Taruna Nusantara Magelang</li>
<li><strong>Evan Santoso</strong> — SMAN 78 Jakarta</li>
</ul>
<p>Tim juga membawa pulang 2 perak dan 1 perunggu — total 6 medali dalam satu ajang.</p>
<h2>Sistem Pembinaan yang Berbuah Hasil</h2>
<p>BPTI Kemendikbud menyebut ini adalah hasil tiga tahun investasi serius pada program pembinaan olimpiade sains kompetitif nasional.</p>
<blockquote>"Kami berinvestasi serius pada program sains kompetitif, dan hasilnya mulai terlihat." — Kepala BPTI Kemendikbud</blockquote>`,
    bulletPoints: [
      '3 medali emas IPhO 2026 untuk Indonesia — dari SMAN 8 Bandung, SMA Taruna Nusantara, dan SMAN 78 Jakarta',
      'Indonesia ranking 4 dari 91 negara — pencapaian terbaik sepanjang sejarah sejak 1993',
      'Total 6 medali: 3 emas, 2 perak, 1 perunggu',
      'Lampaui Rusia, Jepang, dan Prancis dalam perolehan medali',
      'Presiden janjikan beasiswa penuh untuk seluruh anggota tim',
    ],
    whyItMatters:
      'Prestasi di olimpiade sains internasional membuktikan bahwa Indonesia memiliki generasi muda berbakat yang mampu bersaing di level dunia. Ini juga menjadi argumen kuat untuk terus meningkatkan investasi pada pendidikan STEM dan program pembinaan talenta sains nasional.',
    nextToWatch:
      'Kebijakan lanjutan pemerintah untuk pembinaan talenta sains, implementasi beasiswa yang dijanjikan, dan persiapan tim Indonesia untuk olimpiade sains internasional berikutnya.',
    sources: [
      { id: 's28', name: 'Kemendikbud', url: 'https://kemdikbud.go.id', type: 'official', trustScore: 98, publishedAt: '2026-04-15' },
      { id: 's29', name: 'Antara', url: 'https://antaranews.com', type: 'media', trustScore: 95, publishedAt: '2026-04-15' },
    ],
    verificationStatus: 'verified',
    originalityScore: 92,
    readabilityScore: 91,
    seoScore: 89,
    factualConsistencyScore: 95,
    duplicationRiskScore: 8,
    publishReadinessScore: 91,
    status: 'published',
    authorType: 'ai',
    authorLabel: 'AI News Desk',
    isBreaking: false,
    isFeatured: false,
    isTrending: true,
    sourceCount: 2,
    wordCount: 597,
    readingTime: 3,
    canonicalUrl: 'https://kabarkini.id/mahasiswa-indonesia-emas-olimpiade-fisika-internasional-2026',
    publishedAt: '2026-04-15T18:00:00Z',
    createdAt: '2026-04-15T17:00:00Z',
    updatedAt: '2026-04-15T17:55:00Z',
    viewCount: 22700,
  },
]

// ─── TRENDING TOPICS ───────────────────────────────────────────
export const TRENDING_TOPICS: TrendingTopic[] = [
  {
    id: 'tt-1',
    title: 'UU Perampasan Aset',
    slug: 'uu-perampasan-aset',
    hotness: 98,
    articleCount: 12,
    category: 'Hukum',
    keywords: ['perampasan aset', 'DPR', 'korupsi', 'KPK'],
    lastUpdated: '2026-04-15T07:00:00Z',
  },
  {
    id: 'tt-2',
    title: 'Piala Dunia 2026 Indonesia',
    slug: 'piala-dunia-2026-indonesia',
    hotness: 97,
    articleCount: 8,
    category: 'Olahraga',
    keywords: ['timnas', 'Piala Dunia', 'Shin Tae-yong', 'Garuda'],
    lastUpdated: '2026-04-15T22:15:00Z',
  },
  {
    id: 'tt-3',
    title: 'Gempa Sulawesi Tengah',
    slug: 'gempa-sulawesi-tengah',
    hotness: 90,
    articleCount: 6,
    category: 'Sosial',
    keywords: ['gempa', 'BMKG', 'tsunami', 'Palu'],
    lastUpdated: '2026-04-15T15:00:00Z',
  },
  {
    id: 'tt-4',
    title: 'BI Rate Naik',
    slug: 'bi-rate-naik',
    hotness: 82,
    articleCount: 5,
    category: 'Ekonomi',
    keywords: ['BI Rate', 'suku bunga', 'rupiah', 'inflasi'],
    lastUpdated: '2026-04-15T09:00:00Z',
  },
  {
    id: 'tt-5',
    title: 'Program 3 Juta Rumah',
    slug: 'program-3-juta-rumah',
    hotness: 75,
    articleCount: 4,
    category: 'Politik',
    keywords: ['perumahan', 'Prabowo', 'FLPP', 'MBR'],
    lastUpdated: '2026-04-14T10:00:00Z',
  },
  {
    id: 'tt-6',
    title: 'Startup AI Indonesia',
    slug: 'startup-ai-indonesia',
    hotness: 70,
    articleCount: 7,
    category: 'Teknologi',
    keywords: ['AI', 'startup', 'investasi', 'unicorn'],
    lastUpdated: '2026-04-13T11:00:00Z',
  },
  {
    id: 'tt-7',
    title: 'Perang Dagang AS-China',
    slug: 'perang-dagang-as-china',
    hotness: 88,
    articleCount: 9,
    category: 'Internasional',
    keywords: ['tarif AS China', 'perang dagang', 'ekonomi global', 'dampak Indonesia'],
    lastUpdated: '2026-04-15T08:30:00Z',
  },
  {
    id: 'tt-8',
    title: 'Guru Viral Pak Mahmud',
    slug: 'guru-viral-pak-mahmud',
    hotness: 94,
    articleCount: 4,
    category: 'Viral',
    keywords: ['guru viral', 'pendidikan pelosok', 'donasi', 'NTB'],
    lastUpdated: '2026-04-15T16:30:00Z',
  },
  {
    id: 'tt-9',
    title: 'Olimpiade Fisika IPhO 2026',
    slug: 'olimpiade-fisika-ipho-2026',
    hotness: 79,
    articleCount: 3,
    category: 'Sosial',
    keywords: ['IPhO 2026', 'pelajar Indonesia', 'medali emas', 'sains'],
    lastUpdated: '2026-04-15T18:30:00Z',
  },
]

// ─── WORKFLOW RUNS (untuk admin demo) ──────────────────────────
export const WORKFLOW_RUNS: WorkflowRun[] = [
  {
    id: 'wf-001',
    runType: 'daily_main',
    status: 'completed',
    startedAt: '2026-04-15T06:30:00Z',
    completedAt: '2026-04-15T06:47:00Z',
    sourcesIngested: 38,
    topicsClustered: 14,
    articlesGenerated: 10,
    articlesPublished: 7,
    articlesReviewed: 2,
    articlesRejected: 1,
    errors: [],
    logs: [
      { timestamp: '2026-04-15T06:30:00Z', step: 'source_discovery', message: '38 artikel berhasil diambil dari 5 sumber', level: 'success' },
      { timestamp: '2026-04-15T06:32:00Z', step: 'pre_filter', message: '6 artikel dibuang (terlalu lama / tidak relevan)', level: 'info' },
      { timestamp: '2026-04-15T06:34:00Z', step: 'topic_clustering', message: '14 kluster topik teridentifikasi', level: 'success' },
      { timestamp: '2026-04-15T06:35:00Z', step: 'hotness_scoring', message: 'Top 10 topik dipilih untuk penulisan', level: 'info' },
      { timestamp: '2026-04-15T06:36:00Z', step: 'article_generation', message: '10 artikel berhasil ditulis AI', level: 'success' },
      { timestamp: '2026-04-15T06:44:00Z', step: 'quality_gate', message: '7 lulus auto-publish, 2 ke review, 1 ditolak', level: 'success' },
      { timestamp: '2026-04-15T06:46:00Z', step: 'publish', message: '7 artikel berhasil dipublikasikan', level: 'success' },
      { timestamp: '2026-04-15T06:47:00Z', step: 'seo_packaging', message: 'Sitemap dan RSS feed diperbarui', level: 'success' },
    ],
  },
  {
    id: 'wf-002',
    runType: 'daily_noon',
    status: 'completed',
    startedAt: '2026-04-15T12:00:00Z',
    completedAt: '2026-04-15T12:14:00Z',
    sourcesIngested: 22,
    topicsClustered: 8,
    articlesGenerated: 5,
    articlesPublished: 4,
    articlesReviewed: 1,
    articlesRejected: 0,
    errors: [],
    logs: [
      { timestamp: '2026-04-15T12:00:00Z', step: 'source_discovery', message: '22 artikel baru diambil dari sumber prioritas', level: 'success' },
      { timestamp: '2026-04-15T12:03:00Z', step: 'topic_clustering', message: '8 kluster topik baru teridentifikasi', level: 'success' },
      { timestamp: '2026-04-15T12:05:00Z', step: 'article_generation', message: '5 artikel berhasil ditulis', level: 'success' },
      { timestamp: '2026-04-15T12:13:00Z', step: 'publish', message: '4 artikel dipublikasikan, 1 ke review queue', level: 'success' },
    ],
  },
  {
    id: 'wf-003',
    runType: 'breaking',
    status: 'completed',
    startedAt: '2026-04-15T22:00:00Z',
    completedAt: '2026-04-15T22:08:00Z',
    sourcesIngested: 15,
    topicsClustered: 3,
    articlesGenerated: 1,
    articlesPublished: 1,
    articlesReviewed: 0,
    articlesRejected: 0,
    errors: [],
    logs: [
      { timestamp: '2026-04-15T22:00:00Z', step: 'breaking_trigger', message: 'Signal breaking news terdeteksi: Timnas Indonesia lolos Piala Dunia', level: 'info' },
      { timestamp: '2026-04-15T22:02:00Z', step: 'fact_extraction', message: 'Fakta utama berhasil diekstrak dari 3 sumber', level: 'success' },
      { timestamp: '2026-04-15T22:04:00Z', step: 'article_generation', message: '1 artikel breaking berhasil ditulis (526 kata)', level: 'success' },
      { timestamp: '2026-04-15T22:07:00Z', step: 'publish', message: 'Breaking news dipublikasikan & breaking ticker diaktifkan', level: 'success' },
    ],
  },
]

// ─── ADMIN STATS ────────────────────────────────────────────────
export const ADMIN_STATS: AdminStats = {
  todayPublished: 12,
  pendingReview: 3,
  processing: 0,
  scheduled: 5,
  totalArticles: 247,
  avgQualityScore: 89,
  topCategories: [
    { name: 'Politik', count: 47 },
    { name: 'Ekonomi', count: 38 },
    { name: 'Hukum', count: 31 },
    { name: 'Teknologi', count: 29 },
    { name: 'Internasional', count: 25 },
  ],
  recentWorkflow: WORKFLOW_RUNS[0],
}

// ─── SOURCES (untuk admin demo) ─────────────────────────────────
export const SOURCES: Source[] = [
  {
    id: 'src-1',
    sourceName: 'Antara News',
    sourceType: 'media',
    homeUrl: 'https://antaranews.com',
    articleUrl: 'https://antaranews.com/berita/abc123',
    articleTitle: 'DPR Sahkan UU Perampasan Aset dalam Sidang Paripurna',
    fetchedSummary: 'DPR RI mengesahkan RUU Perampasan Aset dalam sidang paripurna hari ini...',
    publishedAtSource: '2026-04-15T06:00:00Z',
    fetchedAt: '2026-04-15T06:15:00Z',
    trustScore: 95,
    verificationLevel: 'high',
    status: 'processed',
  },
  {
    id: 'src-2',
    sourceName: 'Kompas.com',
    sourceType: 'media',
    homeUrl: 'https://kompas.com',
    articleUrl: 'https://kompas.com/berita/def456',
    articleTitle: 'Bank Indonesia Naikkan BI Rate 25 Basis Poin',
    fetchedSummary: 'Bank Indonesia memutuskan menaikkan suku bunga acuan dalam RDG bulan ini...',
    publishedAtSource: '2026-04-15T07:30:00Z',
    fetchedAt: '2026-04-15T07:45:00Z',
    trustScore: 92,
    verificationLevel: 'high',
    status: 'processed',
  },
  {
    id: 'src-3',
    sourceName: 'BMKG',
    sourceType: 'official',
    homeUrl: 'https://bmkg.go.id',
    articleUrl: 'https://bmkg.go.id/berita/ghi789',
    articleTitle: 'Informasi Gempa Bumi M6.4 Sulawesi Tengah',
    fetchedSummary: 'BMKG melaporkan gempa berkekuatan M6.4 mengguncang wilayah Sulawesi Tengah...',
    publishedAtSource: '2026-04-15T14:25:00Z',
    fetchedAt: '2026-04-15T14:26:00Z',
    trustScore: 100,
    verificationLevel: 'verified_official',
    status: 'processed',
  },
  {
    id: 'src-4',
    sourceName: 'Tempo.co',
    sourceType: 'media',
    homeUrl: 'https://tempo.co',
    articleUrl: 'https://tempo.co/read/jkl012',
    articleTitle: 'Ekosistem AI Indonesia Tumbuh Pesat, Investasi Capai Miliaran Dolar',
    fetchedSummary: 'Laporan terbaru menempatkan Indonesia di 10 besar negara AI Asia...',
    publishedAtSource: '2026-04-13T09:00:00Z',
    fetchedAt: '2026-04-13T09:30:00Z',
    trustScore: 90,
    verificationLevel: 'high',
    status: 'processed',
  },
  {
    id: 'src-5',
    sourceName: 'Liputan6',
    sourceType: 'media',
    homeUrl: 'https://liputan6.com',
    articleUrl: 'https://liputan6.com/news/read/mno345',
    articleTitle: 'Pemerintah Siapkan Skema Pembiayaan Program Rumah Rakyat',
    fetchedSummary: 'Kementerian Perumahan Rakyat menyiapkan skema pembiayaan untuk program 3 juta rumah...',
    publishedAtSource: '2026-04-14T08:00:00Z',
    fetchedAt: '2026-04-14T08:20:00Z',
    trustScore: 85,
    verificationLevel: 'medium',
    status: 'processed',
  },
]

// Alias for admin page compatibility
export const SAMPLE_SOURCES = SOURCES

// ─── HELPER FUNCTIONS ────────────────────────────────────────────
export const getFeaturedArticles = () =>
  ARTICLES.filter((a) => a.isFeatured && a.status === 'published')

export const getTrendingArticles = () =>
  ARTICLES.filter((a) => a.isTrending && a.status === 'published')

export const getBreakingArticles = () =>
  ARTICLES.filter((a) => a.isBreaking && a.status === 'published')

export const getArticlesByCategory = (slug: string) =>
  ARTICLES.filter((a) => a.category.slug === slug && a.status === 'published')

export const getArticlesByTag = (slug: string) =>
  ARTICLES.filter(
    (a) => a.status === 'published' && a.tags.some((t) => t.slug === slug)
  )

export const getTagBySlug = (slug: string) =>
  TAGS.find((t) => t.slug === slug)

export const getArticleBySlug = (slug: string) =>
  ARTICLES.find((a) => a.slug === slug)

export const getRelatedArticles = (article: Article, limit = 4) =>
  ARTICLES.filter(
    (a) =>
      a.id !== article.id &&
      a.status === 'published' &&
      (a.category.id === article.category.id ||
        a.tags.some((t) => article.tags.some((at) => at.id === t.id)))
  ).slice(0, limit)

export const getPublishedArticles = (limit?: number) => {
  const published = ARTICLES.filter((a) => a.status === 'published').sort(
    (a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
  )
  return limit ? published.slice(0, limit) : published
}

export const searchArticles = (query: string) => {
  const q = query.toLowerCase()
  return ARTICLES.filter(
    (a) =>
      a.status === 'published' &&
      (a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.focusKeyword.toLowerCase().includes(q) ||
        a.category.name.toLowerCase().includes(q) ||
        a.tags.some((t) => t.name.toLowerCase().includes(q)))
  )
}
