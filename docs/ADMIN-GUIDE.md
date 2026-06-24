# Hướng dẫn chỉnh sửa nội dung qua Admin

Trang admin cho phép bạn sửa **mọi nội dung** của portfolio mà không cần đụng vào code.
Mỗi mục được sửa bằng một ô **JSON** (chỉnh giá trị → bấm **Save**).

## 1. Mở admin

```bash
docker compose up -d postgres      # nếu Postgres chưa chạy
pnpm dev                           # web :3000 + api :3001
```

- Vào **http://localhost:3000/admin/login**
- Đăng nhập: `ADMIN_EMAIL` / `ADMIN_PASSWORD` (mặc định local: `admin@example.com` / `changeme123`)
- Sau khi login → trang **CONTROL PANEL**

## 2. Cách thao tác (giao diện CMS dạng form)

- **Điều hướng**: sidebar bên trái — Dashboard, Profile, và từng collection (có đếm số mục).
- **Thêm mới**: bấm **+ {TÊN}** ở góc phải → điền form theo từng trường → **SAVE**.
- **Sửa**: bấm **EDIT** trên một mục → form hiện ra với dữ liệu sẵn → sửa → **SAVE**.
- **Xoá**: bấm **DEL** (có hỏi xác nhận).
- **Sắp xếp**: kéo-thả các dòng trong danh sách để đổi thứ tự (tự lưu `order`).
- **Live Preview**: khung bên phải xem trước realtime ngay khi bạn gõ.
- **Export**: nút **Export Résumé** (trang CV in/PDF) và **Export JSON** (tải toàn bộ nội dung) ở chân sidebar.
- Mỗi loại field có control riêng: text, số, textarea, **markdown**, **dropdown** (enum), **tag** (gõ + Enter), **toggle** bật/tắt, **color picker**, datetime.
- Thay đổi hiện ra trên trang công khai trong **~60 giây** (ISR) hoặc ngay ở lần tải kế tiếp.
- `order` = thứ tự hiển thị (nhỏ → trước).

## 3. Các trường của từng mục (field reference)

### Profile (thông tin cá nhân — phần bạn cần điền)
```json
{
  "name": "Tên hiển thị của bạn",
  "classRole": "Full-stack & AI Engineer",
  "roles": ["Full-stack Engineer", "AI Agent Builder", "Problem Solver"],
  "tagline": "Một câu mô tả bạn làm gì và vì sao nó quan trọng.",
  "bio": "2–3 câu giới thiệu bản thân.",
  "level": 42,
  "rank": "LEGENDARY",
  "region": "VIETNAM",
  "email": "ban@email.com",
  "xpCurrent": 7400,
  "xpMax": 10000,
  "avatarUrl": null
}
```
> `roles` là danh sách chữ chạy hiệu ứng đánh máy ở Hero. `xpCurrent/xpMax` là thanh XP.

### Socials (link mạng xã hội — thay `#` bằng link thật)
```json
{ "label": "GH", "name": "GitHub", "href": "https://github.com/ban", "order": 0 }
```

### Counters (4 số liệu ở mục Dossier)
```json
{ "label": "PROJECTS", "value": 12, "suffix": null, "color": "#22d3ee", "order": 0 }
```
> Màu gợi ý: cyan `#22d3ee`, tím `#b026ff`, hồng `#ff2d9b`, vàng `#ffd23f`. `suffix` ví dụ `"+"` hoặc `"%"`.

### Stats (5 trục biểu đồ radar, value 0–100)
```json
{ "label": "AI/ML", "value": 88, "order": 2 }
```

### Projects / Missions
```json
{
  "code": "MSN_06", "slug": "ten-duy-nhat", "title": "Tên dự án",
  "objective": "1–2 câu mô tả bạn đã làm gì.",
  "difficulty": "★★★★☆", "impact": "KẾT QUẢ NỔI BẬT",
  "status": "COMPLETE", "statusColor": "#4ade80",
  "loadout": ["React", "NestJS"], "content": null, "order": 5
}
```
> `status`: `"COMPLETE"` (xanh `#4ade80`) hoặc `"ACTIVE"` (vàng `#ffd23f`). `slug` phải là duy nhất.

### Skills
```json
{ "groupName": "AI & AGENTS // SPECIALTY", "name": "Claude Agent SDK",
  "rarity": "legendary", "level": 92, "tip": "Chú thích khi hover.", "order": 0 }
```
> `rarity`: `common` (xám) · `rare` (cyan) · `epic` (tím) · `legendary` (vàng). `level` 0–100. Cùng `groupName` sẽ được gom thành 1 nhóm.

### Achievements (timeline thành tựu)
```json
{ "year": "2026", "title": "Tên thành tựu", "description": "Mô tả ngắn.",
  "color": "#ffd23f", "glow": "rgba(255,210,63,0.65)", "order": 0 }
```

### Experiences (kinh nghiệm)
```json
{ "title": "Vai trò", "org": "Công ty · Loại hình", "period": "Jan 2025 – Now",
  "description": "Mô tả công việc & impact.", "order": 0 }
```

### Resources (chia sẻ src / link)
```json
{ "title": "Tên", "description": "Mô tả.", "url": "https://demo...", "repoUrl": "https://github.com/...",
  "tags": ["react", "open-source"], "order": 0 }
```

### Blog Posts
```json
{
  "slug": "bai-viet-cua-toi", "title": "Tiêu đề", "excerpt": "Tóm tắt 1 câu.",
  "content": "## Markdown\n\nNội dung viết bằng **markdown**.",
  "tags": ["nextjs"], "coverImage": null,
  "published": true, "publishedAt": "2026-06-23T00:00:00Z"
}
```
> Đặt `published: false` để lưu nháp (không hiện ngoài trang). `content` viết bằng Markdown.

## 4. Mẹo bảo mật khi deploy
- Đổi `ADMIN_EMAIL` / `ADMIN_PASSWORD` và đặt `JWT_SECRET` mạnh (`openssl rand -hex 32`).
- Đặt `CORS_ORIGINS` = domain thật của trang web.
