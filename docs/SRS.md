# Dự án Website Đặt lịch hẹn Tiệm Làm Tóc

**Code name:** `virgo-14`

## I. Tổng quan dự án

### Mục tiêu

Mục tiêu của dự án này là xây dựng một website cho tiệm làm tóc địa phương, cho phép khách hàng đặt lịch hẹn online,
quản lý thông tin cá nhân và cung cấp cho nhân viên (stylist và quản lý) các công cụ để quản lý lịch hẹn, dịch vụ và
thông tin tiệm.

### Phạm vi

Phạm vi dự án bao gồm các chức năng chính như: đặt lịch hẹn, quản lý lịch hẹn, quản lý dịch vụ, quản lý stylist, quản lý
khách hàng, quản lý thông tin salon.

Việc đặt lịch hẹn sẽ được thực hiện thông qua website, chấp nhận hoặc từ chối lịch hẹn sẽ được stylist thực hiện thủ
công.

### Giả định và ràng buộc

- Website chỉ phục vụ cho tiệm làm tóc địa phương, không phải là một hệ thống quản lý lớn.
- Website chỉ phục vụ cho việc đặt lịch hẹn và quản lý thông tin cá nhân, không phải là một hệ thống quản lý salon toàn
  diện.
- Website chỉ phục vụ cho việc đặt lịch hẹn, không phải là một hệ thống quản lý nhân sự.
- Website chỉ phục vụ cho việc đặt lịch hẹn và không cung cấp dịch vụ thanh toán online.

## II. Yêu cầu chức năng

### Các tác nhân

- Hệ thống có 4 tác nhân chính: Guest, Customer, Stylist và Manager.

<details>
<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ tác nhân"

actor Guest
actor Customer
actor Stylist
actor Manager

Guest <|-- Customer
Stylist <|-- Manager

rectangle "Hệ thống" as System {
}

Guest -- System : access
Customer -- System : uses
Stylist -- System : uses
Manager -- System : manages

