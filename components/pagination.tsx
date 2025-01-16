import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import type React from "react";

interface PaginationWithEllipsisProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const PaginationWithEllipsis: React.FC<PaginationWithEllipsisProps> = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const getPageNumbers = (): (number | string)[] => {
		const delta = 2;
		const pages: (number | string)[] = [];
		const displayedCurrent = currentPage + 1;
		const displayedTotal = totalPages;

		pages.push(1);

		let leftBound = Math.max(2, displayedCurrent - delta);
		let rightBound = Math.min(displayedTotal - 1, displayedCurrent + delta);

		if (displayedCurrent - delta <= 2) {
			rightBound = Math.min(
				displayedTotal - 1,
				rightBound + (2 - (displayedCurrent - delta)),
			);
		}
		if (displayedCurrent + delta >= displayedTotal - 1) {
			leftBound = Math.max(
				2,
				leftBound - (displayedCurrent + delta - (displayedTotal - 2)),
			);
		}

		if (leftBound > 2) {
			pages.push("...");
		}

		for (let i = leftBound; i <= rightBound; i++) {
			pages.push(i);
		}

		if (rightBound < displayedTotal - 1) {
			pages.push("...");
		}

		if (displayedTotal > 1) {
			pages.push(displayedTotal);
		}

		return pages;
	};

	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious
						onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
						className={
							currentPage <= 0
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>

				{getPageNumbers().map((displayPage, index) => (
					<PaginationItem key={index}>
						{displayPage === "..." ? (
							<PaginationEllipsis />
						) : (
							<PaginationLink
								onClick={() => onPageChange((displayPage as number) - 1)}
								isActive={displayPage === currentPage + 1}
							>
								{displayPage}
							</PaginationLink>
						)}
					</PaginationItem>
				))}

				<PaginationItem>
					<PaginationNext
						onClick={() =>
							currentPage < totalPages - 1 && onPageChange(currentPage + 1)
						}
						className={
							currentPage >= totalPages - 1
								? "pointer-events-none opacity-50"
								: "cursor-pointer"
						}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
};

export default PaginationWithEllipsis;
