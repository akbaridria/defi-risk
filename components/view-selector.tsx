"use client";

import { COLUMN_HEADER } from "@/app/constant";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";

const ViewSelector: React.FC<{
	excludeColumns: string[];
	toggleColumn: (v: string) => void;
}> = ({ excludeColumns, toggleColumn }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="h-8 border-dashed">
					<Settings2 />
					<div>View</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[200px]">
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{COLUMN_HEADER.map((column) => (
					<DropdownMenuCheckboxItem
						key={column}
						className="capitalize"
						checked={!excludeColumns.includes(column)}
						onCheckedChange={() => toggleColumn(column)}
					>
						{column}
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ViewSelector;
