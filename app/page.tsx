import ChainSelector from "@/components/chain-selector";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Settings2 } from "lucide-react";

export default function Home() {
	return (
		<div className="container mx-auto py-8">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="flex gap-2 items-center w-full">
						<Input
							placeholder="Search by pair address"
							className="h-8 w-full max-w-[450px]"
						/>
						<ChainSelector />
					</div>
					<Button variant="outline" className="h-8 border-dashed">
						<Settings2 />
						<div>View</div>
					</Button>
				</div>
				<DataTable />
				<div className="flex items-center justify-end">
					<div>
                    <Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious href="#" />
							</PaginationItem>
							<PaginationItem>
								<PaginationLink href="#">1</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
							<PaginationItem>
								<PaginationNext href="#" />
							</PaginationItem>
						</PaginationContent>
					</Pagination>
                    </div>
				</div>
			</div>
		</div>
	);
}
