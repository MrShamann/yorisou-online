import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — MALAY (Bahasa Melayu). Translated from the Japanese canonical source (ja.ts),
 * with en.ts used only as a structural reference.
 *
 * It may never be stronger than the Japanese. No customer, partner, metric, revenue, funding,
 * market-position, team-size or capability claim appears here that the Japanese does not make.
 *
 * On the company form: Yorisou is a Japanese LLC (godo kaisha). No joint-stock term is used, and
 * the representative is described as "Wakil Syarikat" (representative member) — never as a CEO of
 * a joint-stock corporation.
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 */
export const ms: SiteCopy = {
  chrome: {
    skip: "Langkau ke kandungan",
    menu: "Menu",
    menuToggle: "Buka dan tutup menu",
    close: "Tutup",
    navLabel: "Navigasi laman",
    navLabelMobile: "Navigasi laman (mudah alih)",
    langLabel: "Bahasa paparan",
    langHeading: "Pilih bahasa",
    langSearch: "Cari bahasa",
    langCurrent: "Bahasa semasa",
    previewBadge: "Pratonton — belum diterbitkan",
    nav: { home: "Utama", miraiMove: "Mirai Move", kakari: "Kakari", about: "Tentang Kami", company: "Maklumat Syarikat", contact: "Hubungi Kami" },
    footerTagline: "Antara manusia dan masyarakat, kami membina cara seterusnya untuk mendampingi.",
    footerProjects: "Projek",
    footerCompany: "Syarikat",
    footerLegalNote: "Setiap fakta yang tersiar di sini berdasarkan rekod yang dapat kami sahkan.",
    backToTop: "Kembali ke atas",
  },

  meta: {
    home: { title: "Yorisou LLC — Daripada masalah struktur kepada syarikat yang berdiri sendiri.", description: "Yorisou LLC ialah sebuah foundry: kami mencari masalah yang bersifat struktur, membina bukti dan aset usaha niaga, serta bekerjasama dengan pasukan pengasas untuk menjadikannya syarikat yang berdiri sendiri. Mirai Move, Kakari dan Chigamo sedang dijalankan." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Platform untuk maklumat, pemadanan dan pembangunan perniagaan dalam sektor mobiliti Jepun. Laman awam sudah beroperasi; fungsi platform masih dalam pembangunan." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Sokongan pelbagai bahasa untuk prosedur pentadbiran dan dokumen, bagi mereka yang tinggal di Jepun dan yang ingin memulakan perniagaan di sini. Masih dalam pembangunan dan belum dibuka kepada umum." },
    about: { title: "Cara kami membina — Yorisou LLC", description: "Mencari masalah, mengesahkannya, mereka bentuknya sebagai perniagaan, membentuk pasukan pengasas dan membawanya menjadi syarikat yang berdiri sendiri. Bagaimana foundry Yorisou berjalan, dan di mana kedudukan asas bersama." },
    company: { title: "Maklumat Syarikat — Yorisou LLC", description: "Gambaran syarikat, profil wakil syarikat, mesej wakil syarikat dan bidang perniagaan Yorisou LLC." },
    contact: { title: "Hubungi Kami — Yorisou LLC", description: "Saluran pertanyaan berkaitan perniagaan, kerjasama dan liputan media." },
    ventures: { title: "Usaha Niaga — Yorisou LLC", description: "Apa yang sedang Yorisou jalankan sekarang: Mirai Move, Kakari dan Chigamo. Setiap satu berada pada peringkat yang berbeza, dan kami menulis peringkat itu sebagaimana adanya." },
    buildWithUs: { title: "Bina bersama kami — Yorisou LLC", description: "Pintu masuk bagi pengasas, penyelidik, pihak awam dan syarikat. Tiada program permohonan yang dibuka; kami bermula daripada perbualan." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Satu gagasan untuk menjadikan apa yang benar-benar berguna di sesuatu tempat dapat ditemui melalui lokasi dan konteks. Kini pada peringkat konsep; tiada produk yang dibuka kepada umum." },
  },

  common: {
    readMore: (name) => `Lanjut tentang ${name}`,
    backHome: "Kembali ke halaman utama syarikat",
    stageLabel: "Peringkat semasa",
    boundaryLabel: "Apa yang tidak kami galas",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Daripada masalah struktur,", "kami membina syarikat", "yang berdiri sendiri."],
    lead: [
      "Yorisou ialah sebuah foundry: kami mencari masalah struktur dalam masyarakat, mengesahkannya,",
      "mereka bentuknya sebagai perniagaan, dan bekerjasama dengan orang yang akan mengendalikannya",
      "untuk membawanya menjadi syarikat yang berdiri sendiri.",
    ],
    humanSide: "Manusia",
    humanItems: ["Kehidupan seharian", "Pekerjaan", "Komuniti"],
    systemSide: "Sistem",
    systemItems: ["Mobiliti", "Prosedur pentadbiran"],
    fieldCaption: "Manusia — kehidupan seharian, pekerjaan, komuniti  /  Sistem — mobiliti, prosedur pentadbiran",
    fieldRelation: "Hubungan",

    whyEyebrow: "Masalah yang kami tangani",
    whyHeading: ["Kerumitan tidak dapat diselesaikan", "dengan usaha individu semata-mata."],
    whyBeats: [
      { no: "01", title: "“Saya tidak tahu” menghentikan orang di pintu masuk.", body: "Sistem yang wujud tetapi tidak dapat dicapai sama sahaja seperti tidak wujud." },
      { no: "02", title: "Jalan menuju pakar bertauliah terlalu jauh.", body: "Sebelum tiba pada titik yang benar-benar memerlukan pertimbangan manusia, ada jarak yang sepatutnya mampu digalas oleh sistem." },
      { no: "03", title: "Lapangan dan sistem tidak sejajar.", body: "Dalam bidang mobiliti, kebajikan dan pentadbiran awam, ada pilihan yang masih belum sampai kepada mereka yang berada di lapangan." },
    ],

    buildEyebrow: "Apa yang kami bina",
    buildHeading: ["Tiga bidang,", "sedang kami jalankan sekarang."],

    howEyebrow: "Cara kami membina",
    howHeading: ["Kami menggalas kerumitan itu", "dan mengubahnya menjadi sesuatu yang boleh digunakan."],
    howBeats: [
      { no: "01", title: "Bermula daripada bahasa di lapangan", body: "Kami tidak mereka bentuk bermula daripada teknologi. Kami bekerja secara berbalik daripada langkah sebenar orang yang sedang tersekat." },
      { no: "02", title: "Bertanggungjawab sehingga ia difahami", body: "Menyampaikan maklumat bukanlah penamatnya. Mengetahui apa yang perlu dilakukan seterusnya termasuk dalam skop reka bentuk kami." },
      { no: "03", title: "Menyatakan batasan dengan jelas", body: "Kami tidak masuk ke dalam bidang yang menjadi tanggungjawab pakar bertauliah. Apa yang kami galas dan di mana kami menyerahkannya kepada pakar ditulis di dalam produk itu sendiri." },
      { no: "04", title: "Menyebut hanya apa yang boleh disahkan", body: "Pencapaian, angka dan kerjasama hanya disenaraikan apabila ada buktinya. Apa yang tidak dapat disahkan tidak kami tulis." },
    ],
    howDisclose: "Apa maksud prinsip ini dalam amalan",

    founderEyebrow: "Wakil syarikat",
    founderHeading: ["Dibina oleh seseorang yang telah", "20 tahun berada dalam industri yang rumit."],
    founderTeaser: "Lebih 20 tahun dalam bidang automotif, mobiliti, pembuatan dan perniagaan antarabangsa, berdiri antara teknologi, pelaksanaan dan realiti komersial. Perkara yang sama berulang di situ: sistem yang tersusun baik terhenti sebelum sampai kepada orang yang memerlukannya.",
    founderRole: "Wakil Syarikat, Yorisou LLC",
    founderCta: "Tentang wakil syarikat",

    messageEyebrow: "Mesej",
    messageHeading: ["Kami menilai daripada sama ada ia sampai,", "bukan daripada sama ada ia canggih."],
    messageTeaser: "Apa yang kami tangani bukanlah kebaharuan. Sistem dan pilihan sudah pun wujud, tetapi terhenti sebelum sampai kepada orang yang memerlukannya. Kami sedang membina sebuah syarikat yang merapatkan jarak itu, satu langkah demi satu langkah.",
    messageCta: "Baca mesej penuh",

    originEyebrow: "Lokasi kami",
    originHeading: ["Bermula dari Fukuoka."],
    originBody: "Yorisou LLC sedang membina syarikat ini dari Bandar Fukuoka, Wilayah Fukuoka — sebuah tempat yang kehidupan seharian, pekerjaan dan komuniti berada berdekatan, dan reka bentuk boleh bermula daripada langkah yang benar-benar diambil di lapangan.",

    proofEyebrow: "Maklumat syarikat",
    proofHeading: ["Apa yang boleh kami nyatakan,", "dan hanya itu."],

    ctaEyebrow: "Hubungi kami",
    ctaHeading: ["Mungkin ada ruang", "untuk kita bekerjasama."],
    ctaBody: "Kami menerima pertanyaan tentang kerja kami, kemungkinan kerjasama dan permohonan media. Kami akan membalas satu demi satu mengikut kandungan pertanyaan.",
    ctaButton: "Ke halaman hubungi kami",

    /* CORP-v1.2 — lapisan Asterion dan lapisan penglibatan di halaman utama. */
    asterionEyebrow: "Asas bersama",
    asterionHeading: ["Setiap kali kami membina,", "asasnya menjadi lebih tebal."],
    asterionBody:
      "Asterion OS ialah platform teknologi dan pelaksanaan bersama yang berdiri sendiri, diletakkan dalam seni bina foundry Yorisou. Kerana asas bersama itu sudah ada, setiap usaha niaga boleh menumpukan tenaganya pada bahagian yang benar-benar miliknya sendiri.",
    asterionNote:
      "Setiap usaha niaga ditadbir urus secara berasingan, dan mengekalkan harta intelek, data serta tanggungjawab operasinya sendiri. Asterion bukan milik Yorisou.",
    engageEyebrow: "Bina bersama kami",
    engageHeading: ["Sertailah ketika ia masih", "dalam perjalanan menjadi sebuah syarikat."],
    engageBody:
      "Pengasas, penyelidik, pihak awam, syarikat. Tempat anda boleh masuk bergantung pada kedudukan anda. Kami bermula daripada apa yang boleh dibincangkan sekarang.",
    engageCta: "Lihat cara untuk terlibat",
  },

  mirai: {
    eyebrow: "Projek 01",
    heading: ["Platform untuk maklumat, pemadanan", "dan pembangunan perniagaan", "dalam sektor mobiliti Jepun."],
    stage: "Laman awam beroperasi / fungsi platform dalam pembangunan",
    lead: "Mirai Move bertujuan menghubungkan kerajaan dan pihak berkuasa tempatan, syarikat, tapak komuniti serta penjagaan dan kebajikan, pembekal luar negara dan rakan tempatan, supaya maklumat dan peluang berkaitan mobiliti dapat dikendalikan sebagai satu aliran. Kini laman maklumat awam sedang beroperasi, manakala fungsi platform masih berada pada peringkat pembangunan.",
    domain: "Sektor mobiliti Jepun",
    networkEyebrow: "Pihak yang dihubungkan",
    networkHeading: ["Pihak yang berdiri di kedudukan berbeza", "melihat peluang yang sama", "dengan bahasa yang berbeza."],
    centre: "Peluang mobiliti",
    parties: [
      { no: "01", title: "Kerajaan dan pihak berkuasa tempatan", body: "Pihak yang memegang peraturan dan bajet" },
      { no: "02", title: "Syarikat", body: "Pihak yang membekal dan melaksana" },
      { no: "03", title: "Tapak komuniti, penjagaan dan kebajikan", body: "Tempat pergerakan benar-benar berlaku" },
      { no: "04", title: "Pembekal luar negara dan rakan tempatan", body: "Pihak yang membawa masuk pilihan" },
    ],
    boundaryTitle: "Tentang status pembangunan",
    boundaryBody: "Platform itu sendiri masih dalam pembangunan. Pelaksanaan automatik oleh ejen autonomi tidak diaktifkan. Sebarang tindakan yang menjangkau ke luar sistem direka bentuk supaya memerlukan pengesahan manusia. Ia tidak ditawarkan sebagai platform yang lengkap dengan semua fungsi.",
    detail: [
      { heading: "Masalah yang ditangani", body: "Pilihan mobiliti wujud secara berasingan mengikut kawasan, mengikut skim dan mengikut pengendali. Orang yang memerlukannya dan pilihan yang sudah pun wujud tidak bertemu di tempat yang sama." },
      { heading: "Pihak yang kami hadapi", body: "Kerajaan dan pihak berkuasa tempatan, syarikat, tapak komuniti serta penjagaan dan kebajikan, pembekal luar negara dan rakan tempatan. Pihak yang berbeza kedudukan dan berbeza kriteria melihat peluang yang sama dengan bahasa yang berbeza." },
      { heading: "Apa yang beroperasi hari ini", body: "Laman maklumat awam sedang beroperasi. Fungsi maklumat, pemadanan dan pembangunan perniagaan sebagai sebuah platform berada pada peringkat pembinaan asas dan seni bina." },
    ],
    siteLabel: "Laman awam",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "Projek 02",
    heading: ["Sokongan pelbagai bahasa untuk prosedur", "dan dokumen, bagi mereka yang tinggal di Jepun", "dan yang ingin memulakan perniagaan di sini."],
    stage: "Dalam pembangunan (belum dibuka kepada umum)",
    lead: "Apabila bahasa Jepun dan pengetahuan khusus menjadi halangan, orang tidak dapat mencapai sistem yang sepatutnya boleh mereka gunakan. Kakari membantu memaparkan maklumat yang diperlukan, menyediakan dokumen, mengisi borang serta memandu langkah penyerahan dan penghantaran pos — dalam pelbagai bahasa. Ia kini berada pada peringkat pembangunan dan belum dibuka kepada umum.",
    domain: "Prosedur pentadbiran dan dokumen / pelbagai bahasa",
    procedureEyebrow: "Langkah yang disokong",
    procedureHeading: ["Daripada mencari tahu,", "sehingga menyerahkan."],
    steps: [
      { no: "01", title: "Mencari tahu", body: "Mengenal pasti prosedur mana yang berkaitan dengan diri anda" },
      { no: "02", title: "Mengumpul dokumen", body: "Menyenaraikan dokumen dan lampiran yang diperlukan" },
      { no: "03", title: "Menyediakan", body: "Mengisi borang dalam pelbagai bahasa dan menyemak kandungannya" },
      { no: "04", title: "Menyerahkan", body: "Memandu ke mana, dengan cara apa dan melalui proses pos yang mana untuk menyerahkannya" },
    ],
    boundaryTitle: "Bidang yang dikendalikan pakar bertauliah",
    boundaryBody: "Kami tidak bertindak sebagai wakil pakar bertauliah bagi pihak anda. Bidang yang memerlukan pertimbangan undang-undang, percukaian atau keputusan rasmi dinyatakan dengan jelas sebagai bidang yang dikendalikan oleh pakar bertauliah. Pertimbangan atau perwakilan yang memerlukan kelayakan berlesen — seperti peguam, akauntan cukai atau penulis pentadbiran berlesen (gyoseishoshi) — tidak termasuk dalam fungsi Kakari.",
    detail: [
      { heading: "Masalah yang ditangani", body: "Cara melaksanakan sesuatu prosedur adalah maklumat awam. Walaupun begitu, ada orang yang tidak dapat mencapai sistem itu semata-mata kerana bahasa dan pengetahuan asas yang diandaikan tidak ada pada mereka. Ini bukan soal kemampuan diri mereka." },
      { heading: "Pihak yang kami hadapi", body: "Mereka yang tinggal di Jepun, dan mereka yang bakal memulakan perniagaan di sini — orang yang berada dalam keadaan sukar untuk menguruskan prosedur dalam bahasa Jepun seorang diri." },
      { heading: "Apa yang beroperasi hari ini", body: "Asas pengesahan identiti telah dibina dalam persekitaran pengesahan yang berasingan, dan kebenaran akses serta storan sedang diuji pada peringkat ini. Integrasi luaran kekal dinyahaktifkan dan ia belum dibuka kepada umum." },
    ],
  },

  about: {
    eyebrow: "Tentang Kami",
    heading: ["Cara kami membina,", "itulah janji kami."],
    lead: "Yorisou meneliti kerumitan dalam kehidupan seharian, pekerjaan dan komuniti setempat, serta membina produk yang membantu orang memahaminya, memilih dan melangkah ke hadapan.",
    whyHeading: ["Mengapa syarikat ini wujud."],
    whyBody: [
      "Sistem, teknologi dan pilihan sudah pun wujud dalam jumlah yang banyak. Namun semuanya masih terhenti sebelum sampai kepada orang yang memerlukannya. Jarak terakhir itulah yang kami hadapi.",
      "Jarak ini sering diperkatakan sebagai soal usaha atau jumlah maklumat yang ada pada individu. Hakikatnya, kerumitan yang sepatutnya boleh digalas oleh sistem sering kali diserahkan begitu sahaja kepada individu.",
    ],
    thinkHeading: ["Bagaimana kami berfikir."],
    thinkBody: [
      "Kami tidak mereka bentuk bermula daripada teknologi. Kami bermula dengan meleraikan satu langkah yang sedang tersekat: membaca keadaan seseorang, menyusunnya sebagai satu set hubungan, dan membawanya sehingga langkah seterusnya menjadi jelas. Setakat itulah skop reka bentuk kami.",
      "AI kami gunakan untuk pemahaman dan penyusunan itu, bukan untuk mengambil alih keputusan. Peranannya ialah menyusun bahan yang diperlukan seseorang untuk membuat keputusan ke dalam bentuk yang boleh digunakan.",
    ],
    buildHeading: ["Bagaimana kami membina."],
    principles: [
      { no: "01", title: "Bermula daripada bahasa di lapangan", body: "Kami tidak mereka bentuk bermula daripada teknologi. Kami bekerja secara berbalik daripada langkah sebenar orang yang sedang tersekat." },
      { no: "02", title: "Bertanggungjawab sehingga ia difahami", body: "Menyampaikan maklumat bukanlah penamatnya. Mengetahui apa yang perlu dilakukan seterusnya termasuk dalam skop reka bentuk kami." },
      { no: "03", title: "Menyatakan batasan dengan jelas", body: "Kami tidak masuk ke dalam bidang yang menjadi tanggungjawab pakar bertauliah. Apa yang kami galas dan di mana kami menyerahkannya kepada pakar ditulis di dalam produk itu sendiri." },
      { no: "04", title: "Menyebut hanya apa yang boleh disahkan", body: "Pencapaian, angka dan kerjasama hanya disenaraikan apabila ada buktinya. Apa yang tidak dapat disahkan tidak kami tulis." },
    ],
    principlesLong: [
      { no: "01", title: "Bermula daripada bahasa di lapangan", long: "Tiada sistem yang sampai kepada sesiapa selagi ia belum diterjemahkan kepada langkah yang benar-benar diambil oleh penggunanya. Kami bermula daripada permohonan sebenar, pergerakan sebenar dan urusan sebenar — bukan daripada rumusan masalah yang abstrak, tetapi daripada satu langkah yang sedang tersekat di hadapan mata." },
      { no: "02", title: "Bertanggungjawab sehingga ia difahami", long: "Menyenaraikan hasil carian bukanlah sokongan. Apa yang seseorang perlukan ialah mengetahui apa yang perlu dilakukan olehnya sekarang. Skop produk kami berterusan sehingga langkah seterusnya benar-benar difahami, bukan sekadar sehingga maklumat dipaparkan." },
      { no: "03", title: "Menyatakan batasan dengan jelas", long: "Membiarkan seseorang menggunakan produk tanpa kejelasan tentang apa yang tidak mampu dilakukannya ialah reka bentuk yang paling berbahaya. Apa yang kami galas dan di mana pakar bertauliah mengambil alih ditulis pada skrin produk itu sendiri. Batasan ialah sebahagian daripada fungsi, bukan sekadar nota penafian." },
      { no: "04", title: "Menyebut hanya apa yang boleh disahkan", long: "Kami tidak memperkatakan pencapaian yang tidak dapat disahkan atau fungsi yang belum beroperasi. Setiap fakta yang kami siarkan mempunyai rekod yang menyokongnya. Pada tempoh yang sedikit sahaja boleh kami tulis, sedikit itulah yang kami siarkan." },
    ],
    orderHeading: ["Satu demi satu,", "sehingga tuntas."],
    orderBody: "Kami tidak memulakan banyak perkara serentak. Kami mengutamakan satu bidang dibina sehingga benar-benar sampai kepada langkah yang diambil orang di lapangan.",
    claimsHeading: ["Kami tidak menulis", "apa yang tidak dapat kami sahkan."],
    claimsBody: "Setiap fakta yang kami siarkan mempunyai rekod yang menyokongnya. Pada tempoh yang sedikit sahaja boleh kami tulis, sedikit itulah yang kami siarkan.",
  },

  company: {
    eyebrow: "Maklumat Syarikat",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC ialah sebuah syarikat yang membina produk untuk mengubah kerumitan dalam kehidupan seharian, pekerjaan dan komuniti setempat menjadi sesuatu yang boleh difahami, dipilih dan ditindaklanjuti oleh seseorang. Berpangkalan di Fukuoka, kami sedang menjalankan dua projek: Mirai Move dan Kakari.",

    messageEyebrow: "Mesej wakil syarikat",
    messageHeading: ["Kami menilai daripada sama ada ia sampai,", "bukan daripada sama ada ia canggih."],
    message: [
      "Apa yang kami tangani bukanlah kebaharuan.",
      "Selama lebih 20 tahun, dalam bidang automotif, mobiliti dan pembuatan, saya berdiri antara teknologi, pelaksanaan dan realiti komersial. Perkara yang sama berulang di situ: sistem yang tersusun baik terhenti sebelum sampai kepada orang yang memerlukannya. Bukan kerana teknologinya kurang, tetapi kerana ia tidak pernah diterjemahkan kepada langkah yang benar-benar diambil oleh orang itu.",
      "Sistem dan pilihan sudah pun wujud dalam jumlah yang banyak. Namun jika seseorang tidak dapat menentukan sama ada ia berkaitan dengan dirinya, atau apa yang perlu dilakukan seterusnya, ia sama sahaja seperti tidak wujud. Merapatkan jarak terakhir ini, dengan sistem yang menggalasnya dan bukan individu — itulah sebabnya Yorisou ditubuhkan.",
      "Kami tidak menggunakan AI untuk mengambil alih keputusan. Kami menggunakannya untuk membaca keadaan, menyusunnya sebagai hubungan, dan menjadikannya bentuk yang boleh digunakan supaya seseorang dapat membuat keputusan. Pertimbangan dan tanggungjawab kekal pada manusia. Apa yang kami galas dan di mana kami menyerahkannya kepada pakar bertauliah ditulis pada skrin produk itu sendiri. Itulah reka bentuk kami.",
      "Sebagai sebuah syarikat kami masih kecil, dan tidak banyak yang boleh kami tulis. Justeru itulah kami hanya menulis apa yang dapat kami sahkan. Yang patut bertambah bukanlah dakwaan, tetapi rekod tentang apa yang benar-benar sampai.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Wakil Syarikat, Yorisou LLC",

    profileEyebrow: "Wakil syarikat",
    profileHeading: ["Tentang wakil syarikat"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Wakil Syarikat, Yorisou LLC",
    profileBody: [
      "Lebih 20 tahun pengalaman kerja dalam bidang automotif, mobiliti, pembuatan, pembangunan projek industri, rantaian bekalan, pembangunan komersial dan pembangunan produk, serta perniagaan antarabangsa merentas sempadan.",
    ],
    profileBackgroundLabel: "Latar belakang",
    profileBackground: [
      "Memegang tanggungjawab kanan bagi projek komersial dan industri di Ficosa, sebuah pembekal komponen automotif antarabangsa, termasuk kerja berkaitan projek industri global dan aktiviti komersial di rantau Asia.",
      "Seterusnya menubuhkan dan mengendalikan perniagaan teknologi dan pembuatan di China, termasuk kerja yang melibatkan elektronik automotif, sistem kawalan, pembuatan jitu serta pembangunan produk dan sistem yang menggunakan AI.",
      "Berpengalaman mengendalikan perniagaan antarabangsa di beberapa pasaran, termasuk Eropah, China dan Jepun.",
      "Kini bertugas sebagai wakil syarikat Yorisou LLC di Jepun dan membina syarikat ini dari Fukuoka.",
    ],
    profileEducationLabel: "Pendidikan",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Mengapa latar belakang ini berkait dengan Yorisou",
    profileRelevance: [
      "Pengalaman kerja yang panjang merentas industri sebenar yang rumit.",
      "Berdiri di titik pertemuan antara teknologi, pembuatan, pelaksanaan komersial dan pasaran antarabangsa.",
      "Melihat sendiri jurang antara sistem atau teknologi dan apa yang benar-benar boleh digunakan oleh seseorang atau sesebuah organisasi.",
      "Daripada itu lahirlah keputusan untuk membina produk yang mengubah kerumitan menjadi sesuatu yang boleh difahami dan ditindaklanjuti.",
    ],

    overviewEyebrow: "Gambaran syarikat",
    overviewHeading: ["Gambaran syarikat"],
    facts: [
      { label: "Nama syarikat", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Wakil syarikat", value: "Jin Yang" },
      { label: "Lokasi", value: "Bandar Fukuoka, Wilayah Fukuoka, Jepun" },
      { label: "Bidang perniagaan", value: "Perancangan, pembangunan dan pengendalian Mirai Move dan Kakari" },
    ],

    businessEyebrow: "Bidang perniagaan",
    businessHeading: ["Bidang perniagaan"],
    businessBody: "Maklumat, pemadanan dan pembangunan perniagaan dalam sektor mobiliti; serta sokongan pelbagai bahasa untuk prosedur pentadbiran dan dokumen bagi mereka yang tinggal di Jepun dan yang ingin memulakan perniagaan di sini. Kedua-duanya dijalankan mengikut prinsip yang sama: menggalas kerumitan dan mengembalikannya dalam bentuk yang boleh digunakan.",

    projectsEyebrow: "Projek",
    projectsHeading: ["Apa yang sedang kami jalankan"],

    originEyebrow: "Lokasi kami",
    originHeading: ["Bermula dari Fukuoka."],
    originBody: [
      "Yorisou LLC sedang membina syarikat ini dari Bandar Fukuoka, Wilayah Fukuoka.",
      "Di tempat yang kehidupan seharian, pekerjaan dan komuniti berada berdekatan, kami memulakan reka bentuk daripada langkah yang benar-benar diambil di lapangan.",
    ],

    ctaHeading: ["Hubungi Kami"],
    ctaBody: "Kami menerima pertanyaan tentang kerja kami, kemungkinan kerjasama dan permohonan media.",
  },

  contact: {
    eyebrow: "Hubungi Kami",
    heading: ["Hubungi Kami"],
    lead: "Kami menerima pertanyaan tentang kerja kami, kemungkinan kerjasama dan permohonan media. Kami akan membalas satu demi satu mengikut kandungan pertanyaan.",
    channelsHeading: ["Jenis pertanyaan"],
    channels: [
      { title: "Pertanyaan umum", body: "Soalan tentang Yorisou sebagai sebuah syarikat dan projek yang sedang kami jalankan." },
      { title: "Perniagaan dan kerjasama", body: "Perbincangan kerjasama atau urus niaga dalam bidang mobiliti atau prosedur pentadbiran." },
      { title: "Media dan liputan", body: "Permohonan temu bual dan pertanyaan tentang syarikat atau wakil syarikatnya." },
    ],
    formHeading: ["Hantar melalui borang"],
    formIntro: "Sila gunakan borang di bawah. Setiap pertanyaan akan disemak oleh pihak kami dan dibalas satu demi satu.",
    fields: {
      name: "Nama", namePlaceholder: "Nama anda",
      email: "Alamat e-mel", emailPlaceholder: "you@example.com",
      org: "Nama syarikat atau organisasi", orgPlaceholder: "Pilihan",
      type: "Jenis pertanyaan",
      message: "Kandungan pertanyaan", messagePlaceholder: "Sila tuliskan latar belakang pertanyaan anda dan perkara yang ingin anda sahkan.",
    },
    types: [
      { value: "general", label: "Pertanyaan umum" },
      { value: "business", label: "Perniagaan dan kerjasama" },
      { value: "media", label: "Media dan liputan" },
    ],
    submit: "Hantar",
    sending: "Menghantar…",
    successTitle: "Mesej telah dihantar",
    successBody: "Kami telah menerima pertanyaan anda. Kami akan menyemaknya dan membalas satu demi satu.",
    errorTitle: "Tidak dapat dihantar",
    errorBody: "Sila tunggu sebentar dan cuba lagi.",
    required: "Wajib",
    privacyNote: "Maklumat peribadi yang anda berikan hanya digunakan untuk tujuan membalas pertanyaan anda.",
  },

  /* ── INDEKS USAHA NIAGA (CORP-v1.2) ─────────────────────────────────── */
  ventures: {
    eyebrow: "Usaha niaga semasa",
    heading: ["Tiga bidang,", "masing-masing belum lagi menjadi syarikat."],
    lead:
      "Dalam setiap satunya, peraturan dan sistemnya sudah pun wujud — dan terhenti tepat sebelum sampai kepada orang yang memerlukannya. Yorisou masuk ke dalam jurang itu dan membentuknya sambil terus mengesahkan.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Menghubungkan maklumat, pemadanan dan pembangunan perniagaan dalam sektor mobiliti.",
        problem: "Maklumat dan peluang terpisah antara pengendali, kawasan dan pihak berkuasa.",
        building: "Platform tempat pihak di dalam dan di luar Jepun boleh berbincang atas maklumat yang sama.",
        status: "Dalam pembangunan dan pengendalian. Laman awam sudah beroperasi.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Menyokong prosedur bagi mereka yang tinggal di Jepun dan yang memulakan perniagaan di sini, dalam pelbagai bahasa.",
        problem: "Sistemnya wujud, tetapi halangan bahasa dan susunan langkah menyebabkan ia tidak pernah digunakan.",
        building: "Cara memecahkan sesuatu prosedur kepada peringkat, dan menunjukkan sejauh mana seseorang boleh melakukannya sendiri.",
        status: "Dalam pembangunan. Sedang bersiap untuk dibuka.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Menjadikan sesuatu tempat dapat difahami melalui lokasi dan konteks.",
        problem: "Maklumat yang paling berguna di sesuatu tempat itulah yang paling sukar ditemui.",
        building: "Cara meneroka kawasan kediaman sendiri, berpandukan lokasi dan konteks.",
        status: "Peringkat konsep. Belum diuji.",
      },
    ],
    noteHeading: ["Apa yang halaman ini nyatakan,", "dan apa yang tidak."],
    noteBody: [
      "Inilah usaha niaga dan gagasan yang sedang Yorisou jalankan sekarang.",
      "Ia bukan anak syarikat yang diperbadankan, bukan pelaburan dan bukan pelanggan. Peringkatnya berbeza-beza, dan kami menulis peringkat itu sebagaimana adanya.",
      "Matlamatnya ialah setiap satu dapat berdiri sendiri sebagai sebuah syarikat. Belum ada satu pun yang sampai ke tahap itu.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    eyebrow: "Usaha niaga",
    heading: ["Memahami sesuatu tempat,", "dari dalam tempat itu sendiri."],
    stage: "Peringkat konsep",
    lead:
      "Satu gagasan: menggunakan lokasi dan konteks untuk memaparkan apa yang benar-benar berguna di sesuatu tempat. Ia masih berada sebelum peringkat pengujian.",
    domain: "Kawasan kediaman / lokasi dan konteks / penerokaan",
    conceptEyebrow: "Apa yang kami fikirkan",
    conceptHeading: ["Maklumatnya ada.", "Ia cuma tidak sampai."],
    conceptBody: [
      "Perkara yang paling ingin anda ketahui tentang sesuatu tempat itulah yang paling lemah dikembalikan oleh carian. Bukan kerana maklumatnya tiada, tetapi kerana ia tidak pernah disusun mengikut tempat dan keadaan.",
      "Di mana anda berada, bila waktunya, dan keadaan apa yang sedang anda hadapi. Ada maklumat yang hanya terasa berkaitan dengan diri anda apabila ketiga-tiganya bertemu. Di situlah Chigamo cuba bekerja.",
    ],
    boundaryTitle: "Kedudukannya sekarang",
    boundaryBody:
      "Chigamo berada pada peringkat konsep. Tiada produk yang dibuka kepada umum, tiada pengguna, dan tiada program bersama mana-mana pihak berkuasa tempatan. Apa yang tertulis di sini ialah hipotesis yang ingin kami uji.",
    detail: [
      {
        heading: "Mengapa sekarang",
        body: "Peta dan carian kedua-duanya sudah matang. Walaupun begitu, “apa yang bermakna bagi saya, di tempat saya berdiri sekarang” masih perlu dicari sendiri oleh orang.",
      },
      {
        heading: "Apa yang perlu kami sahkan",
        body: "Sama ada penapisan mengikut lokasi dan konteks benar-benar menjadikan maklumat itu boleh digunakan. Itulah yang ingin kami uji dahulu, dalam skala kecil.",
      },
    ],
  },

  /* ── CARA KAMI MEMBINA / FOUNDRY (CORP-v1.2) ────────────────────────── */
  foundry: {
    eyebrow: "Cara kami membina",
    heading: ["Daripada masalah kepada syarikat,", "mengikut urutannya."],
    lead:
      "Kami tidak bermula daripada idea yang kami gemari. Kami mencari masalah yang bersifat struktur, mengesahkannya, mereka bentuknya sebagai perniagaan, bekerjasama dengan orang yang mampu mengendalikannya, dan membawanya menjadi syarikat yang berdiri sendiri. Susunan itulah yang Yorisou sebut sebagai foundry.",
    stagesEyebrow: "Peringkat",
    stagesHeading: ["Lapan peringkat,", "tiada satu pun yang dilangkau."],
    stages: [
      { no: "01", name: "Hipotesis", body: "Menetapkan di mana masalah struktur itu berada — daripada bentuk kerja sebenar di lapangan, bukan daripada tekaan." },
      { no: "02", name: "Bukti", body: "Menyemak sama ada masalah itu benar-benar wujud dan siapa yang menanggungnya. Banyak hipotesis mati di sini." },
      { no: "03", name: "Reka bentuk usaha niaga", body: "Menjadikan jawapannya sebuah perniagaan: siapa yang menggunakannya, dan di mana nilai benar-benar bertukar tangan." },
      { no: "04", name: "Pembinaan", body: "Membinanya. Menggunakan asas bersama di tempat yang sudah ada, dan menumpukan tenaga pada bahagian yang khusus bagi usaha niaga ini." },
      { no: "05", name: "Sedia sebagai usaha niaga", body: "Menyiapkan aset dan prosedurnya sehingga orang dari luar boleh mengambil alih dan mengendalikannya." },
      { no: "06", name: "Pembentukan pasukan pengasas", body: "Bekerjasama dengan orang yang mampu memikulnya sebagai milik sendiri — sebagai pengasas, bukan sebagai pekerja." },
      { no: "07", name: "Berdikari dan beroperasi", body: "Mengendalikannya sebagai syarikat yang berdiri sendiri, dibentuk supaya ia tidak kekal bergantung pada Yorisou." },
      { no: "08", name: "Pembelajaran", body: "Menyimpan apa yang berhasil dan apa yang mati sebagai bahan untuk usaha niaga seterusnya." },
    ],
    independenceHeading: ["Matlamatnya ialah sebuah syarikat", "yang berdiri sendiri."],
    independenceBody: [
      "Tujuan foundry ini bukan untuk menambah bilangan perkara di bawah Yorisou, tetapi untuk membawa setiap usaha niaga ke tahap ia boleh berdiri sendiri sebagai sebuah syarikat.",
      "Kerana itu ia dibina supaya boleh diserahkan sejak awal lagi. Jika orang yang mengendalikannya tidak memegang keputusan yang sebenar, ia belum menjadi sebuah syarikat.",
    ],
    asterionEyebrow: "Teknologi dan pelaksanaan bersama",
    asterionHeading: ["Jangan bina", "perkara yang sama dua kali."],
    asterionBody: [
      "Asterion OS ialah platform teknologi dan pelaksanaan bersama yang berdiri sendiri, diletakkan dalam seni bina foundry Yorisou. Ia bukan milik Yorisou.",
      "Kerana asas bersama itu ada, tiada usaha niaga yang perlu membinanya semula, dan setiap satu boleh menumpukan perhatian pada bidangnya sendiri. Keupayaan yang terkumpul menjadi titik permulaan bagi usaha niaga seterusnya.",
    ],
    asterionBoundaryTitle: "Batasannya",
    asterionBoundaryBody:
      "Setiap usaha niaga ditadbir urus secara berasingan. Harta intelek, data dan tanggungjawab operasi adalah milik usaha niaga itu sendiri. Tiada apa-apa yang direka bentuk supaya data usaha niaga atau data pengguna mengalir secara automatik ke platform.",
    economicsHeading: ["Pemilikan mengikut", "sumbangan dan tanggungjawab."],
    economicsBody: [
      "Syaratnya berbeza mengikut usaha niaga. Kami tidak mengenakan satu formula yang tetap kepada semuanya.",
      "Hanya prinsipnya yang sama: pemilikan mengikut sumbangan, risiko yang dipikul dan tanggungjawab yang berterusan. Orang yang mengendalikan sesuatu usaha niaga memegang kuasa membuat keputusan yang sebenar.",
      "Butiran khususnya dibincangkan mengikut usaha niaga dan mengikut orangnya. Ia bukan perkara yang sesuai diletakkan di laman web.",
    ],
    maturityTitle: "Kedudukannya sekarang",
    maturityBody:
      "Cara bekerja ini bukanlah kaedah yang terbukti dan boleh diulang. Yorisou masih di peringkat awal, dan belum pernah membawa mana-mana usaha niaga keluar sebagai syarikat yang berdiri sendiri. Apa yang tertulis di sini ialah cara kami benar-benar bekerja — bukan dakwaan tentang hasil.",
  },

  /* ── BINA BERSAMA KAMI (CORP-v1.2) ──────────────────────────────────── */
  buildWithUs: {
    eyebrow: "Bina bersama kami",
    heading: ["Pintu masuk anda", "bergantung pada kedudukan anda."],
    lead:
      "Buat masa ini kami bermula daripada apa sahaja yang boleh dibincangkan. Tiada saluran kemasukan yang tetap. Jika ia menarik minat anda, ceritakan apa yang ada dalam fikiran anda.",
    lanes: [
      {
        key: "founders",
        title: "Pengasas dan pengendali",
        body:
          "Yorisou membina usaha niaga sehingga ke titik sebelum ia menjadi sebuah syarikat, dan mencari orang yang mampu memikul salah satunya sebagai milik sendiri. Ini peranan sebagai pengasas, bukan pekerjaan yang diserahkan kepada seseorang.",
        invites: [
          "Anda pernah benar-benar mengendalikan sesuatu yang mempunyai operasi sebenar di belakangnya",
          "Anda mampu melangkah ke hadapan sedangkan banyak perkara masih belum diputuskan",
          "Anda mempunyai kefahaman mendalam dalam salah satu bidang: teknologi, pembuatan, pentadbiran awam atau kerja di peringkat komuniti",
        ],
        cta: "Nyatakan minat anda",
      },
      {
        key: "research",
        title: "Universiti dan penyelidikan",
        body:
          "Mengubah hasil penyelidikan menjadi sesuatu yang boleh digunakan masyarakat memerlukan reka bentuk perniagaan di sisinya. Kami sedang mencari orang untuk berfikir bersama tentang pembangunan pengasas dan pelaksanaan penyelidikan.",
        invites: [
          "Anda sedang mencari tempat untuk hasil penyelidikan diterapkan",
          "Anda mahu pelajar dan penyelidik mendapat pengalaman sebenar sebagai pengasas",
          "Anda lebih suka bermula daripada penerokaan bersama",
        ],
        cta: "Mulakan perbualan",
      },
      {
        key: "public",
        title: "Kerajaan dan sektor awam",
        body:
          "Masalah awam sering kali sudah mempunyai peraturannya, tetapi tidak pernah diterjemahkan kepada langkah yang boleh diikuti oleh penduduk. Kami ingin mereka bentuk ujian kecilnya, cara mengukur kesannya, dan jalan ke arah sesuatu yang berkekalan.",
        invites: [
          "Anda mempunyai masalah yang boleh dicuba di lapangan",
          "Anda mahu ia dalam bentuk yang kesannya boleh diukur",
          "Anda tidak mahu ia berakhir sebagai projek perintis sekali sahaja",
        ],
        cta: "Hubungi kami",
      },
      {
        key: "corporate",
        title: "Syarikat",
        body:
          "Jika ada masalah dalam operasi anda sendiri yang sepatutnya menjadi sebuah perniagaan. Kami boleh bermula daripada pembangunan bersama atau ujian di lapangan.",
        invites: [
          "Ada masalah operasi yang belum selesai dalam kerja anda",
          "Anda sedang mencari bentuk perniagaan yang baharu",
          "Anda sedang mencari rakan pembangunan",
        ],
        cta: "Kemukakan pertanyaan",
      },
    ],
    intakeTitle: "Tentang kemasukan",
    intakeBody:
      "Buat masa ini tiada proses permohonan dan tiada program pemilihan. Apa yang ada di sini ialah jemputan — bukan kerjasama yang sedang berjalan dan bukan jawatan yang dibuka. Kami bermula dengan mendengar apa yang ada pada anda, dan sama ada ada sesuatu untuk dibincangkan.",
    ctaHeading: ["Siapa pun anda,", "pintu masuknya sama."],
    ctaBody: "Tuliskan apa yang ada dalam fikiran anda dan hantarkannya. Kami membacanya satu demi satu.",
  },
};
