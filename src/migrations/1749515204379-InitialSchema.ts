import {MigrationInterface, QueryRunner} from 'typeorm';

export class InitialSchema1749515204379 implements MigrationInterface {
  name = 'InitialSchema1749515204379';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_7806a14d42c3244064b4a1706ca" UNIQUE ("name"), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_provider" ("id" SERIAL NOT NULL, "profilePictureUrl" character varying, CONSTRAINT "PK_7610a92ca242cb29d96009caa19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_request" ("id" SERIAL NOT NULL, "requestDate" TIMESTAMP NOT NULL DEFAULT now(), "commonUserId" integer, "serviceProviderId" integer, CONSTRAINT "PK_08446fa58294cb2dd0b6ff9e5a7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_usertype_enum" AS ENUM('COMMON', 'PROVIDER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "dateOfBirth" TIMESTAMP NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "password" character varying NOT NULL, "userType" "public"."user_usertype_enum" NOT NULL, "location" geography(Point,4326), "providerProfileId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_1cf00fe44b358f410ca512cd18" UNIQUE ("providerProfileId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "service_provider_services_service" ("serviceProviderId" integer NOT NULL, "serviceId" integer NOT NULL, CONSTRAINT "PK_3f139ded9ef1a598cf0e378a9b6" PRIMARY KEY ("serviceProviderId", "serviceId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_563b2bf89e380ad42ce61b31fc" ON "service_provider_services_service" ("serviceProviderId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6c3c9e503e91e08d3679cb3cb4" ON "service_provider_services_service" ("serviceId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "service_request" ADD CONSTRAINT "FK_47b40754c22a7113aa70c65d893" FOREIGN KEY ("commonUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_request" ADD CONSTRAINT "FK_677b5e79f99ac3a5c96d25081d9" FOREIGN KEY ("serviceProviderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_1cf00fe44b358f410ca512cd18e" FOREIGN KEY ("providerProfileId") REFERENCES "service_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_provider_services_service" ADD CONSTRAINT "FK_563b2bf89e380ad42ce61b31fc0" FOREIGN KEY ("serviceProviderId") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_provider_services_service" ADD CONSTRAINT "FK_6c3c9e503e91e08d3679cb3cb41" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_provider_services_service" DROP CONSTRAINT "FK_6c3c9e503e91e08d3679cb3cb41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_provider_services_service" DROP CONSTRAINT "FK_563b2bf89e380ad42ce61b31fc0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_1cf00fe44b358f410ca512cd18e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_request" DROP CONSTRAINT "FK_677b5e79f99ac3a5c96d25081d9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "service_request" DROP CONSTRAINT "FK_47b40754c22a7113aa70c65d893"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6c3c9e503e91e08d3679cb3cb4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_563b2bf89e380ad42ce61b31fc"`,
    );
    await queryRunner.query(`DROP TABLE "service_provider_services_service"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_usertype_enum"`);
    await queryRunner.query(`DROP TABLE "service_request"`);
    await queryRunner.query(`DROP TABLE "service_provider"`);
    await queryRunner.query(`DROP TABLE "service"`);
  }
}
