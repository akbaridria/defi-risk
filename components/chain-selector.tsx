"use client";

import { PlusCircleIcon, CheckIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LIST_NETWORKS } from "@/app/constant";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

const ChainSelector = () => {
	const [value, setValue] = useState<string[]>([]);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" className="border-dashed h-8">
					<PlusCircleIcon />
					<div>Network</div>
					{value.length > 0 && (
						<>
							<Separator orientation="vertical" className="mx-2 h-4" />
							<Badge
								variant="secondary"
								className="rounded-sm px-1 font-normal lg:hidden"
							>
								{value.length}
							</Badge>
							<div className="hidden space-x-1 lg:flex">
								{value.length > 2 ? (
									<Badge
										variant="secondary"
										className="rounded-sm px-1 font-normal"
									>
										{value.length} selected
									</Badge>
								) : (
									LIST_NETWORKS.filter((option) =>
										value.includes(option.value),
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
										setValue((prev) => {
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
											value.includes(network.value)
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
