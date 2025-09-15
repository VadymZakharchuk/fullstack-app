import { MigrationInterface, QueryRunner } from "typeorm";

export class AllowNullName1757928612595 implements MigrationInterface {
    name = 'AllowNullName1757928612595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL`);
    }

}
