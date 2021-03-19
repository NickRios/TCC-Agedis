import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe'

import authConfig from '../../../config/auth'
import User from '../model/User';
import IUsersRepository from '../repositories/IUsersRepository'


interface IRequest {
    email: string,
    password: string
}

interface IResponse {
    user: User,
    token: string;
}

@injectable()
class AuthenticatedUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {

        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new Error('Incorrect email/password combination.');
        }

        const passwordMatched = await compare(password, user.password);

        if(!passwordMatched) {
            throw new Error('Incorrect email/password combination.');
        }

        const { secret, expiresIn } = authConfig.jwt;

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn
        })

        return {
            user,
            token 
        };
    }
}

export default AuthenticatedUserService;