import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — POLISH. Translated from the Japanese canonical source (ja.ts), using en.ts only as a
 * structural reference.
 *
 * This is an adapted sibling, not a literal rendering: it is written to read as natural corporate
 * Polish. It may never be stronger than the Japanese. No customer, partner, metric, revenue,
 * funding, market-position, team-size or capability claim appears here that the Japanese does not
 * already make.
 *
 * On the company form: Yorisou is a Japanese LLC (godo kaisha). The representative is rendered as
 * "wspólnik zarządzający" — never a joint-stock-company title such as "prezes zarządu".
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 */
export const pl: SiteCopy = {
  chrome: {
    skip: "Przejdź do treści",
    menu: "Menu",
    menuToggle: "Otwórz i zamknij menu",
    close: "Zamknij",
    navLabel: "Nawigacja serwisu",
    navLabelMobile: "Nawigacja serwisu (wersja mobilna)",
    langLabel: "Język wyświetlania",
    langHeading: "Wybierz język",
    langSearch: "Szukaj języka",
    langCurrent: "Bieżący język",
    previewBadge: "Podgląd — nieopublikowane",
    nav: { home: "Strona główna", miraiMove: "Mirai Move", kakari: "Kakari", about: "O nas", company: "Firma", contact: "Kontakt" },
    footerTagline: "Między ludźmi a społeczeństwem tworzymy kolejny sposób towarzyszenia.",
    footerProjects: "Projekty",
    footerCompany: "Firma",
    footerLegalNote: "Podane tu informacje opierają się na zapisach, które możemy zweryfikować.",
    backToTop: "Powrót na górę strony",
  },

  meta: {
    home: { title: "Yorisou LLC — Między ludźmi a społeczeństwem tworzymy kolejny sposób towarzyszenia.", description: "Yorisou LLC uważnie przygląda się złożoności codziennego życia, pracy i lokalnych społeczności i tworzy produkty, dzięki którym ludzie mogą ją zrozumieć, wybrać i pójść dalej. Rozwijamy Mirai Move i Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Platforma informacji, kojarzenia partnerów i rozwoju biznesu w japońskim sektorze mobilności. Strona publiczna działa, funkcje platformy są w fazie rozwoju." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Wielojęzyczne wsparcie w procedurach administracyjnych i dokumentach dla osób mieszkających w Japonii oraz rozpoczynających tu działalność. W fazie rozwoju, jeszcze niedostępne publicznie." },
    about: { title: "O nas — Yorisou LLC", description: "Po co istnieje Yorisou, jak myśli i jak buduje. Nie piszemy tego, czego nie możemy zweryfikować." },
    company: { title: "Firma — Yorisou LLC", description: "Informacje o firmie, profil wspólnika zarządzającego, jego przesłanie oraz obszary działalności Yorisou LLC." },
    contact: { title: "Kontakt — Yorisou LLC", description: "Zapytania dotyczące naszej działalności, współpracy i kontaktu dla mediów." },
  },

  common: {
    readMore: (name) => `Więcej o ${name}`,
    backHome: "Powrót do informacji o firmie",
    stageLabel: "Obecny etap",
    boundaryLabel: "Czego się nie podejmujemy",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Między ludźmi a społeczeństwem", "tworzymy kolejny sposób", "towarzyszenia."],
    lead: ["Yorisou uważnie przygląda się złożoności codziennego życia, pracy i lokalnych społeczności", "i tworzy produkty, dzięki którym ludzie mogą ją zrozumieć, wybrać i pójść dalej."],
    humanSide: "Ludzie",
    humanItems: ["Codzienne życie", "Praca", "Społeczność"],
    systemSide: "Systemy",
    systemItems: ["Mobilność", "Procedury urzędowe"],
    fieldCaption: "Ludzie — codzienne życie, praca, społeczność  /  Systemy — mobilność, procedury urzędowe",
    fieldRelation: "Relacje",

    whyEyebrow: "Problemy, którymi się zajmujemy",
    whyHeading: ["Złożoności nie da się rozwiązać", "samym wysiłkiem jednostki."],
    whyBeats: [
      { no: "01", title: "„Nie wiem” zatrzymuje ludzi już w progu.", body: "System, który istnieje, ale jest nieosiągalny, znaczy tyle samo co system, którego nie ma." },
      { no: "02", title: "Droga do specjalisty jest daleka.", body: "Zanim naprawdę potrzebna staje się ludzka ocena, jest odcinek, który mógłby pokryć system." },
      { no: "03", title: "Praktyka i system nie zazębiają się.", body: "W mobilności, pomocy społecznej i administracji istnieją możliwości, które nie dotarły jeszcze do osób pracujących na miejscu." },
    ],

    buildEyebrow: "Co budujemy",
    buildHeading: ["Kolejny sposób towarzyszenia", "budujemy po kolei."],

    howEyebrow: "Jak budujemy",
    howHeading: ["Bierzemy złożoność na siebie", "i zamieniamy ją w coś użytecznego."],
    howBeats: [
      { no: "01", title: "Zaczynamy od języka praktyki", body: "Nie wychodzimy od technologii. Projektujemy, cofając się od rzeczywistych kroków osoby, która utknęła." },
      { no: "02", title: "Bierzemy odpowiedzialność aż do zrozumienia", body: "Podanie informacji to nie koniec. Wiedza o tym, co zrobić dalej, mieści się w zakresie projektu." },
      { no: "03", title: "Wyraźnie określamy granicę", body: "Nie wkraczamy w obszar zastrzeżony dla licencjonowanych specjalistów. To, co obejmujemy, i miejsce, w którym przekazujemy sprawę dalej, jest zapisane w samym produkcie." },
      { no: "04", title: "Mówimy tylko to, co można zweryfikować", body: "Wyniki, liczby i współpraca pojawiają się wyłącznie tam, gdzie istnieją dowody. Czego nie da się potwierdzić, tego nie piszemy." },
    ],
    howDisclose: "Co te zasady oznaczają w praktyce",

    founderEyebrow: "Wspólnik zarządzający",
    founderHeading: ["Buduje to ktoś, kto przez dwadzieścia lat", "pracował wewnątrz złożonych branż."],
    founderTeaser: "Ponad dwadzieścia lat w motoryzacji, mobilności, produkcji i biznesie międzynarodowym — na styku technologii, wdrożenia i realiów handlowych. Wciąż powtarzało się to samo: dobrze zbudowany system zatrzymywał się, zanim dotarł do osoby, która go potrzebowała.",
    founderRole: "Wspólnik zarządzający, Yorisou LLC",
    founderCta: "O wspólniku zarządzającym",

    messageEyebrow: "Przesłanie",
    messageHeading: ["Oceniamy po tym, czy dociera,", "a nie po tym, czy jest nowoczesne."],
    messageTeaser: "Nie zajmujemy się nowością. Systemy i możliwości już istnieją — zatrzymują się jednak, zanim dotrą do tych, którzy ich potrzebują. Budujemy firmę, która krok po kroku skraca ten dystans.",
    messageCta: "Przeczytaj całe przesłanie",

    originEyebrow: "Gdzie jesteśmy",
    originHeading: ["Zaczynamy z Fukuoki."],
    originBody: "Yorisou LLC buduje firmę z Fukuoki w Japonii — z miejsca, w którym codzienne życie, praca i społeczność są blisko siebie i w którym projektowanie może zaczynać się od kroków, jakie ludzie rzeczywiście wykonują.",

    proofEyebrow: "Firma",
    proofHeading: ["Tylko to,", "co możemy stwierdzić."],

    ctaEyebrow: "Kontakt",
    ctaHeading: ["Być może jest tu przestrzeń,", "by popracować nad tym razem."],
    ctaBody: "Przyjmujemy zapytania dotyczące naszej działalności, możliwej współpracy i kontaktu dla mediów. Odpowiadamy kolejno, stosownie do treści zapytania.",
    ctaButton: "Napisz do nas",
  },

  mirai: {
    eyebrow: "Projekt 01",
    heading: ["Platforma informacji, kojarzenia partnerów", "i rozwoju biznesu", "w japońskim sektorze mobilności."],
    stage: "Strona publiczna działa / funkcje platformy w fazie rozwoju",
    lead: "Mirai Move ma łączyć administrację państwową i samorządy, firmy, środowiska lokalne oraz placówki opiekuńcze, dostawców zagranicznych i partnerów krajowych, tak aby informacje i możliwości związane z mobilnością tworzyły jeden przepływ. Publiczna strona informacyjna działa już dziś, a funkcje platformy są w fazie rozwoju.",
    domain: "Japoński sektor mobilności",
    networkEyebrow: "Kogo łączy",
    networkHeading: ["Strony stojące w różnych miejscach", "patrzą na tę samą możliwość", "innymi słowami."],
    centre: "Możliwość przemieszczania się",
    parties: [
      { no: "01", title: "Administracja i samorządy", body: "Strona przepisów i budżetu" },
      { no: "02", title: "Firmy", body: "Strona dostaw i wdrożeń" },
      { no: "03", title: "Środowiska lokalne, opieka i pomoc społeczna", body: "Miejsce, w którym przemieszczanie faktycznie zachodzi" },
      { no: "04", title: "Dostawcy zagraniczni i partnerzy krajowi", body: "Strona, która wnosi możliwości" },
    ],
    boundaryTitle: "O stanie prac",
    boundaryBody: "Sama platforma jest w fazie rozwoju. Autonomiczne wykonywanie działań przez agentów nie jest włączone. Każde działanie sięgające poza system zaprojektowano tak, aby wymagało potwierdzenia przez człowieka. Nie oferujemy jej jako gotowej platformy z pełnym zestawem funkcji.",
    detail: [
      { heading: "Problem, którym się zajmuje", body: "Możliwości przemieszczania się istnieją osobno — zależnie od regionu, programu i operatora. Osoba, która ich potrzebuje, i możliwość, która już istnieje, nie spotykają się w jednym miejscu." },
      { heading: "Z kim pracuje", body: "Administracja państwowa i samorządy, firmy, środowiska lokalne i placówki opiekuńcze, dostawcy zagraniczni i partnerzy krajowi. Strony o różnych pozycjach i różnych kryteriach patrzą na tę samą możliwość innymi słowami." },
      { heading: "Co działa dzisiaj", body: "Publiczna strona informacyjna działa. Funkcje platformy — informacja, kojarzenie partnerów i rozwój biznesu — są na etapie budowy podstaw i architektury." },
    ],
    siteLabel: "Strona publiczna",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "Projekt 02",
    heading: ["Wielojęzyczne wsparcie w procedurach", "i dokumentach dla osób mieszkających w Japonii", "oraz rozpoczynających tu działalność."],
    stage: "W fazie rozwoju (jeszcze niedostępne publicznie)",
    lead: "Gdy barierą są język i wiedza wstępna, ludzie nie docierają do systemów, z których mają prawo korzystać. Kakari pomaga znaleźć potrzebne informacje, przygotować dokumenty, wypełnić formularze i przejść przez procedurę złożenia — w języku samego użytkownika. Projekt jest w fazie rozwoju i nie jest jeszcze ogólnie dostępny.",
    domain: "Procedury administracyjne i dokumenty / wielojęzycznie",
    procedureEyebrow: "Wspierana procedura",
    procedureHeading: ["Od ustalenia,", "po złożenie dokumentów."],
    steps: [
      { no: "01", title: "Sprawdź", body: "Ustal, które procedury Cię dotyczą" },
      { no: "02", title: "Zbierz dokumenty", body: "Wskaż wymagane dokumenty i załączniki" },
      { no: "03", title: "Przygotuj", body: "Wypełnij formularze w swoim języku i sprawdź treść" },
      { no: "04", title: "Złóż", body: "Wskazówki, gdzie, w jaki sposób i jaką drogą pocztową złożyć dokumenty" },
    ],
    boundaryTitle: "Gdzie sprawę przejmuje specjalista",
    boundaryBody: "Nie występujemy w Twoim imieniu jako licencjonowany specjalista. Kwestie prawne, podatkowe i rozstrzygnięcia urzędowe wskazujemy jako zakres pracy specjalisty. Oceny i reprezentacja wymagające uprawnień zawodowych — adwokata, doradcy podatkowego czy specjalisty do spraw procedur administracyjnych (gyosei shoshi) — nie wchodzą w zakres funkcji Kakari.",
    detail: [
      { heading: "Problem, którym się zajmuje", body: "Sposób przeprowadzenia procedury jest informacją publiczną. Mimo to ludzie nie docierają do systemu tylko dlatego, że brakuje im języka i zakładanej wiedzy. To nie jest kwestia ich możliwości." },
      { heading: "Z kim pracuje", body: "Osoby mieszkające w Japonii i osoby, które zamierzają rozpocząć tu działalność — te, którym trudno samodzielnie przejść procedurę po japońsku." },
      { heading: "Co działa dzisiaj", body: "Podstawa uwierzytelniania została zbudowana w odizolowanym środowisku testowym, w którym weryfikowane są uprawnienia i przechowywanie danych. Integracje zewnętrzne pozostają wyłączone, a projekt nie jest publicznie dostępny." },
    ],
  },

  about: {
    eyebrow: "O nas",
    heading: ["Sposób, w jaki budujemy,", "jest naszą obietnicą."],
    lead: "Yorisou uważnie przygląda się złożoności codziennego życia, pracy i lokalnych społeczności i tworzy produkty, dzięki którym ludzie mogą ją zrozumieć, wybrać i pójść dalej.",
    whyHeading: ["Dlaczego ta firma istnieje."],
    whyBody: [
      "Systemy, technologie i możliwości istnieją już w dużej liczbie. Mimo to zatrzymują się, zanim dotrą do osoby, która ich potrzebuje. Właśnie tym ostatnim odcinkiem się zajmujemy.",
      "Ten dystans opisuje się zwykle jako kwestię indywidualnego wysiłku albo dostępu do informacji. W praktyce złożoność, którą mógłby wchłonąć system, zostaje po prostu przekazana jednostce.",
    ],
    thinkHeading: ["Jak myślimy."],
    thinkBody: [
      "Nie wychodzimy od technologii. Zaczynamy od rozluźnienia tego jednego ruchu, który utknął: odczytujemy sytuację człowieka, porządkujemy ją jako układ relacji i doprowadzamy do momentu, w którym następny krok jest jasny. Taki jest zakres projektu.",
      "AI wykorzystujemy właśnie do tego rozumienia i porządkowania — nie do podejmowania decyzji za człowieka. Jej rolą jest przygotowanie materiału w formie, z której człowiek może skorzystać. Ocena i odpowiedzialność pozostają po stronie człowieka.",
    ],
    buildHeading: ["Jak budujemy."],
    principles: [
      { no: "01", title: "Zaczynamy od języka praktyki", body: "Nie wychodzimy od technologii. Projektujemy, cofając się od rzeczywistych kroków osoby, która utknęła." },
      { no: "02", title: "Bierzemy odpowiedzialność aż do zrozumienia", body: "Podanie informacji to nie koniec. Wiedza o tym, co zrobić dalej, mieści się w zakresie projektu." },
      { no: "03", title: "Wyraźnie określamy granicę", body: "Nie wkraczamy w obszar zastrzeżony dla licencjonowanych specjalistów. To, co obejmujemy, i miejsce, w którym przekazujemy sprawę dalej, jest zapisane w samym produkcie." },
      { no: "04", title: "Mówimy tylko to, co można zweryfikować", body: "Wyniki, liczby i współpraca pojawiają się wyłącznie tam, gdzie istnieją dowody. Czego nie da się potwierdzić, tego nie piszemy." },
    ],
    principlesLong: [
      { no: "01", title: "Zaczynamy od języka praktyki", long: "Żaden system do nikogo nie dociera, dopóki nie zostanie przełożony na kroki, które ta osoba faktycznie wykonuje. Zaczynamy od prawdziwego wniosku, prawdziwej drogi, prawdziwej rozmowy — nie od abstrakcyjnie postawionego problemu, lecz od tego jednego ruchu, który właśnie utknął." },
      { no: "02", title: "Bierzemy odpowiedzialność aż do zrozumienia", long: "Wyliczenie wyników wyszukiwania to jeszcze nie wsparcie. Człowiek potrzebuje wiedzieć, co zrobić dalej. Zakres produktu sięga do momentu, w którym następny krok jest zrozumiały, a nie do momentu, w którym wyświetlono informację." },
      { no: "03", title: "Wyraźnie określamy granicę", long: "Pozwolić komuś korzystać z produktu bez jasnego powiedzenia, czego produkt nie potrafi, to najbardziej niebezpieczny sposób projektowania. To, czym zajmujemy się my, i to, w którym miejscu sprawę przejmuje specjalista, zapisujemy na samym ekranie. Granica jest funkcją, a nie zastrzeżeniem drobnym drukiem." },
      { no: "04", title: "Mówimy tylko to, co można zweryfikować", long: "Nie opisujemy wyników, których nie możemy potwierdzić, ani funkcji, które jeszcze nie działają. Za każdym publikowanym faktem stoi zapis. W okresach, gdy mamy niewiele do powiedzenia, publikujemy niewiele." },
    ],
    orderHeading: ["Po jednym,", "do samego końca."],
    orderBody: "Nie zaczynamy wielu rzeczy naraz. Wolimy doprowadzić jeden obszar do momentu, w którym sięga kroków, jakie ludzie rzeczywiście wykonują.",
    claimsHeading: ["Nie piszemy tego,", "czego nie możemy zweryfikować."],
    claimsBody: "Za każdym publikowanym faktem stoi zapis. W okresach, gdy mamy niewiele do powiedzenia, publikujemy niewiele.",
  },

  company: {
    eyebrow: "Firma",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC tworzy produkty, które zamieniają złożoność codziennego życia, pracy i lokalnych społeczności w coś, co człowiek może zrozumieć, z czego może wybrać i na czym może oprzeć działanie. Z siedzibą w Fukuoce rozwijamy dwa projekty: Mirai Move i Kakari.",

    messageEyebrow: "Przesłanie wspólnika zarządzającego",
    messageHeading: ["Oceniamy po tym, czy dociera,", "a nie po tym, czy jest nowoczesne."],
    message: [
      "Nie zajmujemy się nowością.",
      "Przez ponad dwadzieścia lat, w motoryzacji, mobilności i produkcji, stałem między technologią, wdrożeniem a realiami handlowymi. Wciąż powtarzało się to samo: dobrze zbudowany system zatrzymywał się, zanim dotarł do osoby, która go potrzebowała. Nie dlatego, że brakowało technologii, lecz dlatego, że nigdy nie przełożono jej na kroki, jakie ta osoba faktycznie wykonuje.",
      "Systemy i możliwości istnieją już w dużej liczbie. Jeśli jednak ktoś nie potrafi stwierdzić, czy go to dotyczy i co ma zrobić dalej, jest tak, jakby ich w ogóle nie było. Skrócenie tego ostatniego dystansu — przejęcie go przez system, a nie przez jednostkę — jest powodem, dla którego powstało Yorisou.",
      "Nie używamy AI do podejmowania decyzji za człowieka. Używamy jej, aby odczytać sytuację, uporządkować ją jako układ relacji i przedstawić w formie, z której człowiek może skorzystać, podejmując decyzję. Ocena i odpowiedzialność pozostają po stronie człowieka. To, czym zajmujemy się my, i to, w którym miejscu przekazujemy sprawę specjaliście, zapisujemy na samym ekranie.",
      "Jesteśmy wciąż małą firmą i niewiele możemy jeszcze o sobie napisać. Właśnie dlatego piszemy tylko to, co możemy zweryfikować. Rosnąć powinny nie deklaracje, lecz zapis tego, co rzeczywiście dotarło do ludzi.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Wspólnik zarządzający, Yorisou LLC",

    profileEyebrow: "Wspólnik zarządzający",
    profileHeading: ["O wspólniku zarządzającym"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Wspólnik zarządzający, Yorisou LLC",
    profileBody: [
      "Ponad dwadzieścia lat doświadczenia zawodowego w motoryzacji, mobilności, produkcji, rozwoju projektów przemysłowych, łańcuchu dostaw, rozwoju handlowym i rozwoju produktu oraz w transgranicznym biznesie międzynarodowym.",
    ],
    profileBackgroundLabel: "Doświadczenie",
    profileBackground: [
      "Pełnił wyższe funkcje odpowiedzialne za projekty handlowe i przemysłowe w Ficosa, międzynarodowym dostawcy motoryzacyjnym, w tym prace związane z globalnymi projektami przemysłowymi i działalnością handlową w Azji.",
      "Następnie założył i prowadził w Chinach firmy technologiczne i produkcyjne, zajmujące się elektroniką samochodową, systemami sterowania, produkcją precyzyjną oraz rozwojem produktów i systemów wykorzystujących AI.",
      "Pracował na wielu rynkach, w tym w Europie, Chinach i Japonii.",
      "Obecnie pełni funkcję wspólnika zarządzającego Yorisou LLC w Japonii i buduje firmę z Fukuoki.",
    ],
    profileEducationLabel: "Wykształcenie",
    profileEducation: [
      "MBA, IESE Business School",
      "General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Dlaczego to doświadczenie ma tu znaczenie",
    profileRelevance: [
      "Długa praktyka zawodowa w złożonych, rzeczywistych branżach.",
      "Praca w miejscu, w którym spotykają się technologia, produkcja, realizacja handlowa i rynki międzynarodowe.",
      "Bezpośredni kontakt z różnicą między tym, co system potrafi, a tym, z czego człowiek lub organizacja może naprawdę skorzystać.",
      "I stąd powód, by tworzyć produkty zamieniające złożoność w coś zrozumiałego i wykonalnego.",
    ],

    overviewEyebrow: "Informacje o firmie",
    overviewHeading: ["Informacje o firmie"],
    facts: [
      { label: "Nazwa", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Wspólnik zarządzający", value: "Jin Yang" },
      { label: "Siedziba", value: "Fukuoka, prefektura Fukuoka, Japonia" },
      { label: "Działalność", value: "Planowanie, rozwój i prowadzenie Mirai Move oraz Kakari" },
    ],

    businessEyebrow: "Obszary działalności",
    businessHeading: ["Obszary działalności"],
    businessBody: "Informacja, kojarzenie partnerów i rozwój biznesu w sektorze mobilności oraz wielojęzyczne wsparcie w procedurach administracyjnych i dokumentach dla osób mieszkających w Japonii i rozpoczynających tu działalność. Oba obszary prowadzimy według tej samej zasady: przejąć złożoność i oddać coś użytecznego.",

    projectsEyebrow: "Projekty",
    projectsHeading: ["Co budujemy"],

    originEyebrow: "Gdzie jesteśmy",
    originHeading: ["Zaczynamy z Fukuoki."],
    originBody: [
      "Yorisou LLC buduje firmę w mieście Fukuoka w Japonii.",
      "To miejsce, w którym codzienne życie, praca i społeczność są blisko siebie — i w którym projektowanie może zaczynać się od kroków, jakie ludzie rzeczywiście wykonują.",
    ],

    ctaHeading: ["Kontakt"],
    ctaBody: "Przyjmujemy zapytania dotyczące naszej działalności, możliwej współpracy i kontaktu dla mediów.",
  },

  contact: {
    eyebrow: "Kontakt",
    heading: ["Kontakt"],
    lead: "Przyjmujemy zapytania dotyczące naszej działalności, możliwej współpracy i kontaktu dla mediów. Odpowiadamy kolejno, stosownie do treści zapytania.",
    channelsHeading: ["O co możesz zapytać"],
    channels: [
      { title: "Zapytania ogólne", body: "Pytania o Yorisou jako firmę i o projekty, które budujemy." },
      { title: "Biznes i współpraca", body: "Rozmowy o współpracy lub kwestiach handlowych w obszarze mobilności albo procedur administracyjnych." },
      { title: "Prasa i media", body: "Prośby o wywiad oraz pytania dotyczące firmy i jej wspólnika zarządzającego." },
    ],
    formHeading: ["Wyślij wiadomość"],
    formIntro: "Skorzystaj z poniższego formularza. Czytamy każde zapytanie i odpowiadamy kolejno.",
    fields: {
      name: "Imię i nazwisko", namePlaceholder: "Twoje imię i nazwisko",
      email: "Adres e-mail", emailPlaceholder: "you@example.com",
      org: "Firma lub organizacja", orgPlaceholder: "Opcjonalnie",
      type: "Rodzaj zapytania",
      message: "Wiadomość", messagePlaceholder: "Opisz kontekst sprawy i to, co chcesz ustalić.",
    },
    types: [
      { value: "general", label: "Zapytanie ogólne" },
      { value: "business", label: "Biznes i współpraca" },
      { value: "media", label: "Prasa i media" },
    ],
    submit: "Wyślij",
    sending: "Wysyłanie…",
    successTitle: "Wiadomość wysłana",
    successBody: "Otrzymaliśmy Twoje zapytanie. Zapoznamy się z nim i odpowiemy kolejno.",
    errorTitle: "Nie udało się wysłać",
    errorBody: "Odczekaj chwilę i spróbuj ponownie.",
    required: "Pole wymagane",
    privacyNote: "Podane dane osobowe wykorzystujemy wyłącznie w celu udzielenia odpowiedzi na zapytanie.",
  },
};
