CREATE TABLE "users" (
	"id" serial NOT NULL,
	"username" varchar(20) NOT NULL UNIQUE,
	"password" varchar(240) NOT NULL,
	"is_Commissioner" BOOLEAN NOT NULL DEFAULT 'FALSE',
	CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "team" (
	"id" serial NOT NULL,
	"name" varchar(30) NOT NULL UNIQUE,
	CONSTRAINT team_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "matchup" (
	"id" serial NOT NULL,
	"home" serial NOT NULL,
	"away" serial NOT NULL,
	"winner_id" integer NOT NULL,
	"date" serial NOT NULL,
	"week" integer NOT NULL,
	"home_points" integer NOT NULL,
	"away_points" integer NOT NULL,
	"home_team_spread" integer NOT NULL,
	CONSTRAINT matchup_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "picks" (
	"id" serial NOT NULL,
	"matchup" integer NOT NULL,
	"user" integer NOT NULL,
	"team" integer NOT NULL,
	CONSTRAINT picks_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);





ALTER TABLE "matchup" ADD CONSTRAINT "matchup_fk0" FOREIGN KEY ("home") REFERENCES "team"("id");
ALTER TABLE "matchup" ADD CONSTRAINT "matchup_fk1" FOREIGN KEY ("away") REFERENCES "team"("id");
ALTER TABLE "matchup" ADD CONSTRAINT "matchup_fk2" FOREIGN KEY ("winner_id") REFERENCES "team"("id");

ALTER TABLE "picks" ADD CONSTRAINT "picks_fk0" FOREIGN KEY ("matchup") REFERENCES "matchup"("id");
ALTER TABLE "picks" ADD CONSTRAINT "picks_fk1" FOREIGN KEY ("user") REFERENCES "users"("id");
ALTER TABLE "picks" ADD CONSTRAINT "picks_fk2" FOREIGN KEY ("team") REFERENCES "team"("id");

SELECT "id" FROM "team" WHERE name = 'Minnesota Vikings'

