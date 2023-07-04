const { error } = require('console');
const fs = require('fs/promises')
const path = require('path')



class ProductManager {

    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data) || [];
            if (products.length > 0) {
                return products;
            } else {
                throw new Error('No existen Productos Registrados');
            }
        } catch (error) {
            console.error('getProducts -> ' + error.message);
            return [];
        }
    }



    async getProductById(id) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data) || [];
            if (products.length > 0) {
                const resp = products.filter(item => item.id === parseInt(id));
                if (resp.length > 0) {
                    console.log(`el producto con id: ${id} ha sido Encontrado`);
                    return resp[0];
                } else {
                    throw new Error(`Error: El Producto con ID ${id} No Existe`);
                }
            } else {
                throw new Error(`Error: No existen Productos Registrados`)
            }
        } catch (error) {
            console.error('getProductById -> ' + error.message)
            return '';
        }

    }


    async addProduct(product) {
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            const products = JSON.parse(data);

            const newId = products[products.length - 1]?.id || 0;
            console.log(data)
            products.push({
                ...product,
                id: newId + 1
            })
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            throw new Error('Producto Registrado con Éxito')
        } catch (error) {
            console.error('addProduct -> ' + error.message);
        }
    }


    async updateProduct(id, updProduct) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data);
            let found = false;
            if (products.length > 0) {
                products.forEach((item, index) => {
                    if (item.id === parseInt(id)) {
                        products[index] = { ...item, ...updProduct }
                        found = true;
                    }
                });
                if (found) {
                    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
                    throw new Error(`El Producto con ID ${id} ha sido Actualizado`)
                } else {
                    throw new Error(`El Producto con ID ${id} No Existe`)
                }
            } else {
                throw new Error('No existen Productos Registrados')
            }
        } catch (error) {
            console.error('updateProduct -> ' + error.message)
        }
    }


    async deleteProduct(id) {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            const products = JSON.parse(data) || [];
            if (products.length > 0) {
                const resp = products.filter(item => parseInt(item.id) !== parseInt(id));
                if (resp.length < products.length) {
                    await fs.writeFile(this.path, JSON.stringify(resp, null, 2));
                    throw new Error(`El Producto con id: ${id} ha sido Eliminado Correctamente`);
                } else if (resp.length === products.length) {
                    throw new Error(`el producto con id: ${id} No Existe`);
                }
            } else {
                throw new Error('No existen Productos Registrados')
            }
        } catch (error) {
            console.error('DeleteProduct -> ' + error.message);
        }

    }

}
module.exports = ProductManager;
