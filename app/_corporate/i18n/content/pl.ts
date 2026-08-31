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
    home: { title: "Yorisou LLC — Od problemów strukturalnych do firm, które stoją o własnych siłach.", description: "Yorisou LLC działa jak foundry: znajdujemy problemy strukturalne, gromadzimy dowody i budujemy zasoby przedsięwzięcia, a wraz z zespołami założycielskimi doprowadzamy je do samodzielnych firm. Rozwijamy Mirai Move, Kakari i Chigamo." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Platforma informacji, kojarzenia partnerów i rozwoju biznesu w japońskim sektorze mobilności. Strona publiczna działa, funkcje platformy są w fazie rozwoju." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Wielojęzyczne wsparcie w procedurach administracyjnych i dokumentach dla osób mieszkających w Japonii oraz rozpoczynających tu działalność. W fazie rozwoju, jeszcze niedostępne publicznie." },
    about: { title: "Jak budujemy — Yorisou LLC", description: "Znaleźć problem, sprawdzić go, zaprojektować przedsięwzięcie, zebrać zespół założycielski i doprowadzić rzecz do niezależnej firmy. Jak działa foundry Yorisou i gdzie mieści się wspólna infrastruktura." },
    company: { title: "Firma — Yorisou LLC", description: "Informacje o firmie, profil wspólnika zarządzającego, jego przesłanie oraz obszary działalności Yorisou LLC." },
    contact: { title: "Kontakt — Yorisou LLC", description: "Zapytania dotyczące naszej działalności, współpracy i kontaktu dla mediów." },
    ventures: { title: "Przedsięwzięcia — Yorisou LLC", description: "Nad czym Yorisou pracuje teraz: Mirai Move, Kakari i Chigamo. Każde jest na innym etapie i tak też go opisujemy." },
    buildWithUs: { title: "Buduj z nami — Yorisou LLC", description: "Drogi wejścia dla założycieli, badaczy, zespołów publicznych i firm. Nie prowadzimy otwartego naboru — zaczynamy od rozmowy." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Koncepcja: sprawić, by to, co w danym miejscu naprawdę ma znaczenie, dało się odnaleźć na podstawie lokalizacji i kontekstu. Etap koncepcji, nic nie jest publicznie dostępne." },
  },

  common: {
    readMore: (name) => `Więcej o ${name}`,
    backHome: "Powrót do informacji o firmie",
    stageLabel: "Obecny etap",
    boundaryLabel: "Czego się nie podejmujemy",
    nowLabel: "Teraz",
    nextLabel: "Następny krok",
    whoLabel: "Z kim chcemy rozmawiać",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Z problemów strukturalnych", "budujemy firmy,", "które stoją na własnych nogach."],
    lead: [
      "Yorisou to foundry: znajdujemy strukturalne problemy społeczne, sprawdzamy je i projektujemy z nich przedsięwzięcia,",
      "a razem z ludźmi, którzy będą nimi kierować, doprowadzamy je do samodzielnych firm.",
    ],
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
    buildHeading: ["Trzy obszary,", "nad którymi pracujemy teraz."],

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

    /* CORP-v1.2 — warstwa Asterion i warstwa współpracy na stronie głównej. */
    asterionEyebrow: "Wspólna infrastruktura",
    asterionHeading: ["Z każdą budową", "fundament rośnie."],
    asterionBody:
      "Asterion OS to niezależna, wspólna platforma technologiczna i wykonawcza, wpisana w koncepcję foundry Yorisou. Ponieważ wspólny grunt już istnieje, każde przedsięwzięcie może poświęcić wysiłek tej części, która naprawdę jest jego własna.",
    asterionNote:
      "Każde przedsięwzięcie podlega odrębnemu zarządzaniu i zachowuje swoją własność intelektualną, dane oraz odpowiedzialność operacyjną. Asterion nie należy do Yorisou.",
    engageEyebrow: "Buduj z nami",
    engageHeading: ["Wejdź, zanim", "stanie się to firmą."],
    engageBody:
      "Założyciele, badacze, zespoły publiczne, firmy. To, gdzie możesz się włączyć, zależy od tego, po której stronie stoisz. Zaczynamy od tego, o czym da się rozmawiać już teraz.",
    engageCta: "Zobacz możliwe drogi",
    engageNote: "Każda z tych dróg zaczyna się dziś od rozmowy. Nie prowadzimy jeszcze naboru zgłoszeń ani selekcji.",
    explainerLabel: "Yorisou w 30 sekund",
    explainerHeading: ["Od problemu do firmy,", "w trzydzieści sekund."],
    explainerClose: "Zamknij",
  },

  mirai: {
    reading: "Doprowadzić lokalną mobilność aż do rozwiązania.",
    now: "Strona publiczna działa, a system, który stale czyta źródła publiczne, pracuje automatycznie. Ale na zewnątrz nie wyszło jeszcze nic — ani razu.",
    next: "W pierwszym realnym przypadku zostały kwestie, których nie da się rozstrzygnąć zza biurka. Od tego miejsca kolej na człowieka.",
    who: "Osoby, które znają lokalną mobilność od środka — z samorządu, od przewoźnika, z samej praktyki — i potrafią opisać rzeczywiste ograniczenia.",
    join: {
      title: "Włącz się w to przedsięwzięcie",
      body: "Potrzebujemy teraz kogoś, kto konkretnie opisze ograniczenia panujące w praktyce. To etap sprawdzania, a nie sprzedawania.",
      roles: [
        "Zajmujesz się lokalnym transportem i mobilnością — w samorządzie, u przewoźnika albo w samej praktyce",
        "Możesz unieść ten obszar jako założyciel lub osoba prowadząca",
        "Wiesz, jak wygląda codzienna eksploatacja",
      ],
      state: "Jesteśmy na etapie słuchania. Nie ma otwartego naboru.",
    },
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
    reading: "Żeby procedury w Japonii dało się przejść samodzielnie.",
    now: "Etap zamkniętych testów. Nie jest publicznie dostępne i nikt jeszcze z tego nie korzysta.",
    next: "Formalności potrzebne do dystrybucji oraz ustalenie danych rejestrowych samej firmy. Jedno i drugie wymaga potwierdzenia z zewnątrz.",
    who: "Osoby z zagranicznym paszportem mieszkające w Japonii, osoby, które je wspierają, oraz licencjonowani specjaliści.",
    join: {
      title: "Włącz się w to przedsięwzięcie",
      body: "Chcemy, żeby najpierw obejrzeli to ludzie, którzy wiedzą, jak te procedury wyglądają naprawdę. To nie jest narzędzie, które zastępuje specjalistę.",
      roles: [
        "Masz za sobą realne kłopoty z procedurą w Japonii",
        "Wspierasz w jakiejś formie osoby z zagranicy mieszkające w Japonii",
        "Jesteś licencjonowanym specjalistą i możesz z nami sprawdzić, gdzie powinna przebiegać granica",
        "Możesz unieść to przedsięwzięcie jako założyciel lub osoba prowadząca",
      ],
      state: "Szukamy osób, którym możemy to pokazać. Nic nie jest publiczne i nic nie jest otwarte.",
    },
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

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────────── */
  ventures: {
    eyebrow: "Co budujemy teraz",
    heading: ["Trzy obszary,", "każdy tuż przed", "progiem firmy."],
    lead:
      "W każdym z nich przepisy i systemy już istnieją — i zatrzymują się tuż przed osobami, które ich potrzebują. Yorisou wchodzi w tę lukę i nadaje jej kształt, sprawdzając po drodze.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Połączyć informację, kojarzenie partnerów i rozwój biznesu w obszarze mobilności.",
        problem: "Informacje i możliwości są rozdzielone między operatorów, regiony i administrację.",
        building: "Platforma, na której strony z Japonii i spoza niej pracują na tych samych informacjach.",
        status: "W fazie rozwoju i prowadzenia. Strona publiczna działa.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Wielojęzyczne wsparcie w procedurach dla osób mieszkających w Japonii i rozpoczynających tu działalność.",
        problem: "System istnieje, ale bariera języka i kolejności kroków sprawia, że nikt z niego nie korzysta.",
        building: "Sposób na podzielenie procedury na etapy i pokazanie, jak daleko można dojść samodzielnie.",
        status: "W fazie rozwoju. Przygotowania do udostępnienia.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Sprawić, by dane miejsce stało się czytelne dzięki lokalizacji i kontekstowi.",
        problem: "Im bardziej informacja przydałaby się tutaj, tym trudniej ją znaleźć.",
        building: "Odkrywanie najbliższej okolicy w oparciu o lokalizację i kontekst.",
        status: "Etap koncepcji. Weryfikacja jeszcze przed nami.",
      },
    ],
    noteHeading: ["Co ta strona mówi,", "a czego nie mówi."],
    noteBody: [
      "Wymieniamy tu przedsięwzięcia i koncepcje, nad którymi Yorisou pracuje obecnie.",
      "Nie są to zarejestrowane spółki zależne, podmioty, w które zainwestowaliśmy, ani klienci. Każde jest na innym etapie i tak też go opisujemy.",
      "Naszym celem jest, by każde stanęło jako niezależna firma. Żadne jeszcze do tego punktu nie doszło.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    reading: "Zrozumieć miejsce z jego wnętrza.",
    now: "Etap koncepcji. Nie ma udostępnionego produktu, nie ma użytkowników ani programu prowadzonego z samorządem.",
    next: "Czy zawężenie do lokalizacji i kontekstu rzeczywiście czyni informację użyteczną. Chcemy to sprawdzić najpierw w małej skali.",
    who: "Osoby, które naprawdę znają konkretne miejsce i potrafią powiedzieć, w którym momencie lokalna informacja przestaje być użyteczna.",
    join: {
      title: "Włącz się w to przedsięwzięcie",
      body: "To wciąż etap przed weryfikacją. Dlatego szukamy nie tyle osób do budowania, ile takich, które rozbiją naszą hipotezę.",
      roles: [
        "Znasz szczegółowo konkretną okolicę, bo w niej mieszkasz",
        "Masz doświadczenie z danymi lokalizacyjnymi albo regionalnymi",
        "Nie przeszkadza Ci, że to wciąż tylko koncepcja",
      ],
      state: "Etap koncepcji. Nie ustaliliśmy jeszcze, jak taki udział mógłby wyglądać.",
    },
    eyebrow: "Przedsięwzięcie",
    heading: ["Zrozumieć miejsce", "z jego wnętrza."],
    stage: "Etap koncepcji",
    lead:
      "Koncepcja: wykorzystać lokalizację i kontekst, aby pokazać, co w danym miejscu naprawdę się przydaje. Jesteśmy wciąż przed etapem weryfikacji.",
    domain: "Najbliższa okolica / lokalizacja i kontekst / odkrywanie",
    conceptEyebrow: "Jak o tym myślimy",
    conceptHeading: ["Informacja istnieje.", "Tylko nie dociera."],
    conceptBody: [
      "To, co najbardziej chcemy wiedzieć o danym miejscu, wyszukiwarka zwraca najgorzej. Nie dlatego, że tej informacji nie ma, lecz dlatego, że nikt nie uporządkował jej względem miejsca i sytuacji.",
      "Gdzie jesteś, kiedy to jest i w jakim położeniu się znajdujesz. Są informacje, które dopiero przy tych trzech warunkach naraz stają się rozpoznawalnie Twoje. Właśnie tym chce zająć się Chigamo.",
    ],
    boundaryTitle: "Na jakim etapie to jest",
    boundaryBody:
      "Chigamo jest na etapie koncepcji. Nie ma udostępnionego produktu, nie ma użytkowników ani programu prowadzonego z samorządem. To, co tu napisaliśmy, jest hipotezą, którą zamierzamy sprawdzić.",
    detail: [
      {
        heading: "Dlaczego teraz",
        body: "Mapy i wyszukiwanie są już dojrzałe. Mimo to pytanie „co ma znaczenie dla mnie w miejscu, w którym stoję” każdy nadal rozstrzyga sam.",
      },
      {
        heading: "Co musimy sprawdzić",
        body: "Czy zawężenie do lokalizacji i kontekstu rzeczywiście czyni informację użyteczną. Chcemy to sprawdzić najpierw w małej skali.",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ─────────────────────────────── */
  foundry: {
    eyebrow: "Jak budujemy",
    heading: ["Od problemu", "do firmy, po kolei."],
    lead:
      "Nie zaczynamy od pomysłu, który nam się spodobał. Znajdujemy problem strukturalny, sprawdzamy go, projektujemy jako przedsięwzięcie, łączymy siły z ludźmi, którzy potrafią je prowadzić, i doprowadzamy je do niezależnej firmy. Ten porządek nazywamy w Yorisou „foundry”.",
    stagesEyebrow: "Etapy",
    stagesHeading: ["Osiem etapów,", "żadnego pominiętego."],
    stages: [
      { no: "01", name: "Teza", body: "Wskazujemy, gdzie leży problem strukturalny — wychodząc od kształtu rzeczywistej pracy, a nie od przeczucia." },
      { no: "02", name: "Dowody", body: "Sprawdzamy, czy problem jest prawdziwy i na kogo spada. Sporo tez ginie właśnie tutaj." },
      { no: "03", name: "Projekt przedsięwzięcia", body: "Zamieniamy rozwiązanie w przedsięwzięcie: kto z niego korzysta i gdzie faktycznie dochodzi do wymiany wartości." },
      { no: "04", name: "Budowa", body: "Budujemy. Korzystamy ze wspólnego gruntu tam, gdzie już istnieje, a wysiłek kierujemy na to, co dla tego przedsięwzięcia specyficzne." },
      { no: "05", name: "Gotowość przedsięwzięcia", body: "Doprowadzamy zasoby i procedury do stanu, w którym ktoś z zewnątrz może je przejąć i prowadzić." },
      { no: "06", name: "Zespół założycielski", body: "Łączymy siły z kimś, kto uniesie to jako własne — jako założyciel, a nie jako pracownik." },
      { no: "07", name: "Usamodzielnienie i prowadzenie", body: "Przedsięwzięcie działa jako niezależna firma, uformowana tak, by nie pozostawała zależna od Yorisou." },
      { no: "08", name: "Wnioski", body: "Zachowujemy i to, co się sprawdziło, i to, co upadło, jako materiał do kolejnego przedsięwzięcia." },
    ],
    independenceHeading: ["Celem jest firma,", "która stoi o własnych siłach."],
    independenceBody: [
      "Celem foundry nie jest powiększanie tego, co znajduje się pod Yorisou. Chodzi o doprowadzenie każdego przedsięwzięcia do punktu, w którym stoi jako niezależna firma.",
      "Dlatego od początku budujemy tak, by dało się to przekazać. Jeśli osoby prowadzące nie mogą podejmować rzeczywistych decyzji, to nie jest jeszcze firma.",
    ],
    asterionEyebrow: "Wspólna technologia i warstwa wykonawcza",
    asterionHeading: ["Nie budujemy", "tego samego dwa razy."],
    asterionBody: [
      "Asterion OS to niezależna, wspólna platforma technologiczna i wykonawcza, wpisana w koncepcję foundry Yorisou. Nie jest własnością Yorisou.",
      "Ponieważ wspólny grunt już istnieje, żadne przedsięwzięcie nie musi budować go od nowa i każde może skupić się na własnej dziedzinie. Wypracowane w ten sposób umiejętności stają się punktem wyjścia dla kolejnego.",
    ],
    asterionBoundaryTitle: "Granica",
    asterionBoundaryBody:
      "Każde przedsięwzięcie podlega odrębnemu zarządzaniu. Własność intelektualna, dane i odpowiedzialność operacyjna należą do przedsięwzięcia. Nic nie jest zaprojektowane tak, aby dane przedsięwzięć lub użytkowników trafiały automatycznie do platformy.",
    economicsHeading: ["Udział wynika z wkładu", "i odpowiedzialności."],
    economicsBody: [
      "Warunki różnią się w zależności od przedsięwzięcia. Nie stosujemy jednego schematu do wszystkiego.",
      "Wspólna jest wyłącznie zasada: udział wynika z wkładu, z podjętego ryzyka i z odpowiedzialności, która trwa dalej. Osoby prowadzące przedsięwzięcie mają rzeczywiste prawo decyzji.",
      "Konkretne warunki omawiamy osobno — dla każdego przedsięwzięcia i każdej osoby. To nie jest coś, co można zapisać na stronie internetowej.",
    ],
    maturityTitle: "Na jakim etapie to jest",
    maturityBody:
      "Ten sposób pracy nie jest sprawdzoną, powtarzalną metodą. Yorisou jest na wczesnym etapie i nie usamodzielniło jeszcze żadnego przedsięwzięcia jako niezależnej firmy. To, co tu opisujemy, jest sposobem, w jaki faktycznie postępujemy — nie deklaracją wyników.",
  },

  /* ── BUILD WITH US (CORP-v1.2) ──────────────────────────────────────── */
  buildWithUs: {
    eyebrow: "Buduj z nami",
    heading: ["Punkt wejścia zależy od tego,", "po której stronie stoisz."],
    lead:
      "Yorisou doprowadza przedsięwzięcie do punktu tuż przed tym, jak stanie się firmą, i dopiero wtedy łączy siły z kimś, kto je uniesie. Nie szukamy więc osób do zatrudnienia, lecz osób, które to przejmą.",
    lanes: [
      {
        key: "founders",
        label: "Założyciele",
        title: "Założyciele i współzałożyciele",
        body:
          "Przejmujesz jako własne przedsięwzięcie doprowadzone tuż pod próg firmy. Wchodzisz w to jako założyciel, a nie jako pracownik — decyzje należą do Ciebie i odpowiedzialność również.",
        invites: [
          "Masz za sobą realne prowadzenie działalności z prawdziwą stroną operacyjną",
          "Potrafisz iść naprzód, gdy wiele rzeczy jest jeszcze nierozstrzygniętych",
          "Znasz od podszewki jeden z obszarów: technologię, produkcję, administrację albo pracę lokalną",
        ],
        offers: "Rozpoznanie i dowody, wczesny produkt, projekt przedsięwzięcia i wspólna infrastruktura. Zaczynasz w połowie drogi, a nie od zera.",
        cannot: "Nie możemy w tym momencie obiecać wynagrodzenia, finansowania ani warunków udziału. Warunki omawiamy osobno dla każdego przedsięwzięcia.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Jesteśmy na etapie słuchania. Nie ma otwartego naboru.",
        cta: "Zgłoś zainteresowanie",
      },
      {
        key: "team",
        label: "Zespół założycielski",
        title: "Zespół założycielski i specjaliści",
        body:
          "Sam założyciel nigdy nie wystarczy. Szukamy osób, które od początku wezmą na siebie jeden z filarów: technologię, stronę operacyjną albo pracę w terenie.",
        invites: [
          "Masz za sobą nie tylko wdrożenie, ale i codzienną eksploatację",
          "Masz doświadczenie w uruchamianiu czegoś w kilkuosobowym zespole",
          "Wiesz, co w tej dziedzinie jest oczywistością",
        ],
        offers: "Miejsce od samego początku i realna swoboda w tym zakresie, który bierzesz na siebie.",
        cannot: "Nie mamy stałych wakatów. Nie możemy powiedzieć, że jesteśmy dziś w stanie kogokolwiek zatrudnić.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Zależy od etapu przedsięwzięcia. Napisz najpierw, co możesz wziąć na siebie.",
        cta: "Zacznij rozmowę",
      },
      {
        key: "users",
        label: "Pierwsi użytkownicy",
        title: "Pierwsi użytkownicy i osoby testujące razem z nami",
        body:
          "Chcemy, żeby ktoś spojrzał na to, co zbudowaliśmy, z pozycji osoby, która tego używa — nie po to, by usłyszeć pochwałę, lecz po to, by dowiedzieć się, w którym miejscu to przestaje działać.",
        invites: [
          "Ten problem realnie Cię dotknął",
          "Potrafisz wprost powiedzieć, co nie zadziałało",
          "Nie masz nic przeciwko oglądaniu czegoś przed udostępnieniem",
        ],
        offers: "Wgląd w coś, co jest w trakcie budowy, i to, że Twoje uwagi wracają do projektu.",
        cannot: "Nie możemy obiecać terminu udostępnienia, uwzględnienia Twojej uwagi ani wynagrodzenia.",
        ventures: ["Kakari", "Mirai Move"],
        state: "Szukamy osób, którym możemy to pokazać. To nie jest formalny nabór.",
        cta: "Zgłoś zainteresowanie",
      },
      {
        key: "research",
        label: "Uczelnie",
        title: "Uczelnie i badania",
        body:
          "Przełożenie wyników badań na coś, z czego korzysta społeczeństwo, wymaga projektowania także po stronie przedsięwzięcia. Szukamy osób, z którymi można wspólnie myśleć o kształceniu przyszłych założycieli i o wdrażaniu badań.",
        invites: [
          "Szukasz miejsca, w którym wyniki badań mogą zostać wdrożone",
          "Chcesz dać studentom i badaczom realne doświadczenie w zakładaniu firm",
          "Wolisz zacząć od wspólnego rozpoznania tematu",
        ],
        offers: "Projektowanie po stronie przedsięwzięcia i praca, która naprawdę się toczy. Możemy zacząć od rozpoznania tematu.",
        cannot: "Nie mamy jeszcze ani umowy o współpracy badawczej, ani środków, ani formalnego partnerstwa.",
        ventures: ["Mirai Move", "Chigamo"],
        state: "Nie mamy za sobą żadnego partnerstwa. Zaczyna się od rozmowy.",
        cta: "Zacznij rozmowę",
      },
      {
        key: "public",
        label: "Sektor publiczny",
        title: "Administracja i sektor publiczny",
        body:
          "W sprawach publicznych przepisy zwykle już są, ale nikt nie przełożył ich na kroki, które mieszkaniec może wykonać. Chcemy wspólnie zaprojektować małą próbę, sposób pomiaru efektu i drogę do rozwiązania, które przetrwa.",
        invites: [
          "Masz problem, który da się sprawdzić w praktyce",
          "Chcesz nadać mu formę, w której efekt da się zmierzyć",
          "Nie chcesz, by skończyło się na jednorazowym pilotażu",
        ],
        offers: "Rozpoznanie, uporządkowane dowody i projekt małej próby.",
        cannot: "Nie mamy za sobą żadnego programu prowadzonego z samorządem i nie możemy udzielić gwarancji formalnych.",
        ventures: ["Mirai Move", "Kakari"],
        state: "Zaczyna się od rozmowy. Nic nie jest w toku.",
        cta: "Porozmawiaj z nami",
      },
      {
        key: "corporate",
        label: "Firmy",
        title: "Firmy",
        body:
          "Jeśli masz u siebie nierozwiązany problem operacyjny, który powinien stać się przedsięwzięciem. Możemy zacząć od wspólnego rozwoju albo od sprawdzenia rozwiązania w praktyce.",
        invites: [
          "W Twojej codziennej pracy jest nierozwiązany problem operacyjny",
          "Szukasz kształtu dla nowego przedsięwzięcia",
          "Szukasz partnera do wspólnego rozwoju",
        ],
        offers: "Możemy zacząć od zaprojektowania problemu na nowo — jako przedsięwzięcia.",
        cannot: "Nie mamy doświadczeń handlowych ani wdrożeń, które moglibyśmy pokazać jako przykłady.",
        ventures: ["Mirai Move", "Kakari", "Chigamo"],
        state: "Zaczyna się od wysłuchania.",
        cta: "Napisz do nas",
      },
    ],
    intakeTitle: "O przyjmowaniu zgłoszeń",
    intakeBody:
      "Obecnie nie prowadzimy naboru zgłoszeń ani programu selekcji. To, co tu opisujemy, jest zaproszeniem, a nie trwającą współpracą czy otwartym stanowiskiem. Zaczynamy od wysłuchania, z czym przychodzisz, i od tego, czy jest o czym rozmawiać.",
    foundingTeamEyebrow: "Zespół założycielski",
    foundingTeamHeading: ["Zaczynamy budować,", "zanim powstanie firma."],
    foundingTeamBody: [
      "Zwykle przedsięwzięcie zaczyna się wtedy, gdy zbiorą się ludzie. Yorisou działa w odwrotnej kolejności: najpierw powstają rozpoznanie i dowody, wczesny produkt oraz projekt przedsięwzięcia, a dopiero potem szukamy osoby, która to przejmie.",
      "Dzięki temu nikt nie zaczyna od czystej kartki. Zaczynasz od przejęcia czegoś, co ma już kształt, i uczynienia z tego swojej sprawy.",
      "Nie zmienia to jednak tego, co znaczy przejąć. Kto ma prawo decyzji, ten ma też odpowiedzialność. Jeśli osoby prowadzące nie mogą podejmować rzeczywistych decyzji, to nie jest jeszcze firma.",
    ],
    ctaHeading: ["Niezależnie od strony,", "wejście jest to samo."],
    ctaBody: "Napisz, co masz na myśli, i wyślij. Czytamy kolejno.",
  },
};
