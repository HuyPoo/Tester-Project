# Tài liệu API

## Xác thực

### Đăng nhập

**Endpoint:** `/auth/login`

- Phương thức: `POST`
- Body:

```json
{
  "email": "string",
  "password": "string"
}
```

- Phản hồi thành công (200):

```json
{
  "accessToken": "string",
  "expires": "2024-01-01T00:00:00Z",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "role": "string"
}
```

- Lỗi:
    - 401: Thông tin đăng nhập không hợp lệ
    - 401: Email chưa được xác thực
    - 500: Lỗi hệ thống

### Đăng ký

**Endpoint:** `/auth/register`

- Phương thức: `POST`
- Body:

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string"
}
```

- Phản hồi thành công (201): No content
- Lỗi:
    - 400: Thông tin đăng ký không hợp lệ
    - 500: Lỗi hệ thống

### Xác nhận email

**Endpoint:** `/auth/confirm-email`

- Phương thức: `POST`
- Body:

```json
{
  "email": "string",
  "token": "string"
}
```

- Phản hồi thành công (200): No content
- Lỗi:
    - 404: Không tìm thấy người dùng
    - 400: Token không hợp lệ
    - 500: Lỗi hệ thống

### Yêu cầu gửi lại email xác nhận

**Endpoint:** `/auth/resend-confirmation-email`

- Phương thức: `POST`
- Body:

```json
{
  "email": "string"
}
```

- Phản hồi thành công (200): No content
- Lỗi:
    - 404: Không tìm thấy người dùng
    - 500: Lỗi hệ thống

### Quên mật khẩu

**Endpoint:** `/auth/forgot-password`

- Phương thức: `POST`
- Body:

```json
{
  "email": "string"
}
```

- Phản hồi thành công (200): No content
- Lỗi:
    - 500: Lỗi hệ thống

### Đặt lại mật khẩu

**Endpoint:** `/auth/reset-password`

- Phương thức: `POST`
- Body:

```json
{
  "email": "string",
  "token": "string",
  "newPassword": "string"
}
```

- Phản hồi thành công (200): No content
- Lỗi:
    - 404: Không tìm thấy người dùng
    - 400: Token không hợp lệ
    - 500: Lỗi hệ thống

### Đổi mật khẩu

**Endpoint:** `/auth/change-password`

- Phương thức: `PUT`
- Header: Yêu cầu JWT token
- Body:

```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

- Phản hồi thành công (200): No content
- Lỗi:
    - 401: Chưa xác thực
    - 404: Không tìm thấy người dùng
    - 400: Mật khẩu cũ không đúng
    - 500: Lỗi hệ thống

## Quản lý Salon

### Xem thông tin salon

**Endpoint:** `/salon`

- Phương thức: `GET`
- Phản hồi thành công (200):

```json
{
  "name": "string",
  "description": "string",
  "phoneNumber": "string",
  "email": "string",
  "address": "string",
  "openingTime": "08:00:00",
  "closingTime": "17:00:00",
  "leadWeeks": 2
}
```

- Lỗi:
    - 500: Lỗi hệ thống

### Cập nhật thông tin salon

**Endpoint:** `/salon`

- Phương thức: `PUT`
- Header: Yêu cầu JWT token với quyền Manager
- Body:

```json5
{
  // 2-50 ký tự
  "name": "string",
  // Định dạng số điện thoại hợp lệ
  "phoneNumber": "string",
  // Định dạng email hợp lệ
  "email": "string",
  // 2-256 ký tự 
  "address": "string",
  "openingTime": "08:00:00",
  "closingTime": "17:00:00",
  // 1-55 tuần
  "leadWeeks": 2
}
```

- Phản hồi thành công (200):

```json
{
  "name": "string",
  "description": "string",
  "phoneNumber": "string",
  "email": "string",
  "address": "string",
  "openingTime": "08:00:00",
  "closingTime": "17:00:00",
  "leadWeeks": 2
}
```

- Lỗi:
    - 400: Dữ liệu không hợp lệ
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

## Quản lý Khách hàng

### Xem danh sách khách hàng

**Endpoint:** `/customers`

- Phương thức: `GET`
- Header: Yêu cầu JWT token với quyền Manager
- Tham số:
    - page: số trang (mặc định: 1)
    - pageSize: số lượng mỗi trang (mặc định: 10)
- Phản hồi thành công (200):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phoneNumber": "string"
  }
]
```

- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

### Xem thông tin khách hàng

**Endpoint:** `/customers/{customerId}`

- Phương thức: `GET`
- Header: Yêu cầu JWT token với quyền Stylist hoặc Manager
- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string"
}
```

- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 404: Không tìm thấy khách hàng
    - 500: Lỗi hệ thống

### Cập nhật thông tin khách hàng

