// /java/oder.js

document.addEventListener('DOMContentLoaded', function () {
    const productSelector = document.getElementById('productSelector');
    const addProductToCartButton = document.getElementById('addProductToCartButton');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const grandTotalElement = document.getElementById('grandTotal');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const orderForm = document.getElementById('orderForm');
    const cartDataInput = document.getElementById('cartDataInput');

    // New elements for variant selection
    const variantSelectionContainer = document.getElementById('variantSelectionContainer');
    const colorSelector = document.getElementById('colorSelector');
    const sizeSelector = document.getElementById('sizeSelector');
    const quantityInput = document.getElementById('quantityInput');


    // Define available products with colors and sizes
    const products = [
        { id: 'prod001', name: 'กระเป๋าครบรอบ 30 ปี', price: 350.00, colors: ['Black', 'Navy', 'Grey'], sizes: ['One Size'] },
        { id: 'prod002', name: 'สมุดครบรอบ 30 ปี', price: 100.00, colors: ['White', 'Black', 'Green'], sizes: ['A5'] },
        { id: 'prod003', name: 'เสื้อครบรอบ 30 ปี', price: 350.00, colors: ['Red', 'Blue', 'Green', 'Yellow'], sizes: ['S', 'M', 'L', 'XL'] }, // ปรับเป็น S, M, L, XL
        { id: 'prod004', name: 'เข็มกลัดครบรอบ 30 ปี', price: 90.00, colors: ['Silver', 'Gold'], sizes: ['One Size'] },
        { id: 'prod005', name: 'ปากกาครบรอบ 30 ปี', price: 90.00, colors: ['Black Ink', 'Blue Ink'], sizes: ['Standard'] },
        { id: 'prod006', name: 'ร่มครบรอบ 30 ปี', price: 350.00, colors: ['Black', 'Blue'], sizes: ['Standard'] },
        { id: 'prod007', name: 'แก้วครบรอบ 30 ปี', price: 350.00, colors: ['White', 'Black'], sizes: ['12 oz'] },
        { id: 'prod008', name: 'หมวกครบรอบ 30 ปี', price: 350.00, colors: ['Black', 'White', 'Red'], sizes: ['Adjustable'] }
    ];

    // 1. โหลดข้อมูลตะกร้าสินค้าจาก localStorage เมื่อหน้าฟอร์มชำระเงินโหลด
    let cart = JSON.parse(localStorage.getItem('csmju_cart')) || [];

    // 2. Populate dropdown "เลือกสินค้าเพิ่มเติม"
    function populateProductSelector() {
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (${product.price.toFixed(2)} THB)`;
            productSelector.appendChild(option);
        });
    }

    // Event listener for when a product is selected
    productSelector.addEventListener('change', function() {
        const selectedProductId = this.value;
        const selectedProduct = products.find(p => p.id === selectedProductId);

        // Clear previous options and reset quantity
        colorSelector.innerHTML = '<option value="">-- เลือกสี --</option>';
        sizeSelector.innerHTML = '<option value="">-- เลือกขนาด --</option>';
        quantityInput.value = 1;

        if (selectedProduct) {
            variantSelectionContainer.classList.remove('hidden');

            // Populate colors
            selectedProduct.colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color;
                option.textContent = color;
                colorSelector.appendChild(option);
            });

            // Populate sizes
            selectedProduct.sizes.forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                sizeSelector.appendChild(option);
            });

            // Auto-select if only one option is available
            if (selectedProduct.colors.length === 1) {
                colorSelector.value = selectedProduct.colors[0];
            }
            if (selectedProduct.sizes.length === 1) {
                sizeSelector.value = selectedProduct.sizes[0];
            }

        } else {
            // Hide variant selection if no product is selected
            variantSelectionContainer.classList.add('hidden');
        }
    });

    function renderCart() {
        cartItemsContainer.innerHTML = ''; // Clear current cart display

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
        } else {
            emptyCartMessage.style.display = 'none';
            cart.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                // Use a unique ID for each item in the cart, including its variant (color, size)
                itemElement.setAttribute('data-cart-item-id', item.cartItemId);

                const subtotal = item.price * item.quantity;

                // Create a display string for color and size
                const variantDisplay = (item.color !== 'N/A' || item.size !== 'N/A')
                    ? `<div class="cart-item-variant">
                           ${item.color !== 'N/A' ? 'สี: ' + item.color : ''}
                           ${item.color !== 'N/A' && item.size !== 'N/A' ? ', ' : ''}
                           ${item.size !== 'N/A' ? 'ขนาด: ' + item.size : ''}
                       </div>`
                    : '';

                itemElement.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        ${variantDisplay}
                        <div class="cart-item-price-per-unit">${item.price.toFixed(2)} THB/ชิ้น</div>
                    </div>
                    <div class="cart-item-controls">
                        <button type="button" class="quantity-button decrease-quantity" data-cart-item-id="${item.cartItemId}">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button type="button" class="quantity-button increase-quantity" data-cart-item-id="${item.cartItemId}">+</button>
                    </div>
                    <div class="cart-item-subtotal">${subtotal.toFixed(2)} THB</div>
                    <button type="button" class="remove-item-button" data-cart-item-id="${item.cartItemId}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });
        }
        updateGrandTotal();
        addCartItemEventListeners();
        localStorage.setItem('csmju_cart', JSON.stringify(cart)); // Save cart to local storage
    }

    function updateGrandTotal() {
        let total = 0;
        cart.forEach(item => {
            total += item.price * item.quantity;
        });
        grandTotalElement.textContent = `${total.toFixed(2)} THB`;

        // Update hidden input for form submission
        cartDataInput.value = JSON.stringify(cart);
    }

    function addCartItemEventListeners() {
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.onclick = function () {
                const cartItemId = this.getAttribute('data-cart-item-id');
                const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
                if (itemIndex > -1) {
                    if (cart[itemIndex].quantity > 1) {
                        cart[itemIndex].quantity--;
                    } else {
                        cart.splice(itemIndex, 1); // Remove item if quantity goes to 0
                    }
                    renderCart();
                }
            };
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.onclick = function () {
                const cartItemId = this.getAttribute('data-cart-item-id');
                const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
                if (itemIndex > -1) {
                    cart[itemIndex].quantity++;
                    renderCart();
                }
            };
        });

        document.querySelectorAll('.remove-item-button').forEach(button => {
            button.onclick = function () {
                const cartItemId = this.getAttribute('data-cart-item-id');
                cart = cart.filter(item => item.cartItemId !== cartItemId);
                renderCart();
            };
        });
    }

    // Event listener for "Add Product to Cart" button
    addProductToCartButton.addEventListener('click', function () {
        const selectedProductId = productSelector.value;
        if (!selectedProductId) {
            alert('กรุณาเลือกสินค้าก่อนเพิ่มเข้าตะกร้า');
            return;
        }

        const selectedProduct = products.find(p => p.id === selectedProductId);
        const selectedColor = colorSelector.value;
        const selectedSize = sizeSelector.value;
        const quantity = parseInt(quantityInput.value, 10);

        // Validation for color/size selection if product has options
        if (selectedProduct.colors.length > 0 && !selectedColor) {
            alert('กรุณาเลือกสีก่อนเพิ่มเข้าตะกร้า');
            return;
        }
        if (selectedProduct.sizes.length > 0 && !selectedSize) {
            alert('กรุณาเลือกขนาดก่อนเพิ่มเข้าตะกร้า');
            return;
        }
        if (quantity < 1) {
            alert('จำนวนสินค้าต้องมากกว่า 0');
            return;
        }

        // Create a unique ID for the cart item including variant
        // Use 'NoColor' or 'NoSize' if options are not applicable (e.g., single variant items)
        const cartItemId = `${selectedProductId}_${selectedColor || 'NoColor'}_${selectedSize || 'NoSize'}`;

        const existingItem = cart.find(item => item.cartItemId === cartItemId);

        if (existingItem) {
            existingItem.quantity += quantity; // Increment quantity if variant already exists
        } else {
            cart.push({
                cartItemId: cartItemId,       // Unique ID for this specific variant
                id: selectedProductId,        // Original product ID
                name: selectedProduct.name,
                price: selectedProduct.price,
                color: selectedColor || 'N/A', // Store selected color (or N/A if not applicable)
                size: selectedSize || 'N/A',   // Store selected size (or N/A if not applicable)
                quantity: quantity
            });
        }
        renderCart();
        // Reset selectors and hide variant selection after adding to cart
        productSelector.value = '';
        colorSelector.innerHTML = '<option value="">-- เลือกสี --</option>';
        sizeSelector.innerHTML = '<option value="">-- เลือกขนาด --</option>';
        quantityInput.value = 1;
        variantSelectionContainer.classList.add('hidden');
    });


    orderForm.addEventListener('submit', function (event) {
        if (cart.length === 0) {
            alert('กรุณาเพิ่มสินค้าลงในตะกร้าก่อนยืนยันการสั่งซื้อ');
            event.preventDefault(); // Prevent form submission
            return;
        }

        console.log('Form Submitted with Cart Data:', JSON.parse(cartDataInput.value));
        // In a real application, you would send this cartDataInput.value to your backend
    });

    // Initial calls
    populateProductSelector();
    renderCart();
});