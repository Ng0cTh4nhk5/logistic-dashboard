/**
 * Tạo Google Form khảo sát yêu cầu Dashboard Chi phí Logistics Dầu ăn.
 * 
 * HƯỚNG DẪN SỬ DỤNG:
 * 1. Vào https://script.google.com
 * 2. Nhấn "New project"
 * 3. Xóa hết code mặc định, paste toàn bộ code này vào
 * 4. Nhấn nút Run (▶), chọn hàm: createLogisticsForm
 * 5. Cấp quyền khi được hỏi (Allow)
 * 6. Vào menu View > Logs (hoặc Ctrl+Enter) để lấy link form
 * 7. Copy link "📋 Link gửi cho bạn bè" và gửi cho bạn
 */

function createLogisticsForm() {
  var form = FormApp.create('📦 Khảo sát yêu cầu — Dashboard Chi phí Logistics Dầu ăn');
  
  form.setDescription(
    'Để tui làm dashboard cho chuẩn, công trả lời giúp mấy câu hỏi bên dưới nha.\n\n' +
    'Không cần trả lời hoàn hảo đâu, cứ viết ra hết những gì công biết hoặc đang nghĩ, càng chi tiết càng tốt.\n' +
    'Câu nào chưa rõ thì ghi "chưa rõ" cũng được, tui sẽ tự giả định hợp lý.'
  );
  
  form.setConfirmationMessage('✅ Xong rồi! Cảm ơn công đã điền. Tui sẽ xem và liên hệ lại nếu cần hỏi thêm nhé! 🤝');
  form.setAllowResponseEdits(true);
  form.setProgressBar(true);

  // ========================================
  // PHẦN 1: VỀ DOANH NGHIỆP
  // ========================================
  form.addPageBreakItem()
    .setTitle('🏭 PHẦN 1: VỀ DOANH NGHIỆP')
    .setHelpText('Mấy câu hỏi này giúp tui hiểu rõ doanh nghiệp mà công đang làm việc cùng.');

  form.addParagraphTextItem()
    .setTitle('1.1. Doanh nghiệp này quy mô cỡ nào?')
    .setHelpText(
      '💡 Gợi ý: Ví dụ nhà máy nhỏ vài chục công nhân, hay tập đoàn lớn kiểu Cargill, Wilmar, Bunge? ' +
      'Doanh thu ước tầm bao nhiêu/năm nếu công biết? Có bao nhiêu nhân viên, bao nhiêu xe tải?'
    );

  form.addParagraphTextItem()
    .setTitle('1.2. Doanh nghiệp ở nước nào? Nhà máy sản xuất nằm ở đâu?')
    .setHelpText(
      '💡 Gợi ý: Ví dụ 1 nhà máy ở bang Texas, Mỹ. Hay 2 nhà máy, 1 ở châu Á 1 ở châu Âu? ' +
      'Nếu công biết thành phố hoặc khu công nghiệp cụ thể thì càng tốt, vì nó ảnh hưởng đến tính khoảng cách vận chuyển.'
    );

  form.addParagraphTextItem()
    .setTitle('1.3. Họ bán cho ai? Qua kênh nào?')
    .setHelpText(
      '💡 Gợi ý: Nghĩ xem hàng đến tay người dùng bằng cách nào nhé:\n' +
      '• Bán sỉ cho nhà phân phối, đại lý?\n' +
      '• Đưa thẳng vào chuỗi siêu thị (Walmart, Costco, Carrefour...)?\n' +
      '• Bán online qua Amazon, các sàn thương mại điện tử?\n' +
      '• Xuất khẩu sang nước khác?\n' +
      '• Cung cấp cho chuỗi nhà hàng, food service, bếp công nghiệp?\n' +
      '• Hay kết hợp nhiều kênh?'
    );

  form.addParagraphTextItem()
    .setTitle('1.4. Hàng phân phối đến những vùng nào?')
    .setHelpText(
      '💡 Gợi ý: Hình dung phạm vi phủ sóng:\n' +
      '• Chỉ trong 1 tiểu bang hoặc 1 vùng?\n' +
      '• Toàn quốc trong nước đó?\n' +
      '• Liên quốc gia, nhiều nước trong khu vực?\n' +
      '• Toàn cầu?\n' +
      '• Thị trường nào tiêu thụ nhiều nhất? Thị trường nào xa nhất?'
    );

  form.addParagraphTextItem()
    .setTitle('1.5. Sản phẩm dầu ăn của họ gồm những gì?')
    .setHelpText(
      '💡 Gợi ý: Mỗi loại sản phẩm có trọng lượng, bao bì, cách xếp xe khác nhau nên ảnh hưởng đến chi phí:\n' +
      '• Dầu ăn chai nhỏ lẻ cho người tiêu dùng (0.5L, 1L, 2L, 5L)?\n' +
      '• Dầu can lớn cho nhà hàng, food service (18–25L)?\n' +
      '• Dầu bồn, tank, flexitank cho công nghiệp?\n' +
      '• Có mấy dòng sản phẩm (dầu đậu nành, dầu cọ, dầu hướng dương, dầu olive...)?\n' +
      '• SKU nào bán chạy nhất?'
    );

  // ========================================
  // PHẦN 2: VỀ LOGISTICS HIỆN TẠI
  // ========================================
  form.addPageBreakItem()
    .setTitle('🚚 PHẦN 2: VỀ LOGISTICS HIỆN TẠI')
    .setHelpText('Phần này giúp tui hiểu cách hàng hóa đang di chuyển từ nhà máy đến khách hàng.');

  form.addParagraphTextItem()
    .setTitle('2.1. Hàng đi từ nhà máy đến khách hàng như thế nào?')
    .setHelpText(
      '💡 Gợi ý: Thử vẽ ra "hành trình" của 1 thùng dầu ăn. Ví dụ:\n' +
      '• Nhà máy → Xe tải lớn → Kho vùng (regional DC) → Xe nhỏ → Đại lý → Cửa hàng\n' +
      '• Nhà máy → Giao thẳng cho chuỗi siêu thị bằng xe tải\n' +
      '• Nhà máy → Cảng → Container đường biển → Thị trường nước ngoài\n\n' +
      'Có mấy "trạm dừng" trung gian? Hàng có qua kho nào trước khi đến tay người mua không?'
    );

  form.addParagraphTextItem()
    .setTitle('2.2. Có kho trung chuyển hoặc trung tâm phân phối (DC) không?')
    .setHelpText(
      '💡 Gợi ý:\n' +
      '• Kho thuê hay kho tự sở hữu?\n' +
      '• Ở đâu? (Ví dụ: 1 DC ở bờ Đông, 1 DC ở bờ Tây)\n' +
      '• Diện tích bao nhiêu? (m² hoặc sq ft)\n' +
      '• Chi phí thuê mỗi tháng nếu biết?\n' +
      '• Kho có kiểm soát nhiệt độ không hay kho thường?\n' +
      '• Trung bình hàng nằm trong kho bao lâu trước khi xuất đi?'
    );

  form.addParagraphTextItem()
    .setTitle('2.3. Vận chuyển bằng gì? Ai vận chuyển?')
    .setHelpText(
      '💡 Gợi ý:\n' +
      '• Xe tải nhỏ (light truck), xe tải trung (medium truck), xe container, xe bồn (tanker)?\n' +
      '• Xe của công ty hay thuê ngoài hãng vận tải (3PL)?\n' +
      '• Nếu thuê ngoài, họ tính giá kiểu nào? (theo chuyến, theo tấn, theo dặm/km?)\n' +
      '• Có dùng tàu biển, đường sắt hoặc vận chuyển đa phương thức không?\n' +
      '• 1 xe chở được bao nhiêu thùng hoặc pallet dầu ăn?'
    );

  form.addParagraphTextItem()
    .setTitle('2.4. Giao hàng thường xuyên cỡ nào?')
    .setHelpText(
      '💡 Gợi ý:\n' +
      '• Mỗi ngày xuất bao nhiêu chuyến từ nhà máy?\n' +
      '• Khách hàng đặt hàng theo lịch cố định hay đặt lúc nào cũng được?\n' +
      '• Mùa cao điểm là khi nào? (lễ lớn, mùa nấu nướng, kỳ nghỉ?)\n' +
      '• Trung bình 1 tháng xuất bao nhiêu tấn hàng?'
    );

  form.addParagraphTextItem()
    .setTitle('2.5. Có vấn đề gì hay gặp khi vận chuyển dầu ăn không?')
    .setHelpText(
      '💡 Gợi ý: Dầu ăn thường hay gặp mấy chuyện này:\n' +
      '• Nặng nên chi phí nhiên liệu cao, xe tốn xăng hơn\n' +
      '• Hạn sử dụng nên hàng tồn kho lâu phải xử lý\n' +
      '• Dầu bị đông đặc khi trời lạnh, có cần xe kiểm soát nhiệt không?\n' +
      '• Nguy cơ rò rỉ, dập nát bao bì\n' +
      '• Hao hụt tự nhiên (bay hơi, thấm)\n' +
      '• Quy định an toàn thực phẩm khi vận chuyển (FDA, EU regulations...)'
    );

  // ========================================
  // PHẦN 3: VỀ CHI PHÍ
  // ========================================
  form.addPageBreakItem()
    .setTitle('💰 PHẦN 3: VỀ CHI PHÍ')
    .setHelpText('⚡ Phần này tui hứng thú nhất vì nó quyết định dashboard sẽ tính toán và hiển thị những gì.');

  var costCheckbox = form.addCheckboxItem();
  costCheckbox.setTitle('3.1. "Chi phí logistics" bao gồm những khoản nào? (chọn tất cả cái công muốn tính)');
  costCheckbox.setHelpText('💡 Gợi ý: Tick vào những khoản công muốn dashboard tính. Nếu có khoản nào khác, ghi thêm ở ô "Khác" nhé.');
  costCheckbox.setChoices([
    costCheckbox.createChoice('🚗 Nhiên liệu (diesel, gas)'),
    costCheckbox.createChoice('🚗 Lương tài xế, phụ xe'),
    costCheckbox.createChoice('🚗 Phí cầu đường, toll'),
    costCheckbox.createChoice('🚗 Khấu hao xe hoặc phí thuê xe'),
    costCheckbox.createChoice('🚗 Bảo hiểm xe, phí bảo trì'),
    costCheckbox.createChoice('🚗 Phí thuê hãng vận tải bên ngoài (3PL)'),
    costCheckbox.createChoice('🏢 Thuê kho hoặc khấu hao kho'),
    costCheckbox.createChoice('🏢 Điện nước, vận hành kho'),
    costCheckbox.createChoice('🏢 Lương nhân viên kho'),
    costCheckbox.createChoice('🏢 Thiết bị (forklift, pallet, kệ hàng)'),
    costCheckbox.createChoice('📦 Bốc xếp, đóng gói'),
    costCheckbox.createChoice('📦 Đóng pallet, quấn màng'),
    costCheckbox.createChoice('📦 Dán nhãn, kiểm tra chất lượng trước giao'),
    costCheckbox.createChoice('📉 Hàng hư hỏng khi vận chuyển'),
    costCheckbox.createChoice('📉 Hàng bị trả lại (returns)'),
    costCheckbox.createChoice('📉 Hàng hết hạn phải hủy'),
    costCheckbox.createChoice('📉 Bảo hiểm hàng hóa'),
    costCheckbox.createChoice('📋 Nhân sự quản lý logistics'),
    costCheckbox.createChoice('📋 Phần mềm quản lý vận tải (TMS)'),
    costCheckbox.createChoice('📋 Giấy tờ, thủ tục, hải quan (customs clearance)')
  ]);
  costCheckbox.showOtherOption(true);

  form.addParagraphTextItem()
    .setTitle('3.2. Công có dữ liệu thực tế nào chưa?')
    .setHelpText(
      '💡 Gợi ý: Bất kỳ con số nào cũng quý, ví dụ:\n' +
      '• Bảng giá vận chuyển (freight rate) của hãng xe họ đang dùng\n' +
      '• Hóa đơn nhiên liệu gần đây\n' +
      '• Lương tài xế: X/tháng\n' +
      '• Giá thuê kho: X/sq ft hoặc X/m²/tháng\n' +
      '• Trung bình 1 chuyến xe từ A đến B hết bao nhiêu\n' +
      '• Tổng chi phí logistics tháng, quý hoặc năm gần nhất\n' +
      '• File Excel, PDF, báo cáo nào cũng được, gửi tui xem\n\n' +
      'Nếu chưa có data thật thì cũng không sao, tui sẽ dùng số liệu trung bình ngành để demo trước.'
    );

  form.addParagraphTextItem()
    .setTitle('3.3. Công muốn dashboard so sánh cái gì?')
    .setHelpText(
      '💡 Gợi ý: Dashboard thường mạnh nhất khi cho thấy sự khác biệt. Ví dụ:\n' +
      '• "Hiện tại đang tốn $2M/năm cho logistics, nếu tối ưu chỉ còn $1.4M"\n' +
      '• "Tự vận chuyển so với thuê 3PL, cái nào rẻ hơn?"\n' +
      '• "Thêm 1 kho vùng ở khu vực X thì giảm bao nhiêu chi phí?"\n' +
      '• "Kịch bản giá nhiên liệu tăng 20%, tổng chi phí thay đổi thế nào?"\n' +
      '• "So sánh chi phí logistics của mình với trung bình ngành"\n\n' +
      'Công muốn so sánh kiểu nào? Hay tất cả luôn?'
    );

  form.addParagraphTextItem()
    .setTitle('3.4. Đơn vị tiền tệ và đo lường nào công muốn dùng?')
    .setHelpText(
      '💡 Gợi ý: Dashboard có thể hiển thị chi phí theo nhiều cách:\n' +
      '• Tiền tệ: USD, EUR, hay loại nào?\n' +
      '• Chi phí/tấn hàng\n' +
      '• Chi phí/km hoặc chi phí/dặm\n' +
      '• Chi phí/đơn hàng\n' +
      '• % trên doanh thu (ví dụ: "logistics chiếm 12% doanh thu")\n' +
      '• Chi phí/chai hoặc chi phí/thùng dầu\n' +
      '• Hay tổng hợp nhiều đơn vị?'
    );

  // ========================================
  // PHẦN 4: VỀ BUỔI PITCHING
  // ========================================
  form.addPageBreakItem()
    .setTitle('🎯 PHẦN 4: VỀ BUỔI PITCHING')
    .setHelpText('Hiểu mục đích buổi pitch sẽ giúp tui thiết kế dashboard đúng hướng.');

  form.addParagraphTextItem()
    .setTitle('4.1. Công đang pitch với vai trò gì?')
    .setHelpText(
      '💡 Gợi ý: Vai trò khác nhau thì dashboard sẽ khác nhau:\n' +
      '• "Tui là tư vấn logistics, muốn chỉ cho họ thấy đang lãng phí ở đâu"\n' +
      '• "Tui muốn bán giải pháp phần mềm quản lý logistics"\n' +
      '• "Tui muốn đề xuất họ outsource logistics cho công ty tui"\n' +
      '• "Tui đang muốn hợp tác kinh doanh, cần show năng lực phân tích"\n' +
      '• "Tui muốn gây ấn tượng bằng một bài phân tích chuyên sâu"\n\n' +
      'Mục đích cuối cùng của buổi pitch là gì?'
    );

  form.addParagraphTextItem()
    .setTitle('4.2. Thông điệp chính công muốn truyền tải?')
    .setHelpText(
      '💡 Gợi ý: Tưởng tượng sau buổi pitch, họ về nhà nhớ được đúng 1 câu. Đó là câu gì?\n' +
      '• "Chi phí logistics của các anh đang cao hơn 30% so với trung bình ngành"\n' +
      '• "Nếu tối ưu tuyến đường, mỗi năm tiết kiệm $500K"\n' +
      '• "Thêm 1 DC ở khu vực Y sẽ giảm 25% thời gian giao hàng"\n' +
      '• "Outsource cho bên em sẽ rẻ hơn tự làm 15%"\n' +
      '• Hay đơn giản là "em có công cụ xịn, anh dùng thử đi"?'
    );

  form.addParagraphTextItem()
    .setTitle('4.3. Người xem là ai?')
    .setHelpText(
      '💡 Gợi ý: Điều này ảnh hưởng cách thiết kế. Sếp lớn thường thích nhìn tổng quan, còn manager muốn xem chi tiết:\n' +
      '• Chủ doanh nghiệp hoặc CEO?\n' +
      '• Giám đốc tài chính (CFO)?\n' +
      '• VP of Operations hoặc Supply Chain Director?\n' +
      '• Đội ngũ logistics?\n' +
      '• Tất cả mọi người trong phòng họp?\n\n' +
      'Họ am hiểu về logistics không? Hay cần trình bày dễ hiểu?'
    );

  form.addParagraphTextItem()
    .setTitle('4.4. Deadline khi nào?')
    .setHelpText(
      '💡 Gợi ý:\n' +
      '• Buổi pitch diễn ra ngày nào?\n' +
      '• Cần bản nháp trước bao lâu để review?\n' +
      '• Có ai cùng chuẩn bị không?'
    );

  var interactionChoice = form.addMultipleChoiceItem();
  interactionChoice.setTitle('4.5. Dashboard cần tương tác hay chỉ để trình chiếu?');
  interactionChoice.setHelpText(
    '💡 Gợi ý:\n' +
    'Demo tương tác: kéo slider thay đổi giá nhiên liệu thì thấy chi phí tăng giảm ngay, click vào khu vực trên bản đồ thì hiện chi phí...\n' +
    'Trình chiếu tĩnh: biểu đồ đẹp, số liệu rõ ràng, giống bài report chuyên nghiệp.'
  );
  interactionChoice.setChoices([
    interactionChoice.createChoice('Kiểu A: Demo tương tác (ấn tượng hơn, tốn công hơn)'),
    interactionChoice.createChoice('Kiểu B: Trình chiếu tĩnh (nhanh hơn, vẫn đẹp)'),
    interactionChoice.createChoice('Kết hợp cả hai')
  ]);
  interactionChoice.showOtherOption(true);

  // ========================================
  // PHẦN 5: VỀ GIAO DIỆN & KỸ THUẬT
  // ========================================
  form.addPageBreakItem()
    .setTitle('🎨 PHẦN 5: VỀ GIAO DIỆN & KỸ THUẬT')
    .setHelpText('Phần cuối rồi! Mấy câu này giúp tui biết công muốn dashboard nhìn như thế nào.');

  var styleChoice = form.addMultipleChoiceItem();
  styleChoice.setTitle('5.1. Phong cách thiết kế công thích?');
  styleChoice.setHelpText('💡 Gợi ý: Chọn 1 hoặc ghi ý riêng ở "Khác". Nếu có link dashboard mẫu nào công thấy đẹp, ghi vào ô Bonus cuối form nhé.');
  styleChoice.setChoices([
    styleChoice.createChoice('🏢 Corporate sang trọng (xanh navy, đen, vàng gold, kiểu McKinsey hoặc BCG)'),
    styleChoice.createChoice('🌿 Hiện đại tối giản (nền trắng, ít chữ, biểu đồ nổi bật)'),
    styleChoice.createChoice('🌙 Dark mode tech (nền tối, biểu đồ neon, kiểu startup công nghệ)'),
    styleChoice.createChoice('📊 Business Intelligence (kiểu Power BI, Tableau, nhiều số liệu chi tiết)')
  ]);
  styleChoice.showOtherOption(true);

  var mapChoice = form.addMultipleChoiceItem();
  mapChoice.setTitle('5.2. Cần bản đồ không?');
  mapChoice.setHelpText('💡 Gợi ý: Bản đồ giúp trực quan hóa tuyến đường nhưng có nhiều mức độ.');
  mapChoice.setChoices([
    mapChoice.createChoice('Bản đồ tĩnh, chấm vị trí nhà máy, kho, khách hàng'),
    mapChoice.createChoice('Bản đồ có đường nối, kích thước đường thể hiện khối lượng hàng'),
    mapChoice.createChoice('Bản đồ có animation xe chạy, tàu chạy (rất ấn tượng khi pitch)'),
    mapChoice.createChoice('Bản đồ thật (Google Maps, Mapbox) với tuyến đường cụ thể'),
    mapChoice.createChoice('Không cần bản đồ, biểu đồ là đủ')
  ]);
  mapChoice.showOtherOption(true);

  var langChoice = form.addMultipleChoiceItem();
  langChoice.setTitle('5.3. Ngôn ngữ hiển thị?');
  langChoice.setChoices([
    langChoice.createChoice('Tiếng Anh hoàn toàn (phù hợp doanh nghiệp nước ngoài)'),
    langChoice.createChoice('Tiếng Việt hoàn toàn'),
    langChoice.createChoice('Song ngữ (tiêu đề tiếng Anh, ghi chú tiếng Việt)')
  ]);
  langChoice.showOtherOption(true);

  form.addParagraphTextItem()
    .setTitle('5.4. Có logo hoặc brand guideline nào không?')
    .setHelpText(
      '💡 Gợi ý:\n' +
      '• Logo của doanh nghiệp dầu ăn? (gắn vào dashboard cho chuyên nghiệp)\n' +
      '• Logo bên công (nếu công pitch dưới danh nghĩa công ty)?\n' +
      '• Bộ màu nhận diện thương hiệu? (ví dụ: xanh lá kết hợp vàng)\n' +
      '• Nếu không có thì tui thiết kế tự do nhé'
    );

  // ========================================
  // BONUS
  // ========================================
  form.addPageBreakItem()
    .setTitle('💬 BONUS')
    .setHelpText('Gần xong rồi!');

  form.addParagraphTextItem()
    .setTitle('Còn gì công muốn bổ sung không?')
    .setHelpText(
      '💡 Bất kỳ chi tiết gì công thấy sẽ hữu ích. Ý tưởng, kỳ vọng, ví dụ, hình ảnh tham khảo, link dashboard mẫu... cứ viết thoải mái ở đây nhé.'
    );

  // ========================================
  // LOG KẾT QUẢ
  // ========================================
  var publishedUrl = form.getPublishedUrl();
  var editUrl = form.getEditUrl();
  
  Logger.log('===========================================');
  Logger.log('✅ Form đã được tạo thành công!');
  Logger.log('===========================================');
  Logger.log('');
  Logger.log('📋 Link gửi cho bạn bè điền:');
  Logger.log(publishedUrl);
  Logger.log('');
  Logger.log('✏️ Link chỉnh sửa form (của bạn):');
  Logger.log(editUrl);
  Logger.log('');
  Logger.log('===========================================');
}
