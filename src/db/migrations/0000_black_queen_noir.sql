CREATE TABLE `episode` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` integer,
	`episode_id` integer,
	`scheduled_at` integer
);
--> statement-breakpoint
CREATE TABLE `history` (
	`id` integer PRIMARY KEY NOT NULL,
	`episode_id` integer,
	`scheduled_at` integer
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` integer PRIMARY KEY NOT NULL,
	`progress` integer,
	`episode_id` integer,
	`scheduled_at` integer
);
--> statement-breakpoint
CREATE TABLE `show` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` integer,
	`scheduled_at` integer
);
