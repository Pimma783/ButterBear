// /java/Script.js

document.addEventListener('DOMContentLoaded', function() {
    const showFormBtn = document.getElementById('showFormBtn');
    const addForm = document.getElementById('addForm');
    const saveBtn = document.getElementById('saveBtn');
    const tableBody = document.getElementById('productTableBody');

    let editRow = null;

    const toggleFormVisibility = () => {
        addForm.classList.toggle('hidden');
        if (!addForm.classList.contains('hidden')) {
            addForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    showFormBtn.addEventListener('click', () => {
        toggleFormVisibility();
        clearForm();
        editRow = null;
    });

    saveBtn.addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const code = document.getElementById('code').value.trim();
        const size = document.getElementById('size').value.trim();
        const color = document.getElementById('color').value.trim();
        const stock = document.getElementById('stock').value.trim();
        const price = document.getElementById('price').value.trim();
        const imageInput = document.getElementById('image');

        if (!name || !code || !size || !color || !stock || !price) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        if (isNaN(stock) || parseFloat(stock) < 0) {
            alert('จำนวนคงเหลือต้องเป็นตัวเลขที่ไม่ติดลบ');
            return;
        }
        if (isNaN(price) || parseFloat(price) < 0) {
            alert('ราคาสินค้าต้องเป็นตัวเลขที่ไม่ติดลบ');
            return;
        }

        if (editRow) {
            updateRow(editRow, { name, code, size, color, stock, price, file: imageInput.files[0] });
        } else {
            if (!imageInput.files[0]) {
                alert('กรุณาเลือกรูปภาพสำหรับสินค้าใหม่');
                return;
            }
            addNewRow({ name, code, size, color, stock, price, file: imageInput.files[0] });
        }

        toggleFormVisibility();
        clearForm();
    });

    function addNewRow({ name, code, size, color, stock, price, file }) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const rowCount = tableBody.children.length + 1;

            const row = document.createElement('tr');
            row.classList.add('hover:bg-gray-100', 'transition', 'duration-150', 'ease-in-out');
            
            row.innerHTML = `
                <td class="py-3 px-6 border-b border-gray-200 text-sm">${rowCount}</td>
                <td class="py-3 px-6 border-b border-gray-200 text-sm">
                    <img src="${e.target.result}" alt="${name}"
                         class="w-16 h-16 object-cover rounded-lg shadow-sm border border-gray-200">
                </td>
                <td class="py-3 px-6 border-b border-gray-200 text-sm">${name}</td>
                <td class="py-3 px-6 border-b border-gray-200 text-sm">${code}</td>
                <td class="py-3 px-6 border-b border-gray-200 text-sm">${size}</td>
                <td class="py-3 px-6 border-b border-gray-200 text-sm">${color}</td>
                <td class="py-3 px-6 border-b border-gray-200 text-sm">${stock}</td>
                <td class="py-3 px-6 border-b border-gray-200 text-sm">${parseFloat(price).toFixed(2)}</td>
                <td class="py-3 px-6 border-b border-gray-200 text-sm">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-200 mr-2 edit-btn">
                        <i class="fas fa-edit"></i> แก้ไข
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-200 delete-btn">
                        <i class="fas fa-trash-alt"></i> ลบ
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
            updateRowNumbers();
            attachRowEvents(row);
        };
        reader.readAsDataURL(file);
    }

    function updateRow(row, { name, code, size, color, stock, price, file }) {
        const cells = row.cells;

        cells[2].textContent = name;
        cells[3].textContent = code;
        cells[4].textContent = size;
        cells[5].textContent = color;
        cells[6].textContent = stock;
        cells[7].textContent = parseFloat(price).toFixed(2);

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                cells[1].querySelector('img').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
        editRow = null;
    }

    function attachRowEvents(row) {
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');

        if (editBtn) {
            editBtn.addEventListener('click', () => {
                editRow = row;
                const cells = row.cells;
                document.getElementById('name').value = cells[2].textContent;
                document.getElementById('code').value = cells[3].textContent;
                document.getElementById('size').value = cells[4].textContent;
                document.getElementById('color').value = cells[5].textContent;
                document.getElementById('stock').value = cells[6].textContent;
                document.getElementById('price').value = cells[7].textContent;
                document.getElementById('image').value = '';
                addForm.classList.remove('hidden');
                addForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) {
                    row.remove();
                    updateRowNumbers();
                }
            });
        }
    }

    function updateRowNumbers() {
        let rowCounter = 1;
        Array.from(tableBody.children).forEach(child => {
            if (child.tagName === 'TR') {
                child.cells[0].textContent = rowCounter++;
            }
        });
    }

    function clearForm() {
        document.getElementById('name').value = '';
        document.getElementById('code').value = '';
        document.getElementById('size').value = '';
        document.getElementById('color').value = '';
        document.getElementById('stock').value = '';
        document.getElementById('price').value = '';
        document.getElementById('image').value = '';
    }

    if (tableBody) {
        Array.from(tableBody.children).forEach(row => {
            if (row.tagName === 'TR') {
                attachRowEvents(row);
            }
        });
        updateRowNumbers();
    } else {
        console.error("Element with ID 'productTableBody' not found. Please ensure your HTML has a single tbody with this ID.");
    }
});