const express = require("express");
const cors = require("cors");
const { nanoid } = require("nanoid");

const app = express();
const port = 3000;

// Данные: плюшевые медведи (вместо users из методички)
let products = [
  { id: nanoid(6), name: "Тедди Классик",    category: "Классические", description: "Мягкий плюшевый медведь в классическом стиле с бархатными ушками.",    price: 1290, stock: 25, rating: 4.8 },
  { id: nanoid(6), name: "Панда Чи-Чи",      category: "Панды",        description: "Очаровательная панда с чёрно-белым окрасом и большими блестящими глазами.", price: 1590, stock: 18, rating: 4.9 },
  { id: nanoid(6), name: "Мишка Снежок",     category: "Зимние",       description: "Белоснежный медведь в вязаном шарфике. Создаёт уют в любое время года.", price: 1890, stock: 12, rating: 4.7 },
  { id: nanoid(6), name: "Медведь-Космонавт",category: "Тематические",  description: "Плюшевый медведь в скафандре. Мечтает покорить космос вместе с вами.", price: 2490, stock:  8, rating: 5.0 },
  { id: nanoid(6), name: "Бурый Гриша",      category: "Классические", description: "Большой уютный медведь бурого цвета с мягким животиком. Любит объятия.", price: 2190, stock: 15, rating: 4.6 },
  { id: nanoid(6), name: "Радужный Тедди",   category: "Праздничные",  description: "Яркий медведь с радужной расцветкой. Поднимает настроение с первого взгляда!", price: 1750, stock: 20, rating: 4.5 },
  { id: nanoid(6), name: "Медведица Розочка",category: "Праздничные",  description: "Нежная розовая медведица с бантиком и сердечком в лапках.", price: 1650, stock: 22, rating: 4.8 },
  { id: nanoid(6), name: "Полярный Ледик",   category: "Зимние",       description: "Белоснежный полярный медведь с голубыми глазами. Любит арктические приключения.", price: 2090, stock: 10, rating: 4.7 },
  { id: nanoid(6), name: "Мини-Тедди",       category: "Маленькие",   description: "Крохотный медведик размером с ладонь. Помещается в карман — всегда рядом!", price: 590, stock: 50, rating: 4.4 },
  { id: nanoid(6), name: "Мишка-Повар",      category: "Тематические",  description: "Плюшевый медведь в поварском колпаке и фартуке. Любит готовить воображаемые блюда.", price: 2350, stock: 9, rating: 4.9 },
  { id: nanoid(6), name: "Великан Боб",      category: "Большие",      description: "Огромный медведь высотой 80 см. Лучший друг для длинных зимних вечеров.", price: 4990, stock: 5, rating: 4.9 },
  { id: nanoid(6), name: "Эко-Медведь Лесик",category: "Классические", description: "Из 100% переработанных материалов. Заботится о природе так же, как вы заботитесь о нём.", price: 1990, stock: 30, rating: 4.6 },
];

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
      console.log("Body:", req.body);
    }
  });
  next();
});

// CORS — разрешаем запросы от фронтенда
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Функция-помощник для получения товара из списка
function findProductOr404(id, res) {
  const product = products.find((p) => p.id === id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return null;
  }
  return product;
}

// POST /api/products
app.post("/api/products", (req, res) => {
  const { name, category, description, price, stock, rating } = req.body;
  const newProduct = {
    id: nanoid(6),
    name: name.trim(),
    category: category.trim(),
    description: description.trim(),
    price: Number(price),
    stock: Number(stock),
    rating: rating ? Number(rating) : 0,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// GET /api/products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// GET /api/products/:id
app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;
  res.json(product);
});

// PATCH /api/products/:id
app.patch("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const product = findProductOr404(id, res);
  if (!product) return;

  // Нельзя PATCH без полей
  if (
    req.body?.name === undefined &&
    req.body?.category === undefined &&
    req.body?.description === undefined &&
    req.body?.price === undefined &&
    req.body?.stock === undefined &&
    req.body?.rating === undefined
  ) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  const { name, category, description, price, stock, rating } = req.body;
  if (name !== undefined)        product.name = name.trim();
  if (category !== undefined)    product.category = category.trim();
  if (description !== undefined) product.description = description.trim();
  if (price !== undefined)       product.price = Number(price);
  if (stock !== undefined)       product.stock = Number(stock);
  if (rating !== undefined)      product.rating = Number(rating);

  res.json(product);
});

// DELETE /api/products/:id
app.delete("/api/products/:id", (req, res) => {
  const id = req.params.id;
  const exists = products.some((p) => p.id === id);
  if (!exists) return res.status(404).json({ error: "Product not found" });

  products = products.filter((p) => p.id !== id);

  // Правильное 204 без тела
  res.status(204).send();
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок (чтобы сервер не падал)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
