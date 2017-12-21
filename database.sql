CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" VARCHAR(20) NOT NULL UNIQUE,
	"password" varchar(240) NOT NULL,
	"is_Commissioner" BOOLEAN NOT NULL DEFAULT 'FALSE'

);



CREATE TABLE "team" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" VARCHAR(20) NOT NULL UNIQUE

);



CREATE TABLE "matchup" (
	"id" serial PRIMARY KEY NOT NULL,
	"home" INTEGER NOT NULL,
	"away" INTEGER NOT NULL,
	"winner_id" integer NOT NULL,
	"date" DATE NOT NULL,
	"week" integer NOT NULL,
	"home_points" integer NOT NULL,
	"away_points" integer NOT NULL,
	"home_team_spread" integer NOT NULL
);



CREATE TABLE "picks" (
	"id" serial PRIMARY KEY NOT NULL,
	"matchup" integer NOT NULL,
	"user" integer NOT NULL,
	"team" integer NOT NULL
);





ALTER TABLE "matchup" ADD CONSTRAINT "matchup_fk0" FOREIGN KEY ("home") REFERENCES "team"("name");
ALTER TABLE "matchup" ADD CONSTRAINT "matchup_fk1" FOREIGN KEY ("away") REFERENCES "team"("name");
ALTER TABLE "matchup" ADD CONSTRAINT "matchup_fk2" FOREIGN KEY ("winner_id") REFERENCES "team"("name");

ALTER TABLE "picks" ADD CONSTRAINT "picks_fk0" FOREIGN KEY ("matchup") REFERENCES "matchup"("id");
ALTER TABLE "picks" ADD CONSTRAINT "picks_fk1" FOREIGN KEY ("user") REFERENCES "users"("username");
ALTER TABLE "picks" ADD CONSTRAINT "picks_fk2" FOREIGN KEY ("team") REFERENCES "team"("name");


