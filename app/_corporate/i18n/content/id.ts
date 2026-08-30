import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — INDONESIAN. Translated from the Japanese canonical source (ja.ts).
 *
 * This is an adapted sibling, not a literal rendering: it is written to read as natural corporate
 * Indonesian. It may never be stronger than the Japanese. No customer, partner, metric, revenue,
 * funding, market-position, team-size or capability claim appears here that the Japanese does not
 * already make.
 *
 * On the company form: Yorisou is a Japanese LLC (godo kaisha). It is never described with a
 * joint-stock-company term, and the representative is never titled as the CEO of a corporation:
 * "Perwakilan Perusahaan" is the Indonesian rendering of the LLC representative title.
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 */
export const id: SiteCopy = {
  chrome: {
    skip: "Lompat ke konten",
    menu: "Menu",
    menuToggle: "Buka dan tutup menu",
    close: "Tutup",
    navLabel: "Navigasi situs",
    navLabelMobile: "Navigasi situs (seluler)",
    langLabel: "Bahasa tampilan",
    langHeading: "Pilih bahasa",
    langSearch: "Cari bahasa",
    langCurrent: "Bahasa saat ini",
    previewBadge: "Pratinjau — belum dipublikasikan",
    nav: { home: "Beranda", miraiMove: "Mirai Move", kakari: "Kakari", about: "Tentang Kami", company: "Perusahaan", contact: "Kontak" },
    footerTagline: "Di antara manusia dan masyarakat, kami menciptakan pendampingan berikutnya.",
    footerProjects: "Proyek",
    footerCompany: "Perusahaan",
    footerLegalNote: "Semua yang kami cantumkan berpijak pada catatan yang dapat kami pastikan.",
    backToTop: "Kembali ke atas",
  },

  meta: {
    home: { title: "Yorisou LLC — Di antara manusia dan masyarakat, kami menciptakan pendampingan berikutnya.", description: "Yorisou LLC menatap kompleksitas dalam kehidupan sehari-hari, pekerjaan, dan komunitas, lalu membangun produk yang membantu orang memahaminya, memilih, dan melangkah maju. Kami sedang mengembangkan Mirai Move dan Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Platform untuk informasi, pencocokan, dan pengembangan bisnis di sektor mobilitas Jepang. Situs publiknya sudah aktif; fitur platformnya masih dalam tahap pengembangan." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Dukungan multibahasa untuk prosedur administrasi dan dokumen, bagi orang yang tinggal di Jepang dan yang memulai usaha di sini. Masih dalam pengembangan dan belum dibuka untuk umum." },
    about: { title: "Tentang Kami — Yorisou LLC", description: "Alasan Yorisou ada, cara kami berpikir, dan cara kami membangun. Kami tidak menuliskan apa yang tidak dapat kami pastikan." },
    company: { title: "Perusahaan — Yorisou LLC", description: "Profil perusahaan, profil perwakilan perusahaan, pesan perwakilan perusahaan, dan bidang usaha Yorisou LLC." },
    contact: { title: "Kontak — Yorisou LLC", description: "Kanal pertanyaan mengenai kegiatan usaha, kemitraan, dan liputan media." },
  },

  common: {
    readMore: (name) => `Selengkapnya tentang ${name}`,
    backHome: "Kembali ke halaman perusahaan",
    stageLabel: "Tahap saat ini",
    boundaryLabel: "Yang tidak kami tangani",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Di antara manusia dan masyarakat,", "kami menciptakan pendampingan", "berikutnya."],
    lead: ["Yorisou menatap kompleksitas dalam kehidupan sehari-hari, pekerjaan, dan komunitas,", "lalu membangun produk yang membantu orang memahami, memilih, dan melangkah maju."],
    humanSide: "Manusia",
    humanItems: ["Kehidupan sehari-hari", "Pekerjaan", "Komunitas"],
    systemSide: "Sistem",
    systemItems: ["Mobilitas", "Prosedur administrasi"],
    fieldCaption: "Manusia — kehidupan sehari-hari, pekerjaan, komunitas  /  Sistem — mobilitas, prosedur administrasi",
    fieldRelation: "Relasi",

    whyEyebrow: "Masalah yang kami tangani",
    whyHeading: ["Kompleksitas tidak dapat diurai", "oleh usaha perorangan saja."],
    whyBeats: [
      { no: "01", title: "“Saya tidak paham” menghentikan orang di pintu masuk.", body: "Sistem yang ada tetapi tidak dapat dijangkau sama saja dengan tidak ada." },
      { no: "02", title: "Jarak menuju tenaga profesional terlalu jauh.", body: "Sebelum titik ketika penilaian manusia benar-benar dibutuhkan, ada jarak yang semestinya dapat dipikul oleh sistem." },
      { no: "03", title: "Lapangan dan sistem tidak saling bertaut.", body: "Di bidang mobilitas, kesejahteraan sosial, dan administrasi publik masih ada pilihan yang belum sampai ke orang-orang di lapangan." },
    ],

    buildEyebrow: "Yang kami bangun",
    buildHeading: ["Kami membangun pendampingan berikutnya,", "satu per satu."],

    howEyebrow: "Cara kami membangun",
    howHeading: ["Kami memikul kompleksitasnya", "dan mengubahnya menjadi sesuatu yang bisa dipakai."],
    howBeats: [
      { no: "01", title: "Mulai dari bahasa lapangan", body: "Kami tidak bertolak dari teknologi. Kami merancang mundur dari langkah nyata orang yang sedang terhenti." },
      { no: "02", title: "Bertanggung jawab sampai orang benar-benar paham", body: "Menyajikan informasi bukan akhir dari tugas kami. Kondisi ketika orang tahu apa langkah berikutnya termasuk dalam cakupan rancangan." },
      { no: "03", title: "Menyatakan batas dengan jelas", body: "Kami tidak melangkah ke wilayah yang menjadi tugas tenaga profesional berlisensi. Sampai mana kami menangani dan dari mana kami menyerahkannya, ditulis di dalam produk itu sendiri." },
      { no: "04", title: "Hanya menyebut yang dapat dipastikan", body: "Hasil, angka, dan kemitraan hanya kami cantumkan bila ada buktinya. Yang tidak dapat dipastikan tidak kami tulis." },
    ],
    howDisclose: "Apa arti prinsip ini dalam praktik",

    founderEyebrow: "Perwakilan perusahaan",
    founderHeading: ["Dibangun oleh orang yang dua puluh tahun", "berada di dalam industri yang kompleks."],
    founderTeaser: "Lebih dari dua puluh tahun di bidang otomotif, mobilitas, manufaktur, dan bisnis internasional, berdiri di antara teknologi, implementasi, dan alur komersial. Yang berulang kali terlihat di sana adalah sistem yang baik berhenti sebelum sampai kepada orang yang membutuhkannya.",
    founderRole: "Perwakilan Perusahaan, Yorisou LLC",
    founderCta: "Tentang perwakilan perusahaan",

    messageEyebrow: "Pesan perwakilan perusahaan",
    messageHeading: ["Kami menilai dari apakah sesuatu sampai,", "bukan dari seberapa canggihnya."],
    messageTeaser: "Yang kami tangani bukan kebaruan. Aturan dan pilihan yang sudah ada justru berhenti sebelum sampai kepada orang yang membutuhkannya. Kami membangun perusahaan yang mempersempit jarak itu, selangkah demi selangkah.",
    messageCta: "Baca pesan selengkapnya",

    originEyebrow: "Lokasi kami",
    originHeading: ["Bermula dari Fukuoka."],
    originBody: "Yorisou LLC membangun perusahaannya dari Kota Fukuoka, Prefektur Fukuoka. Di tempat ketika kehidupan, pekerjaan, dan komunitas berada dalam jarak yang dekat, kami memulai perancangan dari langkah nyata di lapangan.",

    proofEyebrow: "Perusahaan",
    proofHeading: ["Yang dapat kami tuliskan,", "hanya sebatas itu."],

    ctaEyebrow: "Kontak",
    ctaHeading: ["Mungkin ada ruang", "untuk mengerjakannya bersama."],
    ctaBody: "Kami menerima pertanyaan tentang kegiatan usaha, penjajakan kemitraan, dan permintaan liputan. Kami akan membalas satu per satu sesuai isi pesannya.",
    ctaButton: "Hubungi kami",
  },

  mirai: {
    eyebrow: "Proyek 01",
    heading: ["Platform untuk informasi, pencocokan,", "dan pengembangan bisnis", "di sektor mobilitas Jepang."],
    stage: "Situs publik aktif / fitur platform dalam pengembangan",
    lead: "Mirai Move bertujuan menghubungkan pemerintah dan pemerintah daerah, perusahaan, lingkungan komunitas serta perawatan dan kesejahteraan sosial, pemasok luar negeri, dan mitra dalam negeri, agar informasi dan peluang seputar mobilitas dapat ditangani sebagai satu alur. Saat ini situs informasi publiknya sudah aktif, sedangkan fitur platformnya masih dalam tahap pengembangan.",
    domain: "Sektor mobilitas Jepang",
    networkEyebrow: "Pihak yang dihubungkan",
    networkHeading: ["Pihak dengan posisi berbeda", "melihat peluang yang sama", "dengan bahasa yang berbeda."],
    centre: "Peluang mobilitas",
    parties: [
      { no: "01", title: "Pemerintah dan pemerintah daerah", body: "Sisi aturan dan anggaran" },
      { no: "02", title: "Perusahaan", body: "Sisi pasokan dan implementasi" },
      { no: "03", title: "Lingkungan komunitas, perawatan, dan kesejahteraan sosial", body: "Tempat perpindahan benar-benar terjadi" },
      { no: "04", title: "Pemasok luar negeri dan mitra dalam negeri", body: "Sisi yang membawa pilihan" },
    ],
    boundaryTitle: "Mengenai status pengembangan",
    boundaryBody: "Platform utamanya masih dalam pengembangan. Eksekusi otomatis oleh agen otonom tidak diaktifkan. Setiap tindakan yang menjangkau pihak luar dirancang dengan syarat konfirmasi manusia. Ini tidak kami tawarkan sebagai platform lengkap dengan seluruh fiturnya.",
    detail: [
      { heading: "Masalah yang ditangani", body: "Pilihan mobilitas tersedia secara terpisah menurut daerah, menurut skema, dan menurut penyelenggara. Orang yang membutuhkannya dan pilihan yang sudah tersedia tidak bertemu di tempat yang sama." },
      { heading: "Pihak yang dihadapi", body: "Pemerintah dan pemerintah daerah, perusahaan, lingkungan komunitas serta perawatan dan kesejahteraan sosial, pemasok luar negeri, dan mitra dalam negeri. Pihak dengan posisi dan tolok ukur yang berbeda melihat peluang yang sama dengan bahasa yang berbeda." },
      { heading: "Yang sudah berjalan saat ini", body: "Situs informasi publik sudah aktif. Fungsi informasi, pencocokan, dan pengembangan bisnis sebagai platform masih berada pada tahap penyiapan fondasi dan arsitektur." },
    ],
    siteLabel: "Situs publik",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "Proyek 02",
    heading: ["Dukungan prosedur multibahasa", "bagi orang yang tinggal di Jepang", "dan yang memulai usaha di sini."],
    stage: "Dalam pengembangan (belum dibuka untuk umum)",
    lead: "Ketika bahasa dan pengetahuan awal menjadi penghalang, orang tidak dapat menjangkau aturan yang sebenarnya berhak mereka gunakan. Kakari membantu menyajikan informasi yang diperlukan, menyiapkan dokumen, mengisi formulir, hingga memandu langkah penyerahan dan pengiriman pos, dalam berbagai bahasa. Saat ini masih berada pada tahap pengembangan dan belum dibuka untuk umum.",
    domain: "Prosedur administrasi dan dokumen / multibahasa",
    procedureEyebrow: "Prosedur yang didukung",
    procedureHeading: ["Dari mencari tahu,", "sampai menyerahkan."],
    steps: [
      { no: "01", title: "Mencari tahu", body: "Mengenali aturan mana yang berkaitan dengan diri sendiri" },
      { no: "02", title: "Menyiapkan dokumen", body: "Merinci dokumen dan lampiran yang diperlukan" },
      { no: "03", title: "Menyusun", body: "Mengisi dalam bahasa sendiri dan memeriksa isinya" },
      { no: "04", title: "Menyerahkan", body: "Memandu tujuan penyerahan, cara penyerahan, dan langkah pengiriman pos" },
    ],
    boundaryTitle: "Wilayah yang ditangani tenaga profesional",
    boundaryBody: "Kami tidak bertindak mewakili tenaga profesional berlisensi. Wilayah yang memerlukan penilaian hukum, perpajakan, atau keputusan resmi kami nyatakan dengan jelas sebagai wilayah yang ditangani tenaga profesional. Penilaian maupun perwakilan yang memerlukan lisensi, seperti pengacara, konsultan pajak, atau ahli administrasi hukum (gyoseishoshi), tidak termasuk dalam fungsi Kakari.",
    detail: [
      { heading: "Masalah yang ditangani", body: "Cara menjalani prosedurnya sudah dipublikasikan. Meski begitu, ada orang yang tidak dapat menjangkau aturan itu hanya karena bahasa dan pengetahuan dasarnya tidak mencukupi. Ini bukan persoalan kemampuan orang tersebut." },
      { heading: "Pihak yang dihadapi", body: "Orang yang tinggal di Jepang dan orang yang akan memulai usaha di Jepang. Kami memikirkan mereka yang berada dalam situasi sulit untuk menjalani prosedur dalam bahasa Jepang seorang diri." },
      { heading: "Yang sudah berjalan saat ini", body: "Fondasi autentikasi dibangun di lingkungan verifikasi yang terpisah, dan saat ini berada pada tahap pengujian izin akses serta penyimpanan. Integrasi eksternal tetap dinonaktifkan dan belum dibuka untuk umum." },
    ],
  },

  about: {
    eyebrow: "Tentang Kami",
    heading: ["Cara kami membangun", "adalah janji kami."],
    lead: "Yorisou menatap kompleksitas dalam kehidupan sehari-hari, pekerjaan, dan komunitas, lalu membangun produk yang membantu orang memahami, memilih, dan melangkah maju.",
    whyHeading: ["Mengapa perusahaan ini ada."],
    whyBody: [
      "Aturan, teknologi, maupun pilihan sudah tersedia dalam jumlah banyak. Meski begitu, semuanya berhenti sebelum sampai kepada orang yang membutuhkannya. Jarak terakhir itulah yang kami hadapi.",
      "Jarak ini sering dibicarakan sebagai persoalan usaha perorangan atau banyaknya informasi. Namun kenyataannya, kompleksitas yang semestinya dapat dipikul oleh sistem justru diserahkan begitu saja kepada perorangan.",
    ],
    thinkHeading: ["Cara kami berpikir."],
    thinkBody: [
      "Kami tidak bertolak dari teknologi. Kami mulai dengan mengurai satu langkah yang sedang terhenti: membaca situasi orang tersebut, menatanya sebagai sebuah relasi, dan membawanya sampai jelas apa langkah berikutnya. Sejauh itulah cakupan rancangan kami.",
      "AI kami gunakan untuk pemahaman dan penataan itu, bukan untuk menggantikan penilaian. Perannya adalah menyiapkan bahan yang dibutuhkan orang untuk menilai, dalam bentuk yang bisa dipakai.",
    ],
    buildHeading: ["Cara kami membangun."],
    principles: [
      { no: "01", title: "Mulai dari bahasa lapangan", body: "Kami tidak bertolak dari teknologi. Kami merancang mundur dari langkah nyata orang yang sedang terhenti." },
      { no: "02", title: "Bertanggung jawab sampai orang benar-benar paham", body: "Menyajikan informasi bukan akhir dari tugas kami. Kondisi ketika orang tahu apa langkah berikutnya termasuk dalam cakupan rancangan." },
      { no: "03", title: "Menyatakan batas dengan jelas", body: "Kami tidak melangkah ke wilayah yang menjadi tugas tenaga profesional berlisensi. Sampai mana kami menangani dan dari mana kami menyerahkannya, ditulis di dalam produk itu sendiri." },
      { no: "04", title: "Hanya menyebut yang dapat dipastikan", body: "Hasil, angka, dan kemitraan hanya kami cantumkan bila ada buktinya. Yang tidak dapat dipastikan tidak kami tulis." },
    ],
    principlesLong: [
      { no: "01", title: "Mulai dari bahasa lapangan", long: "Aturan apa pun tidak akan sampai sebelum diterjemahkan ke dalam langkah orang yang memakainya. Kami memulai perancangan dari pengajuan yang nyata, perpindahan yang nyata, dan percakapan yang nyata. Bukan dari rumusan masalah yang abstrak, melainkan dari satu langkah yang sedang terhenti di depan mata." },
      { no: "02", title: "Bertanggung jawab sampai orang benar-benar paham", long: "Menderetkan hasil pencarian bukanlah dukungan. Yang dibutuhkan adalah mengetahui apa yang harus dilakukan sekarang. Cakupan produk kami bukan sampai informasi ditampilkan, melainkan sampai langkah berikutnya dapat dipahami." },
      { no: "03", title: "Menyatakan batas dengan jelas", long: "Membiarkan orang memakai produk tanpa kejelasan tentang apa yang tidak dapat dilakukannya adalah rancangan yang paling berbahaya. Sampai mana kami menangani dan dari mana kami menyerahkannya kepada tenaga profesional, kami tuliskan pada layar produk itu sendiri. Batas bukan catatan peringatan, melainkan bagian dari fungsinya." },
      { no: "04", title: "Hanya menyebut yang dapat dipastikan", long: "Kami tidak lebih dahulu membicarakan hasil yang tidak dapat dipastikan atau fitur yang belum berjalan. Setiap fakta yang kami cantumkan selalu memiliki catatan yang mendukungnya. Pada masa ketika yang dapat kami tuliskan hanya sedikit, kami menerbitkannya sedikit apa adanya." },
    ],
    orderHeading: ["Satu per satu,", "sampai tuntas."],
    orderBody: "Kami tidak memulai banyak hal sekaligus. Kami mendahulukan menuntaskan satu bidang sampai benar-benar menjangkau langkah nyata di lapangan.",
    claimsHeading: ["Yang tidak dapat kami pastikan,", "tidak kami tulis."],
    claimsBody: "Setiap fakta yang kami cantumkan selalu memiliki catatan yang mendukungnya. Pada masa ketika yang dapat kami tuliskan hanya sedikit, kami menerbitkannya sedikit apa adanya.",
  },

  company: {
    eyebrow: "Perusahaan",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC membangun produk yang mengubah kompleksitas dalam kehidupan sehari-hari, pekerjaan, dan komunitas menjadi sesuatu yang dapat dipahami, dipilih, dan dijalankan orang. Berbasis di Fukuoka, kami menjalankan dua bidang usaha: Mirai Move dan Kakari.",

    messageEyebrow: "Pesan perwakilan perusahaan",
    messageHeading: ["Kami menilai dari apakah sesuatu sampai,", "bukan dari seberapa canggihnya."],
    message: [
      "Yang kami tangani bukan kebaruan.",
      "Selama lebih dari dua puluh tahun, di bidang otomotif, mobilitas, dan manufaktur, saya berdiri di antara teknologi, implementasi, dan alur komersial. Yang berulang kali saya lihat di sana adalah sistem yang dibuat dengan baik berhenti sebelum sampai kepada orang yang membutuhkannya. Bukan karena teknologinya kurang, melainkan karena ia belum diterjemahkan ke dalam langkah yang benar-benar dijalani orang itu.",
      "Aturan maupun pilihan sudah tersedia dalam jumlah banyak. Namun bila seseorang tidak tahu apakah hal itu berkaitan dengan dirinya, atau apa yang harus dilakukannya berikutnya, keberadaannya sama saja dengan tidak ada. Jarak terakhir itu dipikul oleh sisi sistem. Itulah alasan Yorisou didirikan.",
      "Kami tidak menggunakan AI untuk menggantikan penilaian. Kami menggunakannya untuk membaca bahan yang dibutuhkan orang dalam menilai, menatanya sebagai relasi, dan menyiapkannya dalam bentuk yang bisa dipakai. Penilaian dan tanggung jawab tetap berada di sisi manusia. Sampai mana kami menangani dan dari mana kami menyerahkannya kepada tenaga profesional, kami tuliskan pada layar produk. Itulah cara kami merancang.",
      "Sebagai perusahaan kami masih kecil, dan belum banyak yang dapat kami tuliskan. Justru karena itu, kami hanya menulis apa yang sudah dapat dipastikan. Yang perlu bertambah bukanlah klaimnya, melainkan catatan tentang apa yang benar-benar sampai.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Perwakilan Perusahaan, Yorisou LLC",

    profileEyebrow: "Perwakilan perusahaan",
    profileHeading: ["Tentang perwakilan perusahaan"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Perwakilan Perusahaan, Yorisou LLC",
    profileBody: [
      "Lebih dari dua puluh tahun pengalaman kerja di bidang otomotif, mobilitas, manufaktur, pengembangan proyek industri, rantai pasok, pengembangan komersial, pengembangan produk, serta bisnis internasional lintas negara.",
    ],
    profileBackgroundLabel: "Riwayat karier",
    profileBackground: [
      "Memegang tanggung jawab senior untuk proyek komersial dan industri di Ficosa, pemasok komponen otomotif internasional, termasuk pekerjaan yang berkaitan dengan proyek industri global dan kegiatan komersial di kawasan Asia.",
      "Selanjutnya mendirikan dan menjalankan usaha teknologi dan manufaktur di Tiongkok, mencakup elektronika otomotif, sistem kendali, manufaktur presisi, serta pengembangan produk dan sistem yang memanfaatkan AI.",
      "Memiliki pengalaman menjalankan usaha internasional di beberapa pasar, termasuk Eropa, Tiongkok, dan Jepang.",
      "Saat ini menjabat sebagai perwakilan perusahaan Yorisou LLC di Jepang dan membangun perusahaan dari Fukuoka.",
    ],
    profileEducationLabel: "Pendidikan",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Mengapa latar belakang ini bertaut dengan Yorisou",
    profileRelevance: [
      "Pengalaman panjang bekerja lintas industri nyata yang kompleks.",
      "Berdiri pada posisi yang menyambungkan teknologi, manufaktur, eksekusi komersial, dan pasar internasional.",
      "Melihat langsung jarak antara sistem dan teknologi dengan apa yang benar-benar dapat dipakai orang maupun organisasi.",
      "Dan karena itulah, sampai pada membangun produk yang mengubah kompleksitas menjadi sesuatu yang dapat dipahami dan dijalankan.",
    ],

    overviewEyebrow: "Profil perusahaan",
    overviewHeading: ["Profil perusahaan"],
    facts: [
      { label: "Nama perusahaan", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Perwakilan perusahaan", value: "Jin Yang" },
      { label: "Lokasi", value: "Kota Fukuoka, Prefektur Fukuoka, Jepang" },
      { label: "Bidang usaha", value: "Perencanaan, pengembangan, dan pengoperasian Mirai Move dan Kakari" },
    ],

    businessEyebrow: "Bidang usaha",
    businessHeading: ["Bidang usaha"],
    businessBody: "Informasi, pencocokan, dan pengembangan bisnis di sektor mobilitas; serta dukungan multibahasa untuk prosedur administrasi dan dokumen bagi orang yang tinggal di Jepang dan yang memulai usaha di sini. Keduanya kami jalankan dengan prinsip yang sama: memikul kompleksitasnya dan mengembalikannya dalam bentuk yang bisa dipakai.",

    projectsEyebrow: "Proyek",
    projectsHeading: ["Yang sedang kami bangun"],

    originEyebrow: "Lokasi kami",
    originHeading: ["Bermula dari Fukuoka."],
    originBody: [
      "Yorisou LLC membangun perusahaannya dari Kota Fukuoka, Prefektur Fukuoka.",
      "Di tempat ketika kehidupan, pekerjaan, dan komunitas berada dalam jarak yang dekat, kami memulai perancangan dari langkah nyata di lapangan.",
    ],

    ctaHeading: ["Kontak"],
    ctaBody: "Kami menerima pertanyaan tentang kegiatan usaha, penjajakan kemitraan, dan permintaan liputan.",
  },

  contact: {
    eyebrow: "Kontak",
    heading: ["Kontak"],
    lead: "Kami menerima pertanyaan tentang kegiatan usaha, penjajakan kemitraan, dan permintaan liputan. Kami akan membalas satu per satu sesuai isi pesannya.",
    channelsHeading: ["Jenis hal yang dapat ditanyakan"],
    channels: [
      { title: "Pertanyaan umum", body: "Pertanyaan tentang Yorisou sebagai perusahaan dan bidang usaha yang sedang kami jalankan." },
      { title: "Bisnis dan kemitraan", body: "Diskusi kerja sama atau kesepakatan usaha di bidang mobilitas maupun prosedur administrasi." },
      { title: "Liputan dan media", body: "Permintaan wawancara serta pertanyaan tentang perusahaan atau perwakilan perusahaan." },
    ],
    formHeading: ["Kirim melalui formulir"],
    formIntro: "Silakan kirim melalui formulir di bawah ini. Isi pesan yang kami terima akan diperiksa oleh penanggung jawab dan kami balas satu per satu.",
    fields: {
      name: "Nama", namePlaceholder: "Nama Anda",
      email: "Alamat email", emailPlaceholder: "you@example.com",
      org: "Nama perusahaan atau organisasi", orgPlaceholder: "Opsional",
      type: "Jenis pertanyaan",
      message: "Isi pesan", messagePlaceholder: "Tuliskan latar belakangnya dan hal yang ingin Anda pastikan.",
    },
    types: [
      { value: "general", label: "Pertanyaan umum" },
      { value: "business", label: "Bisnis dan kemitraan" },
      { value: "media", label: "Liputan dan media" },
    ],
    submit: "Kirim",
    sending: "Mengirim…",
    successTitle: "Pesan terkirim",
    successBody: "Pertanyaan Anda telah kami terima. Kami akan memeriksa isinya dan membalas satu per satu.",
    errorTitle: "Tidak dapat mengirim",
    errorBody: "Mohon tunggu sejenak, lalu coba lagi.",
    required: "Wajib",
    privacyNote: "Data pribadi yang Anda berikan hanya kami gunakan untuk keperluan menanggapi pertanyaan Anda.",
  },
};
