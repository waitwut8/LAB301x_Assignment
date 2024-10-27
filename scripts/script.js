const fs = require('fs');

// function populateData(items, tableId){
//     const table = document.getElementById(tableId);
//     items.forEach(item => {
//         const row = table.insertRow();
//         Object.values(item).forEach(value => {
//             const cell = row.insertCell();
//             cell.textContent = value;
//         });
//     });
// }

// fetch('shoppingitems.txt')
//   .then((res) => res.text())
//   .then((text) => {
//     // do something with "text"
//    })
//   .catch((e) => console.error(e));

// // Example usage
// loadDataFromFile('../assets/shoppingitems', 'discountedTable');
function loadDataFromFile(filePath, tableId) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const items = JSON.parse(data);
        console.log(items)
    });
}




loadDataFromFile('shoppingitems', 'discountedTable');