import 'dotenv/config'
import { AppModule } from '@/app.module'
import { IUserToken } from '@/auth/interfaces/user'
import { DatabaseService } from '@/database/database.service'
import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UpdateUserDto } from '@/users/dto/update-user.dto'
import { createUserStub } from '@/users/test/stubs/user.stub'
import { Test } from '@nestjs/testing'
import { Connection } from 'mongoose'
import * as request from 'supertest'

const adminUser = createUserStub('admin')
const standardUser = createUserStub('standard')

describe('UsersControler E2E', () => {
  let mongodbConnection: Connection
  let httpServer: any
  let app: any
  let adminAuth: IUserToken
  let userAuth: IUserToken

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    mongodbConnection = moduleRef.get<DatabaseService>(DatabaseService).getConnection()
    httpServer = app.getHttpServer()

    const adminResponse = await request(httpServer).post('/signup').send(adminUser)
    adminAuth = adminResponse.body

    const userResponse = await request(httpServer).post('/signup').send(standardUser)
    userAuth = userResponse.body
  })

  afterAll(async () => {
    await mongodbConnection.collection('users').deleteMany({
      email: { $in: [adminUser.email, standardUser.email, '201@user.com'] }
    })

    await app.close()

    await mongodbConnection.close(true)
  })

  describe('Initialize', () => {
    it('should be able to connect db', () => {
      expect(mongodbConnection).toBeDefined()
    })

    it('should standard user has access_token', () => {
      expect(userAuth).toHaveProperty('access_token')
    })

    it('should admin user has access_token', () => {
      expect(adminAuth).toHaveProperty('access_token')
    })
  })

  describe('findAll', () => {
    it('should be able to return users list', async () => {
      const response = await request(httpServer)
        .get('/users')
        .set('Authorization', `Bearer ${userAuth.access_token}`)

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
        .set('Authorization', `Bearer ${userAuth.access_token}`)

      expect(response.status).toBe(200)
    })
  })

  describe('create', () => {
    describe('when is a standard user', () => {
      it('should return forbidden error', async () => {
        const newUser: CreateUserDto = {
          name: 'error 403',
          email: '403@user.com',
          phone: '1234',
          password: '123456'
        }

        const response = await request(httpServer)
          .post('/users')
          .set('Authorization', `Bearer ${userAuth.access_token}`)
          .send(newUser)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Forbidden resource')
      })
    })

    describe('when is an admin user', () => {
      it('should be able to create a user', async () => {
        const payload: CreateUserDto = {
          name: 'User testing',
          email: '201@user.com',
          phone: '1234',
          password: '123456'
        }

        const response = await request(httpServer)
          .post('/users')
          .set('Authorization', `Bearer ${adminAuth.access_token}`)
          .send(payload)

        expect(response.status).toBe(201)
      })
    })
  })

  describe('update', () => {
    describe('when is a standard user', () => {
      it('should return forbidden error', async () => {
        const payload: UpdateUserDto = {
          name: 'Editing name'
        }

        const response = await request(httpServer)
          .put(`/users/${adminAuth.user._id}`)
          .set('Authorization', `Bearer ${userAuth.access_token}`)
          .send(payload)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Forbidden resource')
      })
    })

    describe('when is an admin user', () => {
      it('should be able to update user', async () => {
        const payload: UpdateUserDto = {
          name: 'Editing name'
        }

        const response = await request(httpServer)
          .put(`/users/${userAuth.user._id}`)
          .set('Authorization', `Bearer ${adminAuth.access_token}`)
          .send(payload)

        expect(response.status).toBe(200)
      })
    })
  })

  describe('remove', () => {
    describe('when is a standard user', () => {
      it('should return forbidden error', async () => {
        const response = await request(httpServer)
          .delete(`/users/${adminAuth.user._id}`)
          .set('Authorization', `Bearer ${userAuth.access_token}`)

        expect(response.status).toBe(403)
        expect(response.body.message).toBe('Forbidden resource')
      })
    })

    describe('when is an admin user', () => {
      it('should be able to update user', async () => {
        const response = await request(httpServer)
          .delete(`/users/${userAuth.user._id}`)
          .set('Authorization', `Bearer ${adminAuth.access_token}`)

        expect(response.status).toBe(200)
      })
    })
  })
})
