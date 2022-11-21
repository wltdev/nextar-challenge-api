import { UserDocument } from '@/users/schemas/user.schema'
import { Test } from '@nestjs/testing'

import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { UsersController } from '../users.controller'
import { UsersService } from '../users.service'
import { userStub } from './stubs/user.stub'

jest.mock('../users.service')

describe('UsersController', () => {
  let usersController: UsersController
  let usersService: UsersService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [UsersService]
    }).compile()

    usersController = moduleRef.get<UsersController>(UsersController)
    usersService = moduleRef.get<UsersService>(UsersService)

    jest.clearAllMocks()
  })

  describe('findOne', () => {
    describe('when findOne is called', () => {
      let user: UserDocument

      beforeEach(async () => {
        user = await usersController.findOne(userStub()._id)
      })

      it('should be able to call usersService.findOne', () => {
        expect(usersService.findOne).toBeCalledWith(userStub()._id)
      })

      it('should return a user', () => {
        expect(user).toEqual(userStub())
      })
    })
  })

  describe('findAll', () => {
    describe('when findAll is called', () => {
      let users: UserDocument[]

      beforeEach(async () => {
        users = await usersController.findAll()
      })

      it('should be able to call usersService.findAll', () => {
        expect(usersService.findAll).toHaveBeenCalled()
      })

      it('shoud return users', () => {
        expect(users).toEqual([userStub()])
      })
    })
  })

  describe('create', () => {
    describe('when create is called', () => {
      let user: UserDocument
      let createUserDTO: CreateUserDto

      beforeEach(async () => {
        createUserDTO = {
          ...userStub()
        }

        user = await usersController.create(createUserDTO)
      })

      it('should be able to call usersServices.create', () => {
        expect(usersService.create).toHaveBeenCalledWith(createUserDTO)
      })

      it('should return new user', () => {
        expect(user).toEqual(userStub())
      })
    })
  })

  describe('update', () => {
    describe('when update is called', () => {
      let user: UserDocument
      let updateUserDTO: UpdateUserDto

      beforeEach(async () => {
        updateUserDTO = {
          ...userStub(),
          name: 'updated name'
        }

        user = await usersController.update(userStub()._id, updateUserDTO)
      })

      it('should be able to call usersServices.update', () => {
        expect(usersService.update).toHaveBeenCalledWith(userStub()._id, updateUserDTO)
      })

      it('should return updated user', () => {
        expect(user).toEqual(userStub())
      })
    })
  })

  describe('remove', () => {
    describe('when remove is called', () => {
      beforeEach(async () => {
        await usersController.remove(userStub()._id)
      })

      it('should be able to call usersServices.remove', () => {
        expect(usersService.remove).toHaveBeenCalled()
      })
    })
  })
})
