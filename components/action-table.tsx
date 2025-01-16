"use client";

import {
	DropletIcon,
	DropletOff,
	EllipsisIcon,
	ExternalLinkIcon,
	ReplaceIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface IProps {
	chain: string;
	pairAddress: string;
}

const ActionTable: React.FC<IProps> = ({ chain, pairAddress }) => {
	const router = useRouter();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<EllipsisIcon size={16} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" side="left" align="start">
				<DropdownMenuLabel>Action</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem disabled>
						Swap
						<DropdownMenuShortcut>
							<ReplaceIcon size={14} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem disabled>
						Add Liquidity
						<DropdownMenuShortcut>
							<DropletIcon size={14} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem disabled>
						Remove Liquidity
						<DropdownMenuShortcut>
							<DropletOff size={14} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => router.push(`/${chain}/${pairAddress}`)}
					>
						Details
						<DropdownMenuShortcut>
							<ExternalLinkIcon size={14} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default ActionTable;
