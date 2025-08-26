# Aesap API Documentation

## Endpoints :

List of available endpoints:
​

- `POST /login`
- `GET /pub/products`
- `GET /pub/products/:id`
- `GET /pub/categories`

List of available endpoints (require login):
​

- `POST /add-user` (Admin only)
- `GET /products`
- `POST /products`
- `GET /products/:id`
- `PUT /products/:id`
- `DELETE /products/:id`
- `PATCH /products/:id/image-url`
- `GET /categories`
- `POST /categories`
- `GET /categories/:id`
- `PUT /categories/:id`

&nbsp;

## 1. POST /add-user

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- body:

```json
{
  "email": "amuro@mail.com",
  "password": "amuro123",
  "phoneNumber": "0999999999",
  "address": "Earth"
}
```

_Response (201 - Created)_

```json
{
  "role": "Staff",
  "id": 3,
  "email": "amuro@mail.com",
  "phoneNumber": "0999999999",
  "address": "Earth",
  "updatedAt": "2025-01-09T01:36:32.124Z",
  "createdAt": "2025-01-09T01:36:32.124Z"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

&nbsp;

## 2. POST /login

Request:

- body:

```json
{
  "email": "admin@gmail.com",
  "password": "admin123"
}
```

_Response (200 - OK)_
​

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY",
  "user": {
    "id": 1,
    "email": "admin@gmail.com"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid email/password"
}
```

&nbsp;

## 3. GET /products

Description: Get all products with pagination, search, filter, and sort (Admin or Staff)

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- query (optional):

```
?search=cleanser&filter=1&sort=name&page[size]=10&page[number]=1
```

_Response (200 - OK)_
​

```json
{
  "page": 1,
  "data": [
    {
      "id": 1,
      "name": "Parsley Seed Facial Cleanser",
      "description": "A gentle gel cleanser enhanced with lactic acid for daily use.",
      "price": 480000,
      "stock": 50,
      "imgUrl": "https://cdn.aesop.com/parsley-cleanser.jpg",
      "categoryId": 1,
      "authorId": 1,
      "createdAt": "2025-01-09T01:08:27.230Z",
      "updatedAt": "2025-01-09T01:08:27.230Z",
      "User": {
        "id": 1,
        "email": "admin@gmail.com",
        "role": "Admin",
        "phoneNumber": "0888888888",
        "address": "sector seven"
      }
    }
  ],
  "totalData": 25,
  "totalPage": 3,
  "dataPerPage": 10
}
```

&nbsp;

## 4. POST /products

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- body:

```json
{
  "name": "Resurrection Aromatique Hand Balm",
  "description": "A rich, emollient balm to soften and hydrate hands.",
  "price": 290000,
  "stock": 100,
  "imgUrl": "https://cdn.aesop.com/hand-balm.jpg",
  "categoryId": 3
}
```

_Response (201 - Created)_

```json
{
  "id": 26,
  "name": "Resurrection Aromatique Hand Balm",
  "description": "A rich, emollient balm to soften and hydrate hands.",
  "price": 290000,
  "stock": 100,
  "imgUrl": "https://cdn.aesop.com/hand-balm.jpg",
  "categoryId": 3,
  "authorId": 1,
  "updatedAt": "2025-01-09T03:31:46.574Z",
  "createdAt": "2025-01-09T03:31:46.574Z"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Name is required"
}
OR
{
  "message": "Description is required"
}
OR
{
  "message": "Price is required"
}
OR
{
  "message": "Stock is required"
}
OR
{
  "message": "ImageUrl is required"
}
OR
{
  "message": "CategoryId is required"
}
```

&nbsp;

## 5. GET /products/:id

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- params:

```json
{
  "id": 1
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "name": "Parsley Seed Facial Cleanser",
  "description": "A gentle gel cleanser enhanced with lactic acid for daily use.",
  "price": 480000,
  "stock": 50,
  "imgUrl": "https://cdn.aesop.com/parsley-cleanser.jpg",
  "categoryId": 1,
  "authorId": 1,
  "createdAt": "2025-01-09T01:08:27.230Z",
  "updatedAt": "2025-01-09T01:08:27.230Z"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <id> not found"
}
```

&nbsp;

## 6. PUT /products/:id

description:
Admin can update every product & Staff only can update product with their own Id (authorId)

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- params:

```json
{
  "id": 1
}
```

- body:

```json
{
  "name": "Parsley Seed Facial Cleanser Updated",
  "description": "An updated gentle gel cleanser enhanced with lactic acid for daily use.",
  "price": 520000,
  "stock": 45,
  "imgUrl": "https://cdn.aesop.com/parsley-cleanser-updated.jpg",
  "categoryId": 1
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "name": "Parsley Seed Facial Cleanser Updated",
  "description": "An updated gentle gel cleanser enhanced with lactic acid for daily use.",
  "price": 520000,
  "stock": 45,
  "imgUrl": "https://cdn.aesop.com/parsley-cleanser-updated.jpg",
  "categoryId": 1,
  "authorId": 1,
  "createdAt": "2025-01-09T01:08:27.230Z",
  "updatedAt": "2025-01-09T05:15:30.123Z"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <id> not found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Name is required"
}
OR
{
  "message": "Description is required"
}
OR
{
  "message": "Price is required"
}
OR
{
  "message": "Stock is required"
}
OR
{
  "message": "ImageUrl is required"
}
OR
{
  "message": "CategoryId is required"
}
```

&nbsp;

## 7. DELETE /products/:id

description:
Admin can delete every product & Staff only can delete product with their own Id (authorId)

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- params:

```json
{
  "id": 1
}
```

_Response (200 - OK)_

```json
{
  "message": "Parsley Seed Facial Cleanser success to delete"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <id> not found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

&nbsp;

## 8. PATCH /products/:id/image-url

description:
Admin can update every product image & Staff only can update product image with their own Id (authorId)

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- params:

```json
{
  "id": 1
}
```

- body(form-data):

```makefile
  Key: imageUrl
  Value: (file) product-image.jpg
```

_Response (200 - OK)_

```json
{
  "message": "ImageURL for Product id 1 has been updated"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <id> not foundd"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "ImageURL file is required"
}
```

&nbsp;

## 9. GET /categories

Description: Get all categories (Admin or Staff)

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 1,
    "name": "Skin Care",
    "createdAt": "2025-01-09T01:08:27.223Z",
    "updatedAt": "2025-01-09T01:08:27.223Z"
  },
  {
    "id": 2,
    "name": "Hair Care",
    "createdAt": "2025-01-09T01:08:27.223Z",
    "updatedAt": "2025-01-09T01:08:27.223Z"
  },
  {
    "id": 3,
    "name": "Body Care",
    "createdAt": "2025-01-09T01:08:27.223Z",
    "updatedAt": "2025-01-09T01:08:27.223Z"
  }
]
```

&nbsp;

## 10. POST /categories

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- body:

```json
{
  "name": "Makeup"
}
```

_Response (201 - Created)_

```json
{
  "id": 6,
  "name": "Makeup",
  "updatedAt": "2025-01-09T05:10:00.529Z",
  "createdAt": "2025-01-09T05:10:00.529Z"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Name is required"
}
```

&nbsp;

## 11. GET /categories/:id

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- params:

```json
{
  "id": 1
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "name": "Skin Care",
  "createdAt": "2025-01-09T01:08:27.223Z",
  "updatedAt": "2025-01-09T01:08:27.223Z"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Category with id <id> not found"
}
```

&nbsp;

## 12. GET /pub/products

Description: Get all products without login with pagination, search, filter, and sort

Request:

- `-`

- query (optional):

```
?search=cleanser&filter=1&sort=name&page[size]=10&page[number]=1
```