@enduml
```

</details>

![Biểu đồ tác nhân.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20t%C3%A1c%20nh%C3%A2n.svg)

### Các chức năng chính

**Guest:**

* **Tìm kiếm dịch vụ:**  Cho phép khách tìm kiếm dịch vụ dựa trên tên, loại dịch vụ, giá cả...
* **Xem thông tin dịch vụ:** Hiển thị chi tiết về dịch vụ, bao gồm mô tả, giá cả, thời gian thực hiện.
* **Xem thông tin stylist:** Hiển thị thông tin về stylist, bao gồm kinh nghiệm, chuyên môn, ảnh đại diện...
* **Đăng nhập:** Đăng nhập vào tài khoản khách hàng đã đăng ký.
* **Đăng ký:** Tạo tài khoản khách hàng mới.
* **Xem thông tin salon:** Hiển thị thông tin về salon, bao gồm địa chỉ, số điện thoại, giờ mở cửa, hình ảnh...

**Customer:**

* **Đặt lịch hẹn:** Chọn dịch vụ, stylist, ngày giờ và đặt lịch hẹn.
* **Xem lịch hẹn:** Xem các lịch hẹn đã đặt.
* **Hủy lịch hẹn:** Hủy lịch hẹn đã đặt.
* **Đổi mật khẩu:** Thay đổi mật khẩu tài khoản.
* **Quản lý thông tin:** Cập nhật thông tin cá nhân như tên, số điện thoại.

**Stylist:**

* **Xem lịch hẹn:** Xem lịch hẹn của mình.
* **Cập nhật lịch hẹn:**
    * **Chấp nhận lịch hẹn:** Xác nhận lịch hẹn.
    * **Từ chối lịch hẹn:** Từ chối lịch hẹn.
    * **Hoàn thành hoặc đánh dấu vắng mặt:** Cập nhật trạng thái lịch hẹn.
* **Xem lịch sử lịch hẹn:** Xem các lịch hẹn đã qua.

**Manager:**

* **Quản lý khách hàng:** Xem, xóa thông tin khách hàng.
* **Quản lý stylist:** Xem, thêm, sửa, xóa thông tin stylist, quản lý lịch làm việc.
* **Quản lý dịch vụ:** Xem, thêm, sửa, xóa dịch vụ, cập nhật giá cả.
* **Quản lý thông tin salon:** Cập nhật thông tin liên hệ, địa chỉ, mô tả salon, giờ mở - đóng cửa.
* **Quản lý lịch hẹn:** Xem, quản lý tất cả lịch hẹn.

### Biểu đồ Use Case

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ Use Case tổng quan"

skinparam usecase {
BackgroundColor BUSINESS
}

skinparam note {
BackgroundColor LightSkyBlue
}

left to right direction

actor Guest
actor Customer
actor Stylist
actor Manager

Guest <|-- Customer
Stylist <|-- Manager

rectangle "Hệ thống" {
together {
rectangle "Chức năng Guest" as A {
usecase "Xem thông tin dịch vụ" as ViewService
usecase "Xem thông tin stylist" as ViewStylist
usecase "Xem thông tin salon" as ViewSalon
usecase "Tìm kiếm dịch vụ" as SearchService
usecase "Đăng nhập" as Login
usecase "Đăng ký" as Register
}

        rectangle "Chức năng Customer" as B {
            usecase "Đặt lịch hẹn" as BookAppointment
            usecase "Xem lịch hẹn" as ViewAppointment
            usecase "Hủy lịch hẹn" as CancelAppointment
            usecase "Đổi mật khẩu" as ChangePassword
            usecase "Quản lý thông tin" as ManageInfo
        }
    }

    rectangle "Chức năng Stylist" as C {
        usecase "Xem lịch hẹn" as ViewStylistAppointment
        usecase "Chấp nhận lịch hẹn" as AcceptAppointment
        usecase "Từ chối lịch hẹn" as RejectAppointment
        usecase "Cập nhật trạng thái" as UpdateStatus
        usecase "Xem lịch sử lịch hẹn" as ViewHistory
    }

    rectangle "Chức năng Manager" as D{
        usecase "Quản lý khách hàng" as ManageCustomers
        usecase "Quản lý stylist" as ManageStylists
        usecase "Quản lý dịch vụ" as ManageServices
        usecase "Quản lý thông tin salon" as ManageSalon
        usecase "Quản lý lịch hẹn" as ManageAppointments
    }

    A -[hidden]- C
    C -[hidden]r- D

}

Guest -- ViewService
Guest -- ViewStylist
Guest -- ViewSalon
Guest -- SearchService
Guest -- Login
Guest -- Register

Customer -- BookAppointment
Customer -- ViewAppointment
Customer -- CancelAppointment
Customer -- ChangePassword
Customer -- ManageInfo

Stylist -u- ViewStylistAppointment
Stylist -u- AcceptAppointment
Stylist -u- RejectAppointment
Stylist -u- UpdateStatus
Stylist -u- ViewHistory

Manager -u- ManageCustomers
Manager -u- ManageStylists
Manager -u- ManageServices
Manager -u- ManageSalon
Manager -u- ManageAppointments

@enduml

```

</details>

![Biểu đồ Use Case tổng quan.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20Use%20Case%20t%E1%BB%95ng%20quan.svg)

### Biểu đồ Use Case chi tiết

#### Chức năng Guest

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ Use Case chức năng Guest"

skinparam usecase {
    BackgroundColor BUSINESS
}

skinparam note {
    BackgroundColor LightSkyBlue
}

left to right direction

actor Guest

rectangle "Hệ thống" {
    usecase "Xem thông tin dịch vụ" as ViewService
    usecase "Xem thông tin stylist" as ViewStylist
    usecase "Xem thông tin salon" as ViewSalon
    usecase "Tìm kiếm dịch vụ" as SearchService
    usecase "Đăng nhập" as Login
    usecase "Đăng ký" as Register
}

Guest -- ViewService
Guest -- ViewStylist
Guest -- ViewSalon
Guest -- SearchService
Guest -- Login
Guest -- Register

