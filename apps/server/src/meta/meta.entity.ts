import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity('meta')
export class Meta {
  @PrimaryColumn({ length: 255 })
  type: string

  @Column('text')
  content: string
}
