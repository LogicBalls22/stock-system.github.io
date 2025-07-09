document.getElementById('restockForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const product = document.getElementById('product').value;
    const unitPrice = document.getElementById('unitPrice').value;
    const quantity = document.getElementById('quantity').value;

    fetch('/inventory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product, unitPrice, quantity })
    })
    .then(response => response.json())
    .then(data => {
        alert('Restocked successfully!');
        loadInventory();
    });
});

document.getElementById('salesForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const uniqueId = document.getElementById('uniqueId').value;
    const date = document.getElementById('date').value;
    const quantitySold = document.getElementById('quantitySold').value;

    fetch('/sales', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uniqueId, date, quantitySold })
    })
    .then(response => response.json())
    .then(data => {
        alert('Sale recorded successfully!');
    });
});

function loadInventory() {
    fetch('/inventory')
    .then(response => response.json())
    .then(data => {
        const tbody = document.querySelector('#inventoryTable tbody');
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = `<tr>
                <td>${item.id}</td>
                <td>${item.product}</td>
                <td>${item.unitPrice}</td>
                <td>${item.quantity}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    });
}

function loadRemainingStock() {
    fetch('/sales')
    .then(response => response.json())
    .then(salesData => {
        fetch('/inventory')
        .then(response => response.json())
        .then(inventoryData => {
            const remainingStock = inventoryData.map(item => {
                const totalSold = salesData
                    .filter(sale => sale.uniqueId === item.id)
                    .reduce((acc, sale) => acc + parseInt(sale.quantitySold), 0);
                return {
                    ...item,
                    remainingQuantity: item.quantity - totalSold
                };
            });

            const tbody = document.querySelector('#remainingStockTable tbody');
            tbody.innerHTML = '';
            remainingStock.forEach(item => {
                const row = `<tr>
                    <td>${item.id}</td>
                    <td>${item.product}</td>
                    <td>${item.remainingQuantity}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        });
    });
}

// Load inventory and remaining stock on page load
loadInventory();
loadRemainingStock();
