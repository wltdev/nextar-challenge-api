import { UserDocument } from '@/users/schemas/user.schema'

export const userStub = (): UserDocument => ({
  _id: 'fake-id',
  name: 'fake user 1',
  email: 'fake1@email.com',
  permission: 'standard',
  phone: '11354546465',
  password: '1234'
})