@enduml
```

</details>

![Biểu đồ Use Case chức năng Guest.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20Use%20Case%20ch%E1%BB%A9c%20n%C4%83ng%20Guest.svg)

#### Chức năng Customer

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ Use Case chức năng Customer"

skinparam usecase {
    BackgroundColor BUSINESS
}

skinparam note {
    BackgroundColor LightSkyBlue
}

left to right direction

actor Customer

rectangle "Hệ thống" {
    usecase "Đặt lịch hẹn" as BookAppointment
    usecase "Chọn dịch vụ" as ChooseService
    usecase "Chọn stylist" as ChooseStylist
    usecase "Chọn ngày giờ" as ChooseDateTime

    usecase "Xem lịch hẹn" as ViewAppointment

    usecase "Hủy lịch hẹn" as CancelAppointment
    usecase "Nhập lý do" as EnterReason

    usecase "Đổi mật khẩu" as ChangePassword
    usecase "Quản lý thông tin" as ManageInfo
}

Customer -- BookAppointment
BookAppointment ..> ChooseService : <<include>>
BookAppointment ..> ChooseStylist : <<include>>
BookAppointment ..> ChooseDateTime : <<include>> 

Customer -- ViewAppointment

Customer -- CancelAppointment
CancelAppointment ..> EnterReason : <<include>>

Customer -- ChangePassword
Customer -- ManageInfo

@enduml
```

</details>

![Biểu đồ Use Case chức năng Customer.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20Use%20Case%20ch%E1%BB%A9c%20n%C4%83ng%20Customer.svg)

#### Chức năng Stylist

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ Use Case chức năng Stylist"

skinparam usecase {
    BackgroundColor BUSINESS
}

skinparam note {
    BackgroundColor LightSkyBlue
}

left to right direction

actor Stylist

rectangle "Hệ thống" {
    usecase "Xem lịch hẹn" as ViewStylistAppointment
    usecase "Chấp nhận lịch hẹn" as AcceptAppointment
    usecase "Từ chối lịch hẹn" as RejectAppointment
    usecase "Nhập lý do" as EnterReason

    usecase "Cập nhật trạng thái" as UpdateStatus
    usecase "Cập nhật hoàn thành" as MarkComplete
    usecase "Cập nhật vắng mặt" as MarkAbsent

    usecase "Xem lịch sử lịch hẹn" as ViewHistory
}

Stylist -- ViewStylistAppointment
Stylist -- AcceptAppointment
Stylist -- RejectAppointment
RejectAppointment ..> EnterReason : <<include>>

Stylist -- UpdateStatus
UpdateStatus <.. MarkComplete : <<extend>>
UpdateStatus <.. MarkAbsent : <<extend>>

Stylist -- ViewHistory

@enduml
```

</details>

![Biểu đồ Use Case chức năng Stylist.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20Use%20Case%20ch%E1%BB%A9c%20n%C4%83ng%20Stylist.svg)

#### Chức năng Manager

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ Use Case chức năng Manager"

skinparam usecase {
    BackgroundColor BUSINESS
}

skinparam note {
    BackgroundColor LightSkyBlue
}

left to right direction

actor Manager

rectangle "Hệ thống" as S {
    usecase "Quản lý khách hàng" as ManageCustomers
    usecase "Quản lý stylist" as ManageStylists
    usecase "Quản lý dịch vụ" as ManageServices

    usecase "Quản lý thông tin salon" as ManageSalon
    usecase "Cập nhật thông tin salon" as UpdateSalon

    together {
        usecase "Quản lý lịch hẹn" as ManageAppointments
        usecase "Xem lịch hẹn" as ViewAppointments
        usecase "Chấp nhận lịch hẹn" as AcceptAppointment
        usecase "Từ chối lịch hẹn" as RejectAppointment
        usecase "Cập nhật trạng thái" as UpdateStatus
    }
    
    usecase "Xem lịch sử lịch hẹn" as ViewHistory
}

note bottom of S : Các chức năng quản lý\nbao thao tác thêm, sửa, xóa thông tin

Manager -- ManageCustomers
Manager -- ManageStylists
Manager -- ManageServices

Manager -- ManageSalon
ManageSalon ..> UpdateSalon : <<include>>

Manager -- ManageAppointments
ManageAppointments <.. ViewAppointments : <<extend>>
ManageAppointments <.. AcceptAppointment : <<extend>>
ManageAppointments <.. RejectAppointment : <<extend>>
ManageAppointments <.. UpdateStatus : <<extend>>

Manager -- ViewHistory

@enduml
```

