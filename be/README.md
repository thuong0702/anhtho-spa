<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
# API nghiệp vụ hiện có

BE dùng database `anhtho_spa` trong MySQL. Cấu hình trong `.env` dựa theo `.env.example`; schema được quản lý bằng `database/schema.sql`, TypeORM không tự sửa schema khi khởi động.

Các endpoint hiện có:

| Method | Endpoint | Quyền / tác dụng |
| --- | --- | --- |
| `GET` | `/categories?type=product` | Danh sách danh mục đang hoạt động; `type` có thể là `product` hoặc `service`. |
| `POST` | `/categories` | Tạo danh mục, cần header `x-admin-api-key`. |
| `GET` | `/products` | Danh sách sản phẩm đang bán. |
| `POST`, `PUT` | `/products`, `/products/:id` | Thêm/cập nhật sản phẩm, cần header quản trị. |
| `GET` | `/services` | Danh sách dịch vụ đang hoạt động. |
| `POST`, `PUT` | `/services`, `/services/:id` | Thêm/cập nhật dịch vụ, cần header quản trị. |
| `POST` | `/bookings` | Khách gửi yêu cầu đặt lịch. |
| `GET` | `/bookings` | Danh sách lịch hẹn, cần header quản trị. |
| `PATCH` | `/bookings/:id/status` | Đổi trạng thái lịch hẹn, cần header quản trị; body `{ "status": "confirmed" }`. |
| `POST` | `/orders` | Tạo đơn online; server tự lấy giá và kiểm tra/trừ tồn kho. |
| `POST` | `/orders/store` | Tạo giao dịch tại cửa hàng, cần header quản trị. |
| `GET` | `/orders`, `/orders/:id` | Tra cứu đơn, cần header quản trị. |
| `PATCH` | `/orders/:id/status` | Đổi trạng thái đơn, cần header quản trị. |

Ví dụ tạo đơn online:

```json
{
  "customerName": "Nguyễn Thị Lan",
  "customerPhone": "0987654321",
  "customerEmail": "lan@example.com",
  "shippingAddress": "Nam Đàn, Nghệ An",
  "paymentMethod": "cod",
  "items": [{ "productId": 1, "quantity": 2 }]
}
```

Ví dụ thêm sản phẩm:

```json
{
  "categoryId": 1,
  "sku": "SP001",
  "name": "Serum phục hồi da",
  "description": "Serum dưỡng ẩm",
  "price": 680000,
  "imageUrl": "/products/serum.svg",
  "stockQuantity": 18
}
```

Đặt `ADMIN_API_KEY` trong file `.env` bằng một chuỗi bí mật dài; gửi giá trị đó trong header `x-admin-api-key` khi gọi API quản trị. Đây là khóa bảo vệ tạm thời cho giai đoạn nối API, chưa thay thế đăng nhập JWT và phân quyền theo tài khoản nhân viên/quản trị viên.

