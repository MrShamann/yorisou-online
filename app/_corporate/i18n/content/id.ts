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
    home: { title: "Yorisou LLC — Dari masalah struktural menjadi perusahaan yang berdiri sendiri.", description: "Yorisou LLC bekerja sebagai foundry: kami menemukan masalah struktural, membangun bukti dan aset usaha, lalu bergabung dengan tim pendiri untuk mengubahnya menjadi perusahaan yang mandiri. Mirai Move, Kakari, dan Chigamo sedang kami jalankan." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Platform untuk informasi, pencocokan, dan pengembangan bisnis di sektor mobilitas Jepang. Situs publiknya sudah aktif; fitur platformnya masih dalam tahap pengembangan." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Dukungan multibahasa untuk prosedur administrasi dan dokumen, bagi orang yang tinggal di Jepang dan yang memulai usaha di sini. Masih dalam pengembangan dan belum dibuka untuk umum." },
    about: { title: "Cara kami membangun — Yorisou LLC", description: "Menemukan masalahnya, memastikannya, merancangnya sebagai usaha, bergabung dengan tim pendiri, lalu membawanya menjadi perusahaan yang mandiri. Cara kerja foundry Yorisou, dan letak fondasi bersama di dalamnya." },
    company: { title: "Perusahaan — Yorisou LLC", description: "Profil perusahaan, profil perwakilan perusahaan, pesan perwakilan perusahaan, dan bidang usaha Yorisou LLC." },
    contact: { title: "Kontak — Yorisou LLC", description: "Kanal pertanyaan mengenai kegiatan usaha, kemitraan, dan liputan media." },
    ventures: { title: "Usaha — Yorisou LLC", description: "Usaha dan gagasan yang sedang Yorisou kerjakan: Mirai Move, Kakari, dan Chigamo. Tahapnya berbeda-beda, dan kami menuliskannya apa adanya." },
    buildWithUs: { title: "Membangun bersama kami — Yorisou LLC", description: "Pintu masuk bagi pendiri, peneliti, instansi publik, dan perusahaan. Saat ini tidak ada program pendaftaran; kami memulainya dari percakapan." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Gagasan untuk membuat hal yang benar-benar berguna di suatu tempat dapat dikenali dari lokasi dan konteksnya. Masih pada tahap gagasan, dan belum ada produk yang dirilis." },
  },

  common: {
    readMore: (name) => `Selengkapnya tentang ${name}`,
    backHome: "Kembali ke halaman perusahaan",
    stageLabel: "Tahap saat ini",
    boundaryLabel: "Yang tidak kami tangani",
    nowLabel: "Saat ini",
    nextLabel: "Langkah berikutnya",
    whoLabel: "Yang ingin kami ajak bicara",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Dari masalah struktural,", "kami membangun perusahaan", "yang berdiri sendiri."],
    lead: [
      "Yorisou adalah sebuah foundry: kami menemukan masalah struktural di masyarakat,",
      "memastikannya, merancangnya sebagai usaha, lalu bergabung dengan orang yang akan menjalankannya,",
      "dan membawanya sampai menjadi perusahaan yang mandiri.",
    ],
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
    buildHeading: ["Tiga bidang", "yang sedang berjalan sekarang."],

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

    /* CORP-v1.2 — Asterion layer and engagement layer on the homepage. */
    asterionEyebrow: "Fondasi bersama",
    asterionHeading: ["Setiap kali kami membangun,", "landasannya bertambah tebal."],
    asterionBody:
      "Asterion OS adalah platform teknologi dan eksekusi bersama yang independen, yang ditempatkan di dalam arsitektur foundry Yorisou. Karena landasan bersamanya sudah ada, setiap usaha dapat memusatkan tenaganya pada bagian yang memang menjadi wilayahnya sendiri.",
    asterionNote:
      "Setiap usaha diatur secara terpisah, dengan kekayaan intelektual, data, dan tanggung jawab operasionalnya masing-masing. Asterion bukan milik Yorisou.",
    engageEyebrow: "Membangun bersama kami",
    engageHeading: ["Terlibatlah selagi ini", "masih dalam proses menjadi perusahaan."],
    engageBody:
      "Pendiri, peneliti, instansi publik, perusahaan. Di mana Anda dapat ikut serta bergantung pada posisi Anda. Kami mulai dari apa pun yang bisa dibicarakan sekarang.",
    engageCta: "Lihat cara terlibat",
    engageNote: "Semuanya dimulai dari percakapan. Belum ada proses pendaftaran maupun mekanisme seleksi.",
    explainerLabel: "Yorisou dalam 30 detik",
    explainerHeading: ["Dari sebuah masalah sampai menjadi perusahaan,", "dalam tiga puluh detik."],
    explainerClose: "Tutup",
  },

  mirai: {
    reading: "Menggerakkan mobilitas daerah sampai ke penyelesaiannya.",
    now: "Situs publiknya berjalan, dan sistem yang terus membaca informasi publik pun berjalan secara otomatis. Namun sampai sekarang, belum ada satu pun yang kami kirimkan ke pihak luar.",
    next: "Pada kasus nyata yang pertama, masih tersisa hal-hal yang tidak dapat dipastikan tanpa menanyakannya ke luar. Dari titik ini, giliran manusia yang bergerak.",
    who: "Orang yang mengenal lapangan mobilitas daerah dari dalam — pemerintah daerah, penyelenggara angkutan, atau lapangan itu sendiri — dan dapat menjelaskan batasan yang sebenarnya.",
    join: {
      title: "Terlibat dalam usaha ini",
      body: "Yang kami butuhkan sekarang adalah orang yang dapat menjelaskan batasan di lapangan secara konkret. Ini tahap memastikan, bukan tahap menawarkan.",
      roles: [
        "Anda terlibat dalam angkutan atau mobilitas daerah — pemerintah daerah, penyelenggara, atau lapangan itu sendiri",
        "Anda dapat memikul bidang ini sebagai pendiri atau pengelola",
        "Anda mengetahui bagaimana operasinya benar-benar berjalan sehari-hari",
      ],
      state: "Kami berada pada tahap ingin mendengarkan. Tidak ada lowongan yang dibuka.",
    },
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
    reading: "Agar prosedur di Jepang dapat dijalani sendiri.",
    now: "Tahap pengujian tertutup. Belum dibuka untuk umum, dan belum ada seorang pun yang memakainya.",
    next: "Langkah yang diperlukan untuk pendistribusiannya, dan penetapan data pendaftaran perusahaan. Keduanya memerlukan konfirmasi dari pihak luar.",
    who: "Warga negara asing yang tinggal di Jepang, orang yang mendampingi mereka, dan tenaga profesional berlisensi.",
    join: {
      title: "Terlibat dalam usaha ini",
      body: "Ini tahap ketika kami ingin lebih dahulu memperlihatkannya kepada orang yang tahu seperti apa prosedur ini sebenarnya. Ini bukan alat untuk menggantikan tenaga profesional.",
      roles: [
        "Anda pernah benar-benar kesulitan menjalani prosedur di Jepang",
        "Anda terlibat dalam pendampingan warga negara asing",
        "Anda tenaga profesional berlisensi dan dapat ikut memastikan di mana batas itu semestinya ditarik",
        "Anda dapat memikul usaha ini sebagai pendiri atau pengelola",
      ],
      state: "Kami sedang mencari orang untuk melihatnya. Belum dibuka untuk umum dan belum ada penerimaan apa pun.",
    },
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
      { label: "Nomor perusahaan (hōjin bangō)", value: "2290003018125" },
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

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────────── */
  ventures: {
    eyebrow: "Usaha kami saat ini",
    heading: ["Tiga bidang, dan masing-masing", "belum sampai menjadi perusahaan."],
    lead:
      "Di setiap bidang itu, aturan dan sistemnya sudah tersedia — lalu berhenti tepat sebelum sampai kepada orang yang membutuhkannya. Yorisou masuk ke celah itu dan memastikannya sambil berjalan.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Menghubungkan informasi, pencocokan, dan pengembangan bisnis di bidang mobilitas.",
        problem: "Informasi dan peluang terpisah-pisah di antara penyelenggara, daerah, dan pemerintah.",
        building: "Platform tempat pihak di dalam dan luar Jepang dapat berbicara di atas informasi yang sama.",
        status: "Dalam pengembangan dan pengoperasian. Situs publik aktif.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Mendukung prosedur bagi orang yang tinggal dan memulai usaha di Jepang, dalam berbagai bahasa.",
        problem: "Aturannya sudah ada, tetapi bahasa dan urutan langkahnya membuatnya tidak pernah terpakai.",
        building: "Cara memecah prosedur menjadi tahapan dan menunjukkan sampai mana orang bisa mengurusnya sendiri.",
        status: "Dalam pengembangan. Tahap persiapan rilis.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Membuat sebuah tempat dapat dipahami dari lokasi dan konteksnya.",
        problem: "Justru informasi yang benar-benar berguna di suatu tempat paling sulit ditemukan.",
        building: "Cara menemukan hal-hal di lingkungan sekitar, berpijak pada lokasi dan konteks.",
        status: "Tahap gagasan. Belum diuji.",
      },
    ],
    noteHeading: ["Apa yang halaman ini nyatakan,", "dan apa yang tidak."],
    noteBody: [
      "Yang berjajar di sini adalah usaha dan gagasan yang sedang Yorisou kerjakan saat ini.",
      "Semuanya bukan anak perusahaan yang berbadan hukum, bukan penyertaan modal, dan bukan klien. Tahapnya berbeda-beda, dan kami menuliskannya apa adanya.",
      "Tujuan kami adalah agar masing-masing dapat berdiri sebagai perusahaan yang mandiri. Belum ada satu pun yang sampai ke titik itu.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    reading: "Memahami sebuah tempat, dari dalam tempat itu.",
    now: "Tahap gagasan. Belum ada produk yang dirilis, belum ada pengguna, dan belum ada program bersama pemerintah daerah.",
    next: "Apakah penyaringan berdasarkan lokasi dan konteks benar-benar membuat informasi menjadi bisa dipakai. Itulah yang lebih dahulu kami pastikan, dalam skala kecil.",
    who: "Orang yang benar-benar mengenal suatu tempat, dan dapat menjelaskan di titik mana informasi tentang lingkungan sekitarnya berhenti berguna.",
    join: {
      title: "Terlibat dalam usaha ini",
      body: "Ini masih berada sebelum tahap pengujian. Karena itu, yang kami cari bukan orang untuk membangun bersama, melainkan orang yang mau meruntuhkan hipotesis kami.",
      roles: [
        "Anda mengenal suatu daerah tertentu secara mendalam, dari sisi orang yang tinggal di sana",
        "Anda pernah bekerja dengan data lokasi atau data kewilayahan",
        "Anda tidak keberatan terlibat selagi ini masih berupa gagasan",
      ],
      state: "Tahap gagasan. Bentuk keterlibatannya belum ditentukan.",
    },
    eyebrow: "Proyek",
    heading: ["Memahami sebuah tempat,", "dari dalam tempat itu."],
    stage: "Tahap gagasan",
    lead:
      "Sebuah gagasan: memakai lokasi dan konteks untuk memunculkan apa yang benar-benar berguna di suatu tempat. Ini masih berada sebelum tahap pengujian.",
    domain: "Lingkungan sekitar / lokasi dan konteks / penemuan",
    conceptEyebrow: "Yang sedang kami pikirkan",
    conceptHeading: ["Bukan informasinya tidak ada,", "melainkan tidak sampai."],
    conceptBody: [
      "Hal yang paling ingin diketahui tentang sebuah tempat justru paling sulit muncul dalam pencarian. Bukan karena informasinya tidak ada, melainkan karena ia tidak pernah ditata menurut tempat dan situasinya.",
      "Di mana seseorang berada, kapan waktunya, dan situasi apa yang sedang dihadapinya. Ada informasi yang baru terasa berkaitan dengan diri sendiri ketika ketiganya bertemu. Di sanalah Chigamo mencoba bekerja.",
    ],
    boundaryTitle: "Tahap saat ini",
    boundaryBody:
      "Chigamo berada pada tahap gagasan. Belum ada produk yang dirilis, belum ada pengguna, dan belum ada program bersama pemerintah daerah. Yang tertulis di sini adalah hipotesis yang hendak kami pastikan.",
    detail: [
      {
        heading: "Mengapa sekarang",
        body: "Peta maupun mesin pencari sudah cukup matang. Meski begitu, “apa yang berarti bagi saya, di tempat saya berdiri sekarang” masih harus dicari ulang sendiri oleh setiap orang.",
      },
      {
        heading: "Yang perlu kami pastikan",
        body: "Apakah penyaringan berdasarkan lokasi dan konteks benar-benar membuat informasi menjadi bisa dipakai. Itulah yang lebih dahulu kami pastikan, dalam skala kecil.",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ─────────────────────────────── */
  foundry: {
    eyebrow: "Cara kami membangun",
    heading: ["Dari sebuah masalah sampai menjadi perusahaan,", "secara berurutan."],
    lead:
      "Kami tidak berangkat dari gagasan yang sekadar terlintas. Kami menemukan masalah struktural, memastikannya, merancangnya sebagai usaha, bergabung dengan orang yang mampu menjalankannya, lalu membawanya menjadi perusahaan yang mandiri. Urutan itulah yang Yorisou sebut foundry.",
    stagesEyebrow: "Tahapan",
    stagesHeading: ["Delapan tahap,", "tanpa ada yang dilewati."],
    stages: [
      { no: "01", name: "Hipotesis", body: "Menetapkan di mana letak masalah strukturalnya — dari bentuk pekerjaan yang nyata di lapangan, bukan dari sesuatu yang sekadar terlintas." },
      { no: "02", name: "Bukti", body: "Memastikan apakah masalah itu benar-benar ada dan siapa yang menanggungnya. Banyak hipotesis gugur di tahap ini." },
      { no: "03", name: "Perancangan usaha", body: "Mengubah cara menyelesaikannya menjadi bentuk usaha: siapa yang memakainya, dan di mana nilainya dipertukarkan." },
      { no: "04", name: "Pembangunan", body: "Membangunnya. Memakai landasan bersama pada bagian yang memungkinkan, dan memusatkan tenaga pada bagian yang khas bagi usaha itu." },
      { no: "05", name: "Siap berdiri sebagai usaha", body: "Menyiapkan aset dan prosedurnya sampai orang dari luar dapat mengambil alih dan menjalankannya." },
      { no: "06", name: "Pembentukan tim pendiri", body: "Bergabung dengan orang yang mampu memikulnya sebagai miliknya sendiri — sebagai pendiri, bukan sebagai karyawan." },
      { no: "07", name: "Berdiri sendiri dan beroperasi", body: "Menjalankannya sebagai perusahaan yang mandiri, dalam bentuk yang tidak terus bergantung pada Yorisou." },
      { no: "08", name: "Pembelajaran", body: "Menyimpan apa yang berhasil maupun hipotesis yang gugur sebagai bahan untuk usaha berikutnya." },
    ],
    independenceHeading: ["Tujuannya adalah perusahaan", "yang berdiri sendiri."],
    independenceBody: [
      "Tujuan foundry ini bukan menambah jumlah hal yang bernaung di bawah Yorisou, melainkan membawa setiap usaha sampai mampu berdiri sebagai perusahaan yang mandiri.",
      "Karena itu, sejak awal kami membangunnya dalam bentuk yang dapat diserahkan. Bila orang yang menjalankannya tidak memegang kewenangan yang sesungguhnya, ia belum menjadi sebuah perusahaan.",
    ],
    asterionEyebrow: "Teknologi dan eksekusi bersama",
    asterionHeading: ["Tidak membangun", "hal yang sama dua kali."],
    asterionBody: [
      "Asterion OS adalah platform teknologi dan eksekusi bersama yang independen, yang ditempatkan di dalam arsitektur foundry Yorisou. Platform ini bukan milik Yorisou.",
      "Karena landasan bersamanya sudah ada, tidak ada usaha yang perlu membangun ulang hal yang sama, dan masing-masing dapat memusatkan perhatian pada bidangnya sendiri. Kemampuan yang terkumpul menjadi titik berangkat bagi usaha berikutnya.",
    ],
    asterionBoundaryTitle: "Batasnya",
    asterionBoundaryBody:
      "Setiap usaha diatur secara terpisah. Kekayaan intelektual, data, dan tanggung jawab operasional melekat pada usaha itu sendiri. Tidak ada rancangan yang membuat data usaha maupun data pengguna mengalir secara otomatis ke sisi platform.",
    economicsHeading: ["Kepemilikan mengikuti", "kontribusi dan tanggung jawab."],
    economicsBody: [
      "Ketentuannya berbeda pada setiap usaha. Kami tidak menerapkan satu pola tetap untuk semuanya.",
      "Yang sama hanyalah prinsipnya: kepemilikan mengikuti kontribusi, risiko yang dipikul, dan tanggung jawab yang berlanjut. Orang yang menjalankan sebuah usaha memegang kewenangan pengambilan keputusan yang sesungguhnya.",
      "Rinciannya dibicarakan per usaha dan per pihak. Hal seperti itu bukan sesuatu yang dapat dituliskan di halaman ini.",
    ],
    maturityTitle: "Tahap saat ini",
    maturityBody:
      "Cara kerja ini belum merupakan metode yang terbukti dan dapat diulang. Yorisou masih berada pada tahap awal, dan belum pernah melepas satu pun usaha menjadi perusahaan yang berdiri sendiri. Yang tertulis di sini adalah cara kami benar-benar bekerja, bukan klaim atas hasil.",
  },

  /* ── BUILD WITH US (CORP-v1.2) ──────────────────────────────────── */
  buildWithUs: {
    eyebrow: "Membangun bersama kami",
    heading: ["Pintu masuknya berbeda,", "tergantung posisi Anda."],
    lead:
      "Yorisou membawa sebuah usaha sampai titik tepat sebelum ia menjadi perusahaan, lalu bergabung dengan orang yang mampu memikulnya. Karena itu, yang kami cari bukan orang untuk dipekerjakan, melainkan orang yang mau mengambil alihnya.",
    lanes: [
      {
        key: "founders",
        label: "Pendiri",
        title: "Pendiri dan rekan pendiri",
        body:
          "Posisi ini adalah mengambil alih usaha yang sudah dibawa sampai titik tepat sebelum menjadi perusahaan, sebagai milik Anda sendiri. Anda terlibat sebagai pendiri, bukan sebagai karyawan — kewenangan pengambilan keputusan ada pada Anda, begitu pula tanggung jawabnya.",
        invites: [
          "Anda pernah benar-benar menjalankan sesuatu yang punya operasi nyata di belakangnya",
          "Anda dapat melangkah maju ketika banyak hal masih belum diputuskan",
          "Anda punya pijakan di salah satu bidang: teknologi, manufaktur, pemerintahan, atau kerja di daerah",
        ],
        offers: "Riset dan bukti, produk awal, rancangan usahanya, serta landasan bersama. Anda mulai dari tengah jalan, bukan dari nol.",
        cannot: "Kami tidak dapat menjanjikan gaji, pendanaan, maupun ketentuan kepemilikan pada saat ini. Ketentuannya dibicarakan per usaha.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Kami berada pada tahap ingin mendengarkan. Tidak ada lowongan yang dibuka.",
        cta: "Sampaikan ketertarikan Anda",
      },
      {
        key: "team",
        label: "Tim pendiri",
        title: "Tim pendiri dan tenaga ahli",
        body:
          "Seorang pendiri sendirian tidak pernah cukup. Kami mencari orang yang sejak awal ikut memegang salah satu bagiannya — teknik, operasional, atau lapangan.",
        invites: [
          "Anda tidak berhenti pada membangun, tetapi pernah mengawalnya sampai tahap operasional",
          "Anda pernah memulai sesuatu dengan tim yang kecil",
          "Anda tahu apa yang dianggap biasa di bidang Anda",
        ],
        offers: "Posisi yang terlibat sejak awal, dan keleluasaan yang nyata atas bagian yang Anda pegang.",
        cannot: "Tidak ada jalur perekrutan yang dibuka secara tetap. Kami tidak dapat mengatakan bahwa saat ini kami berada dalam posisi untuk merekrut.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Bergantung pada tahap usahanya. Ceritakan lebih dahulu apa yang dapat Anda pikul.",
        cta: "Mulai percakapan",
      },
      {
        key: "users",
        label: "Pengguna awal",
        title: "Pengguna awal dan orang yang ikut menguji bersama kami",
        body:
          "Ini tahap ketika kami ingin orang melihat apa yang kami bangun dari posisi orang yang benar-benar memakainya — bukan untuk dipuji, melainkan untuk diberi tahu di titik mana ia berhenti bekerja.",
        invites: [
          "Anda pernah benar-benar kesulitan menghadapi masalah ini",
          "Anda dapat mengatakan apa adanya bagian mana yang tidak berjalan",
          "Anda tidak keberatan melihat sesuatu sebelum dibuka untuk umum",
        ],
        offers: "Kesempatan melihat sesuatu yang masih dalam proses, dan apa yang Anda sampaikan kembali masuk ke dalam rancangannya.",
        cannot: "Kami tidak dapat menjanjikan waktu peluncuran, bahwa permintaan Anda akan diterapkan, maupun imbalan.",
        ventures: ["Kakari", "Mirai Move"],
        state: "Kami sedang mencari orang untuk melihatnya. Ini bukan program penerimaan resmi.",
        cta: "Sampaikan ketertarikan Anda",
      },
      {
        key: "research",
        label: "Universitas",
        title: "Universitas dan riset",
        body:
          "Mengubah hasil riset menjadi sesuatu yang dapat dipakai masyarakat memerlukan perancangan dari sisi usaha. Kami mencari pihak yang dapat memikirkan bersama soal penyiapan pendiri dan penerapan hasil riset.",
        invites: [
          "Anda sedang mencari tempat berlabuh bagi hasil riset",
          "Anda ingin mahasiswa dan peneliti mendapat pengalaman mendirikan usaha secara langsung",
          "Anda lebih suka memulai dari penjajakan bersama",
        ],
        offers: "Perancangan dari sisi usaha, dan pekerjaan yang benar-benar sedang berjalan. Kami dapat mulai dari penjajakan.",
        cannot: "Belum ada perjanjian riset bersama, belum ada pendanaan, dan belum ada kerja sama resmi.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "Kami tidak punya rekam jejak kemitraan. Semuanya dimulai dari percakapan.",
        cta: "Mulai percakapan",
      },
      {
        key: "public",
        label: "Sektor publik",
        title: "Pemerintah dan sektor publik",
        body:
          "Aturannya ada, tetapi belum pernah diterjemahkan menjadi langkah yang dapat diikuti warga. Kami ingin ikut merancang uji cobanya yang kecil, pengukuran hasilnya, sampai bentuk yang dapat bertahan.",
        invites: [
          "Ada persoalan yang dapat dicoba langsung di lapangan",
          "Anda ingin hasilnya berbentuk sesuatu yang dapat diukur",
          "Anda tidak ingin berhenti sebagai uji coba sekali jalan",
        ],
        offers: "Riset, bukti yang ditata menjadi bentuk yang bisa dipakai, dan rancangan untuk mencobanya dalam skala kecil.",
        cannot: "Kami belum punya rekam jejak kerja sama dengan pemerintah daerah, dan kami tidak dapat memberikan jaminan apa pun dari sisi aturan.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Dimulai dari percakapan. Tidak ada kerja sama yang sedang berjalan.",
        cta: "Hubungi kami",
      },
      {
        key: "corporate",
        label: "Perusahaan",
        title: "Perusahaan",
        body:
          "Bila ada persoalan di lapangan Anda sendiri yang semestinya menjadi sebuah usaha. Kami dapat memulainya dari pengembangan bersama atau uji coba langsung di lapangan.",
        invites: [
          "Ada persoalan operasional yang belum terselesaikan di lapangan Anda",
          "Anda sedang mencari bentuk usaha yang baru",
          "Anda sedang mencari mitra pengembangan bersama",
        ],
        offers: "Kami dapat terlibat sejak tahap merancang ulang persoalan itu sebagai sebuah usaha.",
        cannot: "Kami tidak punya rekam jejak transaksi komersial, dan tidak punya contoh penerapan yang dapat kami perlihatkan.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Dimulai dari mendengarkan.",
        cta: "Ajukan pertanyaan",
      },
    ],
    intakeTitle: "Tentang jalur penerimaan",
    intakeBody:
      "Saat ini tidak ada proses pendaftaran dan tidak ada program seleksi. Yang ada di sini adalah undangan, bukan kemitraan yang sedang berjalan maupun lowongan yang sedang dibuka. Kami mulai dengan mendengar apa yang Anda bawa, lalu melihat apakah ada hal yang bisa dibicarakan.",
    foundingTeamEyebrow: "Tim pendiri",
    foundingTeamHeading: ["Kami mulai membangun", "sebelum ada perusahaannya."],
    foundingTeamBody: [
      "Pada umumnya, sebuah usaha baru dimulai setelah orang-orangnya berkumpul. Yorisou bergerak dengan urutan yang sebaliknya: riset dan bukti, produk awal, serta rancangan usahanya dibuat lebih dahulu, baru setelah itu kami mencari orang yang akan mengambil alihnya.",
      "Karena itu, tidak ada yang memulai dari halaman kosong. Anda mulai dengan mengambil sesuatu yang sudah punya bentuk, lalu menjadikannya milik Anda sendiri.",
      "Sebagai gantinya, makna dari mengambil alih itu tidak berubah. Orang yang memegang kewenangan pengambilan keputusan juga memegang tanggung jawabnya. Bila orang yang menjalankannya tidak memegang kewenangan yang sesungguhnya, ia belum menjadi sebuah perusahaan.",
    ],
    ctaHeading: ["Dari posisi mana pun,", "pintu masuk awalnya sama."],
    ctaBody: "Tuliskan apa yang Anda pikirkan lalu kirimkan kepada kami. Kami membacanya satu per satu.",
  },
};
