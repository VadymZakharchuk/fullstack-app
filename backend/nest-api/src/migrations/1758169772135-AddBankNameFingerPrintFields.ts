import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBankNameFingerPrintFields1758169772135 implements MigrationInterface {
    name = 'AddBankNameFingerPrintFields1758169772135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "amount" numeric(10,2) NOT NULL, "type" character varying NOT NULL, "fingerprint" character varying, "bankName" character varying NOT NULL, "documentId" character varying, "categoryId" integer, "userId" integer, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fc784376f397fe4510b4842b4f" ON "transaction" ("userId", "bankName", "fingerprint") `);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_d3951864751c5812e70d033978d" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_d3951864751c5812e70d033978d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc784376f397fe4510b4842b4f"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
