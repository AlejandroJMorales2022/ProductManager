const { error } = require('console');
const fs = require('fs/promises');
const path = require('path');


class CartManager {
    #carts = [];

    constructor(filename) {
        this.filename = filename;
        this.filepath = path.join(__dirname, '../data', this.filename);
    }

    #readFile = async () => {
        const data = await fs.readFile(this.filepath, 'utf-8');
        this.#carts = JSON.parse(data);
    }

    #writeFile = async () => {
        const data = JSON.stringify(this.#carts, null, 2);
        await fs.writeFile(this.filepath, data);
    }

    async getById(id) {
        await this.#readFile();
        return this.#carts.find(p => p.id == id);
    }

    async create(cart) {

        await this.#readFile();
        const id = (this.#carts[this.#carts.length - 1]?.id || 0) + 1;

        const newCart = {
            ...cart,
            id
        };
        this.#carts.push(newCart);
        await this.#writeFile();
        return newCart;
    }

    async save(cid, pid, product) {
        const { qty } = product;
        await this.#readFile();
        this.#carts.forEach((cart, index) => {
            if (cart.id == cid) {
                if (cart.products.length === 0) {
                    this.#carts[index] = { ...cart, products: [{ id: parseInt(pid), qty: qty }] }
                } else {
                    const existing = cart.products.find((prod) => prod.id == parseInt(pid));
                    if (existing) {
                        cart.products.forEach((prod, index) => {
                            if (prod.id == parseInt(pid)) {
                                cart.products[index] = { ...prod, qty: (prod.qty + qty) };
                            }
                        });
                        /* return { ...cart }; */
                    } else {
                        cart.products = [...cart.products, { id: parseInt(pid), qty: qty }]
                    }
                }
            }
        });

        await this.#writeFile();
    }
}

module.exports = CartManager;