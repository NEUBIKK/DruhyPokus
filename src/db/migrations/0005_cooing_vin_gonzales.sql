PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`category` text NOT NULL,
	`price` integer,
	`status` text,
	`contactName` text NOT NULL,
	`image` text,
	`email` text NOT NULL,
	`ownerID` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_items`("id", "title", "description", "category", "price", "status", "contactName", "image", "email", "ownerID") SELECT "id", "title", "description", "category", "price", "status", "contactName", "image", "email", "ownerID" FROM `items`;--> statement-breakpoint
DROP TABLE `items`;--> statement-breakpoint
ALTER TABLE `__new_items` RENAME TO `items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;