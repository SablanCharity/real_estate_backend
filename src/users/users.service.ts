import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(role?: UserRole, page = 1, limit = 10) {
    const query = this.userRepository.createQueryBuilder('user')
      .select([
        'user.userId',
        'user.fullName',
        'user.email',
        'user.role',
        'user.phone',
        'user.createdAt',
      ]);

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    query.skip((page - 1) * limit).take(limit);

    return query.getMany();
  }

  async findOne(id: number, currentUser?: User) {
    const user = await this.userRepository.findOne({
      where: { userId: id },
      select: {
        userId: true,
        fullName: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    if (currentUser && currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('You can only view your own profile.');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, currentUser: any) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.userId !== id) {
      throw new ForbiddenException('You can only update your own profile.');
    }

    if (currentUser.role !== UserRole.ADMIN && updateUserDto.role) {
      throw new ForbiddenException('Only an Admin can change user roles.');
    }

    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    const saved = await this.userRepository.save(user);

    const { passwordHash, ...result } = saved;
    return result;
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { userId: id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    await this.userRepository.remove(user);
    return { message: `User #${id} successfully deleted.` };
  }
}
