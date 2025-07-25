export function generateContractAppendixHTML(websiteName, tenantNames, contractLink) {
  return `
<div style="font-family: 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: auto; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
  <div style="background-color: #1d4ed8; padding: 20px; color: white; text-align: center;">
    <h2 style="margin: 0; font-size: 22px;">📄 Hợp đồng thuê trọ đã được tạo</h2>
  </div>
  <div style="padding: 24px;">
    <p style="font-size: 16px; margin-bottom: 12px;">Xin chào,</p>
    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
      Một hợp đồng thuê trọ mới đã được tạo thành công trên <strong>${websiteName}</strong> với thông tin sau:
    </p>
    <div style="background-color: #f9fafb; padding: 16px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
      <p style="margin: 0; font-size: 15px;"><strong>Người thuê:</strong> ${tenantNames.map(name => name.displayName).join(', ')}</p>
    </div>
    <p style="font-size: 15px; margin-bottom: 16px;">Bạn có thể xem hoặc tải hợp đồng tại liên kết bên dưới:</p>
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="${contractLink}" download target="_blank" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 15px;">
        📎 Xem hợp đồng
      </a>
    </div>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
    <p style="font-size: 14px; color: #6b7280;">Trân trọng,<br />Đội ngũ <strong>${websiteName}</strong></p>
  </div>
</div>
`;
}

export function generateDeleteAccountHTML(websiteName, displayName) {
  return `
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: auto; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
    <div style="background-color: #dc2626; padding: 20px; color: white; text-align: center;">
      <h2 style="margin: 0; font-size: 22px;">⚠️ Tài khoản đã bị khoá</h2>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 16px; margin-bottom: 12px;">Xin chào <strong>${displayName}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
        Chúng tôi xin thông báo rằng tài khoản của bạn trên hệ thống <strong>${websiteName}</strong> đã bị khoá do vi phạm quy định hoặc yêu cầu từ quản trị viên.
      </p>
      <p style="font-size: 15px; margin-bottom: 16px;">Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ đội ngũ hỗ trợ để được xử lý.</p>
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${process.env.WEBSITE_DOMAIN || '#'}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 15px;">
          🔗 Truy cập hệ thống
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="font-size: 14px; color: #6b7280;">Trân trọng,<br />Đội ngũ <strong>${websiteName}</strong></p>
    </div>
  </div>
  `;
}

export function generateRestoreAccountHTML(websiteName, displayName) {
  return `
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: auto; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
    <div style="background-color:rgb(38, 187, 220); padding: 20px; color: white; text-align: center;">
      <h2 style="margin: 0; font-size: 22px;"> Tài khoản được khôi phục</h2>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 16px; margin-bottom: 12px;">Xin chào <strong>${displayName}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
        Sau thời gian kiểm tra và xác nhận, chúng tôi xin thông báo rằng tài khoản của bạn trên hệ thống <strong>${websiteName}</strong> đã được khôi phục .
      </p>
      <p style="font-size: 15px; margin-bottom: 16px;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi,nếu có bất cứ thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ để được xử lý.</p>
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${process.env.WEBSITE_DOMAIN || '#'}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 15px;">
          🔗 Truy cập hệ thống
        </a>
      </div>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="font-size: 14px; color: #6b7280;">Trân trọng,<br />Đội ngũ <strong>${websiteName}</strong></p>
    </div>
  </div>
  `;
}

