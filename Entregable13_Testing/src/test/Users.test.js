const chai = require('chai');
const supertest = require('supertest')

const expect = chai.expect
const requestor = supertest('http://localhost:8080');

describe('UserTest', () => {

   
        it('Login_Failure - POST', async () => {

            const user = {
                email: "adminCoder@coder.com",
                password: "Cod3r123rrr"
            };
            const { statusCode, headers } = await requestor.post('/api/sessions/login').send(user);

            expect(statusCode, headers).to.be.equal(200) //redireccion al loguearse

            expect(headers.location).to.be.equal(undefined) //a la raiz del sitio
            console.log(headers)
        });

        it('Login_Ok - POST', async () => {

            const user = {
                email: "adminCoder@coder.com",
                password: "Cod3r123"
            };
            const { statusCode, headers } = await requestor.post('/api/sessions/login').send(user);
            /*  userId=payload._id */

            expect(statusCode).to.be.equal(302) //redireccion al loguearse
            /*  expect(headers.location).to.be.equal('/') //a la raiz del sitio */

            console.log(headers)


        });
})

