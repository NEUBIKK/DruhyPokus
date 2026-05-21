CREATE TABLE `items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`price` integer,
	`status` text,
	`contactName` text NOT NULL,
	`image` text,
	`email` text
);