</details>

![Biểu đồ Use Case chức năng Manager.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20Use%20Case%20ch%E1%BB%A9c%20n%C4%83ng%20Manager.svg)

### Quy trình hoạt động

#### Quy trình đặt lịch hẹn

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Quy trình đặt lịch hẹn"

skinparam activity {
    BackgroundColor LightYellow
}

|Customer|
start
:Chọn dịch vụ;
:Chọn stylist;
|#palegreen|System|
:Hiển thị ngày có thể đặt;
|Customer|
repeat
:Chọn ngày;
|System|
:Hiển thị giờ có thể đặt;
|Customer|
:Chọn giờ;
:Ghi chú (nếu có);
:Xác nhận lịch hẹn;
|System|
:Ghi nhận lịch hẹn;
:Gửi thông báo đến Stylist;
|Customer|
stop
@enduml
```

</details>

![Quy trình đặt lịch hẹn.svg](/docs/diagrams/Quy%20tr%C3%ACnh%20%C4%91%E1%BA%B7t%20l%E1%BB%8Bch%20h%E1%BA%B9n.svg)

#### Quy trình cập nhật lịch hẹn

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Quy trình quản lý lịch hẹn"
!pragma useVerticalIf on

skinparam activity {
    BackgroundColor LightYellow
}

|Stylist|
start
:Chọn lịch hẹn;
if (tới hẹn?) then (có)
    if (có mặt?) then (có)
        :Đánh dấu hoàn thành;
    else (không)
        :Đánh dấu vắng mặt;
    endif
elseif (hủy lịch?) then (có)
    :Nhập lý do hủy;
    :Xác nhận hủy;
else (không)
    :Nhập ghi chú;
    :Chấp nhận lịch hẹn;
endif
|#palegreen|System|
:Ghi nhận thay đổi;
:Gửi thông báo đến Customer;
stop

@enduml
```

</details>

![Quy trình quản lý lịch hẹn.svg](/docs/diagrams/Quy%20tr%C3%ACnh%20qu%E1%BA%A3n%20l%C3%BD%20l%E1%BB%8Bch%20h%E1%BA%B9n.svg)

### Luồng xử lý

#### Luồng xử lý đăng ký

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ trình tự đăng ký"
actor "Khách" as guest
participant "Giao diện" as ui
participant "Hệ thống" as system
database "CSDL" as db

guest -> ui: 1. Truy cập form đăng ký
activate ui

guest -> ui: 2. Điền thông tin\n(họ tên, email, SĐT, mật khẩu)
ui -> system: 3. Gửi thông tin đăng ký

activate system
system -> system: 4. Kiểm tra thông tin
alt Thông tin hợp lệ
    system -> db: 5. Lưu thông tin tài khoản
    activate db
    db --> system: 6. Xác nhận lưu thành công
    deactivate db

    system -> system: 7. Tạo mã xác thực email
    system -> guest: 8. Gửi email xác thực
    system --> ui: 9a. Thông báo đăng ký thành công
    ui --> guest: 10a. Chuyển đến trang xác thực email
else Thông tin không hợp lệ
    system --> ui: 9b. Trả về lỗi
    ui --> guest: 10b. Hiển thị thông báo lỗi
end
deactivate system
deactivate ui

@enduml
```

</details>

![Biểu đồ trình tự đăng ký.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20tr%C3%ACnh%20t%E1%BB%B1%20%C4%91%C4%83ng%20k%C3%BD.svg)

#### Luồng xử lý đặt lịch hẹn

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ trình tự đặt lịch hẹn"
actor "Khách hàng" as customer
participant "Giao diện" as ui
participant "Hệ thống" as system
participant "Stylist" as stylist

activate customer
customer -> ui: 1. Chọn dịch vụ
activate ui

ui -> system: 2. Lấy danh sách stylist phù hợp
activate system
system --> ui: 3. Danh sách stylist có thể thực hiện dịch vụ
deactivate system

customer -> ui: 4. Chọn stylist

ui -> system: 5. Lấy lịch trống của stylist
activate system
system --> ui: 6. Hiển thị các ngày giờ có thể đặt
deactivate system

customer -> ui: 7. Chọn ngày giờ
customer -> ui: 8. Thêm ghi chú (nếu có)
customer -> ui: 9. Xác nhận đặt lịch

ui -> system: 10. Tạo lịch hẹn
activate system
system -> stylist: 11. Thông báo lịch hẹn mới
system --> ui: 12. Xác nhận đặt lịch thành công
deactivate system

ui --> customer: 13. Hiển thị thông tin lịch hẹn
deactivate ui

note right of system
  Stylist sẽ xem xét và 
  phản hồi lịch hẹn sau
end note

@enduml
```

