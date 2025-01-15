"use client";

import { LIST_NETWORKS } from "@/app/constant";
import { cn } from "@/lib/utils";
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

const ChainSelector: React.FC<{
	networks: string[];
	setNetwork: Dispatch<SetStateAction<string[]>>;
}> = ({ networks, setNetwork }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="border-dashed h-8">
					<PlusCircleIcon />
					<div>Network</div>
					{networks.length > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{networks.length}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{networks.length > 2 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{networks.length} selected
									</Badge>
								) : (
									LIST_NETWORKS.filter((option) =>
										networks.includes(option.value),
									).map((option) => (
										<Badge
											variant="secondary"
											key={option.value}
											className="rounded-sm px-1 font-normal"
										>
											{option.label}
										</Badge>
									))
								)}
							</div>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-50 p-0" align="start">
				<Command>
					<CommandInput placeholder="Search network..." className="h-9" />
					<CommandList>
						<CommandEmpty>No network found.</CommandEmpty>
						<CommandGroup>
							{LIST_NETWORKS.map((network) => (
								<CommandItem
									key={network.value}
									value={network.value}
									onSelect={(currentValue) => {
										setNetwork((prev) => {
											if (prev.includes(currentValue))
												return prev.filter((item) => item !== currentValue);
											return [...prev, currentValue];
										});
									}}
								>
									{network.label}
									<CheckIcon
										className={cn(
											"ml-auto transition-all",
											networks.includes(network.value)
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default ChainSelector;
