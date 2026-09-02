import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — TURKISH. Translated from the Japanese canonical source (ja.ts), with en.ts used only
 * as a structural reference.
 *
 * This is an adapted sibling, not a literal rendering: it is written to read as natural corporate
 * Turkish. It may never be stronger than the Japanese. No customer, partner, metric, revenue,
 * funding, market-position, team-size or capability claim appears here that the Japanese does not
 * already make.
 *
 * On the company form: the company is a Japanese LLC (godo kaisha). It is rendered as
 * "Yorisou LLC" and the representative as "Temsilci Ortak". A joint-stock-company term
 * (anonim sirket) or a corporate-CEO title must never be used here.
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 */
export const tr: SiteCopy = {
  chrome: {
    skip: "İçeriğe geç",
    menu: "Menü",
    menuToggle: "Menüyü aç ve kapat",
    close: "Kapat",
    navLabel: "Site gezinmesi",
    navLabelMobile: "Site gezinmesi (mobil)",
    langLabel: "Görüntüleme dili",
    langHeading: "Bir dil seçin",
    langSearch: "Dil ara",
    langCurrent: "Geçerli dil",
    previewBadge: "Önizleme — yayımlanmadı",
    nav: { home: "Ana sayfa", miraiMove: "Mirai Move", kakari: "Kakari", about: "Hakkımızda", company: "Şirket", contact: "İletişim" },
    footerTagline: "İnsan ve teknoloji geleceği kurar.",
    footerProjects: "Projeler",
    footerCompany: "Şirket",
    footerLegalNote: "Burada yer alan her bilgi, doğrulayabildiğimiz bir kayda dayanır.",
    backToTop: "Başa dön",
  },

  meta: {
    home: { title: "Yorisou LLC — Yapısal sorunları, girişime dönüştürüyoruz.", description: "Yorisou LLC bir girişim foundry’si olarak çalışır: yapısal sorunları bulur, kanıtı ve girişimin varlıklarını üretir, onu işletebilecek kişilerle bir araya gelerek girişimi ayağa kaldırır. Mirai Move ve Kakari yapım aşamasında; Chigamo fikir aşamasında." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Japonya’nın mobilite alanında bilgi, eşleştirme ve iş geliştirme için bir platform. Kamuya açık site yayında; platform özellikleri geliştirme aşamasında." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Japonya’da yaşayanlar ve burada iş kurmak isteyenler için idari işlemler ve belgeler konusunda çok dilli destek. Geliştirme aşamasında, henüz genel kullanıma açık değil." },
    about: { title: "Nasıl kuruyoruz — Yorisou LLC", description: "Sorunu bul, doğrula, iş olarak tasarla, kurucu ekiple bir araya gel ve girişimi ayağa kaldır. Yorisou’nun foundry işleyişi, bir girişimin alabileceği biçimler ve ortak altyapının bu yapı içindeki yeri." },
    company: { title: "Şirket — Yorisou LLC", description: "Yorisou LLC’nin şirket künyesi, temsilci profili, temsilcinin mesajı ve faaliyet alanları." },
    contact: { title: "İletişim — Yorisou LLC", description: "Çalışmalarımız, iş birlikleri ve basın ile ilgili iletişim." },
    ventures: { title: "Girişimler — Yorisou LLC", description: "Yorisou’nun bugün üzerinde çalıştığı girişimler ve tasarılar: Mirai Move, Kakari ve Chigamo. Her birinin aşamasını olduğu gibi yazıyoruz." },
    buildWithUs: { title: "Birlikte kurmak — Yorisou LLC", description: "Kurucular, araştırmacılar, kamu ekipleri ve şirketler için giriş yolları. Açık bir başvuru programı yok; konuşabildiğimiz yerden başlıyoruz." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Bir yerde gerçekten işe yarayanı konum ve bağlamdan yola çıkarak bulunabilir kılma tasarısı. Tasarı aşamasında; yayımlanmış bir ürün yok." },
  },

  common: {
    buildingLabel: "yapım aşamasında",
    conceptLabel: "fikir aşamasında",
    readMore: (name) => `${name} hakkında daha fazlası`,
    backHome: "Şirket sayfasına dön",
    stageLabel: "Mevcut aşama",
    boundaryLabel: "Üstlenmediğimiz alan",
    nowLabel: "Şu an",
    nextLabel: "Sonraki adım",
    whoLabel: "Kimlerle konuşmak istiyoruz",
  },

  home: {
    eyebrow: "Yorisou LLC",
    hook: ["Yapısal sorunları,", "şirkete dönüştürüyoruz."],
    thesis: ["Yapısal sorunlardan,", "girişimler kuruyor,", "büyütmeyi sürdürüyoruz."],
    lead: [
      "Yorisou bir foundry: toplumdaki yapısal sorunları buluyor, doğruluyor, iş olarak tasarlıyor,",
      "onları işletecek kişilerle bir araya gelip birer girişim olarak ayağa kaldırıyoruz.",
    ],
    humanSide: "İnsan",
    humanItems: ["Günlük yaşam", "İş", "Yerel topluluk"],
    systemSide: "Sistemler",
    systemItems: ["Mobilite", "İdari işlemler"],
    fieldCaption: "İnsan — günlük yaşam, iş, yerel topluluk  /  Sistemler — mobilite, idari işlemler",
    fieldRelation: "İlişkiler",

    whyEyebrow: "Üzerinde çalıştığımız sorunlar",
    whyHeading: ["Karmaşıklık, yalnızca bireysel", "çabayla çözülmez."],
    whyBeats: [
      { no: "01", title: "“Bilmiyorum”, insanları daha kapıda durduruyor.", body: "Var olan ama ulaşılamayan bir sistem, hiç olmayanla aynıdır." },
      { no: "02", title: "Uzmana giden yol uzun.", body: "İnsan kararının gerçekten gerektiği noktadan önce, sistemin üstlenebileceği bir mesafe var." },
      { no: "03", title: "Saha ile sistem birbirine oturmuyor.", body: "Ulaşım, sosyal hizmet ve kamu yönetimi sahasında henüz yerine ulaşmamış seçenekler var." },
    ],

    buildHeading: ["Sistemin ulaşmadığı alanlar —", "birer birer ele alıyoruz."],

    howEyebrow: "Nasıl geliştiriyoruz",
    howHeading: ["Karmaşıklığı üstlenip", "kullanılabilir bir biçime getiriyoruz."],
    howBeats: [
      { no: "01", title: "Sahanın dilinden başlarız", body: "Tasarıma teknolojiden başlamayız. Gerçekten tıkanmış birinin izlediği adımlardan geriye doğru çalışırız." },
      { no: "02", title: "Anlaşılır olana kadar sorumluluk alırız", body: "Bilgiyi sunmak son nokta değildir. Bundan sonra ne yapılacağının anlaşılması da tasarımın kapsamındadır." },
      { no: "03", title: "Sınırı açıkça belirtiriz", body: "Yetkili bir meslek mensubuna ait işlere girmeyiz. Neyi üstlendiğimiz ve nereden itibaren devrettiğimiz, ürünün içine yazılıdır." },
      { no: "04", title: "Yalnızca doğrulanabilir olanı söyleriz", body: "Sonuçlar, rakamlar ve iş birlikleri yalnızca kanıtı olduğunda yer alır. Doğrulanamayan hiçbir şey yazılmaz." },
    ],

    founderEyebrow: "Temsilci",
    founderHeading: ["Karmaşık sahaları yirmi yıl boyunca", "içeriden görmüş biri kuruyor."],
    founderTeaser: "Otomotiv, mobilite, üretim ve uluslararası iş sahalarında yirmi yılı aşkın süre; teknoloji, uygulama ve ticari akışın tam arasında durmak. Orada tekrar tekrar görülen şey, iyi kurulmuş bir sistemin ona ihtiyaç duyan kişiye ulaşmadan durmasıydı.",
    founderRole: "Yorisou LLC Temsilci Ortağı",
    founderCta: "Temsilci hakkında",

    messageEyebrow: "Mesaj",
    messageHeading: ["Ölçümüz teknolojinin ileriliği değil,", "ulaşıp ulaşmadığıdır."],
    messageTeaser: "Ele aldığımız şey yenilik değil. Sistemler ve seçenekler zaten var; yalnızca onlara ihtiyaç duyan insanlara ulaşmadan duruyorlar. Bu mesafeyi adım adım kapatan bir şirket kuruyoruz.",
    messageCta: "Mesajın tamamını okuyun",

    originEyebrow: "Bulunduğumuz yer",
    originHeading: ["Fukuoka’dan başlıyoruz."],
    originBody: "Yorisou LLC, şirketi Japonya’nın Fukuoka şehrinden kuruyor: günlük yaşamın, işin ve yerel topluluğun birbirine yakın durduğu, tasarımın insanların gerçekten attığı adımlardan başlayabildiği bir yer.",

    proofEyebrow: "Şirket",
    proofHeading: ["Söyleyebileceğimiz kadarı,", "yalnızca o kadarı."],

    ctaEyebrow: "İletişim",
    ctaHeading: ["Birlikte çalışabileceğimiz", "bir alan olabilir."],
    ctaBody: "Çalışmalarımıza ilişkin sorular, olası iş birlikleri ve basın talepleri için yazabilirsiniz. İçeriğine göre sırayla yanıt veriyoruz.",
    ctaButton: "İletişime geçin",

    /* CORP-v1.2 — Asterion layer and engagement layer on the homepage. */
    asterionEyebrow: "Ortak altyapı",
    asterionBody:
      "Asterion OS, bağımsız bir teknoloji platformu projesidir. Aynı yapıyı defalarca yeniden kurmak gerekmediği için her girişim kendi alanına yoğunlaşabiliyor.",
    asterionNote:
      "Her girişim ayrı yönetilir. Fikrî mülkiyetin, verinin ve işletme sorumluluğunun kime ait olduğu ve Asterion’a ilişkin haklar, her durumda geçerli olan sözleşmelere göre belirlenir.",
    /* CORP-v1.4 — how Yorisou stays involved in what it builds. Conditional, never promised. */
    portfolioEyebrow: "Girişimlerle ilişkimiz",
    portfolioHeading: ["Bir girişimi kurmak,", "işin sonu değil."],
    portfolioBody:
      "Yorisou, bir girişim ayağa kalktıktan sonra da onun uzun vadeli değerine bağlı kalabilir: pay sahipliğini sürdürerek, bir lisans yoluyla ya da girişimi ortaklaşa işleterek. Bir girişim ayrı bir şirkete dönüşebilir, devredilebilir ya da satılabilir.",
    portfolioBranches: ["Yorisou içinde işletme", "Ortak kuruluş ve ortak işletme", "Pay", "Lisans", "Ayrı şirket", "Devir veya satış"],
    portfolioNote:
      "Hangi biçimin geçerli olacağı; girişimin olgunluğuna, birlikte çalışılan taraflara, pazara, sermayeye ve o girişim için varılan anlaşmaya bağlıdır. Önceden belirlenmiş bir koşul yoktur.",
    engageEyebrow: "Birlikte kurmak",
    engageHeading: ["Henüz şirket olmadan,", "işin içinde olun."],
    engageBody:
      "Kurucular, araştırmacılar, kamu ekipleri, şirketler. Nereden dâhil olabileceğiniz, nerede durduğunuza bağlı. Şimdilik konuşabildiğimiz yerden başlıyoruz.",
    engageCta: "Katılma yollarını görün",
    engageNote: "Hepsi şimdilik bir görüşmeyle başlıyor. Henüz ne bir başvuru süreci ne de bir seçim düzeni var.",
  },

  mirai: {
    reading: "Yereldeki ulaşımı, çözüme varana kadar götürmek.",
    now: "Kamuya açık site çalışıyor. Kamuya açık kaynakları sürekli okuyan sistem de kendi başına dönüyor. Ancak bugüne kadar dışarıya, kimseye gönderilmiş tek bir şey yok.",
    next: "İlk gerçek örnekte, masa başında kapanmayan sorular kaldı. Buradan sonrası insanın işi.",
    who: "Yereldeki ulaşım sahasını içeriden bilenler — belediyeler, işletmeciler, sahanın kendisi. Gerçek kısıtları anlatabilecek kişiler.",
    join: {
      title: "Bu girişime dâhil olmak",
      body: "Şu anda ihtiyacımız olan, sahanın kısıtlarını somut biçimde anlatabilecek bir muhatap. Bu bir satış değil; doğrulamaya gittiğimiz aşama.",
      roles: [
        "Yereldeki ulaşımın ya da toplu taşımanın içinde olmak — belediye, işletmeci ya da sahanın kendisi",
        "Bu alanı bir girişim olarak üstlenebilecek kurucu ya da işleten olmak",
        "İşleyişin gerçekte nasıl yürüdüğünü bilen bir uzman olmak",
      ],
      state: "Şimdilik yalnızca dinlemek istediğimiz bir aşamadayız. Açık bir pozisyon yok.",
    },
    eyebrow: "Proje 01",
    heading: ["Japonya’nın mobilite alanında", "bilgi, eşleştirme ve iş geliştirme", "platformu."],
    stage: "Kamuya açık site yayında / platform özellikleri geliştirme aşamasında",
    lead: "Mirai Move; kamu kurumlarını ve belediyeleri, şirketleri, yerel topluluk ile bakım ve sosyal hizmet sahalarını, yurt dışı tedarikçileri ve yurt içi iş ortaklarını birbirine bağlayarak mobiliteye dair bilgi ve fırsatların tek bir akış olarak ele alınmasını hedefliyor. Bugün kamuya açık bilgi sitesi yayında; platform özellikleri geliştirme aşamasında.",
    domain: "Japonya’nın mobilite alanı",
    networkEyebrow: "Kimleri bağlıyor",
    networkHeading: ["Farklı yerlerde duran taraflar,", "aynı fırsata", "farklı sözcüklerle bakıyor."],
    centre: "Mobilite fırsatı",
    parties: [
      { no: "01", title: "Kamu kurumları ve belediyeler", body: "Mevzuatı ve bütçeyi elinde tutan taraf" },
      { no: "02", title: "Şirketler", body: "Tedarik eden ve uygulayan taraf" },
      { no: "03", title: "Yerel topluluk, bakım ve sosyal hizmet sahaları", body: "Hareketin fiilen gerçekleştiği yer" },
      { no: "04", title: "Yurt dışı tedarikçiler ve yurt içi iş ortakları", body: "Seçenekleri getiren taraf" },
    ],
    boundaryTitle: "Geliştirme durumu hakkında",
    boundaryBody: "Platformun kendisi geliştirme aşamasındadır. Otonom ajanlarla otomatik çalıştırma etkinleştirilmemiştir. Sistemin dışına ulaşan her işlem, insan onayı gerektirecek şekilde tasarlanmıştır. Tamamlanmış, tüm özellikleri hazır bir platform olarak sunulmamaktadır.",
    detail: [
      { heading: "Ele aldığı sorun", body: "Mobilite seçenekleri bölgeye, mevzuata ve işletmeciye göre ayrı ayrı var oluyor. İhtiyaç duyan kişi ile hâlihazırda var olan seçenek aynı yerde buluşamıyor." },
      { heading: "Kimlerle çalışıyor", body: "Kamu kurumları ve belediyeler, şirketler, yerel topluluk ile bakım ve sosyal hizmet sahaları, yurt dışı tedarikçiler ve yurt içi iş ortakları. Konumları ve ölçütleri farklı olan taraflar, aynı fırsata farklı sözcüklerle bakıyor." },
      { heading: "Bugün çalışan kısım", body: "Kamuya açık bilgi sitesi yayında. Platformun bilgi, eşleştirme ve iş geliştirme işlevleri, altyapı ve mimarinin kurulması aşamasında." },
    ],
    siteLabel: "Kamuya açık site",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    reading: "Japonya’daki işlemleri kişinin kendi başına yürütebilmesi için.",
    now: "Kapalı bir test aşaması. Genel kullanıma açık değil ve henüz kullanan kimse yok.",
    next: "Dağıtım için gereken işlemler ve şirketin tescil bilgilerinin kesinleşmesi. İkisi de dışarıdan onay gerektiriyor.",
    who: "Japonya’da yaşayan yabancı uyruklu kişiler, onlara destek verenler ve ruhsatlı meslek mensupları.",
    join: {
      title: "Bu girişime dâhil olmak",
      body: "Önce, bu işlemlerin gerçekte nasıl yürüdüğünü bilen kişilerin bakmasını istiyoruz. Bu, meslek mensubunun yerini alacak bir araç değil.",
      roles: [
        "Japonya’da bir işlemde fiilen zorlanmış olmak",
        "Yabancı uyruklu kişilere bir biçimde destek veriyor olmak",
        "Ruhsatlı meslek mensubu olarak sınırın nereye çizileceğini birlikte doğrulayabilmek",
        "Bu girişimi kurucu ya da işleten olarak üstlenebilmek",
      ],
      state: "Gösterebileceğimiz kişileri arıyoruz. Ne yayımlandı ne de açık bir çağrı var.",
    },
    eyebrow: "Proje 02",
    heading: ["Japonya’da yaşayanlar ve", "burada iş kurmak isteyenler için", "çok dilli işlem desteği."],
    stage: "Geliştirme aşamasında (henüz genel kullanıma açık değil)",
    lead: "Dil ve ön bilgi engel olduğunda, insanlar aslında kullanmaya hakkı olduğu sistemlere ulaşamıyor. Kakari; ilgili bilgiyi bulma, belgeleri hazırlama, formları doldurma ve gönderim adımlarını izleme aşamalarında kullanıcının kendi dilinde destek veriyor. Şu anda geliştirme aşamasındadır ve henüz genel kullanıma açık değildir.",
    domain: "İdari işlemler ve belgeler / çok dilli",
    procedureEyebrow: "Desteklediği süreç",
    procedureHeading: ["Araştırmaktan,", "başvuruyu vermeye kadar."],
    steps: [
      { no: "01", title: "Araştır", body: "Hangi işlemlerin sizi ilgilendirdiğini belirleyin" },
      { no: "02", title: "Belgeleri topla", body: "Gereken belgeleri ve ekleri çıkarın" },
      { no: "03", title: "Hazırla", body: "Formları kendi dilinizde doldurun ve içeriği kontrol edin" },
      { no: "04", title: "Gönder", body: "Nereye, nasıl ve hangi posta yöntemiyle gönderileceğine dair yönlendirme" },
    ],
    boundaryTitle: "Meslek mensubunun üstlendiği alan",
    boundaryBody: "Sizin adınıza yetkili bir meslek mensubu olarak hareket etmeyiz. Hukuki, vergisel ve resmî değerlendirme gerektiren alanlar, bir meslek mensubunun üstlendiği işler olarak açıkça belirtilir. Avukat, vergi müşaviri veya idari işlem yazmanı (gyoseishoshi) gibi ruhsat gerektiren değerlendirmeler ve temsil, Kakari’nin işlevleri kapsamında değildir.",
    detail: [
      { heading: "Ele aldığı sorun", body: "Bir işlemin nasıl yapılacağı kamuya açık bilgidir. Buna rağmen, yalnızca dil ve varsayılan ön bilgi eksik olduğu için sisteme ulaşamayan insanlar var. Bu, kişinin yeterliliğiyle ilgili bir sorun değildir." },
      { heading: "Kimlerle çalışıyor", body: "Japonya’da yaşayan kişiler ve burada iş kurmak üzere olanlar; Japonca yürütülen bir işlemi tek başına tamamlaması zor olan durumdaki insanlar." },
      { heading: "Bugün çalışan kısım", body: "Kimlik doğrulama altyapısı bağımsız bir doğrulama ortamında kuruldu; izinler ve depolama bu ortamda doğrulanıyor. Dış entegrasyonlar devre dışı bırakılmış durumda ve sistem genel kullanıma açılmadı." },
    ],
  },

  about: {
    eyebrow: "Hakkımızda",
    heading: ["Nasıl geliştirdiğimiz,", "verdiğimiz sözün kendisidir."],
    lead: "Yorisou; günlük yaşamdaki, işteki ve yereldeki karmaşıklığa yakından bakar ve insanların bunu anlamasına, seçim yapmasına ve ilerlemesine yardımcı olan ürünler geliştirir.",
    whyHeading: ["Bu şirket neden var."],
    whyBody: [
      "Sistemler de teknoloji de seçenekler de zaten çok sayıda var. Yine de, ihtiyaç duyan kişiye ulaşmadan duruyorlar. Üzerinde çalıştığımız şey, işte bu son mesafedir.",
      "Bu mesafe çoğu zaman bireysel çaba ya da bilgi eksikliği meselesi olarak anlatılır. Oysa gerçekte, sistemin üstlenebileceği karmaşıklık çoğu kez olduğu gibi bireye devredilmiş oluyor.",
    ],
    thinkHeading: ["Nasıl düşünüyoruz."],
    thinkBody: [
      "Tasarıma teknolojiden başlamayız. Şu anda tıkanmış olan tek hamleyi çözmekle başlarız: kişinin durumunu okumak, bunu ilişkiler olarak düzenlemek ve bir sonraki adımın anlaşıldığı noktaya kadar taşımak. Tasarımın kapsamı buraya kadardır.",
      "Yapay zekâyı bu anlama ve yapılandırma işi için kullanırız; kararı onun yerimize vermesi için değil. Görevi, kişinin karar verebilmesi için gereken malzemeyi kullanılabilir bir biçime getirmektir. Karar da sorumluluk da insanda kalır.",
    ],
    buildHeading: ["Nasıl geliştiriyoruz."],
    principles: [
      { no: "01", title: "Sahanın dilinden başlarız", body: "Tasarıma teknolojiden başlamayız. Gerçekten tıkanmış birinin izlediği adımlardan geriye doğru çalışırız." },
      { no: "02", title: "Anlaşılır olana kadar sorumluluk alırız", body: "Bilgiyi sunmak son nokta değildir. Bundan sonra ne yapılacağının anlaşılması da tasarımın kapsamındadır." },
      { no: "03", title: "Sınırı açıkça belirtiriz", body: "Yetkili bir meslek mensubuna ait işlere girmeyiz. Neyi üstlendiğimiz ve nereden itibaren devrettiğimiz, ürünün içine yazılıdır." },
      { no: "04", title: "Yalnızca doğrulanabilir olanı söyleriz", body: "Sonuçlar, rakamlar ve iş birlikleri yalnızca kanıtı olduğunda yer alır. Doğrulanamayan hiçbir şey yazılmaz." },
    ],
    orderHeading: ["Teker teker,", "sonuna kadar."],
    orderBody: "Aynı anda birçok işe başlamayız. Tek bir alanı, sahanın gerçek adımlarına ulaşacak noktaya kadar sonuna dek götürmeyi önceliklendiririz.",
    claimsHeading: ["Doğrulayamadığımızı", "yazmayız."],
    claimsBody: "Yayımladığımız her bilginin arkasında onu doğrulayan bir kayıt vardır. Söyleyebileceğimizin az olduğu dönemlerde az yayımlarız.",
  },

  company: {
    eyebrow: "Şirket",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC bir girişim foundry’si olarak çalışır: yapısal sorunları bulur, iş olarak tasarlar ve onları işletebilecek kişilerle birlikte ayağa kaldırır. Fukuoka merkezli olarak birden fazla girişim kuruyoruz; şu anda kamuya açık olanlar Mirai Move, Kakari ve Chigamo.",

    messageEyebrow: "Temsilcinin mesajı",
    messageHeading: ["Ölçümüz teknolojinin ileriliği değil,", "ulaşıp ulaşmadığıdır."],
    message: [
      "Ele aldığımız şey yenilik değil.",
      "Yirmi yılı aşkın süre boyunca otomotiv, mobilite ve üretim sahalarında teknoloji, uygulama ve ticari akışın arasında durdum. Orada tekrar tekrar gördüğüm şey şuydu: iyi kurulmuş bir sistem, ona ihtiyaç duyan kişiye ulaşmadan duruyordu. Teknoloji yetersiz olduğu için değil; o kişinin gerçekten attığı adımlara hiç çevrilmemiş olduğu için.",
      "Sistemler de seçenekler de zaten çok sayıda var. Ama kişi bunun kendisini ilgilendirip ilgilendirmediğini ya da bundan sonra ne yapması gerektiğini bilemiyorsa, hiç yokmuş gibidir. Bu son mesafeyi bireyin değil sistemin üstlenmesi — Yorisou’yu kurmamın nedeni budur.",
      "Yapay zekâyı, kararı yerimize versin diye kullanmıyoruz. Durumu okumak, ilişkiler olarak düzenlemek ve insanın karar verebilmesi için kullanılabilir bir biçime getirmek üzere kullanıyoruz. Karar da sorumluluk da insanda kalır. Neyi üstlendiğimiz ve nereden itibaren meslek mensubuna devrettiğimiz, ürünün ekranına yazılır. Tasarımımız budur.",
      "Şirket olarak hâlâ küçüğüz ve yazabileceğimiz çok şey yok. Tam da bu yüzden yalnızca doğrulayabildiğimizi yazıyoruz. Artması gereken şey iddia değil, gerçekten ulaşmış olmanın kaydıdır.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Yorisou LLC Temsilci Ortağı",

    profileEyebrow: "Temsilci",
    profileHeading: ["Yöneten ortak hakkında"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Yorisou LLC Temsilci Ortağı",
    profileBody: [
      "Otomotiv, mobilite, üretim, endüstriyel proje geliştirme, tedarik zinciri, ticari geliştirme, ürün geliştirme ve sınır ötesi uluslararası iş alanlarında yirmi yılı aşkın mesleki deneyim.",
    ],
    profileBackgroundLabel: "Geçmiş",
    profileBackground: [
      "Uluslararası bir otomotiv tedarikçisi olan Ficosa’da ticari ve endüstriyel projelerde üst düzey sorumluluklar üstlendi; küresel endüstriyel projeler ve Asya bölgesindeki ticari faaliyetlerle ilgili çalışmalarda yer aldı.",
      "Ardından Çin’de teknoloji ve üretim işletmeleri kurdu ve yönetti; otomotiv elektroniği, kontrol sistemleri, hassas üretim ile yapay zekâ destekli ürün ve sistem geliştirme alanlarında çalıştı.",
      "Avrupa, Çin ve Japonya dâhil olmak üzere birden fazla pazarda uluslararası iş yürütme deneyimine sahip.",
      "Hâlen Japonya’da Yorisou LLC’nin temsilci ortağı olarak görev yapıyor ve şirketi Fukuoka’dan kuruyor.",
    ],
    profileEducationLabel: "Eğitim",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Bu geçmişin buradaki karşılığı",
    profileRelevance: [
      "Karmaşık, gerçek sektörlerin içinde uzun süre saha işi yapmış olmak.",
      "Teknolojiyi, üretimi, ticari uygulamayı ve uluslararası pazarları birbirine bağlayan bir konumda durmuş olmak.",
      "Bir sistemin ya da teknolojinin yapabildiği ile bir kişinin veya kurumun gerçekten kullanabildiği arasındaki farkı doğrudan görmüş olmak.",
      "Ve bunun sonucunda, karmaşıklığı anlaşılır ve eyleme geçirilebilir bir biçime dönüştüren ürünler geliştirmeye varmış olmak.",
    ],

    overviewEyebrow: "Şirket künyesi",
    overviewHeading: ["Şirket künyesi"],
    facts: [
      { label: "Unvan", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Kurum numarası (hōjin bangō)", value: "2290003018125" },
      { label: "Yöneten ortak", value: "Jin Yang" },
      { label: "Adres", value: "Fukuoka şehri, Fukuoka, Japonya" },
      { label: "Faaliyet konusu", value: "Yeni girişimlerin araştırılması, planlanması, geliştirilmesi ve işletilmesi; kurucu ekiplerin oluşturulması; ortak işletme, lisanslama ve benzeri düzenlemelerle girişimlerin hayata geçirilmesi" },
    ],

    businessEyebrow: "Faaliyet alanları",
    businessBody: "Yorisou’nun merkezinde girişimlerin kendisini kurmak vardır: yapısal bir sorunu bulmak, doğrulamak, iş olarak tasarlamak, inşa etmek ve onu işletebilecek kişilerle birlikte ayağa kaldırmak. Şu anda kamuya açık girişimler şunlardır: mobilite alanında bilgi, eşleştirme ve iş geliştirme (Mirai Move); Japonya’da yaşayanlar ve burada iş kurmak isteyenler için çok dilli işlem desteği (Kakari); ve konum ile bağlamdan yola çıkan yaşam çevresi keşfi (Chigamo, tasarı aşamasında). Hepsini aynı ilkeyle yürütüyoruz: karmaşıklığı üstlenip kullanılabilir bir biçime getirmek.",

    projectsEyebrow: "Projeler",
    projectsHeading: ["Yürüttüğümüz projeler"],

    originEyebrow: "Bulunduğumuz yer",
    originHeading: ["Fukuoka’dan başlıyoruz."],
    originBody: [
      "Yorisou LLC, şirketi Japonya’nın Fukuoka şehrinden kuruyor.",
      "Burası, günlük yaşamın, işin ve yerel topluluğun birbirine yakın durduğu; tasarımın sahanın gerçek adımlarından başlayabildiği bir yer.",
    ],

    ctaHeading: ["İletişim"],
    ctaBody: "Çalışmalarımıza ilişkin sorular, olası iş birlikleri ve basın talepleri için yazabilirsiniz.",
  },

  contact: {
    eyebrow: "İletişim",
    heading: ["İletişim"],
    lead: "Çalışmalarımıza ilişkin sorular, olası iş birlikleri ve basın talepleri için yazabilirsiniz. İçeriğine göre sırayla yanıt veriyoruz.",
    channelsHeading: ["Neler sorabilirsiniz"],
    channels: [
      { title: "Genel sorular", body: "Bir şirket olarak Yorisou ve yürüttüğümüz projeler hakkındaki sorular." },
      { title: "İş ve iş birliği", body: "Mobilite ya da idari işlemler alanında iş birliği veya ticari görüşme talepleri." },
      { title: "Basın ve medya", body: "Röportaj talepleri ve şirket ya da temsilcisi hakkındaki sorular." },
    ],
    formHeading: ["Bize mesaj gönderin"],
    formIntro: "Aşağıdaki formu kullanabilirsiniz. Gelen her mesajı okuyor ve sırayla yanıtlıyoruz.",
    unavailableBody: "Teslim yolunu doğrulamayı tamamlamadık; bu nedenle buradan gönderilen bir mesajın ulaşacağını garanti edemeyiz. Doğrulandığı anda form bu sayfada açılacak.",
    fields: {
      name: "Ad soyad", namePlaceholder: "Adınız",
      email: "E-posta", emailPlaceholder: "you@example.com",
      org: "Şirket veya kurum", orgPlaceholder: "İsteğe bağlı",
      type: "Talep türü",
      message: "Mesajınız", messagePlaceholder: "Konunun arka planını ve netleştirmek istediğiniz noktayı yazın.",
    },
    types: [
      { value: "general", label: "Genel soru" },
      { value: "business", label: "İş ve iş birliği" },
      { value: "media", label: "Basın ve medya" },
    ],
    submit: "Gönder",
    sending: "Gönderiliyor…",
    successTitle: "Mesaj gönderildi",
    successBody: "Talebinizi aldık. İnceleyip sırayla yanıt vereceğiz.",
    errorTitle: "Gönderilemedi",
    errorBody: "Lütfen biraz bekleyip tekrar deneyin.",
    required: "Zorunlu",
    privacyNote: "Paylaştığınız kişisel bilgiler yalnızca talebinize yanıt vermek amacıyla kullanılır.",
  },

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────────── */
  ventures: {
    eyebrow: "Girişimler",
    publicLabel: "Şu anda kamuya açık girişimler",
    publicNote: "Yorisou birden fazla girişim kuruyor. Burada şu anda kamuya açık olanlar var.",
    heading: ["Hiçbiri henüz", "bir şirket olarak ayakta değil."],
    lead:
      "Her birinde kurallar ve sistemler zaten var; yalnızca ihtiyaç duyan kişiye varmadan duruyorlar. Yorisou bu aralığa giriyor ve ilerledikçe doğruluyor.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Mobilite alanında bilgiyi, eşleştirmeyi ve iş geliştirmeyi birbirine bağlamak.",
        problem: "Bilgi ve fırsat; işletmeciler, bölgeler ve kamu kurumları arasında bölünmüş durumda.",
        building: "Yurt içinden ve yurt dışından tarafların aynı bilgi üzerinden konuşabildiği bir platform.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Japonya’da yaşayanların ve burada iş kuranların işlemlerini çok dilli olarak desteklemek.",
        problem: "Sistem var; ama dil ve sıra bilgisi engel olduğu için hiç kullanılmadan kalıyor.",
        building: "İşlemi aşamalara bölen ve kişinin nereye kadar kendi başına gidebileceğini gösteren bir yapı.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Bir yeri, konum ve bağlam üzerinden okunabilir kılmak.",
        problem: "Bulunduğunuz yerde gerçekten işinize yarayacak bilgi, en zor bulunanıdır.",
        building: "Konum ve bağlamdan yola çıkan, yaşanılan çevreye dair bir keşif yapısı.",
      },
    ],
    /* CORP-v1.4 — separates what is true today from what may follow. */
    structureHeading: ["Bugün geçerli olan,", "bundan sonra olabilecek."],
    structureBody: [
      "Yukarıda yazan aşamalar bugünün gerçeğidir. Yalnızca fiilen olmuş olanı yazıyoruz.",
      "Bundan sonraki biçim belli değildir. Bir girişim Yorisou içinde işletilmeye devam edebilir, dışarıdan bir işletme ekibiyle yürütülebilir, ortaklaşa sahiplenilebilir ya da ayrı bir şirkete dönüşebilir. Lisans, devir ya da satış biçimini de alabilir.",
      "Hangisinin geçerli olacağı; girişimin olgunluğuna, birlikte çalışılan taraflara, pazara, sermayeye ve varılan anlaşmaya bağlıdır. Burada yazan, olabilecek biçimlerdir; bir plan ya da söz değildir.",
    ],
    noteHeading: ["Bu sayfanın söylediği,", "bir de söylemediği."],
    noteBody: [
      "Burada yer alanlar, Yorisou’nun bugün üzerinde çalıştığı girişimler ve tasarılardır.",
      "Tüzel kişiliği olan bağlı şirketler, yatırımlar ya da müşteriler değildir. Her biri farklı bir aşamada; aşamasını olduğu gibi yazdık.",
      "Burada yazanlar bugünün gerçeğidir. Bundan sonra hangi biçimi alacakları henüz belli değildir.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    reading: "Bir yeri, orada dururken anlamak.",
    now: "Tasarı aşaması. Yayımlanmış bir ürün, kullanıcı ya da belediyeyle yürütülen bir program yok.",
    next: "Konum ve bağlamla daraltmak bilgiyi gerçekten kullanılabilir kılıyor mu. Önce bunu küçük ölçekte sınamak istiyoruz.",
    who: "Belirli bir yeri gerçekten bilenler; yaşanılan çevreye dair bilginin nerede tükendiğini anlatabilecek kişiler.",
    join: {
      title: "Bu girişime dâhil olmak",
      body: "Henüz doğrulamanın da öncesindeyiz. Bu yüzden birlikte kuracak birinden çok, varsayımı yıkacak birini arıyoruz.",
      roles: [
        "Belirli bir bölgeyi, orada yaşayan biri olarak ayrıntısıyla bilmek",
        "Konum ya da bölge verisiyle çalışmış olmak",
        "Henüz tasarı aşamasındayken dâhil olmaktan çekinmemek",
      ],
      state: "Tasarı aşaması. Nasıl dâhil olunacağı henüz belli değil.",
    },
    eyebrow: "Girişim",
    heading: ["Bir yeri,", "orada dururken anlamak."],
    stage: "Tasarı aşaması",
    lead:
      "Bir tasarı: konum ve bağlamı kullanarak, belirli bir yerde gerçekten işe yarayanı görünür kılmak. Henüz doğrulama aşamasının da öncesinde.",
    domain: "Yaşam çevresi / konum ve bağlam / keşif",
    conceptEyebrow: "Düşündüğümüz şey",
    conceptHeading: ["Bilgi yok değil;", "yerine ulaşmıyor."],
    conceptBody: [
      "Bir yer hakkında en çok bilmek istediğiniz şeyler, aramanın en kötü karşılık verdiği şeylerdir. Bilgi olmadığı için değil; yerle ve durumla ilişkilendirilerek hiç düzenlenmediği için.",
      "Nerede olduğunuz, zamanın ne olduğu ve içinde bulunduğunuz durum. Bazı bilgiler ancak bu üçü aynı anda örtüştüğünde “bu beni ilgilendiriyor” diye okunur hâle gelir. Chigamo’nun ele almaya çalıştığı yer burasıdır.",
    ],
    boundaryTitle: "Bugünkü aşama",
    boundaryBody:
      "Chigamo tasarı aşamasındadır. Yayımlanmış bir ürün, kullanıcı ya da belediyeyle yürütülen bir program yoktur. Burada yazılanlar, sınamayı düşündüğümüz varsayımlardır.",
    detail: [
      {
        heading: "Neden şimdi",
        body: "Haritalar da arama da yeterince olgunlaştı. Yine de “şu anda bulunduğum yerde benim için ne anlam taşıyor” sorusunu insanlar hâlâ kendileri çözüyor.",
      },
      {
        heading: "Neyi doğrulamamız gerekiyor",
        body: "Konum ve bağlamla daraltmak, bilgiyi gerçekten kullanılabilir hâle getiriyor mu. Önce bunu, küçük ölçekte sınamak istiyoruz.",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ─────────────────────────────── */
  foundry: {
    eyebrow: "Nasıl kuruyoruz",
    heading: ["Sorundan şirkete,", "sırayı atlamadan."],
    lead:
      "Beğendiğimiz bir fikirden başlamıyoruz. Yapısal bir sorunu buluyor, doğruluyor, iş olarak tasarlıyor, onu işletebilecek kişilerle bir araya geliyor ve girişim olarak ayakta duracağı noktaya kadar götürüyoruz. Yorisou bu sıralamaya foundry diyor.",
    stagesEyebrow: "Aşamalar",
    stagesHeading: ["Sekiz aşama,", "hiçbiri atlanmadan."],
    stages: [
      { no: "01", name: "Varsayım", body: "Yapısal sorunun nerede olduğunu ortaya koymak. Bir sezgiden değil, sahanın gerçek biçiminden." },
      { no: "02", name: "Kanıt", body: "Sorunun gerçekten var olup olmadığını ve kimin üzerine kaldığını doğrulamak. Burada elenen varsayım az değildir." },
      { no: "03", name: "İş tasarımı", body: "Çözümü iş biçimine getirmek: kimin kullanacağını ve karşılığın nerede doğduğunu tasarlamak." },
      { no: "04", name: "İnşa", body: "Fiilen kurmak. Ortak zeminin kullanılabildiği yerde onu kullanmak, gücü o girişime özgü olan kısma vermek." },
      { no: "05", name: "Devredilebilir hâl", body: "Varlıkları ve süreçleri, birinin devralıp işletebileceği hâle getirmek." },
      { no: "06", name: "Kurucu ekibin oluşması", body: "Girişimi kendi işi olarak üstlenebilecek kişiyle bir araya gelmek. İstihdam olarak değil, kuruculuk olarak." },
      { no: "07", name: "Bağımsızlaşma ve işletme", body: "Girişimi kendi gücüyle dönebileceği hâle getirmek. Ayrı bir şirkete dönüşebilir, Yorisou içinde işletilmeye devam edebilir ya da ortaklaşa sahiplenilebilir." },
      { no: "08", name: "Öğrenme", body: "İşe yarayanı da elenen varsayımı da, bir sonraki girişimin malzemesi olarak saklamak. Girişimle olan ilişki burada bitmek zorunda değil." },
    ],
    independenceHeading: ["Bir girişimin alabileceği biçim", "tek değildir."],
    independenceBody: [
      "Bağımsız bir şirket olarak ayakta durmak, hedeflediğimiz biçimlerden biridir. Ancak oraya varmak, girişimin Yorisou ile ilişkisinin bittiği anlamına gelmez.",
      "Bir girişim Yorisou içinde işletilmeye devam edebilir. Dışarıdan bir kurucu ya da işletme ekibi alınarak ortaklaşa sahiplenilebilir; ayrı bir şirkete dönüşebilir, lisans biçimini alabilir, devredilebilir ya da satılabilir.",
      "Hangi biçimin geçerli olacağı; girişimin olgunluğuna, birlikte çalışılan taraflara, pazara, sermayeye ve o girişim için varılan anlaşmaya bağlıdır. Önceden belirlenmiş bir kalıp yoktur.",
      "Değişmeyen tek bir şey var: en baştan devredilebilir biçimde kurmak. İşletecek kişiler gerçek kararları veremiyorsa, orada ayakta duran bir girişim yok demektir.",
    ],
    asterionEyebrow: "Ortak teknoloji ve yürütme",
    asterionHeading: ["Aynı şeyi", "iki kez kurmamak."],
    asterionBody: [
      "Asterion OS, bağımsız bir teknoloji platformu projesidir. Bu şirket sitesinde tanıtılan Yorisou girişimlerinden biri değildir.",
      "Yorisou girişimleri, uygun olduğu yerde Asterion’un yetkinliklerini kullanabilir. Mülkiyet, lisans, veri hakları ve işletme sorumluluğu, her durumda geçerli olan sözleşmelere göre belirlenir.",
      "Ortak zemin kullanılabildiği için hiçbir girişim aynı yapıyı yeniden kurmak zorunda kalmaz; her biri kendi alanına yoğunlaşabilir. Biriken yetkinlik, bir sonraki girişimin başlangıç noktası olur.",
    ],
    asterionBoundaryTitle: "Sınır",
    asterionBoundaryBody:
      "Her girişim ayrı yönetilir. Fikrî mülkiyetin, verinin ve işletme sorumluluğunun nerede durduğu, o girişime ait sözleşmeyle belirlenir. Girişimlerin ya da kullanıcıların verisinin kendiliğinden platform tarafına akacağı bir tasarım yoktur.",
    economicsHeading: ["Pay,", "katkıyı ve sorumluluğu izler."],
    economicsBody: [
      "Koşullar girişimden girişime değişir. Tek bir kalıbı her şeye uygulamıyoruz.",
      "Ortak olan yalnızca ilkedir: pay; katkıyı, üstlenilen riski ve devam eden sorumluluğu izler. Girişimi işletenler gerçek karar yetkisini taşır.",
      "Yorisou’nun kendisi de bir girişimin uzun vadeli değerine bağlı kalabilir: pay sahipliğini sürdürerek, bir lisans yoluyla ya da girişimi ortaklaşa işleterek. Hangisinin geçerli olacağı, Yorisou’nun o girişimde neyi üstlendiğine ve ne kadar risk aldığına bağlıdır.",
      "Şu anda söz verebileceğimiz bir koşul yok. Ne pay ne de herhangi bir hakkın biçimi, anlaşmadan önce belirlenmiş değildir.",
      "Ayrıntılar her girişim ve her kişi için ayrıca konuşulur. Bir web sitesine yazılacak türden şeyler değildir.",
    ],
    maturityTitle: "Bugünkü durum",
    maturityBody:
      "Bu çalışma biçimi, kanıtlanmış ve tekrarlanabilir bir yöntem değildir. Yorisou erken aşamadadır ve bugüne kadar hiçbir girişimi bağımsız bir şirket olarak yola çıkarmış değildir. Burada yazılanlar, fiilen izlediğimiz yoldur; bir sonuç iddiası değildir.",
  },

  /* ── BUILD WITH US (CORP-v1.2) ──────────────────────────────────────── */
  buildWithUs: {
    eyebrow: "Birlikte kurmak",
    heading: ["Nerede durduğunuza göre,", "giriş de değişiyor."],
    lead:
      "Yorisou, bir girişimi ayakta duracağı noktanın hemen öncesine kadar götürüyor; sonra onu üstlenebilecek olanlarla bir araya geliyor. Bu yüzden aradığımız, çalıştıracağımız kişiler değil; girişimi devralacak kişiler ve kurumlar.",
    /* CORP-v1.4 — the shape of an involvement is designed per project, and promised in advance for none. */
    structureHeading: ["Nasıl dâhil olacağınızı,", "her proje için ayrı tasarlıyoruz."],
    structureBody: [
      "Girmeniz gereken hazır bir çerçeve yok. Ortak kuruculuk, kurucu ekip, girişimde pay, lisans, ortak işletme, ayrı bir şirkete dönüşme — hangisinin geçerli olacağı girişime ve neyi üstlendiğinize göre değişir.",
      "Hangi biçim olursa olsun; yönetişim, fikrî mülkiyet, rol, sorumluluk ve ekonomik koşullar ayrı bir sözleşmeyle belirlenir. Burada önceden söz verebileceğimiz bir koşul yoktur.",
    ],
    lanes: [
      {
        key: "founders",
        label: "Kurucular",
        title: "Kurucular ve ortak kurucular",
        body:
          "Şirket olmasının hemen öncesine kadar getirilmiş bir girişimi kendi işiniz olarak üstlenmek. İstihdam olarak değil, kuruculuk olarak dâhil olunur: karar da sorumluluk da o kişide durur.",
        invites: [
          "Sahası olan bir işi fiilen yürütmüş olmak",
          "Çoğu şeyin henüz belirsiz olduğu bir aşamada ilerleyebilmek",
          "Teknoloji, üretim, kamu ya da yerel alanlardan birine dair saha bilgisi",
        ],
        offers: "Araştırma ve kanıt, erken bir ürün, işin tasarımı ve ortak altyapı. Sıfırdan değil, yolun ortasından başlanır.",
        cannot: "Bu noktada ne maaş, ne finansman, ne de pay koşulları konusunda söz verebiliriz. Koşullar her girişim için ayrıca konuşulur.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Şimdilik yalnızca dinlemek istediğimiz bir aşamadayız. Açık bir pozisyon yok.",
        cta: "İlginizi iletin",
      },
      {
        key: "team",
        label: "Kurucu ekip",
        title: "Kurucu ekip ve uzmanlar",
        body:
          "Tek başına bir kurucu hiçbir zaman yetmiyor. Teknik tarafı, işleyişi ya da sahayı en baştan birlikte taşıyacak kişiler arıyoruz.",
        invites: [
          "Yalnızca kurmakla kalmayıp işletmeye kadar görmüş olmak",
          "Küçük bir ekiple bir işi ayağa kaldırmış olmak",
          "Kendi alanında neyin olağan olduğunu bilmek",
        ],
        offers: "En baştan içinde olunan bir konum ve üstlenilen kısımda gerçek bir hareket alanı.",
        cannot: "Sürekli açık bir işe alım kanalımız yok. Şu anda birini işe alabilecek durumda olduğumuzu söyleyemeyiz.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Girişimin aşamasına bağlı. Önce neyi üstlenebileceğinizi anlatın.",
        cta: "Konuşmaya başlayalım",
      },
      {
        key: "users",
        label: "İlk kullanıcılar",
        title: "İlk kullanıcılar ve birlikte deneyenler",
        body:
          "Yaptığımıza, onu gerçekten kullanacak kişinin yerinden bakılmasını istiyoruz. Beğenildiğini duymak için değil; nerede tıkandığını öğrenmek için.",
        invites: [
          "Bu sorunla fiilen boğuşmuş olmak",
          "İşe yaramayan yeri olduğu gibi söyleyebilmek",
          "Henüz yayımlanmamış bir şeye bakmaktan rahatsız olmamak",
        ],
        offers: "Yapım hâlindeki bir şeye bakmak; söyledikleriniz tasarıma geri döner.",
        cannot: "Ne yayın tarihi, ne isteğinizin karşılanacağı, ne de herhangi bir ödeme konusunda söz veremeyiz.",
        ventures: ["Kakari", "Mirai Move"],
        state: "Gösterebileceğimiz kişileri arıyoruz. Bu resmî bir çağrı değil.",
        cta: "İlginizi iletin",
      },
      {
        key: "research",
        label: "Üniversiteler",
        title: "Üniversiteler ve araştırma",
        body:
          "Araştırma sonucunun toplumda kullanılabilir hâle gelmesi, yanında iş tarafının tasarımını gerektiriyor. Kurucu yetişmesi ve araştırmanın uygulamaya geçmesi üzerine birlikte düşünebileceğimiz muhataplar arıyoruz.",
        invites: [
          "Araştırma sonucuna uygulama alanı aramak",
          "Öğrencilere ve araştırmacılara gerçek bir kuruculuk deneyimi kazandırmak istemek",
          "Önce ortak bir keşifle başlamayı tercih etmek",
        ],
        offers: "İş tarafının tasarımı ve fiilen yürüyen bir saha. Ortak bir keşifle başlanabilir.",
        cannot: "Henüz ne bir ortak araştırma sözleşmesi, ne finansman, ne de resmî bir iş birliği var.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "Geçmişe dönük bir iş birliği kaydımız yok. Konuşmakla başlıyor.",
        cta: "Konuşmaya başlayalım",
      },
      {
        key: "public",
        label: "Kamu",
        title: "Kamu ve idare",
        body:
          "Kamusal sorunlarda kural çoğu zaman zaten vardır; ama vatandaşın izleyebileceği adımlara çevrilmemiştir. Küçük denemeyi, etkinin ölçülmesini ve kalıcı hâle gelme yolunu birlikte tasarlamak istiyoruz.",
        invites: [
          "Sahada denenebilecek bir sorunun olması",
          "Etkinin ölçülebildiği bir biçim istemek",
          "Tek seferlik bir pilotla bitmesini istememek",
        ],
        offers: "Araştırma, kanıtın kullanılabilir biçimde düzenlenmesi ve küçük ölçekli bir deneme tasarımı.",
        cannot: "Belediyelerle yürütülmüş bir çalışma kaydımız yok. Mevzuata dair bir garanti de veremeyiz.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Görüşmeyle başlıyor. Yürüyen bir iş birliği yok.",
        cta: "İletişime geçin",
      },
      {
        key: "corporate",
        label: "Şirketler",
        title: "Şirketler",
        body:
          "Kendi sahanızdaki bir sorunun iş biçimine dönüşmesini istiyorsanız. Ortak geliştirmeyle ya da sahada küçük bir denemeyle başlayabiliriz.",
        invites: [
          "İşleyişte çözülmemiş bir sorunun olması",
          "Yeni bir işin biçimini aramak",
          "Ortak geliştirme için muhatap aramak",
        ],
        offers: "Sorunu en baştan bir iş olarak yeniden tasarlamaktan itibaren dâhil olunabilir.",
        cannot: "Ticari bir geçmişimiz yok. Gösterebileceğimiz bir uygulama örneği de yok.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Dinlemekle başlıyor.",
        cta: "Bize yazın",
      },
    ],
    intakeTitle: "Başvuru durumu hakkında",
    intakeBody:
      "Şu anda ne bir başvuru süreci ne de bir seçim programı var. Buradakiler birer davettir; yürüyen bir iş birliği ya da açık bir pozisyon değildir. Önce elinizdekini dinliyor, konuşulacak bir şey var mı oradan başlıyoruz.",
    foundingTeamEyebrow: "Kurucu ekip",
    foundingTeamHeading: ["Şirket olmadan önce,", "kurmaya başlıyoruz."],
    foundingTeamBody: [
      "Çoğu durumda bir girişim, insanlar bir araya geldikten sonra başlar. Yorisou tersten çalışıyor: araştırma ve kanıt, erken ürün ve işin tasarımı önce kuruluyor; ardından bunu üstlenecek kişi aranıyor.",
      "Bu yüzden dâhil olan kimse boş sayfadan başlamıyor. Zaten bir biçimi olan bir şeyi devralıp kendi işi hâline getirerek başlıyor.",
      "Buna karşılık üstlenmenin anlamı değişmiyor. Kararı veren, sorumluluğu da taşır. İşletecek kişiler gerçek kararları veremiyorsa, orada henüz bir şirket yok demektir.",
    ],
    ctaHeading: ["Hangi taraftan olursanız olun,", "ilk kapı aynı."],
    ctaBody: "Aklınızdakini yazıp gönderin. Sırayla okuyoruz.",
  },
};