</details>

![Biểu đồ trình tự đặt lịch hẹn.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20tr%C3%ACnh%20t%E1%BB%B1%20%C4%91%E1%BA%B7t%20l%E1%BB%8Bch%20h%E1%BA%B9n.svg)

#### Luồng xử lý quản lý lịch hẹn

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ trình tự quản lý lịch hẹn"
actor "Stylist" as stylist
participant "Giao diện" as ui
participant "Hệ thống" as system
actor "Khách hàng" as customer

activate stylist
stylist -> ui: 1. Xem danh sách lịch hẹn
activate ui

ui -> system: 2. Lấy danh sách lịch hẹn
activate system
system --> ui: 3. Trả về danh sách lịch hẹn
deactivate system

ui --> stylist: 4. Hiển thị danh sách lịch hẹn

alt Xác nhận lịch hẹn
    stylist -> ui: 5a. Chấp nhận lịch hẹn
    ui -> system: 6a. Cập nhật trạng thái thành "Đã xác nhận"
    activate system
    system -> customer: 7a. Gửi email thông báo xác nhận
    system --> ui: 8a. Xác nhận cập nhật thành công
    deactivate system

else Từ chối lịch hẹn
    stylist -> ui: 5b. Từ chối lịch hẹn
    stylist -> ui: 6b. Nhập lý do từ chối
    ui -> system: 7b. Cập nhật trạng thái thành "Đã từ chối"
    activate system 
    system -> customer: 8b. Gửi email thông báo từ chối
    system --> ui: 9b. Xác nhận cập nhật thành công
    deactivate system

else Hoàn thành lịch hẹn
    stylist -> ui: 5c. Đánh dấu hoàn thành
    ui -> system: 6c. Cập nhật trạng thái thành "Đã hoàn thành"
    activate system
    system --> ui: 7c. Xác nhận cập nhật thành công
    deactivate system

else Khách không đến
    stylist -> ui: 5d. Đánh dấu không đến
    ui -> system: 6d. Cập nhật trạng thái thành "Không đến"
    activate system
    system --> ui: 7d. Xác nhận cập nhật thành công
    deactivate system
end

ui --> stylist: 9. Hiển thị thông báo thành công
deactivate ui
deactivate stylist

@enduml
```

</details>

![Biểu đồ trình tự quản lý lịch hẹn.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20tr%C3%ACnh%20t%E1%BB%B1%20qu%E1%BA%A3n%20l%C3%BD%20l%E1%BB%8Bch%20h%E1%BA%B9n.svg)

#### Luồng xử lý quản lý dịch vụ

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ trình tự quản lý dịch vụ"
actor "Manager" as manager
participant "Giao diện" as ui
participant "Hệ thống" as system
database "CSDL" as db

== Xem danh sách dịch vụ ==
manager -> ui: 1. Truy cập trang quản lý dịch vụ
activate ui
ui -> system: 2. Lấy danh sách dịch vụ
activate system
system -> db: 3. Truy vấn dữ liệu
activate db
db --> system: 4. Trả về danh sách
deactivate db
system --> ui: 5. Hiển thị danh sách dịch vụ
deactivate system

== Thêm dịch vụ mới ==
manager -> ui: 6. Chọn "Thêm dịch vụ mới"
manager -> ui: 7. Nhập thông tin dịch vụ\n(tên, mô tả, giá, thời gian, ảnh)
ui -> system: 8. Gửi thông tin dịch vụ mới
activate system
system -> system: 9. Kiểm tra thông tin
system -> db: 10. Lưu dịch vụ mới
activate db
db --> system: 11. Xác nhận lưu thành công
deactivate db
system --> ui: 12. Thông báo thêm thành công
deactivate system

== Cập nhật dịch vụ ==
manager -> ui: 13. Chọn dịch vụ cần sửa
manager -> ui: 14. Cập nhật thông tin
ui -> system: 15. Gửi thông tin cập nhật
activate system
system -> db: 16. Cập nhật trong CSDL
activate db
db --> system: 17. Xác nhận cập nhật
deactivate db
system --> ui: 18. Thông báo cập nhật thành công
deactivate system

== Gán stylist cho dịch vụ ==
manager -> ui: 19. Chọn "Gán stylist"
ui -> system: 20. Lấy danh sách stylist
activate system
system --> ui: 21. Hiển thị danh sách stylist
manager -> ui: 22. Chọn stylist cần gán
ui -> system: 23. Lưu thông tin gán
system -> db: 24. Cập nhật quan hệ dịch vụ-stylist
system --> ui: 25. Thông báo gán thành công
deactivate system
deactivate ui

@enduml
```

