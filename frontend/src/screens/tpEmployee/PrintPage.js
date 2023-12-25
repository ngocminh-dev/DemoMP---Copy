function PrintPage(params) {
  var w = window.open();
  var body = w.document.body;
  var tag = document.createElement('h2');
  var text = document.createTextNode('Mã đơn hàng: ' + params._id);
  tag.appendChild(text);
  body.appendChild(tag);
  //1. Ho ten dia chi nguoi gui
  tag = document.createElement('h3');
  text = document.createTextNode('1. Thông tin người gửi: ');
  tag.appendChild(text);
  body.appendChild(tag);
  tag = document.createElement('p');
  text = document.createTextNode(params.sender);
  tag.appendChild(text);
  body.appendChild(tag);
  tag = document.createElement('p');
  text = document.createTextNode('Gửi từ điểm giao dịch: ' + params.fromPoint);
  tag.appendChild(text);
  body.appendChild(tag);
  //2. Ho ten dia chi nguoi nhan

  tag = document.createElement('h3');
  text = document.createTextNode('2. Họ tên địa chỉ người nhận: ');
  tag.appendChild(text);
  body.appendChild(tag);
  tag = document.createElement('p');
  text = document.createTextNode(params.receiverName);
  tag.appendChild(text);
  body.appendChild(tag);
  tag = document.createElement('p');
  text = document.createTextNode(params.receiverAddress);
  tag.appendChild(text);
  body.appendChild(tag);
  tag = document.createElement('p');
  text = document.createTextNode('Số điện thoại: ' + params.receiverPhone);
  tag.appendChild(text);
  body.appendChild(tag);
  //3. Loai hang gui
  tag = document.createElement('h3');
  if (params.packageType === 1)
    text = document.createTextNode('3. Loại hàng gửi: Tài liệu');
  else text = document.createTextNode('3. Loại hàng gửi: Hàng hóa');
  tag.appendChild(text);
  body.appendChild(tag);
  //4. Chỉ dẫn của người gửi khi không phát được
  tag = document.createElement('h3');
  text = document.createTextNode(
    '4. Chỉ dẫn của người gửi khi không phát được: '
  );
  tag.appendChild(text);
  body.appendChild(tag);
  tag = document.createElement('p');
  if (params.instruction === 1)
    text = document.createTextNode('Chuyển hoàn ngay');
  else if (params.instruction === 2)
    text = document.createTextNode('Gọi điện cho người gửi');
  else if (params.instruction === 3)
    text = document.createTextNode('Chuyển hoàn khi hết thời gian lưu trữ');
  else text = document.createTextNode('Hủy');
  tag.appendChild(text);
  body.appendChild(tag);
  tag = document.createElement('title');
  text = document.createTextNode('Biên lai đơn hàng hàng');
  tag.appendChild(text);
  body.appendChild(tag);

  tag = document.createElement('button');
  tag.onclick = () => {
    body.removeChild(tag);
    w.print();
  };
  text = document.createTextNode('In');
  tag.appendChild(text);
  body.appendChild(tag);
  return;
}
export default PrintPage;
