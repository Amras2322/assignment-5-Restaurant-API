// Import packages, initialize an express app, and define the port you will use
const express = require("express");
const { body, validationResult } = require('express-validator');
const app = express();
const PORT = 3000;

// Custom request logging middleware
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);

    // Log request body for POST and PUT requests
    if (req.method === 'POST' || req.method === 'PUT') {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }

    next(); // Pass control to next middleware
};

// Built-in middleware for parsing JSON
app.use(express.json());

// Custom logging middleware
app.use(requestLogger);


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

// Complete validation rules for menu items
const menuItemValidation = [
    body('name')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    body('description')
        .isLength({ min: 10 })
        .withMessage('Description must be at least 10 characters long'),

    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a number greater than 0'),

    body('category')
        .isIn(['appetizer', 'entree', 'dessert', 'beverage'])
        .withMessage('Category must be appetizer, entree, dessert, or beverage'),

    body('ingredients')
        .isArray({ min: 1 })
        .withMessage('Ingredients must be an array with at least one ingredient'),

    body('available')
        .optional()
        .isBoolean()
        .withMessage('Available must be true or false')
];

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);

        return res.status(400).json({
            error: 'Validation failed',
            messages: errorMessages
        });
    }

    // Set default value for available if not provided
    if (req.body.available === undefined) {
        req.body.available = true;
    }

    next();
};

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
app.post('/api/menu', menuItemValidation, handleValidationErrors, (req, res) => {
    const { name, description, price, category, ingredients, available } = req.body;

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
app.put('/api/menu/:id', menuItemValidation, handleValidationErrors, (req, res) => {
    const itemId = parseInt(req.params.id);
    const { name, description, price, category, ingredients, available } = req.body;

    // Find the menu item to update
    const item = menuItems.find((m) => m.id === itemId);

    if (!item) {
        return res.status(404).json({error: 'Menu item not found'})
    }

    // Update all of the menu item's fields
    item.name = name;
    item.description = description;
    item.price = price;
    item.category = category;
    item.ingredients = ingredients;
    item.available = available;

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