</details>

![Biểu đồ trình tự quản lý dịch vụ.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20tr%C3%ACnh%20t%E1%BB%B1%20qu%E1%BA%A3n%20l%C3%BD%20d%E1%BB%8Bch%20v%E1%BB%A5.svg)

### Luồng dữ liệu

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "DFD cấp 2 - Hệ thống đặt lịch hẹn"

!define PROCESS circle
!define EXTERNAL_ENTITY rectangle
!define DATA_STORE database

' External entities
EXTERNAL_ENTITY "Guest" as guest
EXTERNAL_ENTITY "Customer" as customer 
EXTERNAL_ENTITY "Stylist" as stylist
EXTERNAL_ENTITY "Manager" as manager

' Main processes
PROCESS "1.0\nQuản lý\nTài khoản" as acc_mgmt
PROCESS "2.0\nQuản lý\nLịch hẹn" as apt_mgmt  
PROCESS "3.0\nQuản lý\nDịch vụ" as svc_mgmt
PROCESS "4.0\nQuản lý\nStylist" as stylist_mgmt
PROCESS "5.0\nQuản lý\nThông tin Salon" as salon_mgmt

' Data stores
DATA_STORE "D1 Users" as users
DATA_STORE "D2 Appointments" as appointments
DATA_STORE "D3 Services" as services
DATA_STORE "D4 Salon" as salon

' Guest flows
guest --> acc_mgmt : Đăng ký/Đăng nhập
guest --> svc_mgmt : Xem/Tìm kiếm dịch vụ
guest --> stylist_mgmt : Xem thông tin stylist
guest --> salon_mgmt : Xem thông tin salon

' Customer flows 
customer --> apt_mgmt : Đặt/Hủy/Xem lịch hẹn
customer --> acc_mgmt : Cập nhật thông tin/Đổi mật khẩu

' Stylist flows
stylist --> apt_mgmt : Xem/Cập nhật trạng thái lịch hẹn

' Manager flows
manager --> stylist_mgmt : Quản lý stylist
manager --> svc_mgmt : Quản lý dịch vụ  
manager --> salon_mgmt : Cập nhật thông tin salon
manager --> apt_mgmt : Quản lý lịch hẹn

' Data store connections
acc_mgmt <--> users : Đọc/Ghi thông tin user
apt_mgmt <--> appointments : Đọc/Ghi lịch hẹn
svc_mgmt <--> services : Đọc/Ghi dịch vụ
salon_mgmt <--> salon : Đọc/Ghi thông tin salon
stylist_mgmt <--> users : Đọc/Ghi thông tin stylist

