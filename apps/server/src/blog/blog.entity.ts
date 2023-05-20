import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('blog')
export class Blog {
  @PrimaryColumn({ length: 255 })
  title: string

  @Column('text')
  content: string

  @Column('timestamp')
  post: Date

  @Column('timestamp')
  update: Date
}
