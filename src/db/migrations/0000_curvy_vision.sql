CREATE TABLE `progress` (
	`id` integer PRIMARY KEY NOT NULL,
	`progress` integer,
	`progress_percentage` integer,
	`show_id` integer,
	`episode_ref_id` text,
	`scheduled_at` integer
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` integer PRIMARY KEY NOT NULL,
	`selected_provider` text
);
--> statement-breakpoint
CREATE TABLE `show` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`image` text,
	`ref_show_id` text,
	`provider` text,
	`scheduled_at` integer
);
