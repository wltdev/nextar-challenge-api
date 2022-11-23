import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { FindParams } from './interfaces/request'
import { User, UserDocument, UserQuery } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * Update user
   * @param createUserDto
   * @returns User
   */
  create(createUserDto: CreateUserDto) {
    const createdCat = new this.userModel(createUserDto)
    return createdCat.save()
  }

  /**
   * List users
   * @returns User[]
   */
  findAll({ term, page, limit }: FindParams, currentUser: string) {
    let find = {} as UserQuery

    if (term) {
      const search = new RegExp(term, 'i')
      find = {
        $or: [{ name: search }, { email: search }]
      }
    }

    const _page = Number(page) ?? 0
    const _limit = Number(limit) ?? 10

    return this.userModel
      .find({
        ...find,
        _id: { $ne: currentUser }
      })
      .sort({ createdAt: 'desc' })
      .skip(_page * _limit)
      .limit(_limit)
  }

  /**
   * Get a user
   * @param id
   * @returns User
   */
  findOne(id: string) {
    return this.userModel.findById(id)
  }

  /**
   * Get user by email
   * @param email
   * @returns User
   */
  findByEmail(email: string) {
    return this.userModel.findOne({ email }, '+password')
  }

  /**
   * Update user
   * @param id
   * @param updateUserDto
   * @returns User
   */
  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: updateUserDto
      },
      {
        runValidators: true,
        new: true
      }
    )
  }

  /**
   * Remove user
   * @param id
   * @returns void
   */
  remove(id: string) {
    return this.userModel
      .deleteOne({
        _id: id
      })
      .exec()
  }
}