**Endpoint:** `/customers/{customerId}`

- Phương thức: `PUT`
- Header: Yêu cầu JWT token với quyền Manager
- Body:

```json5
{
  // 2-50 ký tự
  "firstName": "string",
  // 2-50 ký tự
  "lastName": "string",
  // Định dạng số điện thoại hợp lệ
  "phoneNumber": "string"
}
```

- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string"
}
```

- Lỗi:
    - 400: Dữ liệu không hợp lệ
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 404: Không tìm thấy khách hàng
    - 500: Lỗi hệ thống

### Xem thông tin cá nhân

**Endpoint:** `/customers/me`

- Phương thức: `GET`
- Header: Yêu cầu JWT token với quyền Customer
- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string"
}
```

- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 404: Không tìm thấy khách hàng
    - 500: Lỗi hệ thống

### Cập nhật thông tin cá nhân

**Endpoint:** `/customers/me`

- Phương thức: `PUT`
- Header: Yêu cầu JWT token với quyền Customer
- Body:

```json5
{
  // 2-50 ký tự
  "firstName": "string",
  // 2-50 ký tự
  "lastName": "string",
  // Định dạng số điện thoại hợp lệ
  "phoneNumber": "string"
}
```

- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phoneNumber": "string"
}
```

- Lỗi:
    - 400: Dữ liệu không hợp lệ
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 404: Không tìm thấy khách hàng
    - 500: Lỗi hệ thống

### Xem lịch sử đặt lịch của khách hàng

**Endpoint:** `/customers/{customerId}/appointments`

- Phương thức: `GET`
- Header: Yêu cầu JWT token với quyền Manager
- Tham số:
    - all: xem tất cả lịch sử (mặc định: false)
    - page: số trang (mặc định: 1)
    - pageSize: số lượng mỗi trang (mặc định: 10)
- Phản hồi thành công (200):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "serviceId": "string",
    "dateTime": "2024-01-01T00:00:00Z",
    "totalPrice": 100000,
    "status": "string"
  }
]
```

- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

### Xem lịch sử đặt lịch của bản thân

**Endpoint:** `/customers/me/appointments`

- Phương thức: `GET`
- Header: Yêu cầu JWT token với quyền Customer
- Tham số:
    - all: xem tất cả lịch sử (mặc định: false)
    - page: số trang (mặc định: 1)
    - pageSize: số lượng mỗi trang (mặc định: 10)
- Phản hồi thành công (200):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "serviceId": "string",
    "dateTime": "2024-01-01T00:00:00Z",
    "totalPrice": 100000,
    "status": "string"
  }
]
```

- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

## Quản lý Stylist

### Xem danh sách stylist

**Endpoint:** `/stylists`

- Phương thức: `GET`
- Tham số:
    - page: số trang (mặc định: 1)
    - pageSize: số lượng mỗi trang (mặc định: 10)
- Phản hồi thành công (200):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "string",
    "phoneNumber": "string",
    "firstName": "string",
    "lastName": "string",
    "specialties": [
      "string"
    ],
    "bio": "string",
    "imageUrl": "string"
  }
]
```

- Lỗi:
    - 500: Lỗi hệ thống

### Xem thông tin stylist

**Endpoint:** `/stylists/{stylistId}`

- Phương thức: `GET`
- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "string",
  "phoneNumber": "string",
  "firstName": "string",
  "lastName": "string",
  "specialties": [
    "string"
  ],
  "bio": "string",
  "imageUrl": "string"
}
```

- Lỗi:
    - 404: Không tìm thấy stylist
    - 500: Lỗi hệ thống

### Tạo stylist mới

**Endpoint:** `/stylists`

- Phương thức: `POST`
- Header: Yêu cầu JWT token với quyền Manager
- Body:

```json5
{
  // Định dạng email hợp lệ
  "email": "string",
  // Định dạng số điện thoại hợp lệ
  "phoneNumber": "string",
  // 2-50 ký tự
  "firstName": "string",
  // 2-50 ký tự
  "lastName": "string",
  // Tối đa 128 ký tự
  "bio": "string",
  // Định dạng URL hợp lệ, tối đa 256 ký tự
  "imageUrl": "string",
  "specialties": [
    "string"
  ]
}
```

- Phản hồi thành công (201):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "string",
  "phoneNumber": "string",
  "firstName": "string",
  "lastName": "string",
  "specialties": [
    "string"
  ],
  "bio": "string",
  "imageUrl": "string"
}
```

- Lỗi:
    - 400: Dữ liệu không hợp lệ
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

### Cập nhật thông tin stylist

**Endpoint:** `/stylists/{stylistId}`

- Phương thức: `PUT`
- Header: Yêu cầu JWT token với quyền Manager
- Body:

```json5
{
  // Định dạng số điện thoại hợp lệ
  "phoneNumber": "string",
  // 2-50 ký tự
  "firstName": "string",
  // 2-50 ký tự
  "lastName": "string",
  "specialties": [
    "string"
  ],
  // Tối đa 128 ký tự 
  "bio": "string",
  // Định dạng URL hợp lệ, tối đa 256 ký tự
  "imageUrl": "string"
}
```

- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "email": "string",
  "phoneNumber": "string",
  "firstName": "string",
  "lastName": "string",
  "specialties": [
    "string"
  ],
  "bio": "string",
  "imageUrl": "string"
}
```

- Lỗi:
    - 400: Dữ liệu không hợp lệ
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 404: Không tìm thấy stylist
    - 500: Lỗi hệ thống

### Xem các dịch vụ của stylist

**Endpoint:** `/stylists/{stylistId}/services`

- Phương thức: `GET`
- Tham số:
    - page: số trang (mặc định: 1)
    - pageSize: số lượng mỗi trang (mặc định: 10)
- Phản hồi thành công (200):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "description": "string",
    "durationMinutes": 30,
    "price": 100000,
    "imageUrl": "string"
  }
]
```

- Lỗi:
    - 500: Lỗi hệ thống

### Xem lịch trống của stylist

**Endpoint:** `/stylists/{stylistId}/services/{serviceId}/slots`

- Phương thức: `GET`
- Header: Yêu cầu JWT token
- Tham số:
    - date: ngày cần xem (định dạng: YYYY-MM-DD)
- Phản hồi thành công (200):

```json5
{
  "stylistId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "serviceId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "date": "2024-01-01",
  "slots": [
    {
      "item1": "2024-01-01T08:00:00Z",
      // Có thể đặt lịch
      "item2": true
    }
  ]
}
```

- Lỗi:
    - 401: Chưa xác thực
    - 500: Lỗi hệ thống

### Xem lịch hẹn của stylist

**Endpoint:** `/stylists/{stylistId}/appointments`

- Phương thức: `GET`
- Header: Yêu cầu JWT token với quyền Manager
- Tham số:
    - all: xem tất cả lịch sử (mặc định: false)
    - page: số trang (mặc định: 1)
    - pageSize: số lượng mỗi trang (mặc định: 10)
- Phản hồi thành công (200):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "serviceId": "string",
    "dateTime": "2024-01-01T00:00:00Z",
    "totalPrice": 100000,
    "status": "string"
  }
]
```

- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

## Quản lý Dịch vụ

### Xem danh sách dịch vụ

**Endpoint:** `/services`

- Phương thức: `GET`
- Tham số:
    - page: số trang (mặc định: 1)
    - pageSize: số lượng mỗi trang (mặc định: 10)
- Phản hồi thành công (200):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "description": "string",
    "price": 100000,
    "durationMinutes": 30,
    "imageUrl": "string"
  }
]
```

- Lỗi:
    - 500: Lỗi hệ thống

### Xem thông tin dịch vụ

**Endpoint:** `/services/{serviceId}`

- Phương thức: `GET`
- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "description": "string",
  "price": 100000,
  "durationMinutes": 30,
  "imageUrl": "string"
}
```

- Lỗi:
    - 404: Không tìm thấy dịch vụ
    - 500: Lỗi hệ thống

### Tạo dịch vụ mới

**Endpoint:** `/services`

- Phương thức: `POST`
- Header: Yêu cầu JWT token với quyền Manager
- Body:

```json5
{
  // 2-50 ký tự
  "name": "string",
  // 2-256 ký tự
  "description": "string",
  "price": 100000,
  "durationMinutes": 30,
  // Định dạng URL hợp lệ, tối đa 256 ký tự
  "imageUrl": "string"
}
```

- Phản hồi thành công (201):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "description": "string",
  "price": 100000,
  "durationMinutes": 30,
  "imageUrl": "string"
}
```

- Lỗi:
    - 400: Dữ liệu không hợp lệ
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

### Cập nhật thông tin dịch vụ

**Endpoint:** `/services/{serviceId}`

- Phương thức: `PUT`
- Header: Yêu cầu JWT token với quyền Manager
- Body:

```json5
{
  // 2-50 ký tự
  "name": "string",
  // 2-256 ký tự 
  "description": "string",
  "price": 100000,
  "durationMinutes": 30,
  // Định dạng URL hợp lệ, tối đa 256 ký tự
  "imageUrl": "string"
}
```

- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string",
  "description": "string",
  "price": 100000,
  "durationMinutes": 30,
  "imageUrl": "string"
}
```

- Lỗi:
    - 400: Dữ liệu không hợp lệ
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 404: Không tìm thấy dịch vụ
    - 500: Lỗi hệ thống

### Xem danh sách stylist của dịch vụ

**Endpoint:** `/services/{serviceId}/stylists`

- Phương thức: `GET`
- Tham số:
    - page: số trang (mặc định: 1)
    - pageSize: số lượng mỗi trang (mặc định: 10)
- Phản hồi thành công (200):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "email": "string",
    "phoneNumber": "string",
    "firstName": "string",
    "lastName": "string",
    "specialties": [
      "string"
    ],
    "bio": "string",
    "imageUrl": "string"
  }
]
```

- Lỗi:
    - 500: Lỗi hệ thống

### Thêm stylist vào dịch vụ

**Endpoint:** `/services/{serviceId}/stylists/{stylistId}`

- Phương thức: `PUT`
- Header: Yêu cầu JWT token với quyền Manager
- Phản hồi thành công (204): No content
- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

### Xóa stylist khỏi dịch vụ

**Endpoint:** `/services/{serviceId}/stylists/{stylistId}`

- Phương thức: `DELETE`
- Header: Yêu cầu JWT token với quyền Manager
- Phản hồi thành công (204): No content
- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

## Quản lý Lịch hẹn

### Xem danh sách lịch hẹn

**Endpoint:** `/appointments`

- Phương thức: `GET`
- Header: Yêu cầu JWT token với quyền Manager
- Tham số:
    - page: số trang (mặc định: 1)
    - pageSize: số lượng mỗi trang (mặc định: 10)
- Phản hồi thành công (200):

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "customerId": "string",
    "stylistId": "string",
    "serviceId": "string",
    "dateTime": "2024-01-01T00:00:00Z",
    "status": "string",
    "customerNotes": "string",
    "stylistNotes": "string",
    "totalPrice": 100000
  }
]
```

- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 500: Lỗi hệ thống

### Xem thông tin lịch hẹn

**Endpoint:** `/appointments/{appointmentId}`

- Phương thức: `GET`
- Header: Yêu cầu JWT token với quyền truy cập lịch hẹn
- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "customerId": "string",
  "stylistId": "string",
  "serviceId": "string",
  "dateTime": "2024-01-01T00:00:00Z",
  "status": "string",
  "customerNotes": "string",
  "stylistNotes": "string",
  "totalPrice": 100000
}
```

- Lỗi:
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 404: Không tìm thấy lịch hẹn
    - 500: Lỗi hệ thống

### Tạo lịch hẹn

**Endpoint:** `/appointments`

- Phương thức: `POST`
- Header: Yêu cầu JWT token với quyền Customer
- Body:

```json
{
  "stylistId": "string",
  "serviceId": "string",
  "dateTime": "2024-01-01T00:00:00Z",
  "notes": "string"
}
```

- Phản hồi thành công (201):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "customerId": "string",
  "stylistId": "string",
  "serviceId": "string",
  "dateTime": "2024-01-01T00:00:00Z",
  "status": "string",
  "customerNotes": "string",
  "stylistNotes": "string",
  "totalPrice": 100000
}
```

- Lỗi:
    - 400: Dữ liệu không hợp lệ
    - 401: Chưa xác thực
    - 404: Không tìm thấy stylist hoặc dịch vụ
    - 500: Lỗi hệ thống

### Hủy lịch hẹn

**Endpoint:** `/appointments/{appointmentId}/cancel`

- Phương thức: `POST`
- Header: Yêu cầu JWT token với quyền Customer
- Body:

```json
{
  "reason": "string"
}
```

- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "customerId": "string",
  "stylistId": "string",
  "serviceId": "string",
  "dateTime": "2024-01-01T00:00:00Z",
  "status": "string",
  "customerNotes": "string",
  "stylistNotes": "string",
  "totalPrice": 100000
}
```

- Lỗi:
    - 400: Không thể hủy lịch hẹn đã hoàn thành/đã hủy
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 404: Không tìm thấy lịch hẹn
    - 500: Lỗi hệ thống

### Cập nhật trạng thái lịch hẹn

**Endpoint:** `/appointments/{appointmentId}/status`

- Phương thức: `PUT`
- Header: Yêu cầu JWT token với quyền Stylist hoặc Manager
- Body:

```json
{
  "status": "string",
  "notes": "string"
}
```

- Phản hồi thành công (200):

```json
{
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "customerId": "string",
  "stylistId": "string",
  "serviceId": "string",
  "dateTime": "2024-01-01T00:00:00Z",
  "status": "string",
  "customerNotes": "string",
  "stylistNotes": "string",
  "totalPrice": 100000
}
```

- Lỗi:
    - 400: Dữ liệu không hợp lệ
    - 401: Chưa xác thực
    - 403: Không có quyền truy cập
    - 404: Không tìm thấy lịch hẹn
    - 500: Lỗi hệ thống

