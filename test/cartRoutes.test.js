import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const request = supertest('http://localhost:8080')

describe('Carts Router Tests', function () {
    this.timeout(5000)
    
    let cartId = ''
    let productId = ''

    beforeEach(async () => {
        cartId = '66c8e598d57c3b15551a20dd'
        productId = '66c9122dbbc48eb46a8c3bf8'
    })

    it('Debe obtener el carrito de un usuario', async () => {
        const response = await request.get(`/api/carts/${cartId}`)

        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('success')
        expect(response.body.data).to.have.property('products').that.is.an('array')
    })

    it('Debe agregar un producto al carrito', async () => {
        const response = await request
            .post(`/api/carts/${cartId}/products/${productId}`)
            .send({ cantidad: 1 })

            expect(response.status).to.equal(200)
            expect(response.body.status).to.equal('success')
            expect(response.body.message).to.equal('Producto agregado al carrito')
    })

    it('Debe eliminar un producto del carrito', async () => {
        const response = await request
            .delete(`/api/carts/${cartId}/products/${productId}`)
            .send({ cantidad: 1 })

        expect(response.status).to.equal(200)
        expect(response.body.status).to.equal('success')
        expect(response.body.message).to.equal('Producto eliminado del carrito')
    })
})