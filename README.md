# Discord Decode Bot

Bot Discord có khả năng giải mã (decode) nhiều loại mã khác nhau, bao gồm Base64, URL, Hex, Binary, ASCII và Morse Code.

## Cài đặt

1. Đảm bảo bạn đã cài đặt [Node.js](https://nodejs.org/) (v16.9.0 hoặc cao hơn).

2. Clone repository này hoặc tải về máy.

3. Cài đặt các thư viện cần thiết:

   ```
   npm install
   ```

4. Cấu hình token bot:
   - Đổi tên file `.env` hoặc chỉnh sửa nó để thêm token bot Discord của bạn:
   ```
   TOKEN=your_discord_bot_token_here
   PREFIX=!
   ```

## Tạo Discord Bot

1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications)
2. Nhấn vào "New Application"
3. Đặt tên cho ứng dụng của bạn và nhấn "Create"
4. Vào mục "Bot" ở thanh bên trái và nhấn "Add Bot"
5. Trong phần "Privileged Gateway Intents", bật cả 3 tùy chọn:
   - Presence Intent
   - Server Members Intent
   - Message Content Intent
6. Nhấn "Reset Token" để nhận token bot và sao chép nó vào file `.env`
7. Vào mục "OAuth2" > "URL Generator"
8. Chọn các scopes: `bot` và `applications.commands`
9. Chọn các bot permissions: `Send Messages`, `Embed Links`, `Read Message History`
10. Sao chép URL được tạo và dán vào trình duyệt để thêm bot vào server Discord của bạn

## Sử dụng

Bot sẽ phản hồi các lệnh bắt đầu bằng prefix `!` (hoặc prefix bạn đã cấu hình):

- `!decode help`: Hiển thị trợ giúp và danh sách các lệnh
- `!decode base64 <text>`: Giải mã chuỗi Base64
- `!decode url <text>`: Giải mã chuỗi URL encoded
- `!decode hex <text>`: Giải mã chuỗi Hex
- `!decode binary <text>`: Giải mã chuỗi nhị phân
- `!decode ascii <text>`: Giải mã chuỗi mã ASCII (vd: 72 101 108 108 111)
- `!decode morse <text>`: Giải mã chuỗi mã Morse (vd: .... . .-.. .-.. ---)

## Khởi chạy bot

Để chạy bot:

```
npm start
```

Để chạy bot trong chế độ phát triển (sử dụng nodemon để tự động khởi động lại khi có thay đổi):

```
npm run dev
```

## Ví dụ

- Giải mã Base64:

  ```
  !decode base64 SGVsbG8gV29ybGQ=
  ```

- Giải mã URL:

  ```
  !decode url Hello%20World
  ```

- Giải mã Hex:

  ```
  !decode hex 48656C6C6F20576F726C64
  ```

- Giải mã Binary:

  ```
  !decode binary 01001000 01100101 01101100 01101100 01101111
  ```

- Giải mã ASCII:

  ```
  !decode ascii 72 101 108 108 111
  ```

- Giải mã Morse:
  ```
  !decode morse .... . .-.. .-.. ---
  ```
