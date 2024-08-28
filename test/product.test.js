import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const request = supertest('http://localhost:8080')

describe('Testing Products Endpoints', function () {
    this.timeout(5000)
    
    let productId = ''

    this.beforeEach(async () => {
        productId = '66c8e627d57c3b15551a212a'
    })

    it('Debe obtener la lista de productos', async () => {
        const response = await request.get('/api/products')
        
        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('success')
        expect(response.body.payload).to.be.an('array')
        expect(response.body).to.have.property('totalPages')
        expect(response.body).to.have.property('page')
    })


    it('Debe crear un nuevo producto', async () => {
        const productData = {
            title: 'Test Product',
            price: 100,
            description: 'Test Description',
            category: 'Test Category',
            stock: 50,
            thumbnail: 'https://ciudadela.com.ar/cdn/shop/files/7000-E-M251_720x.jpg?v=1710361250',
            code: 'TEST123',
            owner: 'admin'
        }

        const response = await request.post('/api/products').send(productData)
        
        expect(response.status).to.equal(201)
        expect(response.body.status).to.equal('success')
        expect(response.body.message).to.equal('Producto creado correctamente')
    })
})