_Response (200 - OK)_
​

```json
{
  "page": 1,
  "data": [
    {
      "id": 1,
      "name": "Parsley Seed Facial Cleanser",
      "description": "A gentle gel cleanser enhanced with lactic acid for daily use.",
      "price": 480000,
      "stock": 50,
      "imgUrl": "https://cdn.aesop.com/parsley-cleanser.jpg",
      "categoryId": 1,
      "authorId": 1,
      "createdAt": "2025-01-09T01:08:27.230Z",
      "updatedAt": "2025-01-09T01:08:27.230Z"
    },
    {
      "id": 2,
      "name": "Geranium Leaf Body Cleanser",
      "description": "A gentle, low-foaming gel cleanser for the body.",
      "price": 520000,
      "stock": 30,
      "imgUrl": "https://cdn.aesop.com/geranium-body-cleanser.jpg",
      "categoryId": 3,
      "authorId": 1,
      "createdAt": "2025-01-09T01:08:27.230Z",
      "updatedAt": "2025-01-09T01:08:27.230Z"
    }
  ],
  "totalData": 25,
  "totalPage": 3,
  "dataPerPage": 10
}
```

&nbsp;

## 13. GET /pub/products/:id

Request:

- `-`

- params:

```json
{
  "id": 1
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "name": "Parsley Seed Facial Cleanser",
  "description": "A gentle gel cleanser enhanced with lactic acid for daily use.",
  "price": 480000,
  "stock": 50,
  "imgUrl": "https://cdn.aesop.com/parsley-cleanser.jpg",
  "categoryId": 1,
  "authorId": 1,
  "createdAt": "2025-01-09T01:08:27.230Z",
  "updatedAt": "2025-01-09T01:08:27.230Z"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Product with id <id> not found"
}
```

&nbsp;

## 14. GET /pub/categories

Description: Get all categories without login

Request:

- `-`

_Response (200 - OK)_

```json
[
  {
    "id": 1,
    "name": "Skin Care",
    "createdAt": "2025-01-09T01:08:27.223Z",
    "updatedAt": "2025-01-09T01:08:27.223Z"
  },
  {
    "id": 2,
    "name": "Hair Care",
    "createdAt": "2025-01-09T01:08:27.223Z",
    "updatedAt": "2025-01-09T01:08:27.223Z"
  },
  {
    "id": 3,
    "name": "Body Care",
    "createdAt": "2025-01-09T01:08:27.223Z",
    "updatedAt": "2025-01-09T01:08:27.223Z"
  }
]
```

&nbsp;

## 15. PUT /categories/:id

description:
Admin & Staff can update every category

Request:

- headers:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ5ODcwMTMzfQ.cWf79JsGqCsRNl6BXCEXEdpHkLY11HvyM0wvGvl2-nY"
}
```

- params:

```json
{
  "id": 1
}
```

- body:

```json
{
  "name": "Face Wash"
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "name": "Face Wash",
  "createdAt": "2025-07-09T08:34:40.599Z",
  "updatedAt": "2025-07-10T08:26:18.569Z"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Category with id <id> not found"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Name is required"
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are not authorized"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal server error"
}
```

&nbsp;

## Query Parameters

### Products Endpoints

#### Search

- `?search=cleanser` - Search products by name

#### Filter

- `?filter=1` - Filter products by category ID

#### Sort

- `?sort=name` - Sort products by name (ascending)
- `?sort=-name` - Sort products by name (descending)
- `?sort=price` - Sort products by price (ascending)
- `?sort=-price` - Sort products by price (descending)

#### Pagination

- `?page[size]=10` - Number of items per page (default: 10)
- `?page[number]=1` - Page number (default: 1)

#### Combined Example

```
GET /products?search=cleanser&filter=1&sort=-price&page[size]=5&page[number]=2
```

This will search for products containing "cleanser" in the name, filter by category ID 1, sort by price descending, show 5 items per page, and display page 2.
