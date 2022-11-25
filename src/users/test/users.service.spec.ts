import { Test, TestingModule } from '@nestjs/testing'

import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { FindParams } from '../interfaces/request'
import { UsersService } from '../users.service'
import { UserDocument } from './../schemas/user.schema'
import { userStub } from './stubs/user.stub'

jest.mock('../users.service.ts')

describe('UsersService', () => {
  let usersServices: UsersService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [UsersService]
    }).compile()

    usersServices = moduleRef.get<UsersService>(UsersService)

    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(usersServices).toBeDefined()
  })

  describe('create', () => {
    describe('when create is called', () => {
      let user: UserDocument
      let createDTO: CreateUserDto

      beforeEach(async () => {
        createDTO = userStub()

        user = await usersServices.create(createDTO)
      })

      it('should call usersService.create', () => {
        expect(usersServices.create).toHaveBeenCalledWith(createDTO)
      })

      it('should return new user record', () => {
        expect(user).toEqual(userStub())
      })
    })
  })

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let users: UserDocument[]

      beforeEach(async () => {
        const params = {} as FindParams

        users = await usersServices.findAll(params, userStub()._id)
      })

      it('should call usersService.findAll', () => {
        expect(usersServices.findAll).toHaveBeenCalled()
      })

      it('should return users', () => {
        expect(users).toEqual([userStub()])
      })
    })
  })

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let user: UserDocument

      beforeEach(async () => {
        user = await usersServices.findOne(userStub()._id)
      })

      it('should call usersService.findOne', () => {
        expect(usersServices.findOne).toHaveBeenCalledWith(userStub()._id)
      })

      it('should return users', () => {
        expect(user).toEqual(userStub())
      })
    })
  })

  describe('findByEmail', () => {
    describe('when findByEmail is called', () => {
      let user: UserDocument

      beforeEach(async () => {
        user = await usersServices.findByEmail(userStub().email)
      })

      it('should call usersService.findByEmail', () => {
        expect(usersServices.findByEmail).toHaveBeenCalledWith(userStub().email)
      })

      it('should return users', () => {
        expect(user).toEqual(userStub())
      })
    })
  })

  describe('update', () => {
    describe('when update is called', () => {
      let user: UserDocument
      let updateDTO: UpdateUserDto

      beforeEach(async () => {
        updateDTO = {
          ...userStub(),
          name: 'Updated Name'
        }
        user = await usersServices.update(userStub()._id, updateDTO)
      })

      it('should call usersService.update', () => {
        expect(usersServices.update).toHaveBeenCalledWith(userStub()._id, updateDTO)
      })

      it('should return users', () => {
        expect(user).toEqual(userStub())
      })
    })
  })

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await usersServices.remove(userStub()._id)
      })

      it('should call usersService.remove', () => {
        expect(usersServices.remove).toHaveBeenCalledWith(userStub()._id)
      })
    })
  })
})
