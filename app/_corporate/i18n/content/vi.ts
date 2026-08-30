import type { SiteCopy } from "../types";

/**
 * CORP-P5R2 — VIETNAMESE. Translated from the Japanese canonical source (ja.ts), with en.ts used
 * only as a structural reference.
 *
 * This locale may never be stronger than the Japanese. No customer, partner, metric, revenue,
 * funding, market-position, team-size or capability claim appears here that the Japanese does not
 * already make.
 *
 * On the company form: Yorisou is a Japanese godo kaisha (LLC-type company), rendered as an LLC.
 * A joint-stock-company term and a corporate chief-executive title are both legally wrong here;
 * the representative is rendered "thành viên đại diện" throughout.
 *
 * On the representative: "Harvard Business School Executive Education" is stated precisely. It is
 * NOT a Harvard University degree and NOT an HBS MBA, and must never be shortened in a way that
 * implies either. No endorsement by IESE, Harvard, Ficosa, or any government body is implied.
 *
 * On Asterion (CORP-v1.2): Asterion OS is an INDEPENDENT shared technology and execution platform.
 * It is not owned by Yorisou and is not a Yorisou venture. Vietnamese must never render it as
 * "nền tảng của Yorisou" or imply that ventures or user data flow into it. The boundary sentence
 * stays intact.
 *
 * On the ventures (CORP-v1.2): Mirai Move, Kakari and Chigamo are dự án — ventures and concepts.
 * They are never "công ty con", "khoản đầu tư", "khách hàng" or funded companies. Chigamo is at
 * concept stage: no product, no users, no municipal programme.
 */