export function generateAccountInfoHTML(websiteName, fullname, email, password, role = "Người dùng") {
  return `
<div style="font-family: 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: auto; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
  <div style="background-color: #1d4ed8; padding: 20px; color: white; text-align: center;">
    <h2 style="margin: 0; font-size: 22px;">🔐 Tài khoản đã được tạo</h2>
  </div>
  <div style="padding: 24px;">
    <p style="font-size: 16px; margin-bottom: 12px;">Chào <strong>${fullname}</strong>,</p>
    <p style="font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
      Bạn đã được cấp quyền truy cập hệ thống <strong>${websiteName}</strong> với thông tin tài khoản như sau:
    </p>
    <div style="background-color: #f9fafb; padding: 16px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
      <p style="margin: 8px 0; font-size: 15px;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 8px 0; font-size: 15px;"><strong>Mật khẩu:</strong> ${password}</p>
      <p style="margin: 8px 0; font-size: 15px;"><strong>Vai trò:</strong> ${role}</p>
    </div>
    <p style="font-size: 15px; margin-bottom: 16px;">Vui lòng đăng nhập và đổi mật khẩu ngay sau lần sử dụng đầu tiên để đảm bảo an toàn thông tin.</p>
    <div style="text-align: center; margin-bottom: 30px;">
      <a href="https://${websiteName}" target="_blank" style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 15px;">
        🔑 Đăng nhập hệ thống
      </a>
    </div>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
    <p style="font-size: 14px; color: #6b7280;">Trân trọng,<br />Đội ngũ <strong>${websiteName}</strong></p>
  </div>
</div>
  `;
}


export function generateElectricBillHTML(bill) {
  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const electricityFee = bill.serviceFee.find(s => s.name === "Tiền điện")?.price || 0;
  const waterFee = bill.serviceFee.find(s => s.name === "Tiền nước")?.price || 0;

  const electricUsed = bill.newElectricity - bill.oldElectricity;
  const waterUsed = bill.newWater - bill.oldWater;

  const electricityTotal = electricityFee * electricUsed;
  const waterTotal = waterFee * waterUsed;

  const otherFees = bill.serviceFee.filter(s => s.name !== "Tiền điện" && s.name !== "Tiền nước");

  return `
  <div style="font-family: 'Segoe UI', Roboto, sans-serif; max-width: 640px; margin: auto; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
    <div style="background-color: #1d4ed8; padding: 20px; color: white; text-align: center;">
      <h2 style="margin: 0; font-size: 22px;">💡 Hóa đơn điện nước tháng ${new Date(bill.duration).getMonth() + 1}/${new Date(bill.duration).getFullYear()}</h2>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 16px; margin-bottom: 8px;">Xin chào <strong>${bill.tenantId.displayName}</strong>,</p>
      <p style="font-size: 15px; margin-bottom: 16px;">Hệ thống gửi đến bạn chi tiết hóa đơn phòng <strong>${bill.roomId.roomId}</strong> như sau:</p>

      <div style="background-color: #f9fafb; padding: 16px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
        <p style="margin: 8px 0;"><strong>Tiền phòng:</strong> ${formatCurrency(bill.roomId.price)}</p>
        <p style="margin: 8px 0;"><strong>Tiền điện:</strong> ${electricUsed} kWh × ${formatCurrency(electricityFee)} = ${formatCurrency(electricityTotal)}</p>
        <p style="margin: 8px 0;"><strong>Tiền nước:</strong> ${waterUsed} m³ × ${formatCurrency(waterFee)} = ${formatCurrency(waterTotal)}</p>

        ${otherFees.length > 0
      ? otherFees.map(fee => `<p style="margin: 8px 0;"><strong>${fee.name}:</strong> ${formatCurrency(fee.price)}</p>`).join("")
      : ""
    }

        <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="margin: 8px 0;"><strong>Tạm tính:</strong> ${formatCurrency(bill.total)}</p>
        <p style="margin: 8px 0;"><strong>Đã thanh toán:</strong> ${bill.isPaid ? "✅ Đã thanh toán" : "❌ Chưa thanh toán"}</p>
      </div>

      <p style="font-size: 15px; margin-bottom: 16px;">Vui lòng kiểm tra và phản hồi nếu có sai sót. Xin cảm ơn!</p>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="https://${bill.ownerId.email}" target="_blank" style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-size: 15px;">
          📄 Xem chi tiết trên hệ thống
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="font-size: 14px; color: #6b7280;">Trân trọng,<br />Đội ngũ <strong>${bill.ownerId.displayName}</strong> - ${bill.ownerId.email}</p>
    </div>
  </div>
  `;
}
