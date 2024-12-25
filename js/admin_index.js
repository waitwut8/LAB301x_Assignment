makeGraph("/top_products", getDoc("mostSold"), 'bar', 'Products Sold')
const fmter = new Intl.NumberFormat(
    'en-US', {
        style: 'currency',
        currency: 'USD'

    }
)


makeGraph("/revenue_over_time", getDoc("revenue"), 'line', 'Gross Revenue')
setText(getDoc('rev'), `${fmter.format(Number(localStorage.getItem('Gross Revenue')).toFixed(2))} USD`)
makeGraph("/orders_over_time", getDoc('orders'), 'line', 'Orders Placed')
setText(getDoc('order'), localStorage.getItem('Orders Placed'))
makeGraph("/products_over_time", getDoc('productsSold'), 'line', 'Sold')
setText(getDoc('shipped_p'), localStorage.getItem('Sold'))
console.log(localStorage)