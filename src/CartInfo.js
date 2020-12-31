export default function productsInfo() {
  let totalPrice = 0;
  let total = 0;

  const items = document.querySelectorAll('.cart__row');
  const totalGoodsNode = document.querySelector('.cart__total-goods b')
  const totalPriceNode = document.querySelector('.cart__subtotal b')
  
  for (let i = 0; i < items.length; i++) {
    const itemCount = items[i].querySelector('.cart__input').value
    const itemPrice = items[i].querySelector('.cart__total span').innerHTML.slice(1)

    total += parseInt(itemCount);
    totalPrice += parseFloat(itemPrice)
  }
  totalGoodsNode.innerHTML = total;
  totalPriceNode.innerHTML = `${totalPrice}$`
}