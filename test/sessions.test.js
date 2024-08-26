import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const request = supertest('http://localhost:8080')

describe('Users Router Tests', function () {
    this.timeout(5000)
    
    let userId = '66c6c16bbf7529a589cc8926'

    it('Debe registrar un nuevo usuario', async () => {
        const userData = {
            first_name: 'Test',
            last_name: 'User',
            email: `testuser1@example.com`,
            //cambiar el email para que no se repita, para testear el register
            age: 30,
            password: 'password123',
            password2: 'password123'
        }

        const response = await request.post('/register').send(userData)

        expect(response.status).to.equal(302)
        expect(response.headers.location).to.equal('/login?success=Usuario%20registrado%20correctamente.%20Por%20favor,%20inicie%20sesi%C3%B3n.')
    })

    it('Debe iniciar sesión con un usuario registrado', async () => {
        const userData = {
            email: 'testuser@example.com',
            password: 'password123'
        }

        const response = await request.post('/login').send(userData)

        expect(response.status).to.equal(302)
    })

    it('Debe actualizar el perfil de un usuario', async () => {
        const profileData = {
            first_name: 'Updated',
            last_name: 'Name'
        }

        const response = await request.post(`/profile/${userId}`).send(profileData)

        expect(response.status).to.equal(302)
    })

    it('Debe cambiar el rol de un usuario', async () => {
        const response = await request.put(`/api/users/premium/${userId}`).send()

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Rol actualizado')
    })

    it('Debe eliminar un usuario', async () => {
        //const response = await request.delete(`/profile/${userId}`)
        //descomentar para testear el delete!!

        expect(response.status).to.equal(200)
        expect(response.body.message).to.equal('Perfil eliminado correctamente.')
    })
})