export const vi: SiteCopy = {
  chrome: {
    skip: "Chuyển đến nội dung chính",
    menu: "Menu",
    menuToggle: "Mở và đóng menu",
    close: "Đóng",
    navLabel: "Điều hướng trang",
    navLabelMobile: "Điều hướng trang (di động)",
    langLabel: "Ngôn ngữ hiển thị",
    langHeading: "Chọn ngôn ngữ",
    langSearch: "Tìm ngôn ngữ",
    langCurrent: "Ngôn ngữ hiện tại",
    previewBadge: "Preview — chưa công bố",
    nav: { home: "Trang chủ", miraiMove: "Mirai Move", kakari: "Kakari", about: "Về chúng tôi", company: "Thông tin công ty", contact: "Liên hệ" },
    footerTagline: "Giữa con người và xã hội, chúng tôi tạo nên sự đồng hành tiếp theo.",
    footerProjects: "Dự án",
    footerCompany: "Công ty",
    footerLegalNote: "Những điều được nêu ở đây đều dựa trên hồ sơ mà chúng tôi xác minh được.",
    backToTop: "Về đầu trang",
  },

  meta: {
    home: { title: "Yorisou LLC — Từ những vấn đề mang tính cấu trúc đến những công ty đứng vững độc lập.", description: "Yorisou LLC là một foundry — xưởng kiến tạo doanh nghiệp: chúng tôi tìm ra những vấn đề mang tính cấu trúc, dựng nên bằng chứng và tài sản cho từng dự án, rồi cùng các nhóm sáng lập đưa chúng thành những công ty độc lập. Hiện chúng tôi đang triển khai Mirai Move, Kakari và Chigamo." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Nền tảng thông tin, kết nối và phát triển kinh doanh trong lĩnh vực di chuyển tại Nhật Bản. Trang thông tin công khai đang hoạt động; các tính năng nền tảng đang trong giai đoạn phát triển." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Hỗ trợ đa ngôn ngữ cho thủ tục hành chính và giấy tờ, dành cho người đang sinh sống tại Nhật Bản và người bắt đầu kinh doanh tại đây. Hiện đang trong giai đoạn phát triển, chưa mở cho công chúng." },
    about: { title: "Cách chúng tôi xây dựng — Yorisou LLC", description: "Tìm ra vấn đề, kiểm chứng nó, thiết kế thành một hoạt động kinh doanh, rồi cùng nhóm sáng lập đưa nó thành một công ty độc lập. Cách vận hành foundry của Yorisou, và vị trí của hạ tầng dùng chung." },
    company: { title: "Thông tin công ty — Yorisou LLC", description: "Tổng quan công ty, hồ sơ người đại diện, thông điệp của người đại diện và các lĩnh vực hoạt động của Yorisou LLC." },
    contact: { title: "Liên hệ — Yorisou LLC", description: "Đầu mối tiếp nhận trao đổi về hoạt động kinh doanh, hợp tác và báo chí." },
    ventures: { title: "Dự án — Yorisou LLC", description: "Những dự án và ý tưởng Yorisou đang theo đuổi: Mirai Move, Kakari và Chigamo. Mỗi dự án ở một giai đoạn khác nhau, và chúng tôi ghi đúng giai đoạn đó." },
    buildWithUs: { title: "Cùng xây dựng — Yorisou LLC", description: "Lối vào dành cho nhà sáng lập, nhà nghiên cứu, khu vực công và doanh nghiệp. Hiện không có chương trình tuyển chọn nào; mọi việc bắt đầu từ một cuộc trò chuyện." },
    chigamo: { title: "Chigamo — Yorisou LLC", description: "Ý tưởng về việc dựa vào vị trí và bối cảnh để thấy được điều thực sự hữu ích tại một nơi chốn. Hiện ở giai đoạn ý tưởng, chưa có sản phẩm nào được công bố." },
  },

  common: {
    readMore: (name) => `Tìm hiểu thêm về ${name}`,
    backHome: "Quay lại trang thông tin công ty",
    stageLabel: "Giai đoạn hiện tại",
    boundaryLabel: "Phạm vi chúng tôi không đảm nhận",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Từ những vấn đề mang tính cấu trúc,", "chúng tôi gây dựng những công ty", "đứng vững độc lập."],
    lead: [
      "Yorisou là một foundry — xưởng kiến tạo doanh nghiệp: chúng tôi tìm ra những vấn đề mang tính cấu trúc của xã hội,",
      "kiểm chứng, thiết kế chúng thành mô hình kinh doanh, rồi bắt tay cùng những người sẽ vận hành",
      "để đưa từng dự án trở thành một công ty độc lập.",
    ],
    humanSide: "Con người",
    humanItems: ["Đời sống", "Công việc", "Cộng đồng"],
    systemSide: "Hệ thống",
    systemItems: ["Di chuyển", "Thủ tục hành chính"],
    fieldCaption: "Con người — đời sống, công việc, cộng đồng  /  Hệ thống — di chuyển, thủ tục hành chính",
    fieldRelation: "Mối quan hệ",

    whyEyebrow: "Những vấn đề chúng tôi theo đuổi",
    whyHeading: ["Sự phức tạp không thể tháo gỡ", "chỉ bằng nỗ lực của mỗi cá nhân."],
    whyBeats: [
      { no: "01", title: "“Không biết phải làm sao” chặn người ta ngay từ cửa.", body: "Một cơ chế tồn tại nhưng không thể tiếp cận thì cũng như không có." },
      { no: "02", title: "Đường đến chuyên gia còn quá xa.", body: "Trước điểm thực sự cần đến phán đoán của con người, vẫn còn một quãng mà hệ thống lẽ ra có thể đảm nhận." },
      { no: "03", title: "Hiện trường và hệ thống chưa ăn khớp.", body: "Trong lĩnh vực di chuyển, phúc lợi và hành chính, vẫn còn những lựa chọn chưa đến được với người trong cuộc." },
    ],

    buildEyebrow: "Những gì chúng tôi đang xây dựng",
    buildHeading: ["Ba lĩnh vực,", "hiện đang triển khai."],

    howEyebrow: "Cách chúng tôi xây dựng",
    howHeading: ["Chúng tôi nhận lấy sự phức tạp", "và biến nó thành thứ dùng được."],
    howBeats: [
      { no: "01", title: "Bắt đầu từ ngôn ngữ của hiện trường", body: "Chúng tôi không thiết kế từ công nghệ. Chúng tôi đi ngược lại từ chính các bước mà người đang mắc kẹt phải làm." },
      { no: "02", title: "Chịu trách nhiệm đến khi người dùng thật sự hiểu", body: "Đưa ra thông tin không phải là điểm dừng. Việc người dùng biết mình cần làm gì tiếp theo nằm trong phạm vi thiết kế." },
      { no: "03", title: "Nói rõ ranh giới", body: "Chúng tôi không bước vào phần việc thuộc về chuyên gia có chứng chỉ hành nghề. Chúng tôi đảm nhận đến đâu và bàn giao lại cho con người từ đâu đều được ghi rõ ngay trong sản phẩm." },
      { no: "04", title: "Chỉ nói những gì kiểm chứng được", body: "Thành tích, số liệu và quan hệ hợp tác chỉ được nêu khi có bằng chứng. Điều gì không xác minh được, chúng tôi không viết." },
    ],
    howDisclose: "Những nguyên tắc này có nghĩa gì trên thực tế",

    founderEyebrow: "Người đại diện",
    founderHeading: ["Được xây dựng bởi một người đã hai mươi năm", "nhìn tận nơi những hiện trường phức tạp."],
    founderTeaser: "Hơn hai mươi năm trong ngành ô tô, di chuyển, sản xuất và kinh doanh quốc tế, đứng giữa công nghệ, việc triển khai và dòng chảy thương mại. Điều lặp đi lặp lại ở đó là cảnh một cơ chế được làm tốt lại dừng lại trước khi đến được với người cần nó.",
    founderRole: "Thành viên đại diện, Yorisou LLC",
    founderCta: "Về người đại diện",

    messageEyebrow: "Thông điệp",
    messageHeading: ["Không phải bằng công nghệ,", "mà bằng việc có đến được hay không."],
    messageTeaser: "Thứ chúng tôi làm không phải là cái mới. Thiết chế và lựa chọn vốn đã tồn tại, chỉ là chúng dừng lại trước khi đến được với người cần. Chúng tôi đang xây dựng một công ty rút ngắn khoảng cách đó, từng bước một.",
    messageCta: "Đọc toàn văn thông điệp",

    originEyebrow: "Địa bàn hoạt động",
    originHeading: ["Bắt đầu từ Fukuoka."],
    originBody: "Yorisou LLC đang xây dựng công ty từ thành phố Fukuoka, tỉnh Fukuoka, Nhật Bản — nơi đời sống, công việc và cộng đồng ở rất gần nhau, và là nơi việc thiết kế có thể bắt đầu từ chính các bước mà con người thực sự làm.",

    proofEyebrow: "Thông tin công ty",
    proofHeading: ["Chỉ viết những gì", "chúng tôi viết được."],

    ctaEyebrow: "Liên hệ",
    ctaHeading: ["Có thể vẫn còn chỗ", "để chúng ta cùng làm việc."],
    ctaBody: "Chúng tôi tiếp nhận trao đổi về hoạt động kinh doanh, đề xuất hợp tác và đề nghị phỏng vấn từ báo chí. Chúng tôi sẽ lần lượt phản hồi tùy theo nội dung.",
    ctaButton: "Gửi liên hệ",

    /* CORP-v1.2 — Asterion layer and engagement layer on the homepage. */
    asterionEyebrow: "Hạ tầng dùng chung",
    asterionHeading: ["Mỗi lần xây dựng,", "nền móng lại dày thêm."],
    asterionBody:
      "Asterion OS là một nền tảng công nghệ và thực thi dùng chung, độc lập, được đặt trong kiến trúc foundry của Yorisou. Vì phần nền chung đã có sẵn, mỗi dự án không phải dựng lại cùng một cơ chế và có thể dồn sức vào phần thuộc về lĩnh vực của riêng mình.",
    asterionNote:
      "Mỗi dự án được quản trị riêng biệt, và tự giữ quyền sở hữu trí tuệ, dữ liệu cùng trách nhiệm vận hành của mình. Asterion không thuộc sở hữu của Yorisou.",
    engageEyebrow: "Cùng xây dựng",
    engageHeading: ["Hãy tham gia ngay khi dự án", "vẫn đang trên đường thành một công ty."],
    engageBody:
      "Nhà sáng lập, nhà nghiên cứu, khu vực công, doanh nghiệp. Bạn tham gia được ở đâu là tùy vào vị trí bạn đang đứng. Chúng tôi bắt đầu từ những gì có thể trao đổi ngay lúc này.",
    engageCta: "Xem các cách tham gia",
  },

  mirai: {
    eyebrow: "Dự án 01",
    heading: ["Nền tảng thông tin, kết nối", "và phát triển kinh doanh", "trong lĩnh vực di chuyển tại Nhật Bản."],
    stage: "Trang công khai đang hoạt động / các tính năng nền tảng đang phát triển",
    lead: "Mirai Move hướng tới việc kết nối cơ quan nhà nước và chính quyền địa phương, doanh nghiệp, các cơ sở chăm sóc — phúc lợi — cộng đồng, nhà cung cấp nước ngoài và đối tác trong nước, để thông tin và cơ hội về di chuyển được xử lý như một dòng chảy duy nhất. Hiện trang thông tin công khai đang hoạt động; các tính năng nền tảng vẫn đang trong giai đoạn phát triển.",
    domain: "Lĩnh vực di chuyển tại Nhật Bản",
    networkEyebrow: "Những bên được kết nối",
    networkHeading: ["Những bên ở vị trí khác nhau", "đang nhìn cùng một cơ hội", "bằng những ngôn ngữ khác nhau."],
    centre: "Cơ hội di chuyển",
    parties: [
      { no: "01", title: "Cơ quan nhà nước và chính quyền địa phương", body: "Phía nắm thiết chế và ngân sách" },
      { no: "02", title: "Doanh nghiệp", body: "Phía cung ứng và triển khai" },
      { no: "03", title: "Cộng đồng và các cơ sở chăm sóc, phúc lợi", body: "Nơi việc di chuyển thực sự diễn ra" },
      { no: "04", title: "Nhà cung cấp nước ngoài và đối tác trong nước", body: "Phía mang đến các lựa chọn" },
    ],
    boundaryTitle: "Về tình trạng phát triển",
    boundaryBody: "Bản thân nền tảng đang trong giai đoạn phát triển. Chúng tôi không kích hoạt việc tự động thực thi bằng tác nhân tự hành. Mọi thao tác có tác động ra bên ngoài đều được thiết kế với điều kiện phải có xác nhận của con người. Sản phẩm không được cung cấp như một nền tảng hoàn chỉnh với đầy đủ tính năng.",
    detail: [
      { heading: "Vấn đề đang xử lý", body: "Các lựa chọn di chuyển tồn tại tách rời theo từng địa phương, từng thiết chế, từng đơn vị vận hành. Người đang cần và lựa chọn vốn đã có lại không gặp nhau ở cùng một nơi." },
      { heading: "Những bên chúng tôi làm việc cùng", body: "Cơ quan nhà nước và chính quyền địa phương, doanh nghiệp, các cơ sở chăm sóc — phúc lợi — cộng đồng, nhà cung cấp nước ngoài và đối tác trong nước. Những bên có vị trí và tiêu chí đánh giá khác nhau đang nhìn cùng một cơ hội bằng những ngôn ngữ khác nhau." },
      { heading: "Những gì đang chạy hiện nay", body: "Trang thông tin công khai đang hoạt động. Các chức năng thông tin, kết nối và phát triển kinh doanh của nền tảng đang ở giai đoạn xây dựng nền móng và kiến trúc." },
    ],
    siteLabel: "Trang công khai",
    siteUrl: "https://www.miraimove.com",
  },

  kakari: {
    eyebrow: "Dự án 02",
    heading: ["Hỗ trợ thủ tục đa ngôn ngữ", "dành cho người sinh sống tại Nhật Bản", "và người bắt đầu kinh doanh tại đây."],
    stage: "Đang phát triển (chưa mở cho công chúng)",
    lead: "Khi rào cản là tiếng Nhật và kiến thức chuyên môn, người ta không thể tiếp cận những thiết chế lẽ ra mình được sử dụng. Kakari hỗ trợ đa ngôn ngữ từ việc chỉ ra thông tin cần thiết, chuẩn bị giấy tờ, điền biểu mẫu, cho đến hướng dẫn quy trình nộp và gửi qua bưu điện. Hiện dự án đang trong giai đoạn phát triển và chưa mở cho công chúng.",
    domain: "Thủ tục hành chính và giấy tờ / đa ngôn ngữ",
    procedureEyebrow: "Quy trình được hỗ trợ",
    procedureHeading: ["Từ lúc tìm hiểu,", "đến lúc nộp hồ sơ."],
    steps: [
      { no: "01", title: "Tìm hiểu", body: "Xác định thủ tục nào liên quan đến bạn" },
      { no: "02", title: "Chuẩn bị giấy tờ", body: "Rà soát các giấy tờ và tài liệu đính kèm cần thiết" },
      { no: "03", title: "Soạn hồ sơ", body: "Điền bằng ngôn ngữ của bạn và kiểm tra lại nội dung" },
      { no: "04", title: "Nộp hồ sơ", body: "Hướng dẫn nơi nộp, cách nộp và quy trình gửi qua bưu điện" },
    ],
    boundaryTitle: "Phạm vi thuộc về chuyên gia",
    boundaryBody: "Chúng tôi không làm đại diện thay cho người hành nghề có chứng chỉ. Những lĩnh vực cần đến phán định pháp lý, thuế vụ hoặc phán định của cơ quan công quyền được nêu rõ là phần việc do chuyên gia đảm nhận. Các phán đoán hoặc việc đại diện đòi hỏi chứng chỉ hành nghề — như luật sư, kế toán thuế hay chuyên viên thủ tục hành chính được cấp phép (gyosei shoshi) — không nằm trong các chức năng của Kakari.",
    detail: [
      { heading: "Vấn đề đang xử lý", body: "Cách thực hiện thủ tục vốn là thông tin công khai. Dù vậy, chỉ vì thiếu ngôn ngữ và kiến thức nền, vẫn có những người không thể tiếp cận được thiết chế. Đó không phải là vấn đề năng lực của họ." },
      { heading: "Những người chúng tôi hướng đến", body: "Người đang sinh sống tại Nhật Bản và người sắp bắt đầu kinh doanh tại đây — những người ở trong hoàn cảnh khó tự mình hoàn tất thủ tục bằng tiếng Nhật." },
      { heading: "Những gì đang chạy hiện nay", body: "Nền tảng xác thực đã được dựng trong một môi trường kiểm chứng độc lập, nơi phân quyền và lưu trữ đang được kiểm chứng. Các kết nối bên ngoài vẫn đang bị vô hiệu hóa và dự án chưa mở cho công chúng." },
    ],
  },

  about: {
    eyebrow: "Về chúng tôi",
    heading: ["Cách chúng tôi xây dựng", "chính là lời cam kết của chúng tôi."],
    lead: "Yorisou nhìn thẳng vào sự phức tạp trong đời sống, công việc và cộng đồng địa phương, và tạo ra những sản phẩm giúp con người hiểu, lựa chọn và tiến về phía trước.",
    whyHeading: ["Vì sao công ty này tồn tại."],
    whyBody: [
      "Thiết chế, công nghệ và các lựa chọn đều đã tồn tại rất nhiều. Vậy mà chúng vẫn dừng lại trước khi đến được với người đang cần. Khoảng cách cuối cùng đó là thứ chúng tôi đối diện.",
      "Khoảng cách này thường được nói đến như vấn đề nỗ lực hay lượng thông tin của mỗi cá nhân. Nhưng trên thực tế, phần nhiều chỉ là sự phức tạp mà lẽ ra hệ thống có thể gánh lấy lại được trao thẳng sang cho cá nhân.",
    ],
    thinkHeading: ["Chúng tôi tư duy thế nào."],
    thinkBody: [
      "Chúng tôi không thiết kế từ công nghệ. Chúng tôi bắt đầu từ việc tháo gỡ đúng nước đi đang mắc kẹt: đọc hiểu hoàn cảnh của con người, sắp xếp nó thành các mối quan hệ, và đưa đến trạng thái mà người ta biết mình cần làm gì tiếp theo. Đó là phạm vi thiết kế của chúng tôi.",
      "AI được dùng cho việc hiểu và cấu trúc hóa đó, chứ không phải để thay con người ra quyết định. Vai trò của nó là sắp xếp những dữ kiện cần thiết thành dạng dùng được, để con người tự đưa ra phán đoán.",
    ],
    buildHeading: ["Chúng tôi xây dựng thế nào."],
    principles: [
      { no: "01", title: "Bắt đầu từ ngôn ngữ của hiện trường", body: "Chúng tôi không thiết kế từ công nghệ. Chúng tôi đi ngược lại từ chính các bước mà người đang mắc kẹt phải làm." },
      { no: "02", title: "Chịu trách nhiệm đến khi người dùng thật sự hiểu", body: "Đưa ra thông tin không phải là điểm dừng. Việc người dùng biết mình cần làm gì tiếp theo nằm trong phạm vi thiết kế." },
      { no: "03", title: "Nói rõ ranh giới", body: "Chúng tôi không bước vào phần việc thuộc về chuyên gia có chứng chỉ hành nghề. Chúng tôi đảm nhận đến đâu và bàn giao lại cho con người từ đâu đều được ghi rõ ngay trong sản phẩm." },
      { no: "04", title: "Chỉ nói những gì kiểm chứng được", body: "Thành tích, số liệu và quan hệ hợp tác chỉ được nêu khi có bằng chứng. Điều gì không xác minh được, chúng tôi không viết." },
    ],
    principlesLong: [
      { no: "01", title: "Bắt đầu từ ngôn ngữ của hiện trường", long: "Không một thiết chế nào đến được với ai nếu chưa được dịch sang các bước mà người dùng thực sự phải làm. Chúng tôi bắt đầu từ hồ sơ thật, chuyến đi thật, cuộc trao đổi thật — không phải từ một đề bài trừu tượng, mà từ đúng nước đi đang mắc kẹt ngay trước mắt." },
      { no: "02", title: "Chịu trách nhiệm đến khi người dùng thật sự hiểu", long: "Bày ra một danh sách kết quả tìm kiếm không phải là hỗ trợ. Điều người ta cần là biết ngay lúc này mình phải làm gì. Phạm vi của sản phẩm kéo dài đến khi bước tiếp theo được hiểu rõ, chứ không dừng ở chỗ thông tin đã được hiển thị." },
      { no: "03", title: "Nói rõ ranh giới", long: "Để người dùng sử dụng sản phẩm mà không nói rõ những gì nó không làm được là thiết kế nguy hiểm nhất. Chúng tôi đảm nhận đến đâu và bàn giao cho chuyên gia từ đâu đều được viết ngay trên màn hình sản phẩm. Ranh giới là một phần của chức năng, không phải một dòng lưu ý." },
      { no: "04", title: "Chỉ nói những gì kiểm chứng được", long: "Chúng tôi không nói trước về những thành tích chưa xác minh được hay những tính năng chưa vận hành. Mọi sự thật được đăng tải đều có hồ sơ chứng minh phía sau. Giai đoạn nào viết được ít, chúng tôi để nó ít như vậy." },
    ],
    orderHeading: ["Từng việc một,", "làm đến cùng."],
    orderBody: "Chúng tôi không khởi động nhiều thứ cùng lúc. Chúng tôi ưu tiên làm trọn vẹn một lĩnh vực, cho đến khi nó chạm được vào các bước mà con người thực sự làm.",
    claimsHeading: ["Điều gì không xác minh được,", "chúng tôi không viết."],
    claimsBody: "Mọi sự thật được đăng tải đều có hồ sơ chứng minh phía sau. Giai đoạn nào viết được ít, chúng tôi để nó ít như vậy.",
  },

  company: {
    eyebrow: "Thông tin công ty",
    heading: ["Yorisou LLC"],
    intro: "Yorisou LLC là công ty tạo ra những sản phẩm biến sự phức tạp trong đời sống, công việc và cộng đồng địa phương thành thứ mà con người có thể hiểu, lựa chọn và hành động. Lấy Fukuoka làm địa bàn, chúng tôi đang triển khai hai dự án: Mirai Move và Kakari.",

    messageEyebrow: "Thông điệp của người đại diện",
    messageHeading: ["Không phải bằng công nghệ,", "mà bằng việc có đến được hay không."],
    message: [
      "Thứ chúng tôi làm không phải là cái mới.",
      "Hơn hai mươi năm trong ngành ô tô, di chuyển và sản xuất, tôi đã đứng giữa công nghệ, việc triển khai và dòng chảy thương mại. Điều tôi thấy lặp đi lặp lại là cảnh một cơ chế được làm tốt lại dừng lại trước khi đến được với người cần nó. Không phải vì thiếu công nghệ, mà vì nó chưa được dịch sang các bước mà chính người đó phải làm.",
      "Thiết chế và lựa chọn thì đã có rất nhiều. Nhưng nếu người ta không biết “việc này có liên quan đến mình không”, “tiếp theo phải làm gì”, thì cũng như không có. Để phía hệ thống gánh lấy khoảng cách cuối cùng ấy — đó là lý do tôi lập nên Yorisou.",
      "Chúng tôi không dùng AI để thay con người ra quyết định. Chúng tôi dùng AI để đọc hiểu hoàn cảnh, sắp xếp thành các mối quan hệ và chuẩn bị thành dạng dùng được, để con người tự phán đoán. Phán đoán và trách nhiệm vẫn thuộc về con người. Chúng tôi đảm nhận đến đâu và bàn giao cho chuyên gia từ đâu đều được viết ngay trên màn hình sản phẩm.",
      "Công ty vẫn còn nhỏ, và những điều viết được cũng chưa nhiều. Chính vì vậy, chúng tôi chỉ viết những gì đã xác minh được. Thứ cần tăng lên không phải là lời tuyên bố, mà là những kết quả thực sự đã đến nơi.",
    ],
    messageSignature: "Jin Yang",
    messageRole: "Thành viên đại diện, Yorisou LLC",

    profileEyebrow: "Người đại diện",
    profileHeading: ["Về thành viên đại diện"],
    profileName: "Jin Yang",
    profileNameLatin: "Jin Yang / Edward Jin",
    profileRole: "Thành viên đại diện, Yorisou LLC",
    profileBody: [
      "Hơn hai mươi năm kinh nghiệm thực tiễn trong ngành ô tô, di chuyển, sản xuất, phát triển dự án công nghiệp, chuỗi cung ứng, phát triển thương mại, phát triển sản phẩm, và kinh doanh quốc tế xuyên biên giới.",
    ],
    profileBackgroundLabel: "Quá trình công tác",
    profileBackground: [
      "Đảm nhiệm các trách nhiệm cấp cao về dự án thương mại và công nghiệp tại Ficosa, một nhà cung cấp linh kiện ô tô quốc tế, tham gia các dự án công nghiệp toàn cầu và hoạt động thương mại tại khu vực châu Á.",
      "Sau đó sáng lập và điều hành doanh nghiệp công nghệ, sản xuất tại Trung Quốc, với công việc liên quan đến điện tử ô tô, hệ thống điều khiển, chế tạo chính xác và phát triển sản phẩm, hệ thống có ứng dụng AI.",
      "Có kinh nghiệm vận hành kinh doanh quốc tế tại nhiều thị trường, bao gồm châu Âu, Trung Quốc và Nhật Bản.",
      "Hiện là thành viên đại diện của Yorisou LLC tại Nhật Bản, xây dựng công ty từ Fukuoka.",
    ],
    profileEducationLabel: "Học vấn",
    profileEducation: [
      "Thạc sĩ Quản trị Kinh doanh (MBA), IESE Business School",
      "Hoàn thành General Management Program, Harvard Business School Executive Education",
    ],
    profileRelevanceLabel: "Vì sao nền tảng này gắn với Yorisou",
    profileRelevance: [
      "Nhiều năm làm việc thực tiễn xuyên suốt những ngành công nghiệp phức tạp của đời thực.",
      "Từng đứng ở vị trí kết nối công nghệ, sản xuất, triển khai thương mại và thị trường quốc tế.",
      "Trực tiếp chứng kiến khoảng cách giữa những gì một cơ chế hay công nghệ làm được và những gì con người, tổ chức thực sự dùng được.",
      "Và từ đó, đi đến việc tạo ra những sản phẩm biến sự phức tạp thành thứ có thể hiểu và hành động được.",
    ],

    overviewEyebrow: "Tổng quan công ty",
    overviewHeading: ["Tổng quan công ty"],
    facts: [
      { label: "Tên công ty", value: "Yorisou LLC (Yorisou GK)" },
      { label: "Thành viên đại diện", value: "Jin Yang" },
      { label: "Trụ sở", value: "Thành phố Fukuoka, tỉnh Fukuoka, Nhật Bản" },
      { label: "Ngành nghề kinh doanh", value: "Lập kế hoạch, phát triển và vận hành Mirai Move và Kakari" },
    ],

    businessEyebrow: "Lĩnh vực hoạt động",
    businessHeading: ["Lĩnh vực hoạt động"],
    businessBody: "Thông tin, kết nối và phát triển kinh doanh trong lĩnh vực di chuyển; và hỗ trợ đa ngôn ngữ cho thủ tục hành chính, giấy tờ dành cho người sinh sống tại Nhật Bản và người bắt đầu kinh doanh tại đây. Cả hai đều đi theo cùng một phương châm: nhận lấy sự phức tạp và trả lại thứ dùng được.",

    projectsEyebrow: "Dự án",
    projectsHeading: ["Những gì chúng tôi đang xây dựng"],

    originEyebrow: "Địa bàn hoạt động",
    originHeading: ["Bắt đầu từ Fukuoka."],
    originBody: [
      "Yorisou LLC đang xây dựng công ty từ thành phố Fukuoka, tỉnh Fukuoka, Nhật Bản.",
      "Đó là nơi đời sống, công việc và cộng đồng ở rất gần nhau — nơi việc thiết kế có thể bắt đầu từ chính các bước mà con người thực sự làm.",
    ],

    ctaHeading: ["Liên hệ"],
    ctaBody: "Chúng tôi tiếp nhận trao đổi về hoạt động kinh doanh, đề xuất hợp tác và đề nghị phỏng vấn từ báo chí.",
  },

  contact: {
    eyebrow: "Liên hệ",
    heading: ["Liên hệ"],
    lead: "Chúng tôi tiếp nhận trao đổi về hoạt động kinh doanh, đề xuất hợp tác và đề nghị phỏng vấn từ báo chí. Chúng tôi sẽ lần lượt phản hồi tùy theo nội dung.",
    channelsHeading: ["Những nội dung bạn có thể trao đổi"],
    channels: [
      { title: "Câu hỏi chung", body: "Các câu hỏi về Yorisou với tư cách một công ty và về những dự án chúng tôi đang triển khai." },
      { title: "Kinh doanh và hợp tác", body: "Trao đổi về hợp tác hoặc giao dịch trong lĩnh vực di chuyển và thủ tục hành chính." },
      { title: "Báo chí và truyền thông", body: "Đề nghị phỏng vấn và các câu hỏi về công ty hoặc người đại diện." },
    ],
    formHeading: ["Gửi qua biểu mẫu"],
    formIntro: "Vui lòng gửi qua biểu mẫu dưới đây. Chúng tôi sẽ xem xét nội dung và lần lượt phản hồi.",
    fields: {
      name: "Họ và tên", namePlaceholder: "Nguyễn Văn A",
      email: "Địa chỉ email", emailPlaceholder: "you@example.com",
      org: "Tên công ty hoặc tổ chức", orgPlaceholder: "Không bắt buộc",
      type: "Loại liên hệ",
      message: "Nội dung liên hệ", messagePlaceholder: "Vui lòng cho biết bối cảnh và điều bạn muốn xác nhận.",
    },
    types: [
      { value: "general", label: "Câu hỏi chung" },
      { value: "business", label: "Kinh doanh và hợp tác" },
      { value: "media", label: "Báo chí và truyền thông" },
    ],
    submit: "Gửi",
    sending: "Đang gửi…",
    successTitle: "Đã gửi",
    successBody: "Chúng tôi đã nhận được liên hệ của bạn. Chúng tôi sẽ xem xét nội dung và lần lượt phản hồi.",
    errorTitle: "Không gửi được",
    errorBody: "Vui lòng đợi một lát rồi thử lại.",
    required: "Bắt buộc",
    privacyNote: "Thông tin cá nhân bạn cung cấp chỉ được sử dụng cho mục đích phản hồi liên hệ của bạn.",
  },

  /* ── VENTURES INDEX (CORP-v1.2) ─────────────────────────────────────── */
  ventures: {
    eyebrow: "Những dự án hiện nay",
    heading: ["Ba lĩnh vực, mỗi lĩnh vực", "còn cách một bước", "để trở thành một công ty."],
    lead:
      "Ở cả ba, thiết chế và hệ thống vốn đã tồn tại — và dừng lại ngay trước những người cần đến chúng. Yorisou bước vào đúng khoảng trống đó, vừa làm vừa kiểm chứng.",
    cards: [
      {
        name: "Mirai Move",
        href: "/mirai-move",
        thesis: "Nối liền thông tin, kết nối cung cầu và phát triển kinh doanh trong lĩnh vực di chuyển.",
        problem: "Thông tin và cơ hội bị chia cắt giữa doanh nghiệp, địa phương và cơ quan nhà nước.",
        building: "Một nền tảng để các bên trong và ngoài nước cùng làm việc trên một nguồn thông tin.",
        status: "Đang phát triển và vận hành. Đã có trang công khai.",
      },
      {
        name: "Kakari",
        href: "/kakari",
        thesis: "Hỗ trợ đa ngôn ngữ cho các thủ tục của việc sinh sống và khởi sự kinh doanh tại Nhật Bản.",
        problem: "Thiết chế thì có, nhưng rào cản ngôn ngữ và trình tự khiến chúng không bao giờ được dùng đến.",
        building: "Cách chia một thủ tục thành từng bước và cho thấy bạn tự làm được đến đâu.",
        status: "Đang phát triển. Chuẩn bị công bố.",
      },
      {
        name: "Chigamo",
        href: "/chigamo",
        thesis: "Từ vị trí và bối cảnh, làm cho một nơi chốn trở nên dễ hiểu.",
        problem: "Thông tin thực sự hữu ích ngay tại chỗ lại là thứ khó tìm nhất.",
        building: "Cách khám phá khu vực sinh sống, dựa trên vị trí và bối cảnh.",
        status: "Giai đoạn ý tưởng. Chưa được kiểm chứng.",
      },
    ],
    noteHeading: ["Trang này nói gì,", "và không nói gì."],
    noteBody: [
      "Đây là những dự án và ý tưởng mà Yorisou đang theo đuổi hiện nay.",
      "Chúng không phải là công ty con đã thành lập, không phải khoản đầu tư, cũng không phải khách hàng. Mỗi dự án ở một giai đoạn khác nhau, và chúng tôi ghi đúng giai đoạn đó.",
      "Mục tiêu là để mỗi dự án đứng được như một công ty độc lập. Chưa dự án nào đạt tới đó.",
    ],
  },

  /* ── CHIGAMO (CORP-v1.2) ────────────────────────────────────────────── */
  chigamo: {
    eyebrow: "Dự án",
    heading: ["Hiểu một nơi chốn,", "ngay khi đang ở đó."],
    stage: "Giai đoạn ý tưởng",
    lead:
      "Một ý tưởng: dùng vị trí và bối cảnh để làm hiện lên những gì thực sự hữu ích tại một nơi chốn cụ thể. Dự án vẫn đang ở trước giai đoạn kiểm chứng.",
    domain: "Khu vực sinh sống / vị trí và bối cảnh / khám phá",
    conceptEyebrow: "Điều chúng tôi đang nghĩ",
    conceptHeading: ["Không phải là không có thông tin,", "mà là thông tin không đến nơi."],
    conceptBody: [
      "Những điều bạn muốn biết nhất về một nơi chốn lại là những điều mà tìm kiếm trả về tệ nhất. Không phải vì thông tin không tồn tại, mà vì nó chưa từng được sắp xếp theo nơi chốn và hoàn cảnh.",
      "Bạn đang ở đâu, vào lúc nào, và đang đối diện với chuyện gì. Có những thông tin chỉ trở nên “liên quan đến mình” khi cả ba điều đó khớp lại. Đó là chỗ Chigamo muốn xử lý.",
    ],
    boundaryTitle: "Dự án đang ở đâu",
    boundaryBody:
      "Chigamo đang ở giai đoạn ý tưởng. Chưa có sản phẩm nào được công bố, chưa có người dùng, và chưa có chương trình nào với chính quyền địa phương. Những gì viết ở đây là một giả thuyết mà chúng tôi định kiểm chứng.",
    detail: [
      {
        heading: "Vì sao là lúc này",
        body: "Bản đồ và công cụ tìm kiếm đều đã rất phát triển. Vậy mà “điều gì có ý nghĩa với tôi, ngay tại nơi tôi đang đứng” vẫn là thứ mỗi người phải tự tra lại.",
      },
      {
        heading: "Điều cần kiểm chứng",
        body: "Liệu khi thu hẹp theo vị trí và bối cảnh, thông tin có thực sự trở nên dùng được hay không. Chúng tôi sẽ kiểm chứng điều đó ở quy mô nhỏ trước.",
      },
    ],
  },

  /* ── HOW WE BUILD / FOUNDRY (CORP-v1.2) ─────────────────────────────── */
  foundry: {
    eyebrow: "Cách chúng tôi xây dựng",
    heading: ["Từ một vấn đề", "đến một công ty,", "theo đúng trình tự."],
    lead:
      "Chúng tôi không bắt đầu từ một ý tưởng mình thấy hay. Chúng tôi tìm ra một vấn đề mang tính cấu trúc, kiểm chứng nó, thiết kế nó thành một hoạt động kinh doanh, bắt tay với những người có thể vận hành, rồi đưa nó thành một công ty độc lập. Yorisou gọi trình tự đó là foundry — xưởng kiến tạo doanh nghiệp.",
    stagesEyebrow: "Các giai đoạn",
    stagesHeading: ["Tám giai đoạn,", "không bỏ qua giai đoạn nào."],
    stages: [
      { no: "01", name: "Giả thuyết", body: "Xác định vấn đề mang tính cấu trúc nằm ở đâu — từ hình dạng của công việc thực tế, không phải từ một linh cảm." },
      { no: "02", name: "Bằng chứng", body: "Kiểm chứng xem vấn đề có thật hay không và nó đang rơi lên vai ai. Rất nhiều giả thuyết chết ở đây." },
      { no: "03", name: "Thiết kế kinh doanh", body: "Biến lời giải thành một hoạt động kinh doanh: ai sử dụng, và giá trị thực sự được trao đổi ở đâu." },
      { no: "04", name: "Xây dựng", body: "Bắt tay làm. Dùng lại phần nền chung ở những chỗ đã có, và dồn sức vào phần riêng của dự án này." },
      { no: "05", name: "Sẵn sàng đứng độc lập", body: "Đưa tài sản và quy trình tới trạng thái mà người bên ngoài có thể tiếp nhận và vận hành được." },
      { no: "06", name: "Hình thành nhóm sáng lập", body: "Bắt tay với người có thể gánh dự án như của chính mình — với tư cách nhà sáng lập, không phải người làm thuê." },
      { no: "07", name: "Tách ra và vận hành", body: "Vận hành như một công ty độc lập, được định hình để không tiếp tục phụ thuộc vào Yorisou." },
      { no: "08", name: "Đúc kết", body: "Giữ lại cả những gì đã hiệu quả lẫn những giả thuyết đã chết, làm chất liệu cho dự án tiếp theo." },
    ],
    independenceHeading: ["Mục tiêu là", "một công ty đứng vững độc lập."],
    independenceBody: [
      "Mục đích của foundry không phải là gom thêm thứ gì đó về dưới trướng Yorisou. Mục đích là đưa mỗi dự án đến chỗ tự đứng được như một công ty độc lập.",
      "Vì vậy ngay từ đầu, mọi thứ được làm ra ở dạng có thể bàn giao. Nếu người vận hành không thực sự nắm quyền quyết định, thì nó chưa thành một công ty.",
    ],
    asterionEyebrow: "Nền tảng công nghệ và thực thi dùng chung",
    asterionHeading: ["Không dựng lại", "cùng một thứ hai lần."],
    asterionBody: [
      "Asterion OS là một nền tảng công nghệ và thực thi dùng chung, độc lập, được đặt trong kiến trúc foundry của Yorisou. Nó không thuộc sở hữu của Yorisou.",
      "Vì phần nền chung đã có sẵn, không dự án nào phải dựng lại nó, và mỗi dự án có thể tập trung vào lĩnh vực của riêng mình. Những gì tích lũy được trở thành điểm xuất phát cho dự án tiếp theo.",
    ],
    asterionBoundaryTitle: "Ranh giới",
    asterionBoundaryBody:
      "Mỗi dự án được quản trị riêng biệt. Quyền sở hữu trí tuệ, dữ liệu và trách nhiệm vận hành thuộc về chính dự án đó. Không có thiết kế nào khiến dữ liệu của dự án hay của người dùng tự động chảy về phía nền tảng.",
    economicsHeading: ["Quyền sở hữu đi theo", "đóng góp và trách nhiệm."],
    economicsBody: [
      "Điều kiện khác nhau theo từng dự án. Chúng tôi không áp một công thức cố định cho tất cả.",
      "Chỉ có nguyên tắc là chung: quyền sở hữu đi theo đóng góp, theo rủi ro đã gánh và theo trách nhiệm còn tiếp tục. Người vận hành một dự án nắm quyền quyết định thực sự.",
      "Các điều kiện cụ thể được bàn theo từng dự án và từng người. Đó không phải loại nội dung thuộc về một trang web.",
    ],
    maturityTitle: "Cách làm này đang ở đâu",
    maturityBody:
      "Cách làm này chưa phải là một phương pháp đã được chứng minh và có thể lặp lại. Yorisou đang ở giai đoạn đầu, và chưa từng đưa dự án nào ra ngoài thành một công ty độc lập. Những gì viết ở đây là cách chúng tôi thực sự tiến hành, không phải một tuyên bố về kết quả.",
  },

  /* ── BUILD WITH US (CORP-v1.2) ──────────────────────────────────────── */
  buildWithUs: {
    eyebrow: "Cùng xây dựng",
    heading: ["Bạn bước vào từ đâu", "tùy vào vị trí bạn đang đứng."],
    lead:
      "Hiện tại chúng tôi bắt đầu từ những gì có thể trao đổi. Không có khuôn tuyển chọn cố định nào. Nếu bạn quan tâm, hãy cho chúng tôi biết bạn đang nghĩ đến điều gì.",
    lanes: [
      {
        key: "founders",
        title: "Nhà sáng lập và người vận hành",
        body:
          "Yorisou xây dựng các dự án đến ngay trước điểm chúng trở thành công ty, và tìm những người có thể gánh lấy một dự án như của chính mình. Đây là vị trí của một người đồng sáng lập, không phải một công việc được giao.",
        invites: [
          "Bạn đã thực sự vận hành một việc có hiện trường phía sau",
          "Bạn tiến được về phía trước khi còn rất nhiều thứ chưa ngã ngũ",
          "Bạn am hiểu một trong các mảng: công nghệ, sản xuất, hành chính công hoặc công việc ở địa phương",
        ],
        cta: "Bày tỏ quan tâm",
      },
      {
        key: "research",
        title: "Đại học và nghiên cứu",
        body:
          "Để đưa kết quả nghiên cứu thành thứ xã hội dùng được, cần có thiết kế ở phía kinh doanh đi kèm. Chúng tôi đang tìm những người cùng suy nghĩ về việc đào tạo nhà sáng lập và đưa nghiên cứu vào triển khai.",
        invites: [
          "Bạn đang tìm nơi để kết quả nghiên cứu được ứng dụng",
          "Bạn muốn sinh viên và nhà nghiên cứu có trải nghiệm khởi sự thực tế",
          "Bạn muốn bắt đầu từ việc cùng nhau tìm hiểu",
        ],
        cta: "Bắt đầu một cuộc trò chuyện",
      },
      {
        key: "public",
        title: "Cơ quan nhà nước và khu vực công",
        body:
          "Các vấn đề công thường đã có sẵn thiết chế, nhưng chưa được dịch thành những bước mà người dân có thể làm theo. Chúng tôi muốn cùng thiết kế phần thử nghiệm nhỏ, cách đo hiệu quả, và con đường đi đến một thứ bền được.",
        invites: [
          "Bạn có một vấn đề có thể thử ngay trên thực địa",
          "Bạn muốn nó ở dạng đo được hiệu quả",
          "Bạn không muốn nó dừng lại ở một lần thí điểm",
        ],
        cta: "Liên hệ",
      },
      {
        key: "corporate",
        title: "Doanh nghiệp",
        body:
          "Nếu trong hoạt động của bạn có một vấn đề đáng để trở thành một hoạt động kinh doanh. Chúng ta có thể bắt đầu từ việc cùng phát triển hoặc một thử nghiệm trên thực địa.",
        invites: [
          "Ở hiện trường của bạn có một vấn đề vận hành chưa được giải",
          "Bạn đang tìm hình hài của một hoạt động kinh doanh mới",
          "Bạn đang tìm một đối tác cùng phát triển",
        ],
        cta: "Gửi câu hỏi",
      },
    ],
    intakeTitle: "Về việc tiếp nhận",
    intakeBody:
      "Hiện chúng tôi không có quy trình ứng tuyển và không có chương trình tuyển chọn nào. Những gì ở đây là lời mời, không phải một quan hệ hợp tác đang có hay một vị trí đang tuyển. Chúng tôi bắt đầu bằng việc lắng nghe điều bạn có, và xem có gì để cùng bàn hay không.",
    ctaHeading: ["Dù bạn là ai,", "lối vào ban đầu đều như nhau."],
    ctaBody: "Hãy viết ra điều bạn đang nghĩ và gửi cho chúng tôi. Chúng tôi đọc lần lượt.",
  },
};
