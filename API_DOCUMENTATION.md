# 🌻 Flower Shop API Documentation

REST API для квіткового магазину з системою замовлень, каталогом квітів та управлінням магазинами.

## 📋 Зміст

- [Базові налаштування](#базові-налаштування)
- [Квіти (Products)](#квіти-products)
- [Замовлення (Orders)](#замовлення-orders)
- [Магазини (Shops)](#магазини-shops)
- [Аутентифікація (Auth)](#аутентифікація-auth)
- [Користувачі (Users)](#користувачі-users)
- [Пости (Posts)](#пости-posts)

---

## 🔧 Базові налаштування

**Base URL:** `http://localhost:3300/api/v1`

**Swagger UI:** `http://localhost:3300/api`

**Content-Type:** `application/json`

---

## 🌸 Квіти (Products)

### GET /products

Отримати список квітів з пагінацією та фільтрами.

**Query параметри:**

- `page` (number, optional) - номер сторінки (за замовчуванням: 1)
- `limit` (number, optional) - кількість елементів на сторінці (за замовчуванням: 20, максимум: 100)
- `category` (string, optional) - фільтр по категорії
- `search` (string, optional) - пошук по назві або опису
- `isActive` (boolean, optional) - фільтр по активності

**Приклад запиту:**

```bash
GET /api/v1/products?page=1&limit=10&category=Рози&search=червоні
```

**Відповідь:**

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Червоні троянди",
      "description": "Красиві червоні троянди для особливих моментів",
      "price": 450,
      "category": "Рози",
      "imageUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
      "isActive": true,
      "createdAt": "2025-01-16T22:00:00.000Z",
      "updatedAt": "2025-01-16T22:00:00.000Z"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10,
  "totalPages": 2
}
```

### GET /products/categories

Отримати список всіх категорій квітів.

**Відповідь:**

```json
["Рози", "Тюльпани", "Лілії", "Хризантеми", "Орхідеї"]
```

**Доступні категорії квітів:**

- **Рози** (5 видів) - від 420 до 480 грн
- **Тюльпани** (5 видів) - від 350 до 390 грн
- **Лілії** (4 види) - від 500 до 530 грн
- **Хризантеми** (4 види) - від 300 до 330 грн
- **Орхідеї** (2 види) - від 650 до 680 грн

### GET /products/:id

Отримати один квіт за ID.

**Параметри:**

- `id` (string, required) - UUID квіта

**Відповідь:**

```json
{
  "id": "uuid",
  "name": "Червоні троянди",
  "description": "Красиві червоні троянди для особливих моментів",
  "price": 450,
  "category": "Рози",
  "imageUrl": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400",
  "isActive": true,
  "createdAt": "2025-01-16T22:00:00.000Z",
  "updatedAt": "2025-01-16T22:00:00.000Z"
}
```

### POST /products

Створити новий квіт (для адміністратора).

**Тіло запиту:**

```json
{
  "name": "Нові квіти",
  "description": "Опис квітів",
  "price": 500,
  "category": "Рози",
  "imageUrl": "https://example.com/image.jpg",
  "isActive": true
}
```

### PATCH /products/:id

Оновити квіт (для адміністратора).

**Параметри:**

- `id` (string, required) - UUID квіта

**Тіло запиту:** (всі поля опціональні)

```json
{
  "name": "Оновлена назва",
  "price": 550,
  "isActive": false
}
```

### DELETE /products/:id

Видалити квіт (для адміністратора).

**Параметри:**

- `id` (string, required) - UUID квіта

---

## 🛒 Замовлення (Orders)

### POST /orders

Створити нове замовлення.

**Тіло запиту:**

```json
{
  "shopId": "761ed028-1003-43cd-aa26-26370908ab1d",
  "deliveryAddr": "вул. Хрещатик, 1, Київ",
  "deliveryAt": "2025-01-20T14:00:00",
  "userTimezone": "Europe/Kyiv",
  "items": [
    {
      "productId": "b0f5758e-3b8a-47ea-97e6-84524ce5425e",
      "name": "Оранжеві троянди",
      "qty": 2,
      "price": 440
    }
  ],
  "totalPrice": 880
}
```

**Відповідь:**

```json
{
  "id": "order-uuid",
  "shopId": "shop-uuid",
  "totalPrice": 2250,
  "deliveryAddr": "вул. Хрещатик, 1, Київ",
  "deliveryAtUTC": "2025-01-20T12:00:00.000Z",
  "createdAt": "2025-01-16T22:00:00.000Z",
  "updatedAt": "2025-01-16T22:00:00.000Z",
  "shop": {
    "id": "shop-uuid",
    "name": "Квітковий рай",
    "address": "вул. Садова, 5",
    "latitude": 50.4501,
    "longitude": 30.5234
  },
  "items": [
    {
      "id": "item-uuid",
      "productId": "product-uuid",
      "name": "Червоні троянди",
      "qty": 5,
      "price": 450
    }
  ]
}
```

### GET /orders

Отримати список замовлень з пагінацією.

**Query параметри:**

- `page` (number, optional) - номер сторінки (за замовчуванням: 1)
- `limit` (number, optional) - кількість елементів на сторінці (за замовчуванням: 20, максимум: 100)

**Відповідь:**

```json
{
  "items": [
    {
      "id": "order-uuid",
      "shopId": "shop-uuid",
      "totalPrice": 2250,
      "deliveryAddr": "вул. Хрещатик, 1, Київ",
      "deliveryAtUTC": "2025-01-20T12:00:00.000Z",
      "createdAt": "2025-01-16T22:00:00.000Z",
      "updatedAt": "2025-01-16T22:00:00.000Z",
      "shop": {
        /* дані магазину */
      },
      "items": [
        /* позиції замовлення */
      ]
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

### GET /orders/:id

Отримати замовлення за ID.

**Параметри:**

- `id` (string, required) - UUID замовлення

**Відповідь:** (аналогічна до POST /orders)

---

## 🏪 Магазини (Shops)

### GET /shops/:id

Отримати магазин за ID з координатами.

**Параметри:**

- `id` (string, required) - UUID магазину

**Відповідь:**

```json
{
  "id": "761ed028-1003-43cd-aa26-26370908ab1d",
  "name": "Квітковий рай",
  "address": "вул. Хрещатик, 22, Київ, Україна",
  "latitude": 50.4501,
  "longitude": 30.5234,
  "createdAt": "2025-09-17T05:16:25.925Z",
  "updatedAt": "2025-09-17T05:16:25.925Z"
}
```

### Доступні магазини:

- **Квітковий рай** (ID: `761ed028-1003-43cd-aa26-26370908ab1d`) - вул. Хрещатик, 22, Київ
- **Ромашкове поле** (ID: `ee2cdbe6-5e6c-4222-bde3-d1fc754d6007`) - пр. Перемоги, 15, Київ
- **Трояндовий сад** (ID: `15507b63-c0ab-4ae8-ba35-bb5bc9f834d1`) - вул. Шевченка, 8, Львів

---

## 🔐 Аутентифікація (Auth)

### POST /auth/login

Увійти в систему.

**Тіло запиту:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Відповідь:**

```json
{
  "access_token": "jwt-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "Іван Іванов"
  }
}
```

### POST /auth/register

Зареєструвати нового користувача.

**Тіло запиту:**

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "Новий Користувач"
}
```

---

## 👤 Користувачі (Users)

### GET /users

Отримати список користувачів (з пагінацією).

### GET /users/:id

Отримати користувача за ID.

### POST /users

Створити нового користувача.

### PATCH /users/:id

Оновити користувача.

### DELETE /users/:id

Видалити користувача.

---

## 📝 Пости (Posts)

### GET /posts

Отримати список постів (з пагінацією).

### GET /posts/:id

Отримати пост за ID.

### POST /posts

Створити новий пост.

### PATCH /posts/:id

Оновити пост.

### DELETE /posts/:id

Видалити пост.

---

## 🚨 Коди помилок

- `400` - Помилка валідації даних
- `401` - Не авторизований
- `403` - Доступ заборонений
- `404` - Ресурс не знайдено
- `500` - Внутрішня помилка сервера

## 📝 Приклади використання

### Отримати квіти категорії "Рози"

```bash
curl -X GET "http://localhost:3300/api/v1/products?category=Рози&limit=5"
```

### Отримати тюльпани

```bash
curl -X GET "http://localhost:3300/api/v1/products?category=Тюльпани&limit=10"
```

### Отримати лілії

```bash
curl -X GET "http://localhost:3300/api/v1/products?category=Лілії&limit=10"
```

### Створити замовлення

```bash
curl -X POST "http://localhost:3300/api/v1/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "shopId": "761ed028-1003-43cd-aa26-26370908ab1d",
    "deliveryAddr": "вул. Хрещатик, 1, Київ",
    "deliveryAt": "2025-01-20T14:00:00",
    "userTimezone": "Europe/Kyiv",
    "items": [
      {
        "productId": "b0f5758e-3b8a-47ea-97e6-84524ce5425e",
        "name": "Оранжеві троянди",
        "qty": 2,
        "price": 440
      }
    ],
    "totalPrice": 880
  }'
```

### Пошук квітів

```bash
curl -X GET "http://localhost:3300/api/v1/products?search=троянди&page=1&limit=10"
```

---

## 🔗 Корисні посилання

- **Swagger UI:** http://localhost:3300/api
- **Health Check:** http://localhost:3300/api/health (якщо реалізовано)

---

_Документація оновлена: 16 січня 2025_
