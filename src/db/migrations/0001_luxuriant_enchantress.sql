ALTER TABLE `progress` RENAME COLUMN "scheduled_at" TO "created_at";--> statement-breakpoint
ALTER TABLE `progress` ADD `updated_at` integer;