@enduml
```

</details>

![DFD cấp 2 - Hệ thống đặt lịch hẹn.svg](/docs/diagrams/DFD%20c%E1%BA%A5p%202%20-%20H%E1%BB%87%20th%E1%BB%91ng%20%C4%91%E1%BA%B7t%20l%E1%BB%8Bch%20h%E1%BA%B9n.svg)

### Các trạng thái thực thể trong hệ thống

#### Trạng thái lịch hẹn

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Biểu đồ trạng thái lịch hẹn"
[*] --> Pending : Tạo lịch hẹn
Pending --> Confirmed : Stylist chấp nhận
Pending --> Cancelled : Hủy bởi\nCustomer/Stylist
Confirmed --> Completed : Đã hoàn thành
Confirmed --> Cancelled : Hủy bởi\nCustomer/Stylist  
Confirmed --> NoShow : Khách không đến

state Pending
state Confirmed
state Completed
state Cancelled
state NoShow

note right of Pending : Chờ xác nhận
note right of Confirmed : Đã xác nhận
note right of Completed : Hoàn thành
note right of Cancelled : Đã hủy
note right of NoShow : Không đến

Cancelled --> [*]
Completed --> [*]
NoShow --> [*]
@enduml
```

</details>

![Biểu đồ trạng thái lịch hẹn.svg](/docs/diagrams/Bi%E1%BB%83u%20%C4%91%E1%BB%93%20tr%E1%BA%A1ng%20th%C3%A1i%20l%E1%BB%8Bch%20h%E1%BA%B9n.svg)

## III. Yêu cầu phi chức năng

### 1. Hiệu suất

* Thời gian tải trang không quá 3 giây
* Thời gian phản hồi API không quá 1 giây
* Hỗ trợ đồng thời ít nhất 30 người dùng
* Tối ưu hóa hình ảnh và tài nguyên

### 2. Bảo mật

* Mã hóa dữ liệu nhạy cảm trong cơ sở dữ liệu
* Bảo vệ chống tấn công SQL Injection
* Logging đầy đủ các hoạt động quan trọng
* Backup dữ liệu định kỳ

### 3. Khả năng mở rộng

* Kiến trúc module hóa, dễ thêm tính năng mới
* Khả năng tích hợp với các hệ thống bên thứ ba
* Dễ dàng nâng cấp phiên bản
* Documentation đầy đủ cho developers

### 4. Giao diện người dùng

* Thiết kế responsive cho mọi kích thước màn hình
* Thời gian học sử dụng không quá 30 phút
* Giao diện nhất quán trên toàn bộ hệ thống

### 5. Tương thích

* Hoạt động trên các trình duyệt phổ biến (Chrome, Firefox, Safari, Edge)
* Tương thích với các thiết bị di động iOS và Android
* Hỗ trợ các phiên bản trình duyệt từ 2 năm trở lại
* Tối ưu cho kết nối mạng chậm

### 6. Độ tin cậy

* Uptime tối thiểu 99.9%
* Thời gian phục hồi sau sự cố < 4 giờ
* Backup dữ liệu hàng ngày
* Có phương án dự phòng khi hệ thống gặp sự cố

### 7. Khả năng bảo trì

* Code được viết theo chuẩn clean code
* Tài liệu kỹ thuật chi tiết
* Dễ dàng rollback khi cần thiết

## IV. Công nghệ:

- **Frontend:** Sử dụng ReactJS để xây dựng giao diện người dùng.
- **Backend:** Sử dụng .NET để phát triển các dịch vụ backend.
- **API:** Sử dụng chuẩn REST API để giao tiếp giữa frontend và backend.
- **Cơ sở dữ liệu:** Sử dụng SQL Server để lưu trữ dữ liệu.
- **Bảo mật:** Sử dụng JWT để xác thực người dùng.
- **Thông báo:** Sử dụng email để thông báo cho người dùng.
- **Triển khai:** Sử dụng Docker để đóng gói và triển khai ứng dụng.
- **Quản lý mã nguồn:** Sử dụng Git để quản lý mã nguồn và GitHub để lưu trữ ma nguồn.

## V. Yêu cầu thiết kế

### Mô hình kiến trúc

Mô hình kiến trúc của hệ thống sẽ bao gồm các thành phần sau:

- **Client:** Giao diện người dùng, xây dựng bằng ReactJS, kết nối với API để lấy dữ liệu.
- **Server:** Dịch vụ API, xây dựng bằng ASP.NET Web API, sử dụng kiến trúc 3 lớp để xử lý logic.
    - **Presentation:** Xử lý các yêu cầu từ client, gọi các phương thức từ lớp Service.
    - **Business Logic:** Chứa logic xử lý chính của ứng dụng, gọi các phương thức từ lớp Repository.
    - **Data Access:** Tương tác với cơ sở dữ liệu, thực hiện các thao tác CRUD.
