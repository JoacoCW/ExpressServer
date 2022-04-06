const express = require('express')
const path = require("path")
const fs = require('fs');

const app = express()

const  PORT = process.env.PORT  || 8080

// CONTRUCTOR + MÉTODOS

class Contenedor {
    // CONSTRUCTOR
    constructor(nombre){
        this.nombre = nombre;
    }

    //METHODS
    async save(obj){
        try{
            const contenido = fs.readFileSync(this.nombre)
            const contenidoParseado = JSON.parse(contenido)
            obj.id= contenidoParseado.length + 1
            fs.writeFileSync("./producto.txt", JSON.stringify(contenidoParseado.concat(obj)))
        }
        catch(error){
            fs.writeFileSync("./producto.txt",JSON.stringify([{...obj,id: 1}]))
        }
    }

    getAll(){
        try {
            const contenido = fs.readFileSync(this.nombre)
            return JSON.parse(contenido)
        }
        catch(error){
            console.log('File couldn´t be read')
        }
    }

    getById(id){
        try {
            const productos = this.getAll()
            return productos.find(producto=> id === producto.id)
        }
        catch(error){
            console.log('Product couldn´t be found')
        }
    }

    deleteAll(){
        fs.writeFileSync("./producto.txt",JSON.stringify([]))
    }

    async deleteById(id) {
        try {
            if (!id || typeof id !== 'number') {
                throw Error('Not a number');
            }
            if (!FileSystem.existisSync(this.path)) {
                throw Error('The file doesn´t exist, please create it');
            }
            let data = await FileSystem.promises.readFile(this.path, 'utf-8');
            if (data === '' && data.length  === 0) {
                throw Error('The file is empty');
            }
            data = JSON.parse(data);
            const index = data.findIndex((product) => {
                return product.id === id;
            });
            if (index === -1) return 'Product doesn´t exist';
            data = data.splice(index, 0);
            await FileSystem.promises.writeFile(
                this.path,
                JSON.stringify(data, null, 2),
                'utf-8'
            );
            return 'Product was deleted successfuly';
        }catch (error) {
            throw Error(error.message);
        }
    }
}

const contenedor1 = new Contenedor('producto.txt')

let listaProductos = [
        {
            title:'El señor de los anillos',
            price: 1400,
            thumbnail: '',
        },
        {
            title:'Harry Potter',
            price: 1100,
            thumbnail: '',
        },
        {
            title:'Narnia',
            price: 800,
            thumbnail: '',
        },
        {
            title:'Game of thrones',
            price: 1700,
            thumbnail: '',
        },
        {
            title:'Fire & Blood',
            price: 1500,
            thumbnail: '',
        },
    ]

contenedor1.deleteAll()

contenedor1.save(listaProductos)


// SERVIDOR

app.get('/', (req, res) => {
    res.send('Hola mundo!')
})

app.get('/central', (req, res) => {
    res.send('<h1 style=" color: blue;">Central es el más grande!</h1>')
})

// Responder con un HTML

app.get('/html', (req, res) => {
    res.sendFile(path.join(__dirname+"/public/index.html"))
})

// Responder con Obj

app.get('/obj', (req, res) => {
    res.json( { mesage: "Hola mundo"});
})

// Contador

let counter = 0

app.get('/visitas', (req, res) => {
    counter++
    res.send({ visitas: counter})
})

// Productos

console.log(contenedor1.getAll())

let productos = contenedor1.getAll()

app.get('/productos', (req, res) => {
    res.json( productos );
})

// Producto Random

app.get('/productoRandom', (req, res) => {
    const randomProduct = productos[Math.floor(Math.random()* productos.length)];
    console.log("producto random: ", randomProduct);
    res.json( randomProduct );
})


app.listen(PORT, () => {
    console.log(`El servidor está escuchando el puerto ${PORT}`)
})