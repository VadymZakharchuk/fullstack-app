import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToUser1757307244458 implements MigrationInterface {
    name = 'AddRefreshTokenToUser1757307244458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "hashedRefreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hashedRefreshToken"`);
    }

}
