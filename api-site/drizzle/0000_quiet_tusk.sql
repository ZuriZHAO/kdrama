CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`reviewed_at` text,
	`ip_hash` text NOT NULL,
	`image_key` text,
	`image_type` text
);
--> statement-breakpoint
CREATE INDEX `submissions_status_created_idx` ON `submissions` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `submissions_ip_created_idx` ON `submissions` (`ip_hash`,`created_at`);