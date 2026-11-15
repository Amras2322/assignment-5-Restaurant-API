// Import packages, initialize an express app, and define the port you will use
const express = require("express");
const app = express();
const PORT = 3000;


app.use(express.json());


// Data for the server
let menuItems = [
  {
    id: 1,
    name: "Classic Burger",
    description: "Beef patty with lettuce, tomato, and cheese on a sesame seed bun",
    price: 12.99,
    category: "entree",
    ingredients: ["beef", "lettuce", "tomato", "cheese", "bun"],
    available: true
  },
  {
    id: 2,
    name: "Chicken Caesar Salad",
    description: "Grilled chicken breast over romaine lettuce with parmesan and croutons",
    price: 11.50,
    category: "entree",
    ingredients: ["chicken", "romaine lettuce", "parmesan cheese", "croutons", "caesar dressing"],
    available: true
  },
  {
    id: 3,
    name: "Mozzarella Sticks",
    description: "Crispy breaded mozzarella served with marinara sauce",
    price: 8.99,
    category: "appetizer",
    ingredients: ["mozzarella cheese", "breadcrumbs", "marinara sauce"],
    available: true
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 7.99,
    category: "dessert",
    ingredients: ["chocolate", "flour", "eggs", "butter", "vanilla ice cream"],
    available: true
  },
  {
    id: 5,
    name: "Fresh Lemonade",
    description: "House-made lemonade with fresh lemons and mint",
    price: 3.99,
    category: "beverage",
    ingredients: ["lemons", "sugar", "water", "mint"],
    available: true
  },
  {
    id: 6,
    name: "Fish and Chips",
    description: "Beer-battered cod with seasoned fries and coleslaw",
    price: 14.99,
    category: "entree",
    ingredients: ["cod", "beer batter", "potatoes", "coleslaw", "tartar sauce"],
    available: false
  }
];

// GET / - Welcome Message
app.get('/', (req, res) => {
    res.send('Restaurant API server running!');
})

// GET /api/menu - Retrieve all menu items
app.get('/api/menu', (req, res) => {
    res.json(menuItems);
});

// GET /api/menu/:id - Retrieve a specific menu item by ID
app.get('/api/menu/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = menuItems.find((m) => m.id === itemId);

    if (item) {
        res.json(item);
    } else {
        res.status(404).json({error: 'Menu item not found'});
    }
});

// POST /api/menu - Add a new menu item
app.post('/api/menu', (req, res) => {
    const { name, description, price, category, ingredients, available } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Name and description are required' });
    }

    const newItem = {
        id: menuItems.length + 1,
        name,
        description,
        price,
        category,
        ingredients,
        available
    };

    menuItems.push(newItem);

    res.status(201).json(newItem);
});

// PUT /api/menu/:id - Update an existing menu item
app.put('/api/menu/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const { name, description, price, category, ingredients, available } = req.body;

    //Find the menu item to update
    const itemIndex = menuItems.findIndex((m) => m.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({error: 'Menu item not found'})
    }

    // Reject empty update bodies
    if ([name, description, price, category, ingredients, available].every((value) => value === undefined)) {
        return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    // Partially update only the fields that were provided
    const item = menuItems[itemIndex];
    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (category !== undefined) item.category = category;
    if (ingredients !== undefined) item.ingredients = ingredients;
    if (available !== undefined) item.available = available;

    res.json(item);
});

// DELETE /api/menu/:id - Remove a menu item
app.delete('/api/menu/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const itemIndex = menuItems.findIndex((m) => m.id === itemId);

    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Menu item not found' });
    }

    const deletedItem = menuItems.splice(itemIndex, 1)[0];

    res.json({ message: 'Menu item deleted successfully', item: deletedItem });
});

// Only start server when running directly, not when testing
if (require.main === module) {
    app.listen(PORT, () => {
         console.log(`Restaurant API server running at http://localhost:${PORT}`);
    });
}

module.exports = app;