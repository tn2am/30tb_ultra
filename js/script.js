document.addEventListener('DOMContentLoaded', () => {

    // --- Lấy các phần tử HTML ---
    const greetingEl = document.getElementById('greeting');
    const clockEl = document.getElementById('clock');
    const tokenSourceEl = document.getElementById('tokenSource');
    const tokenTargetEl = document.getElementById('tokenTarget');
    const convertButtonEl = document.getElementById('convertButton');
    // === CÁC THÀNH PHẦN GIAO DIỆN MỚI ===
    const resultAreaEl = document.getElementById('resultArea');
    const openLinkButtonEl = document.getElementById('openLinkButton');
    // ===================================
    const toastEl = document.getElementById('toast');

    // --- Logic Chào hỏi và Đồng hồ (Không thay đổi) ---
    function updateClockAndGreeting() {
        const now = new Date();
        const hours = now.getHours();
        let greetingText = 'Chào bạn';
        if (hours >= 5 && hours < 12) { greetingText = 'Chào buổi sáng'; }
        else if (hours >= 12 && hours < 18) { greetingText = 'Chào buổi chiều'; }
        else { greetingText = 'Chào buổi tối'; }
        greetingEl.textContent = greetingText;
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        clockEl.textContent = now.toLocaleDateString('vi-VN', options);
    }
    
    updateClockAndGreeting();
    setInterval(updateClockAndGreeting, 1000);

    // --- Thuật toán trích xuất (Không thay đổi) ---
    function extractCoreCode(token) {
        const earIndex = token.indexOf('ear=');
        if (earIndex === -1) {
            console.error("Lỗi: Token không hợp lệ, không tìm thấy 'ear='.");
            return null;
        }
        const body = token.substring(earIndex + 4);

        const firstPercentIndex = body.indexOf('%');
        if (firstPercentIndex === -1) {
            console.error("Lỗi: Không tìm thấy ký tự '%' trong phần thân của token.");
            return null;
        }

        const endMarker = '%3Acom';
        const endMarkerIndex = body.indexOf(endMarker, firstPercentIndex);
        if (endMarkerIndex === -1) {
            console.error("Lỗi: Không tìm thấy điểm kết thúc '%3Acom'.");
            return null;
        }

        const coreCodeEnd = endMarkerIndex + endMarker.length;
        return body.substring(firstPercentIndex, coreCodeEnd);
    }
    
    // --- Logic Nút Bấm (Cập nhật để điều khiển giao diện mới) ---
    function convertTokens() {
        // Ẩn nút kết quả cũ trước khi thực hiện
        resultAreaEl.classList.add('hidden');

        const tokenSource = tokenSourceEl.value.trim();
        const tokenTarget = tokenTargetEl.value.trim();

        if (!tokenSource || !tokenTarget) {
            showToast("Vui lòng nhập đầy đủ cả hai token!");
            return;
        }

        const coreCodeSource = extractCoreCode(tokenSource);
        const coreCodeTarget = extractCoreCode(tokenTarget);

        if (!coreCodeSource) {
            showToast("Lỗi: Không thể trích xuất mã từ Token Nguồn.");
            return;
        }
        if (!coreCodeTarget) {
            showToast("Lỗi: Không thể tìm thấy mã trong Token Đích.");
            return;
        }
        
        const finalToken = tokenTarget.replace(coreCodeTarget, coreCodeSource);
        
        // === CẬP NHẬT GIAO DIỆN KHI CÓ KẾT QUẢ ===
        openLinkButtonEl.href = finalToken; // Gán link mới cho nút
        resultAreaEl.classList.remove('hidden'); // Hiển thị nút "Mở liên kết"
        // ======================================

        showToast("Chuyển đổi thành công!");
    }

    // Các hàm phụ trợ không đổi
    function showToast(message) {
        toastEl.textContent = message;
        toastEl.classList.add('show');
        setTimeout(() => { toastEl.classList.remove('show'); }, 3000);
    }

    // Gán Sự Kiện (Không có nút copy nữa)
    convertButtonEl.addEventListener('click', convertTokens);
});
