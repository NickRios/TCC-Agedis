import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column()
	avatar: string;
}

export default User
