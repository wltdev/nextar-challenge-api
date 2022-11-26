import { CreateUserDto } from '@/users/dto/create-user.dto'
import { UserDocument } from '@/users/schemas/user.schema'
import { faker } from '@faker-js/faker'

export const userStub = (): UserDocument => ({
  _id: 'fake-id',
  name: 'fake user 1',
  email: 'fake1@email.com',
  permission: 'standard',
  phone: '11354546465',
  password: '1234'
})

export const createUserStub = (permission: string): CreateUserDto => {
  return {
    name: faker.name.fullName(),
    email: faker.internet.email(),
    phone: '11988899346',
    password: '123456',
    permission
  }
}
