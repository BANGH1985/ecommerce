import * as chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const request = supertest('http://localhost:8080')

describe('Testing Products Endpoints', function () {
    this.timeout(5000)
    
    let productId = ''

    this.beforeEach(async () => {
        productId = '66c9122dbbc48eb46a8c3bf8'
    })

    it('Debe obtener la lista de productos', async () => {
        const response = await request.get('/')
        
        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('success')
        expect(response.body.payload).to.be.an('array')
        expect(response.body).to.have.property('totalPages')
        expect(response.body).to.have.property('page')
    })

    it('Debe crear un Product nuevo', async () => {
        const productData = {
            name: 'Test Product',
            price: 100,
            description: 'Test Description',
            category: 'Test Category',
            stock: 50,
            thumbnail: 'test-image-url'
        }

        const response = await request.post('/realtimeproducts').send(productData)
        
        expect(response.status).to.equal(201)
        expect(response.body.status).to.equal('success')
        expect(response.body.message).to.equal('Producto creado correctamente')
        expect(response.body.product).to.have.property('_id')
    })
})