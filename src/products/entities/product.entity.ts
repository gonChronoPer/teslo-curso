import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true,
    })
    title: string;

    @Column({
        type: 'float',
        default: 0
    })
    price: number;

    @Column({
        type: 'varchar',
        nullable: true
    })
    description: string;

    @Column({
        type: 'varchar',
        unique: true
    })
    slug: string;

    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @Column({
        type: 'varchar'
    })
    sizes: string;

    @Column({
        type: 'varchar'
    })
    gender: string;


    @Column({
        type: 'varchar'
    })
    tags: string;

    // images

    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) {
            this.slug = this.title;
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')

    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }


}

