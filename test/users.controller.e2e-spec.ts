import 'dotenv/config'
import { AppModule } from '@/app.module'
import { IUserToken } from '@/auth/interfaces/user'
import { DatabaseService } from '@/database/database.service'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { Test } from '@nestjs/testing'
import { Connection } from 'mongoose'
import * as request from 'supertest'

describe('UsersControler E2E', () => {
  let mongodbConnection: Connection
  let httpServer: any
  let app: any
  let adminAuth: IUserToken

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    mongodbConnection = moduleRef.get<DatabaseService>(DatabaseService).getConnection()
    httpServer = app.getHttpServer()

    const newUser: CreateUserDto = {
      name: 'admin test',
      email: 'test@admin.com',
      phone: '1234',
      password: '123456',
      permission: 'admin'
    }

    const { body } = await request(httpServer).post('/signup').send(newUser)
    adminAuth = body
  })

  afterAll(async () => {
    await mongodbConnection.collection('users').deleteOne({
      email: 'test@admin.com'
    })

    await app.close()

    await mongodbConnection.close(true)
  })

  describe('Initialize MongoDB', () => {
    it('should be able to connect db', () => {
      expect(mongodbConnection).toBeDefined()
    })
  })

  describe('getUsers', () => {
    it('should be able to return users list', async () => {
      const response = await request(httpServer)
        .get('/users')
        .set('Authorization', `Bearer ${adminAuth.access_token}`)

      expect(response.status).toBe(200)
    })

    it('should return unauthorized error', async () => {
      const response = await request(httpServer).get('/users')

      expect(response.status).toBe(401)
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      const response = await request(httpServer)
        .get(`/users/${adminAuth.user._id}`)
        .set('Authorization', `Bearer ${adminAuth.access_token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('create', () => {
    describe('when is a standard user', () => {
      let user: IUserToken

      beforeAll(async () => {
        const newUser: CreateUserDto = {
          name: 'user test',
          email: 'test@user.com',
          phone: '1234',
          password: '123456'
        }

        const { body } = await request(httpServer).post('/signup').send(newUser)
        user = body
      })

      afterAll(async () => {
        await mongodbConnection.collection('users').deleteOne({
          email: 'test@user.com'
        })
      })

      it('should return forbidden error', async () => {
        const newUser: CreateUserDto = {
          name: 'error 403',
          email: '403@user.com',
          phone: '1234',
          password: '123456'
        }

        const response = await request(httpServer)
          .post('/users')
          .set('Authorization', `Bearer ${user.access_token}`)
          .send(newUser)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Forbidden resource')
      })
    })

    describe('when is an admin user', () => {
      afterAll(async () => {
        await mongodbConnection.collection('users').deleteOne({
          email: '403@user.com'
        })
      })

      it('should be able to create a user', async () => {
        const newUser: CreateUserDto = {
          name: 'error 403',
          email: '403@user.com',
          phone: '1234',
          password: '123456'
        }

        const response = await request(httpServer)
          .post('/users')
          .set('Authorization', `Bearer ${adminAuth.access_token}`)
          .send(newUser)

        expect(response.status).toBe(201)
      })
    })
  })
})
