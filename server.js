const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Load inventory data
function loadInventoryData() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'inventory_data.js'), 'utf8'));
}

// Load sales data
function loadSalesData() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'sales_data.js'), 'utf8'));
}

// Save inventory data
function saveInventoryData(data) {
    fs.writeFileSync(path.join(__dirname, 'data', 'inventory_data.js'), JSON.stringify(data, null, 2));
}

// Save sales data
function saveSalesData(data) {
    fs.writeFileSync(path.join(__dirname, 'data', 'sales_data.js'), JSON.stringify(data, null, 2));
}

// Routes
app.get('/inventory', (req, res) => {
    res.json(loadInventoryData());
});

app.post('/inventory', (req, res) => {
    const { product, unitPrice, quantity } = req.body;
    const inventory = loadInventoryData();
    const newItem = {
        id: Date.now().toString(),
        product,
        unitPrice,
        quantity: parseInt(quantity)
    };
    inventory.push(newItem);
    saveInventoryData(inventory);
    res.status(201).json(newItem);
});

app.get('/sales', (req, res) => {
    res.json(loadSalesData());
});

app.post('/sales', (req, res) => {
    const { uniqueId, date, quantitySold } = req.body;
    const sales = loadSalesData();
    const newSale = {
        uniqueId,
        date,
        quantitySold: parseInt(quantitySold)
    };
    sales.push(newSale);
    saveSalesData(sales);
    res.status(201).json(newSale);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
