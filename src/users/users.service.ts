import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto) {
    const createdCat = new this.userModel(createUserDto)
    return createdCat.save()
  }

  findAll() {
    return this.userModel.find()
  }

  findOne(id: string) {
    return this.userModel.findById(id)
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }, '+password')
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $set: updateUserDto
      },
      {
        new: true
      }
    )
  }

  remove(id: string) {
    return this.userModel
      .deleteOne({
        _id: id
      })
      .exec()
  }
}
