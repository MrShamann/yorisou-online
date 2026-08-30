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
    home: { title: "Yorisou LLC — Giữa con người và xã hội, chúng tôi tạo nên sự đồng hành tiếp theo.", description: "Yorisou LLC nhìn thẳng vào sự phức tạp trong đời sống, công việc và cộng đồng địa phương, và tạo ra những sản phẩm giúp con người hiểu, lựa chọn và tiến về phía trước. Chúng tôi đang phát triển Mirai Move và Kakari." },
    miraiMove: { title: "Mirai Move — Yorisou LLC", description: "Nền tảng thông tin, kết nối và phát triển kinh doanh trong lĩnh vực di chuyển tại Nhật Bản. Trang thông tin công khai đang hoạt động; các tính năng nền tảng đang trong giai đoạn phát triển." },
    kakari: { title: "Kakari — Yorisou LLC", description: "Hỗ trợ đa ngôn ngữ cho thủ tục hành chính và giấy tờ, dành cho người đang sinh sống tại Nhật Bản và người bắt đầu kinh doanh tại đây. Hiện đang trong giai đoạn phát triển, chưa mở cho công chúng." },
    about: { title: "Về chúng tôi — Yorisou LLC", description: "Vì sao Yorisou tồn tại, chúng tôi tư duy thế nào và tạo dựng ra sao. Điều gì không xác minh được, chúng tôi không viết." },
    company: { title: "Thông tin công ty — Yorisou LLC", description: "Tổng quan công ty, hồ sơ người đại diện, thông điệp của người đại diện và các lĩnh vực hoạt động của Yorisou LLC." },
    contact: { title: "Liên hệ — Yorisou LLC", description: "Đầu mối tiếp nhận trao đổi về hoạt động kinh doanh, hợp tác và báo chí." },
  },

  common: {
    readMore: (name) => `Tìm hiểu thêm về ${name}`,
    backHome: "Quay lại trang thông tin công ty",
    stageLabel: "Giai đoạn hiện tại",
    boundaryLabel: "Phạm vi chúng tôi không đảm nhận",
  },

  home: {
    eyebrow: "Yorisou LLC",
    thesis: ["Giữa con người và xã hội,", "chúng tôi tạo nên", "sự đồng hành tiếp theo."],
    lead: ["Yorisou nhìn thẳng vào sự phức tạp trong đời sống, công việc và cộng đồng địa phương,", "và tạo ra những sản phẩm giúp con người hiểu, lựa chọn và tiến về phía trước."],
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
    buildHeading: ["Chúng tôi tạo nên sự đồng hành tiếp theo,", "từng việc một."],

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
};