- **Database:** Cơ sở dữ liệu SQL Server, lưu trữ thông tin người dùng, lịch hẹn, dịch vụ...

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Mô hình kiến trúc"

package "Client" {
    [ReactJS]
}

package "Server" {
    [Controller]
    [Service]
    [Repository]
}

database "Database" {
}

[ReactJS] ..> [Controller] : REST API
[Controller] --> [Service]
[Service] --> [Repository]
[Repository] --> [Database]

@enduml
```

</details>

![Mô hình kiến trúc.svg](/docs/diagrams/M%C3%B4%20h%C3%ACnh%20ki%E1%BA%BFn%20tr%C3%BAc.svg)

### Mô hình cơ sở dữ liệu

Cơ sở dữ liệu sẽ bao gồm các bảng sau:

- **Users:** Lưu thông tin người dùng, bao gồm tên, email, mật khẩu, quyền...
- **Appointments:** Lịch hẹn, bao gồm thông tin khách hàng, stylist, thời gian...
- **Services:** Dịch vụ, bao gồm tên, mô tả, giá cả...
- **Stylists:** Stylist, bao gồm tên, ảnh đại diện, kinh nghiệm...
- **Salon:** Thông tin salon, bao gồm địa chỉ, số điện thoại, giờ mở cửa...

<details>

<summary>Code PlantUML</summary>

```plantuml
@startuml "Mô hình cơ sở dữ liệu"

entity User {
  * id: string <<PK>>
  --
  * firstName: string(50)
  * lastName: string(50)
  * email: string(256)
  * phoneNumber: string
  bio: string(128)
  imageUrl: string(256)
  specialties: string[]
}

entity Role {
  * id: string <<PK>>
  --
  * name: string(256)
}

entity UserRole {
  * userId: string <<FK>>
  * roleId: string <<FK>>
}

entity Service {
  * id: guid <<PK>>
  --
  * name: string(50)
  * description: string(256)
  * price: decimal(10,2)
  * durationMinutes: int
  imageUrl: string(256)
  isDeleted: bool
}

entity ServiceStylist {
  * serviceId: guid <<FK>>
  * stylistId: string <<FK>>
}

entity Appointment {
  * id: guid <<PK>>
  --
  * customerId: string <<FK>>
  * stylistId: string <<FK>>
  * serviceId: guid <<FK>>
  * dateTime: datetime
  * status: string(16)
  * totalPrice: decimal(10,2)
  customerNotes: string(128)
  stylistNotes: string(128)
}

entity Salon {
  * id: guid <<PK>>
  --
  * name: string(50)  
  * description: string(256)
  * address: string(256)
  * phoneNumber: string(20)
  * email: string(128)
  * openingTime: time
  * closingTime: time
  * leadWeeks: int
}

User "1" -- "*" UserRole
Role "1" -- "*" UserRole
User "1" -- "*" ServiceStylist
Service "1" -- "*" ServiceStylist
User "1" -- "*" Appointment : customer
User "1" -- "*" Appointment : stylist  
Service "1" -- "*" Appointment

@enduml
```

</details>

![Mô hình cơ sở dữ liệu.svg](/docs/diagrams/M%C3%B4%20h%C3%ACnh%20c%C6%A1%20s%E1%BB%9F%20d%E1%BB%AF%20li%E1%BB%87u.svg)

### Giao diện người dùng

Giao diện người dùng sẽ bao gồm các trang sau:

- **Trang chủ:** Hiển thị thông tin salon, các dịch vụ, stylist nổi bật.
- **Trang dịch vụ:** Hiển thị danh sách dịch vụ, cho phép tìm kiếm và xem chi tiết.
- **Trang đặt lịch hẹn:** Truy cập từ trang dịch vụ, cho phép chọn dịch vụ, stylist, ngày, giờ.
- **Trang cá nhân:** Hiển thị thông tin cá nhân, cho phép cập nhật thông tin, đổi mật khẩu, quản lý lịch hẹn.
- **Trang quản lý:** Dành cho stylist và quản lý, cho phép xem lịch hẹn, cập nhật trạng thái.
